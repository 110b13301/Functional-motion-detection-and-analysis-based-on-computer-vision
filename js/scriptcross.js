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
const requiredDuration = 2000;
let taskCompleted = false;
let bufferTimeStart = null;
let taskCounter = 0;

let leftFootScore = 3;
let rightFootScore = 3;
let currentTaskIndex = 0;
let isDetectionStarted = false;

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
  taskCounter = 0;
  document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
});

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

    document.getElementById('left-arm-angle').textContent = `Left Arm Angle: ${leftArmAngle.toFixed(2)}`;
    document.getElementById('right-arm-angle').textContent = `Right Arm Angle: ${rightArmAngle.toFixed(2)}`;

    let angleCheck = false;
    let leftFootTempScore = 3;
    let rightFootTempScore = 3;

    switch (currentTask) {
      case '保持不動':
      case '回到原位保持不動':
        angleCheck = true;
        break;
      case '確定軸關節90度':
        angleCheck = (leftArmAngle >= 80 && leftArmAngle <= 100) && (rightArmAngle >= 80 && rightArmAngle <= 100);
        break;
      case '手和肩膀同高':
        angleCheck = (leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y);
        break;
      case '左腳抬起一隻腳至腰部':
      case '左腳回到抬腳姿勢':
        angleCheck = leftKnee.y < leftHip.y;
        leftFootTempScore = getFootScore(leftHip, leftKnee, leftAnkle);
        leftFootScore = Math.min(leftFootScore, leftFootTempScore);
        break;
      case '左腳往前腳跟著地':
        angleCheck = leftAnkle.y > leftHip.y && leftAnkle.y > leftKnee.y;
        leftFootTempScore = getFootScore(leftHip, leftKnee, leftAnkle);
        leftFootScore = Math.min(leftFootScore, leftFootTempScore);
        break;
      case '右腳抬起一隻腳至腰部':
      case '右腳回到抬腳姿勢':
        angleCheck = rightKnee.y < rightHip.y;
        rightFootTempScore = getFootScore(rightHip, rightKnee, rightAnkle);
        rightFootScore = Math.min(rightFootScore, rightFootTempScore);
        break;
      case '右腳往前腳跟著地':
        angleCheck = rightAnkle.y > rightHip.y && rightAnkle.y > rightKnee.y;
        rightFootTempScore = getFootScore(rightHip, rightKnee, rightAnkle);
        rightFootScore = Math.min(rightFootScore, rightFootTempScore);
        break;
      case '雙腳併攏':
        angleCheck = Math.abs(leftHip.x - rightHip.x) < 0.1 && Math.abs(leftAnkle.y - rightAnkle.y) < 0.1;
        break;
    }

    if (allPointsInsideBox(results.poseLandmarks, boxX, boxY, boxWidth, boxHeight)) {
      if (angleCheck) {
        if (startTime === null) startTime = new Date().getTime();

        const elapsedTime = new Date().getTime() - startTime;

        if (elapsedTime >= requiredDuration) {
          if (bufferTimeStart === null) bufferTimeStart = new Date().getTime();
          else if (new Date().getTime() - bufferTimeStart >= 2000) {
            taskCompleted = true;
            currentTaskIndex++;
            if (currentTaskIndex >= tasks.length) {
              taskCounter++;
              currentTaskIndex = 3; // 從左腳動作開始
              if (taskCounter >= 3) {
                isDetectionStarted = false;
                document.getElementById('task-info').innerHTML = '檢測结束';
              }
            }
            startTime = null;
            bufferTimeStart = null;
          }
        } else {
          document.getElementById('task-info').innerHTML = '請保持不動';
        }
      } else {
        startTime = null;
        bufferTimeStart = null;
      }
    } else {
      drawTextWithBackground(canvasCtx, '請整個人都在紅框中', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      startTime = null;
      bufferTimeStart = null;
    }
  }

  const finalScore = Math.min(leftFootScore, rightFootScore);
  console.log(`Final Score: ${finalScore}`);
  document.getElementById('score').innerHTML = `Score: ${finalScore}`;
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

function getFootScore(hip, knee, ankle) {
  let score = 3;

  const hipToKnee = Math.abs(knee.y - hip.y);
  const kneeToAnkle = Math.abs(ankle.y - knee.y);

  if (hipToKnee > 0.1 || kneeToAnkle > 0.1) {
    score = 2;
  }
  if (hipToKnee > 0.15 || kneeToAnkle > 0.15) {
    score = 1;
  }
  return score;
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
  ctx.font = "50px Arial";
  const padding = 10;
  const textWidth = ctx.measureText(text).width;
  const textHeight = 50;

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x - padding, y - textHeight - padding, textWidth + padding * 2, textHeight + padding * 2);

  ctx.fillStyle = textColor;
  ctx.fillText(text, x, y);
}
