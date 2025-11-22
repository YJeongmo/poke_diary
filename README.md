# 포켓몬 데일리 로그 프로젝트

FastAPI 백엔드와 React(Vite) 프론트엔드로 구성된 **포켓몬 데일리 로그 / 도감 / 뱃지** 웹 서비스입니다.  
사용자는 하루에 최대 3회까지 사진과 소감을 기록하고, GPT-4o Vision으로 분석된 환경 정보를 바탕으로 조우한 포켓몬과 도감을 관리하며, 조건을 만족하면 뱃지를 획득할 수 있습니다.

---

## 📋 목차

- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [로컬 개발 환경 설정](#로컬-개발-환경-설정)
- [환경 변수 설정](#환경-변수-설정)
- [API 엔드포인트](#api-엔드포인트)
- [배포 가이드](#배포-가이드)
- [문제 해결](#문제-해결)

---

## 🛠 기술 스택

### 백엔드
- **언어**: Python 3.11+
- **프레임워크**: FastAPI 0.115.0
- **ORM**: SQLModel 0.0.22 (SQLAlchemy 기반)
- **데이터베이스**: 
  - SQLite (로컬 개발)
  - PostgreSQL (프로덕션, AWS RDS)
- **인증**: 
  - python-jose 3.3.0 (JWT)
  - bcrypt 4.2.0 (비밀번호 해싱)
- **외부 서비스**:
  - OpenAI API (GPT-4o Vision)
  - AWS S3 (이미지 스토리지)
- **이미지 처리**: Pillow 10.4.0
- **AWS SDK**: boto3 1.35.0
- **서버**: uvicorn 0.30.0

### 프론트엔드
- **언어**: TypeScript
- **프레임워크**: React 19.1.1
- **빌드 도구**: Vite 7.1.7
- **HTTP 클라이언트**: Axios
- **라우팅**: React Router DOM
- **유틸리티**: date-fns 4.1.0

### 인프라
- **서버**: AWS EC2
- **웹 서버**: Nginx (리버스 프록시)
- **데이터베이스**: AWS RDS (PostgreSQL)
- **스토리지**: AWS S3

---

## ✨ 주요 기능

### 1. 사용자 인증
- 이메일/비밀번호 기반 회원가입 및 로그인
- JWT 토큰 기반 인증
- 인증 코드를 통한 사용자 타입 분류 (`type_1`, `type_2`, `type_3`)
- 사용자 타입에 따른 맞춤형 메인 화면 이미지

### 2. 일일 조우 기록
- 하루 최대 3회까지 일지 작성 가능 (UTC 기준)
- 사진 업로드 및 GPT-4o Vision을 통한 자동 환경 분석
  - 장소: 도시, 산, 들, 강, 바다, 숲, 하늘
  - 환경: 맑음, 흐림, 비, 눈, 바람, 없음
  - 시간: 낮, 밤, 일몰, 아침
  - 계절: 봄, 여름, 가을, 겨울
- 분석 결과 기반 가중치 시스템으로 포켓몬 조우 결정
- 이미지 최적화 및 AWS S3 업로드
- 일지 목록 및 상세 보기 (책 넘기기 스타일 UI)

### 3. 포켓몬 도감
- 신오 도감 기준 포켓몬 목록
- 조우 여부, 조우 횟수, 조우율 표시
- 마지막 조우 날짜 정보

### 4. 뱃지 시스템
- **볼 티어 뱃지**: 총 조우 횟수에 따라 획득
  - 몬스터볼 (10회)
  - 하이퍼볼 (30회)
  - 슈퍼볼 (50회)
  - 프리미어볼 (100회)
  - 마스터볼 (200회)
- **타입 마스터 뱃지**: 각 속성별 조우 임계값 달성 시 획득

---

## 📁 프로젝트 구조

```
pokemon-fastapi-project/
├── main.py                    # FastAPI 엔트리 포인트
├── requirements.txt           # Python 의존성
├── .env                      # 백엔드 환경 변수
├── produce.md                # 프로젝트 상세 문서
├── app/
│   ├── __init__.py
│   ├── models.py             # SQLModel 모델 (User, Pokemon, DailyEncounterLog)
│   ├── schemas.py            # Pydantic 스키마 (API 요청/응답)
│   ├── database.py           # DB 엔진 및 세션 관리
│   ├── security.py           # JWT 및 비밀번호 해싱 유틸리티
│   ├── data_setup.py         # 포켓몬 데이터 초기화 함수
│   ├── routers/
│   │   ├── auth.py           # 인증 라우터 (회원가입, 로그인, /auth/me)
│   │   └── log_router.py     # 조우/일지 라우터 (일지 작성, 목록, 상세, 도감, 뱃지)
│   └── services/
│       ├── encounter_service.py  # 조우 로직 (가중치 기반 포켓몬 선택)
│       ├── pokedex_service.py    # 도감 서비스
│       └── badge_service.py      # 뱃지 서비스
├── frontend/
│   ├── package.json          # Node.js 의존성
│   ├── vite.config.ts        # Vite 설정
│   ├── .env                  # 프론트엔드 환경 변수
│   ├── src/
│   │   ├── main.tsx          # React 엔트리 포인트
│   │   ├── App.tsx           # 메인 앱 컴포넌트
│   │   ├── components/
│   │   │   ├── AuthScreen.tsx        # 로그인/회원가입 화면
│   │   │   ├── MainScreen.tsx        # 메인 화면
│   │   │   ├── EncounterScreen.tsx   # 조우 기록 작성 화면
│   │   │   └── PrivateRoute.tsx       # 인증이 필요한 라우트 보호
│   │   ├── DiaryListScreen.tsx       # 일지 목록 화면
│   │   ├── DiaryDetailScreen.tsx     # 일지 상세 화면
│   │   ├── Pokedex.tsx               # 도감 화면
│   │   ├── BadgeScreen.tsx          # 뱃지 화면
│   │   ├── hooks/
│   │   │   └── useAuth.tsx           # 인증 상태 관리 훅
│   │   └── utils/
│   │       ├── api.ts                # Axios 인스턴스 설정
│   │       └── backgroundUtils.ts    # 타입 기반 배경 이미지 유틸리티
│   └── public/
│       ├── badges/           # 뱃지 SVG 아이콘
│       └── useImage/         # 정적 이미지 에셋
├── useImage/                 # 정적 이미지 에셋 (백엔드 마운트)
└── uploads/                  # 로컬 업로드 파일 (개발용, S3 미사용 시)
```

---

## 🚀 로컬 개발 환경 설정

### 사전 요구사항
- Python 3.11 이상
- Node.js 18 이상
- npm 또는 yarn

### 1. 백엔드 설정

#### 1-1. 가상환경 생성 및 활성화 (권장)

```bash
cd pokemon-fastapi-project
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

#### 1-2. 의존성 설치

```bash
pip install -r requirements.txt
```

#### 1-3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
# JWT 인증
SECRET_KEY="임의의_길고_랜덤한_문자열_생성_필요"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# 데이터베이스 (선택사항, 없으면 SQLite 사용)
# DATABASE_URL="postgresql://user:password@host:port/dbname"

# OpenAI API (일지 작성 기능 사용 시 필수)
OPENAI_API_KEY="sk-..."

# AWS S3 (이미지 업로드 기능 사용 시 필수)
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_S3_REGION_NAME="ap-northeast-2"

# 인증 코드 매핑 (선택사항, 기본값 사용 가능)
TYPE_1_CODES=gardevoir
TYPE_2_CODES=lucario
TYPE_3_CODES=charming

# CORS 설정 (프론트엔드 도메인)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### 1-4. 데이터베이스 초기화

SQLite를 사용하는 경우, 자동으로 `database.db` 파일이 생성됩니다.

포켓몬 데이터를 로드하려면:

```bash
python -c "import asyncio; from app.data_setup import init_pokemon_data; asyncio.run(init_pokemon_data())"
```

또는 별도 스크립트 실행:

```bash
python load_pokemon_to_rds.py  # RDS 사용 시
```

#### 1-5. 서버 실행

```bash
uvicorn main:app --reload
```

- 기본 주소: `http://localhost:8000`
- API 문서: `http://localhost:8000/docs` (Swagger UI)
- 대체 문서: `http://localhost:8000/redoc` (ReDoc)

### 2. 프론트엔드 설정

#### 2-1. 의존성 설치

```bash
cd frontend
npm install
```

#### 2-2. 환경 변수 설정

`frontend/.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
# API 기본 URL
VITE_API_URL=http://localhost:8000/api/v1

# 에셋 기본 URL (배경/버튼 이미지)
VITE_ASSET_BASE_URL=http://localhost:8000/useImage
```

#### 2-3. 개발 서버 실행

```bash
npm run dev
```

- 기본 주소: `http://localhost:5173`
- 백엔드 API와 자동으로 연동됩니다.

### 3. 빌드 (프로덕션)

#### 프론트엔드 빌드

```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/dist` 디렉토리에 생성됩니다.

---

## ⚙️ 환경 변수 설정

### 백엔드 환경 변수 (`.env`)

| 변수명 | 설명 | 필수 | 기본값 |
|--------|------|------|--------|
| `SECRET_KEY` | JWT 토큰 서명에 사용되는 시크릿 키 | ✅ | - |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT 토큰 만료 시간 (분) | ❌ | 1440 |
| `DATABASE_URL` | PostgreSQL 연결 URL (RDS 사용 시) | ❌ | SQLite 사용 |
| `OPENAI_API_KEY` | OpenAI API 키 (일지 작성 기능) | ✅ | - |
| `AWS_S3_BUCKET_NAME` | S3 버킷 이름 | ✅ | - |
| `AWS_S3_REGION_NAME` | S3 리전 이름 | ✅ | - |
| `TYPE_1_CODES` | 타입 1 인증 코드 목록 (쉼표 구분) | ❌ | gardevoir |
| `TYPE_2_CODES` | 타입 2 인증 코드 목록 (쉼표 구분) | ❌ | lucario |
| `TYPE_3_CODES` | 타입 3 인증 코드 목록 (쉼표 구분) | ❌ | charming |
| `ALLOWED_ORIGINS` | CORS 허용 출처 (쉼표 구분) | ❌ | localhost |

### 프론트엔드 환경 변수 (`frontend/.env`)

| 변수명 | 설명 | 필수 | 기본값 |
|--------|------|------|--------|
| `VITE_API_URL` | 백엔드 API 기본 URL | ❌ | http://localhost:8000/api/v1 |
| `VITE_ASSET_BASE_URL` | 정적 에셋 기본 URL | ❌ | http://localhost:8000/useImage |

> **참고**: `VITE_` 접두사가 붙은 변수만 프론트엔드에서 접근 가능합니다.

---

## 📡 API 엔드포인트

### 인증 (`/api/v1/auth`)

- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/me` - 현재 사용자 정보 조회 (인증 필요)

### 일지 및 조우 (`/api/v1/logs`)

- `POST /api/v1/logs/encounter` - 일지 작성 및 포켓몬 조우 (인증 필요)
- `GET /api/v1/logs` - 일지 목록 조회 (인증 필요)
- `GET /api/v1/logs/{log_id}` - 일지 상세 조회 (인증 필요)
- `GET /api/v1/logs/pokedex` - 포켓몬 도감 조회 (인증 필요)
- `GET /api/v1/logs/badges` - 뱃지 목록 조회 (인증 필요)

자세한 API 문서는 서버 실행 후 `http://localhost:8000/docs`에서 확인할 수 있습니다.

---

## 🚢 배포 가이드

### AWS EC2 배포

#### 1. 백엔드 배포

```bash
# EC2 인스턴스에 접속 후
cd /path/to/pokemon-fastapi-project
pip install -r requirements.txt

# .env 파일 설정 (프로덕션 값으로)
# systemd 서비스 파일 생성 또는 PM2 사용
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 2. Nginx 설정

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 프론트엔드 정적 파일
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API 프록시
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 정적 이미지
    location /useImage/ {
        alias /path/to/useImage/;
    }
}
```

#### 3. 프론트엔드 빌드 및 배포

```bash
cd frontend
# .env 파일에 프로덕션 URL 설정
VITE_API_URL=http://your-domain.com/api/v1
VITE_ASSET_BASE_URL=http://your-domain.com/useImage

npm run build
# dist 폴더를 Nginx가 서빙하는 디렉토리로 복사
```

#### 4. RDS 데이터베이스 마이그레이션

```bash
# DATABASE_URL을 RDS로 설정
export DATABASE_URL="postgresql://user:password@rds-endpoint:5432/dbname"

# 포켓몬 데이터 로드
python load_pokemon_to_rds.py
```

#### 5. S3 설정

1. S3 버킷 생성
2. 버킷 정책 또는 ACL을 통해 공개 읽기 권한 부여
3. IAM 역할 또는 자격 증명에 `s3:PutObject`, `s3:GetObject` 권한 부여
4. `.env` 파일에 S3 정보 설정

---

## 🔧 문제 해결

### 포켓몬 데이터가 표시되지 않음

```bash
# 포켓몬 데이터가 로드되었는지 확인
python -c "from app.database import Session, engine; from app.models import Pokemon; from sqlmodel import select; session = Session(engine); count = len(session.exec(select(Pokemon)).all()); print(f'포켓몬 수: {count}')"

# 데이터가 없으면 로드
python -c "import asyncio; from app.data_setup import init_pokemon_data; asyncio.run(init_pokemon_data())"
```

### S3 업로드 오류

- **AccessControlListNotSupported**: S3 버킷에서 ACL이 비활성화된 경우
  - 해결 방법 1: S3 콘솔에서 버킷의 Object Ownership 설정에서 ACL 활성화
  - 해결 방법 2: 버킷 정책을 통해 공개 읽기 권한 부여 (코드에서 ACL 제거)

### CORS 오류

- `ALLOWED_ORIGINS` 환경 변수에 프론트엔드 도메인을 추가했는지 확인
- 쉼표로 구분하여 여러 도메인 추가 가능

### 이미지가 로드되지 않음

- `VITE_ASSET_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인
- 이미지 파일명에 한글이 포함되어 있지 않은지 확인 (영문으로 변경 권장)

---

## 📚 추가 문서

- [produce.md](./produce.md) - 프로젝트 상세 문서 (아키텍처, 기능 상세 설명)

---

## 📝 라이선스

이 프로젝트는 개인/교육 목적으로 사용됩니다.

---

## 👥 기여

이슈나 개선 사항이 있으면 이슈를 등록하거나 Pull Request를 보내주세요.
