import React from 'react';
import './MembershipCard.css';

const MembershipCard = ({ membership, onAction, actionLabel, loading = false }) => {
  return (
    <div className="membership-card">
      <h4>{membership.name}</h4>
      <p>대화: {membership.conversationLimit === null ? '무제한' : `${membership.conversationLimit}회`}</p>
      <p>기간: {membership.durationDays}일</p>
      <p>가격: {membership.price?.toLocaleString()}원</p>
      {onAction && (
        <button
          onClick={() => onAction(membership.id)}
          disabled={loading}
          className="action-btn"
        >
          {loading ? '처리 중...' : actionLabel}
        </button>
      )}
    </div>
  );
};

export default MembershipCard;