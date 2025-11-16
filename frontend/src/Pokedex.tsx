// frontend/src/Pokedex.tsx
import { useState, useEffect } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';
import type { PokedexData, ScreenName } from './types';

interface PokedexScreenProps {
    onNavigate: (screen: ScreenName) => void;
    userEmail: string | null;
    imageType: string | null;
}

const PAGE_SIZE = 15; // 5열 * 3행 = 15개

function PokedexScreen({ onNavigate, imageType }: PokedexScreenProps) {
    const [pokedexData, setPokedexData] = useState<PokedexData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchPokedex = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await api.get('/pokedex', token);
                // 모든 도감 항목을 번호 순서대로 가져온다고 가정
                console.log('Pokedex API response:', response.data);
                // 응답 데이터 구조 확인 및 안전하게 설정
                // 백엔드에서는 'pokedex' 키로 반환하지만, 프론트엔드 타입은 'pokedex_entries'를 사용
                const data = response.data || {};
                setPokedexData({
                    total_pokedex_count: data.total_pokedex_count || 210,
                    total_unique_encountered: data.total_unique_encountered || 0,
                    pokedex_entries: data.pokedex || data.pokedex_entries || [], // 백엔드는 'pokedex' 키 사용
                });
            } catch (error) {
                console.error("Failed to fetch pokedex:", error);
                console.error("Error details:", error);
                // API 실패 시 임시 더미 데이터 (UI 예시와 유사하게)
                setPokedexData({
                    total_pokedex_count: 210,
                    total_unique_encountered: 10,
                    pokedex_entries: Array.from({ length: 210 }, (_, i) => ({
                        poke_id: i + 1,
                        sinnoh_poke_id: i + 1, // 신오 도감 번호
                        name: `포켓몬 #${i + 1}`,
                        type_1: "노말",
                        sprite_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
                        encountered: i < 10,
                        encounter_count: i < 10 ? 1 : 0,
                    })),
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPokedex();
    }, [token]);

    const backgroundStyle = getBackgroundStyle(imageType);

    if (loading || !pokedexData) {
        return <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <div className="overlay-wrapper">
                <div className="overlay-header">신오 도감 현황</div>
                <div className="loading-spinner" />
            </div>
        </div>;
    }

    const { total_unique_encountered, total_pokedex_count, pokedex_entries } = pokedexData;
    
    // pokedex_entries가 없거나 배열이 아닌 경우 안전하게 처리
    const entries = pokedex_entries || [];
    const totalPages = Math.ceil(entries.length / PAGE_SIZE);

    // 현재 페이지의 포켓몬 목록 계산
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentEntries = entries.slice(startIndex, endIndex);

    const progressPercentage = (total_unique_encountered / total_pokedex_count) * 100;

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <div className="overlay-wrapper">
                <div className="overlay-header" style={{ marginBottom: '10px' }}>
                    신오 도감 현황 ({total_unique_encountered}/{total_pokedex_count}) <br/>
                    <span style={{ color: '#e74c3c' }}>조우율: {progressPercentage.toFixed(2)}%</span>
                </div>

                <div className="grid-area">
                    <div className="pokedex-grid">
                        {currentEntries.map((entry, index) => {
                            // 신오 도감 번호를 우선 사용, 없으면 인덱스 기반으로 계산
                            const sinnohId = entry.sinnoh_poke_id || (startIndex + index + 1);
                            return (
                                <div
                                    key={entry.poke_id || sinnohId}
                                    className={`pokedex-card ${entry.encountered ? '' : 'locked'}`}
                                >
                                    <span className="sinnoh_poke_id">#{String(sinnohId).padStart(3, '0')}</span>
                                    {entry.encountered ? (
                                        <>
                                            <img className="pokemon-sprite" src={entry.sprite_url} alt={entry.name} />
                                            <span className="pokemon-name">{entry.name}</span>
                                        </>
                                    ) : (
                                        <span className="placeholder">?</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pokedex-pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        &lt; 이전
                    </button>
                    <span>페이지 {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        다음 &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PokedexScreen;