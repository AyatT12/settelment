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
const selectCompensation = document.getElementById("Settlement-type");
const fieldsets = document.querySelectorAll("fieldset");
let = selectedValue = 1
selectCompensation.addEventListener('change', function() {
  selectedValue = this.value;
});
function setFocusToFirstInput(fieldset) {
    var firstFocusable = fieldset.find('input:not(.Table-inputs), textarea:not(.check-table-notes), select:not(.check-table-notes)')?.first();
    if (firstFocusable.length) {
        firstFocusable.focus();
    }
}

function moveToNextInput(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        let formElements = Array.from(
            event.target.form.querySelectorAll("input, select, button , textarea")
        );
        let index = formElements.indexOf(event.target);

        if (index > -1 && index < formElements.length - 1) {
            let nextElement = formElements[index + 1];
            if (nextElement.tagName === "BUTTON" || nextElement.type === "button") {
                nextElement.click();
            } else {
                nextElement.focus();
            }
        }
    }
}

$(document).ready(function () {
    $("input, select, button , textarea").on("keydown", moveToNextInput);

    var firstFieldset = $("fieldset").first();
    setFocusToFirstInput(firstFieldset);
});

$(".next").click(function () {
  // console.log(selectedValue)

  const nextBtn = this; 
  const current_fs = $(nextBtn).closest("fieldset");
  let next_fs = current_fs.next();
  
  if (current_fs.attr('id') === 'firstFieldset') {
    if (!ExpensesCheckbox.checked && (selectedValue === "0" )) {
        next_fs = current_fs.next().next();
        $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
    } else if (!ExpensesCheckbox.checked &&  !(selectedValue === "0" )) {
      next_fs = current_fs.next().next().next();
      $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
      $("#progressbar li").eq($("fieldset").index(current_fs.next().next())).addClass("active");
    } else {
        next_fs = current_fs.next();
    }
  }
  if (current_fs.attr('id') === 'SecondFieldset') {
    if (ExpensesCheckbox.checked &&  !(selectedValue === "0" )) {
      next_fs = current_fs.next().next();
      $("#progressbar li").eq($("fieldset").index(current_fs.next())).addClass("active");
    }
  }
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  next_fs.show();
  current_fs.hide();

  setFocusToFirstInput(next_fs);
});

$(".previous").click(function () {
    const prevBtn = this; 
    current_fs = $(prevBtn).closest("fieldset");
    previous_fs = current_fs.prev();
    if (current_fs.attr('id') === 'FourthFieldset') {
      if (ExpensesCheckbox.checked && (selectedValue === "0" )) {
        previous_fs = current_fs.prev();
      } else if (!ExpensesCheckbox.checked && !(selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
        $("#progressbar li").eq($("fieldset").index(current_fs.prev().prev())).removeClass("active");
      } else if (ExpensesCheckbox.checked && !(selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
      }
    }

    if (current_fs.attr('id') === 'ThirdFieldset') {
      if (!ExpensesCheckbox.checked && (selectedValue === "0" )) {
        previous_fs = current_fs.prev().prev();
        $("#progressbar li").eq($("fieldset").index(current_fs.prev())).removeClass("active");
      }
    }
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    previous_fs.show();
    current_fs.hide();

    setFocusToFirstInput(previous_fs);
});

//====================================================================================================
//========================================Upload Expenses/compensation Imgs Lists============================================================
//====================================================================================================
var compensationArray = [];
var expensesArray = [];

function compensationImgUpload() {
  var maxLength = 4;
  var uploadBtnBox = document.getElementById('compensation-upload-box');

  $('#compensation-images').on('change', function (e) {
    handleImageUpload(e, '#compensation-Attatchments-Table', compensationArray, maxLength, uploadBtnBox, 'compensation');
  });

  // Delete handler
  $('body').on('click', '.upload__img-close2.compensation', function (e) {
    e.stopPropagation();
    handleImageDelete(this, compensationArray, maxLength, uploadBtnBox, '#compensation-Attatchments-Table');
  });
}

function ExpensesImgUpload() {
  var maxLength = 4;
  var uploadBtnBox = document.getElementById('Expenses-upload-box');

  $('#Expenses-images').on('change', function (e) {
    handleImageUpload(e, '#Expenses-Attatchments-Table', expensesArray, maxLength, uploadBtnBox, 'expenses');
  });

  // Delete handler
  $('body').on('click', '.upload__img-close2.expenses', function (e) {
    e.stopPropagation();
    handleImageDelete(this, expensesArray, maxLength, uploadBtnBox, '#Expenses-Attatchments-Table');
  });
}

function handleImageUpload(event, tableSelector, array, maxLength, uploadBtnBox, type) {
  var files = event.target.files;
  var filesArr = Array.prototype.slice.call(files);
  
  // Reset the input value to allow re-uploading same file
  $(event.target).val('');

  var processedCount = 0;
  var totalToProcess = Math.min(filesArr.length, maxLength - array.length);

  if (totalToProcess === 0) {
    alert('❌ وصلت للحد الأقصى للصور! أقصى عدد: ' + maxLength);
    return;
  }

  // Detect iOS for better HEIC handling
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  for (var i = 0; i < totalToProcess; i++) {
    (function (f) {
      var isHEIC = f.type === 'image/heic' || f.type === 'image/heif' || 
                   f.name.endsWith('.heic') || f.name.endsWith('.heif');
      
      // On iOS, skip heic2any conversion (it doesn't work well on iOS Safari)
      if (isHEIC && !isIOS && typeof heic2any !== 'undefined') {
        heic2any({ blob: f, toType: "image/jpeg" })
          .then(function (convertedBlob) {
            processFile(convertedBlob, f.name, tableSelector, array, maxLength, uploadBtnBox, type);
            processedCount++;
            checkComplete();
          })
          .catch(function (err) {
            // Fallback: try to process original file
            processFile(f, f.name, tableSelector, array, maxLength, uploadBtnBox, type);
            processedCount++;
            checkComplete();
          });
      } else {
        processFile(f, f.name, tableSelector, array, maxLength, uploadBtnBox, type);
        processedCount++;
        checkComplete();
      }
    })(filesArr[i]);
  }

  function checkComplete() {
    if (processedCount === totalToProcess) {
      // All files processed, update upload box visibility
      if (array.length >= maxLength) {
        uploadBtnBox.style.display = 'none';
      } else {
        repositionUploadBox(tableSelector, uploadBtnBox);
      }
    }
  }
}

function processFile(file, fileName, tableSelector, array, maxLength, uploadBtnBox, type) {
  var reader = new FileReader();
  
  reader.onload = function (e) {
    // Use setTimeout to ensure UI thread updates (important for iOS)
    setTimeout(() => {
      var $table = $(tableSelector);
      var $emptyCell = $table.find('td').filter(function() {
        return $(this).find('.upload__img-box').length === 0;
      }).first();
      
      if ($emptyCell.length === 0) {
        return;
      }

      var html = `
        <div class='upload__img-box Attatchments-img-box'>
          <div style='background-image: url(${e.target.result})' data-file='${fileName}' class='img-bg'>
            <div class='upload__img-close2 ${type}'><i class='fa-regular fa-trash-can'></i></div>
          </div>
        </div>
      `;
      
      $emptyCell.append(html);
      array.push({ f: file, url: e.target.result });

      // Force reflow for iOS to ensure proper rendering
      $emptyCell[0].offsetHeight;

      if (array.length < maxLength) {
        repositionUploadBox(tableSelector, uploadBtnBox);
      } else {
        uploadBtnBox.style.display = 'none';
      }
      
      // Success message
      setTimeout(() => {
        alert(' تمت إضافة الصورة بنجاح: ' + fileName);
      }, 300);
    }, 100);
  };
  
  reader.onerror = function(error) {
    alert('❌ فشل تحميل الصورة: ' + fileName);
  };
  
  try {
    reader.readAsDataURL(file);
  } catch (e) {
    alert(' خطأ غير متوقع أثناء تحميل الصورة');
  }
}

function repositionUploadBox(tableSelector, uploadBtnBox) {
  var $table = $(tableSelector);
  var $emptyCell = $table.find('td').filter(function() {
    return $(this).find('.upload__img-box').length === 0;
  }).first();
  
  if ($emptyCell.length > 0) {
    uploadBtnBox.style.display = 'flex';
    $emptyCell.append(uploadBtnBox);
  }
}

function handleImageDelete(element, array, maxLength, uploadBtnBox, tableSelector) {
  var fileName = $(element).parent().data('file');
  
  var found = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i].f.name === fileName) {
      array.splice(i, 1);
      found = true;
      break;
    }
  }
  
  $(element).closest('.upload__img-box').remove();
  
  // Show success message
  setTimeout(() => {
    alert(' تم حذف الصورة بنجاح');
  }, 200);

  if (array.length < maxLength) {
    repositionUploadBox(tableSelector, uploadBtnBox);
  }

  if (array.length === 0) {
    uploadBtnBox.style.display = 'flex';
    $(tableSelector + ' td').first().append(uploadBtnBox);
  }
}

// Add essential CSS for image display
function addImageUploadCSS() {
  var css = `
    /* Ensure images are visible */
    .img-bg {
      width: 100%;
      background-position: center !important;
      background-repeat: no-repeat !important;
      position: relative;
      border-radius: 4px;
    }
    
    /* iOS-specific fix */
    @supports (-webkit-touch-callout: none) {
      .img-bg {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        background-color: #f0f0f0; /* Fallback color */
      }
    }
    
  `;
  
  var style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);
}

// Initialize when page loads
$(document).ready(function() {
  addImageUploadCSS();
});
//========================================calculate Expenses/compensation  ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const ExpensesTable = document.getElementById("Expenses-Data-Table");
  const TotalExpenses = document.getElementById("TotalExpenses");

  const CompensationTable = document.getElementById("compensation-Data-Table");
  const TotalCompensation = document.getElementById("TotalCompensation");

  const calculateTotal = (table, totalRow) => {
      let sum = 0;

      table.querySelectorAll("tbody tr:not(:last-child)").forEach(row => {
          const valueCell = row.cells[1]; 
          const inputCell = valueCell.querySelector("input");

          let rawValue = inputCell ? inputCell.value : valueCell.textContent;
          let value = parseFloat(rawValue.replace(/,/g, '') || 0);

          if (!isNaN(value) && value <= 1000000) {
            sum += value;
          } else if (value >= 1000000) {
            sum += 1000000;
          }
      });

      totalRow.textContent = sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const addInputListeners = (table, totalRow) => {
    const inputs = table.querySelectorAll("input.Table-inputs");

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        calculateTotal(table, totalRow);
      });
    });
  };

  addInputListeners(ExpensesTable, TotalExpenses);
  calculateTotal(ExpensesTable, TotalExpenses); 
  addInputListeners(CompensationTable, TotalCompensation);
  calculateTotal(CompensationTable, TotalCompensation);
});


//====================================================================================================
//========================================Upload examination Imgs Lists============================================================
//====================================================================================================
var examinationArray = [];

function examinationImgUpload() {
  var imgWrap = '';
  var uploadBtnBox = document.getElementById('examination-upload-box');
  var errorMessageDivs = document.getElementsByClassName('Examination-error-message');

  $('#examination-images').each(function () {
    $(this).on('change', function (e) {
      imgWrap = $(this).closest('.upload__box').find('.upload_img-wrap_inner');
      var maxLength = 22;
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
   
      if (examinationArray.length + filesArr.length >= maxLength) {
        uploadBtnBox.style.display = 'none';

        for (var j = 0; j < errorMessageDivs.length; j++) {
          errorMessageDivs[j].textContent = 'الرجاء ... التحقق من جميع البنود و بحد اقصى 22 صورة';
          errorMessageDivs[j].style.display = 'block';
        }
      } else {
        uploadBtnBox.style.display = 'flex';

        for (var j = 0; j < errorMessageDivs.length; j++) {
          errorMessageDivs[j].style.display = 'none';
        }
      }

      var processedCount = 0;
      var totalToProcess = Math.min(filesArr.length, maxLength - examinationArray.length);

      for (var i = 0; i < totalToProcess; i++) {
        (function (f) {
          // console.log("Selected file type:", f.type);

          if (f.type === 'image/heic' || f.type === 'image/heif' || f.name.endsWith('.heic') || f.name.endsWith('.heif')) {
            // console.log("Processing HEIC/HEIF file:", f.name); 

            heic2any({
              blob: f,
              toType: "image/jpeg"
            }).then(function (convertedBlob) {
              var reader = new FileReader();
              reader.onload = function (e) {
                var html =
                  "<div class='upload__img-box'><div style='background-image: url(" +
                  e.target.result +
                  ")' data-number='" +
                  $('.upload__img-close').length +
                  "' data-file='" +
                  f.name +
                  "' class='img-bg'><div class='upload__img-close1'><i class='fa-regular fa-trash-can'></i></div>";

                imgWrap.append(html);
                examinationArray.push({
                  f: f,
                  url: e.target.result
                });
                // console.log(examinationArray);
                
                processedCount++;
                if (processedCount === totalToProcess) {
                  setTimeout(setImageRowHeight, 100);
                }
              };
              reader.readAsDataURL(convertedBlob); 
            }).catch(function (err) {
              console.error("Error converting HEIC/HEIF image:", err);
              processedCount++;
              if (processedCount === totalToProcess) {
                setTimeout(setImageRowHeight, 100);
              }
            });
          } else {
            var reader = new FileReader();
            reader.onload = function (e) {
              var html =
                "<div class='upload__img-box'><div style='background-image: url(" +
                e.target.result +
                ")' data-number='" +
                $('.upload__img-close').length +
                "' data-file='" +
                f.name +
                "' class='img-bg'><div class='upload__img-close1'><i class='fa-regular fa-trash-can'></i></div>";
              imgWrap.append(html);
              examinationArray.push({
                f: f,
                url: e.target.result
              });
              // console.log(examinationArray);
              
              processedCount++;
              if (processedCount === totalToProcess) {
                setTimeout(setImageRowHeight, 100);
              }
            };
            reader.readAsDataURL(f); 
          }
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
    // console.log(examinationArray);

    var maxLength = 22;

    if (examinationArray.length >= maxLength) {
      uploadBtnBox.style.display = 'none';

      for (var j = 0; j < errorMessageDivs.length; j++) {
        errorMessageDivs[j].textContent = 'الرجاء ... التحقق من جميع البنود و بحد اقصى 22 صورة';
        errorMessageDivs[j].style.display = 'block';
      }
    } else {
      uploadBtnBox.style.display = 'flex';

      for (var j = 0; j < errorMessageDivs.length; j++) {
        errorMessageDivs[j].style.display = 'none';
      }
    }
    setTimeout(setImageRowHeight, 50);
  });
}

function setImageRowHeight() {
    if (window.innerWidth <= 991) {
        const imagesRow = document.querySelector('.virtual-check-images-row');
        if (imagesRow) {
            imagesRow.style.height = '';
        }
        return;
    }
    
    const virtualCheckData = document.querySelector('.virtual-check-data');
    const imagesRow = document.querySelector('.virtual-check-images-row');
    
    if (!virtualCheckData || !imagesRow) return;
    
    let attempts = 0;
    const maxAttempts = 5;
    
    function measureHeight() {
        const parentHeight = virtualCheckData.offsetHeight;
        const currentReadingRows = document.querySelectorAll('.CurrentReadingg_row');
        const errorMessage = document.querySelector('.virtual-check-data > .row.mt-auto');
        
        let otherElementsHeight = 0;
        
        currentReadingRows.forEach(row => {
            otherElementsHeight += row.offsetHeight;
        });
        
        if (errorMessage) {
            otherElementsHeight += errorMessage.offsetHeight;
        }
        
        const buffer = 30;
        const availableHeight = parentHeight - otherElementsHeight - buffer;
        

        if (availableHeight > 50 || attempts >= maxAttempts) {
            imagesRow.style.height = `${Math.max(availableHeight, 200)}px`;
            return true;
        }
        
        return false;
    }
    
    function tryMeasure() {
        attempts++;
        const success = measureHeight();
        
        if (!success && attempts < maxAttempts) {
            setTimeout(tryMeasure, 100);
        }
    }
    
    tryMeasure();
}

// Initialize with multiple attempts
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setImageRowHeight, 100);
    setTimeout(setImageRowHeight, 500);
    setTimeout(setImageRowHeight, 1000);
});

window.addEventListener('resize', function() {
    setTimeout(setImageRowHeight, 50);
    setTimeout(setImageRowHeight, 100);
    setTimeout(setImageRowHeight, 200);
});
//====================================================================================================
$("body").on("click", ".img-bg", function (e) {
  var imageUrl = $(this).css("background-image");
  imageUrl = imageUrl.replace(/^url\(['"](.+)['"]\)/, "$1");
  var newTab = window.open();

  $(newTab.document.head).html(`
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Image</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      body {
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .image-container {
        width: 70vw;
        height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
    </style>
  `);

  newTab.document.body.innerHTML = `
    <div class="image-container">
      <img src="${imageUrl}" alt="View Image">
    </div>
  `;
});

//====================================================================================================
//====================================================================================================
const image = document.getElementById('hover-image-Settlement');
const dropdown = document.getElementById('dropdown-content-Settlement');

image.addEventListener("click", function(event) {
  event.stopPropagation(); 
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    dropdown2.style.display = "none";
  } else {
    dropdown.style.display = "none";
  }
});

document.addEventListener("click", function(event) {
  if (!image.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

dropdown.addEventListener("click", function(event) {
  event.stopPropagation();
});
//====================================================================================================
//====================================================================================================
const image2 = document.getElementById('contract-value-Settlement2');
const dropdown2 = document.getElementById('dropdown-content-Settlement2');

image2.addEventListener("click", function(event) {
  event.stopPropagation(); 
  if (dropdown2.style.display === "none" || dropdown2.style.display === "") {
    dropdown2.style.display = "block";
    dropdown.style.display = "none";
  } else {
    dropdown2.style.display = "none";
  }
});

document.addEventListener("click", function(event) {
  if (!image2.contains(event.target) && !dropdown2.contains(event.target)) {
    dropdown2.style.display = "none";
  }
});

dropdown2.addEventListener("click", function(event) {
  event.stopPropagation();
});
//====================================================================================================
//====================================================================================================
const image3 = document.getElementById('contract-value-Settlement3');
const dropdown3 = document.getElementById('dropdown-content-Settlement3');

image3.addEventListener("click", function(event) {
  event.stopPropagation(); 
  if (dropdown3.style.display === "none" || dropdown3.style.display === "") {
    dropdown3.style.display = "block";
    dropdown4.style.display = "none";
  } else {
    dropdown3.style.display = "none";
  }
});

document.addEventListener("click", function(event) {
  if (!image3.contains(event.target) && !dropdown3.contains(event.target)) {
    dropdown3.style.display = "none";
  }
});

dropdown3.addEventListener("click", function(event) {
  event.stopPropagation();
});
//====================================================================================================
//====================================================================================================
const image4 = document.getElementById('contract-value-Settlement4');
const dropdown4 = document.getElementById('dropdown-content-Settlement4');
image4.addEventListener("click", function(event) {
  event.stopPropagation(); 
  if (dropdown4.style.display === "none" || dropdown4.style.display === "") {
    dropdown4.style.display = "block";
    dropdown3.style.display = "none";
  } else {
    dropdown4.style.display = "none";
  }
});

document.addEventListener("click", function(event) {
  if (!image4.contains(event.target) && !dropdown4.contains(event.target)) {
    dropdown4.style.display = "none";
  }
});

dropdown4.addEventListener("click", function(event) {
  event.stopPropagation();
});
//====================================================================================================
//====================================================================================================

$('#examination-images').click(function(){
   $('#FirstUpload-img3').hide()
})


// // // //////////////////////////////////////////////// رفع صورة التوقيع ////////////////////////////////////////////////////////////////////////
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
const mainContainer = document.querySelector(".Signature-main-container");
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
       mainContainer.innerHTML =
        '<i class="fa-regular fa-circle-xmark"  style="cursor: pointer;"></i>';
       Previewing_Signature(imageURL)
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
// //////////////////////////////////////////////// كتابة التوقيع ////////////////////////////////////////////////////////////////////////
const WriteSignature = document.getElementById("WriteSignature");
WriteSignature.addEventListener("click", function () {
  document.body.classList.add("no-scroll");
  uploadContainer.innerHTML = "";
  mainContainer.innerHTML = "";
  uploadContainer.innerHTML =
    '<canvas id="canvas" width="200" height="200" class="mb-2 bg-white"></canvas>';
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
    dataURL = null; // Clear the stored signature
  }

  document.getElementById("clear").addEventListener("click", function () {
    clearCanvas();
  });
});

function SaveWrittenSignature() {
  document.body.classList.remove("no-scroll");
  var canvas = document.getElementById("canvas");
  var dataURL = canvas.toDataURL();
  Previewing_Signature(dataURL)
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
// // // //////////////////////////////////////////////// عرض صورة التوقيع ////////////////////////////////////////////////////////////////////////
function Previewing_Signature(imageURL){
   const previewImage = document.createElement("img");
      previewImage.classList.add("preview-image");
      previewImage.classList.add("bg-white");
      previewImage.src = imageURL;
      previewImage.id = "signatureImage";
      imgeURL = imageURL;
      uploadContainer.innerHTML = "";
      uploadContainer.appendChild(previewImage);
      uploadContainer.classList.add("previewing");
      previewImage.addEventListener("click", function () {
        var newTab = window.open();
        $(newTab.document.head).html(`
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>View Image</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            body {
              background-color: black;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .image-container {
              width: 70vw;
              height: 70vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              object-fit: contain;
              background-color:white;
            }
          </style>
          `);
        newTab.document.body.innerHTML = `
          <div class="image-container">
            <img src="${imgeURL}" alt="View Image">
          </div>
        `;
      });
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
