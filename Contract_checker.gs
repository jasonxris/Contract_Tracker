let SSj4gogetaId = 384765072;

function getContractData() {
  // Set up Google Variables
  let contractTracker = SpreadsheetApp.getActiveSpreadsheet();
  let dataSheet = contractTracker.getSheetByName("Data");
  let outDataSheet = contractTracker.getSheetByName("OutData");

  // Pull Data from Eve API
  let data = GESI.characters_character_contracts("Ssj4gogeta")

  // Prepare outstanding DataSheet
  outDataSheet.getRange(2,1,300,10).clear();

  // Get setup Data that is needed
  const startRowNumber = dataSheet.getLastRow()+1;
  const lastContractAcceptDate = dataSheet.getRange(startRowNumber-1,8).getValue().toString();

  //Prepare Data
  dataWrapper = prepareFinishedContract(data, lastContractAcceptDate);
  outstandingData = dataWrapper[1];
  finishedCData = dataWrapper[0];

  // sort Data
  outstandingData.sort(function(a, b) {
    var timestamp1 = a[5];
    var timestamp2 = b[5];
    if (timestamp1 < timestamp2) {
      return -1;
    }
    if (timestamp1 > timestamp2) {
      return 1;
    }
    return 0;
  });

  // Set Outstanding contract values
  outDataSheet.getRange(2, 1, outstandingData.length, outstandingData[0].length).setValues(outstandingData);
  outDataSheet.getRange(2,5,outstandingData.length,outstandingData[0].length).setNumberFormat("@");

  // Sort and set finishedCData
  if(finishedCData.length != 0){

    // Get the end row and column values for finished contracts
    const endRowNumber = finishedCData.length;
    const endColumnNumber = finishedCData[0].length;

    // Sort finishedCData
    finishedCData.sort(function(a, b) {
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

    // Set finished Data
    dataSheet.getRange(startRowNumber, 1, endRowNumber, endColumnNumber).setValues(finishedCData);
    dataSheet.getRange(startRowNumber,8,endRowNumber,endColumnNumber).setNumberFormat("@");

    SpreadsheetApp.getUi().alert("added " + finishedCData.length + " contracts")
  }
}

function fixTimeStamp(timestamp){

  // replace 11th character with space
  // replace delete last character
  timestamp = replaceCharacter(10," ", timestamp);
  if(timestamp.charAt(timestamp.length-1) == 'Z'){
    timestamp = timestamp.slice(0, -1)
  }
  if(timestamp.length == 18){
    timestamp = timestamp.slice(0, 11) + "0" + timestamp.slice(11);
  }
  return timestamp;
}

function replaceCharacter(index, replacement, targetString) {
  return targetString.substr(0, index) + replacement + targetString.substr(index + replacement.length);
}

function prepareFinishedContract(data, lastContractAcceptDate){
  let wrappedData = [];
  let finishedData = [];
  let outstandingData = [];

  for(let i = 0; i < data.length; i ++){
    let finishedRow = [data[i][5], data[i][0], data[i][14], data[i][15], data[i][18], data[i][19], data[i][21], data[i][6], data[i][9]];
    let outstandingRow = [data[i][5], data[i][15], data[i][19], data[i][21], data[i][9]];

    // Separates the finished contracts
    if(data[i][18] == 'finished'){
      if(data[i][14] == SSj4gogetaId){
        if(data[i][15] != 0){
          if(fixTimeStamp(data[i][6]) > fixTimeStamp(lastContractAcceptDate) || lastContractAcceptDate == "date_accepted"){
            finishedRow[7] = fixTimeStamp(finishedRow[7])
            finishedRow[8] = fixTimeStamp(finishedRow[8])
            finishedData.push(finishedRow);
          }
        }
      }
    // This separates the Outstanding contracts from the finished contracts
    } else if(data[i][18] == 'outstanding'){
       if(data[i][15] != 0){
          outstandingRow[4] = fixTimeStamp(outstandingRow[4])
          outstandingData.push(outstandingRow);
      }
    }
  }

  wrappedData.push(finishedData);
  wrappedData.push(outstandingData);
  return wrappedData;
}
