// This function handles HTTP GET requests to the web app
function doGet(req) {
  var spreadsheetId = '1PBsRpwZ0wjrxt-ROfwoln0f9Ml6UqfUOtS8yAeTVPgY';  // Your Google Sheet ID
  var sheetName = 'response_sheet';

  try {
    // Open the spreadsheet using the ID and get the specified sheet
    var doc = SpreadsheetApp.openById(spreadsheetId);
    var sheet = doc.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Get all values from the sheet
    var values = sheet.getDataRange().getValues();
    var output = [];

    // Iterate through the values and create the JSON output
    for (var i = 1; i < values.length; i++) { // Start at 1 to skip header row
      var row = {};
      row['first_name'] = values[i][0];
      row['last_name'] = values[i][1];
      row['favorite_color'] = values[i][2];
      row['favorite_person'] = values[i][3];
      output.push(row);
    }

    // Return the JSON response
    return ContentService.createTextOutput(JSON.stringify({data: output})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Error in doGet: ' + error.message);
    return ContentService.createTextOutput(JSON.stringify({error: error.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

// This function handles changes to the Google Sheet
function onChange(e) {
  // Log the change event for debugging
  Logger.log('Change detected: ' + JSON.stringify(e));

  // Optionally call doGet or other functions
  try {
    var result = doGet(e);
    Logger.log(result.getContent());
  } catch (error) {
    Logger.log('Error in onChange: ' + error.message);
  }
}

// Example function to set up the trigger programmatically (optional)
function createTrigger() {
  // Check if the trigger already exists and delete it
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onChange') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create the new onChange trigger
  ScriptApp.newTrigger('onChange')
    .forSpreadsheet('1PBsRpwZ0wjrxt-ROfwoln0f9Ml6UqfUOtS8yAeTVPgY')  // Your Google Sheet ID
    .onChange()
    .create();
}
