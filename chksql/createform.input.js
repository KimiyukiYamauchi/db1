function createSQLSubmissionFormFromData() {
  const fileName = "db1_chap03.01.json";
  const files = DriveApp.getFilesByName(fileName);

  if (!files.hasNext()) {
    Logger.log("ファイルが見つかりません: " + fileName);
    return;
  }

  const file = files.next();
  const content = file.getBlob().getDataAsString("utf-8");
  const data = JSON.parse(content);

  // フォーム作成
  const chapter = "Chapter3 操作する行の絞り込み(その1)";
  const form = FormApp.create(`【${chapter}】課題提出フォーム`);
  form.setDescription("各問題に対してSQL文を記述してください。");

  // 🔐 Googleログインユーザーのメールを自動収集
  form.setCollectEmail(true); // ← これで「メールアドレス」列が自動的に追加されます

  // 氏名の入力
  form.addTextItem().setTitle("氏名").setRequired(true);

  data.forEach((item) => {
    const title = `Q${item.questionNumber}: ${item.question}`;
    form.addParagraphTextItem().setTitle(title).setRequired(false);
  });

  // 回答用スプレッドシートを新規作成してフォームにリンク
  const sheet = SpreadsheetApp.create(`【${chapter}】提出課題提一覧`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  Logger.log("スプレッドシート作成＆連携完了: " + sheet.getUrl());

  // スプレッドシートが整うまで少し待機（非同期対策）
  Utilities.sleep(3000);

  // 正誤判定列を追加（見出し行の右に）
  const sheetObject = SpreadsheetApp.openById(sheet.getId());
  const sheet1 = sheetObject.getSheets()[0];
  const headers = sheet1
    .getRange(1, 1, 1, sheet1.getLastColumn())
    .getValues()[0];
  const numOriginalCols = headers.length;

  const 判定列 = data.map((item) => `判定_Q${item.questionNumber}`);
  sheet1.getRange(1, numOriginalCols + 1, 1, 判定列.length).setValues([判定列]);

  // フォームとスプレッドシートを quiz_data.json と同じフォルダに移動
  const parentFolders = file.getParents();
  const formFile = DriveApp.getFileById(form.getId());
  const sheetFile = DriveApp.getFileById(sheet.getId());

  if (parentFolders.hasNext()) {
    const parent = parentFolders.next();
    parent.addFile(formFile);
    parent.addFile(sheetFile);
    DriveApp.getRootFolder().removeFile(formFile);
    DriveApp.getRootFolder().removeFile(sheetFile);
    Logger.log("フォームとシートをフォルダに移動しました。");
  } else {
    Logger.log("親フォルダが見つかりません。");
  }

  Logger.log("フォーム編集URL: " + form.getEditUrl());
  Logger.log("フォーム回答URL: " + form.getPublishedUrl());
}
