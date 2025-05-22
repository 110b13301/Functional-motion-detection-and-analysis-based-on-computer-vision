const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const redFence_SE = new Audio('SE/other/red_fence.MP3');
//const dontMove_SE = new Audio('SE/other/dont_move.mp3'); 會跳針 暫時不加
//const done_SE = new Audio('SE/other/done.mp3');
const lay_SE = new Audio('SE/trunk/lay_down.mp3');
const up_SE = new Audio('SE/trunk/up.mp3');
let SE_stop = false;
//let dontMove_stop = false;
//let done_stop = false;
//let pointDetect = false;

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
  width: 640,
  height: 480
});
camera.start();
let checkCondition = false;
let startTime = null;
const requiredDuration = 3000; // 持續時間為3秒
let taskCompleted = false;
let bufferTimeStart = null; // 用于记录缓冲时间的开始
let taskCounter = 0; // 累次計次

// 定义任务列表
const tasks = ['紅框', '趴著', '撐起']; //const tasks = ['紅框', '狗爬式1', '摸腳1', '伸直', '摸腳2', '狗爬式2']
let currentTaskIndex = 0;

// 标志位，检测是否已经开始
let isDetectionStarted = false;

// 获取按钮并添加点击事件监听器
document.getElementById('start-button').addEventListener('click', function () {
  isDetectionStarted = true;
  currentTaskIndex = 0; // 重置任务索引
  startTime = null; // 重置开始时间
  taskCounter = 0; // 重置计次
  document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
});

function playSE() {
  if (checkCondition == false && SE_stop == false) { //if ((pointDetect == false || checkCondition == false) && SE_stop == false)
    if (currentTaskIndex == 0 ) {
      redFence_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 1) {
      lay_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 2) {
      up_SE.play();
      SE_stop = true;
    }
    //dontMove_stop = false;
    //done_stop = false;
  }
}

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
  window.location.href = 'fms6end.php'; // 跳轉到下一頁
});

document.getElementById("cancel-button").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);

function onResults(results) {
  if (!isDetectionStarted) {
    // 如果检测未开始，直接返回
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  // 畫紅框
  const boxX = canvasElement.width / 15;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) + 353;
  const boxHeight = (canvasElement.height / 2) + 200;

  canvasCtx.strokeStyle = 'red';
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // 保留提示文字
  const currentTask = tasks[currentTaskIndex];
  const textY = 20;
  if (currentTask === '紅框') {
    playSE()
    document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
  } else if (currentTask === '趴著') {
    playSE()
    document.getElementById('task-info').innerHTML = '請趴著，並以腳尖著地，雙手拇指與額頭上方平齊';
  } else if (currentTask === '撐起') {
    playSE()
    document.getElementById('task-info').innerHTML = '請將整個身體向上撐起';
    //drawTextWithBackground(canvasCtx, '請站著不動3秒鐘', canvasElement.width / 2, textY, "white", "black");
  }

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

    const r8 = results.poseLandmarks[8];
    const r12 = results.poseLandmarks[12];
    const r14 = results.poseLandmarks[14];
    const r16 = results.poseLandmarks[16];

    const r24 = results.poseLandmarks[24];
    const r26 = results.poseLandmarks[26];
    const r28 = results.poseLandmarks[28];
    const r30 = results.poseLandmarks[30];
    const r32 = results.poseLandmarks[32];

    const ArmAngleR = calculateAngle(r12, r14, r16);
    const legAngleR = calculateAngle(r24, r26, r28);

    const myImage = document.getElementById('demoimage');

    //console.log(`Left Arm Angle: ${leftArmAngle}`);
    //console.log(`Right Arm Angle: ${rightArmAngle}`);

    canvasCtx.font = "20px Arial";
    canvasCtx.fillStyle = "white";

    //document.getElementById('left-arm-angle').textContent = `Left Arm Angle: ${leftArmAngle.toFixed(2)}`;
    //document.getElementById('right-arm-angle').textContent = `Right Arm Angle: ${rightArmAngle.toFixed(2)}`;

    let angleCheck = false;
    let posCheck1 = false;
    let posCheck2 = false;

    function displayFinalResults() {
      // 顯示得分
      const score = calculateScore();
      document.getElementById('left-arm-angle').innerHTML = `得分: ${score} 分`;
      // 存储 score 到 localStorage
      localStorage.setItem('score', score);
      //dingDongSound.play();
    }

    // 計算得分
    function calculateScore() {
      if (r16.x >= r12.x) {
        if (r16.x >= r8.x) {
          return 3;
        }
        else {
          return 2;
        }
      }
      else {
        return 1;
      }
    }

    if (currentTask === '趴著') {
      myImage.src="Demo picture/trunk/01.png";
      posCheck1 = (r16.x > r14.x) && (r12.x > r24.x) && (r24.x > r26.x) && (r26.x > r28.x) && (Math.abs(r12.y - r24.y) <= 0.1) && (Math.abs(r24.y - r26.y) <= 0.1) && (Math.abs(r26.y - r28.y) <= 0.1);
      posCheck2 = (Math.abs(r30.x - r32.x) <= 0.2) && (r32.y > r30.y) && (Math.abs(r16.x - r12.x) <= 0.5);
      angleCheck = (legAngleR >= 165) && (ArmAngleR <= 120);
    } else if (currentTask === '撐起') {
      myImage.src="Demo picture/trunk/02.png";
      posCheck1 = (r16.x > r14.x) && (r12.x > r24.x) && (r24.x > r26.x) && (r26.x > r28.x) && (Math.abs(r16.y - r32.y) <= 0.1);
      posCheck2 = (Math.abs(r30.x - r32.x) <= 0.2) && (r32.y > r30.y) && (r12.y < r28.y) && (r24.y < r28.y) && (r26.y < r28.y);
      angleCheck = (legAngleR >= 170) && (ArmAngleR >= 170);
    }
    
    // 檢查關鍵點是否在紅框內
    let allPointsInside = results.poseLandmarks.every(point =>
      point.x * canvasElement.width >= boxX &&
      point.x * canvasElement.width <= boxX + boxWidth &&
      point.y * canvasElement.height >= boxY &&
      point.y * canvasElement.height <= boxY + boxHeight
    );
    //pointDetect = allPointsInside;

    if (allPointsInside) {
      if (currentTask === '紅框') {
        checkCondition = true;
      } else if (currentTask === '趴著') {
        checkCondition = (posCheck1 && posCheck2 && angleCheck);
      } else if (currentTask === '撐起') {
        checkCondition = (posCheck1 && posCheck2 && angleCheck);
      }

      if (checkCondition) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= requiredDuration) {
          //if (done_stop == false && currentTaskIndex <= 2) {
          //  done_SE.play();
          //  done_stop = true;
          //}
          document.getElementById('task-info').innerHTML = '完成';
          //dontMove_stop = false;
          SE_stop = false;
          if (bufferTimeStart === null) {
            bufferTimeStart = currentTime; // 记录缓冲时间开始
          } else if (currentTime - bufferTimeStart >= 2000) { // 2秒缓冲时间
            taskCompleted = true;
            currentTaskIndex++;
            if (currentTaskIndex >= tasks.length) {
              taskCounter++; // 增加計次
              //currentTaskIndex = 1; // 重置任务索引到90度任务
              document.getElementById('task-info').innerHTML = '結束';
              displayFinalResults();
              showModal();
            }
            startTime = null; // 重置開始時間
            bufferTimeStart = null; // 重置缓冲时间
          }
        } else {
          //if (dontMove_stop == false && currentTaskIndex <= 2) {
          //  dontMove_SE.play();
          //  dontMove_stop = true;
          //  done_stop = false;
          //  SE_stop = false;
          //}
          document.getElementById('task-info').innerHTML = '請保持不動';
        }
      } else {
        startTime = null; // 重置開始時間
        bufferTimeStart = null; // 重置缓冲时间
      }
    } else {
      drawTextWithBackground(canvasCtx, '請整個人都在紅框中', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      startTime = null; // 重置開始時間
      bufferTimeStart = null; // 重置缓冲时间
    }
  }
  //drawTextWithBackground(canvasCtx, `計次: ${taskCounter}`, canvasElement.width - 100, 40, "white", "black");
  canvasCtx.restore();
}


function calculateAngle(a, b, c) { // 計算手臂角度
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
  ctx.fillText(text, x - textWidth / 2, y + textHeight / 4);
}

