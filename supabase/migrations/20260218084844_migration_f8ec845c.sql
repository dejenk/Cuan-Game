-- Table untuk community chat
CREATE TABLE community_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  player_name TEXT NOT NULL,
  message TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE community_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat" ON community_chat FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON community_chat FOR INSERT WITH CHECK (auth.uid() = user_id);