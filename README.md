# AI Tutor Client

**AI 튜터 프론트엔드**

## 🛠 기술 스택

- **Framework**: React 19.1.0
- **Router**: React Router Dom 7.7.0
- **Language**: JavaScript (ES6+)
- **Audio**: Web Speech API
- **Styling**: CSS3 (Flexbox, Grid)
- **HTTP Client**: Fetch API

## 📋 주요 기능

### 1. 홈페이지 (`/`)
- 현재 멤버십 상태 확인
- 사용 가능한 대화 횟수 표시
- 멤버십 구매 기능
- AI 채팅 시작 버튼

### 2. AI 채팅 페이지 (`/chat`)
- **음성 인식**: Web Speech API 활용
- **실시간 오디오 시각화**: 웨이브폼 표시
- **연속 음성 인식**: 중간 정지 시에도 계속 인식
- **답변완료 버튼**: 수동 완료 버튼 필수
- **대화 내역 저장**: 세션 스토리지로 페이지 이동 시에도 유지
- **멤버십 차감**: 대화 시 자동 횟수 차감

### 3. 관리자 페이지 (`/admin`)
- 멤버십 생성/삭제/조회
- 사용자별 멤버십 할당
- 멤버십 타입별 필터링
- 관리자 전용 CRUD 기능

## 🏗 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── HomePage.js     # 홈페이지
│   ├── ChatPage.js     # AI 채팅 페이지
│   ├── AdminPage.js    # 관리자 페이지
│   ├── AudioRecorder.js # 음성 인식 컴포넌트
│   └── common/         # 공통 컴포넌트
├── constants/          # 상수 정의
├── services/           # API 서비스
├── utils/             # 유틸리티 함수
└── App.js             # 메인 앱 컴포넌트
```

## ⚙️ 설정 및 실행

### 1. 환경 설정

**필수: 백엔드 서버 실행**
- AI Tutor Server가 `http://localhost:8080`에서 실행되어야 합니다.
- 백엔드 서버 설정 방법은 [ai-tutor-server](https://github.com/Gdm0714/ai-tutor-server) 참조

### 2. 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/Gdm0714/ai-tutor-client.git
cd ai-tutor-client

# 의존성 설치
npm install

# 개발 서버 실행
npm start

## 🎯 사용 방법

### 1. 홈페이지에서 시작
1. 현재 멤버십 상태 확인
2. 대화 횟수가 없으면 멤버십 구매
3. "AI와 대화하기" 버튼 클릭

### 2. AI 채팅 사용법
1. 🎤 말하기 버튼 클릭
2. 영어로 질문/대화 (음성 인식 중...)
3. 말이 끝나면 "답변완료" 버튼 클릭
4. AI 응답 확인 후 다음 대화 진행

### 3. 관리자 기능
1. `/admin` 페이지 접속
2. 멤버십 생성/삭제/조회