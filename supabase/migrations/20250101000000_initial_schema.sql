-- DataCleanerPro Initial Schema
-- This migration creates the core tables for the MVP

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  plan text CHECK (plan IN ('free','pro')) DEFAULT 'free' NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- Files table
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  original_name text NOT NULL,
  storage_key text NOT NULL,
  mime text NOT NULL,
  rows_estimated int,
  sha256 text NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

-- Jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  file_id uuid REFERENCES files(id) ON DELETE CASCADE NOT NULL,
  recipe text NOT NULL,
  params jsonb,
  status text CHECK (status IN ('queued','processing','needs_review','complete','failed')) DEFAULT 'queued' NOT NULL,
  started_at timestamp,
  finished_at timestamp,
  llm_tokens_in int DEFAULT 0 NOT NULL,
  llm_tokens_out int DEFAULT 0 NOT NULL,
  cost_usd numeric(8,4) DEFAULT 0 NOT NULL,
  preview_key text,
  result_key text,
  undo_key text,
  confidence real CHECK (confidence >= 0 AND confidence <= 1)
);

-- Recipe runs table (per step in a job)
CREATE TABLE recipe_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  step_order int NOT NULL,
  engine text CHECK (engine IN ('pandas', 'llm')) NOT NULL,
  input_sample text,
  output_sample text,
  confidence real CHECK (confidence >= 0 AND confidence <= 1),
  notes text
);

-- Create indexes for common queries
CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_sha256 ON files(sha256);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_file_id ON jobs(file_id);
CREATE INDEX idx_recipe_runs_job_id ON recipe_runs(job_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_runs ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own record
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Files: users can only access their own files
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);

-- Jobs: users can only access their own jobs
CREATE POLICY "Users can view own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Recipe runs: users can only access runs for their own jobs
CREATE POLICY "Users can view own recipe runs"
  ON recipe_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = recipe_runs.job_id
      AND jobs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own recipe runs"
  ON recipe_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = recipe_runs.job_id
      AND jobs.user_id = auth.uid()
    )
  );

-- Function to automatically delete old files (called by scheduled job)
CREATE OR REPLACE FUNCTION delete_old_files()
RETURNS void AS $$
BEGIN
  DELETE FROM files
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for testing)
-- In production, this should only be callable by a cron job
GRANT EXECUTE ON FUNCTION delete_old_files() TO authenticated;
