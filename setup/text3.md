テキストの動作確認で使用する「家計簿」、「費目」、「経費区分」テーブルを作成する

```sql
-- 既にデータベースがある場合はいったん削除
drop database if exists `text3`;

-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `text3` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `text3`;

-- 費目テーブル作成
CREATE TABLE 費目 (
  id INTEGER PRIMARY KEY,
  名前 VARCHAR(20) UNIQUE
);

---  費目テーブルにデータを追加
INSERT INTO 費目 (id, 名前) VALUES
(1, '給料'),
(2, '食費'),
(3, '水道光熱費');

---  費目テーブルのデータの確認
select * from  費目;

-- 家計簿テーブル作成
CREATE TABLE 家計簿 (
  日付 DATE NOT NULL,
  費目id INTEGER REFERENCES 費目(ID),
  メモ VARCHAR(100) DEFAULT '不明' NOT NULL,
  入金額 INTEGER DEFAULT 0 CHECK(入金額 >= 0),
  出金額 INTEGER DEFAULT 0 CHECK(出金額 >= 0)
);


--- 家計簿テーブルにデータを追加
INSERT INTO 家計簿 (日付, 費目id, メモ, 入金額, 出金額) VALUES
('2024-02-03', 2, 'カフェラテを購入', 0, 380),
('2024-02-05', 2, '昼食（日の出食堂）', 0, 750),
('2024-02-10', 1, '1月の給料', 280000, 0),
('2024-02-11', NULL, '昼食', 0, 400),
('2024-02-12', 2, '昼食', 0, 1000),
('2024-02-15', 3, '電気代', 0, 8000);

--- 家計簿テーブルのデータの確認
select * from 家計簿;

```
