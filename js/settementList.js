document.addEventListener("DOMContentLoaded", function() {
  var table = document.getElementById("settelmentListTable");
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) { 
      cells[j].addEventListener("click", function() {
        window.location.href = "contract_Settlement.html"; 
      });
    }
  }
});
