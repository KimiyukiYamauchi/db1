```sql
-- 既にデータベースがある場合はいったん削除
drop database if exists `chap08`;

-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `chap08` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `chap08`;

-- 社員テーブル（外部キー制約は後で）
CREATE TABLE 社員 (
  社員番号 CHAR(8) PRIMARY KEY,
  名前 VARCHAR(40),
  生年月日 DATE,
  部署ID INTEGER NOT NULL,
  上司ID CHAR(8),
  勤務地ID INTEGER NOT NULL
);
-- 社員 テーブルへのデータ挿入
INSERT INTO 社員 (社員番号, 名前, 生年月日, 部署ID, 上司ID, 勤務地ID) VALUES
('S0000001', '田中 太郎', '1980-04-01', 1, NULL, 1),
('S0000002', '佐藤 花子', '1985-06-15', 2, 'S0000001', 2),
('S0000003', '鈴木 一郎', '1990-12-05', 1, 'S0000001', 1),
('S0000004', '高橋 美咲', '1992-03-22', 2, 'S0000002', 2);

-- 部署テーブル
CREATE TABLE 部署 (
  部署ID INTEGER PRIMARY KEY,
  名前 VARCHAR(40),
  本部拠点ID INTEGER
);
INSERT INTO 部署 (部署ID, 名前, 本部拠点ID) VALUES
(1, '営業部', 1),
(2, '開発部', 2);


-- 支店テーブル
CREATE TABLE 支店 (
  支店ID INTEGER PRIMARY KEY,
  名前 VARCHAR(40),
  支店長ID CHAR(8)
);
-- 支店 テーブルへのデータ挿入
INSERT INTO 支店 (支店ID, 名前, 支店長ID) VALUES
(1, '東京本社', 'S0000001'),
(2, '大阪支店', 'S0000002');

-- 部署 → 支店
ALTER TABLE 部署
ADD FOREIGN KEY (本部拠点ID) REFERENCES 支店(支店ID);

-- 支店 → 社員（支店長ID → 社員番号）
ALTER TABLE 支店
ADD FOREIGN KEY (支店長ID) REFERENCES 社員(社員番号);

-- 社員 → 部署、社員（上司ID）、支店
ALTER TABLE 社員
ADD FOREIGN KEY (部署ID) REFERENCES 部署(部署ID),
ADD FOREIGN KEY (上司ID) REFERENCES 社員(社員番号),
ADD FOREIGN KEY (勤務地ID) REFERENCES 支店(支店ID);

SELECT * FROM 部署;
SELECT * FROM 支店;
SELECT * FROM 社員;

```

## 問題

「chap08」データベースの「部署」、「支店」、「社員」テーブルについて、以下の操作を行う、SQL 文を記述してください  
  

### 問題１

 部署名が入った全社員の一覧表。

 | 社員番号     | 名前   | 部署名 |
| -------- | ---- | --- |
| 21000021 | 菅原拓真 | 開発部 |


### 問題２

上司の名前が入った全社員の一覧表。

| 社員番号     | 名前   | 上司名   |
| -------- | ---- | ----- |
| 21000021 | 菅原拓真 | 宇多田定一 |


### 問題３

部署名と勤務地が入った社員一覧表

| 社員番号     | 名前   | 部署名 | 勤務地 |
| -------- | ---- | --- | --- |
| 21000021 | 菅原拓真 | 開発部 | 東京  |


### 問題４

支店ごとの支店長名と社員数の一覧表

| 支店コード | 支店名 | 支店長   | 社員数 |
| ----- | --- | ----- | --- |
| 12    | 東京  | 宇多田定一 | 12  |


### 問題５

上司と違う勤務地（離れて勤務している）社員の一覧表

| 社員番号     | 名前   | 本人勤務地 | 上司勤務地 |
| -------- | ---- | ----- | ----- |
| 21000021 | 菅原拓真 | 東京    | 京都    |

