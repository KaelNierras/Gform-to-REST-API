function onFormSubmit(event) {
  var record_array = [];

  var form = FormApp.openById('1IJR8CerjuOB0nYqeYxQZibKlbnDNjjbLGK8BCGvNpyM'); // Form ID
  var formResponses = form.getResponses();
  var formCount = formResponses.length;

  var formResponse = formResponses[formCount - 1];
  var itemResponses = formResponse.getItemResponses();

  for (var j = 0; j < itemResponses.length; j++) {
    var itemResponse = itemResponses[j];
    var title = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();

    Logger.log(title);
    Logger.log(answer);

    record_array.push(answer);
  }
   
  AddRecord(record_array[0], record_array[1], record_array[2], record_array[3]);
}

function AddRecord(first_name, last_name, favorite_color, favorite_person) {
  var url = 'https://docs.google.com/spreadsheets/d/1PBsRpwZ0wjrxt-ROfwoln0f9Ml6UqfUOtS8yAeTVPgY/edit?gid=0#gid=0'; // URL OF GOOGLE SHEET
  var ss = SpreadsheetApp.openByUrl(url);
  var dataSheet = ss.getSheetByName("response_sheet");
  dataSheet.appendRow([first_name, last_name, favorite_color, favorite_person]);
}
