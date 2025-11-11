// frontend/src/DiaryLog.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getBackgroundStyle } from './utils/backgroundUtils';

interface DiaryDetail {
    log_id: number;
    created_at: string;
    user_reflection: string;
    photo_url: string;
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

interface DiaryLogProps {
    onNavigate: (screen: 'main' | 'diary_list') => void;
    // App.tsx에서 전달받는 현재 선택된 logId (URL 파라미터처럼 사용)
    logId: number | null;
    imageType: string | null;
}

const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function DiaryLog({ onNavigate, logId, imageType }: DiaryLogProps) {
    const backgroundStyle = getBackgroundStyle(imageType);
    const [currentLog, setCurrentLog] = useState<DiaryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    // ⭐️ API 호출: 선택된 logId의 상세 기록을 가져옴 ⭐️
    useEffect(() => {
        if (!logId || !token) {
            setError('기록 ID 또는 인증 토큰이 유효하지 않습니다.');
            setLoading(false);
            return;
        }

        const fetchLogDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/logs/${logId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 404) {
                    throw new Error("해당 기록을 찾을 수 없거나 접근 권한이 없습니다.");
                }
                if (!response.ok) {
                     const errorData = await response.json();
                     throw new Error(errorData.detail || '기록 상세 정보를 불러오는 데 실패했습니다.');
                }

                const data: DiaryDetail = await response.json();
                setCurrentLog(data);

            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLogDetail();
    }, [logId, token]);

    // 🎯 TODO: 페이지네이션 로직은 다음 단계에서 구현 (이전/다음 버튼)
    // 현재는 단일 로그 상세만 표시

    if (loading) return <p className="loading-message">📖 다이어리 로딩 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!currentLog) return <p>상세 기록이 존재하지 않습니다.</p>;

    return (
        <div className="diary-log-wrapper" style={backgroundStyle}>
            <button onClick={() => onNavigate('diary_list')} className="back-button">← 목록으로</button>

            {/* ⭐️ 책 형식 UI 컨테이너 ⭐️ */}
            <div className="diary-book-container">
                <header className="book-header">
                    <h2>{format(new Date(currentLog.created_at), 'yyyy년 MM월 dd일')}의 기록</h2>
                </header>

                <div className="book-page">
                    {/* 1. 좌측 상단: 업로드한 사진 */}
                    <div className="photo-section">
                        {/* 🎯 TODO: photo_url은 현재 'TODO'이므로, 임시로 로고 표시 또는 실제 이미지 URL 사용 */}
                        <img
                            src="https://via.placeholder.com/250x250?text=Your+Photo"
                            alt="Uploaded Log Photo"
                            className="uploaded-photo"
                        />
                        <p className="analysis-summary">
                            **{currentLog.analysis.location}**에서 **{currentLog.analysis.environment}** ({currentLog.analysis.time})
                        </p>
                    </div>

                    {/* 2. 우측 상단: 조우 포켓몬 */}
                    <div className="pokemon-section">
                        <h3>조우 포켓몬</h3>
                        <img
                            src={currentLog.pokemon.sprite_url}
                            alt={currentLog.pokemon.name}
                            className="pokemon-sprite"
                        />
                        <p className="pokemon-name-large">
                            **{currentLog.pokemon.name}** ({currentLog.pokemon.type_1})
                        </p>
                    </div>
                </div>

                {/* 3. 중앙 하단: 일지 소감 */}
                <div className="reflection-section">
                    <h3>오늘의 소감</h3>
                    <p className="reflection-text">{currentLog.user_reflection}</p>
                </div>

                {/* 🎯 TODO: 페이지네이션 컨트롤 (이전/다음 기록)은 여기에 추가 */}
            </div>

        </div>
    );
}

export default DiaryLog;