export type ScreenName = 'encounter' | 'pokedex' | 'badges' | 'main' | 'diary_list' | 'diary_book';

export interface User {
  id: number;
  email: string;
  image_type: 'gardevoir' | 'lucario' | 'pretty' | null;
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
