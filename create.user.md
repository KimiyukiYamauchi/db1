## ユーザーを作成手順

### 1. MariaDBに root でログイン

``` sql
sudo mariadb
```

### 2. ユーザーを作成（例：ユーザー名 testuser、パスワード pass）

``` sql
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'pass';
```

### 3. 権限を付与（データベース testdb を使えるように）

``` sql
GRANT ALL PRIVILEGES ON `testdb`.* TO 'testuser'@'localhost';
```

### 4. 権限の変更を反映

``` sql
FLUSH PRIVILEGES;
```

### 5. 作成したユーザで接続

``` bash
mysql -u testuser -ppass
mysql -u testuser -p
```