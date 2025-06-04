SELECT 分類, 商品名, nullif(サイズ, 'X') AS サイズ, 単価
FROM 注文履歴
GROUP BY 分類, 商品名, サイズ, 単価
ORDER BY 分類, 商品名;


SELECT 注文番号, SUM(注文金額) AS 合計
FROM 注文履歴
GROUP BY 注文番号
HAVING SUM(注文金額) > 1500;
