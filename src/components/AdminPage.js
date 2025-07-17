import React, { useState, useEffect } from 'react';
import { getAllMemberships, createMembership, deleteMembership } from '../services/api';
import './AdminPage.css';

function AdminPage() {
    const [memberships, setMemberships] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMembership, setNewMembership] = useState({
        name: '',
        type: 'B2C',
        conversationLimit: '',
        durationDays: '',
        price: ''
    });

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        try {
            const data = await getAllMemberships();
            setMemberships(data);
        } catch (error) {
            console.error('Failed to fetch memberships:', error);
        }
    };



    const handleCreateMembership = async (e) => {
        e.preventDefault();
        try {
            const membershipData = {
                ...newMembership,
                conversationLimit: newMembership.conversationLimit ? parseInt(newMembership.conversationLimit) : null,
                durationDays: parseInt(newMembership.durationDays),
                price: parseInt(newMembership.price)
            };

            await createMembership(membershipData);
            alert('멤버십이 생성되었습니다!');
            setShowCreateForm(false);
            setNewMembership({
                name: '',
                type: 'B2C',
                conversationLimit: '',
                durationDays: '',
                price: ''
            });
            fetchMemberships();
        } catch (error) {
            console.error('Error creating membership:', error);
            alert('멤버십 생성 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteMembership = async (membershipId) => {
        if (window.confirm('정말로 이 멤버십을 삭제하시겠습니까?')) {
            try {
                await deleteMembership(membershipId);
                alert('멤버십이 삭제되었습니다.');
                fetchMemberships();
            } catch (error) {
                console.error('Error deleting membership:', error);
                alert('멤버십 삭제 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <div className="admin-container">
            <h1>관리자 페이지</h1>
            
            <div className="admin-header">
                <button 
                    className="create-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? '취소' : '새 멤버십 생성'}
                </button>
            </div>

            {showCreateForm && (
                <div className="create-form">
                    <h3>새 멤버십 생성</h3>
                    <form onSubmit={handleCreateMembership}>
                        <div className="form-group">
                            <label>멤버십 이름:</label>
                            <input
                                type="text"
                                value={newMembership.name}
                                onChange={(e) => setNewMembership({...newMembership, name: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>타입:</label>
                            <select
                                value={newMembership.type}
                                onChange={(e) => setNewMembership({...newMembership, type: e.target.value})}
                            >
                                <option value="B2C">B2C</option>
                                <option value="B2B">B2B</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>대화 횟수 (무제한은 비워두세요):</label>
                            <input
                                type="number"
                                value={newMembership.conversationLimit}
                                onChange={(e) => setNewMembership({...newMembership, conversationLimit: e.target.value})}
                                placeholder="예: 20"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>기간 (일):</label>
                            <input
                                type="number"
                                value={newMembership.durationDays}
                                onChange={(e) => setNewMembership({...newMembership, durationDays: e.target.value})}
                                required
                                placeholder="예: 30"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>가격 (원):</label>
                            <input
                                type="number"
                                value={newMembership.price}
                                onChange={(e) => setNewMembership({...newMembership, price: e.target.value})}
                                required
                                placeholder="예: 50000"
                            />
                        </div>
                        
                        <button type="submit" className="submit-btn">생성</button>
                    </form>
                </div>
            )}

            <div className="memberships-list">
                <h3>현재 멤버십 목록</h3>
                {memberships.length === 0 ? (
                    <p>등록된 멤버십이 없습니다.</p>
                ) : (
                    <div className="memberships-grid">
                        {memberships.map(membership => (
                            <div key={membership.id} className="membership-card">
                                <h4>{membership.name}</h4>
                                <p><strong>타입:</strong> {membership.type}</p>
                                <p><strong>대화 횟수:</strong> {membership.conversationLimit === null ? '무제한' : `${membership.conversationLimit}회`}</p>
                                <p><strong>기간:</strong> {membership.durationDays}일</p>
                                <p><strong>가격:</strong> {membership.price?.toLocaleString()}원</p>
                                <p><strong>커스텀:</strong> {membership.isCustom ? '예' : '아니오'}</p>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteMembership(membership.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;