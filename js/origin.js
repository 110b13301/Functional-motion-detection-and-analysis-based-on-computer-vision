const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 960,
  height: 540
});
camera.start();

let startTime = null;
const requiredDuration = 3000; // 持續時間為3秒
let taskCompleted = false;
let bufferTimeStart = null; // 用于记录缓冲时间的开始
let taskCounter = 0; // 累次計次

// 定义任务列表，新增"轉側面"步骤
const tasks = ['站在紅框中', '90度', '180度', '轉側面', '深蹲', '90度'];
let currentTaskIndex = 0;

// 标志位，检测是否已经开始
let isDetectionStarted = false;


document.getElementById('start-button').addEventListener('click', function () {
  isDetectionStarted = true;
  currentTaskIndex = 0; // 重置任務索引
  startTime = null; // 重置開始時間
  taskCounter = 0; // 重置計次

  startCountdown(); // 啟動倒數計時
});


function showModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
}

// 隱藏模態彈窗
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// 點擊事件處理
document.getElementById("confirm-button").addEventListener("click", function() {
  window.location.href = 'a.html'; // 跳轉到下一頁
});

document.getElementById("cancel-button").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);
function onResults(results) {
  if (!isDetectionStarted) {
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // 畫紅框
  const boxX = canvasElement.width / 3;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) - 100;
  const boxHeight = (canvasElement.height / 2) + 200;

  canvasCtx.strokeStyle = 'red';
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // 保留提示文字
  const currentTask = tasks[currentTaskIndex];
  if (currentTask === '站在紅框中') {
    document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
  } else if (currentTask === '90度') {
    document.getElementById('task-info').innerHTML = '請手保持90度3秒鐘';
  } else if (currentTask === '180度') {
    document.getElementById('task-info').innerHTML = '請手保持180度3秒鐘';
  } else if (currentTask === '轉側面') {
    document.getElementById('task-info').innerHTML = '請轉向側面';
  } else if (currentTask === '深蹲') {
    document.getElementById('task-info').innerHTML = '請向下蹲到最低點3秒鐘';
  }

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];
    const leftElbow = results.poseLandmarks[13];
    const rightElbow = results.poseLandmarks[14];
    const leftWrist = results.poseLandmarks[15];
    const rightWrist = results.poseLandmarks[16];
    const leftHip = results.poseLandmarks[23];
    const rightHip = results.poseLandmarks[24];
    const leftKnee = results.poseLandmarks[25];
    const rightKnee = results.poseLandmarks[26];

    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    document.getElementById('left-arm-angle').textContent = `Left Arm Angle: ${leftArmAngle.toFixed(2)}`;
    document.getElementById('right-arm-angle').textContent = `Right Arm Angle: ${rightArmAngle.toFixed(2)}`;

    let angleCheck = false;
    let squatCheck = false;
    let sideViewCheck = false;

    // 檢測是否轉向側面：左右肩膀是否接近水平
    if (currentTask === '轉側面') {
      sideViewCheck = Math.abs(leftShoulder.x - rightShoulder.x) < 0.05;
      if (sideViewCheck) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        if (currentTime - startTime >= requiredDuration) {
          taskCompleted = true;
          currentTaskIndex++; // 移動到下一個任務（深蹲）
          startTime = null; // 重置开始时间
        } else {
          document.getElementById('task-info').innerHTML = '請保持側面不動';
        }
      } else {
        startTime = null; // 未达成条件，重置时间
        document.getElementById('task-info').innerHTML = '請轉向側面';
      }
    }

    // 檢測深蹲：髖關節是否低於膝蓋
    if (currentTask === '深蹲') {
      squatCheck = (leftHip.y > leftKnee.y) || (rightHip.y > rightKnee.y);
      if (squatCheck) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        if (currentTime - startTime >= requiredDuration) {
          taskCompleted = true;
          currentTaskIndex++; // 移到下一個任務（重回90度）
          taskCounter++; // 增加计次
          startTime = null; // 重置开始时间
        } else {
          document.getElementById('task-info').innerHTML = '請保持深蹲姿勢不動';
        }
      } else {
        startTime = null; // 未达成条件，重置时间
        document.getElementById('task-info').innerHTML = '請正確深蹲';
      }
    }

    // 檢測90度或180度動作
    if (currentTask === '90度' || currentTask === '180度') {
      if (currentTask === '90度') {
        angleCheck = (leftArmAngle >= 80 && leftArmAngle <= 100) && (rightArmAngle >= 80 && rightArmAngle <= 100);
      } else if (currentTask === '180度') {
        angleCheck = (leftArmAngle >= 165 && leftArmAngle <= 195) && (rightArmAngle >= 165 && rightArmAngle <= 195);
      }

      if (angleCheck) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        if (currentTime - startTime >= requiredDuration) {
          taskCompleted = true;
          currentTaskIndex++; // 移到下一個任務
          startTime = null; // 重置开始时间
        } else {
          document.getElementById('task-info').innerHTML = `請保持${currentTask}姿勢不動`;
        }
      } else {
        startTime = null; // 未达成条件，重置时间
        document.getElementById('task-info').innerHTML = `請正確保持${currentTask}`;
      }
    }

    // 檢查是否全部關鍵點在紅框內（對"站在紅框中"任務進行檢查）
    let allPointsInside = results.poseLandmarks.every(point =>
      point.x * canvasElement.width >= boxX &&
      point.x * canvasElement.width <= boxX + boxWidth &&
      point.y * canvasElement.height >= boxY &&
      point.y * canvasElement.height <= boxY + boxHeight
    );

    if (currentTask === '站在紅框中') {
      if (allPointsInside) {
        if (startTime === null) {
          startTime = new Date().getTime();
        }
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= requiredDuration) {
          taskCompleted = true;
          currentTaskIndex++; // 移動到下一個任務
          startTime = null;
        } else {
          document.getElementById('task-info').innerHTML = '請保持不動';
        }
      } else {
        drawTextWithBackground(canvasCtx, '請整個人都在紅框中', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
        startTime = null; // 重置开始时间
      }
    }

  }

  drawTextWithBackground(canvasCtx, `計次: ${taskCounter}`, canvasElement.width - 100, 40, "white", "black");
  canvasCtx.restore();
}

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}

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