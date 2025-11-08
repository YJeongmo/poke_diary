# pokemon-fastapi-project/app/schemas.py

from sqlmodel import SQLModel, Field
from typing import Optional

# --- 사용자 회원가입/로그인 요청 시 사용 ---
class UserCreate(SQLModel):
    email: str
    password: str = Field(min_length=6, max_length=72)

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