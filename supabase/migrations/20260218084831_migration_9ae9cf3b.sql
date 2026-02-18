-- Table untuk leaderboard
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  player_name TEXT NOT NULL,
  net_worth BIGINT NOT NULL,
  current_turn INTEGER NOT NULL,
  rank INTEGER,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Users can insert their leaderboard entry" ON leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their leaderboard entry" ON leaderboard FOR UPDATE USING (auth.uid() = user_id);