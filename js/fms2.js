const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const dontMove_SE = new Audio('SE/other/dont_move.mp3');
const a90_SE = new Audio('SE/step/90.mp3');
const back_SE = new Audio('SE/step/back.mp3');
const handup_SE = new Audio('SE/step/handup.mp3');
const legbackL_SE = new Audio('SE/step/legback_L.mp3');
const legbackR_SE = new Audio('SE/step/legback_R.mp3');
const legstepL_SE = new Audio('SE/step/legstep_L.mp3');
const legstepR_SE = new Audio('SE/step/legstep_R.mp3');
const legupL_SE = new Audio('SE/step/legup_L.mp3');
const legupR_SE = new Audio('SE/step/legup_R.mp3');
const line_SE = new Audio('SE/step/line.mp3');
let SE_stop = false;

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
const requiredDuration = 2000;
let currentTaskIndex = 0;
let isDetectionStarted = false;
const myImage = document.getElementById('demoimage');
// 分數
let leftFootScore = 3;
let rightFootScore = 3;
let totalScore = 3; // 總分為左右最低分
let leftFootTempScore = 3;
let rightFootTempScore = 3;

const tasks = [
  '保持不動',
  '確定軸關節90度',
  '手和肩膀同高',
  '左腳抬起一隻腳至腰部',
  '左腳往前腳跟著地',
  '左腳回到抬腳姿勢',
  '雙腳併攏',
  '右腳抬起一隻腳至腰部',
  '右腳往前腳跟著地',
  '右腳回到抬腳姿勢',
  '雙腳併攏',
  '回到原位保持不動'
];

document.getElementById('start-button').addEventListener('click', function () {
  isDetectionStarted = true;
  currentTaskIndex = 0;
  startTime = null;
  
  document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
});

function playSE() {
  if (currentTaskIndex == 0 && SE_stop == false) {
    dontMove_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 1 && SE_stop == false) {
    a90_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 2 && SE_stop == false) {
    handup_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 3 && SE_stop == false) {
    legupL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 4 && SE_stop == false) {
    legstepL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 5 && SE_stop == false) {
    legbackL_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 6 && SE_stop == false) {
    line_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 7 && SE_stop == false) {
    legupR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 8 && SE_stop == false) {
    legstepR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 9 && SE_stop == false) {
    legbackR_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 10 && SE_stop == false) {
    back_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 11 && SE_stop == false) {
    line_SE.play();
    SE_stop = true;
  }
}

function onResults(results) {
  if (!isDetectionStarted) return;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  const boxX = canvasElement.width / 3;
  const boxY = canvasElement.height / 15;
  const boxWidth = (canvasElement.width / 2) - 100;
  const boxHeight = (canvasElement.height / 2) + 200;

  canvasCtx.strokeStyle = 'red';
  canvasCtx.lineWidth = 4;
  canvasCtx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  const currentTask = tasks[currentTaskIndex];
  playSE();
  document.getElementById('task-info').innerHTML = currentTask;

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

    const leftShoulder = results.poseLandmarks[11];
    const leftElbow = results.poseLandmarks[13];
    const leftWrist = results.poseLandmarks[15];
    const rightShoulder = results.poseLandmarks[12];
    const rightElbow = results.poseLandmarks[14];
    const rightWrist = results.poseLandmarks[16];

    const leftHip = results.poseLandmarks[23];
    const rightHip = results.poseLandmarks[24];
    const leftKnee = results.poseLandmarks[25];
    const rightKnee = results.poseLandmarks[26];
    const leftAnkle = results.poseLandmarks[27];
    const rightAnkle = results.poseLandmarks[28];

    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    document.getElementById('left-arm-angle').textContent = `${leftArmAngle.toFixed(2)}`;
    document.getElementById('right-arm-angle').textContent = `${rightArmAngle.toFixed(2)}`;

    let angleCheck = false;

    switch (currentTask) {
      case '保持不動':
      case '回到原位保持不動':
        angleCheck = true; // 不需要特定條件
        break;

      case '確定軸關節90度':
        angleCheck = (leftArmAngle >= 80 && leftArmAngle <= 100) && (rightArmAngle >= 80 && rightArmAngle <= 100);
        myImage.src = "Demo picture/FMS2/bone1.png";
        break;

      case '手和肩膀同高':
        angleCheck = (leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y);
        myImage.src = "Demo picture/FMS2/bone2.png";
        break;

      case '左腳抬起一隻腳至腰部':
        angleCheck = (leftKnee.y < leftHip.y);
        if (angleCheck) updateFootScore(leftHip, leftKnee, leftAnkle, 'left');
        myImage.src = "Demo picture/FMS2/right1.png";
        break;

      case '左腳回到抬腳姿勢':
        angleCheck = (leftKnee.y < leftHip.y);
        if (angleCheck) updateFootScore(leftHip, leftKnee, leftAnkle, 'left');
        myImage.src = "Demo picture/FMS2/right1.png";
        break;

      case '左腳往前腳跟著地':
        angleCheck = (leftAnkle.y > leftHip.y);
        if (angleCheck) updateFootScore(leftHip, leftKnee, leftAnkle, 'left');
        myImage.src = "Demo picture/FMS2/right2.png";
        break;

      case '右腳抬起一隻腳至腰部':
        angleCheck = (rightKnee.y < rightHip.y);
        if (angleCheck) updateFootScore(rightHip, rightKnee, rightAnkle, 'right');
        myImage.src = "Demo picture/FMS2/left1.png";
        break;

      case '右腳回到抬腳姿勢':
        angleCheck = (rightKnee.y < rightHip.y);
        if (angleCheck) updateFootScore(rightHip, rightKnee, rightAnkle, 'right');
        myImage.src = "Demo picture/FMS2/left1.png";
        break;

      case '右腳往前腳跟著地':
        angleCheck = (rightAnkle.y > rightHip.y);
        if (angleCheck) updateFootScore(rightHip, rightKnee, rightAnkle, 'right');
        myImage.src = "Demo picture/FMS2/left2.png";
        break;

      case '雙腳併攏':
        angleCheck = (Math.abs(leftHip.x - rightHip.x) < 0.1 && Math.abs(leftAnkle.y - rightAnkle.y) < 0.1);
        myImage.src = "Demo picture/FMS2/bone2.png";
        break;
    }

    if (allPointsInsideBox(results.poseLandmarks, boxX, boxY, boxWidth, boxHeight)) {
      if (angleCheck) {
        if (startTime === null) startTime = new Date().getTime();
        const elapsedTime = new Date().getTime() - startTime;
        leftFootTempScore = getFootScore(leftHip, leftKnee, leftAnkle);
        console.log('更新分數:', leftFootTempScore);
        if (leftFootTempScore < leftFootScore) {
            leftFootScore = leftFootTempScore;
        }
        if (elapsedTime >= requiredDuration) {
          currentTaskIndex++;
          SE_stop = false;
          startTime = null;

          if (currentTaskIndex >= tasks.length) {
            isDetectionStarted = false;

            // 計算總分數
            totalScore = Math.min(leftFootScore, rightFootScore);
            console.log(`總分數計算：左腳(${leftFootScore})，右腳(${rightFootScore}) => 總分數(${totalScore})`);

            console.log(`左腳分數: ${leftFootScore}`);
            console.log(`右腳分數: ${rightFootScore}`);
            console.log(`總分數: ${totalScore}`);
            localStorage.setItem('leftFootScore', leftFootScore);
            localStorage.setItem('rightFootScore', rightFootScore);
            localStorage.setItem('totalScore', totalScore);

            showModal(); // 顯示分數後觸發模態框
          }
        }
      } else {
        startTime = null;
      }
    } else {
      drawTextWithBackground(canvasCtx,"請整個人都在紅框中",canvasElement.width / 2,canvasElement.height / 2,"red","black");
      startTime = null;
    }
  }

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
function updateFootScore(hip, knee, ankle, side) {
  const tempScore = getFootScore(hip, knee, ankle);
  if (side === 'left') {
    if (tempScore < leftFootScore) leftFootScore = tempScore;
  } else if (side === 'right') {
    if (tempScore < rightFootScore) rightFootScore = tempScore;
  }
}
function allPointsInsideBox(points, x, y, width, height) {
  return points.every(point =>
    point.x * canvasElement.width >= x &&
    point.x * canvasElement.width <= x + width &&
    point.y * canvasElement.height >= y &&
    point.y * canvasElement.height <= y + height
  );
}

function drawTextWithBackground(ctx, text, x, y, textColor, backgroundColor) {
  ctx.font = "50px Arial"; // 設定字體樣式
  const padding = 10; // 背景框的邊距

  // 測量文字的寬度與高度
  const textWidth = ctx.measureText(text).width;
  const textHeight = 50; // 字體高度（手動設定，與 ctx.font 的 px 值一致）

  // 計算背景框的位置
  const rectX = x - textWidth / 2 - padding;
  const rectY = y - textHeight / 2 - padding;
  const rectWidth = textWidth + padding * 2;
  const rectHeight = textHeight + padding * 2;

  // 畫背景框
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  // 繪製文字（讓文字中心對齊輸入的座標）
  ctx.fillStyle = textColor;
  ctx.textBaseline = "middle"; // 文字垂直對齊基準設為中間
  ctx.textAlign = "center"; // 文字水平對齊基準設為中間
  ctx.fillText(text, x, y);
}


function showModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
}
document.getElementById("confirm-button").addEventListener("click", function() {
  console.log('Redirecting to: fms2end.php'); // 確認跳轉的 URL
  window.location.href = 'fms2end.php'; // 跳轉到下一頁
});
function getFootScore(hip, knee, ankle) {
  let score = 3; // 初始為最高分

  // 1. 檢查膝蓋是否抬高
  const kneeRaised = (knee.y < hip.y - 0.2); // 假設 y 值越小越高
  if (!kneeRaised) {
    score--; // 若膝蓋未達要求，扣 1 分
  }

  // 2. 檢查腳踝是否低於膝蓋（防止不正確的抬腳）
  const ankleLowerThanKnee = (ankle.y > knee.y + 0.1);
  if (!ankleLowerThanKnee) {
    score--; // 若腳踝未正確位置，扣 1 分
  }

  // 3. 檢查腳踝與髖關節的水平偏移量
  const horizontalAlignment = Math.abs(ankle.x - hip.x);
  if (horizontalAlignment > 0.2) {
    score--; // 若腳與身體中心軸過於偏離，扣 1 分
  }

  return score; // 返回最終分數
}
function evaluateFootAction(hip, knee, ankle, side) {
  let feedback = [];
  const score = getFootScore(hip, knee, ankle);

  if (score < 3) {
    if (!(knee.y < hip.y - 0.2)) {
      feedback.push(`${side}腳膝蓋抬得不夠高`);
    }
    if (!(ankle.y > knee.y + 0.1)) {
      feedback.push(`${side}腳踝位置不正確`);
    }
    if (Math.abs(ankle.x - hip.x) > 0.2) {
      feedback.push(`${side}腳偏離中心軸`);
    }
  }

  console.log(`評估結果：${feedback.join('，')}`);
  return score;
}
