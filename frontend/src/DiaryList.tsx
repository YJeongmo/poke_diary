// frontend/src/DiaryList.tsx

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getBackgroundStyle } from './utils/backgroundUtils';

interface LogEntry {
    id: number;
    created_at: string;
    user_reflection_snippet: string;
    pokemon_name: string;
    pokemon_sprite: string;
    location: string;
}

interface DiaryListProps {
    onNavigate: (screen: 'main') => void;
    onViewLog: (logId: number) => void; // 상세 페이지로 이동하는 핸들러
    imageType: string | null;
}

const AUTH_TOKEN_KEY = 'pokemon_auth_token';

function DiaryList({ onNavigate, onViewLog, imageType }: DiaryListProps) {
    const backgroundStyle = getBackgroundStyle(imageType);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    useEffect(() => {
        if (!token) {
            setError('인증 토큰이 없습니다.');
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/logs', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('기록 목록을 불러오는 데 실패했습니다.');
                }

                const data: LogEntry[] = await response.json();
                setLogs(data);
            } catch (err) {
                setError(`오류 발생: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [token]);

    if (loading) return <p>과거 기록을 로딩 중입니다...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="diary-list-container" style={backgroundStyle}>
            <button onClick={() => onNavigate('main')} className="back-button">← 메인으로</button>
            <h2>📚 나의 포켓몬 다이어리</h2>

            {logs.length === 0 ? (
                <p>아직 작성된 일지 기록이 없습니다.</p>
            ) : (
                <div className="log-entries-grid">
                    {logs.map((log) => (
                        <div key={log.id} className="log-card" onClick={() => onViewLog(log.id)}>
                            <p className="log-date">{format(new Date(log.created_at), 'yyyy.MM.dd')}</p>
                            <img src={log.pokemon_sprite} alt={log.pokemon_name} className="log-sprite" />
                            <p className="log-name">{log.pokemon_name}</p>
                            <p className="log-snippet">{log.user_reflection_snippet}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DiaryList;