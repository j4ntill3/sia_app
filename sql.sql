INSERT INTO persona (id, telefono, apellido, direccion, email, fechaCreacion, nombre, DNI, eliminado)
VALUES
  (1, '1234567890', 'González', 'Calle Ficticia 123', 'carlos@example.com', '2023-01-10 10:00:00', 'Carlos', 12345678, 0),
  (2, '2345678901', 'Pérez', 'Av. Siempre Viva 742', 'juan.perez@example.com', '2022-06-15 14:30:00', 'Juan', 23456789, 0),
  (3, '3456789012', 'Martínez', 'Calle Real 456', 'marta.martinez@example.com', '2021-03-20 08:15:00', 'Marta', 34567890, 0),
  (4, '4567890123', 'Rodríguez', 'Calle Central 789', 'roberto@example.com', '2020-11-30 12:00:00', 'Roberto', 45678901, 0),
  (5, '5678901234', 'Gómez', 'Av. Libertador 101', 'luis@example.com', '2019-09-15 09:45:00', 'Luis', 56789012, 1),
  (6, '6789012345', 'Fernández', 'Calle Nueva 333', 'ana.fernandez@example.com', '2022-07-05 11:00:00', 'Ana', 67890123, 0),
  (7, '7890123456', 'López', 'Calle Sol 222', 'jose.lopez@example.com', '2023-05-12 13:30:00', 'José', 78901234, 0),
  (8, '8901234567', 'Martín', 'Calle del Sur 888', 'santiago.martin@example.com', '2020-02-10 15:30:00', 'Santiago', 89012345, 0),
  (9, '9012345678', 'Sánchez', 'Calle Alta 321', 'ricardo.sanchez@example.com', '2021-04-18 16:00:00', 'Ricardo', 90123456, 1),
  (10, '0123456789', 'Álvarez', 'Calle del Norte 500', 'maria.alvarez@example.com', '2022-10-25 10:30:00', 'María', 12345679, 0);

INSERT INTO empleado_tipo (id, tipo)
VALUES
  (1, 'adminsitrador'),
  (2, 'empleado');


INSERT INTO empleado (id, CUIT, Fecha_Alta, Fecha_Baja, tipoId, eliminado)
VALUES
  (1, '20-23456789-0', '2022-06-15', '2023-08-01', 1, 0),
  (2, '20-34567890-1', '2021-03-20', NULL, 1, 0),
  (3, '20-45678901-2', '2020-11-30', '2022-05-10', 1, 0),
  (4, '20-56789012-3', '2019-09-15', NULL, 1, 1),
  (5, '20-67890123-4', '2022-07-05', NULL, 1, 0),
  (6, '20-78901234-5', '2023-05-12', NULL, 1, 0),
  (7, '20-89012345-6', '2020-02-10', '2021-12-01', 1, 0),
  (8, '20-90123456-7', '2021-04-18', NULL, 1, 1),
  (9, '20-01234567-8', '2022-10-25', NULL, 1, 0),
  (10, '20-12345678-9', '2022-12-01', NULL, 1, 0);

INSERT INTO persona_empleado (idpersona, idempleado, fecha_creacion, eliminado)
VALUES
  (1, 1, '2023-01-10 10:00:00', 0),
  (2, 2, '2022-06-15 14:30:00', 0),
  (3, 3, '2021-03-20 08:15:00', 0),
  (4, 4, '2020-11-30 12:00:00', 0),
  (5, 5, '2019-09-15 09:45:00', 1),
  (6, 6, '2022-07-05 11:00:00', 0),
  (7, 7, '2023-05-12 13:30:00', 0),
  (8, 8, '2020-02-10 15:30:00', 0),
  (9, 9, '2021-04-18 16:00:00', 1),
  (10, 10, '2022-10-25 10:30:00', 0);
