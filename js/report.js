const form = document.getElementById('report-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }

 
});
////////////////////////////////////////////////////////////////////////////
var start = document.getElementById('start-date');
var end = document.getElementById('end-date');

start.addEventListener('change', function() {
    if (start.value)
        end.min = start.value;
}, false);
end.addEventListener('change', function() {
    if (end.value)
        start.max = end.value;
}, false);
/////////////////////////////////////////////////////////////////////////////////
document.querySelectorAll("#reportTable .contract_number_td").forEach(function(td) {
  td.addEventListener("click", function() {
    var contractNumberElement = td.querySelector(".contract_number");
    if (contractNumberElement) {
      console.log(contractNumberElement.textContent.trim());
    }
  });
});

