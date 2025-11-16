// frontend/src/components/MainScreen.tsx
import { getBackgroundStyle } from '../utils/backgroundUtils';
import type { ScreenName } from '../types';

// 이미지 URL 상수
const BASE_URL = 'http://localhost:8000/useImage';
const POKEDEX_IMAGE = `${BASE_URL}/poke_dex.webp`;
const BADGE_IMAGE = `${BASE_URL}/poke_badge.png`;

interface MainScreenProps {
    onNavigate: (screen: ScreenName) => void;
    onLogout: () => void;
    userEmail: string | null;
    imageType: string | null;
}

function MainScreen({ onNavigate, onLogout, userEmail, imageType }: MainScreenProps) {

    // 일지 버튼 이미지 결정
    const getDiaryButtonImage = () => {
        if (!imageType) return null;

        switch (imageType.toLowerCase()) {
            case 'gardevoir':
                // Gardevoir 타입: A_Gardevoir 이미지 사용
                return `${BASE_URL}/A_Gardevoir.png`;
            case 'lucario':
                // Lucario 타입: b_Lucario 이미지 사용
                return `${BASE_URL}/b_Lucario.png`;
            case 'pretty':
                // Pretty 타입: c_Pretty 이미지 사용
                return `${BASE_URL}/c_Pretty.png`;
            default:
                return null;
        }
    };

    const diaryImage = getDiaryButtonImage();

    // 이미지 버튼 스타일 (인라인으로 배경 이미지 URL과 테두리만 설정)
    const diaryBoxStyle = diaryImage
        ? { backgroundImage: `url(${diaryImage})` } : {};

    const pokedexBoxStyle = {
        backgroundImage: `url(${POKEDEX_IMAGE})`,
    };

    const badgeBoxStyle = {
        backgroundImage: `url(${BADGE_IMAGE})`,
    };

    const backgroundStyle = getBackgroundStyle(imageType);

    return (
        // MainScreen은 이제 .App 컨테이너 안에서 실행됩니다 (App.tsx에서 제공)
        <div className="screen-container main-screen-container" style={backgroundStyle}>
                <div className="main-header">
                    <h1 className="trainer-name">{userEmail || '트레이너'}님 </h1>
                    <button onClick={onLogout} className="logout-button">로그아웃</button>
                </div>

                <div className="main-layout">
                    {/* 모험 기록 버튼 (왼쪽 큰 책) */}
                    <button
                        className="image-button-box diary-button"
                        onClick={() => onNavigate('diary_list')} // 모험 기록 화면으로 이동
                        style={diaryBoxStyle}
                    >
                        모험 기록
                    </button>

                    <div className="right-section">
                        {/* 도감 보기 (오른쪽 위) */}
                        <button
                            className="image-button-box pokedex-button"
                            onClick={() => onNavigate('pokedex')}
                            style={pokedexBoxStyle}
                        >
                            도감 보기
                        </button>
                        {/* 뱃지 보기 (오른쪽 아래) */}
                        <button
                            className="image-button-box badge-button"
                            onClick={() => onNavigate('badges')}
                            style={badgeBoxStyle}
                        >
                            뱃지 보기
                        </button>
                    </div>
                </div>
            </div>
    );
}

export default MainScreen;