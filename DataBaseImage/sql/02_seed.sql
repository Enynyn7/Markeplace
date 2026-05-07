-- =============================================================
--  seed.sql  –  Datos de prueba
--  Motor   : PostgreSQL 16
--  Ejecutar DESPUÉS de schema.sql
-- =============================================================

-- -------------------------------------------------------------
-- 1. ROLE
-- -------------------------------------------------------------
INSERT INTO
    role (name, description)
VALUES (
        'admin',
        'Acceso total al sistema'
    ),
    (
        'staff',
        'Gestión de eventos y boletos'
    ),
    (
        'buyer',
        'Usuario comprador de boletos'
    ),
    (
        'auditor',
        'Solo lectura para revisión financiera'
    );

-- -------------------------------------------------------------
-- 2. USER
-- password_hash = bcrypt de 'Password123!' (solo para pruebas)
-- -------------------------------------------------------------
INSERT INTO
    "user" (
        role_id,
        email,
        password_hash,
        status
    )
VALUES (
        1,
        'admin@sorteos.mx',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    ),
    (
        2,
        'staff@sorteos.mx',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    ),
    (
        3,
        'ana.garcia@mail.com',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    ),
    (
        3,
        'luis.perez@mail.com',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    ),
    (
        3,
        'maria.lopez@mail.com',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    ),
    (
        4,
        'auditor@sorteos.mx',
        '$2b$12$4H9zcgM7ypCZoB.adh3XEufLRff7/GKa3823DrO5R11kk.ujOyWjm',
        'active'
    );

-- -------------------------------------------------------------
-- 3. PROFILE
-- -------------------------------------------------------------
INSERT INTO
    profile (
        user_id,
        first_name,
        last_name,
        avatar_url,
        phone
    )
VALUES (
        1,
        'Carlos',
        'Mendoza',
        'https://cdn.sorteos.mx/avatars/1.jpg',
        '+52 55 1000 0001'
    ),
    (
        2,
        'Sofía',
        'Ramírez',
        'https://cdn.sorteos.mx/avatars/2.jpg',
        '+52 55 1000 0002'
    ),
    (
        3,
        'Ana',
        'García',
        'https://cdn.sorteos.mx/avatars/3.jpg',
        '+52 55 1000 0003'
    ),
    (
        4,
        'Luis',
        'Pérez',
        'https://cdn.sorteos.mx/avatars/4.jpg',
        '+52 55 1000 0004'
    ),
    (
        5,
        'María',
        'López',
        'https://cdn.sorteos.mx/avatars/5.jpg',
        '+52 55 1000 0005'
    ),
    (
        6,
        'Roberto',
        'Auditor',
        NULL,
        NULL
    );

-- -------------------------------------------------------------
-- 4. EVENT
-- -------------------------------------------------------------
INSERT INTO
    event (
        name,
        description,
        event_date,
        location,
        capacity,
        status
    )
VALUES (
        'Gran Sorteo Navideño 2025',
        'Sorteo anual con premios en efectivo y electrodomésticos.',
        '2025-12-24 20:00:00',
        'Auditorio Nacional, Ciudad de México',
        500,
        'upcoming'
    ),
    (
        'Sorteo Día de Muertos',
        'Edición especial de temporada con premios culturales.',
        '2025-11-02 18:00:00',
        'Centro Cultural Universitario, Puebla',
        200,
        'upcoming'
    ),
    (
        'Rifa Benéfica Primavera',
        'Todos los fondos se destinan a la fundación Niños de México.',
        '2025-04-20 12:00:00',
        'Plaza Mayor, Guadalajara',
        150,
        'completed'
    );

-- -------------------------------------------------------------
-- 5. LOTTERY_TICKET
-- -------------------------------------------------------------
INSERT INTO
    lottery_ticket (
        user_id,
        event_id,
        subject,
        description,
        status
    )
VALUES (
        2,
        1,
        'Boleto #001',
        'Boleto para el Gran Sorteo Navideño 2025',
        'available'
    ),
    (
        2,
        1,
        'Boleto #002',
        'Boleto para el Gran Sorteo Navideño 2025',
        'sold'
    ),
    (
        2,
        1,
        'Boleto #003',
        'Boleto para el Gran Sorteo Navideño 2025',
        'available'
    ),
    (
        2,
        2,
        'Boleto #001',
        'Boleto para Sorteo Día de Muertos',
        'sold'
    ),
    (
        2,
        2,
        'Boleto #002',
        'Boleto para Sorteo Día de Muertos',
        'available'
    ),
    (
        2,
        3,
        'Boleto #001',
        'Boleto para Rifa Benéfica Primavera',
        'sold'
    ),
    (
        2,
        3,
        'Boleto #002',
        'Boleto para Rifa Benéfica Primavera',
        'sold'
    );

-- -------------------------------------------------------------
-- 6. TICKET_SALE
-- -------------------------------------------------------------
INSERT INTO
    ticket_sale (
        ticket_id,
        buyer_user_id,
        price,
        currency,
        status
    )
VALUES (
        2,
        3,
        150.00,
        'MXN',
        'completed'
    ), -- Ana compra boleto #002 navideño
    (
        4,
        4,
        100.00,
        'MXN',
        'completed'
    ), -- Luis compra boleto Día de Muertos
    (
        6,
        3,
        50.00,
        'MXN',
        'completed'
    ), -- Ana compra boleto Rifa Primavera
    (7, 5, 50.00, 'MXN', 'pending');
-- María tiene pago pendiente

-- -------------------------------------------------------------
-- 7. TICKET_PAYMENT_EVIDENCE
-- -------------------------------------------------------------
INSERT INTO
    ticket_payment_evidence (
        ticket_sale_id,
        evidence_type,
        file_url,
        status
    )
VALUES (
        1,
        'transfer_receipt',
        'https://cdn.sorteos.mx/evidence/ts1_comprobante.pdf',
        'approved'
    ),
    (
        2,
        'transfer_receipt',
        'https://cdn.sorteos.mx/evidence/ts2_comprobante.pdf',
        'approved'
    ),
    (
        3,
        'transfer_receipt',
        'https://cdn.sorteos.mx/evidence/ts3_comprobante.pdf',
        'approved'
    ),
    (
        4,
        'transfer_receipt',
        'https://cdn.sorteos.mx/evidence/ts4_comprobante.pdf',
        'pending'
    );

-- -------------------------------------------------------------
-- 8. PAYMENT_REMINDER
-- -------------------------------------------------------------
INSERT INTO
    payment_reminder (
        ticket_sale_id,
        reminder_at,
        status,
        channel
    )
VALUES (
        4,
        NOW() + INTERVAL '1 day',
        'pending',
        'email'
    ),
    (
        4,
        NOW() + INTERVAL '3 days',
        'pending',
        'sms'
    );

-- -------------------------------------------------------------
-- 9. PAYMENT_METHOD
-- -------------------------------------------------------------
INSERT INTO
    payment_method (
        user_id,
        method_type,
        provider,
        last4,
        status
    )
VALUES (
        3,
        'credit_card',
        'Visa',
        '4242',
        'active'
    ),
    (
        3,
        'debit_card',
        'Mastercard',
        '1234',
        'active'
    ),
    (
        4,
        'credit_card',
        'Visa',
        '5678',
        'active'
    ),
    (
        5,
        'bank_transfer',
        'BBVA',
        NULL,
        'active'
    );

-- -------------------------------------------------------------
-- 10. FINANCIAL_ACCOUNT
-- -------------------------------------------------------------
INSERT INTO
    financial_account (
        user_id,
        account_type,
        currency,
        balance
    )
VALUES (1, 'main', 'MXN', 50000.00),
    (2, 'revenue', 'MXN', 12500.00),
    (3, 'wallet', 'MXN', 350.00),
    (4, 'wallet', 'MXN', 200.00),
    (5, 'wallet', 'MXN', 50.00),
    (6, 'wallet', 'MXN', 0.00);

-- -------------------------------------------------------------
-- 11. TRANSACTION
-- -------------------------------------------------------------
INSERT INTO
    transaction (
        user_id,
        payment_method_id,
        financial_account_id,
        amount,
        currency,
        status,
        description
    )
VALUES (
        3,
        1,
        3,
        150.00,
        'MXN',
        'completed',
        'Compra boleto navideño #002'
    ),
    (
        4,
        3,
        4,
        100.00,
        'MXN',
        'completed',
        'Compra boleto Día de Muertos #001'
    ),
    (
        3,
        2,
        3,
        50.00,
        'MXN',
        'completed',
        'Compra boleto Rifa Primavera #001'
    ),
    (
        5,
        4,
        5,
        50.00,
        'MXN',
        'pending',
        'Compra boleto Rifa Primavera #002'
    );

-- -------------------------------------------------------------
-- 12. PURCHASE_ORDER
-- -------------------------------------------------------------
INSERT INTO
    purchase_order (
        user_id,
        status,
        total_amount,
        currency
    )
VALUES (3, 'completed', 200.00, 'MXN'),
    (4, 'completed', 100.00, 'MXN'),
    (5, 'pending', 50.00, 'MXN');

-- -------------------------------------------------------------
-- 13. PURCHASE_ITEM
-- -------------------------------------------------------------
INSERT INTO
    purchase_item (
        purchase_order_id,
        item_name,
        sku,
        quantity,
        unit_price,
        line_total
    )
VALUES (
        1,
        'Boleto Navideño #002',
        'EVT1-T002',
        1,
        150.00,
        150.00
    ),
    (
        1,
        'Boleto Rifa Primavera #001',
        'EVT3-T001',
        1,
        50.00,
        50.00
    ),
    (
        2,
        'Boleto Día de Muertos #001',
        'EVT2-T001',
        1,
        100.00,
        100.00
    ),
    (
        3,
        'Boleto Rifa Primavera #002',
        'EVT3-T002',
        1,
        50.00,
        50.00
    );

-- -------------------------------------------------------------
-- 14. CATEGORY
-- -------------------------------------------------------------
INSERT INTO
    category (name, slug, description)
VALUES (
        'Producto',
        'producto',
        'Artículos físicos publicados en el marketplace'
    ),
    (
        'Servicio',
        'servicio',
        'Servicios ofrecidos por la comunidad'
    ),
    (
        'Boleto',
        'boleto',
        'Boletos o publicaciones relacionadas con sorteos'
    ),
    (
        'Otro',
        'otro',
        'Publicaciones que no encajan en otra categoría'
    );

-- -------------------------------------------------------------
-- 15. POST
-- -------------------------------------------------------------
INSERT INTO
    post (
        category_id,
        author_user_id,
        title,
        slug,
        content,
        price,
        status,
        published_at
    )
VALUES (
        2,
        1,
        'Resultados del Sorteo Navideño 2024',
        'resultados-sorteo-navideno-2024',
        'El pasado 24 de diciembre se llevó a cabo el Gran Sorteo Navideño 2024. El boleto ganador fue el #347.',
        250.00,
        'published',
        NOW() - INTERVAL '3 months'
    ),
    (
        3,
        2,
        'Todo lo que necesitas saber sobre el Sorteo Navideño 2025',
        'sorteo-navideno-2025-info',
        'Este año el sorteo se realizará en el Auditorio Nacional. Los boletos ya están disponibles.',
        150.00,
        'published',
        NOW() - INTERVAL '7 days'
    ),
    (
        1,
        1,
        'Nueva plataforma de pagos disponible',
        'nueva-plataforma-pagos',
        'Hemos integrado pagos con tarjeta de crédito y débito para facilitar la compra de boletos.',
        75.00,
        'draft',
        NULL
    ),
    (
        4,
        2,
        'Ana García comparte su experiencia como ganadora',
        'testimonio-ana-garcia',
        'Ana ganó el tercer lugar en la Rifa Benéfica Primavera y nos contó cómo fue su experiencia.',
        120.00,
        'published',
        NOW() - INTERVAL '1 month'
    );

-- -------------------------------------------------------------
-- 16. POST_IMAGE
-- -------------------------------------------------------------
INSERT INTO
    post_image (
        post_id,
        url,
        alt_text,
        sort_order
    )
VALUES (
        1,
        'https://cdn.sorteos.mx/posts/1/ganador.jpg',
        'Foto del ganador del sorteo 2024',
        1
    ),
    (
        1,
        'https://cdn.sorteos.mx/posts/1/ceremonia.jpg',
        'Ceremonia de entrega del premio',
        2
    ),
    (
        2,
        'https://cdn.sorteos.mx/posts/2/auditorio.jpg',
        'Auditorio Nacional, CDMX',
        1
    ),
    (
        4,
        'https://cdn.sorteos.mx/posts/4/ana.jpg',
        'Ana García con su premio',
        1
    );

-- -------------------------------------------------------------
-- 17. NOTIFICATION
-- -------------------------------------------------------------
INSERT INTO
    notification (
        user_id,
        type,
        title,
        message,
        is_read
    )
VALUES (
        3,
        'purchase',
        'Compra confirmada',
        'Tu compra del boleto navideño #002 fue procesada exitosamente.',
        TRUE
    ),
    (
        4,
        'purchase',
        'Compra confirmada',
        'Tu compra del boleto Día de Muertos #001 fue procesada.',
        TRUE
    ),
    (
        5,
        'reminder',
        'Recordatorio de pago',
        'Tienes un pago pendiente para el boleto Rifa Primavera #002.',
        FALSE
    ),
    (
        3,
        'news',
        'Nuevo sorteo disponible',
        'Ya puedes comprar boletos para el Sorteo Navideño 2025.',
        FALSE
    ),
    (
        4,
        'news',
        'Nuevo sorteo disponible',
        'Ya puedes comprar boletos para el Sorteo Navideño 2025.',
        FALSE
    );

-- -------------------------------------------------------------
-- 18. SUPPORT_REQUEST
-- -------------------------------------------------------------
INSERT INTO
    support_request (
        user_id,
        subject,
        message,
        status
    )
VALUES (
        3,
        '¿Cómo descargo mi comprobante?',
        'Realicé la compra hace dos días y no encuentro dónde descargar el PDF del comprobante.',
        'resolved'
    ),
    (
        4,
        'Error al intentar pagar con tarjeta',
        'Al ingresar mis datos de tarjeta el sistema muestra un error genérico. Por favor ayuda.',
        'open'
    ),
    (
        5,
        'No recibí correo de confirmación',
        'Compré mi boleto pero no llegó el correo de confirmación a mi bandeja.',
        'in_progress'
    );

-- -------------------------------------------------------------
-- 19. REPORT
-- -------------------------------------------------------------
INSERT INTO
    report (
        user_id,
        title,
        content,
        status
    )
VALUES (
        1,
        'Reporte de ventas Q1 2025',
        'Total de boletos vendidos: 320. Ingresos: $48,000 MXN. Eventos completados: 1.',
        'published'
    ),
    (
        1,
        'Reporte de usuarios activos marzo 2025',
        'Usuarios registrados: 6. Compradores activos: 3. Tasa de conversión: 50%.',
        'published'
    ),
    (
        6,
        'Auditoría de transacciones pendientes',
        'Se detectaron 2 transacciones en estado pending que requieren seguimiento.',
        'pending'
    );

-- -------------------------------------------------------------
-- 20. FAQ
-- -------------------------------------------------------------
INSERT INTO
    faq (
        user_id,
        question,
        answer,
        sort_order,
        is_active
    )
VALUES (
        3,
        '¿Cómo compro un boleto?',
        'Ingresa a la sección de Eventos, selecciona el sorteo de tu interés y haz clic en "Comprar boleto". Sigue los pasos del proceso de pago.',
        1,
        TRUE
    ),
    (
        4,
        '¿Cuándo se realizan los sorteos?',
        'Cada sorteo tiene su fecha publicada en la página del evento. Recibirás una notificación por correo y en la plataforma.',
        2,
        TRUE
    ),
    (
        5,
        '¿Qué métodos de pago aceptan?',
        'Aceptamos tarjeta de crédito, débito y transferencia bancaria. Los pagos se procesan de forma segura.',
        3,
        TRUE
    ),
    (
        NULL,
        '¿Qué pasa si no pago a tiempo?',
        'Si no completas el pago dentro de 48 horas, tu boleto será liberado automáticamente y podrá ser adquirido por otro usuario.',
        4,
        TRUE
    );


-- -------------------------------------------------------------
-- STUDENT / EXTERNAL / SCHOLARSHIP DATA
-- -------------------------------------------------------------
UPDATE profile
SET user_type = 'external',
    student_id = NULL,
    scholarship_percent = 0.00;

UPDATE profile
SET user_type = 'student',
    student_id = 'UDLAP0003',
    scholarship_percent = 60.00
WHERE user_id = 3;

UPDATE profile
SET user_type = 'external',
    student_id = NULL,
    scholarship_percent = 0.00
WHERE user_id = 4;

UPDATE profile
SET user_type = 'student',
    student_id = 'UDLAP0005',
    scholarship_percent = 30.00
WHERE user_id = 5;

