//  لتتبع حالة كل مرحلة
window.stageStatus = {};

// فانكشن لاضافة علامة الاكتمال
window.markStageDone = function (stageKey) {
  window.stageStatus[stageKey] = true;
};

document.addEventListener("DOMContentLoaded", function () {

  const stages = [
    {
      key: "Create_Contract", 
      loadingText: "الإجراء الاول", 
      doneText: "تم إنشاء العقد.",
      process: simulateCreateContract, 
    },
    {
      key: "Invoice_Issuance",
      loadingText: "الإجراء الثاني",
      doneText: "تم إصدار الفاتورة.",
      process: simulateInvoiceIssuance,
    },
    {
      key: "receipt_Issuance",
      loadingText: "الإجراء الثالث",
      doneText: "تم إصدار سند القبض.",
      process: simulateReceiptIssuance,
    }
  ];

  const stageContainer = document.getElementById("stageContainer");
  const loaderArea = document.querySelector(".LoaderArea");
  const startBtn = document.getElementById("SubmitFormBtn");

  // فانكشن محاكاة إنشاء العقد
  function simulateCreateContract() {
    return new Promise((resolve) => {
      const processingTime = 1000;
      setTimeout(() => {
        console.log("Contract created");
        window.markStageDone("Create_Contract"); // خطوة إضافة علامة إكتمال
        resolve();
      }, processingTime);
    });
  }

  // فانكشن محاكاة إصدار الفاتورة
  function simulateInvoiceIssuance() {
    return new Promise((resolve) => {
      const processingTime = 3000; 
      setTimeout(() => {
        console.log("Invoice issued");
        window.markStageDone("Invoice_Issuance");
        resolve();
      }, processingTime);
    });
  }

  // فانكشن محاكاة إصدار سند القبض
  function simulateReceiptIssuance() {
    return new Promise((resolve) => {
      const processingTime = 1000;
      setTimeout(() => {
        console.log("Receipt issued");
        window.markStageDone("receipt_Issuance");
        resolve();
      }, processingTime);
    });
  }
  
  function createStageElement(stage, index) {
    const div = document.createElement("div");
    div.className = `${stage.key} stage`;
    div.style.display = "none"; // إخفاء محتوى اللودر في بداية

    div.innerHTML = `
        <div class="row align-items-center justify-content-center">
        <div class="col-auto">
      <div class="icon-holder">
        <i class="fa-solid fa-check" style="color:white" ></i>
      </div>
      <svg id="svg-${stage.key}" class="snurra" width="40" height="40" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="linjärGradient1-${stage.key}">
            <stop class="stopp1" offset="0" />
            <stop class="stopp2" offset="1" />
          </linearGradient>
          <linearGradient y2="160" x2="160" y1="40" x1="40" gradientUnits="userSpaceOnUse"
            id="gradient1-${stage.key}" xlink:href="#linjärGradient1-${stage.key}" />
        </defs>
        <path class="halvan1"
          d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64
          0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 
          0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 
          1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64" 
          stroke="url(#gradient1-${stage.key})"/>
        <circle class="strecken1" cx="100" cy="100" r="64" stroke="url(#gradient1-${stage.key})"/>
      </svg>
    </div>
    <div class="col">
            <h5 class="mb-0 text">${stage.loadingText}</h5>
          </div>
        </div>
  `;

    return div;
  }

  async function processStage(index = 0) {
    // لو وصلت لنهاية كل المراحل نوقف الفانكسن
    if (index >= stages.length) {
      // إنهاء عملية التحميل وإزالة منع التفاعل
      setTimeout(() => {
        hideLoader();
      }, 2000); // انتظار ثانيتين قبل إخفاء شاشة التحميل
      return;
    }

    const stage = stages[index];
    const el = document.querySelector(`.${stage.key}`);
    const textEl = el.querySelector(".text");

    // إظهار جملة التحميل في البداية و اللودر
    el.style.display = "block";
    el.classList.remove("completed", "visible");
    textEl.textContent = stage.loadingText;
    el.classList.add("visible");

    // إعادة تعيين حالة المرحلة اذا منتهية ام لا 
    window.stageStatus[stage.key] = false;

    // تشغيل الفانكشن الخاصة بالمرحلة الحالية
    await stage.process();
    
    // التحقق بشكل دوري من إكتمال المرحلة
    const checkInterval = setInterval(() => {
      if (window.stageStatus[stage.key] === true) {
        clearInterval(checkInterval); // إيقاف الفحص الدوري

        // انتهاء المرحلة
        el.classList.add("completed");
        textEl.textContent = stage.doneText;

        // إخفاء اللودر الخاص بالمرحلة المنتيهة
        const svg = document.getElementById(`svg-${stage.key}`);
        if (svg) svg.style.display = "none";

        // الانتقال للمرحلة التالية بعد تأخير واحد ثانية
        setTimeout(() => {
          processStage(index + 1);
        }, 1000);
      }
    }, 200);
  }

  // فانكشن لإظهار شاشة التحميل ومنع التفاعل
  function showLoader() {
    loaderArea.style.display = "flex";
    document.body.classList.add("loading-active");
    
    // منع التفاعل مع لوحة المفاتيح
    document.addEventListener("keydown", preventKeyboardInteraction, true);
    document.addEventListener("keyup", preventKeyboardInteraction, true);
    document.addEventListener("keypress", preventKeyboardInteraction, true);
  }

  //  فانكشن لإخفاء شاشة التحميل والسماح بالتفاعل 
  function hideLoader() {
    loaderArea.style.display = "none";
    document.body.classList.remove("loading-active");
    
    // السماح بالتفاعل مع لوحة المفاتيح بعد انتهاء التحميل
    document.removeEventListener("keydown", preventKeyboardInteraction, true);
    document.removeEventListener("keyup", preventKeyboardInteraction, true);
    document.removeEventListener("keypress", preventKeyboardInteraction, true);
  }

  // فانكشن لمنع التفاعل مع لوحة المفاتيح
  function preventKeyboardInteraction(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  startBtn.addEventListener("click", () => {
    stageContainer.innerHTML = "";

    //  إضافة كل مرحلة
    stages.forEach((stage, i) => {
      const stageEl = createStageElement(stage, i + 1);
      stageContainer.appendChild(stageEl);
    });

    showLoader(); // استخدام الفانكشن الجديدة
    processStage(0);
  });
});