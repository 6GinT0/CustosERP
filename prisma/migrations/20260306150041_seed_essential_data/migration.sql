-- This is an empty migration.
INSERT INTO taxonomies (type, name, normalized_name, updatedAt) VALUES
    ('AREA', 'lanús', 'lanus', datetime('now')),
    ('AREA', 'avellaneda', 'avellaneda', datetime('now'));

INSERT INTO taxonomies (type, name, normalized_name, updatedAt) VALUES 
    ('SECTOR', 'almacén', 'almacen', datetime('now')),
    ('SECTOR', 'carniceria', 'carniceria', datetime('now')),
    ('SECTOR', 'deportes', 'deportes', datetime('now')),
    ('SECTOR', 'electrodomésticos', 'electrodomesticos', datetime('now')),
    ('SECTOR', 'entretenimientos', 'entretenimientos', datetime('now')),
    ('SECTOR', 'fiambrería', 'fiambreria', datetime('now')),
    ('SECTOR', 'heladería', 'heladeria', datetime('now')),
    ('SECTOR', 'hiper', 'hiper', datetime('now')),
    ('SECTOR', 'joyería', 'joyeria', datetime('now')),
    ('SECTOR', 'kiosco', 'kiosco', datetime('now')),
    ('SECTOR', 'marroquinería', 'marroquineria', datetime('now')),
    ('SECTOR', 'mayorista', 'mayorista', datetime('now')),
    ('SECTOR', 'polirubro', 'polirubro', datetime('now')),
    ('SECTOR', 'ropa', 'ropa', datetime('now')),
    ('SECTOR', 'super', 'super', datetime('now')),
    ('SECTOR', 'tecnología', 'tecnologia', datetime('now')),
    ('SECTOR', 'verdulería', 'verduleria', datetime('now')),
    ('SECTOR', 'vivero', 'vivero', datetime('now')),
    ('SECTOR', 'telas', 'telas', datetime('now')),
    ('SECTOR', 'bebidas', 'bebidas', datetime('now'));

INSERT INTO taxonomies (type, name, normalized_name, updatedAt) VALUES 
    ('REASON', 'delegado', 'delegado', datetime('now')),
    ('REASON', 'denuncia', 'denuncia', datetime('now')),
    ('REASON', 'fiscalizador', 'fiscalizador', datetime('now')),
    ('REASON', 'secretario', 'secretario', datetime('now')),
    ('REASON', 'secretario externo', 'secretario externo', datetime('now')),
    ('REASON', 'zona', 'zona', datetime('now'));

INSERT INTO categories (name, normalized_name, updatedAt) VALUES 
    ('ninguno', 'ninguno', datetime('now')), 
    ('seguridad eléctrica', 'seguridad electrica', datetime('now')), 
    ('seguridad contra incendio', 'seguridad contra incendio', datetime('now')), 
    ('sector de almacenamiento (escaleras, entrepisos, estanterías, elevadores)', 'sector de almacenamiento (escaleras, entrepisos, estanterias, elevadores)', datetime('now')), 
    ('temas varios (servicio del personal, epp, ropa, etc.)', 'temas varios (servicio del personal, epp, ropa, etc.)', datetime('now'));

INSERT INTO category_items (category_id, name, law_reference, normalized_name, updatedAt) VALUES 
    (1, 'condiciones edilicias seguras', 'D351/79', 'condiciones edilicias seguras', datetime('now')),
    (1, 'instalaciones eléctricas en condiciones seguras', 'D351/79 - C14-A6', 'instalaciones electricas en condiciones seguras', datetime('now')),
    (2, 'dispositivo diferencial (disyuntor)', 'C14-A6 Y R900/15', 'dispositivo diferencial (disyuntor)', datetime('now')),
    (2, 'equipos y maquinarias seguras', '103', 'equipos y maquinarias seguras', datetime('now')),
    (3, 'capacitación en seguridad contra incendio', '208', 'capacitacion en seguridad contra incendio', datetime('now')),
    (3, 'presenta estudio de carga de fuego vigente', '176', 'presenta estudio de carga de fuego vigente', datetime('now')),
    (3, 'matafuegos accesibles y con carga vigente', '176', 'matafuegos accesibles y con carga vigente', datetime('now')),
    (3, 'cuenta con detectores de incendio / alarmas, etc.', 'C18 Y A7', 'cuenta con detectores de incendio / alarmas, etc.', datetime('now')),
    (3, 'posee cartel de salida de emergencia', '172', 'posee cartel de salida de emergencia', datetime('now')),
    (3, 'posee luz de emergencia en condiciones de uso', '76', 'posee luz de emergencia en condiciones de uso', datetime('now')),
    (3, 'las salidas y pasillos se encuentran liberados', '172', 'las salidas y pasillos se encuentran liberados', datetime('now')),
    (4, 'escaleras fijas segura (pasamanos y antideslizantes)', 'D351/79', 'escaleras fijas segura (pasamanos y antideslizantes)', datetime('now')),
    (4, 'escaleras móviles en condiciones seguras de uso', 'D351/79', 'escaleras moviles en condiciones seguras de uso', datetime('now')),
    (4, 'entrepiso con baranda y escalera segura', 'D351/79', 'entrepiso con baranda y escalera segura', datetime('now')),
    (4, 'almacenamiento seguro en estibas y estanterías', 'D351/79', 'almacenamiento seguro en estibas y estanterias', datetime('now')),
    (4, 'montacargas en condiciones seguras', '137', 'montacargas en condiciones seguras', datetime('now')),
    (4, 'elevadores de carga en condiciones seguras', '134 Y R960/15', 'elevadores de carga en condiciones seguras', datetime('now')),
    (4, 'buen orden y limpieza general', NULL, 'buen orden y limpieza general', datetime('now')),
    (5, 'tiene botiquín de primeros auxilios', 'C51', 'tiene botiquin de primeros auxilios', datetime('now')),
    (5, 'capacitación en temas de seguridad laboral', '208', 'capacitacion en temas de seguridad laboral', datetime('now')),
    (5, 'baños en buenas condiciones higiénicas', 'C53', 'baños en buenas condiciones higienicas', datetime('now')),
    (5, 'los vestuarios y comedor cumplen con el cct', 'C64', 'los vestuarios y comedor cumplen con el cct', datetime('now')),
    (5, 'se realiza la entrada de ropa según cct y d351/79', 'CCT C9 Y D351/79', 'se realiza la entrada de ropa segun cct y d351/79', datetime('now')),
    (5, 'se realiza la entrada de los epp correspondientes', 'CCT C9 Y D351/79', 'se realiza la entrada de los epp correspondientes', datetime('now')),
    (5, 'existen carteles de obligaciones y advertencia', 'D351/79', 'existen carteles de obligaciones y advertencia', datetime('now')),
    (5, 'provisión de agua potable con análisis b y fq', 'D351/79 ART. 57', 'provision de agua potable con analisis b y fq', datetime('now')),
    (5, 'bebederos de agua, en buen estado de higiene', 'D351/79 - C6', 'bebederos de agua, en buen estado de higiene', datetime('now')),
    (5, 'pisos en condiciones seguras', 'D351/79', 'pisos en condiciones seguras', datetime('now')),
    (5, 'confort laboral, calefacción, ventilación, etc.', 'D351/79 C11 Y 12', 'confort laboral, calefaccion, ventilacion, etc.', datetime('now')),
    (5, 'mobiliario o equipos propios del local en buen estado', 'D351/79', 'mobiliario o equipos propios del local en buen estado', datetime('now'));
