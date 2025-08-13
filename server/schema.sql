-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  about_me TEXT,
  birthdate DATE,
  address_street VARCHAR(255),
  address_city VARCHAR(255),
  address_state VARCHAR(255),
  address_zip VARCHAR(20)
);

-- Create config table
CREATE TABLE IF NOT EXISTS config (
  id INT PRIMARY KEY,
  page2_components JSON NOT NULL,
  page3_components JSON NOT NULL
);

-- Insert default config if not exists
INSERT INTO config (id, page2_components, page3_components)
VALUES (1, '["aboutMe"]', '["address", "birthdate"]')
ON CONFLICT (id) DO NOTHING;