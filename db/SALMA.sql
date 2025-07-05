CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS recorrido_punto_venta CASCADE;
DROP TABLE IF EXISTS recorridos CASCADE;
DROP TABLE IF EXISTS encargado_punto_venta CASCADE;
DROP TABLE IF EXISTS punto_venta CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TRIGGER IF EXISTS trigger_updated_at_entregas ON entregas;
DROP TRIGGER IF EXISTS trigger_updated_at_recorrido_punto_venta ON recorrido_punto_venta;
DROP TRIGGER IF EXISTS trigger_updated_at_recorridos ON recorridos;
DROP TRIGGER IF EXISTS trigger_updated_at_encargado_punto_venta ON encargado_punto_venta;
DROP TRIGGER IF EXISTS trigger_updated_at_punto_venta ON punto_venta;
DROP TRIGGER IF EXISTS trigger_updated_at_usuarios ON usuarios;
DROP TRIGGER IF EXISTS trigger_updated_at_roles ON roles;

DROP FUNCTION IF EXISTS actualizar_updated_at();

DROP TABLE IF EXISTS entregas CASCADE;
DROP TABLE IF EXISTS recorrido_punto_venta CASCADE;
DROP TABLE IF EXISTS recorridos CASCADE;
DROP TABLE IF EXISTS encargado_punto_venta CASCADE;
DROP TABLE IF EXISTS punto_venta CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


-- Tabla de roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  rol VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  correo VARCHAR NOT NULL UNIQUE,
  contrasenia VARCHAR NOT NULL,
  nombre VARCHAR NOT NULL,
  apellido_paterno VARCHAR,
  apellido_materno VARCHAR,
  telefono VARCHAR ,
  numero_identificacion VARCHAR,
  id_rol INTEGER REFERENCES roles(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla de puntos de venta
CREATE TABLE punto_venta (
  id SERIAL PRIMARY KEY,
  direccion VARCHAR NOT NULL,
  nombre VARCHAR not null,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla de encargados de punto de venta
CREATE TABLE encargado_punto_venta (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  apellido_paterno VARCHAR NOT NULL,
  apellido_materno VARCHAR NOT NULL,
  telefono VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla de recorridos
CREATE TABLE recorridos (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER REFERENCES usuarios(id),
  estado VARCHAR NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIMESTAMP,
  hora_fin TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla intermedia: puntos de venta por recorrido
CREATE TABLE recorrido_punto_venta (
  id SERIAL PRIMARY KEY,
  id_recorrido INTEGER REFERENCES recorridos(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  orden INTEGER,
  hora_llegada TIMESTAMP,
  hora_salida TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Tabla de entregas
CREATE TABLE entregas (
  id SERIAL PRIMARY KEY,
  id_recorrido INTEGER REFERENCES recorridos(id),
  id_punto_venta INTEGER REFERENCES punto_venta(id),
  fecha_entrega TIMESTAMP,
  entregado BOOLEAN DEFAULT FALSE,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

--FUNCION PARA ACTUALIZAR EL CAMPO UPDATED_AT
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--TRIGGERS PARA LLAMAR LA FUNCION actualizar_updated_at

-- Trigger para tabla roles
CREATE TRIGGER trigger_updated_at_roles
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla usuarios
CREATE TRIGGER trigger_updated_at_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla punto_venta
CREATE TRIGGER trigger_updated_at_punto_venta
BEFORE UPDATE ON punto_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla encargado_punto_venta
CREATE TRIGGER trigger_updated_at_encargado_punto_venta
BEFORE UPDATE ON encargado_punto_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla recorridos
CREATE TRIGGER trigger_updated_at_recorridos
BEFORE UPDATE ON recorridos
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla recorrido_punto_venta
CREATE TRIGGER trigger_updated_at_recorrido_punto_venta
BEFORE UPDATE ON recorrido_punto_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para tabla entregas
CREATE TRIGGER trigger_updated_at_entregas
BEFORE UPDATE ON entregas
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

--INSERT INTOS
--------------------------------------------------------------------------------------

INSERT INTO roles (rol) VALUES ('Administrador');
INSERT INTO roles (rol) VALUES ('Repartidor');
insert into roles (rol) values ('Encargado de Punto');
insert into roles (rol) values ('Desarrollador');


INSERT INTO usuarios (correo, contrasenia, nombre, apellido_paterno, apellido_materno, telefono ,numero_identificacion, id_rol)
VALUES 
('admin@example.com', 'admin123', 'Carlos', 'Ramírez', 'Pérez','552-123-4567','1', 1),
('repartidor1@example.com', 'reparto123', 'Juan', 'López', 'Gómez','333-987-6543','5', 2),
('encargadoPunto@example.com', 'encargado123', 'Roberto', 'Sanchez', 'Ramirez','818-555-1212','42',3),
('angel@develop.com', '123456789', 'Jose Angel', 'Lopez', 'Rivera','271-153-1241','1',4),
('villalobos@develop.com', '123456789', 'Jose Manuel', 'Lara', 'Villalobos','271-245-8039','2',4);

INSERT INTO punto_venta (direccion, nombre, latitud, longitud)
VALUES 
('Desconocida', 'Abarrotes Karen', 18.91278594376976, -96.98667221029993),
('Desconocida', 'Tacos PITA', 18.91177667167387, -96.98499449262339),
('Desconocida', 'Tienda Lore', 18.90670870824918, -96.9822242305085),
('Desconocida', 'Sin nombre', 18.906682064529782, -96.98222959492594),
('Desconocida', 'Sin nombre', 18.90633698982817, -96.98292086352218),
('Desconocida', 'Sin nombre', 18.904318820069648, -96.98242722600243);


INSERT INTO encargado_punto_venta (nombre, apellido_paterno, apellido_materno, telefono)
VALUES 
('Martha', 'García', 'Ruiz', '2222222222'),
('Pedro', 'Hernández', 'López', '1111111111');


INSERT INTO recorridos (id_usuario, estado, fecha, hora_inicio, hora_fin)
VALUES 
(2, 'Pendiente', CURRENT_DATE, NULL, NULL),
(2, 'Completado', CURRENT_DATE - INTERVAL '1 day', '2025-07-03 09:00:00', '2025-07-03 13:00:00');


INSERT INTO recorrido_punto_venta (id_recorrido, id_punto_venta, orden, hora_llegada, hora_salida)
VALUES 
(1, 1, 1, NULL, NULL),
(1, 2, 2, NULL, NULL),
(1, 3, 3, NULL, NULL);


INSERT INTO entregas (id_recorrido, id_punto_venta, fecha_entrega, entregado, observaciones)
VALUES 
(1, 1, CURRENT_TIMESTAMP, false, 'Aún no entregado'),
(1, 2, CURRENT_TIMESTAMP, false, 'Cliente no estaba'),
(1, 3, CURRENT_TIMESTAMP, true, 'Entregado sin novedad');



--------------------------------------------------------------------------------------


SELECT * FROM usuarios u 

