# 포켓몬 데일리 로그 서비스 개요

이 문서는 포켓몬 데일리 로그 프로젝트의 제품 수준 개요를 담고 있습니다. 팀원이나 이해관계자가 빠르게 프로젝트의 목적, 작동 방식, 운영 방법을 이해할 수 있도록 작성되었습니다.

---

## 프로젝트 미션 및 사용자 가치

- **소규모 그룹의 트레이너들이 하루 최대 3회까지 사진과 소감을 기록**할 수 있는 일지 서비스를 제공합니다.
- **GPT-4o Vision API**를 활용하여 업로드된 사진의 환경 정보(장소, 날씨, 시간, 계절)를 자동으로 분석합니다.
- 분석 결과와 사용자 입력을 바탕으로 **가중치 기반 확률 시스템**으로 적절한 포켓몬을 매칭합니다.
- 조우 기록을 누적하여 **신오 도감 스타일의 포켓몬 도감**을 채워나가고, 조건을 만족하면 **뱃지를 획득**하여 지속적인 참여를 유도합니다.

---

## 아키텍처 개요

### 프론트엔드
- **React + Vite + TypeScript**로 구성된 SPA(Single Page Application)
- **Axios**를 통해 백엔드 API와 통신
- 런타임 설정은 `VITE_*` 환경 변수로 관리 (API 기본 URL, 에셋 URL 등)
- 로컬 개발 시 Vite 개발 서버 사용, 프로덕션에서는 Nginx를 통해 정적 파일 제공

### 백엔드
- **FastAPI** 애플리케이션 (`main.py`가 엔트리 포인트)
- `app/routers/` 하위에 라우터 모듈 구성
- **SQLModel ORM**을 사용하여 SQLite(로컬) 또는 PostgreSQL(RDS)과 연동
- `DATABASE_URL` 환경 변수 유무에 따라 자동으로 데이터베이스 선택
- 인증, 조우 기록, 도감/뱃지 집계, S3 이미지 업로드 기능 제공

### AI 분석 시스템
- `app/routers/log_router.py`에서 **OpenAI GPT-4o Vision API** 호출
- 업로드된 이미지로부터 장소, 환경, 시간, 계절 메타데이터 추출
- 포켓몬 세계관에 맞는 일지 기록을 보장하기 위한 컨텍스트 분석

### 스토리지
- **데이터베이스**: 프로덕션에서는 AWS RDS의 PostgreSQL 사용, 개발/테스트 환경에서는 자동으로 로컬 SQLite로 폴백
- **객체 스토리지**: AWS S3 버킷에 업로드된 일지 사진의 최적화된 JPEG 버전 저장
- **정적 에셋**: 포켓몬 아트, 뱃지 아이콘, 지도 이미지는 S3/CloudFront를 통해 제공하거나 FastAPI 정적 마운트(`/useImage`, `/uploads`)로 직접 제공

### 배포 환경
- **AWS EC2 인스턴스**에 배포 (uvicorn + Nginx)
- 백엔드와 프론트엔드 빌드 파이프라인 모두 `.env` 파일을 통해 환경 변수 관리

---

## 주요 기능

### 1. 인증 시스템
- **JWT 기반 로그인/회원가입** 엔드포인트 (`app/routers/auth.py`)
- 인증 코드는 환경 변수로 관리되는 키워드 목록을 통해 내부 아바타/이미지 타입(`type_1/2/3`)으로 매핑
- 환경 변수 예시:
  - `TYPE_1_CODES=gardevoir,g`
  - `TYPE_2_CODES=lucario,l`
  - `TYPE_3_CODES=charming,c,pretty`
- 사용자별로 다른 메인 화면 배경 및 일지 버튼 이미지 제공

### 2. 일일 조우 기록 플로우
1. 사용자가 소감 텍스트와 사진을 `POST /api/v1/logs/encounter`로 제출
2. 백엔드에서 **하루 최대 3회 제한** (UTC 기준) 적용
3. 이미지는 **Pillow**로 리사이즈/압축 후 **S3에 업로드**, 공개 URL을 로그와 함께 저장
4. **GPT 분석 + 가중치 기반 포켓몬 선택** (`app/services/encounter_service.py`)으로 조우 포켓몬 결정
5. 조우 기록을 `DailyEncounterLog`에 저장하고, 도감/뱃지 통계 자동 업데이트

### 3. 포켓몬 도감 모듈
- 포켓몬별 조우 횟수 집계, 총 조우 횟수, 완성도 상태, 마지막 조우 정보 표시
- `PokedexService`로 구현, 사전 로드된 포켓몬 데이터 사용 (`app/data_setup.py`, `load_pokemon_to_rds.py`)
- 신오 도감 기준 포켓몬 목록 제공

### 4. 뱃지 시스템
- **볼 티어 뱃지**: 총 조우 횟수에 따라 획득 (몬스터볼 → 하이퍼볼 → 슈퍼볼 → 프리미어볼 → 마스터볼)
- **타입 마스터 뱃지**: 각 속성별 조우 임계값을 만족하면 해제
- `/api/v1/logs/badges` 엔드포인트로 제공, `frontend/src/BadgeScreen.tsx`에서 SVG 에셋으로 렌더링

### 5. 프론트엔드 UX
- **주요 화면 구성**:
  - `AuthScreen`: 로그인/회원가입
  - `MainScreen`: 메인 화면 (사용자 타입별 동적 이미지)
  - `EncounterScreen`: 조우 기록 작성
  - `DiaryListScreen`: 일지 목록 (책 넘기기 스타일 UI)
  - `DiaryDetailScreen`: 일지 상세 보기
  - `Pokedex`: 포켓몬 도감
  - `BadgeScreen`: 뱃지 모음
- 메인 화면은 사용자의 이미지 타입(`type_1/2/3`)에 따라 버튼/배경 아트를 동적으로 교체
- 일지 목록은 책 넘기는 느낌의 UI로 구성
- 도감 및 뱃지 화면은 `frontend/public/badges` 하위의 SVG 에셋을 활용

---

## 기술 스택 상세

### 백엔드
- **언어**: Python 3.11+
- **프레임워크**: FastAPI
- **ORM**: SQLModel (SQLAlchemy 기반)
- **데이터베이스**: SQLite (개발), PostgreSQL (프로덕션/RDS)
- **인증**: python-jose (JWT), bcrypt (비밀번호 해싱)
- **외부 API**: OpenAI API (GPT-4o Vision)
- **클라우드 서비스**: boto3 (AWS S3)
- **이미지 처리**: Pillow (PIL)
- **HTTP 클라이언트**: httpx
- **환경 변수 관리**: python-dotenv

### 프론트엔드
- **언어**: TypeScript
- **프레임워크**: React 18
- **빌드 도구**: Vite
- **HTTP 클라이언트**: Axios
- **라우팅**: React Router DOM
- **스타일링**: 커스텀 CSS (Tailwind 미사용)

### 인프라 및 DevOps
- **서버**: AWS EC2
- **웹 서버**: Nginx (리버스 프록시)
- **WSGI 서버**: uvicorn
- **객체 스토리지**: AWS S3
- **데이터베이스**: AWS RDS (PostgreSQL)
- **환경 변수 관리**: dotenv (백엔드), Vite 환경 변수 (프론트엔드)
- **패키지 관리**: pip (requirements.txt), npm (package.json)

---

## 환경 변수 설정

### 백엔드 `.env` 파일
```env
# JWT 인증
SECRET_KEY="임의의_길고_랜덤한_문자열"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# 데이터베이스 (RDS 사용 시)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# AWS S3
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_S3_REGION_NAME="ap-northeast-2"

# OpenAI API
OPENAI_API_KEY="sk-..."

# 인증 코드 매핑
TYPE_1_CODES=gardevoir,g
TYPE_2_CODES=lucario,l
TYPE_3_CODES=charming,c,pretty

# CORS 설정
ALLOWED_ORIGINS=http://localhost:5173,http://43.200.120.41
```

### 프론트엔드 `.env` 파일
```env
# API 기본 URL
VITE_API_URL=http://43.200.120.41/api/v1

# 에셋 기본 URL (배경/버튼 이미지)
VITE_ASSET_BASE_URL=http://43.200.120.41/useImage
```

### 정적 마운트 (`main.py`)
- `/useImage` → 프로젝트 루트의 `useImage/` 디렉토리
- `/uploads` → 사용자 업로드 파일 (로컬 개발용 폴백, S3 미설정 시 사용)

---

## 배포 워크플로우

### 1. 백엔드 배포
```bash
# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --host 0.0.0.0 --port 8000
```

- **Nginx 설정**: `/api/` 경로를 uvicorn으로 프록시, `/useImage`와 `/uploads`는 직접 제공하거나 S3/CloudFront로 오프로드

### 2. 프론트엔드 배포
```bash
cd frontend
npm install
npm run build
```

- `frontend/dist` 디렉토리를 Nginx 또는 S3+CloudFront로 배포
- 빌드 전에 `VITE_API_URL`/`VITE_ASSET_BASE_URL`이 프로덕션 도메인과 일치하는지 확인

### 3. 데이터베이스 마이그레이션
- `DATABASE_URL`을 RDS DSN으로 설정
- SQLModel 메타데이터를 사용한 테이블 생성 (현재 프로젝트는 Alembic 대신 수동 스크립트 사용)
- `load_pokemon_to_rds.py`를 한 번 실행하여 도감 데이터 시드

### 4. S3 설정
- 버킷 생성
- **ACL 활성화** 또는 버킷 정책을 통해 공개 읽기 권한 부여
- IAM 자격 증명 또는 인스턴스 역할에 `s3:PutObject`/`s3:GetObject` 권한 제공

---

## 운영 주의사항

### 속도 제한
- **하드 제한**: 사용자당 UTC 기준 하루 최대 3회 조우 기록 (API 레벨에서 강제)

### 오류 처리
- GPT 또는 S3 실패 시 500 오류 발생, 로그에 컨텍스트 기록
- 클라이언트는 사용자 친화적인 메시지 표시

### 보안
- JWT 토큰은 클라이언트 측 `localStorage`에 저장
- `PrivateRoute`로 SPA 라우트 보호
- CORS 출처는 `ALLOWED_ORIGINS`로 설정 가능
- 비밀번호 최소 길이는 프론트엔드와 백엔드 모두에서 강제

### 확장 가능성 아이디어
- GPT 프롬프트를 다국어 또는 시즌 이벤트용으로 교체
- 기존 조우 통계를 활용한 소셜 공유 또는 팀 리더보드 추가
- 일일 제한 리셋 시 사용자 알림을 위한 스케줄 작업 지원

---

## 주요 파일 참조

### 백엔드
- `main.py`: 앱 부트스트랩, 정적 마운트, CORS 미들웨어, 라우터 연결
- `app/routers/auth.py`: 인증 라우트, 인증 코드 정규화, JWT 발급
- `app/routers/log_router.py`: 조우 생성, GPT 호출, S3 업로드, 로그 목록/상세, 도감/뱃지 엔드포인트
- `app/services/encounter_service.py`: 가중치 기반 포켓몬 선택 로직
- `app/services/pokedex_service.py`: 도감 집계 로직
- `app/services/badge_service.py`: 뱃지 집계 로직
- `app/models.py`: User, Pokemon, DailyEncounterLog 등 도메인 모델
- `app/schemas.py`: API 요청/응답 스키마
- `app/database.py`: 데이터베이스 엔진 및 세션 관리
- `app/data_setup.py`: 포켓몬 데이터 초기 로드
- `load_pokemon_to_rds.py`: RDS에 포켓몬 데이터 수동 로드 스크립트

### 프론트엔드
- `frontend/src/utils/api.ts`: `VITE_API_URL`을 사용하는 Axios 인스턴스
- `frontend/src/components/MainScreen.tsx`: 타입 기반 이미지 표시
- `frontend/src/utils/backgroundUtils.ts`: 타입 기반 배경 이미지 유틸리티
- `frontend/src/components/AuthScreen.tsx`: 로그인/회원가입 화면
- `frontend/src/components/EncounterScreen.tsx`: 조우 기록 작성 화면
- `frontend/src/DiaryListScreen.tsx`: 일지 목록 화면
- `frontend/src/DiaryDetailScreen.tsx`: 일지 상세 화면
- `frontend/src/Pokedex.tsx`: 도감 화면
- `frontend/src/BadgeScreen.tsx`: 뱃지 화면
- `frontend/src/hooks/useAuth.tsx`: 인증 상태 관리 훅
- `frontend/src/components/PrivateRoute.tsx`: 인증이 필요한 라우트 보호

### 설정 파일
- `requirements.txt`: Python 의존성 관리
- `frontend/package.json`: Node.js 의존성 관리
- `.env`: 백엔드 환경 변수 (예시 파일)
- `frontend/.env`: 프론트엔드 환경 변수 (예시 파일)

---

## 테스트 및 검증

### 수동 QA
- Vite 개발 서버 + uvicorn 개발 서버를 통한 수동 테스트
- S3 업로드 검증: 버킷 객체 확인 및 결과 URL 확인
- `DATABASE_URL`을 대상 DB로 설정한 후 `load_pokemon_to_rds.py` 실행하여 포켓몬 데이터가 채워졌는지 확인

### 향후 개선 사항
- pytest/FastAPI `TestClient` 스위트 추가 (현재 미구현)
- 조우 로직 및 인증 플로우에 대한 자동화된 테스트

---

## 프로젝트 구조 요약

```
pokemon-fastapi-project/
├── main.py                    # FastAPI 엔트리 포인트
├── requirements.txt           # Python 의존성
├── .env                      # 백엔드 환경 변수
├── app/
│   ├── __init__.py
│   ├── models.py             # SQLModel 모델 정의
│   ├── schemas.py            # Pydantic 스키마
│   ├── database.py           # DB 엔진 및 세션 관리
│   ├── security.py           # JWT 및 비밀번호 해싱
│   ├── data_setup.py         # 포켓몬 데이터 초기화
│   ├── routers/
│   │   ├── auth.py           # 인증 라우터
│   │   └── log_router.py     # 조우/일지 라우터
│   └── services/
│       ├── encounter_service.py  # 조우 로직
│       ├── pokedex_service.py     # 도감 서비스
│       └── badge_service.py       # 뱃지 서비스
├── frontend/
│   ├── package.json          # Node.js 의존성
│   ├── vite.config.ts        # Vite 설정
│   ├── .env                  # 프론트엔드 환경 변수
│   ├── src/
│   │   ├── main.tsx          # React 엔트리 포인트
│   │   ├── App.tsx           # 메인 앱 컴포넌트
│   │   ├── components/       # React 컴포넌트
│   │   ├── hooks/            # 커스텀 훅
│   │   └── utils/            # 유틸리티 함수
│   └── public/               # 정적 에셋
├── useImage/                 # 정적 이미지 에셋
└── uploads/                  # 로컬 업로드 파일 (개발용)
```
