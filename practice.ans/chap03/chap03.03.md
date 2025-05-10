## 問題

- 問題１
  水星のデータを抽出する

```sql
SELECT * FROM 惑星一覧 WHERE 名前 = '水星';
```

- 問題２  
  水星でないデータを抽出する

```sql
SELECT * FROM 惑星一覧 WHERE 名前 <> '水星';
SELECT * FROM 惑星一覧 WHERE 名前 != '水星';
```

- 問題３  
  半径が 10000 以上のデータ

```sql
SELECT * FROM 惑星一覧 WHERE 半径 >= 10000;
```

- 問題４  
  重量が 60000 以下のデータ

```sql
SELECT * FROM 惑星一覧 WHERE 重量 <= 60000;
```

- 問題５  
  水星と地球と土星のデータ

```sql
select * from 惑星一覧
where 名前 =  '水星'
or    名前 =  '地球'
or    名前 =  '土星';
SELECT * FROM 惑星一覧 WHERE 名前 IN ('水星','地球','土星');
```

- 問題６  
  半径が 3000 以上で重量が 60000 未満のデータ

```sql
SELECT * FROM 惑星一覧
WHERE 半径 >= 3000
AND 重量 < 60000;
```
