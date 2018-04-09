var findReceiptButton = document.getElementById("findReceiptButton");
var receiptsContainer = document.getElementById("receipts");
var url = "http://bcw-getter.herokuapp.com/?url=";
var allReceipts = [];

// This is the reusable GET function
function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}
// Event listener that kicks everything off
findReceiptButton.addEventListener("click", function(e) {
  e.preventDefault();
  var vendorInput = $("#vendorNickname").val();
  findRecieptsByNickname(vendorInput);
});

function findRecieptsByNickname(vendor) {
  // Clears page on new search
  receiptsContainer.innerHTML = "";

  var urlNickname = "http://www.jakelake.io/api/?vendor=" + vendor;
  var apiNicknameUrl = url + encodeURIComponent(urlNickname);
  httpGetAsync(apiNicknameUrl, function(data) {
    receiptsContainer.innerHTML = `<div id="accordion"></div>`;
    data = JSON.parse(data);
    receiptArray = data.data;
    if (receiptArray) {
      receiptArray.forEach(receiptID => {
        findReceiptDetails(receiptID);
      });
    } else {
      receiptsContainer.innerHTML += `<h5 class="error">Vendor not found. Please check the spelling and try again.</h5>`;
    }
    // For loop over data (receipt IDs)
  });
}

function findReceiptDetails(Id) {
  var urlReciptDetails = "http://www.jakelake.io/api/?receipt=" + Id;
  var apiReceiptUrl = url + encodeURIComponent(urlReciptDetails);

  document.getElementById("accordion").innerHTML += `
    <div class="card">
        <div class="card-header" id="${Id}">
            <h5 class="mb-0">
                <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${Id}" aria-expanded="true" aria-controls="collapse${Id}">
                ${Id}
                </button>
            </h5>
        </div>

        <div id="collapse${Id}" class="collapse" aria-labelledby="${Id}" data-parent="#accordion">
            <div class="card-body" id="card-body-${Id}">
                
            </div>
        </div>
    </div>`;

  httpGetAsync(apiReceiptUrl, function(data) {
    var card = document.getElementById("card-body-" + Id);
    data = JSON.parse(data);
    drawData(data, card);
  });
}

function drawData(data, elem) {
  if (data.data) {
    // TODO - Write accordion here
    elem.innerHTML += `
        <ul>
            <li>Email: ${data.data.customer.billing.email}</li>
            <li>Item #: ${data.data.lineItems[0].itemNo}</li>
            <li>Item Title: ${data.data.lineItems[0].productTitle}</li>
            <li>Quantity: ${data.data.lineItems[0].quantity}</li>
            <li>Price: ${data.data.totalOrderAmount}</li>
        </ul>`;
  } else {
    elem.innerHTML += `
        <ul>
            <li class="error">${data.status_message}</li>
        </ul>`;
  }
}
