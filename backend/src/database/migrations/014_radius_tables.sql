-- Migration 014: Standard FreeRADIUS Tables for PostgreSQL
-- This migration provides the schema required for FreeRADIUS to manage PPPoE/Hotspot users

CREATE TABLE IF NOT EXISTS radcheck (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL DEFAULT '',
    attribute VARCHAR(64) NOT NULL DEFAULT '',
    op VARCHAR(2) NOT NULL DEFAULT '==',
    value VARCHAR(253) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS radreply (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL DEFAULT '',
    attribute VARCHAR(64) NOT NULL DEFAULT '',
    op VARCHAR(2) NOT NULL DEFAULT '=',
    value VARCHAR(253) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS radgroupreply (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(64) NOT NULL DEFAULT '',
    attribute VARCHAR(64) NOT NULL DEFAULT '',
    op VARCHAR(2) NOT NULL DEFAULT '=',
    value VARCHAR(253) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS radusergroup (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL DEFAULT '',
    groupname VARCHAR(64) NOT NULL DEFAULT '',
    priority INTEGER NOT NULL DEFAULT 1
);

-- Indices for faster lookup by FreeRADIUS
CREATE INDEX IF NOT EXISTS radcheck_username ON radcheck (username);
CREATE INDEX IF NOT EXISTS radreply_username ON radreply (username);
CREATE INDEX IF NOT EXISTS radusergroup_username ON radusergroup (username);
CREATE INDEX IF NOT EXISTS radgroupreply_groupname ON radgroupreply (groupname);

-- Default Attributes to handle disconnects (optional but good practice)
-- INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ('Isolir', 'Mikrotik-Address-List', '=', 'ISOLATED') ON CONFLICT DO NOTHING;
