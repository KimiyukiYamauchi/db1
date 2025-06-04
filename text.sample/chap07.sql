SELECT MAX(出金額) FROM 家計簿;
 
SELECT 費目, 出金額 FROM 家計簿
    WHERE 出金額 = 15000;

SELECT 費目, 出金額 FROM 家計簿
    WHERE 出金額 = (SELECT MAX(出金額) FROM 家計簿);

UPDATE 家計簿集計
    SET 平均 = (SELECT AVG(出金額)
                FROM 家計簿アーカイブ
                WHERE 出金額 > 0
                    AND 費目 = '食費')
WHERE 費目 = '食費';

SELECT 日付, メモ, 出金額,
        (SELECT 合計 FROM 家計簿集計
        WHERE 費目 = '食費') AS 過去の合計額
    FROM 家計簿アーカイブ
WHERE 費目 = '食費';

SELECT * FROM 家計簿集計
    WHERE 費目 IN ('食費', '水道光熱費', '教養娯楽費', '給料');

SELECT * FROM 家計簿集計
    WHERE 費目 IN (SELECT DISTINCT 費目 FROM 家計簿);

SELECT * FROM 家計簿
    WHERE 費目 = '食費'
        AND 出金額 <  (SELECT 出金額 FROM 家計簿アーカイブ
                            WHERE 費目 = '食費');

SELECT MAX(出金額) FROM 家計簿アーカイブ
    WHERE 費目 = '食費';

SELECT * FROM 家計簿
    WHERE 費目 = '食費'
        AND 出金額 < ALL (SELECT 出金額 FROM 家計簿アーカイブ
                            WHERE 費目 = '食費');

SELECT MIN(出金額) FROM 家計簿アーカイブ
    WHERE 費目 = '食費';

SELECT * FROM 家計簿
    WHERE 費目 NOT IN ('食費', '水道光熱費', NULL);

SELECT 費目 FROM 家計簿;

SELECT * FROM 家計簿アーカイブ
    WHERE 費目 IN (SELECT 費目 FROM 家計簿
                    WHERE 費目 IS NOT NULL);

SELECT * FROM 家計簿アーカイブ
    WHERE 費目 NOT IN (SELECT 費目 FROM 家計簿);

SELECT * FROM 家計簿アーカイブ
    WHERE 費目 NOT IN (SELECT 費目 FROM 家計簿
                        WHERE 費目 IS NOT NULL);

SELECT * FROM 家計簿アーカイブ
    WHERE 費目 NOT IN (SELECT COALESCE(費目, '不明') FROM 家計簿);


SELECT * FROM 家計簿アーカイブ
    WHERE 費目 IN (SELECT COALESCE(費目, '不明') FROM 家計簿);

SELECT SUM(SUB.出金額) AS 出金額合計
    FROM (SELECT 日付, 費目, 出金額
            FROM 家計簿
        UNION
        SELECT 日付, 費目, 出金額
            FROM 家計簿アーカイブ
            WHERE 日付 >= '2024-01-01' AND 日付 <= '2024-01-31') AS SUB;

INSERT INTO 家計簿集計(費目, 合計, 平均, 回数)
(SELECT 費目, SUM(出金額), AVG(出金額), 0
    FROM 家計簿
WHERE 出金額 > 0
GROUP BY 費目);