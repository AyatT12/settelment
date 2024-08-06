jQuery(document).ready(function () {
   
  ExpensesImgUpload();
  compensationImgUpload();
  examinationImgUpload();
});
//⁡⁢⁣⁣//////////////////////////    𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻𝘀   ////////////////////////////////////⁡

//=======================================’Moving Between Fieldsets=============================================================
  let current_fs, next_fs, previous_fs;
  const nextButtons = document.querySelectorAll(".next");
  const ExpensesCheckbox = document.getElementById('expenses');
  const CompensationCheckbox = document.getElementById('compensation-check');
  const fieldsets = document.querySelectorAll("fieldset");


    // Function to hide error message
const hideErrorMessage = (field) => {
  const errorMessage = field.parentNode.querySelector(".invalid-feedback");
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
};


  Array.from(nextButtons).forEach((nextBtn) => {
    nextBtn.addEventListener("click", (event) => {
      const fieldset = nextBtn.closest("fieldset");
      let isValid = true;
      Array.from(fieldset.elements).forEach((field) => {
        if (field.checkValidity() === false) {
          isValid = false;
          const errorMessage = field.parentNode.querySelector(".invalid-feedback");
          if (errorMessage) {
            errorMessage.style.display = "block";
          }
        }
      });
     
      
        // Add input event listeners to all input fields within the fieldsets
        fieldsets.forEach((fieldset) => {
          Array.from(fieldset.elements).forEach((field) => {
            field.addEventListener('input', () => {
              hideErrorMessage(field);
            });
          });
        });
      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
       
      } else {
       
        const current_fs = nextBtn.closest("fieldset");
        let next_fs = current_fs.nextElementSibling;
       
        
        if (current_fs.id === 'firstFieldset') {
        
          if (!ExpensesCheckbox.checked && CompensationCheckbox.checked) {
              next_fs = current_fs.nextElementSibling.nextElementSibling;
              $("#progressbar li").eq($("fieldset").index(current_fs.nextElementSibling)).addClass("active");

          } else if (!ExpensesCheckbox.checked && !CompensationCheckbox.checked) {
            next_fs = current_fs.nextElementSibling.nextElementSibling.nextElementSibling;
            $("#progressbar li").eq($("fieldset").index(current_fs.nextElementSibling)).addClass("active");
            $("#progressbar li").eq($("fieldset").index(current_fs.nextElementSibling.nextElementSibling)).addClass("active");


          }
          else{
              next_fs = current_fs.nextElementSibling;

          }
        }

        if (current_fs.id === 'SecondFieldset') {
         
          if (ExpensesCheckbox.checked && !CompensationCheckbox.checked) {
            next_fs = current_fs.nextElementSibling.nextElementSibling;
            $("#progressbar li").eq($("fieldset").index(current_fs.nextElementSibling)).addClass("active");

          }
        }
   
        Array.from(next_fs.elements ).forEach((field) => {
          field.addEventListener('input', () => {
            hideErrorMessage(field);
          });
        }); 
        

        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        next_fs.style.display = "flex";
        current_fs.style.display = "none";
      }
    });
  });

  const previousButtons = document.querySelectorAll(".previous");

  Array.from(previousButtons).forEach((prevBtn) => {
    prevBtn.addEventListener("click", (event) => {
      const current_fs = prevBtn.closest("fieldset");
      let previous_fs = current_fs.previousElementSibling;
      if (current_fs.id === 'FourthFieldset') {
      
        if (ExpensesCheckbox.checked && CompensationCheckbox.checked) {
          previous_fs = current_fs.previousElementSibling;
        } else if (!ExpensesCheckbox.checked && !CompensationCheckbox.checked) {
          previous_fs = current_fs.previousElementSibling.previousElementSibling.previousElementSibling;
          $("#progressbar li").eq($("fieldset").index(current_fs.previousElementSibling)).removeClass("active");
          $("#progressbar li").eq($("fieldset").index(current_fs.previousElementSibling.previousElementSibling)).removeClass("active");
        } else if (ExpensesCheckbox.checked && !CompensationCheckbox.checked) {
          previous_fs = current_fs.previousElementSibling.previousElementSibling;
          $("#progressbar li").eq($("fieldset").index(current_fs.previousElementSibling)).removeClass("active");

        }
      
      }

      if (current_fs.id === 'ThirdFieldset') {
     
        if (!ExpensesCheckbox.checked && CompensationCheckbox.checked) {
          previous_fs = current_fs.previousElementSibling.previousElementSibling;
          $("#progressbar li").eq($("fieldset").index(current_fs.previousElementSibling)).removeClass("active");

        }
      }
      Array.from(previous_fs.elements).forEach((field) => {
          field.addEventListener('input', () => {
            hideErrorMessage(field);
          });
        });
$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      previous_fs.style.display = "flex";
      current_fs.style.display = "none";
    });
  });

//====================================================================================================
//========================================Upload Expenses Imgs Lists============================================================
//====================================================================================================
var ExpensesArray = [];

function ExpensesImgUpload() {
  var imgWrap = '';
  
  $('#Expenses-images').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box').find('.upload_img-wrap_inner');
      var maxLength = 4;
      var uploadBtnBox = document.getElementById('Expenses-upload-box');
      var errorMessageDiv = document.getElementById('ExpensesError');
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
   

      if (ExpensesArray.length + filesArr.length > maxLength) {
        uploadBtnBox.style.display = 'none';
        errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
        errorMessageDiv.style.display = 'block';
      } else {
        uploadBtnBox.style.display = 'flex';
        errorMessageDiv.style.display = 'none';
      }

      for (var i = 0; i < Math.min(filesArr.length, maxLength - ExpensesArray.length); i++) {
        (function(f) {
          if (!f.type.match('image.*')) {
            return;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
            var html =
              "<div class='upload__img-box'><div style='background-image: url(" +
              e.target.result +
              ")' data-number='" +
              $('.upload__img-close1').length +
              "' data-file='" +
              f.name +
              "' class='img-bg'><div class='upload__img-close1'><img src='delete.png'></div></div></div>";
            imgWrap.append(html);
            ExpensesArray.push({
              f: f,
              url: e.target.result
            });
            console.log(ExpensesArray);
          };
          reader.readAsDataURL(f);
        })(filesArr[i]);
      }
    });
  });

  $('body').on('click', '.upload__img-close1', function (e) {
    e.stopPropagation(); 
    var file = $(this).parent().data('file');

    for (var i = 0; i < ExpensesArray.length; i++) {
      if (ExpensesArray[i].f.name === file) {
        ExpensesArray.splice(i, 1);
        break;
      }
    }

    $(this).parent().parent().remove();
    console.log(ExpensesArray);

    var maxLength = 4;
    var uploadBtnBox = document.getElementById('Expenses-upload-box');
      var errorMessageDiv = document.getElementById('ExpensesError');
    
    if (ExpensesArray.length >= maxLength) {
      uploadBtnBox.style.display = 'none';
      errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
      errorMessageDiv.style.display = 'block';
    } else {
      uploadBtnBox.style.display = 'flex';
      errorMessageDiv.style.display = 'none';
    }
  });

  $('body').on('click', '.img-bg', function (e) {
    var imageUrl = $(this).css('background-image');
    $('#preview-image').attr('src', imageUrl);
    $('#image-preview').modal('show');
  });
}
//====================================================================================================
//========================================Upload compensation Imgs Lists============================================================
//====================================================================================================
var compensationArray = [];

function compensationImgUpload() {
  var imgWrap = '';
 
  $('#compensation-images').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box').find('.upload_img-wrap_inner');
      var uploadBtnBox = document.getElementById('compensation-upload-box');
      var errorMessageDiv = document.getElementById('compensationError');
      var maxLength = 4;
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
     

      if (compensationArray.length + filesArr.length > maxLength) {
        uploadBtnBox.style.display = 'none';
        errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
        errorMessageDiv.style.display = 'block';
      } else {
        uploadBtnBox.style.display = 'flex';
        errorMessageDiv.style.display = 'none';
      }

      for (var i = 0; i < Math.min(filesArr.length, maxLength - compensationArray.length); i++) {
        (function(f) {
          if (!f.type.match('image.*')) {
            return;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
            var html =
              "<div class='upload__img-box'><div style='background-image: url(" +
              e.target.result +
              ")' data-number='" +
              $('.upload__img-close2').length +
              "' data-file='" +
              f.name +
              "' class='img-bg'><div class='upload__img-close2'><img src='delete.png'></div></div></div>";
            imgWrap.append(html);
            compensationArray.push({
              f: f,
              url: e.target.result
            });
            console.log(compensationArray);
          };
          reader.readAsDataURL(f);
        })(filesArr[i]);
      }
    });
  });

  $('body').on('click', '.upload__img-close2', function (e) {
    e.stopPropagation(); 
    var file = $(this).parent().data('file');

    for (var i = 0; i < compensationArray.length; i++) {
      if (compensationArray[i].f.name === file) {
        compensationArray.splice(i, 1);
        break;
      }
    }

    $(this).parent().parent().remove();
    console.log(compensationArray);

    var maxLength = 4;
    var uploadBtnBox = document.getElementById('compensation-upload-box');
    var errorMessageDiv = document.getElementById('compensationError');
    if (compensationArray.length >= maxLength) {
      uploadBtnBox.style.display = 'none';

      errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
      errorMessageDiv.style.display = 'block';
    } else {
      uploadBtnBox.style.display = 'flex';
      errorMessageDiv.style.display = 'none';
    }
  });

  $('body').on('click', '.img-bg', function (e) {
    var imageUrl = $(this).css('background-image');
    $('#preview-image').attr('src', imageUrl);
    $('#image-preview').modal('show');
  });
}
//====================================================================================================
//========================================Upload examination Imgs Lists============================================================
//====================================================================================================
var examinationArray = [];

function examinationImgUpload() {
  var imgWrap = '';
  var uploadBtnBox = document.getElementById('examination-upload-box');
  var errorMessageDiv = document.getElementById('examinationError');

  $('#examination-images').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box').find('.upload_img-wrap_inner');
      var maxLength = 12;
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
   
      if (examinationArray.length + filesArr.length >= maxLength) {
        uploadBtnBox.style.display = 'none';
        errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
        errorMessageDiv.style.display = 'block';
      } else {
        uploadBtnBox.style.display = 'flex';
        errorMessageDiv.style.display = 'none';
      }

      for (var i = 0; i < Math.min(filesArr.length, maxLength - examinationArray.length); i++) {
        (function(f) {
          if (!f.type.match('image.*')) {
            return;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
            var html =
              "<div class='upload__img-box'><div style='background-image: url(" +
              e.target.result +
              ")' data-number='" +
              $('.upload__img-close1').length +
              "' data-file='" +
              f.name +
              "' class='img-bg'><div class='upload__img-close1'><img src='delete.png'></div></div></div>";
            imgWrap.append(html);
            examinationArray.push({
              f: f,
              url: e.target.result
            });
            console.log(examinationArray);
          };
          reader.readAsDataURL(f);
        })(filesArr[i]);
      }
    });
  });

  $('body').on('click', '.upload__img-close1', function (e) {
    e.stopPropagation(); 
    var file = $(this).parent().data('file');

    for (var i = 0; i < examinationArray.length; i++) {
      if (examinationArray[i].f.name === file) {
        examinationArray.splice(i, 1);
        break;
      }
    }

    $(this).parent().parent().remove();
    console.log(examinationArray);

    var maxLength = 12;

    
    if (examinationArray.length >= maxLength) {
      uploadBtnBox.style.display = 'none';
      errorMessageDiv.textContent = 'بحد أدنى صورة واحدة (۱) وحدأقصى اثني عشرة صورة (۱۲) ';
      errorMessageDiv.style.display = 'block';
    } else {
      uploadBtnBox.style.display = 'flex';
      errorMessageDiv.style.display = 'none';
    }
  });

  $('body').on('click', '.img-bg', function (e) {
    var imageUrl = $(this).css('background-image');
    $('#preview-image').attr('src', imageUrl);
    $('#image-preview').modal('show');
  });
}
//====================================================================================================

$('body').on('click', '.img-bg', function (e) {
  var imageUrl = $(this).css('background-image');
  imageUrl = imageUrl.replace(/^url\(['"](.+)['"]\)/, '$1');
  var newTab = window.open();
  newTab.document.body.innerHTML = '<img src="' + imageUrl + '">';

  $(newTab.document.body).css({
    'background-color': 'black',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
  });
});
//====================================================================================================
//====================================================================================================
const image = document.getElementById('hover-image-Settlement');
const dropdown = document.getElementById('dropdown-content-Settlement');

image.addEventListener('click', function () {
	if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        dropdown2.style.display = 'none';

    }
});
//====================================================================================================
//====================================================================================================
const image2 = document.getElementById('contract-value-Settlement2');
const dropdown2 = document.getElementById('dropdown-content-Settlement2');

image2.addEventListener('click', function () {
	if (dropdown2.style.display === 'block') {
        dropdown2.style.display = 'none';

    } else {
        dropdown2.style.display = 'block';
        dropdown.style.display = 'none';

    }
});
//====================================================================================================
//====================================================================================================
const image3 = document.getElementById('contract-value-Settlement3');
const dropdown3 = document.getElementById('dropdown-content-Settlement3');

image3.addEventListener('click', function () {
	if (dropdown3.style.display === 'block') {
        dropdown3.style.display = 'none';

    } else {
        dropdown3.style.display = 'block';
        dropdown4.style.display = 'none';

    }
});
//====================================================================================================
//====================================================================================================
const image4 = document.getElementById('contract-value-Settlement4');
const dropdown4 = document.getElementById('dropdown-content-Settlement4');

image4.addEventListener('click', function () {
	if (dropdown4.style.display === 'block') {
        dropdown4.style.display = 'none';

    } else {
        dropdown4.style.display = 'block';
        dropdown3.style.display = 'none';

    }
});
//====================================================================================================
$('#Expenses-images').click(function(){
  $('.upload__img-box').eq(0).hide();
  var x =  $('.upload__img-box')
})
$('#compensation-images').click(function(){
  $('#FirstUpload-img2').hide()
})
$('#examination-images').click(function(){
   $('#FirstUpload-img3').hide()
})




// // ///////////////////////////////////////////////////////////////////////////
// // //////////////////////////////////////////////// رفع صورة التوقيع ////////////////////////////////////////////////////////////////////////

//variables//
let saveSignatureBtn = null;

document
  .getElementById("UploadSigntaurePic")
  .addEventListener("click", function () {
    saveSignatureBtn = "UploadSigntaurePic";
  });

document
  .getElementById("WriteSignature")
  .addEventListener("click", function () {
    saveSignatureBtn = "WriteSignature";
  });
const uploadContainer = document.querySelector(".upload-container");
const mainContainer = document.querySelector(".main-container");
const UploadSigntaurePic = document.getElementById("UploadSigntaurePic");
const imageUpload = document.getElementById("imageUpload");
var imgeURL;
const uploadedImg = null;
//

UploadSigntaurePic.addEventListener("click", function () {
  imageUpload.click();
});

imageUpload.addEventListener("change", function () {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageURL = e.target.result;
      const previewImage = document.createElement("img");
      previewImage.classList.add("preview-image");
      previewImage.src = imageURL;
      previewImage.id = "signatureImage";
      imgeURL = imageURL;
      mainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
      uploadContainer.innerHTML = "";
      uploadContainer.appendChild(previewImage);
      uploadContainer.classList.add("previewing");
    };
    reader.readAsDataURL(file);
  }
});

removeSignatureImg.addEventListener("click", function (event) {
  event.preventDefault();
  if (uploadContainer.firstChild) {
    uploadContainer.innerHTML = "";
    mainContainer.innerHTML = "";
    uploadContainer.classList.remove("previewing");
    uploadContainer.innerHTML =
      ' <img class="upload-icon" src="img/Rectangle 144.png" alt="Upload Icon"><p>ارفق صورة التوقيع</p>';
  }
});
// // //////////////////////////////////////////////// كتابة التوقيع ////////////////////////////////////////////////////////////////////////
const WriteSignature = document.getElementById("WriteSignature");
WriteSignature.addEventListener("click", function () {
  document.body.classList.add('no-scroll');
  uploadContainer.innerHTML = "";
  mainContainer.innerHTML = "";
  uploadContainer.innerHTML =
    '<canvas id="canvas" width="200" height="200" class="mb-2"></canvas>';
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.lineWidth = 4;

  var drawing = false;
  var prevX = 0;
  var prevY = 0;
  var currX = 0;
  var currY = 0;

  function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  canvas.addEventListener("mousedown", handleMouseDown, false);
  canvas.addEventListener("mousemove", handleMouseMove, false);
  canvas.addEventListener("mouseup", handleMouseUp, false);

  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);

  function handleMouseDown(e) {
    drawing = true;
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
  }

  function handleMouseMove(e) {
    if (!drawing) return;
    currX = e.clientX - canvas.getBoundingClientRect().left;
    currY = e.clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleMouseUp() {
    drawing = false;
  }

  function handleTouchStart(e) {
    drawing = true;
    prevX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    prevY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
  }

  function handleTouchMove(e) {
    if (!drawing) return;
    currX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    currY = e.touches[0].clientY - canvas.getBoundingClientRect().top;

    drawLine(prevX, prevY, currX, currY);
    prevX = currX;
    prevY = currY;
  }

  function handleTouchEnd() {
    drawing = false;
  }
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.getElementById("clear").addEventListener("click", function () {
    clearCanvas();
  });
 
});
 function SaveWrittenSignature() {
  document.body.classList.remove('no-scroll');
	var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL();
    var link = document.createElement("a");
    link.href = dataURL;
    console.log(link.href);
    $("#signature-modal").modal("hide");

  }
 // Save the uploded signature image
 function SaveUplodedSignature() {
    const img = document.getElementById("signatureImage");
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg");
    console.log(base64);
    $("#signature-modal").modal("hide");

  }
  document.getElementById("save").addEventListener("click", function () {
    if (saveSignatureBtn === "UploadSigntaurePic") {
      SaveUplodedSignature();
    } else if (saveSignatureBtn === "WriteSignature") {
      SaveWrittenSignature();
    } else {
      console.log("No button has been clicked yet");
    }
  });
