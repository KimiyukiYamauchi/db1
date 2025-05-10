## 事前準備

Mariadb に接続し、以下のスクリプトを実行し、問題用の環境を作成

```sql
-- データベース作成（文字コードはUTF8MB4で日本語対応）
CREATE DATABASE `std-planets` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用するデータベースを指定
USE `std-planets`;

-- テーブル作成（日本語の列名もOK）
CREATE TABLE `惑星一覧` (
  `名前` VARCHAR(20),
  `英名` VARCHAR(20),
  `半径` INT,
  `重量` INT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

INSERT INTO `惑星一覧` (`名前`, `英名`, `半径`, `重量`) VALUES
('水星', 'MERCURY', 2439, 3310),
('金星', 'VENUS', 6052, 48700),
('地球', 'EARTH', 6378, 59760),
('火星', 'MARS', 3397, 6420),
('木星', 'JUPITER', 71492, 18993500),
('土星', 'SATURN', 60268, 5685980),
('天王星', 'URANUS', 25559, 868910),
('海王星', 'NEPTUNE', 24764, 1029660);


select * from 惑星一覧;
```

## 問題

- 問題  
  水星のデータを抽出する

- 問題２  
  水星でないデータを抽出する

- 問題３  
  半径が 10000 以上のデータ

- 問題４  
  重量が 60000 以下のデータ

- 問題５  
  水星と地球と土星のデータ

- 問題６  
  半径が 3000 以上で重量が 60000 未満のデータ
