---

# README: Creating a Web API for Google Form Responses

## Overview

#This tutorial guides you through two main steps:
1. Creating a Google Apps Script to add form responses to a Google Sheet.
2. Converting the Google Sheet data into a JSON-format web API.

## Prerequisites

- A Google Form to collect responses.
- A Google Sheet to store responses from the Google Form.
- Basic knowledge of JavaScript and web APIs.

## Step 1: Create a Google Apps Script to Add Form Responses to Google Sheet

### 1.1 Set Up Google Form and Google Sheet

1. **Create a Google Form**: Set up your form with the following questions:
   - First Name
   - Last Name
   - Favorite Color
   - Favorite Person

### 1.2 Create a Google Apps Script for Google Form

1. **Open the Script Editor**:
   - Open the linked Google Form.
   - Go to `Extensions` > `Apps Script`.

2. **Write the Script**:

   Replace any existing code with the following:

   ```javascript
   function onFormSubmit(event) {
       var record_array = [];
     
       var form = FormApp.openById('form-id'); // URL: https://docs.google.com/forms/d/1IJR8CerjuOB0nYqeYxQZibKlbnDNjjbLGK8BCGvNpyM/edit form-id: 1IJR8CerjuOB0nYqeYxQZibKlbnDNjjbLGK8BCGvNpyM Note: Use the edit URL
       var formResponses = form.getResponses();
       var formCount = formResponses.length;
     
       var formResponse = formResponses[formCount - 1];
       var itemResponses = formResponse.getItemResponses();
     
       for (var j = 0; j < itemResponses.length; j++) {
         var itemResponse = itemResponses[j];
         var title = itemResponse.getItem().getTitle();
         var answer = itemResponse.getResponse();
  
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
   ```

### 1.3 Configure Form Submission Trigger

1. **Set Up the Trigger**:
   - Go to `Triggers` (clock icon) in the Apps Script editor.
   - Click `+ Add Trigger`.
   - Set the function to `onFormSubmit`, the event type to `From form`, and the trigger type to `On form submit`.

## Step 2: Convert Google Sheet Data to a Web API

### 2.1 Create a blank Google Sheet
1. With Column Heading `First name`, `Second name`, `Favorite color` and `Favorite person` respectively.
   
### 2.2 Create a Google Apps Script for Google Sheet

1. **Open the Script Editor**:
   - Open the linked Google Sheet.
   - Go to `Extensions` > `Apps Script`.

### 2.3 Write the Script:

   Replace any existing code with the following:

   ```javascript
   // This function handles HTTP GET requests to the web app
   function doGet(req) {
     var spreadsheetId = 'sheet-id';  // Sample Id: https://docs.google.com/spreadsheets/d/1PBsRpwZ0wjrxt-ROfwoln0f9Ml6UqfUOtS8yAeTVPgY/edit?gid=0#gid=0 sheet-id:1PBsRpwZ0wjrxt-ROfwoln0f9Ml6UqfUOtS8yAeTVPgY
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
       return ContentService.createTextOutput(JSON.stringify({error: error.message})).setMimeType(ContentService.MimeType.JSON);
     }
   }
   
   // This function handles changes to the Google Sheet
   function onChange(e) {
     // Log the change event for debugging
     Logger.log('Change detected: ' + JSON.stringify(e));
   
     try {
       var result = doGet(e);
       Logger.log(result.getContent());
     } catch (error) {
       Logger.log('Error in onChange: ' + error.message);
     }
   }
   
   ```

### 2.4 Set Up the Trigger

1. Go to `Triggers` (clock icon) in the Apps Script editor.
2. Click `+ Add Trigger`.
3. Set the function to `onChange`, the event type to `From spreadsheet`, and the trigger type to `On change`.

### 2.5 Deploy the App Script for Google Sheet
1. Click `Deploy`.
2. Set the `Description` and for now set the access to `Anyone`.
3. Click `Deploy`.
4. After deploying, save the `Web App URL` because it will be used in fetching the data.

### 2.6 Test Your Web API

1. **Clone the Repository**:
   - Clone the repository and run it on your computer. It is expected that it will not work initially because you need to update the response fetch `URL`.
2. **Replace the Response Fetch `URL`**:
   - Go to the `Scripts` folder, then open `fetch.js` on line `7` and replace it with your `Web App URL`.
   ```javascript
   const response = await fetch('URL'); //Sample URL: https://script.googleusercontent.com/macros/echo?user_content_key=rPM3d5v5m1XpzTqqrLfMbALU46tjSCLei61HHSdDW1LW4WztdBSeBfi17ifa1vqZ7fjyPFaciNiX_C7qgkVGwXMep727dR4im5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDqIju9jtyeSxnuNzFcy8Ycqmb4u5P-m3GPoBbem44AgdoZov6eGMszytH0ZW5WGbeqijaeHLFknwUOMBeH84Y3cHXuPp82r7Nz9Jw9Md8uu&lib=M7zMVhDnsSo1RE-JTI0CmJ4IeVLfGYZxt
   ```
3. **Run the `index.html`**.

## Additional Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Forms API](https://developers.google.com/forms/api)

## Conclusion

Congratulations! You've successfully set up a web API to access Google Form responses via Google Sheets. You can now integrate this API with other applications or services to use your form data programmatically.

---
