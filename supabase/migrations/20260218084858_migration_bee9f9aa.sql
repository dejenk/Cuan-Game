-- Table untuk vacation history
CREATE TABLE vacation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  destination TEXT NOT NULL,
  cost BIGINT NOT NULL,
  mental_gain INTEGER NOT NULL,
  reputation_gain INTEGER,
  description TEXT,
  
  turn_number INTEGER NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE vacation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vacation history" ON vacation_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their vacation history" ON vacation_history FOR INSERT WITH CHECK (auth.uid() = user_id);