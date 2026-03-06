// 全局变量
let uploadedImage = null;
let canvas = null;
let ctx = null;
let alignment = 'center';
let bgMode = 'image';
let selectedDevice = null;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('previewCanvas');
    ctx = canvas.getContext('2d');
    init();
});

// 初始化页面
function init() {
    setupUploadArea();
    setupEventListeners();
    drawDefaultCanvas();
}

// ========== 第一页：设备选择功能 ==========
function selectDevice(device) {
    selectedDevice = device;
    
    document.querySelectorAll('.device-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.querySelector(`.device-option[data-device="${device}"]`).classList.add('selected');
    
    document.getElementById('nextBtn').disabled = false;
}

function goToNextPage() {
    if (!selectedDevice) return;
    
    document.getElementById('page1').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    
    const mainContent = document.getElementById('mainContent');
    
    if (selectedDevice === 'mobile') {
        mainContent.classList.remove('pc-layout');
        mainContent.classList.add('mobile-layout');
    } else {
        mainContent.classList.remove('mobile-layout');
        mainContent.classList.add('pc-layout');
    }
}

function goBack() {
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page1').style.display = 'flex';
    
    selectedDevice = null;
    document.querySelectorAll('.device-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    document.getElementById('nextBtn').disabled = true;
}

// ========== 第二页：工具功能 ==========
// 设置上传区域
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#4CAF50';
        uploadArea.style.backgroundColor = '#f0f9ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
}

// 处理上传的文件
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('previewImg').style.display = 'block';
            updatePreview();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 设置事件监听器
function setupEventListeners() {
    document.getElementById('textInput').addEventListener('input', updatePreview);
    document.getElementById('textColor').addEventListener('change', updatePreview);
    
    const textOpacity = document.getElementById('textOpacity');
    const textOpacityValue = document.getElementById('textOpacityValue');
    textOpacity.addEventListener('input', () => {
        textOpacityValue.textContent = textOpacity.value + '%';
        updatePreview();
    });
    
    const textSize = document.getElementById('textSize');
    const textSizeValue = document.getElementById('textSizeValue');
    textSize.addEventListener('input', () => {
        textSizeValue.textContent = textSize.value + 'px';
        updatePreview();
    });
    
    document.getElementById('fontFamily').addEventListener('change', updatePreview);
    
    const strokeWidth = document.getElementById('strokeWidth');
    const strokeWidthValue = document.getElementById('strokeWidthValue');
    strokeWidth.addEventListener('input', () => {
        strokeWidthValue.textContent = strokeWidth.value + 'px';
        updatePreview();
    });
    
    document.getElementById('strokeColor').addEventListener('change', updatePreview);
    
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            alignment = btn.dataset.align;
            updatePreview();
        });
    });
    
    document.querySelectorAll('.bg-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            bgMode = btn.dataset.mode;
            
            if (bgMode === 'solid') {
                document.getElementById('bgColorControl').style.display = 'block';
            } else {
                document.getElementById('bgColorControl').style.display = 'none';
            }
            updatePreview();
        });
    });
    
    const bgOpacity = document.getElementById('bgOpacity');
    const bgOpacityValue = document.getElementById('bgOpacityValue');
    bgOpacity.addEventListener('input', () => {
        bgOpacityValue.textContent = bgOpacity.value + '%';
        updatePreview();
    });
    
    document.getElementById('bgColor').addEventListener('change', updatePreview);
    
    const bgGap = document.getElementById('bgGap');
    const bgGapValue = document.getElementById('bgGapValue');
    bgGap.addEventListener('input', () => {
        bgGapValue.textContent = bgGap.value + 'px';
        updatePreview();
    });
    
    document.getElementById('bgGapColor').addEventListener('change', updatePreview);
    
    const bgGapOpacity = document.getElementById('bgGapOpacity');
    const bgGapOpacityValue = document.getElementById('bgGapOpacityValue');
    bgGapOpacity.addEventListener('input', () => {
        bgGapOpacityValue.textContent = bgGapOpacity.value + '%';
        updatePreview();
    });
    
    document.getElementById('watermarkText').addEventListener('input', updatePreview);
    document.getElementById('watermarkFont').addEventListener('change', updatePreview);
    
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePreview();
        });
    });
    
    document.getElementById('watermarkColor').addEventListener('change', updatePreview);
    
    const watermarkSize = document.getElementById('watermarkSize');
    const watermarkSizeValue = document.getElementById('watermarkSizeValue');
    watermarkSize.addEventListener('input', () => {
        watermarkSizeValue.textContent = watermarkSize.value + 'px';
        updatePreview();
    });
    
    const watermarkOpacity = document.getElementById('watermarkOpacity');
    const watermarkOpacityValue = document.getElementById('watermarkOpacityValue');
    watermarkOpacity.addEventListener('input', () => {
        watermarkOpacityValue.textContent = watermarkOpacity.value + '%';
        updatePreview();
    });
    
    document.getElementById('generateBtn').addEventListener('click', updatePreview);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
}

// 绘制默认画布
function drawDefaultCanvas() {
    canvas.width = 600;
    canvas.height = 400;
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#999';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('请上传图片', canvas.width / 2, canvas.height / 2);
}

// 更新预览
function updatePreview() {
    if (!uploadedImage) {
        drawDefaultCanvas();
        return;
    }
    
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    
    ctx.drawImage(uploadedImage, 0, 0);
    
    const text = document.getElementById('textInput').value;
    if (text.trim()) {
        drawTextWithBackground(text);
    }
    
    drawWatermark();
}

// 绘制带背景的文字
function drawTextWithBackground(text) {
    const textColor = document.getElementById('textColor').value;
    const textOpacity = parseInt(document.getElementById('textOpacity').value) / 100;
    const textSize = parseInt(document.getElementById('textSize').value);
    const fontFamily = document.getElementById('fontFamily').value;
    const strokeWidth = parseFloat(document.getElementById('strokeWidth').value);
    const strokeColor = document.getElementById('strokeColor').value;
    const bgOpacity = parseInt(document.getElementById('bgOpacity').value) / 100;
    const bgColor = document.getElementById('bgColor').value;
    const bgGap = parseInt(document.getElementById('bgGap').value);
    const bgGapColor = document.getElementById('bgGapColor').value;
    const bgGapOpacity = parseInt(document.getElementById('bgGapOpacity').value) / 100;
    
    const lines = text.split('\n');
    const bgHeight = textSize * 1.6;
    
    ctx.font = `${textSize}px ${fontFamily}`;
    
    const totalBgHeight = lines.length * bgHeight + (lines.length - 1) * bgGap;
    const startY = canvas.height - totalBgHeight;
    
    const sourceY = Math.max(0, canvas.height - bgHeight);
    const clampedBgHeight = Math.min(bgHeight, canvas.height);
    
    const gapR = parseInt(bgGapColor.slice(1, 3), 16);
    const gapG = parseInt(bgGapColor.slice(3, 5), 16);
    const gapB = parseInt(bgGapColor.slice(5, 7), 16);
    
    lines.forEach((line, index) => {
        const bgY = startY + index * (bgHeight + bgGap);
        const textY = bgY + bgHeight / 2;
        
        if (bgMode === 'image') {
            ctx.drawImage(
                uploadedImage,
                0, sourceY, canvas.width, clampedBgHeight,
                0, bgY, canvas.width, bgHeight
            );
            
            ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
            ctx.fillRect(0, bgY, canvas.width, bgHeight);
        } else {
            const r = parseInt(bgColor.slice(1, 3), 16);
            const g = parseInt(bgColor.slice(3, 5), 16);
            const b = parseInt(bgColor.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${bgOpacity})`;
            ctx.fillRect(0, bgY, canvas.width, bgHeight);
        }
        
        if (bgGap > 0 && index < lines.length - 1) {
            ctx.fillStyle = `rgba(${gapR}, ${gapG}, ${gapB}, ${bgGapOpacity})`;
            ctx.fillRect(0, bgY + bgHeight, canvas.width, bgGap);
        }
        
        const r = parseInt(textColor.slice(1, 3), 16);
        const g = parseInt(textColor.slice(3, 5), 16);
        const b = parseInt(textColor.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${textOpacity})`;
        ctx.textAlign = alignment;
        ctx.textBaseline = 'middle';
        
        let textX;
        if (alignment === 'left') {
            textX = 20;
        } else if (alignment === 'right') {
            textX = canvas.width - 20;
        } else {
            textX = canvas.width / 2;
        }
        
        if (strokeWidth > 0) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(line, textX, textY);
        }
        
        ctx.fillText(line, textX, textY);
    });
}

// 绘制水印
function drawWatermark() {
    const watermarkText = document.getElementById('watermarkText').value;
    const watermarkSize = parseInt(document.getElementById('watermarkSize').value);
    const watermarkFont = document.getElementById('watermarkFont').value;
    const watermarkOpacity = parseInt(document.getElementById('watermarkOpacity').value) / 100;
    const watermarkColor = document.getElementById('watermarkColor').value;
    
    const activePositionBtn = document.querySelector('.position-btn.active');
    const watermarkPosition = activePositionBtn ? activePositionBtn.dataset.position : 'top-right';
    
    if (!watermarkText.trim()) return;
    
    const r = parseInt(watermarkColor.slice(1, 3), 16);
    const g = parseInt(watermarkColor.slice(3, 5), 16);
    const b = parseInt(watermarkColor.slice(5, 7), 16);
    
    ctx.font = `${watermarkSize}px ${watermarkFont}`;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${watermarkOpacity})`;
    
    const padding = 10;
    let x, y, textAlign, textBaseline;
    
    switch (watermarkPosition) {
        case 'top-left':
            x = padding;
            y = padding;
            textAlign = 'left';
            textBaseline = 'top';
            break;
        case 'top-right':
            x = canvas.width - padding;
            y = padding;
            textAlign = 'right';
            textBaseline = 'top';
            break;
        case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            textAlign = 'left';
            textBaseline = 'bottom';
            break;
        case 'bottom-right':
            x = canvas.width - padding;
            y = canvas.height - padding;
            textAlign = 'right';
            textBaseline = 'bottom';
            break;
        default:
            x = canvas.width - padding;
            y = padding;
            textAlign = 'right';
            textBaseline = 'top';
    }
    
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.fillText(watermarkText, x, y);
}

// 下载图片
function downloadImage() {
    if (!uploadedImage) {
        alert('请先上传图片');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'subtitle-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
