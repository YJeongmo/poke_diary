// frontend/src/utils/backgroundUtils.ts
import type React from 'react';

// 정적 이미지 기본 경로 (배경용)
// VITE_ASSET_BASE_URL이 없으면 로컬 개발용 경로로 대체
const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL || 'http://localhost:8000/useImage';

/**
 * 사용자 image_type에 따라 배경 이미지 URL을 반환합니다.
 */
function getBackgroundImage(imageType: string | null): string | null {
    if (!imageType) return null;

    switch (imageType.toLowerCase()) {
        case 'gardevoir':
        case 'lucario':
            return `${ASSET_BASE_URL}/background_ab.png`;
        case 'pretty':
            return `${ASSET_BASE_URL}/background_c.jpeg`;
        default:
            return null;
    }
}

/**
 * 배경 이미지 스타일을 반환합니다.
 * cover를 통해 컨테이너를 꽉 채우고, fixed는 제거하여 스케일링에 맞춰 움직입니다.
 */
export function getBackgroundStyle(imageType: string | null): React.CSSProperties {
    const backgroundImage = getBackgroundImage(imageType);

    if (!backgroundImage) {
        return { backgroundColor: '#333' }; // 이미지가 없을 때 기본 배경색 (UI 공통 배경색)
    }

    return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };
}