-- QUERY TABLES
SELECT * FROM pg_catalog.pg_tables where schemaname = 'public';

-- QUERY COLUMNS
SELECT column_name as column, data_type as type, column_default as default,	is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'pessoa'