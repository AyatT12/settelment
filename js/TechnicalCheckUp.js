const shapeCanvas = document.getElementById('shape-canvas');
const BendInBodyBtn = document.getElementById('bend-in-body-btn');
const veryDeepScratch = document.getElementById('very-deep-scratch-btn');
const deepScratch = document.getElementById('deep-scratch-btn');
const smallScratch = document.getElementById('small-scratch-btn');

const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const saveBtn = document.getElementById('save-btn');

shapeCanvas.width=893;
shapeCanvas.height=429;

window.addEventListener('load', function () {
    const ctx = shapeCanvas.getContext('2d');

    // إضافة صورة الفحص الفني كخلفية لل كانفاس
    const carBackground = new Image();
    carBackground.src = 'img/car shape2.svg';
    carBackground.onload = function () {
        ctx.drawImage(carBackground, 0, 0, shapeCanvas.width, shapeCanvas.height);
    };
});

// عرض صور انواع الخدوش 
const BendInBody = new Image();
BendInBody.src = 'img/bend-in-body.svg';

const VeryDeepScratch = new Image();
VeryDeepScratch.src = 'img/very-deep-scratch.svg';

const DeepScratch = new Image();
DeepScratch.src = 'img/deep-scratch.svg';

const SmallScratch = new Image();
SmallScratch.src = 'img/small-scratch.svg';

// متغير لحفظ نوع الخدش الذي تم اختياره
let selectedShape = null;
let selectedShapeType = '';

//قائمة بالخدوش الموجودة على صورة السيارة 
let drawnShapes = [];
let SketchRepresentation = [];
let currentIndex = -1;

// إضافة حدث عند الضغط على الزر الذي يحتوي على كل نوع من انواع الخدوش
BendInBodyBtn.addEventListener('click', () => {
    selectedShape = BendInBody;
    selectedShapeType = 'bend-in-body';
});

veryDeepScratch.addEventListener('click', () => {
    selectedShape = VeryDeepScratch;
    selectedShapeType = 'very-deep-scratch';
});

deepScratch.addEventListener('click', () => {
    selectedShape = DeepScratch;
    selectedShapeType = 'deep-scratch';
});

smallScratch.addEventListener('click', () => {
    selectedShape = SmallScratch;
    selectedShapeType = 'small-scratch';
});

undoBtn.addEventListener('click', () => {
    undo();
});

redoBtn.addEventListener('click', () => {
    redo();
});

// إضافة علامة الخدش عند كل ضغطه على الصورة 
shapeCanvas.addEventListener('click', (event) => {
    if (selectedShape) {
        addShape(event);
    }
});
function addShape(event) {
    const ctx = shapeCanvas.getContext('2d');

    //   هذا السطر يعطينا الحجم المعروض للكانفس وموقعه في الصفحة مش الابعاد الاصلية
    const rect = shapeCanvas.getBoundingClientRect();
    
    // نحسب مكان الضغطة داخل الكانفس و نطرح منه مكان الكانفس ف الصفحة نفسها
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    //نحسب نسبة التحويل من الكانفس المعروض على الشاشة إلى الكانفس الأصلي لان احنا حددناه برقم ثابت ف الجاف سكريبت و لكن عرضناه بحجم مختلف ف الاستايل
    const scaleX = shapeCanvas.width / rect.width;
    const scaleY = shapeCanvas.height / rect.height;

    const x = clickX * scaleX;
    const y = clickY * scaleY;

    try {
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        // pixel[3] هوا الرقم الذي يدل على الشفافية
        if (pixel[3] === 0) {
        // إذا ضغط المستخدم على منطقة شفافة من الصورة  يتم تجاهل النقر ولا يتم رسم أيقونة الخدش أو الشكل
            console.log("Click was on transparent area. Ignored.");
            return;
        }

       //  رسم الخدش بعد اعادة حساب احداثياته و التأكد من انه داخل حدود السيارة 
        ctx.drawImage(selectedShape, x - selectedShape.width / 2, y - selectedShape.height / 2, 20, 20);

        currentIndex++;
        drawnShapes[currentIndex] = {
            shape: selectedShape,
            x: x - selectedShape.width / 2,
            y: y - selectedShape.height / 2,
            type: selectedShapeType
        };
        drawnShapes = drawnShapes.slice(0, currentIndex + 1);
        updateSketchRepresentation();
    } catch (err) {
        console.error("Canvas security error: ", err);
    }
}

function undo() {
    if (currentIndex >= 0) {
        currentIndex--;
        redrawShapes();
    }
}

function redo() {
    if (currentIndex < drawnShapes.length - 1) {
        currentIndex++;
        redrawShapes();
    }
}

function redrawShapes() {
    const ctx = shapeCanvas.getContext('2d');

    ctx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);

    const carBackground = new Image();
    carBackground.src = 'img/car shape2.svg';
    carBackground.onload = function () {
        ctx.drawImage(carBackground, 0, 0, shapeCanvas.width, shapeCanvas.height);

        for (let i = 0; i <= currentIndex; i++) {
            ctx.drawImage(drawnShapes[i].shape, drawnShapes[i].x, drawnShapes[i].y, 20, 20);
        }

        updateSketchRepresentation();
    };
}

function updateSketchRepresentation() {
    SketchRepresentation = drawnShapes.slice(0, currentIndex + 1).map(shape => ({
        type: shape.type,
        x: shape.x,
        y: shape.y
    }));
    console.log(SketchRepresentation);
}

saveBtn.addEventListener('click', () => {
    console.log(SketchRepresentation);
    $('#TechnicalCheckUp').modal('hide');

    const ctx = shapeCanvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = shapeCanvas.width;
    tempCanvas.height = shapeCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
// إضافة خلفية بيضاء للصورة 
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(shapeCanvas, 0, 0);

    const dataURL = tempCanvas.toDataURL('image/png');
    console.log(dataURL);
});


document.getElementById('TechnicalCheckUp-container').addEventListener('click', function(event) {
    if (event.target.classList.contains('TechnicalCheckUp-Btn')) {
        const buttons = document.querySelectorAll('.TechnicalCheckUp-Btn');
        buttons.forEach(btn => btn.classList.remove('TechnicalCheckUp-Btn-active'));
        event.target.classList.add('TechnicalCheckUp-Btn-active');
    }
});
