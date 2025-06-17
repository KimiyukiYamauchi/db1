## 問題

以下の操作を行う、SQL 文を記述してください  

### 問題１

ある大学の学部一覧を管理する学部テーブルを作るため、次のようなSQL文を準備しました。

```sql
CREATE TABLE 学部 (
  ID CHAR(1),             -- 学部を一意に特定する文字
  名前 VARCHAR(20),       -- 学部の名前（必須、重複不可）
  備考 VARCHAR(100)       -- 特にない場合は「特になし」を設定
);
```

このテーブルの趣旨と目的を考慮し、適切なデフォルト値や制約を加えるようSQL文を改訂してください。

```sql
CCREATE TABLE 学部 (
  ID CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci PRIMARY KEY,
  名前 VARCHAR(20) NOT NULL UNIQUE,
  備考 VARCHAR(100) DEFAULT '特になし'
);
```

```sql
INSERT INTO 学部 (ID, 名前, 備考) VALUES
('K', '工学部', '実験設備が充実'),
('L', '文学部', '人文科学の探求'),
('B', '経営学部', 'ビジネススキル養成'),
('R', '理学部', NULL);

SELECT * FROM 学部;
```

#### 正解: 8 / 不正解: 3 / 正解率: 73%


### 問題２

#### 学生テーブル仕様

| 列名    | データ型        | 備考                                  |
| ----- | ----------- | ----------------------------------- |
| 学籍番号  | CHAR(8)     | 学生を一意に特定する番号（必須）                    |
| 名前    | VARCHAR(30) | 学生の名前（必須）                           |
| 生年月日  | DATE        | 学生の生年月日（必須）                         |
| 血液型   | CHAR(2)     | 学生の血液型 ※ A、B、O、AB のいずれかで不明な場合は NULL |
| 学部 ID | CHAR(1)     | 学部テーブルの ID 列の値を格納する外部キー             |

制約やデフォルト値も活用して、このテーブルを生成するDDLを作成してください。

```sql
CREATE TABLE 学生 (
  学籍番号 CHAR(8) PRIMARY KEY,
  名前 VARCHAR(30) NOT NULL,
  生年月日 DATE NOT NULL,
  血液型 CHAR(2) CHECK (血液型 IN ('A', 'B', 'O', 'AB') OR 血液型 IS NULL),
  学部ID CHAR(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  FOREIGN KEY (学部ID) REFERENCES 学部(ID)
);
```

```sql
CREATE TABLE 学生 (
  学籍番号 CHAR(8) PRIMARY KEY,
  名前 VARCHAR(30) NOT NULL,
  生年月日 DATE NOT NULL,
  血液型 CHAR(2) CHECK (血液型 IN ('A', 'B', 'O', 'AB') OR 血液型 IS NULL),
  学部ID CHAR(1) REFERENCES 学部(ID)
);
```

```sql
INSERT INTO 学生 (学籍番号, 名前, 生年月日, 血液型, 学部ID) VALUES
('S0000001', '山田 太郎', '2002-04-01', 'A', 'K'),
('S0000002', '佐藤 花子', '2003-06-15', 'B', 'R'),
('S0000003', '鈴木 一郎', '2002-12-22', 'O', 'L'),
('S0000004', '高橋 美咲', '2001-11-30', 'AB', 'K'),
('S0000005', '田中 実',   '2003-01-18', NULL, 'B');

SELECT * FROM 学生;
```

#### 正解: 5 / 不正解: 6 / 正解率: 45%


### 問題３

参照整合性を崩す恐れがある操作の具体例を2つ挙げてください。

```sql
-- 例1: 存在しない学部IDを持つ学生の挿入
INSERT INTO 学生 (学籍番号, 名前, 生年月日, 学部ID)
VALUES ('S0000006', 'テストデータ', '2000-04-01', 'Z');

-- 例2: 学生が所属する学部を削除しようとする
DELETE FROM 学部 WHERE ID = 'K';
```

#### 正解: 7 / 不正解: 4 / 正解率: 64%


### 問題４

理学部（ID「R」）を廃止し、該当学生の学部IDを工学部（ID「K」）へ変更後、理学部のレコードを削除してください。

```sql
-- 学部IDの更新
UPDATE 学生
SET 学部ID = 'K'
WHERE 学部ID = 'R';

-- 学部レコードの削除
DELETE FROM 学部
WHERE ID = 'R';
```

#### 正解: 5 / 不正解: 6 / 正解率: 45%

