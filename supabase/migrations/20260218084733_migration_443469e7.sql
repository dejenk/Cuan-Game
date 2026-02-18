-- Table untuk hutang
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  creditor_name TEXT NOT NULL,
  principal_amount BIGINT NOT NULL,
  current_balance BIGINT NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  weekly_payment BIGINT NOT NULL,
  
  created_turn INTEGER NOT NULL,
  due_turn INTEGER,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own debts" ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own debts" ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON debts FOR DELETE USING (auth.uid() = user_id);