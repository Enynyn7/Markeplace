-- =============================================================
--  schema.sql  –  Core DB Schema
--  Motor   : PostgreSQL 16
--  IDs     : SERIAL (enteros autoincrement)
--  ON DELETE USER: CASCADE en todas las FKs que apuntan a USER
-- =============================================================

-- Limpiar si ya existe (útil para re-runs en dev)
DROP TABLE IF EXISTS
  faq, report, support_request, notification,
  post_image, post, category,
  purchase_item, purchase_order,
  transaction, financial_account, payment_method,
  payment_reminder, ticket_payment_evidence, ticket_sale,
  lottery_ticket, event,
  profile, "user", role
CASCADE;

-- -------------------------------------------------------------
-- 1. ROLE
-- -------------------------------------------------------------
CREATE TABLE role (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(50)   NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 2. USER
-- -------------------------------------------------------------
CREATE TABLE "user" (
  id            SERIAL        PRIMARY KEY,
  role_id       INT           NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  status        VARCHAR(30)   NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 3. PROFILE  (1:1 con USER)
-- -------------------------------------------------------------
CREATE TABLE profile (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  avatar_url  TEXT,
  phone       VARCHAR(30),
  user_type   VARCHAR(20)   NOT NULL DEFAULT 'external' CHECK (user_type IN ('student', 'external')),
  student_id  VARCHAR(30),
  scholarship_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (scholarship_percent >= 0 AND scholarship_percent <= 100),
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 4. EVENT
-- -------------------------------------------------------------
CREATE TABLE event (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(200)  NOT NULL,
  description TEXT,
  event_date  TIMESTAMP     NOT NULL,
  location    VARCHAR(300),
  capacity    INT           NOT NULL CHECK (capacity > 0),
  status      VARCHAR(30)   NOT NULL DEFAULT 'upcoming',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 5. LOTTERY_TICKET
-- -------------------------------------------------------------
CREATE TABLE lottery_ticket (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  event_id    INT           NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  subject     VARCHAR(200),
  description TEXT,
  status      VARCHAR(30)   NOT NULL DEFAULT 'available',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 6. TICKET_SALE
-- -------------------------------------------------------------
CREATE TABLE ticket_sale (
  id              SERIAL        PRIMARY KEY,
  ticket_id       INT           NOT NULL REFERENCES lottery_ticket(id) ON DELETE CASCADE,
  buyer_user_id   INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  price           DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  currency        VARCHAR(10)   NOT NULL DEFAULT 'MXN',
  status          VARCHAR(30)   NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 7. TICKET_PAYMENT_EVIDENCE
-- -------------------------------------------------------------
CREATE TABLE ticket_payment_evidence (
  id              SERIAL        PRIMARY KEY,
  ticket_sale_id  INT           NOT NULL REFERENCES ticket_sale(id) ON DELETE CASCADE,
  evidence_type   VARCHAR(50)   NOT NULL,
  file_url        TEXT          NOT NULL,
  status          VARCHAR(30)   NOT NULL DEFAULT 'pending',
  submitted_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 8. PAYMENT_REMINDER
-- -------------------------------------------------------------
CREATE TABLE payment_reminder (
  id              SERIAL        PRIMARY KEY,
  ticket_sale_id  INT           NOT NULL REFERENCES ticket_sale(id) ON DELETE CASCADE,
  reminder_at     TIMESTAMP     NOT NULL,
  status          VARCHAR(30)   NOT NULL DEFAULT 'pending',
  channel         VARCHAR(50)   NOT NULL DEFAULT 'email',
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 9. PAYMENT_METHOD
-- -------------------------------------------------------------
CREATE TABLE payment_method (
  id           SERIAL        PRIMARY KEY,
  user_id      INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  method_type  VARCHAR(50)   NOT NULL,
  provider     VARCHAR(100),
  last4        CHAR(4),
  status       VARCHAR(30)   NOT NULL DEFAULT 'active',
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 10. FINANCIAL_ACCOUNT
-- -------------------------------------------------------------
CREATE TABLE financial_account (
  id            SERIAL        PRIMARY KEY,
  user_id       INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  account_type  VARCHAR(50)   NOT NULL,
  currency      VARCHAR(10)   NOT NULL DEFAULT 'MXN',
  balance       DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 11. TRANSACTION
-- -------------------------------------------------------------
CREATE TABLE transaction (
  id                   SERIAL        PRIMARY KEY,
  user_id              INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  payment_method_id    INT           REFERENCES payment_method(id) ON DELETE SET NULL,
  financial_account_id INT           REFERENCES financial_account(id) ON DELETE SET NULL,
  amount               DECIMAL(14,2) NOT NULL,
  currency             VARCHAR(10)   NOT NULL DEFAULT 'MXN',
  status               VARCHAR(30)   NOT NULL DEFAULT 'pending',
  description          TEXT,
  created_at           TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 12. PURCHASE_ORDER
-- -------------------------------------------------------------
CREATE TABLE purchase_order (
  id            SERIAL        PRIMARY KEY,
  user_id       INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  status        VARCHAR(30)   NOT NULL DEFAULT 'pending',
  total_amount  DECIMAL(14,2) NOT NULL CHECK (total_amount >= 0),
  currency      VARCHAR(10)   NOT NULL DEFAULT 'MXN',
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 13. PURCHASE_ITEM
-- -------------------------------------------------------------
CREATE TABLE purchase_item (
  id                SERIAL        PRIMARY KEY,
  purchase_order_id INT           NOT NULL REFERENCES purchase_order(id) ON DELETE CASCADE,
  item_name         VARCHAR(200)  NOT NULL,
  sku               VARCHAR(100),
  quantity          INT           NOT NULL CHECK (quantity > 0),
  unit_price        DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  line_total        DECIMAL(14,2) NOT NULL CHECK (line_total >= 0),
  created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 14. CATEGORY
-- -------------------------------------------------------------
CREATE TABLE category (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  slug        VARCHAR(120)  NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 15. POST
-- -------------------------------------------------------------
CREATE TABLE post (
  id              SERIAL        PRIMARY KEY,
  category_id     INT           NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
  author_user_id  INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title           VARCHAR(300)  NOT NULL,
  slug            VARCHAR(350)  NOT NULL UNIQUE,
  content         TEXT,
  price           DECIMAL(10,2),
  status          VARCHAR(30)   NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMP,
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 16. POST_IMAGE
-- -------------------------------------------------------------
CREATE TABLE post_image (
  id          SERIAL   PRIMARY KEY,
  post_id     INT      NOT NULL REFERENCES post(id) ON DELETE CASCADE,
  url         TEXT     NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  INT      NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 17. NOTIFICATION
-- -------------------------------------------------------------
CREATE TABLE notification (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type        VARCHAR(60)   NOT NULL,
  title       VARCHAR(200)  NOT NULL,
  message     TEXT,
  is_read     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 18. SUPPORT_REQUEST
-- -------------------------------------------------------------
CREATE TABLE support_request (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  subject     VARCHAR(200)  NOT NULL,
  message     TEXT          NOT NULL,
  status      VARCHAR(30)   NOT NULL DEFAULT 'open',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 19. REPORT
-- -------------------------------------------------------------
CREATE TABLE report (
  id          SERIAL        PRIMARY KEY,
  user_id     INT           NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title       VARCHAR(200)  NOT NULL,
  content     TEXT,
  status      VARCHAR(30)   NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 20. FAQ
-- -------------------------------------------------------------
CREATE TABLE faq (
  id          SERIAL   PRIMARY KEY,
  user_id     INT      REFERENCES "user"(id) ON DELETE SET NULL,
  question    TEXT     NOT NULL,
  answer      TEXT,
  sort_order  INT      NOT NULL DEFAULT 0,
  is_active   BOOLEAN  NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------
-- Índices de rendimiento
-- -------------------------------------------------------------
CREATE INDEX idx_user_role            ON "user"(role_id);
CREATE INDEX idx_lottery_ticket_event ON lottery_ticket(event_id);
CREATE INDEX idx_lottery_ticket_user  ON lottery_ticket(user_id);
CREATE INDEX idx_ticket_sale_ticket   ON ticket_sale(ticket_id);
CREATE INDEX idx_ticket_sale_buyer    ON ticket_sale(buyer_user_id);
CREATE INDEX idx_transaction_user     ON transaction(user_id);
CREATE INDEX idx_transaction_account  ON transaction(financial_account_id);
CREATE INDEX idx_post_category        ON post(category_id);
CREATE INDEX idx_post_author          ON post(author_user_id);
CREATE INDEX idx_post_slug            ON post(slug);
CREATE INDEX idx_category_slug        ON category(slug);
CREATE INDEX idx_notification_user    ON notification(user_id);
CREATE INDEX idx_purchase_order_user  ON purchase_order(user_id);

