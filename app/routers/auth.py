# pokemon-fastapi-project/app/routers/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import Annotated
import os

from app.database import get_session
from app.models import User
from app.schemas import UserCreate, Token, UserResponse
from app.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter()

# --- 인증 코드 → 내부 타입 매핑 설정 ---
#
# .env 예시:
#   TYPE_1_CODES=gardevoir,g
#   TYPE_2_CODES=lucario,l
#   TYPE_3_CODES=charming,c,pretty
#
# 위 값이 없으면 기본값(gardevoir / lucario / charming)을 사용합니다.

TYPE_1_CODES = [
    code.strip()
    for code in os.getenv("TYPE_1_CODES", "gardevoir").split(",")
    if code.strip()
]
TYPE_2_CODES = [
    code.strip()
    for code in os.getenv("TYPE_2_CODES", "lucario").split(",")
    if code.strip()
]
TYPE_3_CODES = [
    code.strip()
    for code in os.getenv("TYPE_3_CODES", "charming").split(",")
    if code.strip()
]


def normalize_auth_code(auth_code_raw: str) -> str:
    """
    사용자가 입력한 인증코드를 기반으로 내부 이미지 타입을 정규화합니다.

    - TYPE_1_CODES  → "type_1"
    - TYPE_2_CODES  → "type_2"
    - TYPE_3_CODES  → "type_3"

    코드 내에 해당 문자열이 포함(in)되어 있으면 매칭됩니다.
    """
    code = auth_code_raw.lower()

    if any(key in code for key in TYPE_1_CODES):
        return "type_1"
    if any(key in code for key in TYPE_2_CODES):
        return "type_2"
    if any(key in code for key in TYPE_3_CODES):
        return "type_3"

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="인증코드가 올바르지 않습니다.",
    )

# --- 1. 회원가입 엔드포인트 ---
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
        user_data: UserCreate,
        session: Session = Depends(get_session)
):
    """
    새로운 사용자 계정을 등록합니다.
    인증코드에 따라 홈 화면 이미지 타입이 결정됩니다.
    """
    # 1. 이메일 중복 확인
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 이메일 주소입니다."
        )

    # 2. 인증코드 검증 및 이미지 타입 결정
    #    환경변수(TYPE_1_CODES / TYPE_2_CODES / TYPE_3_CODES)를 기반으로
    #    type_1 / type_2 / type_3 중 하나로 정규화합니다.
    canonical_code = normalize_auth_code(user_data.auth_code)

    # 3. 비밀번호 해싱
    hashed_password = get_password_hash(user_data.password)

    # 4. 사용자 객체 생성 및 DB 저장
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        image_type=canonical_code,   # 이미지 타입도 정규화된 코드 사용 (type_1 / type_2 / type_3)
        auth_code=canonical_code     # 회원가입 시 사용한 인증코드(내부 코드)를 보존
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # 5. 응답 모델 반환 (비밀번호 제외)
    return UserResponse(id=new_user.id, email=new_user.email, image_type=new_user.image_type)


# --- 2. 로그인 엔드포인트 ---
@router.post("/login", response_model=Token)
def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        session: Session = Depends(get_session)
):
    """
    이메일과 비밀번호로 로그인하고, JWT Access Token을 발급합니다.
    """
    # 1. 사용자 조회
    user = session.exec(
        select(User).where(User.email == form_data.username) # OAuth2 폼은 이메일을 'username'으로 사용
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 일치하지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. 비밀번호 검증
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 일치하지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. JWT 토큰 생성
    access_token = create_access_token(
        data={"sub": user.email} # 'sub' (subject) 클레임에 사용자 식별 정보(이메일)를 넣습니다.
    )

    # 4. 토큰 반환
    return {"access_token": access_token, "token_type": "bearer"}


# --- 3. 현재 사용자 정보 조회 엔드포인트 ---
@router.get("/me", response_model=UserResponse)
def get_current_user_info(
        current_user: User = Depends(get_current_user)
):
    """
    현재 로그인한 사용자의 정보를 조회합니다.
    auth_code는 배경/테마 설정 용도로만 사용하며, 화면에는 직접 노출하지 않습니다.
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        image_type=current_user.image_type,
        auth_code=current_user.auth_code,
    )