let selectedFile = null;
let messageDisplayed = false;

document.getElementById("fileInput").addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    showUploadMessage(); // Call the function to show the message
    readFile(selectedFile);
    messageDisplayed = true;
  }
});

document.getElementById("generateTable").addEventListener("click", () => {
  if (messageDisplayed) {
    document.querySelector(".container").style.display = "none";
    document.getElementById("tableContainer").style.display = "block";
  } else {
    alert("قم بتحميل الملف بالأول"); // Display a message if no file has been uploaded
  }
});

// Function to show the upload message
function showUploadMessage() {
  const uploadMessage = document.getElementById("uploadMessage");
  uploadMessage.style.display = "block";
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Assuming you are reading the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the XLSX data to an HTML table
    const htmlTable = XLSX.utils.sheet_to_html(worksheet, {
      raw: true, // Preserve rich text and styles
      editable: false, // Allow cell editing
    });

    // Remove empty rows from the HTML table
    const cleanedHTML = removeEmptyRowsFromHTML(htmlTable);

    document.getElementById("excelData").innerHTML = cleanedHTML;
  }

  reader.readAsArrayBuffer(file);
}

function removeEmptyRowsFromHTML(htmlTable) {
  const div = document.createElement("div");
  div.innerHTML = htmlTable;

  // Select all rows in the table
  const rows = div.querySelectorAll("tr");

  // Iterate through the rows and remove those with no content
  for (let i = rows.length - 1; i >= 0; i--) {
    const cells = rows[i].querySelectorAll("td, th");
    let isEmpty = true;
    cells.forEach((cell) => {
      if (cell.innerHTML.trim() !== "") {
        isEmpty = false;
      }
    });

    if (isEmpty) {
      rows[i].remove();
    }
  }

  // Convert the modified HTML back to a string
  const cleanedHTML = div.innerHTML;

  return cleanedHTML;
}
