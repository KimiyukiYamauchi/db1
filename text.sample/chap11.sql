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


-- データベース

-- 既にデータベースがある場合はいったん削除
drop database if exists `chap11`;

-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `chap11` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `chap11`;


-- 学部
CREATE TABLE 学部 (
  ID CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci PRIMARY KEY,
  名前 VARCHAR(20) NOT NULL UNIQUE,
  備考 VARCHAR(100) DEFAULT '特になし'
);
INSERT INTO 学部 (ID, 名前, 備考) VALUES
('K', '工学部', '実験設備が充実'),
('L', '文学部', '人文科学の探求'),
('B', '経営学部', 'ビジネススキル養成'),
('R', '理学部', NULL);

SELECT * FROM 学部;

-- 学生
CREATE TABLE 学生 (
  学籍番号 CHAR(8) PRIMARY KEY,
  名前 VARCHAR(30) NOT NULL,
  生年月日 DATE NOT NULL,
  血液型 CHAR(2) CHECK (血液型 IN ('A', 'B', 'O', 'AB') OR 血液型 IS NULL),
  学部ID CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  登録順 INTEGER,
  FOREIGN KEY (学部ID) REFERENCES 学部(ID)
);

CREATE SEQUENCE ISTD;

INSERT INTO 学生 (学籍番号, 名前, 生年月日, 血液型, 学部ID, 登録順) VALUES
('S0000001', '山田 太郎', '2002-04-01', 'A', 'K', NEXTVAL(ISTD)),
('S0000002', '佐藤 花子', '2003-06-15', 'B', 'R', NEXTVAL(ISTD)),
('S0000003', '鈴木 一郎', '2002-12-22', 'O', 'L', NEXTVAL(ISTD)),
('S0000004', '高橋 美咲', '2001-11-30', 'AB', 'K', NEXTVAL(ISTD)),
('S0000005', '田中 実',   '2003-01-18', NULL, 'B', NEXTVAL(ISTD));

SELECT * FROM 学生;

-- p353 2
CREATE VIEW 学部名付き学生 AS
SELECT S.学籍番号, S.名前, S.生年月日, S.血液型,
  S.学部ID, B.名前 AS 学部名
FROM 学生 AS S
JOIN 学部 AS B
ON S.学部ID = B.ID;

-- p353 3

INSERT INTO 学生
  (学籍番号, 名前, 生年月日, 血液型, 学部ID, 登録順)
  VALUES
  ('B1101022', '古島　進', '2004-02-12', 'A', 'K', NEXTVAL(ISTD));

