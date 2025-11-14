// frontend/src/DiaryListScreen.tsx
import React, { useState, useEffect } from 'react';
import { getBackgroundStyle } from './utils/backgroundUtils';
import { useAuth } from './hooks/useAuth';
import api from './utils/api';
import type { LogEntry, ScreenName } from './types';
import { format } from 'date-fns';

interface DiaryListScreenProps {
    onNavigate: (screen: ScreenName, id?: number) => void;
    userEmail: string | null;
    imageType: string | null;
}

function DiaryListScreen({ onNavigate, imageType }: DiaryListScreenProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await api.get('/logs', token);
                setLogs(response.data);
            } catch (error) {
                console.error("Failed to fetch logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    const backgroundStyle = getBackgroundStyle(imageType);

    return (
        <div className="screen-container" style={backgroundStyle}>
            <button className="back-button" onClick={() => onNavigate('main')}>← 메인으로</button>
            <h2 className="page-title">일지 목록</h2>

            <div className="overlay-wrapper diary-list-wrapper">
                {loading ? (
                    <div className="loading-spinner" />
                ) : logs.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>아직 작성된 일지가 없습니다.</p>
                ) : (
                    <div className="grid-area">
                        <div className="diary-log-grid">
                            {logs.map(log => (
                                <div
                                    key={log.id}
                                    className="diary-log-card"
                                    onClick={() => onNavigate('diary_book', log.id)}
                                >
                                    <span className="date">{format(new Date(log.created_at), 'yyyy.MM.dd')}</span>
                                    <img className="pokemon-sprite-small" src={log.pokemon_sprite} alt={log.pokemon_name} />
                                    <span className="pokemon-name-small">{log.pokemon_name}</span>
                                    <p className="log-snippet">{log.user_reflection_snippet}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DiaryListScreen;