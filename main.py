# pokemon-fastapi-project/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import httpx
import os

# 포켓몬 정보
from app.database import create_db_and_tables
from app.data_setup import init_pokemon_data
from app.routers.log_router import router as log_router

# 회원가입 인증
from app.routers.log_router import router as log_router
from app.routers.auth import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI 서버 시작/종료 시 실행되는 이벤트 핸들러.
    서버 시작 시 DB 테이블 생성 및 초기 포켓몬 데이터를 로드합니다.
    """
    print("FastAPI 서버 시작 중: DB 초기화 및 포켓몬 데이터 로드...")

    # 1. DB 테이블 생성 (SQLModel)
    create_db_and_tables()

    # 2. PokeAPI에서 포켓몬 초기 데이터 로드 (필요한 경우)
    await init_pokemon_data() # 비동기 함수로 구현 예정

    print("DB 초기화 및 데이터 로드 완료.")
    yield # 이 부분이 실행된 후 서버가 클라이언트 요청을 처리합니다.
    print("FastAPI 서버 종료.")


# ===============================================
# FastAPI 인스턴스 생성
# ===============================================
app = FastAPI(
    title="Pokemon Daily Log API",
    version="1.0.0",
    lifespan=lifespan # 서버 시작 이벤트를 연결
)

# CORS 설정 (프론트엔드 연동을 위해 필요)
# 로컬 개발용 도메인 + EC2에서 직접 프론트가 서빙될 경우의 도메인을 허용합니다.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://3.37.62.3",  # EC2에서 프론트엔드가 서빙될 경우
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================================
# 초기 라우트 (API 테스트용)
# ===============================================
@app.get("/")
def read_root():
    return {"message": "Welcome to the Pokemon Daily Log API. Check /docs for endpoints."}

# TODO: 라우터 연결 (4단계에서 진행)

app.include_router(log_router, prefix="/api/v1", tags=["Daily Log & Encounter"])

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

# 정적 파일 서빙: useImage 폴더
useimage_path = os.path.join(os.path.dirname(__file__), "useImage")
if os.path.exists(useimage_path):
    app.mount("/useImage", StaticFiles(directory=useimage_path), name="useImage")

# 정적 파일 서빙: uploads 폴더 (사용자별 업로드 이미지)
uploads_path = os.path.join(os.path.dirname(__file__), "uploads")
if os.path.exists(uploads_path):
    app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")