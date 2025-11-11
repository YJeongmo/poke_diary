#!/usr/bin/env python3
"""
기존 사용자의 image_type을 'pretty'로 업데이트하는 스크립트
"""
import sqlite3
import os

# DB 파일 경로
db_path = os.path.join(os.path.dirname(__file__), "database.db")

if not os.path.exists(db_path):
    print(f"데이터베이스 파일을 찾을 수 없습니다: {db_path}")
    exit(1)

# SQLite 연결
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# image_type 컬럼이 없으면 추가
try:
    cursor.execute("ALTER TABLE user ADD COLUMN image_type TEXT")
    conn.commit()
    print("✅ image_type 컬럼을 추가했습니다.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("ℹ️  image_type 컬럼이 이미 존재합니다.")
    else:
        print(f"⚠️  컬럼 추가 중 오류: {e}")

# 사용자 확인
cursor.execute("SELECT id, email, image_type FROM user WHERE email = ?", ("test1@a.b",))
user = cursor.fetchone()

if user:
    print(f"현재 사용자 정보:")
    print(f"  ID: {user[0]}")
    print(f"  Email: {user[1]}")
    print(f"  Image Type: {user[2]}")
    
    # image_type 업데이트
    cursor.execute("UPDATE user SET image_type = ? WHERE email = ?", ("pretty", "test1@a.b"))
    conn.commit()
    print(f"\n✅ 사용자 '{user[1]}'의 image_type을 'pretty'로 업데이트했습니다.")
else:
    print("사용자 'test1@a.b'를 찾을 수 없습니다.")

# 모든 사용자 확인
print("\n모든 사용자 목록:")
cursor.execute("SELECT id, email, image_type FROM user")
users = cursor.fetchall()
for u in users:
    print(f"  ID: {u[0]}, Email: {u[1]}, Image Type: {u[2]}")

conn.close()
print("\n완료!")

