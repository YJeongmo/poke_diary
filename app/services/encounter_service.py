# pokemon-fastapi-project/app/services/encounter_service.py

from sqlmodel import Session, select
from app.models import Pokemon
from typing import Dict, List, Tuple
import json
import random
from pathlib import Path

# --- 헬퍼 함수: 가중치 파일 로드 ---

def load_encounter_weights():
    """가중치 JSON 파일을 로드합니다. (app/data/ 경로 사용)"""
    try:
        # ⭐️ app/data/ 경로를 기준으로 로드 ⭐️
        data_path = Path(__file__).parent.parent / "data" / "encounter_weights.json"

        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("경고: encounter_weights.json 파일을 찾을 수 없습니다. 조우 로직을 건너뜁니다.")
        return {"weights": {}, "rarity": {"base_weight": 1.0, "gain": 0.0, "penalty": 0.0, "max_weight": 1.0, "min_weight": 1.0}}

# 가중치 데이터를 전역 변수로 저장
ENCOUNTER_WEIGHTS = load_encounter_weights()


# --- 헬퍼 함수: 포켓몬 등장 로직 (가중치 기반) ---

def select_weighted_pokemon(
        analysis: Dict[str, str],
        user_reflection: str, # 사용자 일지 텍스트
        db_session: Session
) -> Pokemon:
    """
    GPT 분석 결과, 사용자 일지, 타입별 가중치를 기반으로 포켓몬을 선택합니다.
    (로직은 이전 답변의 최종 구현 로직과 동일합니다.)
    """
    weights_config = ENCOUNTER_WEIGHTS.get("weights", {})
    rarity_config = ENCOUNTER_WEIGHTS.get("rarity", {})

    BASE_WEIGHT = rarity_config.get("base_weight", 1.0)
    GAIN = rarity_config.get("gain", 0.5)
    PENALTY = rarity_config.get("penalty", -0.3)
    MAX_WEIGHT = rarity_config.get("max_weight", 3.0)
    MIN_WEIGHT = rarity_config.get("min_weight", 0.1)

    all_pokemon = db_session.exec(select(Pokemon)).all()
    weighted_pokemon_list: List[Tuple[Pokemon, float]] = []

    if not all_pokemon:
        # 포켓몬 데이터가 없을 경우 예외 처리
        return None

    gpt_factors = list(analysis.values())

    # 사용자 일지에서 가중/경감 키워드를 포함하는지 검사합니다.
    reflection_factors = [
        keyword for type_weights in weights_config.values()
        for action in type_weights.keys()
        for keyword in type_weights.get(action, [])
        if keyword.lower() in user_reflection.lower()
    ]

    all_factors = gpt_factors + reflection_factors

    for pokemon in all_pokemon:
        # 포켓몬 타입 (대문자로 시작하도록 처리)
        types = [t.capitalize() for t in [pokemon.type_1, pokemon.type_2] if t]
        final_weight = BASE_WEIGHT

        for type_name in types:
            # *사용자님의 JSON이 한글 타입 규칙을 사용한다고 가정*
            type_rule = weights_config.get(type_name, {})

            for factor in all_factors:
                if factor in type_rule.get("가중", []):
                    final_weight += GAIN
                elif factor in type_rule.get("경감", []):
                    final_weight += PENALTY

        final_weight = max(MIN_WEIGHT, min(MAX_WEIGHT, final_weight))
        weighted_pokemon_list.append((pokemon, final_weight))

    # 4. 가중치 기반 랜덤 선택
    pokemons, weights = zip(*weighted_pokemon_list)

    if sum(weights) == 0:
        return random.choice(all_pokemon)

    chosen_pokemon = random.choices(pokemons, weights=weights, k=1)[0]
    return chosen_pokemon