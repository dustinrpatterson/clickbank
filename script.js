var findReceiptButton = document.getElementById("findReceiptButton");
var receiptsContainer = document.getElementById("receipts");

findReceiptButton.addEventListener("click", function(e) {
  var vendorInput = $("#vendorNickname").val();
  e.preventDefault();
  findReciepts(vendorInput);
});

function findReciepts(vendor) {
  var url = "http://bcw-getter.herokuapp.com/?url=";
  var url2 = "http://www.jakelake.io/api/?vendor=" + vendor;
  var apiUrl = url + encodeURIComponent(url2);
  fetch(apiUrl)
    .then(resp => resp.json())
    .then(function(data) {
        receiptsContainer.innerHTML = "";
      if(data.data){
          drawData(receiptsContainer, data.data)
      }else{
        receiptsContainer.innerHTML = `<h4>No receipts could be found with that nickname. Please check the spelling and try again.</h4>`;
      }
    })
    .catch(function(err){
        receiptsContainer.innerHTML = "Sorry, there seems to be an error... ";
        console.log(err);
    })
}

function drawData(element, data){
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        element.innerHTML += `<p>${item}</p>`;
    }
}
