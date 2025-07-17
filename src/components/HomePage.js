import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembership, getMembershipsByType, processPayment } from '../services/api';
import { showNotification } from '../utils/errorHandler';
import { USER_CONFIG, MESSAGES } from '../constants';
import LoadingSpinner from './common/LoadingSpinner';
import './HomePage.css';

function HomePage() {
    const [membership, setMembership] = useState(null);
    const [availableMemberships, setAvailableMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPurchase, setShowPurchase] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembership();
        fetchAvailableMemberships();
    }, []);

    // 페이지에 포커스가 되면 멤버십 정보 새로고침
    useEffect(() => {
        const handleFocus = () => {
            fetchMembership();
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchMembership = async () => {
        try {
            const data = await getMembership(USER_CONFIG.DEFAULT_USER_ID);
            setMembership(data);
        } catch (error) {
            console.error('Failed to fetch membership:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableMemberships = async () => {
        try {
            const data = await getMembershipsByType('B2C');
            setAvailableMemberships(data);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };




    const startChat = async () => {
        // 최신 멤버십 정보 확인
        await fetchMembership();
        
        if (membership && membership.canUseConversation) {
            navigate('/chat');
        } else {
            showNotification(MESSAGES.ERRORS.MEMBERSHIP_ACCESS_DENIED, 'error');
        }
    };

    const handlePurchase = async (membershipId) => {
        setProcessingPayment(true);
        try {
            const paymentRequest = {
                userId: USER_CONFIG.DEFAULT_USER_ID,
                membershipId: membershipId,
                paymentMethod: 'CARD',
                paymentToken: 'mock_payment_token_' + Date.now()
            };
            
            const result = await processPayment(paymentRequest);
            
            if (result.status === 'SUCCESS') {
                showNotification(MESSAGES.SUCCESS.MEMBERSHIP_PURCHASED, 'success');
                setShowPurchase(false);
                await fetchMembership();
            } else {
                showNotification('결제 실패: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Payment error:', error);
            showNotification(MESSAGES.ERRORS.PAYMENT_FAILED, 'error');
        } finally {
            setProcessingPayment(false);
        }
    };


    if (loading) {
        return <LoadingSpinner message={MESSAGES.LOADING.LOADING_MEMBERSHIP} />;
    }

    return (
        <div className="home-container">
            <div className="header">
                <h1>Ringle AI 튜터</h1>
                <button 
                    className="admin-link"
                    onClick={() => navigate('/admin')}
                >
                    관리자 페이지
                </button>
            </div>

            <div className="membership-info">
                <h2>나의 멤버십</h2>
                {membership ? (
                    <div className="membership-card">
                        <p>멤버십 이름: {membership.membership?.name || '알 수 없음'}</p>
                        <p>상태: {membership.status}</p>
                        <p>
                            대화 가능 횟수:{' '}
                            {membership.conversationRemaining === -1
                                ? '무제한'
                                : `${membership.conversationRemaining}회 남음`}
                        </p>
                        <p>
                            만료일:{' '}
                            {new Date(
                                membership.expiryDate,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p>활성화된 멤버십이 없습니다.</p>
                )}
            </div>

            <div className="actions">
                <button
                    className="start-chat-btn"
                    onClick={startChat}
                    disabled={!membership || !membership.canUseConversation}
                >
                    AI 대화 시작하기
                </button>

                <button
                    className="purchase-btn"
                    onClick={() => setShowPurchase(!showPurchase)}
                >
                    멤버십 구매하기
                </button>
            </div>

            {showPurchase && (
                <div className="purchase-section">
                    <h3>멤버십 구매</h3>
                    <div className="available-memberships">
                        {availableMemberships.map(m => (
                            <div key={m.id} className="membership-option">
                                <h4>{m.name}</h4>
                                <p>대화: {m.conversationLimit === null ? '무제한' : `${m.conversationLimit}회`}</p>
                                <p>기간: {m.durationDays}일</p>
                                <p>가격: {m.price}원</p>
                                <button
                                    onClick={() => handlePurchase(m.id)}
                                    disabled={processingPayment}
                                    className="buy-btn"
                                >
                                    {processingPayment ? '처리 중...' : '구매하기'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default HomePage;
