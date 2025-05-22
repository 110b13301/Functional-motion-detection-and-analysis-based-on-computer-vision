const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  maxNumPoses: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();

let startTime = null;
const requiredDuration = 3000; // 持續時間為3秒
let taskCompleted = false;
let taskCounter = 0; // 累次計次

// 定義任務列表
const tasks = ['站直然後單腿弓箭步，兩腳保持在一條直線上'];
let currentTaskIndex = 0;

// 標誌位，檢測是否已經開始
let isDetectionStarted = false;

// 獲取按鈕並添加點擊事件監聽器
document.getElementById('start-button').addEventListener('click', function () {
  isDetectionStarted = true;
  currentTaskIndex = 0; // 重置任務索引
  startTime = null; // 重置開始時間
  taskCounter = 0; // 重置計次
  footDistance = 0; // 重置兩腳距離
  minDistanceDuringTask = Infinity; // 重置最短距離
  document.getElementById('task-info').innerHTML = '請站直然後單腿弓箭步，兩腳保持在一條直線上';
  document.getElementById('foot-info').innerHTML = ''; // 清空兩腳信息
  document.getElementById('record-info').innerHTML = ''; // 清空得分信息
  startCountdown(); // 啟動倒數計時
});

// 定義倒數計時和顯示結果的變數和函數
let countdown = 10;
let countdownInterval;
let footDistance = 0; // 假設兩腳之間的距離
let minDistanceDuringTask = Infinity; // 在最後任務中記錄的最短距離

// 更新倒數計時顯示
function updateCountdown() {
  const countdownElement = document.getElementById("countdown");
  if (countdown > 0) {
    countdownElement.textContent = `倒數計時: ${countdown} 秒`;
    countdown--;
  } else {
    clearInterval(countdownInterval);
    countdownElement.textContent = "倒數計時完成";
    displayFinalResults();
  }
}

// 顯示最終計算結果
function displayFinalResults() {
  const footInfoElement = document.getElementById("foot-info");
  footInfoElement.innerHTML = 
    `<div>兩腳之間的距離: ${footDistance.toFixed(2)} cm</div>`;

  // 計算得分
  const score = calculateScore();
  document.getElementById('record-info').innerHTML = `得分: ${score} 分`;
}

// 計算得分
function calculateScore() {
  if (footDistance === 0) return 0; // 避免除以零

  const ratio = footDistance / 10; // 假設10cm是最理想的距離
  if (ratio <= 1) {
    return 3;
  } else if (ratio <= 1.5) {
    return 2;
  } else {
    return 1;
  }
}

// 啟動倒數計時
function startCountdown() {
  countdown = 15; // 倒數15秒
  countdownInterval = setInterval(updateCountdown, 1000);
}

function drawTextWithBackground(ctx, text, x, y, textColor, backgroundColor) {
  ctx.font = '40px Arial';
  ctx.textBaseline = 'top';
  const textWidth = ctx.measureText(text).width;
  const textHeight = 20; // 假設字型大小為20px

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x - textWidth / 2 - 10, y - 10, textWidth + 20, textHeight + 40);

  ctx.fillStyle = textColor;
  ctx.fillText(text, x - textWidth / 2, y);
}

function isFeetInLine(landmarks) {
  const leftAnkle = landmarks[27]; // 左腳踝
  const rightAnkle = landmarks[28]; // 右腳踝

  // 檢查兩腳是否在同一條直線上
  const threshold = 0.1; // 自定義的閾值，可以根據需要進行調整
  return Math.abs(leftAnkle.x - rightAnkle.x) < threshold;
}

function onResults(results) {
  if (!isDetectionStarted) {
    // 如果檢測未開始，直接返回
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  const currentTask = tasks[currentTaskIndex];
  const PIXEL_TO_CM = 0.0264; // 每個像素等於 0.0264 公分

  if (currentTask === '站直然後單腿弓箭步，兩腳保持在一條直線上') {
    document.getElementById('task-info').innerHTML = '請站直然後單腿弓箭步，兩腳保持在一條直線上';
  }

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

    const leftAnkle = results.poseLandmarks[27];
    const rightAnkle = results.poseLandmarks[28];

    const dx = (leftAnkle.x - rightAnkle.x) * canvasElement.width;
    const dy = (leftAnkle.y - rightAnkle.y) * canvasElement.height;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceCm = distance * PIXEL_TO_CM;

    footDistance = distanceCm; // 保存兩腳之間的距離

    if (currentTask === '站直然後單腿弓箭步，兩腳保持在一條直線上') {
      document.getElementById('foot-info').innerText = `兩腳之間的距離: ${distanceCm.toFixed(2)} cm`;
    }

    let conditionMet = false;
    conditionMet = isFeetInLine(results.poseLandmarks);

    if (conditionMet) {
      if (startTime === null) {
        startTime = new Date().getTime();
      } else {
        const elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime >= requiredDuration) {
          taskCompleted = true;
          taskCounter++;
          currentTaskIndex++;
          if (currentTaskIndex < tasks.length) {
            document.getElementById('task-info').innerText = tasks[currentTaskIndex];
            startCountdown(); // 開始倒數
          } else {
            document.getElementById('task-info').innerText = '結束，是否重新測量?';
            isDetectionStarted = false; // 停止檢測
            displayFinalResults(); // 顯示最終結果
          }
          startTime = null; // 重置開始時間
        }
      }
    } else {
      startTime = null;
    }
  }
  canvasCtx.restore();
}
