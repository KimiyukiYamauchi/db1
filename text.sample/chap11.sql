-- インデックス
CREATE INDEX 費目IDインデックス ON 家計簿(費目ID);
CREATE INDEX メモインデックス ON 家計簿(メモ);

SHOW INDEX FROM 家計簿;

-- ビュー
CREATE VIEW 家計簿4月 AS
SELECT * FROM 家計簿
    WHERE 日付 >= '2024-04-01'
    AND 日付 <= '2024-04-30';

SELECT * FROM 家計簿4月;
SELECT DISTINCT 費目ID FROM 家計簿4月;

SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.VIEWS
WHERE TABLE_SCHEMA = DATABASE();

SHOW CREATE VIEW 家計簿4月;

-- 裁判とシーケンス
CREATE TABLE 費目2 (
    ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    名前 VARCHAR(40)
);

INSERT INTO 費目2(名前) VALUES('食費');
INSERT INTO 費目2(名前) VALUES('光熱費');

SELECT * FROM 費目2;

CREATE SEQUENCE 費目ID_SEQ
  START WITH 1000
  INCREMENT BY 1;

SELECT NEXTVAL(費目ID_SEQ);  -- 例: 1000
SELECT NEXTVAL(費目ID_SEQ);  -- 例: 1001

INSERT INTO 費目2 (ID, 名前)
VALUES (NEXTVAL(費目ID_SEQ), '通信費');

SELECT TABLE_NAME
FROM information_schema.tables
WHERE TABLE_TYPE = 'SEQUENCE'
  AND TABLE_SCHEMA = DATABASE();

-- バックアップ

-- 全データベースをバックアップ
sudo mysqldump --all-databases > all_backup.sql

-- 特定のデータベースをバックアップ
sudo mysqldump your_database > your_database.sql
sudo mysqldump --databases your_database > your_database.sql

-- データベースの内容のみ
sudo mysqldump text2 > text2.sql
-- リストア
sudo mariadb -e "CREATE DATABASE text2;"
sudo mariadb text2 < text2.sql

-- データベース自体
sudo mysqldump --databases text2 > text2.sql
-- リストア
sudo mariadb < text2.sql