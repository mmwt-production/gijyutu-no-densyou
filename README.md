# 技術の継承

トップページ、「色掛けの伝承」の入口ページ、お問い合わせページの3つで構成されたサイトです。

```
project/
├── index.html              … トップページ(カルーセルでアプリ紹介)
├── contact.html             … お問い合わせフォーム
├── iro-kake.html            … 「色掛けの伝承」の入口ページ
├── css/style.css
├── js/
│   ├── main.js               … カルーセルの矢印操作
│   └── brush-hero.js          … 筆で色を重ねる演出(色掛けの伝承ページ)
└── google-apps-script/
    └── Code.gs                … お問い合わせをスプレッドシートに保存するスクリプト
```

## 1. VS Code / GitHubでの公開手順

1. このフォルダの中身をまるごと、VS Codeで開いているGitHubリポジトリにコピーします。
2. VS CodeのGit機能でコミット＆プッシュします（コミットメッセージ例: `サイト初期構築`）。
3. GitHubのリポジトリページで
   `Settings` → `Pages` → `Build and deployment` の `Branch` を
   公開したいブランチ（例: `main`）・フォルダ（`/root`）に設定します。
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

## 2. お問い合わせをGoogleスプレッドシートに貯める設定

1. 新しいGoogleスプレッドシートを作成します（お問い合わせ専用のものを推奨）。
2. メニュー「拡張機能」→「Apps Script」を開きます。
3. `google-apps-script/Code.gs` の中身をコピーして貼り付け、保存します。
4. 右上の「デプロイ」→「新しいデプロイ」から
   - 種類: **ウェブアプリ**
   - 実行するユーザー: **自分**
   - アクセスできるユーザー: **全員**
   を選び、デプロイします（初回はGoogleの承認画面が出ます）。
5. 発行された「ウェブアプリのURL」（`https://script.google.com/macros/s/xxxx/exec`）をコピーします。
6. `contact.html` 内の以下の部分に貼り付けます。

   ```js
   const CONTACT_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```

7. スプレッドシートを見ながらフォームを試し送信し、行が追加されることを確認してください。

## 3. 「色掛けの伝承」から実際のアプリへのリンク

`iro-kake.html` の最下部にある以下の1行を、実際のアプリ（ログイン画面）のURLに差し替えてください。

```js
document.getElementById('appLink').setAttribute('href', 'https://example.com/iro-kake/login');
```

## 4. 今後について（メモ）

- ログイン画面（アカウント名・パスワード入力）と、カード情報を入力する課金画面は、
  各アプリ側（この入口サイトとは別）に用意する想定として組んでいます。
  もしこの入口サイト側にログイン/課金の画面自体を作りたい場合は、教えてください。
  特にカード情報の入力・保存は、セキュリティ上、自作せずStripeなど決済代行サービスの
  決済画面（Stripe Checkoutなど）を利用することを強くおすすめします。
- 2つ目のアプリが決まったら、ルート階層に新しいHTMLファイル（例: `新アプリ名.html`）を追加し、
  `index.html` のカルーセル内の「準備中」カードを、そのアプリへのリンクに差し替えてください。
