// frontend/src/BadgeScreen.tsx
import { useState, useEffect } from 'react';
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
                // 백엔드 응답 구조에 맞춰 변환
                const badgeData = response.data.badges || [];
                const transformedBadges = badgeData.map((badge: any) => ({
                    id: badge.name || badge.id,
                    name: badge.name,
                    description: badge.description || '',
                    image_url: badge.badge_image || badge.image_url,
                    earned: badge.achieved !== undefined ? badge.achieved : badge.earned,
                    earned_at: badge.earned_at || null,
                }));
                
                // 볼류 뱃지 5개를 먼저, 그 다음 타입별 뱃지 정렬
                const ballBadgeOrder = ['몬스터볼', '프리미어볼', '슈퍼볼', '하이퍼볼', '마스터볼'];
                const ballBadges = transformedBadges.filter((b: Badge) => ballBadgeOrder.includes(b.name));
                const typeBadges = transformedBadges.filter((b: Badge) => !ballBadgeOrder.includes(b.name));
                
                // 볼류 뱃지를 올바른 순서로 정렬
                const sortedBallBadges = ballBadgeOrder
                    .map(name => ballBadges.find((b: Badge) => b.name === name))
                    .filter(Boolean) as Badge[];
                
                const sortedBadges = [...sortedBallBadges, ...typeBadges];
                
                setBadges(sortedBadges);
            } catch (error) {
                console.error("Failed to fetch badges:", error);
                // API 실패 시 임시 더미 데이터 (UI 예시와 유사하게)
                const BASE_IMG =
                    import.meta.env.VITE_ASSET_BASE_URL || 'http://localhost:8000/useImage';
                setBadges([
                    { id: "몬스터볼", name: "몬스터볼", description: "", image_url: `${BASE_IMG}/monster_ball.webp`, earned: true, earned_at: "2024-01-10" },
                    { id: "프리미어볼", name: "프리미어볼", description: "", image_url: `${BASE_IMG}/premier_ball.webp`, earned: true, earned_at: "2024-01-10" },
                    { id: "슈퍼볼", name: "슈퍼볼", description: "", image_url: `${BASE_IMG}/super_ball.webp`, earned: false, earned_at: null },
                    { id: "하이퍼볼", name: "하이퍼볼", description: "", image_url: `${BASE_IMG}/hyper_ball.webp`, earned: false, earned_at: null },
                    { id: "마스터볼", name: "마스터볼", description: "", image_url: `${BASE_IMG}/master_ball.webp`, earned: false, earned_at: null },
                    { id: "풀 타입 마스터", name: "풀 타입 마스터", description: "", image_url: `${BASE_IMG}/type/풀.svg`, earned: false, earned_at: null },
                    { id: "불꽃 타입 마스터", name: "불꽃 타입 마스터", description: "", image_url: `${BASE_IMG}/type/불꽃.svg`, earned: false, earned_at: null },
                    { id: "물 타입 마스터", name: "물 타입 마스터", description: "", image_url: `${BASE_IMG}/type/물.svg`, earned: false, earned_at: null },
                    { id: "전기 타입 마스터", name: "전기 타입 마스터", description: "", image_url: `${BASE_IMG}/type/전기.svg`, earned: false, earned_at: null },
                    { id: "얼음 타입 마스터", name: "얼음 타입 마스터", description: "", image_url: `${BASE_IMG}/type/얼음.svg`, earned: false, earned_at: null },
                    { id: "격투 타입 마스터", name: "격투 타입 마스터", description: "", image_url: `${BASE_IMG}/type/격투.svg`, earned: false, earned_at: null },
                    { id: "독 타입 마스터", name: "독 타입 마스터", description: "", image_url: `${BASE_IMG}/type/독.svg`, earned: false, earned_at: null },
                    { id: "땅 타입 마스터", name: "땅 타입 마스터", description: "", image_url: `${BASE_IMG}/type/땅.svg`, earned: false, earned_at: null },
                    { id: "비행 타입 마스터", name: "비행 타입 마스터", description: "", image_url: `${BASE_IMG}/type/비행.svg`, earned: false, earned_at: null },
                    { id: "바위 타입 마스터", name: "바위 타입 마스터", description: "", image_url: `${BASE_IMG}/type/바위.svg`, earned: false, earned_at: null },
                    { id: "강철 타입 마스터", name: "강철 타입 마스터", description: "", image_url: `${BASE_IMG}/type/강철.svg`, earned: false, earned_at: null },
                    { id: "노말 타입 마스터", name: "노말 타입 마스터", description: "", image_url: `${BASE_IMG}/type/노말.svg`, earned: false, earned_at: null },
                    { id: "벌레 타입 마스터", name: "벌레 타입 마스터", description: "", image_url: `${BASE_IMG}/type/벌레.svg`, earned: false, earned_at: null },
                    { id: "고스트 타입 마스터", name: "고스트 타입 마스터", description: "", image_url: `${BASE_IMG}/type/고스트.svg`, earned: false, earned_at: null },
                    { id: "드래곤 타입 마스터", name: "드래곤 타입 마스터", description: "", image_url: `${BASE_IMG}/type/드래곤.svg`, earned: false, earned_at: null },
                    { id: "악 타입 마스터", name: "악 타입 마스터", description: "", image_url: `${BASE_IMG}/type/악.svg`, earned: false, earned_at: null },
                    { id: "에스퍼 타입 마스터", name: "에스퍼 타입 마스터", description: "", image_url: `${BASE_IMG}/type/에스퍼.svg`, earned: false, earned_at: null },
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
            <button className="back-button badge-back-button" onClick={() => onNavigate('main')}>← 메인으로</button>

            <div className="overlay-wrapper badge-grid-area">
                {loading ? (
                    <div className="loading-spinner" />
                ) : (
                    <div className="badge-grid">
                        {badges.map(badge => {
                            const ballBadgeOrder = ['몬스터볼', '프리미어볼', '슈퍼볼', '하이퍼볼', '마스터볼'];
                            const isBallBadge = ballBadgeOrder.includes(badge.name);
                            const displayName = isBallBadge ? `${badge.name} 등급` : badge.name;
                            return (
                                <div
                                    key={badge.id}
                                    className={`badge-item ${badge.earned ? '' : 'locked'}`}
                                >
                                    <div className="badge-icon">
                                        <img src={badge.image_url} alt={badge.name} />
                                    </div>
                                    <span className="badge-name">{displayName}</span>
                                    {badge.description && (
                                        <span className="badge-description">
                                            {badge.description}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BadgeScreen;