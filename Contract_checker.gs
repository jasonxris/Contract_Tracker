  /*
  0 - Acceptor id
  5 - contract_id
  14 - issuer_id (should be me)
  15 - price 
  18 - Status ( should be finished)
  19 - title should be be name of the contract 
  20 - type 
  */
let SSj4gogetaId = 384765072;
function getContractData() {
  let wholeSheet = SpreadsheetApp.getActiveSpreadsheet();  
  let dataSheet = wholeSheet.getSheetByName("Data");
  let data = GESI.characters_character_contracts("Ssj4gogeta")
  const startRowNumber = dataSheet.getLastRow()+1;
  const lastContractAcceptDate = dataSheet.getRange(startRowNumber-1,8).getValue().toString();
  console.log(lastContractAcceptDate)
  const starColumnNumber = 1;
  newDat = cleanData(data, lastContractAcceptDate);

  console.log(newDat);
  if(newDat.length == 0){
    SpreadsheetApp.getUi().alert("No Contract Added");
    return;
  }

  const endRowNumber = newDat.length;
  const endColumnNumber = newDat[0].length;
  console.log("sorting")
  newDat.sort(function(a, b) {
    var timestamp1 = a[7]; 
    var timestamp2 = b[7]; 
    if (timestamp1 < timestamp2) {
      return -1;
    }
    if (timestamp1 > timestamp2) {
      return 1;
    }
    return 0;
  });
  console.log("sorted")
  const range = dataSheet.getRange(startRowNumber, starColumnNumber, endRowNumber, endColumnNumber);
  range.setValues(newDat);
  const dateRange = dataSheet.getRange(startRowNumber,8,endRowNumber,endColumnNumber)
  dateRange.setNumberFormat("@");
  SpreadsheetApp.getUi().alert("added " + newDat.length + " contracts")

}

function fixTimeStamp(timestamp){
  console.log("fixing: " + timestamp);
  // replace 11th character with space
  // replace delete last character 
  timestamp = replaceCharacter(10," ", timestamp);
  if(timestamp.charAt(timestamp.length-1) == 'Z'){
    timestamp = timestamp.slice(0, -1)
  }
  console.log("successful");
  return timestamp;
}
function replaceCharacter(index, replacement, targetString) {
    return targetString.substr(0, index) + replacement + targetString.substr(index + replacement.length);
}

function cleanData(data, lastContractAcceptDate){
  let newData = [];
  for(let i = 0; i < data.length; i ++){
    let newRow = [data[i][5], data[i][0], data[i][14], data[i][15], data[i][18], data[i][19], data[i][21], data[i][6], data[i][9]];
    if(data[i][18] == 'finished'){
      if(data[i][14] == SSj4gogetaId){
        if(data[i][15] != 0){
          if(fixTimeStamp(data[i][6]) > fixTimeStamp(lastContractAcceptDate) || lastContractAcceptDate == "date_accepted"){
            newRow[7] = fixTimeStamp(newRow[7])
            newRow[8] = fixTimeStamp(newRow[8])
            newData.push(newRow);
          }  
        }
      }
    }
  }
  return newData;
}

