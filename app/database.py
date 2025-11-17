# pokemon-fastapi-project/app/database.py

from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv
import os

# .env 파일에서 환경 변수 로드
load_dotenv()

# DATABASE_URL 환경변수가 있으면 RDS(PostgreSQL) 사용, 없으면 SQLite 사용
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # RDS(PostgreSQL) 사용 확인
    # DATABASE_URL이 postgresql:// 또는 postgres://로 시작하는지 확인
    if DATABASE_URL.startswith(("postgresql://", "postgres://")):
        # PostgreSQL은 connect_args가 필요 없음
        engine = create_engine(DATABASE_URL, echo=True)
        db_host = DATABASE_URL.split('@')[1].split('/')[0] if '@' in DATABASE_URL else 'RDS'
        print(f"✅ RDS(PostgreSQL) 연결: {db_host}")
    else:
        # DATABASE_URL이 있지만 PostgreSQL 형식이 아닌 경우 경고
        print(f"⚠️ 경고: DATABASE_URL이 PostgreSQL 형식이 아닙니다: {DATABASE_URL[:20]}...")
        print("⚠️ SQLite로 폴백합니다.")
        sqlite_file_name = "database.db"
        sqlite_url = f"sqlite:///{sqlite_file_name}"
        engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})
        print(f"✅ SQLite 연결: {sqlite_file_name}")
else:
    # SQLite 사용 (로컬 개발용)
    sqlite_file_name = "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    # connect_args={"check_same_thread": False}는 SQLite 사용 시 FastAPI의 비동기 환경을 위해 필요합니다.
    engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})
    print(f"✅ SQLite 연결: {sqlite_file_name}")

def create_db_and_tables():
    """엔진에 바인딩된 모든 SQLModel 테이블을 생성합니다."""
    # NOTE: 이 함수를 main.py에서 호출하여 서버 시작 시 DB를 초기화할 것입니다.
    from app.models import User, Pokemon, DailyEncounterLog, Badge # 순환 참조 방지를 위해 함수 내에서 임시 import
    SQLModel.metadata.create_all(engine)

def get_session():
    """의존성 주입(Dependency Injection)을 위한 세션 생성 함수"""
    with Session(engine) as session:
        yield session

# 이후 작업 (PokeAPI 초기 데이터 로드)에서 사용할 수 있도록 Session 생성기를 직접 정의합니다.
SessionLocal = Session(engine)