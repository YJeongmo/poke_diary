# pokemon-fastapi-project/app/schemas.py

from sqlmodel import SQLModel, Field
from typing import Optional, List, Dict
from pydantic import BaseModel
from datetime import datetime

# --- 사용자 회원가입/로그인 요청 시 사용 ---
class UserCreate(SQLModel):
    email: str
    password: str = Field(min_length=6, max_length=72)
    auth_code: str  # 인증코드 필드 추가

class UserLogin(SQLModel):
    email: str
    password: str

# --- JWT 토큰 응답 시 사용 ---
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

# --- API 응답에 사용할 사용자 정보 ---
class UserResponse(SQLModel):
    id: int
    email: str
    image_type: Optional[str] = None

# --- DiaryList.tsx 에서 사용될 스키마 ---
class LogListItem(BaseModel):
    # Log 모델의 id와 일치하도록 log_id 대신 id 사용
    id: int
    created_at: datetime
    user_reflection_snippet: str
    pokemon_name: str
    pokemon_sprite: str
    location: str

    class Config:
        from_attributes = True

# --- DiaryDetail.tsx 에서 사용될 스키마 ---
class AnalysisInfo(BaseModel):
    location: str
    environment: str
    time: str
    season: str

class PokemonInfo(BaseModel):
    name: str
    sprite_url: str
    type_1: str
    poke_id: int

class DiaryDetailResponse(BaseModel):
    log_id: int
    created_at: datetime
    user_reflection: str
    photo_url: str
    analysis: AnalysisInfo
    pokemon: PokemonInfo

    class Config:
        from_attributes = True