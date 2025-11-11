// frontend/src/BadgeScreen.tsx

import React, { useState, useEffect } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';

interface BadgeEntry {
    category: string;
    name: string;
    achieved: boolean;
    current: number;
    target: number;
    description?: string;
    badge_image?: string;
    type_key?: string;
}

interface BadgeData {
    total_unique_encountered: number;
    total_encounters_all: number;
    badges: BadgeEntry[];
}

interface BadgeScreenProps {
    onNavigate: (screen: 'encounter' | 'pokedex' | 'badges' | 'main') => void;
    imageType: string | null;
}

const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function BadgeScreen({ onNavigate, imageType }: BadgeScreenProps) {
    const backgroundStyle = getBackgroundStyle(imageType);
    const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    useEffect(() => {
        if (!token) {
            setError('인증 토큰이 없습니다. 로그인 상태를 확인해주세요.');
            setLoading(false);
            return;
        }

        const fetchBadges = async () => {
            try {
                // ⭐️⭐️⭐️ API 호출 로직 추가 (누락 해결) ⭐️⭐️⭐️
                const response = await fetch('http://localhost:8000/api/v1/badges', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || '뱃지 데이터를 불러오는 데 실패했습니다.');
                }

                const data: BadgeData = await response.json();

                if (data && data.badges) {
                    // 디버깅: 이미지 경로 확인
                    console.log('뱃지 데이터:', data);
                    console.log('이미지 경로 예시:', data.badges[0]?.badge_image);
                    setBadgeData(data);
                } else {
                    throw new Error("뱃지 데이터 형식이 올바르지 않습니다.");
                }

            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [token]);

    if (loading) return <p>뱃지 데이터를 로딩 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!badgeData) return <p>뱃지 데이터가 없습니다.</p>;

    // 뱃지 필터링 및 그룹화
    const encounterBadges = badgeData.badges.filter(b => b.category === '조우 마릿수');
    const typeBadges = badgeData.badges.filter(b => b.category === '타입 마스터');

    return (
        <div className="badge-screen-container" style={backgroundStyle}>
            <button onClick={() => onNavigate('main')} className="back-button">← 메인으로</button>

            {/* 뱃지함 박스: 배경 박스 안에 뱃지만 표시 */}
            <div className="badge-case">
                {/* 1) 도감 완성도: 1행 5개 */}
                <div className="badge-row encounter-row">
                    {encounterBadges.map((badge) => {
                        // 이미지 경로: 원본 경로를 그대로 사용 (Vite가 public 폴더를 자동 처리)
                        // 한글 파일명은 브라우저가 자동으로 처리하므로 인코딩하지 않음
                        const imageUrl = badge.badge_image || null;
                        
                        return (
                            <div key={badge.name} className={`badge-only ${badge.achieved ? 'achieved' : 'locked'}`} title={`${badge.name} ${badge.current}/${badge.target}`}>
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={badge.name}
                                        onError={(e) => {
                                            console.error('이미지 로딩 실패:', imageUrl);
                                            console.error('요청한 URL:', e.currentTarget.src);
                                            // 대체 이미지 표시
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={() => {
                                            console.log('이미지 로딩 성공:', imageUrl);
                                        }}
                                    />
                                ) : (
                                    <span>🏆</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 2) 타입 마스터: 3행(6,6,5) */}
                <div className="type-grid-3rows">
                    {typeBadges.map((badge) => {
                        // 이미지 경로: 원본 경로를 그대로 사용 (Vite가 public 폴더를 자동 처리)
                        // 한글 파일명은 브라우저가 자동으로 처리하므로 인코딩하지 않음
                        const imageUrl = badge.badge_image || null;
                        
                        return (
                            <div key={badge.name} className={`badge-only ${badge.achieved ? 'achieved' : 'locked'}`} title={`${badge.name} ${badge.current}/${badge.target}`}>
                                {imageUrl ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={badge.name}
                                        onError={(e) => {
                                            console.error('이미지 로딩 실패:', imageUrl);
                                            console.error('요청한 URL:', e.currentTarget.src);
                                            // 대체 이미지 표시
                                            e.currentTarget.style.display = 'none';
                                        }}
                                        onLoad={() => {
                                            console.log('이미지 로딩 성공:', imageUrl);
                                        }}
                                    />
                                ) : (
                                    <span>★</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BadgeScreen;