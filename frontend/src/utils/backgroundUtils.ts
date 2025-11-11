// frontend/src/utils/backgroundUtils.ts

import React from 'react';

/**
 * 이미지 타입에 따라 배경 이미지 URL을 반환합니다.
 * @param imageType - 사용자의 이미지 타입 (gardevoir, lucario, pretty)
 * @returns 배경 이미지 URL 또는 null
 */
export function getBackgroundImage(imageType: string | null): string | null {
    if (!imageType) return null;
    
    switch (imageType) {
        case 'gardevoir':
        case 'lucario':
            return 'http://localhost:8000/useImage/background_ab.png';
        case 'pretty':
            return 'http://localhost:8000/useImage/background_c.jpeg';
        default:
            return null;
    }
}

/**
 * 배경 이미지 스타일을 반환합니다.
 * @param imageType - 사용자의 이미지 타입
 * @returns 배경 이미지 스타일 객체
 */
export function getBackgroundStyle(imageType: string | null): React.CSSProperties {
    const backgroundImage = getBackgroundImage(imageType);
    
    if (!backgroundImage) {
        return {};
    }
    
    return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh',
        minHeight: '100vh'
    };
}

