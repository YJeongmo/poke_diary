# pokemon-fastapi-project/app/data_setup.py

import httpx
from sqlmodel import select
from app.database import SessionLocal
from app.models import Pokemon, PokemonBase
import asyncio

# --- 🎯 신오도감 데이터 정의 ---
SINNOH_POKEMONS = [
    {
        "sinnoh_pokedex_number": 1,
        "national_pokedex_number": 387,
        "name_en": "Turtwig",
        "name_kr": "모부기",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 2,
        "national_pokedex_number": 388,
        "name_en": "Grotle",
        "name_kr": "수풀부기",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 3,
        "national_pokedex_number": 389,
        "name_en": "Torterra",
        "name_kr": "토대부기",
        "type1": "풀",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 4,
        "national_pokedex_number": 390,
        "name_en": "Chimchar",
        "name_kr": "불꽃숭이",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 5,
        "national_pokedex_number": 391,
        "name_en": "Monferno",
        "name_kr": "파이숭이",
        "type1": "불꽃",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 6,
        "national_pokedex_number": 392,
        "name_en": "Infernape",
        "name_kr": "초염몽",
        "type1": "불꽃",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 7,
        "national_pokedex_number": 393,
        "name_en": "Piplup",
        "name_kr": "팽도리",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 8,
        "national_pokedex_number": 394,
        "name_en": "Prinplup",
        "name_kr": "팽태자",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 9,
        "national_pokedex_number": 395,
        "name_en": "Empoleon",
        "name_kr": "엠페르트",
        "type1": "물",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 10,
        "national_pokedex_number": 396,
        "name_en": "Starly",
        "name_kr": "찌르꼬",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 11,
        "national_pokedex_number": 397,
        "name_en": "Staravia",
        "name_kr": "찌르버드",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 12,
        "national_pokedex_number": 398,
        "name_en": "Staraptor",
        "name_kr": "찌르호크",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 13,
        "national_pokedex_number": 399,
        "name_en": "Bidoof",
        "name_kr": "비버니",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 14,
        "national_pokedex_number": 400,
        "name_en": "Bibarel",
        "name_kr": "비버통",
        "type1": "노말",
        "type2": "물"
    },
    {
        "sinnoh_pokedex_number": 15,
        "national_pokedex_number": 401,
        "name_en": "Kricketot",
        "name_kr": "귀뚤뚜기",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 16,
        "national_pokedex_number": 402,
        "name_en": "Kricketune",
        "name_kr": "귀뚤톡크",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 17,
        "national_pokedex_number": 403,
        "name_en": "Shinx",
        "name_kr": "꼬링크",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 18,
        "national_pokedex_number": 404,
        "name_en": "Luxio",
        "name_kr": "럭시오",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 19,
        "national_pokedex_number": 405,
        "name_en": "Luxray",
        "name_kr": "렌트라",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 20,
        "national_pokedex_number": 63,
        "name_en": "Abra",
        "name_kr": "캐이시",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 21,
        "national_pokedex_number": 64,
        "name_en": "Kadabra",
        "name_kr": "윤겔라",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 22,
        "national_pokedex_number": 65,
        "name_en": "Alakazam",
        "name_kr": "후딘",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 23,
        "national_pokedex_number": 129,
        "name_en": "Magikarp",
        "name_kr": "잉어킹",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 24,
        "national_pokedex_number": 130,
        "name_en": "Gyarados",
        "name_kr": "갸라도스",
        "type1": "물",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 25,
        "national_pokedex_number": 406,
        "name_en": "Budew",
        "name_kr": "꼬몽울",
        "type1": "풀",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 26,
        "national_pokedex_number": 315,
        "name_en": "Roselia",
        "name_kr": "로젤리아",
        "type1": "풀",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 27,
        "national_pokedex_number": 407,
        "name_en": "Roserade",
        "name_kr": "로즈레이드",
        "type1": "풀",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 28,
        "national_pokedex_number": 41,
        "name_en": "Zubat",
        "name_kr": "주뱃",
        "type1": "독",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 29,
        "national_pokedex_number": 42,
        "name_en": "Golbat",
        "name_kr": "골뱃",
        "type1": "독",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 30,
        "national_pokedex_number": 169,
        "name_en": "Crobat",
        "name_kr": "크로뱃",
        "type1": "독",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 31,
        "national_pokedex_number": 74,
        "name_en": "Geodude",
        "name_kr": "꼬마돌",
        "type1": "바위",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 32,
        "national_pokedex_number": 75,
        "name_en": "Graveler",
        "name_kr": "데구리",
        "type1": "바위",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 33,
        "national_pokedex_number": 76,
        "name_en": "Golem",
        "name_kr": "딱구리",
        "type1": "바위",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 34,
        "national_pokedex_number": 95,
        "name_en": "Onix",
        "name_kr": "롱스톤",
        "type1": "바위",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 35,
        "national_pokedex_number": 208,
        "name_en": "Steelix",
        "name_kr": "강철톤",
        "type1": "강철",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 36,
        "national_pokedex_number": 408,
        "name_en": "Cranidos",
        "name_kr": "두개도스",
        "type1": "바위",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 37,
        "national_pokedex_number": 409,
        "name_en": "Rampardos",
        "name_kr": "램펄드",
        "type1": "바위",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 38,
        "national_pokedex_number": 410,
        "name_en": "Shieldon",
        "name_kr": "방패톱스",
        "type1": "바위",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 39,
        "national_pokedex_number": 411,
        "name_en": "Bastiodon",
        "name_kr": "바리톱스",
        "type1": "바위",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 40,
        "national_pokedex_number": 66,
        "name_en": "Machop",
        "name_kr": "알통몬",
        "type1": "격투",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 41,
        "national_pokedex_number": 67,
        "name_en": "Machoke",
        "name_kr": "근육몬",
        "type1": "격투",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 42,
        "national_pokedex_number": 68,
        "name_en": "Machamp",
        "name_kr": "괴력몬",
        "type1": "격투",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 43,
        "national_pokedex_number": 54,
        "name_en": "Psyduck",
        "name_kr": "고라파덕",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 44,
        "national_pokedex_number": 55,
        "name_en": "Golduck",
        "name_kr": "골덕",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 45,
        "national_pokedex_number": 412,
        "name_en": "Burmy",
        "name_kr": "도롱충이",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 46,
        "national_pokedex_number": 413,
        "name_en": "Wormadam",
        "name_kr": "도롱마담",
        "type1": "벌레",
        "type2": "풀"
    },
    {
        "sinnoh_pokedex_number": 47,
        "national_pokedex_number": 414,
        "name_en": "Mothim",
        "name_kr": "나메일",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 48,
        "national_pokedex_number": 265,
        "name_en": "Wurmple",
        "name_kr": "개무소",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 49,
        "national_pokedex_number": 266,
        "name_en": "Silcoon",
        "name_kr": "실쿤",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 50,
        "national_pokedex_number": 267,
        "name_en": "Beautifly",
        "name_kr": "뷰티플라이",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 51,
        "national_pokedex_number": 268,
        "name_en": "Cascoon",
        "name_kr": "카스쿤",
        "type1": "벌레",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 52,
        "national_pokedex_number": 269,
        "name_en": "Dustox",
        "name_kr": "독케일",
        "type1": "벌레",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 53,
        "national_pokedex_number": 415,
        "name_en": "Combee",
        "name_kr": "세꿀버리",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 54,
        "national_pokedex_number": 416,
        "name_en": "Vespiquen",
        "name_kr": "비퀸",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 55,
        "national_pokedex_number": 417,
        "name_en": "Pachirisu",
        "name_kr": "파치리스",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 56,
        "national_pokedex_number": 418,
        "name_en": "Buizel",
        "name_kr": "브이젤",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 57,
        "national_pokedex_number": 419,
        "name_en": "Floatzel",
        "name_kr": "플로젤",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 58,
        "national_pokedex_number": 420,
        "name_en": "Cherubi",
        "name_kr": "체리버",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 59,
        "national_pokedex_number": 421,
        "name_en": "Cherrim",
        "name_kr": "체리꼬",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 60,
        "national_pokedex_number": 422,
        "name_en": "Shellos",
        "name_kr": "깝질무",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 61,
        "national_pokedex_number": 423,
        "name_en": "Gastrodon",
        "name_kr": "트리토돈",
        "type1": "물",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 62,
        "national_pokedex_number": 214,
        "name_en": "Heracross",
        "name_kr": "헤라크로스",
        "type1": "벌레",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 63,
        "national_pokedex_number": 190,
        "name_en": "Aipom",
        "name_kr": "에이팜",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 64,
        "national_pokedex_number": 424,
        "name_en": "Ambipom",
        "name_kr": "겟핸보숭",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 65,
        "national_pokedex_number": 425,
        "name_en": "Drifloon",
        "name_kr": "흔들풍손",
        "type1": "고스트",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 66,
        "national_pokedex_number": 426,
        "name_en": "Drifblim",
        "name_kr": "둥실라이드",
        "type1": "고스트",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 67,
        "national_pokedex_number": 427,
        "name_en": "Buneary",
        "name_kr": "이어롤",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 68,
        "national_pokedex_number": 428,
        "name_en": "Lopunny",
        "name_kr": "이어롭",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 69,
        "national_pokedex_number": 92,
        "name_en": "Gastly",
        "name_kr": "고오스",
        "type1": "고스트",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 70,
        "national_pokedex_number": 93,
        "name_en": "Haunter",
        "name_kr": "고우스트",
        "type1": "고스트",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 71,
        "national_pokedex_number": 94,
        "name_en": "Gengar",
        "name_kr": "팬텀",
        "type1": "고스트",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 72,
        "national_pokedex_number": 200,
        "name_en": "Misdreavus",
        "name_kr": "무우마",
        "type1": "고스트",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 73,
        "national_pokedex_number": 429,
        "name_en": "Mismagius",
        "name_kr": "무우마직",
        "type1": "고스트",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 74,
        "national_pokedex_number": 198,
        "name_en": "Murkrow",
        "name_kr": "니로우",
        "type1": "악",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 75,
        "national_pokedex_number": 430,
        "name_en": "Honchkrow",
        "name_kr": "돈크로우",
        "type1": "악",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 76,
        "national_pokedex_number": 431,
        "name_en": "Glameow",
        "name_kr": "나옹마",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 77,
        "national_pokedex_number": 432,
        "name_en": "Purugly",
        "name_kr": "몬냥이",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 78,
        "national_pokedex_number": 118,
        "name_en": "Goldeen",
        "name_kr": "콘치",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 79,
        "national_pokedex_number": 119,
        "name_en": "Seaking",
        "name_kr": "왕콘치",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 80,
        "national_pokedex_number": 339,
        "name_en": "Barboach",
        "name_kr": "미꾸리",
        "type1": "물",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 81,
        "national_pokedex_number": 340,
        "name_en": "Whiscash",
        "name_kr": "메깅",
        "type1": "물",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 82,
        "national_pokedex_number": 433,
        "name_en": "Chingling",
        "name_kr": "랑딸랑",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 83,
        "national_pokedex_number": 358,
        "name_en": "Chimecho",
        "name_kr": "치렁",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 84,
        "national_pokedex_number": 434,
        "name_en": "Stunky",
        "name_kr": "스컹뿡",
        "type1": "독",
        "type2": "악"
    },
    {
        "sinnoh_pokedex_number": 85,
        "national_pokedex_number": 435,
        "name_en": "Skuntank",
        "name_kr": "스컹탱크",
        "type1": "독",
        "type2": "악"
    },
    {
        "sinnoh_pokedex_number": 86,
        "national_pokedex_number": 307,
        "name_en": "Meditite",
        "name_kr": "요가랑",
        "type1": "격투",
        "type2": "에스퍼"
    },
    {
        "sinnoh_pokedex_number": 87,
        "national_pokedex_number": 308,
        "name_en": "Medicham",
        "name_kr": "요가램",
        "type1": "격투",
        "type2": "에스퍼"
    },
    {
        "sinnoh_pokedex_number": 88,
        "national_pokedex_number": 436,
        "name_en": "Bronzor",
        "name_kr": "동미러",
        "type1": "강철",
        "type2": "에스퍼"
    },
    {
        "sinnoh_pokedex_number": 89,
        "national_pokedex_number": 437,
        "name_en": "Bronzong",
        "name_kr": "동탁군",
        "type1": "강철",
        "type2": "에스퍼"
    },
    {
        "sinnoh_pokedex_number": 90,
        "national_pokedex_number": 77,
        "name_en": "Ponyta",
        "name_kr": "포니타",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 91,
        "national_pokedex_number": 78,
        "name_en": "Rapidash",
        "name_kr": "날쌩마",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 92,
        "national_pokedex_number": 438,
        "name_en": "Bonsly",
        "name_kr": "꼬지지",
        "type1": "바위",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 93,
        "national_pokedex_number": 185,
        "name_en": "Sudowoodo",
        "name_kr": "꼬지모",
        "type1": "바위",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 94,
        "national_pokedex_number": 439,
        "name_en": "Mime Jr.",
        "name_kr": "흉내내",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 95,
        "national_pokedex_number": 122,
        "name_en": "Mr. Mime",
        "name_kr": "마임맨",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 96,
        "national_pokedex_number": 440,
        "name_en": "Happiny",
        "name_kr": "핑복",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 97,
        "national_pokedex_number": 113,
        "name_en": "Chansey",
        "name_kr": "럭키",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 98,
        "national_pokedex_number": 242,
        "name_en": "Blissey",
        "name_kr": "해피너스",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 99,
        "national_pokedex_number": 173,
        "name_en": "Cleffa",
        "name_kr": "삐",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 100,
        "national_pokedex_number": 35,
        "name_en": "Clefairy",
        "name_kr": "삐삐",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 101,
        "national_pokedex_number": 36,
        "name_en": "Clefable",
        "name_kr": "픽시",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 102,
        "national_pokedex_number": 441,
        "name_en": "Chatot",
        "name_kr": "페라페",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 103,
        "national_pokedex_number": 172,
        "name_en": "Pichu",
        "name_kr": "피츄",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 104,
        "national_pokedex_number": 25,
        "name_en": "Pikachu",
        "name_kr": "피카츄",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 105,
        "national_pokedex_number": 26,
        "name_en": "Raichu",
        "name_kr": "라이츄",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 106,
        "national_pokedex_number": 163,
        "name_en": "Hoothoot",
        "name_kr": "부우부",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 107,
        "national_pokedex_number": 164,
        "name_en": "Noctowl",
        "name_kr": "야부엉",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 108,
        "national_pokedex_number": 442,
        "name_en": "Spiritomb",
        "name_kr": "화강돌",
        "type1": "고스트",
        "type2": "악"
    },
    {
        "sinnoh_pokedex_number": 109,
        "national_pokedex_number": 443,
        "name_en": "Gible",
        "name_kr": "딥상어동",
        "type1": "드래곤",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 110,
        "national_pokedex_number": 444,
        "name_en": "Gabite",
        "name_kr": "한바이트",
        "type1": "드래곤",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 111,
        "national_pokedex_number": 445,
        "name_en": "Garchomp",
        "name_kr": "한카리아스",
        "type1": "드래곤",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 112,
        "national_pokedex_number": 446,
        "name_en": "Munchlax",
        "name_kr": "먹고자",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 113,
        "national_pokedex_number": 143,
        "name_en": "Snorlax",
        "name_kr": "잠만보",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 114,
        "national_pokedex_number": 201,
        "name_en": "Unown",
        "name_kr": "안농",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 115,
        "national_pokedex_number": 447,
        "name_en": "Riolu",
        "name_kr": "리오르",
        "type1": "격투",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 116,
        "national_pokedex_number": 448,
        "name_en": "Lucario",
        "name_kr": "루카리오",
        "type1": "격투",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 117,
        "national_pokedex_number": 194,
        "name_en": "Wooper",
        "name_kr": "우파",
        "type1": "물",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 118,
        "national_pokedex_number": 195,
        "name_en": "Quagsire",
        "name_kr": "누오",
        "type1": "물",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 119,
        "national_pokedex_number": 278,
        "name_en": "Wingull",
        "name_kr": "갈모매",
        "type1": "물",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 120,
        "national_pokedex_number": 279,
        "name_en": "Pelipper",
        "name_kr": "패리퍼",
        "type1": "물",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 121,
        "national_pokedex_number": 203,
        "name_en": "Girafarig",
        "name_kr": "키링키",
        "type1": "노말",
        "type2": "에스퍼"
    },
    {
        "sinnoh_pokedex_number": 122,
        "national_pokedex_number": 449,
        "name_en": "Hippopotas",
        "name_kr": "히포포타스",
        "type1": "땅",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 123,
        "national_pokedex_number": 450,
        "name_en": "Hippowdon",
        "name_kr": "하마돈",
        "type1": "땅",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 124,
        "national_pokedex_number": 298,
        "name_en": "Azurill",
        "name_kr": "루리리",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 125,
        "national_pokedex_number": 183,
        "name_en": "Marill",
        "name_kr": "마릴",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 126,
        "national_pokedex_number": 184,
        "name_en": "Azumarill",
        "name_kr": "마릴리",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 127,
        "national_pokedex_number": 451,
        "name_en": "Skorupi",
        "name_kr": "스콜피",
        "type1": "독",
        "type2": "벌레"
    },
    {
        "sinnoh_pokedex_number": 128,
        "national_pokedex_number": 452,
        "name_en": "Drapion",
        "name_kr": "드래피온",
        "type1": "독",
        "type2": "악"
    },
    {
        "sinnoh_pokedex_number": 129,
        "national_pokedex_number": 453,
        "name_en": "Croagunk",
        "name_kr": "삐딱구리",
        "type1": "독",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 130,
        "national_pokedex_number": 454,
        "name_en": "Toxicroak",
        "name_kr": "독개굴",
        "type1": "독",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 131,
        "national_pokedex_number": 455,
        "name_en": "Carnivine",
        "name_kr": "무스틈니",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 132,
        "national_pokedex_number": 223,
        "name_en": "Remoraid",
        "name_kr": "총어",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 133,
        "national_pokedex_number": 224,
        "name_en": "Octillery",
        "name_kr": "대포무노",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 134,
        "national_pokedex_number": 456,
        "name_en": "Finneon",
        "name_kr": "형광어",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 135,
        "national_pokedex_number": 457,
        "name_en": "Lumineon",
        "name_kr": "네오라이트",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 136,
        "national_pokedex_number": 72,
        "name_en": "Tentacool",
        "name_kr": "왕눈해",
        "type1": "물",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 137,
        "national_pokedex_number": 73,
        "name_en": "Tentacruel",
        "name_kr": "독파리",
        "type1": "물",
        "type2": "독"
    },
    {
        "sinnoh_pokedex_number": 138,
        "national_pokedex_number": 349,
        "name_en": "Feebas",
        "name_kr": "빈티나",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 139,
        "national_pokedex_number": 350,
        "name_en": "Milotic",
        "name_kr": "밀로틱",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 140,
        "national_pokedex_number": 458,
        "name_en": "Mantyke",
        "name_kr": "타만타",
        "type1": "물",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 141,
        "national_pokedex_number": 226,
        "name_en": "Mantine",
        "name_kr": "만타인",
        "type1": "물",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 142,
        "national_pokedex_number": 459,
        "name_en": "Snover",
        "name_kr": "눈쓰개",
        "type1": "풀",
        "type2": "얼음"
    },
    {
        "sinnoh_pokedex_number": 143,
        "national_pokedex_number": 460,
        "name_en": "Abomasnow",
        "name_kr": "눈설왕",
        "type1": "풀",
        "type2": "얼음"
    },
    {
        "sinnoh_pokedex_number": 144,
        "national_pokedex_number": 215,
        "name_en": "Sneasel",
        "name_kr": "포푸니",
        "type1": "악",
        "type2": "얼음"
    },
    {
        "sinnoh_pokedex_number": 145,
        "national_pokedex_number": 461,
        "name_en": "Weavile",
        "name_kr": "포푸니라",
        "type1": "악",
        "type2": "얼음"
    },
    {
        "sinnoh_pokedex_number": 146,
        "national_pokedex_number": 480,
        "name_en": "Uxie",
        "name_kr": "유크시",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 147,
        "national_pokedex_number": 481,
        "name_en": "Mesprit",
        "name_kr": "엠라이트",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 148,
        "national_pokedex_number": 482,
        "name_en": "Azelf",
        "name_kr": "아그놈",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 149,
        "national_pokedex_number": 483,
        "name_en": "Dialga",
        "name_kr": "디아루가",
        "type1": "강철",
        "type2": "드래곤"
    },
    {
        "sinnoh_pokedex_number": 150,
        "national_pokedex_number": 484,
        "name_en": "Palkia",
        "name_kr": "펄기아",
        "type1": "물",
        "type2": "드래곤"
    },
    {
        "sinnoh_pokedex_number": 151,
        "national_pokedex_number": 490,
        "name_en": "Manaphy",
        "name_kr": "마나피",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 152,
        "national_pokedex_number": 479,
        "name_en": "Rotom",
        "name_kr": "로토무",
        "type1": "전기",
        "type2": "고스트"
    },
    {
        "sinnoh_pokedex_number": 153,
        "national_pokedex_number": 207,
        "name_en": "Gligar",
        "name_kr": "글라이거",
        "type1": "땅",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 154,
        "national_pokedex_number": 472,
        "name_en": "Gliscor",
        "name_kr": "글라이온",
        "type1": "땅",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 155,
        "national_pokedex_number": 299,
        "name_en": "Nosepass",
        "name_kr": "코코파스",
        "type1": "바위",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 156,
        "national_pokedex_number": 476,
        "name_en": "Probopass",
        "name_kr": "대코파스",
        "type1": "바위",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 157,
        "national_pokedex_number": 280,
        "name_en": "Ralts",
        "name_kr": "랄토스",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 158,
        "national_pokedex_number": 281,
        "name_en": "Kirlia",
        "name_kr": "킬리아",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 159,
        "national_pokedex_number": 282,
        "name_en": "Gardevoir",
        "name_kr": "가디안",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 160,
        "national_pokedex_number": 475,
        "name_en": "Gallade",
        "name_kr": "엘레이드",
        "type1": "에스퍼",
        "type2": "격투"
    },
    {
        "sinnoh_pokedex_number": 161,
        "national_pokedex_number": 108,
        "name_en": "Lickitung",
        "name_kr": "내루미",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 162,
        "national_pokedex_number": 463,
        "name_en": "Lickilicky",
        "name_kr": "내룸벨트",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 163,
        "national_pokedex_number": 133,
        "name_en": "Eevee",
        "name_kr": "이브이",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 164,
        "national_pokedex_number": 134,
        "name_en": "Vaporeon",
        "name_kr": "샤미드",
        "type1": "물",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 165,
        "national_pokedex_number": 135,
        "name_en": "Jolteon",
        "name_kr": "쥬피썬더",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 166,
        "national_pokedex_number": 136,
        "name_en": "Flareon",
        "name_kr": "부스터",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 167,
        "national_pokedex_number": 196,
        "name_en": "Espeon",
        "name_kr": "에브이",
        "type1": "에스퍼",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 168,
        "national_pokedex_number": 197,
        "name_en": "Umbreon",
        "name_kr": "블래키",
        "type1": "악",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 169,
        "national_pokedex_number": 470,
        "name_en": "Leafeon",
        "name_kr": "리피아",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 170,
        "national_pokedex_number": 471,
        "name_en": "Glaceon",
        "name_kr": "글레이시아",
        "type1": "얼음",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 171,
        "national_pokedex_number": 333,
        "name_en": "Swablu",
        "name_kr": "파비코",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 172,
        "national_pokedex_number": 334,
        "name_en": "Altaria",
        "name_kr": "파비코리",
        "type1": "드래곤",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 173,
        "national_pokedex_number": 175,
        "name_en": "Togepi",
        "name_kr": "토게피",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 174,
        "national_pokedex_number": 176,
        "name_en": "Togetic",
        "name_kr": "토게틱",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 175,
        "national_pokedex_number": 468,
        "name_en": "Togekiss",
        "name_kr": "토게키스",
        "type1": "노말",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 176,
        "national_pokedex_number": 228,
        "name_en": "Houndour",
        "name_kr": "델빌",
        "type1": "악",
        "type2": "불꽃"
    },
    {
        "sinnoh_pokedex_number": 177,
        "national_pokedex_number": 229,
        "name_en": "Houndoom",
        "name_kr": "헬가",
        "type1": "악",
        "type2": "불꽃"
    },
    {
        "sinnoh_pokedex_number": 178,
        "national_pokedex_number": 81,
        "name_en": "Magnemite",
        "name_kr": "코일",
        "type1": "전기",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 179,
        "national_pokedex_number": 82,
        "name_en": "Magneton",
        "name_kr": "레어코일",
        "type1": "전기",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 180,
        "national_pokedex_number": 462,
        "name_en": "Magnezone",
        "name_kr": "자포코일",
        "type1": "전기",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 181,
        "national_pokedex_number": 114,
        "name_en": "Tangela",
        "name_kr": "덩쿠리",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 182,
        "national_pokedex_number": 465,
        "name_en": "Tangrowth",
        "name_kr": "덩쿠림보",
        "type1": "풀",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 183,
        "national_pokedex_number": 193,
        "name_en": "Yanma",
        "name_kr": "왕자리",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 184,
        "national_pokedex_number": 469,
        "name_en": "Yanmega",
        "name_kr": "메가자리",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 185,
        "national_pokedex_number": 357,
        "name_en": "Tropius",
        "name_kr": "트로피우스",
        "type1": "풀",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 186,
        "national_pokedex_number": 111,
        "name_en": "Rhyhorn",
        "name_kr": "뿔카노",
        "type1": "땅",
        "type2": "바위"
    },
    {
        "sinnoh_pokedex_number": 187,
        "national_pokedex_number": 112,
        "name_en": "Rhydon",
        "name_kr": "코뿌리",
        "type1": "땅",
        "type2": "바위"
    },
    {
        "sinnoh_pokedex_number": 188,
        "national_pokedex_number": 464,
        "name_en": "Rhyperior",
        "name_kr": "거대코뿌리",
        "type1": "땅",
        "type2": "바위"
    },
    {
        "sinnoh_pokedex_number": 189,
        "national_pokedex_number": 355,
        "name_en": "Duskull",
        "name_kr": "해골몽",
        "type1": "고스트",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 190,
        "national_pokedex_number": 356,
        "name_en": "Dusclops",
        "name_kr": "미라몽",
        "type1": "고스트",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 191,
        "national_pokedex_number": 477,
        "name_en": "Dusknoir",
        "name_kr": "야느와르몽",
        "type1": "고스트",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 192,
        "national_pokedex_number": 137,
        "name_en": "Porygon",
        "name_kr": "폴리곤",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 193,
        "national_pokedex_number": 233,
        "name_en": "Porygon2",
        "name_kr": "폴리곤2",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 194,
        "national_pokedex_number": 474,
        "name_en": "Porygon-Z",
        "name_kr": "폴리곤Z",
        "type1": "노말",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 195,
        "national_pokedex_number": 123,
        "name_en": "Scyther",
        "name_kr": "스라크",
        "type1": "벌레",
        "type2": "비행"
    },
    {
        "sinnoh_pokedex_number": 196,
        "national_pokedex_number": 212,
        "name_en": "Scizor",
        "name_kr": "핫삼",
        "type1": "벌레",
        "type2": "강철"
    },
    {
        "sinnoh_pokedex_number": 197,
        "national_pokedex_number": 239,
        "name_en": "Elekid",
        "name_kr": "에레키드",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 198,
        "national_pokedex_number": 125,
        "name_en": "Electabuzz",
        "name_kr": "에레브",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 199,
        "national_pokedex_number": 466,
        "name_en": "Electivire",
        "name_kr": "에레키블",
        "type1": "전기",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 200,
        "national_pokedex_number": 240,
        "name_en": "Magby",
        "name_kr": "마그비",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 201,
        "national_pokedex_number": 126,
        "name_en": "Magmar",
        "name_kr": "마그마",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 202,
        "national_pokedex_number": 467,
        "name_en": "Magmortar",
        "name_kr": "마그마번",
        "type1": "불꽃",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 203,
        "national_pokedex_number": 220,
        "name_en": "Swinub",
        "name_kr": "꾸꾸리",
        "type1": "얼음",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 204,
        "national_pokedex_number": 221,
        "name_en": "Piloswine",
        "name_kr": "메꾸리",
        "type1": "얼음",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 205,
        "national_pokedex_number": 473,
        "name_en": "Mamoswine",
        "name_kr": "맘모꾸리",
        "type1": "얼음",
        "type2": "땅"
    },
    {
        "sinnoh_pokedex_number": 206,
        "national_pokedex_number": 361,
        "name_en": "Snorunt",
        "name_kr": "눈꼬마",
        "type1": "얼음",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 207,
        "national_pokedex_number": 362,
        "name_en": "Glalie",
        "name_kr": "얼음귀신",
        "type1": "얼음",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 208,
        "national_pokedex_number": 478,
        "name_en": "Froslass",
        "name_kr": "눈여아",
        "type1": "얼음",
        "type2": "고스트"
    },
    {
        "sinnoh_pokedex_number": 209,
        "national_pokedex_number": 359,
        "name_en": "Absol",
        "name_kr": "앱솔",
        "type1": "악",
        "type2": ""
    },
    {
        "sinnoh_pokedex_number": 210,
        "national_pokedex_number": 487,
        "name_en": "Giratina",
        "name_kr": "기라티나",
        "type1": "고스트",
        "type2": "드래곤"
    }
]

# --- 함수: PokeAPI 호출 (National ID 사용) ---
async def fetch_pokemon_details(pokemon_data: dict) -> dict:
    """
    수동으로 제공된 포켓몬 데이터(타입 포함)를 사용하여 상세 정보를 구성합니다.
    (모든 타입 정보가 로컬 데이터에 있다고 가정하고 PokeAPI 호출을 건너뜀)
    """

    national_id = pokemon_data['national_pokedex_number']

    # ⭐️ 수동으로 제공된 타입 정보 추출 ⭐️
    provided_type_1 = pokemon_data.get('type1')
    provided_type_2 = pokemon_data.get('type2')

    # 1. 타입 정보 처리: None 또는 빈 문자열을 'None'으로 변환
    type_1 = provided_type_1.capitalize() if provided_type_1 else None
    # 빈 문자열("")이 들어온 경우 None으로 처리 (타입이 하나인 포켓몬)
    type_2 = provided_type_2.capitalize() if provided_type_2 and provided_type_2 != "" else None

    # 2. 스프라이트 URL은 여전히 PokeAPI에서 가져와야 합니다.
    async with httpx.AsyncClient() as client:
        # 전국도감 번호를 사용하여 API 호출
        response = await client.get(f"https://pokeapi.co/api/v2/pokemon/{national_id}")
        response.raise_for_status()
        data = response.json()

        # 3. 최종 데이터 구성
        return {
            "poke_id": national_id,
            "name": pokemon_data['name_kr'],
            "type_1": type_1,
            "type_2": type_2,
            "sprite_url": data['sprites']['front_default']
        }

# --- 함수: 초기 데이터 로드 ---
async def init_pokemon_data():
    """
    FastAPI 시작 시 DB에 신오도감 포켓몬 데이터가 없으면 PokeAPI에서 가져와 저장합니다.
    """
    with SessionLocal as session:
        # DB에 포켓몬이 이미 있는지 확인
        existing_pokemon = session.exec(select(Pokemon)).first()
        if existing_pokemon:
            print("INFO: 포켓몬 데이터가 이미 DB에 존재합니다. 초기 로드를 건너뜁니다.")
            return

    # 데이터 로드 시작
    print(f"INFO: PokeAPI에서 신오도감 ({len(SINNOH_POKEMONS)}마리) 데이터 로드 중...")

    try:
        # 모든 포켓몬의 상세 정보를 비동기로 병렬 처리
        detail_tasks = [
            fetch_pokemon_details(p)
            for p in SINNOH_POKEMONS
        ]
        details = await asyncio.gather(*detail_tasks)

        # DB에 저장
        with SessionLocal as session:
            for detail in details:
                pokemon_data = PokemonBase(
                    poke_id=detail['poke_id'],
                    name=detail['name'],
                    type_1=detail['type_1'],
                    type_2=detail['type_2'],
                    sprite_url=detail['sprite_url']
                )
                db_pokemon = Pokemon.model_validate(pokemon_data)
                session.add(db_pokemon)

            session.commit()
            print(f"SUCCESS: 총 {len(details)}마리의 신오도감 포켓몬 데이터 DB 저장 완료.")

    except httpx.HTTPStatusError as e:
        print(f"ERROR: PokeAPI 호출 실패. (HTTP Status: {e.response.status_code}). URL 문제일 수 있습니다.")
    except Exception as e:
        print(f"ERROR: 포켓몬 데이터 로드 중 치명적인 오류 발생: {e}")