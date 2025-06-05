SELECT 家計簿.日付, 費目.名前 AS 費目, 費目.メモ
FROM 家計簿
JOIN 費目 
ON 家計簿.費目ID = 費目.ID;

SELECT 日付, 名前 AS 費目, メモ
FROM 家計簿
LEFT JOIN 費目 
ON 家計簿.費目ID = 費目.ID;

SELECT 日付, 名前 AS 費目, メモ
FROM 家計簿
RIGHT JOIN 費目 
ON 家計簿.費目ID = 費目.ID;

SELECT 日付, 名前 AS 費目, メモ
FROM 家計簿
LEFT JOIN 費目 ON 家計簿.費目ID = 費目.ID
UNION
SELECT 日付, 名前 AS 費目, メモ
FROM 家計簿
RIGHT JOIN 費目 ON 家計簿.費目ID = 費目.ID;

SELECT 日付, 家計簿2.メモ, 費目2.メモ
FROM 家計簿2
JOIN 費目2
ON 家計簿2.費目ID = 費目2.ID;

-- エラーになる
SELECT 日付, メモ, 費目2.メモ
FROM 家計簿2
JOIN 費目2
ON 家計簿2.費目ID = 費目2.ID;


SELECT 日付, K.メモ, H.メモ
FROM 家計簿2 AS K
JOIN 費目2 AS H
ON K.費目ID = H.ID;

SELECT 日付, 費目.名前, 経費区分.名称
FROM 家計簿
JOIN 費目
ON 家計簿.費目ID = 費目.ID
JOIN 経費区分
ON 費目.経費区分ID = 経費区分.ID;

SELECT 日付, 費目.名前, 費目.経費区分ID
FROM 家計簿
JOIN (
  SELECT * FROM 費目
  WHERE 経費区分ID = 1
) AS 費目
ON 家計簿.費目ID = 費目.ID;

SELECT A.日付, A.メモ, A.関連日付, B.メモ
FROM 家計簿貸借 AS A
JOIN 家計簿貸借 AS B
ON A.関連日付 = B.日付;