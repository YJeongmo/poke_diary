// frontend/src/components/MainScreen.tsx
import React from 'react';
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
            case 'lucario':
                // UI 예시 이미지에는 책 표지가 보임. Gardevoir/Lucario 타입의 책 이미지로 설정
                return `${BASE_URL}/a_Gardevoir.png`;
            case 'pretty':
                // Pretty 타입의 책 이미지로 설정 (임시로 Lucario와 동일하게 설정)
                return `${BASE_URL}/b_Lucario.png`;
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
                    <h1 className="trainer-name">{userEmail || '트레이너'}님 ID표시</h1>
                    <button onClick={onLogout} className="logout-button">로그아웃</button>
                </div>

                <div className="main-layout">
                    {/* 모험 기록 버튼 (왼쪽 큰 책) */}
                    <button
                        className="image-button-box diary-button"
                        onClick={() => onNavigate('encounter')} // UI 예시에 맞춰 일지 작성(모험 기록)으로 바로 이동
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