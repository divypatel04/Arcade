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

INSERT INTO weapons (id, name, localizedNames, type, description, image)
VALUES (
    'weapon-id',
    'Vandal',
    '{"en": "Vandal", "es": "Vándalo"}',
    'Rifle',
    'Fully automatic rifle with high damage and recoil control.',
    '/weapon/(weaponName).png'
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




# Dummy Data


INSERT INTO agents (id, name, localizedNames, role, abilities, description, image, icon)
VALUES (
    ''
    'Agent Name',
    '{"en": "Agent Name", "fr": "Nom de l\'Agent"}', -- JSONB for localizedNames
    'Duelist', -- role
    '[
        {"ability": "Ability1", "description": "Ability1 description"},
        {"ability": "Ability2", "description": "Ability2 description"}
    ]', -- JSONB for abilities
    'Agent description goes here.',
    'https://example.com/image.png', -- image URL
    'https://example.com/icon.png' -- icon URL
);