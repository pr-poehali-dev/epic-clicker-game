CREATE TABLE IF NOT EXISTS t_p29755359_epic_clicker_game.game_saves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p29755359_epic_clicker_game.users(id),
    save_data JSONB NOT NULL DEFAULT '{}',
    saved_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);