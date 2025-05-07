CREATE TABLE agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    localizedNames JSONB,
    role TEXT,
    abilities JSONB,
    description TEXT,
    image TEXT,
    icon TEXT
);


CREATE TABLE maps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    localizedNames JSONB,
    location TEXT,
    description TEXT,
    image TEXT,
    mapCoordinates JSONB
);




CREATE TABLE weapons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    localizedNames JSONB,
    type TEXT,
    description TEXT,
    image TEXT
);


CREATE TABLE seasons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    localizedNames JSONB,
    isActive BOOLEAN DEFAULT FALSE
);






CREATE TABLE Users (
    puuid TEXT PRIMARY KEY,
    region TEXT NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    lastUpdated TIMESTAMP DEFAULT NOW(),
    matchId JSONB DEFAULT '[]'::JSONB
);

CREATE TABLE AgentStats (
    id TEXT PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    agent JSONB NOT NULL,
    performanceBySeason JSONB NOT NULL,
    lastUpdated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE MapStats (
    id TEXT PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    map JSONB NOT NULL,
    performanceBySeason JSONB NOT NULL,
    lastUpdated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE WeaponStats (
    id TEXT PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    weapon JSONB NOT NULL,
    performanceBySeason JSONB NOT NULL,
    lastUpdated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE SeasonStats (
    id TEXT PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    season JSONB NOT NULL,
    stats JSONB NOT NULL,
    lastUpdated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE MatchStats (
    id TEXT PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    stats JSONB NOT NULL,
    lastUpdated TIMESTAMP DEFAULT NOW(),
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    puuid TEXT REFERENCES Users(puuid) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    paymentDate TIMESTAMP DEFAULT NOW(),
    paymentType TEXT NOT NULL,
    paymentStatus TEXT NOT NULL,
    receipts JSONB DEFAULT '{}'::JSONB
);



DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'agents', 'maps', 'weapons', 'seasons',
    'users', 'agentstats', 'mapstats', 'weaponstats',
    'seasonstats', 'matchstats', 'payments'
  ]
  LOOP
    EXECUTE format($sql$
      CREATE POLICY "Authenticated users on %I"
      ON %I
      FOR ALL
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);
    $sql$, tbl, tbl);
  END LOOP;
END $$;
