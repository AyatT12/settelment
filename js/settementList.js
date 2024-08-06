document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      document.getElementById("contract-extension-form").onsubmit = function (event) {
        event.preventDefault();
        console.log("Search Query:", document.getElementById("search").value);
      };
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
  var tableRows = document.getElementById("settelmentListTable").getElementsByTagName("td");
  for (var i = 0; i < tableRows.length; i++) {
    tableRows[i].addEventListener("click", function() {
      window.location.href = "contract_Settlement.html"; 
    });
  }
});

/////
var rows = document.getElementById("settelmentListTable").getElementsByTagName("tr");
for (var i = 0; i < rows.length; i++) {
  rows[i].onclick = function () {
    var cells = this.getElementsByTagName("td");
    var tenantIdParagraph = cells[4].getElementsByClassName("contract-id")[0];
    console.log(tenantIdParagraph.innerText);
  };
}
