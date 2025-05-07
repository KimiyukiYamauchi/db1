## MariaDB のインストール手順（Ubuntu 22.04 以降）

### 1. パッケージリストを更新

```bash

sudo apt update

```

### 2. MariaDB をインストール

```bash

sudo apt install mariadb-server

```

### 3. セキュリティ設定を実行（推奨）

```bash

sudo mysql_secure_installation

```

- ここでは root パスワード設定、不要ユーザーの削除などが行えます。
- 基本的に質問に「はい」で答えていくと安全な構成になります。

### 4. サービスを起動・確認

```bash

sudo systemctl start mariadb
sudo systemctl status mariadb

```

### 5. MariaDB にログイン

```bash

sudo mariadb

```

## 日本語対応について

MariaDB はインストール直後でも、文字コードが utf8mb4 になっていることが多く、日本語がそのまま使えます。

念のため、現在の文字コード設定を確認したい場合は、MariaDB にログイン後、以下の SQL を実行してみてください。

```bash

SHOW VARIABLES LIKE 'char%';

```

## 使えるか簡単にテスト

```bash

CREATE DATABASE testdb CHARACTER SET utf8mb4;
USE testdb;

CREATE TABLE greetings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message VARCHAR(100)
);

INSERT INTO greetings (message) VALUES ('こんにちは！'), ('SQL楽しいですね');

SELECT * FROM greetings;

```