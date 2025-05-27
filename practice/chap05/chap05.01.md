```sql
-- 既にデータベースがある場合はいったん削除、ない場合はエラー
drop database `chap05`;

-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `chap05` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `chap05`;

-- 試験結果テーブル作成
CREATE TABLE 試験結果 (
  受験者ID CHAR(6) PRIMARY KEY,
  午前 INTEGER,
  午後1 INTEGER,
  午後2 INTEGER,
  論述 INTEGER,
  平均点 INTEGER
);

--- 試験結果テーブルにデータを追加
INSERT INTO 試験結果 (受験者ID, 午前, 午後1, 午後2, 論述, 平均点) VALUES
('SW1046', 86, NULL, 68, 91, 80),
('SW1350', 65, 53, 70, NULL, 68),
('SW1877', NULL, 59, 56, 36, 56);

--- 試験結果テーブルのデータの確認
select * from 試験結果;

CREATE TABLE 回答者 (
  メールアドレス VARCHAR(100) PRIMARY KEY,
  国名 VARCHAR(100),
  住居 CHAR(1),
  年齢 INTEGER
);

--- 回答者テーブルのデータの確認
INSERT INTO 回答者 (メールアドレス, 国名, 住居, 年齢) VALUES
('suzuki.takashi@example.jp', NULL, 'D', 51),
('philip@example.uk', NULL, 'C', 26),
('hao@example.cn', NULL, 'C', 35),
('marie@example.fr', NULL, 'D', 43),
('hoa@example.vn', NULL, 'D', 22);

--- 回答者テーブルのデータの確認
select * from 試験結回答者果;

```

## 問題

「chap05」データベースの「試験結果」テーブルについて、以下の操作を行う、SQL 文を記述してください

### 問題１

「受験者ID」が「SW1046」の「午後1」にあてはまる点数を計算して登録する。

### 問題２

「受験者ID」が「SW1350」の「論述」にあてはまる点数を計算して登録する。

### 問題３

「受験者ID」が「SW1877」の「午前」にあてはまる点数を計算して登録する。

### 問題４

この試験に合格するには、次の条件をすべて満たす必要がある。

1. 午前の点数は 60 以上であること
2. 午後1と午後2を合計した点数が120以上であること
3. 論述の点数が、午前・午後1・午後2の合計点の3割以上であること

これらの条件をもとに、合格者の受験者IDを抽出する。ただし、列見出しは「合格者ID」とすること。

```sql

-- 使用するデータベースを指定
USE `chap05`;

CREATE TABLE 回答者 (
  メールアドレス VARCHAR(30) PRIMARY KEY,
  国名 VARCHAR(20),
  住居 CHAR(1),
  年齢 INTEGER
);

INSERT INTO 回答者 (メールアドレス, 国名, 住居, 年齢) VALUES
('suzuki.takashi@example.jp', NULL, 'D', 51),
('philip@example.uk', NULL, 'C', 26),
('hao@example.cn', NULL, 'C', 35),
('marie@example.fr', NULL, 'D', 43),
('hoa@example.vn', NULL, 'D', 22);

--- 試験結果テーブルのデータの確認
select * from 回答者;

```

「chap05」データベースの「回答者」テーブルについて、以下の操作を行う、SQL 文を記述してください

### 問題５

メールアドレスの最後の2文字が国コードであることを利用して、国名を登録したい。国コードを日本語の国名に変換のうえ、国名列を更新する。ただし、1つのSQL文で全行を更新すること。
なお、国コードと国名は次のように対応している。

- jp：日本
- uk：イギリス
- cn：中国
- fr：フランス
- vn：ベトナム

### 問題６

メールアドレスと住居、年齢を一覧表示する。ただし、次の条件を満たした形式で表示すること。
1. メールアドレスの余分な空白は除去する。
2. 住居と年齢は1つの項目とし、見出しを「属性」とする。住居は「D」が戸建てで、「C」が集合住宅を表している。年齢は年代として次のように表示する。ただし、20～50代のみ考慮すればよい。  
例）50代：戸建て