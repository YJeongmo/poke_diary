# pokemon-fastapi-project/app/routers/log_router.py (전체 수정)

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Form, status
from fastapi.responses import JSONResponse
from sqlmodel import Session
from openai import OpenAI
from dotenv import load_dotenv

import os
import base64
import json
import random
from typing import Dict, List, Tuple

from app.database import get_session
from app.models import Pokemon, DailyEncounterLog, DailyEncounterLogBase, User
from app.security import get_current_user
from app.services.encounter_service import select_weighted_pokemon

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
        # 1. 이미지 분석
        image_bytes = await image_file.read()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        analysis_result = get_image_analysis(base64_image)

        # 2. ⭐️⭐️⭐️ 조우 로직 위임 ⭐️⭐️⭐️
        encountered_pokemon = select_weighted_pokemon(
            analysis_result,
            user_reflection,
            session
        )

        if encountered_pokemon is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="포켓몬 데이터를 찾을 수 없습니다.")

        # 3. Log 모델 생성 및 DB에 저장
        new_log_data = DailyEncounterLogBase(
            # Log 모델 키와 GPT 분석 결과 키가 일치해야 함 (location_gpt, season_gpt 등)
            **analysis_result, # ⭐️ 분석 결과를 바로 언패킹하여 사용 ⭐️
            user_reflection=user_reflection,
            photo_url="TODO: 이미지 저장소 URL",
        )

        new_log = DailyEncounterLog(
            **new_log_data.model_dump(exclude_unset=True),
            pokemon_id=encountered_pokemon.id,
            user_id=current_user.id
        )

        session.add(new_log)
        session.commit()
        session.refresh(new_log)

        # 4. 결과 반환
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