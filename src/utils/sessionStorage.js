const CHAT_MESSAGES_KEY = 'ringle_chat_messages';
const CHAT_SESSION_KEY = 'ringle_chat_session';

export const ChatSession = {
    saveMessages: (messages) => {
        try {
            sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error('Failed to save messages to session storage:', error);
        }
    },

    loadMessages: () => {
        try {
            const stored = sessionStorage.getItem(CHAT_MESSAGES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load messages from session storage:', error);
            return [];
        }
    },

    clearMessages: () => {
        try {
            sessionStorage.removeItem(CHAT_MESSAGES_KEY);
        } catch (error) {
            console.error('Failed to clear messages from session storage:', error);
        }
    },

    startSession: () => {
        try {
            const sessionData = {
                startTime: new Date().toISOString(),
                sessionId: `session_${Date.now()}`
            };
            sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.error('Failed to start session:', error);
        }
    },

    getSession: () => {
        try {
            const stored = sessionStorage.getItem(CHAT_SESSION_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to get session:', error);
            return null;
        }
    }
};