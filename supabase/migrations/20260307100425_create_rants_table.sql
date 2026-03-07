/*
  # Create rants table for MyBreakdown app

  1. New Tables
    - `rants`
      - `id` (uuid, primary key) - Unique identifier for each rant
      - `user_id` (uuid) - User who created the rant (nullable for now)
      - `type` (text) - Type of rant: 'text' or 'audio'
      - `content` (text) - The actual rant content or audio URL
      - `stress_score` (integer) - AI-calculated stress score from 1-10
      - `created_at` (timestamptz) - Timestamp when rant was created

  2. Security
    - Enable RLS on `rants` table
    - Add policy for authenticated users to insert their own rants
    - Add policy for authenticated users to read their own rants
    - Allow anonymous users to insert rants (for initial MVP without auth)
*/

CREATE TABLE IF NOT EXISTS rants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  type text NOT NULL CHECK (type IN ('text', 'audio')),
  content text NOT NULL,
  stress_score integer CHECK (stress_score >= 1 AND stress_score <= 10),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert rants"
  ON rants
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own rants"
  ON rants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users cannot read rants"
  ON rants
  FOR SELECT
  TO anon
  USING (false);