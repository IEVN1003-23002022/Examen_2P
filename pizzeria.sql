CREATE DATABASE IF NOT EXISTS pizzeria;
USE pizzeria;

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    direccion VARCHAR(150),
    telefono VARCHAR(50),
    fecha VARCHAR(50),
    total FLOAT,
    detalles TEXT
);
