const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const a45_SE = new Audio('SE/active/45.mp3');
const a90L_SE = new Audio('SE/active/90_L.mp3');
const a90R_SE = new Audio('SE/active/90_R.mp3');
const layL_SE = new Audio('SE/active/lay_L.mp3');
const layR_SE = new Audio('SE/active/lay_R.mp3');
let SE_stop = false;

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.3,
  minTrackingConfidence: 0.3
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    try {
      await pose.send({ image: videoElement });
    } catch (error) {
      console.error('Pose detection failed:', error);
    }
  },
  width: 960,
  height: 540
});
camera.start();

let isDetectionStarted = false;
let currentTaskIndex = 0;
let taskStartTime = null;
let fmsScoreLeft = 0;
let fmsScoreRight = 0;
let lastLeftLegAngle = null;
let lastRightLegAngle = null;
const requiredDuration = 3000; // 動作穩定需持續 3 秒

const tasks = [
  '左側測試：趟平在地上',
  '左側測試：雙手放身體兩側手心朝上，腳底垂直於地面',
  '左側測試：抬高左腿，保持姿勢',
  '右側測試：趟平在地上',
  '右側測試：雙手放身體兩側手心朝上，腳底垂直於地面',
  '右側測試：抬高右腿，保持姿勢'
];

// 開始按鈕
document.getElementById('start-button').addEventListener('click', () => {
  isDetectionStarted = true;
  currentTaskIndex = 0;
  taskStartTime = null;
  fmsScoreLeft = 0;
  fmsScoreRight = 0;
  document.getElementById('task-info').textContent = tasks[currentTaskIndex];
  playSE();
});
//新添加
function isInsideRedBox(landmark, boxX, boxY, boxWidth, boxHeight) {
  const x = landmark.x * canvasElement.width;
  const y = landmark.y * canvasElement.height;

  return x >= boxX && x <= (boxX + boxWidth) && y >= boxY && y <= (boxY + boxHeight);
}

function playSE() {
  if (currentTaskIndex == 0 && SE_stop == false) {
    layL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 1 && SE_stop == false) {
    a45_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 2 && SE_stop == false) {
    a90L_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 3 && SE_stop == false) {
    layR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 4 && SE_stop == false) {
    a45_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 5 && SE_stop == false) {
    a90R_SE.play();
    SE_stop = true;
  }
}

function showModal() {
  const modal = document.getElementById("modal");
  // document.getElementById("modal-score").textContent = "總分 : ${totalScore}"
  modal.style.display = "block";
}

// 隱藏模態彈窗
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// 點擊事件處理
document.getElementById("confirm-button").addEventListener("click", function() {
  window.location.href = 'fms5end.php'; // 跳轉到下一頁
});

document.getElementById("cancel-button").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);

//修改
function onResults(results) {
  if (!isDetectionStarted) return;

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
  //修改
  // 繪製紅框
  const boxX = canvasElement.width / 15;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) + 353;
  const boxHeight = (canvasElement.height / 2) + 200;
  drawRedBox();  


  // 確認是否有偵測到骨架資料
  const landmarks = results.poseLandmarks;
  if (!landmarks || landmarks.length === 0) {
    drawTextWithBackground(
      canvasCtx,
      "請整個人都在紅框中",
      canvasElement.width / 2,
      canvasElement.height / 2,
      "red",
      "black"
    );
    return;
  }

  // 判斷所有關鍵點是否都在紅框內
  let allInside = true;
  for (let landmark of landmarks) {
    if (!isInsideRedBox(landmark, boxX, boxY, boxWidth, boxHeight)) {
      allInside = false;
      break;
    }
  }

  if (!allInside) {
    // 顯示提示文字
    drawTextWithBackground(
      canvasCtx,
      '請整個人都在紅框中',
      canvasElement.width / 2,
      canvasElement.height / 2,
      "red",
      "black"
    );
  }

  // 顯示骨架
  drawConnectors(canvasCtx, landmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
  drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

  // 繼續後續處理
  handleTasks(landmarks);
}

// 獨立修改處理任務邏輯
function handleTasks(landmarks) {
  // 提取關節點
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  let conditionMet = false;
  const myImage = document.getElementById('demoimage');
  switch (tasks[currentTaskIndex]) {
    case '左側測試：趟平在地上':
      myImage.src="Demo picture/fms5/1.png";
    case '右側測試：趟平在地上':
      myImage.src="Demo picture/fms5/2.png";
      const isLyingFlat = Math.abs(leftHip.y - rightHip.y) < 0.02;
      document.getElementById('record-info').textContent = isLyingFlat
        ? '已躺平'
        : '請確保躺平在地上';
      conditionMet = isLyingFlat;
      break;

    case '左側測試：雙手放身體兩側手心朝上，腳底垂直於地面':
      myImage.src="Demo picture/fms5/3.png";
    case '右側測試：雙手放身體兩側手心朝上，腳底垂直於地面':
      myImage.src="Demo picture/fms5/4.png";

      // 在這裡插入 console.log
      console.log("左膝蓋 X:", leftKnee?.x, "左腳踝 X:", leftAnkle?.x);
      console.log("右膝蓋 X:", rightKnee?.x, "右腳踝 X:", rightAnkle?.x);

      const isFeetVertical =
          Math.abs(leftAnkle.x - leftKnee.x) < 0.2 &&
          Math.abs(rightAnkle.x - rightKnee.x) < 0.2;
      document.getElementById('record-info').textContent = isFeetVertical
          ? '腳底垂直於地面'
          : '請調整腳底垂直';
      conditionMet = isFeetVertical;
      break;
  

      case '左側測試：抬高左腿，保持姿勢':
        myImage.src = "Demo picture/fms5/5.png";
        console.log(`leftHip: ${JSON.stringify(leftHip)}, leftKnee: ${JSON.stringify(leftKnee)}, leftAnkle: ${JSON.stringify(leftAnkle)}`);

        const leftLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    
        // 更新全域變數
        lastLeftLegAngle = leftLegAngle;
    
        // 顯示角度
        document.getElementById('step-info').textContent = `左腿角度: ${leftLegAngle.toFixed(2)}°`;
        console.log(`左腿角度: ${leftLegAngle}`);
    
        // 評分邏輯
        const fmsScoreLeft = 
        leftLegAngle > 60 && leftLegAngle <= 100 
            ? 3 
            : (leftLegAngle > 40 && leftLegAngle <= 60 
                ? 2 
                : 1);
    
        // 更新到 localStorage
        localStorage.setItem('LeftLegAngle', leftLegAngle.toFixed(2));
        localStorage.setItem('fmsScoreLeft', fmsScoreLeft);
    
        conditionMet = true;
        break;
    
      case '右側測試：抬高右腿，保持姿勢':
        myImage.src = "Demo picture/fms5/6.png";
        console.log(`leftHip: ${JSON.stringify(leftHip)}, leftKnee: ${JSON.stringify(leftKnee)}, leftAnkle: ${JSON.stringify(leftAnkle)}`);

        const rightLegAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
        // 更新全域變數
        lastRightLegAngle = rightLegAngle;
    
        // 顯示角度
        document.getElementById('step-info').textContent = `右腿角度: ${rightLegAngle.toFixed(2)}°`;
        console.log(`右腿角度: ${rightLegAngle}`);
    
        // 評分邏輯
        const fmsScoreRight = 
        rightLegAngle > 70 && rightLegAngle <= 90 
            ? 3 
            : rightLegAngle > 50 && rightLegAngle <= 70 
                ? 2 
                : 1;
    
        // 更新到 localStorage
        localStorage.setItem('RightLegAngle', rightLegAngle.toFixed(2));
        localStorage.setItem('fmsScoreRight', fmsScoreRight);
    
        conditionMet = true;
        break;
    }
    
    // 確保測試條件執行
    if (conditionMet) {
        if (!taskStartTime) {
            taskStartTime = performance.now();
        } else {
            const currentTime = performance.now();
            if (currentTime - taskStartTime >= requiredDuration) {
                currentTaskIndex++;
                SE_stop = false;
                taskStartTime = null;
                if (currentTaskIndex < tasks.length) {
                    document.getElementById('task-info').textContent = tasks[currentTaskIndex];
                    playSE();
                } else {
                    const fmsScoreLeft = parseInt(localStorage.getItem('fmsScoreLeft')) || 0;
                    const fmsScoreRight = parseInt(localStorage.getItem('fmsScoreRight')) || 0;
                    const totalScore = Math.min(fmsScoreLeft, fmsScoreRight);

    
                    localStorage.setItem('TotalScore', totalScore);
                    document.getElementById('task-info').textContent = '測試完成';
                    document.getElementById('record-info').textContent = `總分數: ${totalScore}`;
                    showModal();
                }
            }
        }
    } else {
        taskStartTime = null;
    }
    
}

function drawRedBox(){
  // 畫紅框
  const boxX = canvasElement.width / 15;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) + 353;
  const boxHeight = (canvasElement.height / 2) + 200;

  canvasCtx.strokeStyle = 'red';
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);
} 

// 計算角度的輔助函數
function calculateAngle(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const abMagnitude = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const bcMagnitude = Math.sqrt(bc.x ** 2 + bc.y ** 2);

  const dotProduct = ab.x * bc.x + ab.y * bc.y;
  const angle = Math.acos(dotProduct / (abMagnitude * bcMagnitude));
  return (angle * 180) / Math.PI;
}

//新增繪製
function drawTextWithBackground(ctx, text, x, y, textColor, backgroundColor) {
  ctx.font = "50px Arial";
  const padding = 10;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x - textWidth / 2 - padding / 2, y - textHeight / 2 - padding / 2, textWidth + padding, textHeight + padding);

  ctx.fillStyle = textColor;
  ctx.fillText(text, x - textWidth / 2, y + textHeight / 2);
}
