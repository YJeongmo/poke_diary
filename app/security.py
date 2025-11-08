# pokemon-fastapi-project/app/security.py

import bcrypt # 비밀번호 해싱을 위해 bcrypt 직접 임포트
from datetime import datetime, timedelta
from typing import Optional, Annotated
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

# Note: 순환 임포트 방지를 위해 모델과 DB 세션은 함수 내에서 필요한 경우에만 임포트합니다.
# 하지만 get_current_user를 위해 미리 임포트합니다.
from app.database import get_session
from app.models import User # User 모델 임포트

# .env 파일에서 환경 변수 로드
load_dotenv()

# --- ⚙️ JWT 설정 ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key") # .env에서 로드
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24시간 토큰 유지

# OAuth2 스키마: 토큰이 유효하지 않을 때 401 Unauthorized 응답을 반환하도록 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


# --- 🔐 비밀번호 해싱 및 검증 (bcrypt 직접 사용) ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 해시된 비밀번호를 비교합니다."""
    # bcrypt.checkpw는 바이트 문자열을 사용합니다.
    # DB에서 가져온 hashed_password는 문자열이므로 다시 인코딩합니다.
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """비밀번호를 해시합니다. (72바이트 이하만 가능)"""
    # bcrypt.gensalt()로 salt를 생성하고, hashpw로 해시합니다. 결과는 문자열로 디코딩합니다.
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


# --- 🔑 JWT 토큰 관리 ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """JWT Access Token을 생성합니다."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """JWT Access Token을 디코딩하고 검증합니다."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# --- 🎯 의존성 주입: 현재 사용자 획득 ---

def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)],
        session: Session = Depends(get_session)
) -> User:
    """JWT 토큰을 검증하고, 토큰에 해당하는 User 객체를 반환합니다."""

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 인증 토큰입니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_email: str = payload.get("sub")
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰에 사용자 정보가 누락되었습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.exec(select(User).where(User.email == user_email)).first()

    if user is None:
        # 이메일은 유효하지만 사용자를 찾을 수 없는 경우
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )

    return user