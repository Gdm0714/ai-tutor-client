export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

export const USER_CONFIG = {
  DEFAULT_USER_ID: 1,
};

export const PAYMENT_CONFIG = {
  PAYMENT_METHOD: 'CARD',
  MOCK_TOKEN_PREFIX: 'mock_payment_token_',
};

export const SPEECH_CONFIG = {
  LANGUAGE: 'en-US',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
  MAX_ALTERNATIVES: 1,
};

export const MESSAGES = {
  ERRORS: {
    MEMBERSHIP_ACCESS_DENIED: '대화 가능한 멤버십이 없습니다.',
    PAYMENT_FAILED: '결제 처리 중 오류가 발생했습니다.',
    CHAT_ERROR: '대화 처리 중 오류가 발생했습니다.',
    MEMBERSHIP_CHECK_FAILED: '멤버십 확인 중 오류가 발생했습니다.',
    MICROPHONE_ACCESS_DENIED: '마이크 접근 권한이 필요합니다.',
    MICROPHONE_NOT_SUPPORTED: '음성 인식이 지원되지 않는 브라우저입니다. Chrome이나 Edge를 사용해주세요.',
    SECURE_CONTEXT_REQUIRED: '보안 연결(HTTPS)이 필요합니다.',
  },
  SUCCESS: {
    MEMBERSHIP_PURCHASED: '멤버십 구매가 완료되었습니다!',
    MEMBERSHIP_CREATED: '멤버십이 생성되었습니다!',
    MEMBERSHIP_DELETED: '멤버십이 삭제되었습니다.',
  },
  LOADING: {
    PROCESSING_PAYMENT: '처리 중...',
    AI_GENERATING: 'AI가 응답을 생성하고 있습니다...',
    LISTENING: '듣고 있습니다... 영어로 말해주세요.',
    LOADING_MEMBERSHIP: '멤버십 정보를 불러오는 중...',
  },
};

export const AUDIO_CONFIG = {
  ECHO_CANCELLATION: true,
  NOISE_SUPPRESSION: true,
  AUTO_GAIN_CONTROL: true,
  FFT_SIZE: 256,
  WAVE_BAR_COUNT: 10,
  SILENCE_TIMEOUT: 3000,
};