function onFormSubmit(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const submittedRow = sheet.getLastRow();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = sheet
      .getRange(submittedRow, 1, 1, sheet.getLastColumn())
      .getValues()[0];
  
    // ChatGPTによる評価のための模範解答一覧（Q1〜Q6）
    const correctAnswers = getCorrectAnswersFromJson();
  
    headers.forEach((header, colIndex) => {
      const match = header.match(/^(Q[0-9]+)[\s:：]/); // 「Q1: ～」形式に対応
      if (match) {
        const qNum = match[1]; // 例: "Q1"
        const 判定列名 = `判定_${qNum}`;
        const 判定ColIndex = headers.findIndex((h) => h === 判定列名);
        const studentSQL = rowData[colIndex];
        const correctSQL = correctAnswers[qNum];
  
        if (correctSQL && 判定ColIndex !== -1 && studentSQL) {
          const feedback = getSQLJudgementWithChatGPT(studentSQL, correctSQL);
          sheet.getRange(submittedRow, 判定ColIndex + 1).setValue(feedback);
        }
      }
    });
  }
  