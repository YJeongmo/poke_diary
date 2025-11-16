# pokemon-fastapi-project/app/services/pokedex_service.py

from sqlmodel import Session, select
from app.models import Pokemon, DailyEncounterLog, User
from typing import Dict, List, Set, Any

class PokedexService:
    def __init__(self, session: Session):
        self.session = session

    def get_user_pokedex(self, user_id: int) -> Dict[str, Any]:
        """
        사용자 ID를 기반으로 도감 현황 데이터를 구성하여 반환합니다.
        (신오 도감 번호 순서로 정렬)
        """
        # 1. 유저가 조우한 포켓몬 ID 목록 가져오기
        encountered_ids_stmt = select(
            DailyEncounterLog.pokemon_id
        ).where(
            DailyEncounterLog.user_id == user_id
        ).distinct()

        # Set으로 변환하여 조회 효율 최적화
        encountered_ids: Set[int] = set(self.session.exec(encountered_ids_stmt).all())

        # 2. 모든 포켓몬을 신오 도감 번호 순으로 한 번만 가져오기
        all_pokemons_stmt = select(Pokemon).order_by(
            Pokemon.sinnoh_poke_id
        )
        all_pokemons = self.session.exec(all_pokemons_stmt).all()

        # 2-1. admin 계정(admin@poke.dp)은 모든 포켓몬을 조우한 것으로 처리
        user = self.session.get(User, user_id)
        if user and user.email == "admin@poke.dp":
            encountered_ids = {poke.id for poke in all_pokemons}

        pokedex_list = []
        total_unique_count = 0

        # 3. 올바르게 정렬된 all_pokemons 리스트를 순회하며 결과 구성
        for poke in all_pokemons:
            is_encountered = poke.id in encountered_ids # DB 내부 ID로 체크

            pokedex_list.append({
                "poke_id": poke.poke_id,          # 전국도감 번호 (National ID)
                "sinnoh_poke_id": poke.sinnoh_poke_id, # ⭐️ 신오도감 번호 포함 (프론트엔드 표기 및 정렬 기준) ⭐️
                "name": poke.name,
                "type_1": poke.type_1,
                "type_2": poke.type_2,
                "sprite_url": poke.sprite_url,
                "encountered": is_encountered,
            })

            if is_encountered:
                total_unique_count += 1

        # ⭐️⭐️⭐️ 4. 중복 쿼리 제거 및 최종 데이터 반환 ⭐️⭐️⭐️
        return {
            "total_pokedex_count": len(all_pokemons),
            "total_unique_encountered": total_unique_count,
            "pokedex": pokedex_list
        }