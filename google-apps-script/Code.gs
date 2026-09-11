/**
 * 「技術の継承」お問い合わせフォーム受信用スクリプト
 *
 * 【使い方】
 * 1. お問い合わせを保存したいGoogleスプレッドシートを開く
 * 2. メニュー「拡張機能」→「Apps Script」を開く
 * 3. デフォルトの Code.gs の中身を、このファイルの内容に置き換えて保存
 * 4. 1行目に見出し行を作成しておく（任意。無くても自動で入ります）:
 *    A1: 送信日時   B1: お名前   C1: メールアドレス   D1: お問い合わせ内容
 * 5. 画面右上の「デプロイ」→「新しいデプロイ」を選択
 *    - 種類の選択で「ウェブアプリ」を選ぶ
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 6. 発行された「ウェブアプリのURL」を、contact.html の
 *    CONTACT_ENDPOINT に貼り付ける
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.message || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
