use tauri_plugin_sql::{Migration, MigrationKind};

pub const MIGRATION_2: Migration = Migration {
    version: 2,
    description: "insert_initial_data",
    sql: "
        INSERT INTO taxonomies (type, name) VALUES 
            ('AREA', 'LANÚS'), 
            ('AREA', 'AVELLANEDA');

        INSERT INTO taxonomies (type, name) VALUES 
            ('SECTOR', 'ALMACÉN'), ('SECTOR', 'CARNICERIA'), ('SECTOR', 'DEPORTES'), 
            ('SECTOR', 'ELECTRODOMÉSTICOS'), ('SECTOR', 'ENTRETENIMIENTOS'),
            ('SECTOR', 'FIAMBRERÍA'), ('SECTOR', 'HELADERÍA'), ('SECTOR', 'HIPER'), 
            ('SECTOR', 'JOYERÍA'), ('SECTOR', 'KIOSCO'), ('SECTOR', 'MARROQUINERÍA'), 
            ('SECTOR', 'MAYORISTA'), ('SECTOR', 'POLIRUBRO'), ('SECTOR', 'ROPA'),
            ('SECTOR', 'SUPER'), ('SECTOR', 'TECNOLOGÍA'), ('SECTOR', 'VERDULERÍA'), 
            ('SECTOR', 'VIVERO'), ('SECTOR', 'TELAS'), ('SECTOR', 'BEBIDAS');

        INSERT INTO taxonomies (type, name) VALUES 
            ('REASON', 'DELEGADO'), ('REASON', 'DENUNCIA'), ('REASON', 'FISCALIZADOR'), 
            ('REASON', 'SECRETARIO'), ('REASON', 'SECRETARIO EXTERNO'), ('REASON', 'ZONA');

        INSERT INTO categories (name) VALUES 
            ('NINGUNO'), 
            ('SEGURIDAD ELÉCTRICA'), 
            ('SEGURIDAD CONTRA INCENDIO'), 
            ('SECTOR DE ALMACENAMIENTO (ESCALERAS, ENTREPISOS, ESTANTERIAS, ELEVADORES)'), 
            ('TEMAS VARIOS (Servicio del personal, EPP, Ropa, etc.)');

        INSERT INTO category_items (category_id, name, law_reference) VALUES 
            (1, 'CONDICIONES EDILICIAS SEGURAS', 'D351/79'), 
            (1, 'INSTALACIONES ELÉCTRICAS EN CONDICIONES SEGURAS', 'D351/79 - C14-A6'), 
            (2, 'DISPOSITIVO DIFERENCIAL (DISYUNTOR)', 'C14-A6 Y R900/15'), 
            (2, 'EQUIPOS Y MAQUINARIAS SEGURAS', '103'), 
            (3, 'CAPACITACIÓN EN SEGURIDAD CONTRA INCENDIO', '208'), 
            (3, 'PRESENTA ESTUDIO DE CARGA DE FUEGO VIGENTE', '176'), 
            (3, 'MATAFUEGOS ACCESIBLES Y CON CARGA VIGENTE', '176'), 
            (3, 'CUENTA CON DETECTORES DE INCENDIO / ALARMAS, ETC.', 'C18 Y A7'), 
            (3, 'POSEE CARTEL DE SALIDA DE EMERGENCIA', '172'), 
            (3, 'POSEE LUZ DE EMERGENCIA EN CONDICIONES DE USO', '76'), 
            (3, 'LAS SALIDAS Y PASILLOS SE ENCUENTRAN LIBERADOS', '172'), 
            (4, 'ESCALERAS FIJAS SEGURA (PASAMANOS Y ANTIDESLIZANTES)', 'D351/79'), 
            (4, 'ESCALERAS MÓVILES EN CONDICIONES SEGURAS DE USO', 'D351/79'), 
            (4, 'ENTREPISO CON BARANDA Y ESCALERA SEGURA', 'D351/79'), 
            (4, 'ALMACENAMIENTO SEGURO EN ESTIBAS Y ESTANTERIAS', 'D351/79'), 
            (4, 'MONTACARGAS EN CONDICIONES SEGURAS', '137'), 
            (4, 'ELEVADORES DE CARGA EN CONDICIONES SEGURAS', '134 Y R960/15'), 
            (4, 'BUEN ORDEN Y LIMPIEZA GENERAL', NULL), 
            (5, 'TIENE BOTIQUIN DE PRIMEROS AUXILIOS', 'C51'), 
            (5, 'CAPACITACION EN TEMAS DE SEGURIDAD LABORAL', '208'), 
            (5, 'BAÑOS EN BUENAS CONDICIONES HIGIÉNICAS', 'C53'), 
            (5, 'LOS VESTUARIOS Y COMEDOR CUMPLEN CON EL CCT', 'C64'), 
            (5, 'SE REALIZA LA ENTRADA DE ROPA SEGÚN CCT Y D351/79', 'CCT C9 Y D351/79'), 
            (5, 'SE REALIZA LA ENTRADA DE LOS EPP CORRESPONDIENTES', 'CCT C9 Y D351/79'), 
            (5, 'EXISTEN CARTELES DE OBLIGACIONES Y ADVERTENCIA', 'D351/79'), 
            (5, 'PROVISIÓN DE AGUA POTABLE CON ANÁLISIS B Y FQ', 'D351/79 ART. 57'), 
            (5, 'BEBEDEROS DE AGUA, EN BUEN ESTADO DE HIGIENE', 'D351/79 - C6'), 
            (5, 'PISOS EN CONDICIONES SEGURAS', 'D351/79'), 
            (5, 'CONFORT LABORAL, CALEFACCIÓN, VENTILACIÓN, ETC.', 'D351/79 C11 Y 12'), 
            (5, 'MOBILIARIO O EQUIPOS PROPIOS DEL LOCAL EN BUEN ESTADO', 'D351/79');
    ",
    kind: MigrationKind::Up,
};
