# pokemon-fastapi-project/app/services/badge_service.py

from sqlmodel import Session, select, func
from app.models import DailyEncounterLog, Pokemon, User
from typing import Dict, List, Tuple

# 뱃지 조건 정의 (요청하신 세부사항 기반)
ENCOUNTER_BADGES = [
    {"name": "몬스터볼", "threshold": 1, "description": "첫 번째 포켓몬 조우", "image": "monster_ball.webp", "version": "1"},
    {"name": "프리미어볼", "threshold": 10, "description": "10마리 조우 달성", "image": "premier_ball.webp", "version": "1"},
    {"name": "슈퍼볼", "threshold": 50, "description": "50마리 조우 달성", "image": "super_ball.webp", "version": "1"},
    {"name": "하이퍼볼", "threshold": 150, "description": "150마리 조우 달성", "image": "hyper_ball.webp", "version": "1"},
    {"name": "마스터볼", "threshold": 210, "description": "모든 포켓몬 조우 (도감 완성)", "image": "master_ball.webp", "version": "2"},
]

TYPE_BADGE_CONFIG = [
    {"type_key": "풀", "name": "풀 타입 마스터", "threshold": 3, "description": "풀 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/풀.svg"},
    {"type_key": "불꽃", "name": "불꽃 타입 마스터", "threshold": 3, "description": "불꽃 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/불꽃.svg"},
    {"type_key": "물", "name": "물 타입 마스터", "threshold": 3, "description": "물 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/물.svg"},
    {"type_key": "전기", "name": "전기 타입 마스터", "threshold": 3, "description": "전기 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/전기.svg"},
    {"type_key": "얼음", "name": "얼음 타입 마스터", "threshold": 2, "description": "얼음 타입 포켓몬을 2마리 이상 조우하세요.", "image": "type/얼음.svg"},
    {"type_key": "격투", "name": "격투 타입 마스터", "threshold": 3, "description": "격투 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/격투.svg"},
    {"type_key": "독", "name": "독 타입 마스터", "threshold": 3, "description": "독 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/독.svg"},
    {"type_key": "땅", "name": "땅 타입 마스터", "threshold": 3, "description": "땅 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/땅.svg"},
    {"type_key": "비행", "name": "비행 타입 마스터", "threshold": 3, "description": "비행 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/비행.svg"},
    {"type_key": "바위", "name": "바위 타입 마스터", "threshold": 3, "description": "바위 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/바위.svg"},
    {"type_key": "강철", "name": "강철 타입 마스터", "threshold": 3, "description": "강철 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/강철.svg"},
    {"type_key": "노말", "name": "노말 타입 마스터", "threshold": 3, "description": "노말 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/노말.svg"},
    {"type_key": "벌레", "name": "벌레 타입 마스터", "threshold": 3, "description": "벌레 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/벌레.svg"},
    {"type_key": "고스트", "name": "고스트 타입 마스터", "threshold": 2, "description": "고스트 타입 포켓몬을 2마리 이상 조우하세요.", "image": "type/고스트.svg"},
    {"type_key": "드래곤", "name": "드래곤 타입 마스터", "threshold": 2, "description": "드래곤 타입 포켓몬을 2마리 이상 조우하세요.", "image": "type/드래곤.svg"},
    {"type_key": "악", "name": "악 타입 마스터", "threshold": 2, "description": "악 타입 포켓몬을 2마리 이상 조우하세요.", "image": "type/악.svg"},
    {"type_key": "에스퍼", "name": "에스퍼 타입 마스터", "threshold": 3, "description": "에스퍼 타입 포켓몬을 3마리 이상 조우하세요.", "image": "type/에스퍼.svg"},
]

class BadgeService:
    def __init__(self, session: Session):
        self.session = session

    def get_user_badges(self, user_id: int) -> Dict[str, any]:
        """
        사용자 ID를 기반으로 뱃지 획득 현황을 반환합니다.
        (조우 마릿수 기준)
        """
        # 1. 유저의 총 조우 기록 수 계산 (뱃지 기능을 위한 기초 데이터)
        total_encounters_stmt = select(func.count()).where(
            DailyEncounterLog.user_id == user_id
        )
        # 총 기록 수 (중복 포함)
        total_encounters = self.session.exec(total_encounters_stmt).one()

        # 1-1. 전체 포켓몬 수 (도감 기준)
        total_pokemon_stmt = select(func.count()).select_from(Pokemon)
        total_pokemon_count = self.session.exec(total_pokemon_stmt).one()

        # 2. 유니크 조우 포켓몬 수 계산 (도감 완성도 기준)
        unique_encountered_stmt = select(
            func.count(DailyEncounterLog.pokemon_id.distinct())
        ).where(
            DailyEncounterLog.user_id == user_id
        )
        total_unique_count = self.session.exec(unique_encountered_stmt).one()

        # 2-1. admin 계정(admin@poke.dp)은 테스트 편의를 위해
        # 전체 포켓몬을 모두 조우한 것으로 간주하여 뱃지를 모두 획득한 상태로 표시
        user = self.session.get(User, user_id)
        if user and user.email == "admin@poke.dp":
            total_unique_count = total_pokemon_count
            total_encounters = total_pokemon_count

        # 3. 뱃지 획득 여부 판단
        badges_status = []
        for badge in ENCOUNTER_BADGES:
            is_achieved = total_unique_count >= badge["threshold"]
            # 마스터볼은 최신 버전(배경 없는 버전)을 위해 버전 쿼리 추가
            version_param = f"?v={badge.get('version', '1')}" if badge.get('version') else ""
            badges_status.append({
                "category": "조우 마릿수",
                "name": badge["name"],
                "achieved": is_achieved,
                "current": total_unique_count,
                "target": badge["threshold"],
                "description": badge["description"],
                "badge_image": f"http://43.200.8.171/useImage/{badge['image']}{version_param}",
            })

        # 4. 타입별 뱃지 계산
        from collections import defaultdict
        encountered_pokemon_stmt = select(Pokemon).join(
            DailyEncounterLog,
            DailyEncounterLog.pokemon_id == Pokemon.id
        ).where(
            DailyEncounterLog.user_id == user_id
        ).distinct()

        encountered_pokemons = self.session.exec(encountered_pokemon_stmt).all()

        type_counts = defaultdict(int)
        type_totals = defaultdict(int)

        all_pokemons = self.session.exec(select(Pokemon)).all()
        for p in all_pokemons:
            for t in filter(None, [p.type_1, p.type_2]):
                type_totals[t] += 1

        for pokemon in encountered_pokemons:
            for type_name in filter(None, [pokemon.type_1, pokemon.type_2]):
                type_counts[type_name] += 1

        # admin 계정은 타입별로도 모든 포켓몬을 조우한 것으로 간주
        if user and user.email == "admin@poke.dp":
            for type_name, total in type_totals.items():
                type_counts[type_name] = total

        for config in TYPE_BADGE_CONFIG:
            type_key = config["type_key"]
            current_count = type_counts.get(type_key, 0)
            total_needed = type_totals.get(type_key, 0)
            badges_status.append({
                "category": "타입 마스터",
                "name": config["name"],
                "type_key": type_key,
                "achieved": total_needed > 0 and current_count >= total_needed,
                "current": current_count,
                "target": total_needed,
                "description": config["description"],
                "badge_image": f"http://43.200.8.171/useImage/{config['image']}",
            })

        return {
            "total_unique_encountered": total_unique_count,
            "total_encounters_all": total_encounters,
            "badges": badges_status
        }