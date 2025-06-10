## 仮想環境の設定

### 1. プロジェクトディレクトリ作成

``` bash
mkdir db1
cd db1
```

### 2. Vagrantfile の初期化（Ubuntu Boxを指定）

``` bash
vagrant init bento/ubuntu-24.04
```

### 3. 仮想マシンの起動

``` bash
vagrant up
```
初回はBoxのダウンロードがあり少し時間がかかります。

### 4. 仮想マシンにログイン

``` bash
vagrant ssh
```

---
以下は保留
## ホスト側のvscodeからゲストのvagrantユーザのhomeディレクトリを参照する

### 1. VS CodeにRemote - SSH拡張機能をインストール
1. VS Codeを起動
2. サイドバー左の「拡張機能」アイコンをクリック
3. 「Remote - SSH」で検索し、Microsoft製のものをインストール

### 2. VagrantのSSH設定を確認

``` bash
vagrant ssh-config
```

このコマンドは以下のような出力を返します：
```
Host default
  HostName 192.168.121.122
  User vagrant
  Port 22
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile /home/yamauchi/Boxes/db1/.vagrant/machines/default/libvirt/private_key
  IdentitiesOnly yes
  LogLevel FATAL
  PubkeyAcceptedKeyTypes +ssh-rsa
  HostKeyAlgorithms +ssh-rsa
```

### 3. ~/.ssh/config に設定追加（ホスト側）

``` bash
code ~/.ssh/config
```

- 出力結果をファイルに貼りつける
- Host名は適宜変更(ここではdb1)
- 
```
Host db1
  HostName 192.168.121.122
  User vagrant
  Port 22
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile /home/yamauchi/Boxes/db1/.vagrant/machines/default/libvirt/private_key
  IdentitiesOnly yes
  LogLevel FATAL
  PubkeyAcceptedKeyTypes +ssh-rsa
  HostKeyAlgorithms +ssh-rsa
```

### 4. VS Codeで「Remote SSH」から vagrant-vm に接続
- コマンドパレット（Ctrl+Shift+P）→ Remote-SSH: Connect to Host... → vagrant-vm
- 接続後、ゲストの /home/vagrant を直接ブラウズ・編集できます！