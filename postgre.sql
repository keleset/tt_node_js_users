DROP DATABASE testdb;
CREATE DATABASE testdb
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
\connect testdb
CREATE TABLE testtable(
    id SERIAL PRIMARY KEY,
    data JSONB
    );
