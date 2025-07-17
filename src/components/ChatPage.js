import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from './AudioRecorder';
import { sendChat, getMembership } from '../services/api';
import { showNotification } from '../utils/errorHandler';
import { ChatSession } from '../utils/sessionStorage';
import { USER_CONFIG, MESSAGES } from '../constants';
import './ChatPage.css';

function ChatPage() {
    const [messages, setMessages] = useState(() => ChatSession.loadMessages());
    const [loading, setLoading] = useState(false);
    const [membership, setMembership] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkMembershipAccess();
        ChatSession.startSession();
        
        // 첫 방문 시 AI 인사 메시지 추가
        if (messages.length === 0) {
            const welcomeMessage = {
                role: 'ai',
                content: 'Hello! I\'m your AI English tutor. I\'m here to help you practice English conversation. Feel free to ask me anything or just start a casual conversation. How are you doing today?'
            };
            setMessages([welcomeMessage]);
        }
    }, []);

    // 메시지가 변경될 때마다 세션에 저장
    useEffect(() => {
        ChatSession.saveMessages(messages);
    }, [messages]);

    // 컴포넌트 언마운트 시 메시지 저장
    useEffect(() => {
        return () => {
            ChatSession.saveMessages(messages);
        };
    }, [messages]);

    const checkMembershipAccess = async () => {
        try {
            const membershipData = await getMembership(USER_CONFIG.DEFAULT_USER_ID);
            if (!membershipData || !membershipData.canUseConversation) {
                setAccessDenied(true);
                setTimeout(() => {
                    showNotification(MESSAGES.ERRORS.MEMBERSHIP_ACCESS_DENIED + ' 홈으로 이동합니다.', 'error');
                    navigate('/');
                }, 1000);
                return;
            }
            setMembership(membershipData);
        } catch (error) {
            console.error('Failed to check membership:', error);
            setAccessDenied(true);
            setTimeout(() => {
                showNotification(MESSAGES.ERRORS.MEMBERSHIP_CHECK_FAILED + ' 홈으로 이동합니다.', 'error');
                navigate('/');
            }, 1000);
        }
    };

    const handleAudioReady = async (transcript) => {
        setLoading(true);

        try {
            const response = await sendChat({
                userId: USER_CONFIG.DEFAULT_USER_ID,
                message: transcript,
            });

            if (response.success) {
                const newMessages = [
                    ...messages,
                    { role: 'user', content: response.userMessage },
                    { role: 'ai', content: response.aiResponse },
                ];
                setMessages(newMessages);
                
                // 멤버십 정보 새로고침 (횟수 차감 확인)
                setTimeout(async () => {
                    try {
                        const updatedMembership = await getMembership(USER_CONFIG.DEFAULT_USER_ID);
                        setMembership(updatedMembership);
                    } catch (error) {
                        console.error('Failed to refresh membership:', error);
                    }
                }, 500);
            } else {
                showNotification('Error: ' + response.error, 'error');
                if (response.error.includes('No available conversation')) {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Chat error:', error);
            showNotification(MESSAGES.ERRORS.CHAT_ERROR, 'error');
        } finally {
            setLoading(false);
        }
    };


    if (accessDenied) {
        return (
            <div className="chat-container">
                <div className="access-denied">
                    <h2>접근 권한 없음</h2>
                    <p>{MESSAGES.ERRORS.MEMBERSHIP_ACCESS_DENIED}</p>
                    <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={() => navigate('/')}>← 돌아가기</button>
                <h2>AI English Tutor</h2>
                {membership && (
                    <div className="membership-status">
                        <span>
                            대화 {membership.conversationRemaining === -1 
                                ? '무제한' 
                                : `${membership.conversationRemaining}회 남음`}
                        </span>
                    </div>
                )}
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <strong>
                            {msg.role === 'ai' ? 'AI Tutor' : 'You'}:
                        </strong>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {loading && (
                    <div className="loading">
                        {MESSAGES.LOADING.AI_GENERATING}
                    </div>
                )}
            </div>

            <div className="input-container">
                <AudioRecorder
                    onAudioReady={handleAudioReady}
                    disabled={loading}
                />
            </div>
        </div>
    );
}

export default ChatPage;
