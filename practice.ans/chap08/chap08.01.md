## 問題

「chap08」データベースの「部署」、「支店」、「社員」テーブルについて、以下の操作を行う、SQL 文を記述してください  
  

### 問題１

 部署名が入った全社員の一覧表。

```sql
SELECT
  s.社員番号,
  s.名前,
  d.名前 AS 部署名
FROM 社員 s
JOIN 部署 d 
ON s.部署ID = d.部署ID;
```
#### 正解: 11 / 不正解: 2 / 正解率: 85%



### 問題２

上司の名前が入った全社員の一覧表。

```sql
SELECT
  s.社員番号,
  s.名前,
  j.名前 AS 上司名
FROM 社員 s
LEFT JOIN 社員 j 
ON s.上司ID = j.社員番号;

```
#### 正解: 12 / 不正解: 1 / 正解率: 92%


### 問題３

部署名と勤務地が入った社員一覧表

```sql
SELECT
  s.社員番号,
  s.名前,
  d.名前 AS 部署名,
  b.名前 AS 勤務地
FROM 社員 s
JOIN 部署 d 
ON s.部署ID = d.部署ID
JOIN 支店 b 
ON s.勤務地ID = b.支店ID;

```
#### 正解: 12 / 不正解: 1 / 正解率: 92%


### 問題４

支店ごとの支店長名と社員数の一覧表

```sql
SELECT
  b.支店ID AS 支店コード,
  b.名前 AS 支店名,
  m.名前 AS 支店長,
  COUNT(s.社員番号) AS 社員数
FROM 支店 b
JOIN 社員 m 
ON b.支店長ID = m.社員番号
JOIN 社員 s 
ON s.勤務地ID = b.支店ID
GROUP BY b.支店ID, b.名前, m.名前;

```
#### 正解: 11 / 不正解: 2 / 正解率: 85%


### 問題５

上司と違う勤務地（離れて勤務している）社員の一覧表

```sql
SELECT
  s.社員番号,
  s.名前,
  sb1.名前 AS 本人勤務地,
  sb2.名前 AS 上司勤務地
FROM 社員 s
JOIN 社員 j 
ON s.上司ID = j.社員番号
JOIN 支店 sb1 
ON s.勤務地ID = sb1.支店ID
JOIN 支店 sb2 
ON j.勤務地ID = sb2.支店ID
WHERE s.勤務地ID != j.勤務地ID;

```
#### 正解: 7 / 不正解: 6 / 正解率: 54%
