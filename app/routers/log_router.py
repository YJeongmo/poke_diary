# pokemon-fastapi-project/app/routers/log_router.py (전체 수정)

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Form, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select, func
from openai import OpenAI
from dotenv import load_dotenv

import os
import base64
import json
import random
from typing import Dict, List, Tuple
from pathlib import Path
from datetime import datetime

from app.database import get_session
from app.models import Pokemon, DailyEncounterLog, DailyEncounterLogBase, User
from app.security import get_current_user
from app.services.encounter_service import select_weighted_pokemon
from app.services.pokedex_service import PokedexService # ⭐️ 서비스 임포트 ⭐️
from app.services.badge_service import BadgeService     # ⭐️ 서비스 임포트 ⭐️
from app.schemas import LogListItem, DiaryDetailResponse, AnalysisInfo, PokemonInfo # ⭐️ 스키마 임포트 ⭐️

# .env 파일에서 환경 변수 로드 (OPENAI_API_KEY)
load_dotenv()

# ⭐️⭐️⭐️ client 변수를 라우터 정의 전에 명확히 선언 ⭐️⭐️⭐️
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# ... (OpenAI 클라이언트 초기화 유지)
router = APIRouter()

# --- 헬퍼 함수: OpenAI Vision API 호출 (이것만 남김) ---

def get_image_analysis(base64_image: str) -> Dict[str, str]:
    """
    GPT-4o Vision을 사용하여 이미지로부터 환경 데이터를 추출하고,
    Log 모델의 키에 맞게 데이터를 정리하여 반환합니다.
    """

    # ... (시스템 프롬프트, 유저 프롬프트는 이전 답변의 확장된 프롬프트 사용)
    # 🎯 참고: 반환 키는 location_gpt, environment_gpt, time_gpt, season_gpt 입니다.

    system_prompt = ("You are an AI specialized in Pokémon world encounters. Analyze the user's uploaded photo and determine the environment details to decide what Pokémon might appear. Respond ONLY with a single JSON object.")
    user_prompt = ("Analyze this image and select the single most appropriate value for each category. Location: [도시 (City), 산 (Mountain), 들 (Field), 강 (River), 바다 (Ocean), 숲 (Forest), 하늘 (Sky)]. Environment Detail: [맑음 (Clear), 흐림 (Cloudy), 비 (Rain), 눈 (Snow), 바람 (Windy), 없음 (None)]. Time: [낮 (Day), 밤 (Night), 일몰 (Sunset), 아침 (Morning)]. Season: [봄 (Spring), 여름 (Summer), 가을 (Autumn), 겨울 (Winter)]. Format the output strictly as JSON. Example: " '{"location": "숲", "environment_detail": "맑음", "time": "낮", "season": "여름"}')

    try:
        # ... (OpenAI API 호출 로직은 이전과 동일)
        response = client.chat.completions.create( # ... (호출 파라미터)
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": [
                    {"type": "text", "text": user_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )

        json_data = json.loads(response.choices[0].message.content)

        # ⭐️ Log 모델 키에 맞춰 데이터 정리 ⭐️
        analysis = {
            "location_gpt": json_data.get("location", "알 수 없음"),
            "environment_gpt": json_data.get("environment_detail", "알 수 없음"),
            "time_gpt": json_data.get("time", "알 수 없음"),
            "season_gpt": json_data.get("season", "알 수 없음"),
        }
        return analysis

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="이미지 분석 중 오류 발생.")


# ====================================================
# ⭐️ 엔드포인트: 일지 작성 및 포켓몬 조우 (인증 필요) ⭐️
# ====================================================

@router.post("/encounter")
async def create_daily_encounter_log(
        image_file: UploadFile = File(...),
        user_reflection: str = Form(...),
        session: Session = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    """
    인증된 사용자만 사진을 분석하고 조우 기록을 저장할 수 있습니다.
    """
    try:
        # 1. 금일 일지 작성 횟수 제한 확인 (하루 최대 3회)
        today = datetime.utcnow().date()
        # 하루 시작/끝 범위 계산 (UTC 기준)
        start_of_day = datetime.combine(today, datetime.min.time())
        end_of_day = datetime.combine(today, datetime.max.time())

        today_count_stmt = select(func.count()).where(
            DailyEncounterLog.user_id == current_user.id,
            DailyEncounterLog.created_at >= start_of_day,
            DailyEncounterLog.created_at <= end_of_day,
        )
        today_count = session.exec(today_count_stmt).one()
        if today_count >= 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="일지작성은 일일 3회까지만 할 수 있습니다."
            )

        # 2. 이미지 읽기 (한 번만 읽고 재사용)
        image_bytes = await image_file.read()
        
        # 3. 이미지 분석
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        analysis_result = get_image_analysis(base64_image)

        # 4. ⭐️⭐️⭐️ 조우 로직 위임 ⭐️⭐️⭐️
        encountered_pokemon = select_weighted_pokemon(
            analysis_result,
            user_reflection,
            session
        )

        if encountered_pokemon is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="포켓몬 데이터를 찾을 수 없습니다.")

        # 5. 이미지 저장
        # uploads/{user_id}/ 폴더 구조 생성
        uploads_dir = Path("uploads")
        user_dir = uploads_dir / str(current_user.id)
        user_dir.mkdir(parents=True, exist_ok=True)
        
        # 파일명 생성: timestamp_original_filename
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        file_extension = Path(image_file.filename).suffix if image_file.filename else ".jpg"
        filename = f"{timestamp}{file_extension}"
        file_path = user_dir / filename
        
        # 이미지 파일 저장 (이미 읽은 image_bytes 사용)
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        
        # 6. photo_url 생성: /uploads/{user_id}/{filename}
        photo_url = f"/uploads/{current_user.id}/{filename}"

        # 7. Log 모델 생성 및 DB에 저장
        new_log_data = DailyEncounterLogBase(
            # Log 모델 키와 GPT 분석 결과 키가 일치해야 함 (location_gpt, season_gpt 등)
            **analysis_result, # ⭐️ 분석 결과를 바로 언패킹하여 사용 ⭐️
            user_reflection=user_reflection,
            photo_url=photo_url,
        )

        new_log = DailyEncounterLog(
            **new_log_data.model_dump(exclude_unset=True),
            pokemon_id=encountered_pokemon.id,
            user_id=current_user.id
        )

        session.add(new_log)
        session.commit()
        session.refresh(new_log)

        # 6. 결과 반환
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "오늘의 포켓몬 조우 기록이 저장되었습니다.",
                "analysis": analysis_result,
                "pokemon": {
                    "id": encountered_pokemon.poke_id,
                    "name": encountered_pokemon.name,
                    "type_1": encountered_pokemon.type_1,
                    "sprite_url": encountered_pokemon.sprite_url
                },
                "log_id": new_log.id
            }
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"서버 내부 오류 발생: {e}")

@router.get("/pokedex", tags=["Pokedex"])
def get_user_pokedex(
        session: Session = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    """
    로그인된 사용자가 조우한 포켓몬 도감 현황을 조회합니다.
    """
    pokedex_service = PokedexService(session) # ⭐️ 서비스 객체 생성 ⭐️
    return pokedex_service.get_user_pokedex(current_user.id)


@router.get("/badges", tags=["Badges"])
def get_user_badges(
        session: Session = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    """
    로그인된 사용자의 총 조우 횟수를 기준으로 획득한 뱃지 목록을 조회합니다.
    """
    badge_service = BadgeService(session) # ⭐️ 서비스 객체 생성 ⭐️
    return badge_service.get_user_badges(current_user.id)


@router.get("/logs", response_model=List[LogListItem], tags=["Daily Log & Encounter"]) # ⭐️ response_model 추가 ⭐️
def get_user_logs(
        session: Session = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    """
    로그인된 사용자의 모든 일지 기록 목록을 최신 순으로 조회합니다.
    """

    # 1. 포켓몬 정보와 일지 기록을 조인하여 한 번에 가져오기
    statement = select(
        DailyEncounterLog.id,
        DailyEncounterLog.created_at,
        DailyEncounterLog.user_reflection,
        DailyEncounterLog.location_gpt,
        Pokemon.name.label("pokemon_name"),
        Pokemon.sprite_url.label("pokemon_sprite")
    ).join(
        Pokemon, DailyEncounterLog.pokemon_id == Pokemon.id
    ).where(
        DailyEncounterLog.user_id == current_user.id
    ).order_by(
        DailyEncounterLog.created_at.desc() # 최신순 정렬
    )

    results = session.exec(statement).all()

    # 2. 응답 데이터 구조 생성 및 가공
    response_data = []
    for log_id, created_at, reflection, location, poke_name, poke_sprite in results:

        # 소감 미리보기(Snippet) 생성 (50자 제한)
        snippet = reflection[:50] + '...' if len(reflection) > 50 else reflection

        # LogListItem 형식에 맞춰 데이터 가공
        response_data.append(
            LogListItem(
                id=log_id,
                created_at=created_at,
                user_reflection_snippet=snippet,
                pokemon_name=poke_name,
                pokemon_sprite=poke_sprite,
                location=location
            )
        )

    return response_data


@router.get("/logs/{log_id}", response_model=DiaryDetailResponse, tags=["Daily Log & Encounter"])
def get_log_detail(
        log_id: int,
        session: Session = Depends(get_session),
        current_user: User = Depends(get_current_user)
):
    """
    특정 일지 기록의 상세 정보를 조회합니다.
    """
    # 1. 로그 조회 (사용자 소유 확인)
    statement = select(DailyEncounterLog).where(
        DailyEncounterLog.id == log_id,
        DailyEncounterLog.user_id == current_user.id
    )
    log = session.exec(statement).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일지 기록을 찾을 수 없습니다."
        )
    
    # 2. 포켓몬 정보 조회
    pokemon = session.get(Pokemon, log.pokemon_id)
    if not pokemon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="포켓몬 정보를 찾을 수 없습니다."
        )
    
    # 3. 응답 데이터 구성
    return DiaryDetailResponse(
        log_id=log.id,
        created_at=log.created_at,
        user_reflection=log.user_reflection,
        photo_url=log.photo_url or "",
        analysis=AnalysisInfo(
            location=log.location_gpt or "알 수 없음",
            environment=log.environment_gpt or "알 수 없음",
            time=log.time_gpt or "알 수 없음",
            season=log.season_gpt or "알 수 없음"
        ),
        pokemon=PokemonInfo(
            name=pokemon.name,
            sprite_url=pokemon.sprite_url,
            type_1=pokemon.type_1,
            poke_id=pokemon.poke_id
        )
    )