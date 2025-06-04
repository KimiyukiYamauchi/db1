select 出金額, 出金額 + 100, 'SQL'
from 家計簿;

select 出金額, 
       出金額 + 100 as 百円増しの出金額
from 家計簿;

insert into 家計簿
        values(now(), '食費', 'ランチ', 0, 1000+105);

select 費目, 出金額,
case 費目 when '居住費' then '固定費'
when '水道光熱費' then '固定費'
else '変動費'
end as 出金の分類
from 家計簿
where 出金額 > 0;

select 費目, 出金額,
case when 出金額 < 1000 then 'A'
when 出金額 < 3000 then 'B'
when 出金額 < 10000 then 'C'
ELSE 'D'
-- when 出金額 >= 10000 then  'D'
end as 支出の分類
from 家計簿
where 出金額 > 0;

select メモ, char_length(メモ) as メモの長さ
from 家計簿

select メモ, length(メモ) as メモの長さ
from 家計簿
where length(メモ) <= 10

select メモ, replace(メモ, '購入', '買った') as 空白除去したメモ
from 家計簿;