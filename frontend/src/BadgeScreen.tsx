// frontend/src/BadgeScreen.tsx
import React, { useState, useEffect } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';
import type { Badge, ScreenName } from './types';

interface BadgeScreenProps {
    onNavigate: (screen: ScreenName) => void;
    userEmail: string | null;
    imageType: string | null;
}

function BadgeScreen({ onNavigate, imageType }: BadgeScreenProps) {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchBadges = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await api.get('/badges', token);
                setBadges(response.data.badges);
            } catch (error) {
                console.error("Failed to fetch badges:", error);
                // API 실패 시 임시 더미 데이터 (UI 예시와 유사하게)
                const BASE_IMG = 'http://localhost:8000/useImage';
                setBadges([
                    { id: "1", name: "포켓볼", description: "", image_url: `${BASE_IMG}/pokeball.png`, earned: true, earned_at: "2024-01-10" },
                    { id: "2", name: "슈퍼볼", description: "", image_url: `${BASE_IMG}/superball.png`, earned: true, earned_at: "2024-01-10" },
                    { id: "3", name: "마스터볼", description: "", image_url: `${BASE_IMG}/masterball.png`, earned: true, earned_at: "2024-01-10" },
                    { id: "4", name: "노말", description: "", image_url: `${BASE_IMG}/normal_badge.png`, earned: true, earned_at: "2024-01-10" },
                    { id: "5", name: "격투", description: "", image_url: `${BASE_IMG}/fighting_badge.png`, earned: false, earned_at: null },
                    { id: "6", name: "불꽃", description: "", image_url: `${BASE_IMG}/fire_badge.png`, earned: false, earned_at: null },
                    // ... 20개 정도 더미 데이터 추가
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, [token]);

    const backgroundStyle = getBackgroundStyle(imageType);

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <h2 className="page-title">뱃지</h2>

            <div className="overlay-wrapper badge-grid-area">
                {loading ? (
                    <div className="loading-spinner" />
                ) : (
                    <div className="badge-grid">
                        {badges.map(badge => (
                            <div
                                key={badge.id}
                                className={`badge-item ${badge.earned ? '' : 'locked'}`}
                            >
                                <div className="badge-icon">
                                    <img src={badge.image_url} alt={badge.name} />
                                </div>
                                <span className="badge-name">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BadgeScreen;