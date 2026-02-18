-- Table untuk event log
CREATE TABLE event_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL CHECK (event_type IN ('random', 'achievement', 'warning', 'crisis', 'opportunity')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact JSONB,
  
  turn_number INTEGER NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE event_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" ON event_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON event_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON event_log FOR UPDATE USING (auth.uid() = user_id);