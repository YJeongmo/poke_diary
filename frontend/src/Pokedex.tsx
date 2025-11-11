// frontend/src/Pokedex.tsx

import React, { useState, useEffect } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';

// API 데이터 구조 정의 (신오 도감 번호 필드 추가)
interface PokedexEntry {
    poke_id: number; // 전국도감 번호 (National ID)
    sinnoh_poke_id: number; // ⭐️ 신오도감 번호 (정렬 기준) ⭐️
    name: string;
    type_1: string;
    sprite_url: string;
    encountered: boolean;
}

interface PokedexData {
    total_pokedex_count: number;
    total_unique_encountered: number;
    pokedex: PokedexEntry[];
}

interface PokedexProps {
    onNavigate: (screen: 'encounter' | 'pokedex' | 'badges' | 'main') => void;
    imageType: string | null;
}

// 한 페이지당 포켓몬 수 (5x3 = 15마리)
const ITEMS_PER_PAGE = 15;
const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function Pokedex({ onNavigate, imageType }: PokedexProps) {
    const backgroundStyle = getBackgroundStyle(imageType);
    const [pokedexData, setPokedexData] = useState<PokedexData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    useEffect(() => {
        if (!token) {
            setError('인증 토큰이 없습니다. 로그인 상태를 확인해주세요.');
            setLoading(false);
            return;
        }

        const fetchPokedex = async () => {
            try {
                // 백엔드에서 모든 도감 데이터를 가져옵니다.
                const response = await fetch('http://localhost:8000/api/v1/pokedex', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || '도감 데이터를 불러오는 데 실패했습니다.');
                }

                const data: PokedexData = await response.json();

                // ⭐️ 도감 순서 오류 해결: sinnoh_poke_id 기준으로 강제 정렬 ⭐️
                // 백엔드에서 이미 정렬되어 오지만, 프론트에서 안정성 확보를 위해 재정렬합니다.
                const sortedPokedex = data.pokedex.sort((a, b) => a.sinnoh_poke_id - b.sinnoh_poke_id);

                setPokedexData({ ...data, pokedex: sortedPokedex });

            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPokedex();
    }, [token]);

    if (loading) return <p>도감 데이터를 로딩 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!pokedexData) return <p>도감 데이터가 없습니다.</p>;

    // 페이지네이션 로직
    const totalPages = Math.ceil(pokedexData.total_pokedex_count / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPokedexEntries = pokedexData.pokedex.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="pokedex-container" style={backgroundStyle}>
            {/* ⭐️ 뒤로가기 버튼 ⭐️ */}
            <button onClick={() => onNavigate('main')} className="back-button">← 메인으로</button>

            <h2>📖 신오 도감 현황 ({pokedexData.total_unique_encountered}/{pokedexData.total_pokedex_count})</h2>

            <div className="pokedex-progress">
                <p>총 조우율: {((pokedexData.total_unique_encountered / pokedexData.total_pokedex_count) * 100).toFixed(2)}%</p>
            </div>

            <div className="pokedex-grid">
                        {currentPokedexEntries.map((entry) => (
                            <div key={entry.poke_id}
                                 className={`pokedex-card ${entry.encountered ? 'encountered' : 'unencountered'}`}
                            >
                                {/* ⭐️ #undefined 해결 및 신오도감 번호 표시 ⭐️ */}
                                <p className="sinnoh_poke_id">
                                    #{String(entry.sinnoh_poke_id || entry.poke_id).padStart(3, '0')}
                                </p>
                                {entry.encountered ? (
                                    <>
                                        <img src={entry.sprite_url} alt={entry.name} className="pokemon-sprite" />
                                        {/* ⭐️ 포켓몬 이름 이미지 아래에 표시 ⭐️ */}
                                        <p className="pokemon-name">{entry.name}</p>
                                    </>
                                ) : (
                                    // 미조우 상태
                                    <div className="unencountered-placeholder">
                                        <span style={{ fontSize: '2em', fontWeight: 'normal' }}>?</span>
                                        {/* 미조우일 때는 이름 표시 안 함 */}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

            {/* ⭐️ 페이지네이션 컨트롤 ⭐️ */}
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt; 이전
                </button>
                <span>페이지 {currentPage} / {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음 &gt;
                </button>
            </div>
        </div>
    );
}

export default Pokedex;