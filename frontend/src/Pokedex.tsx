// frontend/src/Pokedex.tsx
import React, { useState, useEffect } from 'react';
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
                setPokedexData(response.data);
            } catch (error) {
                console.error("Failed to fetch pokedex:", error);
                // API 실패 시 임시 더미 데이터 (UI 예시와 유사하게)
                setPokedexData({
                    total_pokedex_count: 210,
                    total_unique_encountered: 10,
                    pokedex_entries: Array.from({ length: 210 }, (_, i) => ({
                        poke_id: i + 1,
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
    const totalPages = Math.ceil(pokedex_entries.length / PAGE_SIZE);

    // 현재 페이지의 포켓몬 목록 계산
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentEntries = pokedex_entries.slice(startIndex, endIndex);

    const progressPercentage = (total_unique_encountered / total_pokedex_count) * 100;

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <div className="overlay-wrapper">
                <div className="pokedex-header-ui">도감</div>

                <div className="overlay-header" style={{ marginBottom: '10px' }}>
                    신오 도감 현황 ({total_unique_encountered}/{total_pokedex_count}) <br/>
                    <span style={{ color: '#e74c3c' }}>조우율: {progressPercentage.toFixed(2)}%</span>
                </div>

                <div className="grid-area">
                    <div className="pokedex-grid">
                        {currentEntries.map(entry => (
                            <div
                                key={entry.poke_id}
                                className={`pokedex-card ${entry.encountered ? '' : 'locked'}`}
                            >
                                <span className="sinnoh_poke_id">#{String(entry.poke_id).padStart(3, '0')}</span>
                                {entry.encountered ? (
                                    <>
                                        <img className="pokemon-sprite" src={entry.sprite_url} alt={entry.name} />
                                        <span className="pokemon-name">{entry.name}</span>
                                    </>
                                ) : (
                                    <span className="placeholder">?</span>
                                )}
                            </div>
                        ))}
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