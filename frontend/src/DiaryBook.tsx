// frontend/src/DiaryBook.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { getBackgroundStyle } from './utils/backgroundUtils';

interface DiaryBookProps {
    onNavigate: (screen: 'main' | 'diary_book' | 'pokedex' | 'badges' | 'encounter' | 'diary_list') => void;
    imageType: string | null;
}

// 목록 아이템(요약)
interface LogListItem {
    id: number;
    created_at: string;
    user_reflection_snippet: string;
    pokemon_name: string;
    pokemon_sprite: string;
    location: string;
}

// 상세 아이템
interface DiaryDetail {
    log_id: number;
    created_at: string;
    user_reflection: string;
    photo_url: string | null;
    analysis: {
        location: string;
        environment: string;
        time: string;
        season: string;
    };
    pokemon: {
        name: string;
        sprite_url: string;
        type_1: string;
        poke_id: number;
    };
}

const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function DiaryBook({ onNavigate, imageType }: DiaryBookProps) {
    const backgroundStyle = getBackgroundStyle(imageType);
    const [logs, setLogs] = useState<LogListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 0 = 신규 작성 페이지, 1..N = logs[0..N-1]
    const [pageIndex, setPageIndex] = useState(0);

    // 상세 캐시
    const [detailCache, setDetailCache] = useState<Record<number, DiaryDetail>>({});
    const token = useMemo(() => localStorage.getItem(AUTH_TOKEN_KEY), []);

    // 목록 불러오기
    useEffect(() => {
        if (!token) {
            setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
            setLoading(false);
            return;
        }
        const fetchLogs = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/logs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    throw new Error('일지 목록을 불러오는 데 실패했습니다.');
                }
                const data: LogListItem[] = await res.json();
                // 백엔드가 최신순으로 주므로, 오래된 순(1페이지=가장 옛날)으로 정렬
                const ascending = [...data].reverse();
                setLogs(ascending);
                // 최초 진입 시 마지막 페이지(작성 페이지)로 이동
                setPageIndex(ascending.length);
            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    // 특정 페이지의 상세 불러오기 (pageIndex > 0 일 때)
    useEffect(() => {
        const fetchDetailIfNeeded = async () => {
            if (pageIndex >= logs.length || !token) return; // 작성 페이지거나 토큰 없음
            const log = logs[pageIndex];
            if (!log) return;
            if (detailCache[log.id]) return; // 캐시 있음
            try {
                const res = await fetch(`http://localhost:8000/api/v1/logs/${log.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    throw new Error('일지 상세를 불러오는 데 실패했습니다.');
                }
                const data: DiaryDetail = await res.json();
                setDetailCache((prev) => ({ ...prev, [log.id]: data }));
            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            }
        };
        fetchDetailIfNeeded();
    }, [pageIndex, logs, token, detailCache]);

    // 작성 상태
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [reflection, setReflection] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setSubmitError('인증 토큰이 없습니다.');
            return;
        }
        if (!imageFile || !reflection) {
            setSubmitError('사진과 소감을 입력해주세요.');
            return;
        }
        setSubmitLoading(true);
        setSubmitError(null);
        try {
            const formData = new FormData();
            formData.append('image_file', imageFile);
            formData.append('user_reflection', reflection);
            const res = await fetch('http://localhost:8000/api/v1/encounter', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || '일지 작성에 실패했습니다.');
            }
            // 성공 시: 최신 목록으로 갱신하고 바로 이전 페이지(가장 최근 기록)로 이동
            const newListRes = await fetch('http://localhost:8000/api/v1/logs', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newList: LogListItem[] = await newListRes.json();
            const ascending = [...newList].reverse();
            setLogs(ascending);
            setImageFile(null);
            setReflection('');
            // 작성 완료 후에도 마지막 페이지(작성 페이지)로 이동
            setPageIndex(ascending.length);
        } catch (err) {
            setSubmitError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const canGoPrev = pageIndex > 0;
    const canGoNext = pageIndex < logs.length;

    const goPrev = () => {
        if (!canGoPrev) return;
        setPageIndex((i) => Math.max(0, i - 1));
    };
    const goNext = () => {
        if (!canGoNext) return;
        setPageIndex((i) => Math.min(logs.length, i + 1));
    };

    if (loading) return <p>일지를 불러오는 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // 렌더링: 책 모양의 좌/우 네비게이션
    return (
        <div className="diary-book-container" style={backgroundStyle}>
            <div className="diary-book-header">
                <button onClick={() => onNavigate('main')} className="back-button">← 메인으로</button>
            </div>

            <div className="book-spread-wrapper" style={{
                backgroundImage: 'url(http://localhost:8000/useImage/편책.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                width: '100%',
                flex: 1,
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '50px 30px 30px 30px', /* 상하좌우 여백 조정 */
                boxSizing: 'border-box'
            }}>
                <div className="book-nav-center">
                    <span>페이지 {pageIndex + 1} / {Math.max(1, logs.length + 1)}</span>
                </div>

                <div className="book-spread" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, width: '100%', height: '100%', position: 'relative', maxHeight: '100%', paddingTop: '20px' }}>
                    {/* LEFT PAGE: 이미지 전용 */}
                    <div
                        className="book-page-left"
                        style={{ 
                            padding: '40px 25px 25px 25px', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            boxSizing: 'border-box',
                            position: 'relative'
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '1.4em', 
                            fontWeight: 'bold', 
                            marginBottom: '20px',
                            marginTop: '0',
                            textDecoration: 'underline',
                            textDecorationStyle: 'dotted',
                            textDecorationColor: '#e74c3c',
                            textUnderlineOffset: '8px',
                            textAlign: 'center',
                            width: '100%'
                        }}>오늘의 사진</h3>
                        <div className="page-content" style={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7ef', borderRadius: 8, padding: '20px', boxSizing: 'border-box', overflow: 'hidden' }}>
                            {pageIndex === logs.length ? (
                                <img
                                    src={imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/300x380?text=Diary+Photo'}
                                    alt="Diary Preview"
                                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }}
                                />
                            ) : (
                                (() => {
                                    const item = logs[pageIndex];
                                    const detail = item ? detailCache[item.id] : undefined;
                                    if (!item) return <span />;
                                    if (!detail) return <span>이미지 로딩 중...</span>;
                                    return (
                                        <img
                                            src={detail.photo_url || 'https://via.placeholder.com/300x380?text=Diary+Photo'}
                                            alt="Diary"
                                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }}
                                        />
                                    );
                                })()
                            )}
                        </div>
                        <button 
                            onClick={goPrev} 
                            disabled={!canGoPrev}
                            style={{
                                position: 'absolute',
                                left: '-15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '8px 12px',
                                background: '#f9f9f9',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                                opacity: canGoPrev ? 1 : 0.5,
                                fontSize: '0.85em',
                                zIndex: 5,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            이전
                        </button>
                    </div>

                    {/* RIGHT PAGE: 콘텐츠 전용 */}
                    <div
                        className="book-page-right"
                        style={{ 
                            padding: '40px 25px 25px 25px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            position: 'relative'
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '1.4em', 
                            fontWeight: 'bold', 
                            marginBottom: '20px',
                            marginTop: '0',
                            textAlign: 'center',
                            width: '100%'
                        }}>나의 포켓몬 일지</h3>
                        <div className="page-content" style={{ width: '100%', flex: 1, minHeight: 0, background: '#fffef8', borderRadius: 8, padding: '20px', overflow: 'auto', boxSizing: 'border-box' }}>
                            {pageIndex === logs.length ? (
                                <div className="write-page">
                                    <h4 style={{ marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>📝</span> 오늘의 일지 작성
                                    </h4>
                                    <div style={{ marginBottom: '16px', color: '#555' }}>
                                        {format(new Date(), 'yyyy.MM.dd')}
                                    </div>
                                    <form onSubmit={handleSubmit} className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required />
                                        </div>
                                        <div>
                                            <textarea
                                                value={reflection}
                                                onChange={(e) => setReflection(e.target.value)}
                                                placeholder="오늘의 소감을 작성해 주세요."
                                                rows={8}
                                                required
                                                style={{ width: '100%', resize: 'vertical', minHeight: '150px' }}
                                            />
                                        </div>
                                        <button type="submit" disabled={submitLoading} style={{ marginTop: '8px' }}>
                                            {submitLoading ? '작성 중...' : '기록 저장 및 포켓몬 조우'}
                                        </button>
                                        {submitError && <p style={{ color: 'red', marginTop: '8px' }}>{submitError}</p>}
                                    </form>
                                </div>
                        ) : (
                            (() => {
                                const item = logs[pageIndex];
                                const detail = item ? detailCache[item.id] : undefined;
                                if (!item) return <p>기록이 없습니다.</p>;
                                if (!detail) return <p>상세를 불러오는 중...</p>;
                                return (
                                    <div className="detail-page">
                                        <div style={{ marginBottom: 8, color: '#555' }}>
                                            {format(new Date(detail.created_at), 'yyyy.MM.dd')}
                                        </div>
                                        <div className="pokemon-section">
                                            <h3>조우 포켓몬</h3>
                                            <img
                                                src={detail.pokemon.sprite_url}
                                                alt={detail.pokemon.name}
                                                className="pokemon-sprite"
                                                style={{ width: 120, height: 120 }}
                                            />
                                            <p className="pokemon-name-large">
                                                <strong>{detail.pokemon.name}</strong> ({detail.pokemon.type_1})
                                            </p>
                                        </div>
                                        <div className="analysis-summary" style={{ marginTop: 12 }}>
                                            <strong>{detail.analysis.location}</strong> / {detail.analysis.environment} / {detail.analysis.time} / {detail.analysis.season}
                                        </div>
                                        <div className="reflection-section" style={{ marginTop: 16 }}>
                                            <h3>오늘의 소감</h3>
                                            <p className="reflection-text">{detail.user_reflection}</p>
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                        </div>
                        <button 
                            onClick={goNext} 
                            disabled={!canGoNext}
                            style={{
                                position: 'absolute',
                                right: '-15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '8px 12px',
                                background: '#f9f9f9',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: canGoNext ? 'pointer' : 'not-allowed',
                                opacity: canGoNext ? 1 : 0.5,
                                fontSize: '0.85em',
                                zIndex: 5,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiaryBook;

