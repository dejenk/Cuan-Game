-- Table untuk portfolio investasi
CREATE TABLE portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  asset_type TEXT NOT NULL CHECK (asset_type IN ('saham', 'crypto', 'emas', 'reksadana', 'properti')),
  asset_name TEXT NOT NULL,
  quantity DECIMAL(18,8) NOT NULL,
  buy_price BIGINT NOT NULL,
  current_price BIGINT NOT NULL,
  
  purchased_turn INTEGER NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolio" ON portfolio FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own portfolio" ON portfolio FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolio" ON portfolio FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own portfolio" ON portfolio FOR DELETE USING (auth.uid() = user_id);