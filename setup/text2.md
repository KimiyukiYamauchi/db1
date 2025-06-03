テキストの動作確認で使用する「家計簿」、「費目」、「経費区分」テーブルを作成する

```sql
-- 既にデータベースがある場合はいったん削除
drop database if exists `text2`;

-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `text2` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `text2`;

-- 家計簿テーブル作成
CREATE TABLE 家計簿 (
  日付 DATE,
  費目id INTEGER,
  備考 VARCHAR(100),
  入金額 INTEGER,
  出金額 INTEGER
);


--- 家計簿テーブルにデータを追加
INSERT INTO 家計簿 (日付, 費目id, 備考, 入金額, 出金額) VALUES
('2024-02-03', 2, 'カフェラテを購入', 0, 380),
('2024-02-05', 2, '昼食（日の出食堂）', 0, 750),
('2024-02-10', 1, '1月の給料', 280000, 0),
('2024-02-11', NULL, '昼食', 0, 400),
('2024-02-12', 4, '昼食', 0, 1000);

--- 家計簿テーブルのデータの確認
select * from 家計簿;

-- 費目テーブル作成
CREATE TABLE 費目 (
  id INTEGER PRIMARY KEY,
  名前 VARCHAR(20),
  経費区分id INTEGER,
  メモ VARCHAR(100)
);

---  費目テーブルにデータを追加
INSERT INTO 費目 (id, 名前, 経費区分id, メモ) VALUES
(1, '給料', 2, '給与や賞与'),
(2, '食費', 1, '食事代（ただし飲み会などの外食を除く）'),
(3, '水道光熱費', 1, '水道代・電気代・ガス代'),
(99, '特別損出', 1, '大型の支出');

---  費目テーブルのデータの確認
select * from  費目;

-- 経費区分テーブル作成
CREATE TABLE 経費区分 (
  id INTEGER PRIMARY KEY,
  名称 VARCHAR(20)
);

---  経費区分テーブルにデータを追加
INSERT INTO 経費区分 (id, 名称) VALUES
(1, '支出'),
(2, '収入');

---  経費区分テーブルのデータの確認
select * from  経費区分;

-- 家計簿貸借テーブル作成
CREATE TABLE 家計簿貸借 (
  日付 DATE,
  メモ VARCHAR(100),
  関連日付 DATE
);

---  家計簿貸借テーブルにデータを追加
INSERT INTO 家計簿貸借 (日付, メモ, 関連日付) VALUES
('2024-04-02', '湊に1000円貸した', NULL),
('2024-05-01', '湊から返してもらった', '2024-04-02');

---  家計簿貸借テーブルのデータの確認
select * from  家計簿貸借;

-- 家計簿2テーブル
CREATE TABLE 家計簿2 (
  日付 DATE,
  費目id INTEGER,
  メモ VARCHAR(100),
  入金額 INTEGER,
  出金額 INTEGER,
  FOREIGN KEY (費目id) REFERENCES 費目(id)
);
INSERT INTO 家計簿2 (日付, 費目id, メモ, 入金額, 出金額) VALUES
('2024-02-03', 2, 'カフェラテを購入', 0, 380),
('2024-02-05', 2, '昼食（日の出食堂）', 0, 750),
('2024-02-10', 1, '1月の給料', 280000, 0);
select * from  家計簿2;

-- 費目2テーブル作成
CREATE TABLE 費目2 (
  id INTEGER PRIMARY KEY,
  名前 VARCHAR(20),
  メモ VARCHAR(100)
);
INSERT INTO 費目2 (id, 名前, メモ) VALUES
(1, '給料', '給与や賞与'),
(2, '食費', '食事代（ただし飲み会などの外食を除く）'),
(3, '水道光熱費', '水道代・電気代・ガス代');
select * from  費目2;

```
