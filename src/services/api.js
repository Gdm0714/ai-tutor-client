const API_BASE_URL = 'http://localhost:8080/api';

export const getMembership = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/membership/user/${userId}`);
    if (!response.ok) {
        throw new Error('멤버십 정보를 불러오는데 실패했습니다');
    }
    return response.json();
};

export const getMembershipsByType = async (type) => {
    const response = await fetch(`${API_BASE_URL}/membership/type/${type}`);
    if (!response.ok) {
        throw new Error('멤버십 목록을 불러오는데 실패했습니다');
    }
    return response.json();
};

export const getAllMemberships = async () => {
    const response = await fetch(`${API_BASE_URL}/membership`);
    if (!response.ok) {
        throw new Error('전체 멤버십 목록을 불러오는데 실패했습니다');
    }
    return response.json();
};

export const createMembership = async (membershipData) => {
    const response = await fetch(`${API_BASE_URL}/membership`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '멤버십 생성에 실패했습니다');
    }
    return response.json();
};

export const deleteMembership = async (membershipId) => {
    const response = await fetch(`${API_BASE_URL}/membership/${membershipId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('멤버십 삭제에 실패했습니다');
    }
    return { success: true };
};

export const processPayment = async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/membership/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
        throw new Error('결제 처리에 실패했습니다');
    }
    return response.json();
};

export const sendChat = async (chatData) => {
    const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
    });
    if (!response.ok) {
        throw new Error('채팅 전송에 실패했습니다');
    }
    return response.json();
};