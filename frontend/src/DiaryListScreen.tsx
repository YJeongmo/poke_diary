// frontend/src/DiaryListScreen.tsx
import { useState, useEffect, useRef } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';
import type { LogEntry, ScreenName, DiaryDetail } from './types';
import { format } from 'date-fns';

interface DiaryListScreenProps {
    onNavigate: (screen: ScreenName, id?: number) => void;
    userEmail: string | null;
    imageType: string | null;
}

// 백엔드 API의 origin (정적 업로드 이미지 prefix로 사용)
// 예: VITE_API_URL=http://localhost:8000/api/v1  -> origin: http://localhost:8000
const API_ORIGIN = new URL(
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
).origin;

function DiaryListScreen({ onNavigate, imageType }: DiaryListScreenProps) {
    console.log('DiaryListScreen: Component mounted!');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();
    console.log('DiaryListScreen: token exists?', !!token);

    // 0..N-1 = 기록 후 페이지, N = 기록 작성 페이지
    const [pageIndex, setPageIndex] = useState(0);

    // 상세 캐시
    const [detailCache, setDetailCache] = useState<Record<number, DiaryDetail>>({});

    // 목록 불러오기 (1113_기능완료와 동일한 로직)
    useEffect(() => {
        if (!token) {
            setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            try {
                setLoading(true);
                console.log('DiaryListScreen: Fetching logs...');
                // 페이지네이션 없이 모든 로그 가져오기 (현재 백엔드는 List[LogListItem] 직접 반환)
                const response = await api.get('/logs', token);
                console.log('DiaryListScreen: API response:', response.data);
                // 백엔드가 List[LogListItem]을 직접 반환하므로 배열로 처리
                const logItems: LogEntry[] = Array.isArray(response.data) ? response.data : [];
                console.log('DiaryListScreen: Parsed logItems:', logItems);
                // 백엔드가 최신순으로 주므로, 오래된 순(1페이지=가장 옛날)으로 정렬
                const ascending = [...logItems].reverse();
                setLogs(ascending);
                // 최초 진입 시 마지막 페이지(작성 페이지)로 이동
                setPageIndex(ascending.length);
                console.log('DiaryListScreen: Set pageIndex to', ascending.length);
            } catch (err) {
                console.error('DiaryListScreen: Error fetching logs:', err);
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [token]);

    // 특정 페이지의 상세 불러오기 (pageIndex < logs.length 일 때)
    useEffect(() => {
        const fetchDetailIfNeeded = async () => {
            // 작성 페이지(pageIndex === logs.length)이거나 토큰 없으면 리턴
            if (pageIndex >= logs.length || !token || logs.length === 0) {
                console.log('DiaryListScreen: Skipping detail fetch - pageIndex:', pageIndex, 'logs.length:', logs.length);
                return;
            }
            const log = logs[pageIndex];
            if (!log) {
                console.log('DiaryListScreen: No log at pageIndex:', pageIndex);
                return;
            }
            if (detailCache[log.id]) {
                console.log('DiaryListScreen: Detail already cached for log.id:', log.id);
                return; // 캐시 있음
            }

            console.log('DiaryListScreen: Fetching detail for log.id:', log.id);
            try {
                const response = await api.get(`/logs/${log.id}`, token);
                const data: DiaryDetail = response.data;
                setDetailCache((prev) => ({ ...prev, [log.id]: data }));
            } catch (err) {
                console.error("Failed to fetch diary detail:", err);
            }
        };

        fetchDetailIfNeeded();
    }, [pageIndex, logs, token, detailCache]);

    // 작성 상태
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [reflection, setReflection] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setSubmitError('인증 토큰이 없습니다.');
            return;
        }
        if (!imageFile || !reflection.trim()) {
            setSubmitError('사진과 소감을 입력해주세요.');
            return;
        }

        setSubmitLoading(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('image_file', imageFile);
            formData.append('user_reflection', reflection);

            await api.postMultipart('/encounter', formData, token);
            // 성공 시: 최신 목록으로 갱신하고 마지막 페이지(작성 페이지)로 이동
            const newListResponse = await api.get('/logs', token);
            const newLogItems: LogEntry[] = Array.isArray(newListResponse.data) ? newListResponse.data : [];
            const ascending = [...newLogItems].reverse();
            setLogs(ascending);
            setImageFile(null);
            setReflection('');
            // 작성 완료 후에도 마지막 페이지(작성 페이지)로 이동
            setPageIndex(ascending.length);
        } catch (err: any) {
            // 백엔드에서 전달한 상세 메시지가 있으면 그대로 표시
            const detail =
                err?.response?.data?.detail ||
                (err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            setSubmitError(detail);
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

    // 드래그 앤 드롭 핸들러
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setImageFile(file);
            } else {
                setSubmitError('이미지 파일만 업로드 가능합니다.');
            }
        }
    };

    const backgroundStyle = getBackgroundStyle(imageType);

    console.log('DiaryListScreen: Render - loading:', loading, 'error:', error, 'logs.length:', logs.length, 'pageIndex:', pageIndex);

    if (loading) {
        return (
            <div className="screen-container" style={backgroundStyle}>
                <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="screen-container" style={backgroundStyle}>
                <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
                <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>

            <div className="diary-book-wrapper">
                {/* 이전 버튼 - 화면 좌측 중간 */}
                <button
                    onClick={goPrev}
                    disabled={!canGoPrev}
                    className="book-nav-button book-nav-button-left"
                >
                    이전
                </button>

                <div className="book-ui">
                    {/* 페이지 번호 표시 */}
                    <div className="book-navigation">
                        페이지 {pageIndex + 1} / {Math.max(1, logs.length + 1)}
                    </div>

                    <div className="book-spread">
                        {/* 왼쪽 페이지: 오늘의 사진 */}
                        <div className="book-page book-page-left">
                            <h3>오늘의 사진</h3>
                            <div className="log-image-display">
                                {pageIndex === logs.length ? (
                                    // 기록 작성 페이지
                                    imageFile ? (
                                        <img
                                            src={URL.createObjectURL(imageFile)}
                                            alt="Diary Preview"
                                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                            Diary Preview
                                        </div>
                                    )
                                ) : (
                                    // 기록 후 페이지
                                    (() => {
                                        const item = logs[pageIndex];
                                        const detail = item ? detailCache[item.id] : undefined;
                                        if (!item) return <span />;
                                        if (!detail) return <span>이미지 로딩 중...</span>;
                                        const imageUrl = detail.photo_url
                                            ? detail.photo_url.startsWith('http')
                                                ? detail.photo_url
                                                : `${API_ORIGIN}${detail.photo_url}`
                                            : null;
                                        return imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="Diary"
                                                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                                이미지 없음
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>

                        {/* 오른쪽 페이지: 일지 내용 */}
                        <div className="book-page">
                            <h3>나의 포켓몬 일지</h3>
                            <div className="page-content">
                                {pageIndex === logs.length ? (
                                    // 기록 작성 페이지
                                    <div className="write-page">
                                        <h4 style={{ marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>📝</span> 오늘의 일지 작성
                                        </h4>
                                        <div style={{ marginBottom: '16px', color: '#555' }}>
                                            {format(new Date(), 'yyyy.MM.dd')}
                                        </div>
                                        <form onSubmit={handleSubmit} className="form-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                style={{
                                                    border: `2px dashed ${isDragging ? '#3498db' : '#ccc'}`,
                                                    borderRadius: '8px',
                                                    padding: '12px 16px',
                                                    textAlign: 'center',
                                                    backgroundColor: isDragging ? '#f0f8ff' : 'transparent',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    width: 'fit-content'
                                                }}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                    style={{ display: 'none' }}
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="custom-file-input"
                                                    style={{ cursor: 'pointer', display: 'inline-block', margin: 0 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    파일선택
                                                </label>
                                                <span style={{ fontSize: '14px', color: '#666' }}>
                                                    혹은 드래그
                                                </span>
                                            </div>
                                            {imageFile && (
                                                <div style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
                                                    선택된 파일: {imageFile.name}
                                                </div>
                                            )}
                                            <div>
                                                <textarea
                                                    value={reflection}
                                                    onChange={(e) => setReflection(e.target.value)}
                                                    placeholder="오늘의 소감을 작성해 주세요."
                                                    rows={8}
                                                    required
                                                    className="reflection-textarea"
                                                    style={{ width: '100%', resize: 'vertical', minHeight: '150px' }}
                                                />
                                            </div>
                                            <button type="submit" disabled={submitLoading} className="submit-log-button">
                                                {submitLoading ? '작성 중...' : '기록 저장 및 포켓몬 조우'}
                                            </button>
                                            {submitError && <p style={{ color: 'red', marginTop: '8px' }}>{submitError}</p>}
                                        </form>
                                    </div>
                                ) : (
                                    // 기록 후 페이지
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
                                                        style={{ width: 150, height: 150 }}
                                                    />
                                                    <p className="pokemon-name-large">
                                                        <strong>{detail.pokemon.name}</strong> ({detail.pokemon.type_1})
                                                    </p>
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
                        </div>
                    </div>
                </div>

                {/* 다음 버튼 - 화면 우측 중간 */}
                <button
                    onClick={goNext}
                    disabled={!canGoNext}
                    className="book-nav-button book-nav-button-right"
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default DiaryListScreen;
