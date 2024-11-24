-- Crear base de datos
CREATE DATABASE mokara;
USE mokara;

-- Tabla para almacenar los datos de la planta
CREATE TABLE plant_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature INT NOT NULL,
    humidity INT NOT NULL,
    state VARCHAR(50) NOT NULL
);

-- Tabla para almacenar la fecha y hora del riego
CREATE TABLE irrigation_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    irrigation_date DATE NOT NULL,
    irrigation_time TIME NOT NULL
);

-- Tabla para almacenar el historial de registros
CREATE TABLE historic_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_data_id INT NOT NULL,
    irrigation_schedule_id INT NOT NULL,
    recorded_temperature INT NOT NULL,
    recorded_humidity INT NOT NULL,
    recorded_state VARCHAR(50) NOT NULL,
    FOREIGN KEY (plant_data_id) REFERENCES plant_data(id),
    FOREIGN KEY (irrigation_schedule_id) REFERENCES irrigation_schedule(id)
);
