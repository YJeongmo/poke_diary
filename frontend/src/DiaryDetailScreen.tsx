// frontend/src/DiaryDetailScreen.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBackgroundStyle } from './utils/backgroundUtils';
import { useAuth } from './hooks/useAuth';
import type { DiaryDetail, ScreenName } from './types';
import { format } from 'date-fns';

interface DiaryDetailScreenProps {
    onNavigate: (screen: ScreenName) => void;
    userEmail: string | null;
    imageType: string | null;
}

// 이 컴포넌트는 UI 이미지 6 ('모험 기록 - 기록 후')와 유사합니다.
function DiaryDetailScreen({ onNavigate, imageType }: DiaryDetailScreenProps) {
    const { logId: logIdParam } = useParams<{ logId: string }>();
    const logId = logIdParam ? parseInt(logIdParam) : null;

    const [detail, setDetail] = useState<DiaryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // 이 페이지는 일지 목록(/diary_list)에서 개별 항목을 클릭했을 때 들어옵니다.
    useEffect(() => {
        if (!logId || !token) {
            setLoading(false);
            return;
        }

        const fetchDetail = async () => {
             try {
                 setLoading(true);
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
            <button className="back-button" onClick={() => onNavigate('diary_list')}>← 목록으로</button>
            <h2 className="page-title">일지 상세 보기</h2>
            <div className="book-wrapper"><div className="loading-spinner" /></div>
        </div>;
    }

    const { created_at, user_reflection, photo_url, pokemon } = detail;
    const formattedDate = format(new Date(created_at), 'yyyy.MM.dd');

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('diary_list')}>← 목록으로</button>
            <h2 className="page-title">모험기록 - 기록후</h2>

            <div className="book-wrapper">
                <div className="book-ui">
                    {/* UI 예시의 페이지 번호는 생략합니다. */}

                    <div className="book-spread">
                        {/* 왼쪽 페이지: 오늘의 사진 */}
                        <div className="book-page book-page-left">
                            <h3>오늘의 사진</h3>
                            <div className="log-image-display" style={{ height: '300px' }}>
                                <img src={photo_url} alt="User Upload" />
                            </div>
                        </div>

                        {/* 오른쪽 페이지: 일지 내용 */}
                        <div className="book-page">
                            <h3>나의 포켓몬 일지</h3>
                            <p style={{ fontSize: '14px', color: '#777' }}>{formattedDate}</p>

                            <div className="pokemon-info">
                                <p style={{ fontWeight: 'normal', color: '#555' }}>조우 포켓몬</p>
                                <img src={pokemon.sprite_url} alt={pokemon.name} />
                                <p style={{ marginTop: '5px' }}>{pokemon.name} ({pokemon.type_1})</p>
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

export default DiaryDetailScreen;

// DiaryDetailScreen에서 사용하는 임시 더미 데이터
const dummyDetail: DiaryDetail = {
    log_id: 0,
    created_at: new Date().toISOString(),
    user_reflection: '예시 소감입니다. 백엔드 API가 준비되면 실제 데이터를 보여줍니다.',
    photo_url: 'https://via.placeholder.com/300x300.png?text=Diary+Preview',
    analysis: {
        location: '예시 장소',
        environment: '맑음',
        time: '낮',
        season: '봄',
    },
    pokemon: {
        name: '피카츄',
        sprite_url:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        type_1: '전기',
        poke_id: 25,
    },
};