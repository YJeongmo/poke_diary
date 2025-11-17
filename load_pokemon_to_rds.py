#!/usr/bin/env python3
"""
RDS에 포켓몬 데이터를 수동으로 로드하는 스크립트
서버 재시작 없이 포켓몬 데이터를 로드할 수 있습니다.
"""

import asyncio
import sys
import os

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(__file__))

from app.data_setup import init_pokemon_data

async def main():
    print("=" * 50)
    print("포켓몬 데이터 로드 시작...")
    print("=" * 50)
    
    try:
        await init_pokemon_data()
        print("=" * 50)
        print("✅ 포켓몬 데이터 로드 완료!")
        print("=" * 50)
    except Exception as e:
        print("=" * 50)
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        print("=" * 50)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())

