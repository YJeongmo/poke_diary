# pokemon-fastapi-project/app/database.py

from sqlmodel import create_engine, Session, SQLModel

# 프로젝트 루트에 'database.db' 파일을 생성합니다.
# connect_args={"check_same_thread": False}는 SQLite 사용 시 FastAPI의 비동기 환경을 위해 필요합니다.
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# 엔진 생성: 에코(Echo=True)를 켜면 SQL 쿼리를 터미널에서 볼 수 있어 개발에 유용합니다.
engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    """엔진에 바인딩된 모든 SQLModel 테이블을 생성합니다."""
    # NOTE: 이 함수를 main.py에서 호출하여 서버 시작 시 DB를 초기화할 것입니다.
    from app.models import Pokemon, DailyEncounterLog, Badge # 순환 참조 방지를 위해 함수 내에서 임시 import
    SQLModel.metadata.create_all(engine)

def get_session():
    """의존성 주입(Dependency Injection)을 위한 세션 생성 함수"""
    with Session(engine) as session:
        yield session

# 이후 작업 (PokeAPI 초기 데이터 로드)에서 사용할 수 있도록 Session 생성기를 직접 정의합니다.
SessionLocal = Session(engine)