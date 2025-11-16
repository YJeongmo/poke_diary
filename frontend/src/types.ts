export type ScreenName = 'encounter' | 'pokedex' | 'badges' | 'main' | 'diary_list' | 'diary_book';

export interface User {
  id: number;
  email: string;
  // 백엔드에서 사용하는 내부 이미지 타입 (type_1 / type_2 / type_3)
  // 과거 데이터 호환을 위해 문자열 전체를 허용합니다.
  image_type: string | null;
  auth_code: string | null;
}

export interface LogEntry {
  id: number;
  created_at: string;
  user_reflection_snippet: string;
  pokemon_name: string;
  pokemon_sprite: string;
  location: string;
}

export interface DiaryDetail {
  log_id: number;
  created_at: string;
  user_reflection: string;
  photo_url: string;
  analysis: {
    location: string;
    environment: string;
    time: string;
    season: string;
  };
  pokemon: {
    name: string;
    sprite_url: string;
    type_1: string;
    poke_id: number;
  };
}

export interface PokedexEntry {
  poke_id: number;
  sinnoh_poke_id?: number;
  name: string;
  type_1: string;
  type_2?: string | null;
  sprite_url: string;
  encountered: boolean;
  encounter_count?: number;
}

export interface PokedexData {
  total_pokedex_count: number;
  total_unique_encountered: number;
  pokedex_entries: PokedexEntry[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  earned: boolean;
  earned_at: string | null;
}
