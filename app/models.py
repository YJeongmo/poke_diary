# pokemon-fastapi-project/app/models.py

from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List
from datetime import datetime

# ===============================================
# 0. 사용자 모델 (인증 및 기록 관리를 위해 추가)
# ===============================================
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True) # 사용자 이메일 (로그인 ID)
    hashed_password: str # 해시된 비밀번호 저장
    image_type: Optional[str] = Field(default=None) # 홈 화면 이미지 타입 (gardevoir, lucario, pretty)
    auth_code: Optional[str] = Field(default=None)  # 회원가입 시 사용한 인증코드 보존용

    # 사용자 기록과 연결
    logs: List["DailyEncounterLog"] = Relationship(back_populates="user")

# ===============================================
# 1. 포켓몬 기본 정보 모델
# ===============================================
class PokemonBase(SQLModel):
    # ... (기존 PokemonBase 코드는 그대로 유지)
    name: str = Field(index=True)
    poke_id: int = Field(index=True)
    sinnoh_poke_id: Optional[int] = Field(default=None, index=True)
    type_1: str
    type_2: Optional[str] = None
    sprite_url: str


class Pokemon(PokemonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    logs: List["DailyEncounterLog"] = Relationship(back_populates="pokemon")


# ===============================================
# 2. 일일 포켓몬 조우 기록 및 일지 모델 (User 연결)
# ===============================================
class DailyEncounterLogBase(SQLModel):
    location_gpt: str
    environment_gpt: str
    time_gpt: str
    season_gpt: str
    user_reflection: str
    photo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DailyEncounterLog(DailyEncounterLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # 🔗 사용자 ID 외래 키 추가
    user_id: int = Field(foreign_key="user.id")
    # 🔗 포켓몬 ID 외래 키 유지
    pokemon_id: int = Field(foreign_key="pokemon.id")

    # 관계 설정
    pokemon: Pokemon = Relationship(back_populates="logs")
    user: User = Relationship(back_populates="logs") # User와 연결


# ===============================================
# 3. 뱃지 리워드 모델
# ===============================================
class Badge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    criteria_description: str