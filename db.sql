CREATE DATABASE IF NOT EXISTS menu_db;
USE menu_db;

CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order)
);

INSERT INTO menu_items (label, parent_id, sort_order) VALUES
('Каталог товаров', NULL, 1),

('Мойки', 1, 1),
('Фильтры', 1, 2),

('Ulgran', 2, 1),
('Vigro Mramor', 2, 2),
('Handmade', 2, 3),
('Vigro Glass', 2, 4),

('Smith', 3, 1),
('Smth', 3, 2),

('Smith', 5, 1),
('Smth', 5, 2),

('Ulgran', 8, 1),
('Vigro Mramor', 8, 2),

('Smith', 11, 1),
('Smth', 11, 2);