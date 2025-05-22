const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const distanceL_SE = new Audio('SE/inline/distance_L.mp3');
const distanceR_SE = new Audio('SE/inline/distance_R.mp3');
const standL_SE = new Audio('SE/inline/stand_L.mp3');
const standR_SE = new Audio('SE/inline/stand_R.mp3');
const step_SE = new Audio('SE/inline/step.mp3');
const stick_SE = new Audio('SE/inline/stick.mp3');
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
let fmsScores = { left: 0, right: 0 };
const requiredDuration = 3000; // 動作穩定需持續 3 秒

const tasks = [
  '左側測試：測量從地面到脛骨粗隆頂端的距離',
  '左側測試：右腳往前站到脛骨長度等距離的地方',
  '左側測試：測試杆放在背後，保持垂直',
  '左側測試：完成弓箭步並保持姿勢',
  '右側測試：測量從地面到脛骨粗隆頂端的距離',
  '右側測試：左腳往前站到脛骨長度等距離的地方',
  '右側測試：測試杆放在背後，保持垂直',
  '右側測試：完成弓箭步並保持姿勢',
];

// 開始按鈕
document.getElementById('start-button').addEventListener('click', () => {
  isDetectionStarted = true;
  currentTaskIndex = 0;
  taskStartTime = null;
  fmsScores = { left: 0, right: 0 };
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
    distanceL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 1 && SE_stop == false) {
    standL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 2 && SE_stop == false) {
    stick_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 3 && SE_stop == false) {
    step_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 4 && SE_stop == false) {
    distanceR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 5 && SE_stop == false) {
    standR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 6 && SE_stop == false) {
    stick_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 7 && SE_stop == false) {
    step_SE.play();
    SE_stop = true;
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
document.getElementById("confirm-button").addEventListener("click", function () {
  window.location.href = 'fms3end.php'; // 跳轉到下一頁
});

document.getElementById("cancel-button").addEventListener("click", closeModal);
document.querySelector(".close").addEventListener("click", closeModal);

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
  // const leftShoulder = results.poseLandmarks[11];
  // const rightShoulder = results.poseLandmarks[12];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  let conditionMet = false;
  const myImage = document.getElementById('demoimage');
  const currentTask = tasks[currentTaskIndex];

  switch (currentTask) {
    case '左側測試：測量從地面到脛骨粗隆頂端的距離':
    case '右側測試：測量從地面到脛骨粗隆頂端的距離':
      // 設置圖片
      myImage.src = "Demo picture/fms3/1.png";

      // 計算脛骨距離
      const tibialDistance = calculateVerticalDistance(
        currentTask.includes('左側') ? leftKnee : rightKnee,
        currentTask.includes('左側') ? leftAnkle : rightAnkle
      );

      console.log("脛骨距離:", tibialDistance);

      // 顯示距離
      document.getElementById('record-info').textContent = `脛骨距離: ${tibialDistance.toFixed(2)} cm`;

      // 儲存距離到 localStorage
      if (currentTask.includes('左側')) {
        localStorage.setItem('LeftTibialDistance', tibialDistance.toFixed(2));
      } else {
        localStorage.setItem('RightTibialDistance', tibialDistance.toFixed(2));
      }

      // 設定條件是否符合
      conditionMet = tibialDistance > 20;
      break;

    case '左側測試：右腳往前站到脛骨長度等距離的地方':
    case '右側測試：左腳往前站到脛骨長度等距離的地方':
      myImage.src = currentTask.includes('左側') ? "Demo picture/fms3/2.png" : "Demo picture/fms3/3.png";
      const stepDistance = calculateVerticalDistance(
        currentTask.includes('左側') ? rightAnkle : leftAnkle,
        currentTask.includes('左側') ? rightKnee : leftKnee
      );
      document.getElementById('record-info').textContent = `步伐距離: ${stepDistance.toFixed(2)} cm`;
      conditionMet = stepDistance > 30; // 可以根據需求調整判斷條件
      break;

    case '左側測試：測試杆放在背後，保持垂直':
    case '右側測試：測試杆放在背後，保持垂直':
      myImage.src = currentTask.includes('左側') ? "Demo picture/fms3/4.png" : "Demo picture/fms3/5.png";
      const rodVerticalAngle = calculateAngle(
        currentTask.includes('左側') ? leftHip : rightHip,
        currentTask.includes('左側') ? leftKnee : rightKnee,
        currentTask.includes('左側') ? leftAnkle : rightAnkle
      );
      document.getElementById('record-info').textContent = `垂直角度: ${rodVerticalAngle.toFixed(2)}°`;
      conditionMet = rodVerticalAngle > 85 && rodVerticalAngle < 95;
      break;

      case '左側測試：完成弓箭步並保持姿勢':
      case '右側測試：完成弓箭步並保持姿勢':
        // 根據當前任務切換圖片
        myImage.src = currentTask.includes('左側') ? "Demo picture/fms3/6.png" : "Demo picture/fms3/7.png";

        // 計算膝蓋角度
        const kneeAngle = calculateAngle(
          currentTask.includes('左側') ? leftHip : rightHip,
          currentTask.includes('左側') ? leftKnee : rightKnee,
          currentTask.includes('左側') ? leftAnkle : rightAnkle
        );

        // 顯示膝蓋角度
        if (currentTask.includes('左側')) {
          document.getElementById('record-info').textContent = `左膝角度: ${kneeAngle.toFixed(2)}°`;
        } else {
          document.getElementById('record-info').textContent = `右膝角度: ${kneeAngle.toFixed(2)}°`;
        }

        // 評分邏輯
        const score = kneeAngle > 70 ? 3 : kneeAngle > 50 ? 2 : 1;

        // 分別儲存左側和右側的分數到 localStorage
        if (currentTask.includes('左側')) {
          localStorage.setItem('LeftKneeAngle', kneeAngle.toFixed(2)); // 儲存左膝角度
          localStorage.setItem('fmsScoreLeft', score); // 儲存左側分數
        } else {
          localStorage.setItem('RightKneeAngle', kneeAngle.toFixed(2)); // 儲存右膝角度
          localStorage.setItem('fmsScoreRight', score); // 儲存右側分數
        }

        // 判斷條件是否符合
        conditionMet = kneeAngle > 50;
        break;
        }
        
        // 確保條件穩定達成後切換任務
        if (conditionMet) {
          if (!taskStartTime) {
            taskStartTime = performance.now();
          } else {
            const currentTime = performance.now();
            if (currentTime - taskStartTime >= requiredDuration) {
              taskStartTime = null;
              currentTaskIndex++;
              SE_stop = false;
              if (currentTaskIndex < tasks.length) {
                document.getElementById('task-info').textContent = tasks[currentTaskIndex];
                playSE();
              } else {
                // 測試結束，計算總分數
                const fmsScoreLeft = Math.min(parseInt(localStorage.getItem('fmsScoreLeft')) || 0, 3);
                const fmsScoreRight = Math.min(parseInt(localStorage.getItem('fmsScoreRight')) || 0, 3);
                const totalScore = Math.min(fmsScoreLeft, fmsScoreRight);

        
                // 儲存總分數
                localStorage.setItem('TotalScore', totalScore);
        
                // 顯示總分數
                document.getElementById('record-info').textContent = `總分數: ${totalScore}`;
        
                // 顯示模態視窗
                showModal();
              }
            }
          }
        } else {
          taskStartTime = null; // 未達穩定條件，重置時間
        }        
}

function drawRedBox() {
  const boxX = canvasElement.width / 15;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) + 353;
  const boxHeight = (canvasElement.height / 2) + 200;

  canvasCtx.strokeStyle = 'red';
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);
}

function calculateVerticalDistance(a, b) {
  const dx = Math.abs(a.x - b.x) * canvasElement.width;
  const dy = Math.abs(a.y - b.y) * canvasElement.height;
  return Math.sqrt(dx ** 2 + dy ** 2);
}

function calculateAngle(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  const abMagnitude = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const bcMagnitude = Math.sqrt(bc.x ** 2 + bc.y ** 2);
  const dotProduct = ab.x * bc.x + ab.y * bc.y;
  return (Math.acos(dotProduct / (abMagnitude * bcMagnitude)) * 180) / Math.PI;
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
