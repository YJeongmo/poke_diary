## 포켓몬 데일리 로그 프로젝트

FastAPI 백엔드와 React(Vite) 프론트엔드로 구성된 **포켓몬 데일리 로그 / 도감 / 뱃지** 웹 서비스입니다.  
사용자는 하루에 한 번 사진과 소감을 기록하고, 조우한 포켓몬과 도감을 관리하며, 조건을 만족하면 뱃지를 획득할 수 있습니다.

---

## 1. 기술 스택

- **백엔드**
  - Python, FastAPI
  - SQLModel + SQLite (초기 버전)  
  - JWT 인증 (`python-jose`, `bcrypt`)  
- **프론트엔드**
  - React (Vite + TypeScript)
  - axios
- **인프라 (예시)**
  - AWS EC2 (uvicorn + Nginx)

---

## 2. 디렉터리 구조

- `main.py`  
  - FastAPI 엔트리 포인트  
  - CORS 설정, 정적 파일(`useImage`, `uploads`) 마운트, 라우터 연결
- `app/`
  - `models.py` / `schemas.py` : User, Pokemon, DailyEncounterLog 등 도메인 모델
  - `database.py` : SQLModel + SQLite 엔진 및 세션 관리
  - `routers/`
    - `auth.py` : 회원가입, 로그인, `/auth/me` 등 인증 관련 API
    - `log_router.py` : 일지 작성, 조우 기록, 로그 목록/상세 API
  - `services/`
    - `encounter_service.py` : 이미지 분석 및 조우 포켓몬 결정 로직
    - `pokedex_service.py` : 도감 조회 로직
    - `badge_service.py` : 뱃지 획득 조건 및 상태 계산
- `frontend/`
  - React + Vite 프론트엔드 앱
  - `src/` 안에 `AuthScreen`, `MainScreen`, `EncounterScreen`, `DiaryListScreen`, `Pokedex`, `BadgeScreen` 등 화면 구성

---

## 3. 로컬 개발 환경 설정

### 3-1. 백엔드 (FastAPI)

1. **가상환경 생성 및 활성화 (선택)**  

   ```bash
   cd pokemon-fastapi-project
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **필요 패키지 설치**

   ```bash
   pip install -r requirements.txt
   ```

3. **환경 변수(.env) 설정**

   프로젝트 루트에 `.env` 파일 생성:

   ```env
   # JWT SECRET KEY
   SECRET_KEY="임의의_길고_랜덤한_문자열"
   ```

4. **서버 실행 (개발 모드)**

   ```bash
   uvicorn main:app --reload
   ```

   - 기본 주소: `http://localhost:8000`
   - Swagger 문서: `http://localhost:8000/docs`

### 3-2. 프론트엔드 (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:5173`
- 백엔드 API 기본 URL은 `frontend/src/utils/api.ts` 에서 관리합니다.

---

## 4. 주요 화면 및 기능

- **로그인 / 회원가입 (`AuthScreen`)**
  - 이메일 + 비밀번호 기반 회원가입 및 로그인
  - JWT 토큰을 `localStorage` 에 저장하고, `/auth/me` 로 사용자 정보 조회

- **메인 화면 (`MainScreen`)**
  - 사용자 이메일 / 이미지 타입에 따라 다른 일지 버튼 이미지
  - 모험 기록, 도감, 뱃지 화면으로 이동

- **조우 기록 (`EncounterScreen` / `DiaryListScreen`)**
  - 사진 업로드 + 오늘의 소감을 입력하면 백엔드에서 포켓몬 분석 및 조우 기록 저장
  - 일지 목록/상세를 책 넘기는 UI로 확인

- **도감 (`Pokedex`)**
  - 신오 도감 기준 포켓몬 목록
  - 조우 여부, 조우 횟수, 조우율 표시

- **뱃지 (`BadgeScreen`)**
  - 조우 마릿수 뱃지 (몬스터볼~마스터볼)
  - 타입별 마스터 뱃지 (풀/불꽃/물 등)

---

