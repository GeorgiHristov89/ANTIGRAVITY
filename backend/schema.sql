-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Items Table (for search)
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Items
INSERT INTO items (name, description) VALUES 
('Premium Laptop', 'High-end laptop for professionals'),
('Wireless Headphones', 'Noise-cancelling headphones'),
('Smart Watch', 'Fitness tracker and health monitor'),
('Mechanical Keyboard', 'Clicky switches for typing enthusiasts'),
('4K Monitor', 'Ultra HD display for productivity');
