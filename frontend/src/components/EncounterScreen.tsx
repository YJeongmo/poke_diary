// frontend/src/components/EncounterScreen.tsx
import React, { useState, FormEvent, useRef } from 'react';
import { getBackgroundStyle } from '../utils/backgroundUtils';
import type { ScreenName } from '../types';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface EncounterScreenProps {
    onNavigate: (screen: ScreenName, id?: number) => void;
    userEmail: string | null;
    imageType: string | null;
}

function EncounterScreen({ onNavigate, imageType }: EncounterScreenProps) {
    const [file, setFile] = useState<File | null>(null);
    const [reflection, setReflection] = useState('');
    const [loading, setLoading] = useState(false);
    const [logId, setLogId] = useState<number | null>(null);
    const { token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 기록 후 화면 (이미지 6)으로 바로 이동
    if (logId) {
        return <DiaryDetailScreen logId={logId} onNavigate={onNavigate} imageType={imageType} />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file || !reflection.trim()) {
            alert('사진과 소감을 모두 입력해주세요.');
            return;
        }
        if (!token) return;

        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('user_reflection', reflection);

        setLoading(true);
        try {
            const response = await api.postMultipart('/encounter', formData, token);
            alert('조우 기록 성공! 일지를 확인합니다.');
            setLogId(response.data.log_id); // 기록 후 바로 상세 페이지로 이동
        } catch (error) {
            console.error("Encounter submission failed:", error);
            alert('기록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const backgroundStyle = getBackgroundStyle(imageType);
    const imagePreviewUrl = file ? URL.createObjectURL(file) : null;

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <div className="book-wrapper">
                <form className="book-ui" onSubmit={handleSubmit}>
                    <div className="book-spread">
                        {/* 왼쪽 페이지: 사진 미리보기 (이미지 5) */}
                        <div className="book-page book-page-left diary-upload-page">
                            <h3>오늘의 사진</h3>
                            <div className="image-preview">
                                {imagePreviewUrl ? (
                                    <img src={imagePreviewUrl} alt="Preview" />
                                ) : (
                                    <span>Diary Preview</span>
                                )}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="custom-file-input"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    파일 선택
                                </label>
                            </div>
                        </div>

                        {/* 오른쪽 페이지: 일지 작성 */}
                        <div className="book-page diary-upload-page">
                            <h3>나의 포켓몬 일지</h3>
                            <p style={{ fontSize: '14px', color: '#777' }}>{new Date().toLocaleDateString('ko-KR')}</p>

                            <div className="file-select-area">
                                <span>선택된 파일: {file ? file.name : '없음'}</span>
                            </div>

                            <textarea
                                className="reflection-textarea"
                                placeholder="오늘의 소감을 작성해 주세요."
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                required
                            />

                            <button type="submit" className="submit-log-button" disabled={loading}>
                                {loading ? '분석 및 기록 중...' : '기록 저장 및 포켓몬 조우'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 기록 후 화면 (이미지 6)
// EncounterScreen에 포함하여 재사용성을 높입니다.
function DiaryDetailScreen({ logId, onNavigate, imageType }: { logId: number, onNavigate: EncounterScreenProps['onNavigate'], imageType: string | null }) {
    const [detail, setDetail] = useState<DiaryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // API 미구현 이슈: 백엔드에 `/api/v1/logs/{log_id}`가 없으므로,
    // 임시 더미 데이터와 로딩 로직을 사용합니다.
    useEffect(() => {
        const fetchDetail = async () => {
             if (!token) return;
             try {
                 // 실제 API 호출 (백엔드 구현 후 사용)
                 // const response = await api.get(`/logs/${logId}`, token);
                 // setDetail(response.data as DiaryDetail);


                 setDetail(dummyDetail);
             } catch (error) {
                 console.error("Failed to fetch diary detail:", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchDetail();
    }, [logId, token]);

    const backgroundStyle = getBackgroundStyle(imageType);

    if (loading || !detail) {
        return <div className="screen-container" style={backgroundStyle}>
            <div className="book-wrapper"><div className="loading-spinner" /></div>
        </div>;
    }

    const { log_id, created_at, user_reflection, photo_url, pokemon } = detail;

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <div className="book-wrapper">
                <div className="book-ui">
                    {/* 페이지네이션 (임시) */}
                    <div className="book-navigation" style={{ position: 'absolute', top: '15px', color: '#333' }}>
                        페이지 7 / 8
                    </div>

                    <div className="book-spread" style={{ backgroundColor: '#fffaf0' }}>
                        {/* 왼쪽 페이지: 오늘의 사진 */}
                        <div className="book-page book-page-left">
                            <h3>오늘의 사진</h3>
                            <div className="log-image-display">
                                <img src={photo_url} alt="User Upload" />
                            </div>
                        </div>

                        {/* 오른쪽 페이지: 일지 내용 */}
                        <div className="book-page">
                            <h3>나의 포켓몬 일지</h3>
                            <p style={{ fontSize: '14px', color: '#777' }}>{new Date(created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</p>

                            <div className="pokemon-info">
                                <p style={{ fontWeight: 'normal', color: '#555' }}>조우 포켓몬</p>
                                <img src={pokemon.sprite_url} alt={pokemon.name} />
                                <p style={{ marginTop: '5px' }}>{pokemon.name} ({pokemon.type_1.split('/')[0]})</p>
                            </div>

                            <h4 style={{ fontSize: '16px', borderBottom: '1px dashed #ccc', paddingBottom: '5px', color: '#555' }}>오늘의 소감</h4>
                            <p className="reflection-content">{user_reflection}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EncounterScreen;