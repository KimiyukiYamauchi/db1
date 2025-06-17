## 問題

以下の操作を行う、SQL 文を記述してください  

### 問題１

以下の仕様の「口座」テーブルを作成するCREATE TABLE文を記述してください

```sql
CREATE TABLE 口座 (
  口座番号 CHAR(7) PRIMARY KEY,
  名義 VARCHAR(40) NOT NULL,
  種別 CHAR(1) NOT NULL CHECK (種別 IN ('1', '2', '3')),
  残高 INTEGER NOT NULL CHECK (残高 >= 0),
  更新日 DATE
);
```

#### 正解: 8 / 不正解: 4 / 正解率: 67%


### 問題２

以下の仕様の「廃止口座」テーブルを作成するCREATE TABLE文を記述してください

```sql
CREATE TABLE 廃止口座 (
  口座番号 CHAR(7) PRIMARY KEY,
  名義 VARCHAR(40) NOT NULL,
  種別 CHAR(1) NOT NULL CHECK (種別 IN ('1', '2', '3')),
  解約時残高 INTEGER NOT NULL CHECK (解約時残高 >= 0),
  解約日 DATE
);
```

#### 正解: 7 / 不正解: 5 / 正解率: 58%


### 問題３

以下の仕様の「取引」テーブルを作成するCREATE TABLE文を記述してください

```sql
CREATE TABLE 取引 (
  取引番号 INTEGER PRIMARY KEY,
  取引事由ID INTEGER,
  日付 DATE NOT NULL,
  口座番号 CHAR(7) NOT NULL,
  入金額 INTEGER,
  出金額 INTEGER,
  FOREIGN KEY (取引事由ID) REFERENCES 取引事由(取引事由ID)
);
```

```sql
create table 取引 (
取引番号 INTEGER PRIMARY KEY,
取引事由ID INTEGER,
日付 DATE NOT NULL,
口座番号 CHAR(7) NOT NULL,
入金額 INTEGER,
出金額 INTEGER,
foreign key (取引事由ID) references 取引事由(取引事由ID),
foreign key (口座番号) references 口座(口座番号)
) ;
```

#### 正解: 9 / 不正解: 3 / 正解率: 75%


### 問題４

以下の仕様の「取引事由」テーブルを作成するCREATE TABLE文を記述してください

```sql
CREATE TABLE 取引事由 (
  取引事由ID INTEGER PRIMARY KEY,
  取引事由名 VARCHAR(20) NOT NULL
);
```

#### 正解: 11 / 不正解: 1 / 正解率: 92%