-- Table untuk game state pemain
CREATE TABLE game_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Stats utama
  cash BIGINT NOT NULL DEFAULT 5000000,
  net_worth BIGINT NOT NULL DEFAULT 5000000,
  mental_health INTEGER NOT NULL DEFAULT 70 CHECK (mental_health >= 0 AND mental_health <= 100),
  reputation INTEGER NOT NULL DEFAULT 50 CHECK (reputation >= 0 AND reputation <= 100),
  credit_score INTEGER NOT NULL DEFAULT 600 CHECK (credit_score >= 300 AND credit_score <= 850),
  
  -- Game progress
  current_turn INTEGER NOT NULL DEFAULT 1,
  action_points INTEGER NOT NULL DEFAULT 3 CHECK (action_points >= 0 AND action_points <= 3),
  
  -- Debt tracking
  total_debt BIGINT NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own game state" ON game_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game state" ON game_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own game state" ON game_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own game state" ON game_state FOR DELETE USING (auth.uid() = user_id);