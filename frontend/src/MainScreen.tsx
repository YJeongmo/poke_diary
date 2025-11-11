// frontend/src/MainScreen.tsx

import React from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';

interface MainScreenProps {
    onNavigate: (screen: 'encounter' | 'pokedex' | 'badges' | 'main' | 'diary_list' | 'diary_book') => void;
    onLogout: () => void;
    userEmail: string | null;
    imageType: string | null;
}

function MainScreen({ onNavigate, onLogout, userEmail, imageType }: MainScreenProps) {
    // 이미지 타입에 따라 일지 보기 버튼 이미지 결정
    const getDiaryImage = () => {
        if (!imageType) return null;
        
        switch (imageType) {
            case 'gardevoir':
                return 'http://localhost:8000/useImage/a_Gardevoir.png';
            case 'lucario':
                return 'http://localhost:8000/useImage/b_Lucario.png';
            case 'pretty':
                return 'http://localhost:8000/useImage/c_Pretty.png';
            default:
                return null;
        }
    };

    const diaryImage = getDiaryImage();
    const diaryBoxStyle = diaryImage 
        ? {
            backgroundImage: `url(${diaryImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '4px solid #ff8c00',
            borderRadius: '12px'
          }
        : {};

    // 도감과 뱃지 이미지 (모든 계정 공통)
    const pokedexImage = 'http://localhost:8000/useImage/poke_dex.webp';
    const badgeImage = 'http://localhost:8000/useImage/poke_badge.png';

    const pokedexBoxStyle = {
        backgroundImage: `url(${pokedexImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '4px solid #e74c3c',
        borderRadius: '12px'
    };

    const badgeBoxStyle = {
        backgroundImage: `url(${badgeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: '4px solid #9b59b6',
        borderRadius: '12px'
    };

    const backgroundStyle = getBackgroundStyle(imageType);

    return (
        <div className="main-screen-container" style={backgroundStyle}>
            <div className="main-header">
                <h1 className="trainer-name">{userEmail || '트레이너'}님</h1>
                <button onClick={onLogout} className="logout-button">로그아웃</button>
            </div>

            <div className="main-layout">
                <div 
                    className="diary-box" 
                    onClick={() => onNavigate('diary_book')}
                    style={diaryBoxStyle}
                >
                    {!diaryImage && <span className="diary-text">일지 보기</span>}
                </div>

                <div className="right-section">
                    <div 
                        className="pokedex-box" 
                        onClick={() => onNavigate('pokedex')}
                        style={pokedexBoxStyle}
                    >
                        <span className="pokedex-text" style={{ display: 'none' }}>도감</span>
                    </div>
                    <div 
                        className="badge-box" 
                        onClick={() => onNavigate('badges')}
                        style={badgeBoxStyle}
                    >
                        <span className="badge-text" style={{ display: 'none' }}>뱃지</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainScreen;