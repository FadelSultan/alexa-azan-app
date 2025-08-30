-- Create Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  timezone TEXT DEFAULT 'Asia/Riyadh',
  location JSONB,
  alexa_user_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Devices table  
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT UNIQUE NOT NULL,
  device_name TEXT NOT NULL,
  device_type TEXT DEFAULT 'speaker',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Prayer Settings table
CREATE TABLE prayer_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  calculation_method TEXT DEFAULT 'MuslimWorldLeague',
  madhab TEXT DEFAULT 'shafi',
  high_latitude TEXT DEFAULT 'NightMiddle',
  prayer_adjustments JSONB DEFAULT '{"fajr": 0, "dhuhr": 0, "asr": 0, "maghrib": 0, "isha": 0}',
  azan_enabled JSONB DEFAULT '{"fajr": true, "dhuhr": true, "asr": true, "maghrib": true, "isha": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Prayer Times table
CREATE TABLE prayer_times (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prayer_date DATE NOT NULL,
  fajr TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, prayer_date)
);

-- Create indexes
CREATE INDEX idx_users_alexa_id ON users(alexa_user_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_prayer_times_user_date ON prayer_times(user_id, prayer_date);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own devices" ON devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own devices" ON devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own settings" ON prayer_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON prayer_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own prayer times" ON prayer_times FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own prayer times" ON prayer_times FOR ALL USING (auth.uid() = user_id);