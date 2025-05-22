const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const redFence_SE = new Audio('SE/other/red_fence.MP3');
//const dontMove_SE = new Audio('SE/other/dont_move.mp3');
const a90_SE = new Audio('SE/squart/90.mp3');
const a180_SE = new Audio('SE/squart/180.mp3');
const side_SE = new Audio('SE/squart/side.mp3');
const squart_SE = new Audio('SE/squart/squart.mp3');
let SE_stop = false;
//let dontMove_stop = false;

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
let initialTime = null;

// 定义任务列表，新增"轉側面"步骤
const tasks = ['站在紅框中', '90度', '180度', '轉側面', '深蹲'];
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
  //document.getElementById('mySound').play();
});

function playSE() {
  if (currentTaskIndex == 0 && SE_stop == false) {
    redFence_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 1 && SE_stop == false) {
    a90_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 2 && SE_stop == false) {
    a180_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 3 && SE_stop == false) {
    side_SE.play();
    SE_stop = true;
  }
  if (currentTaskIndex == 4 && SE_stop == false) {
    squart_SE.play();
    SE_stop = true;
  }
  //dontMove_stop = false;
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
  console.log('Redirecting to: fms1end.php'); // 確認跳轉的 URL
  window.location.href = 'fms1end.php'; // 跳轉到下一頁
});



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
    playSE()
    document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
  } else if (currentTask === '90度') {
    playSE()
    document.getElementById('task-info').innerHTML = '請手保持90度3秒鐘';
  } else if (currentTask === '180度') {
    playSE()
    document.getElementById('task-info').innerHTML = '請手保持180度3秒鐘';
  } else if (currentTask === '轉側面') {
    playSE()
    document.getElementById('task-info').innerHTML = '請轉向側面';
  } else if (currentTask === '深蹲') {
    playSE()
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
    const leftleg = results.poseLandmarks[27];
    const rightleg = results.poseLandmarks[28];
    const leftHeel = results.poseLandmarks[29]; 
    const rightHeel = results.poseLandmarks[30]; 
    const leftToe = results.poseLandmarks[31];  
    const rightToe = results.poseLandmarks[32];

    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const kneeAngle = calculateAngle(leftHip, leftKnee, rightleg);
    const bottomAngle = calculateAngle(leftShoulder, leftHip, rightKnee);
    const myImage = document.getElementById('demoimage');
    

    document.getElementById('left-arm-angle').textContent = `${leftArmAngle.toFixed(0)}`;
    document.getElementById('right-arm-angle').textContent = `${rightArmAngle.toFixed(0)}`;
    document.getElementById('bottom-angle').textContent = `${bottomAngle.toFixed(0)}`;
    document.getElementById('knee-angle').textContent = `${kneeAngle.toFixed(0)}`;
    

    let angleCheck = false;
    let squatCheck = false;
    let sideViewCheck = false;
    let squatTimeStart = null;
    let isHeelsRaiseddefault=0;

    // 檢測90度或180度動作
    if (currentTask === '90度' || currentTask === '180度') {
      if (currentTask === '90度') {
        angleCheck = (leftArmAngle >= 80 && leftArmAngle <= 100) && (rightArmAngle >= 80 && rightArmAngle <= 100);
        
      } else if (currentTask === '180度') {
        angleCheck = (leftArmAngle >= 165 && leftArmAngle <= 195) && (rightArmAngle >= 165 && rightArmAngle <= 195);
        myImage.src="Demo picture/bone2.png";
      }

      if (angleCheck) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        if (currentTime - startTime >= requiredDuration) {
          taskCompleted = true;
          currentTaskIndex++; // 移到下一個任務
          SE_stop = false;
          startTime = null; // 重置开始时间
          //document.getElementById('mySound').play();
        } else {
          document.getElementById('task-info').innerHTML = `請保持${currentTask}姿勢不動`;
        }
      } else {
        startTime = null; // 未达成条件，重置时间
        document.getElementById('task-info').innerHTML = `請正確保持${currentTask}`;
        myImage.src="Demo picture/bone1.png";
      }
    }

    // 檢測是否轉向側面：左右肩膀是否接近水平
    if (currentTask === '轉側面') {
      isHeelsRaised = (leftHeel.y < leftToe.y ) && (rightHeel.y < rightToe.y);
      sideViewCheck = Math.abs(leftShoulder.x - rightShoulder.x) < 0.05;
      isHeelsRaiseddefault = isHeelsRaised ? 10 : 0;
      myImage.src="Demo picture/bone3.png";
      if (sideViewCheck) {
        if (isHeelsRaised){
          document.getElementById('task-info').innerHTML = '腳跟墊高，最多得2分';
        }
        else{
          document.getElementById('task-info').innerHTML = '請保持腳跟不墊高，滿分3分';
        }
        
        
        if (startTime === null) {
          startTime = new Date().getTime();
        }

        const currentTime = new Date().getTime();
        if (currentTime - startTime >= 10000) {
          taskCompleted = true;
          currentTaskIndex++; // 移動到"深蹲"
          SE_stop = false;
          startTime = null;
          //document.getElementById('mySound').play();
        }
      } else {
        startTime = null; // 未达成条件，重置时间
        document.getElementById('task-info').innerHTML = '請轉向側面';
      }
    }
    let fmsScore = 0; // 初始化 FMS 分數`

    function updateProgressBar(score) {
      const progressBar = document.getElementById('fms-progress');
      const percentage = (score / 3) * 100; // 假設滿分為 3 分
      progressBar.style.width = `${percentage}%`;
      progressBar.textContent = `${score} 分`;
    
      // 將 FMS 分數存儲到 localStorage
      localStorage.setItem('fmsScore', score);
    
      // 顯示模態彈窗
      
    }

    // 檢測深蹲：髖關節是否低於膝蓋
    function showModal() {
      const modal = document.getElementById("modal");
      modal.style.display = "block";
    }
    
    if (currentTask === '深蹲') { 
      const squatCheck = (leftHip.y > leftKnee.y) || (rightHip.y > rightKnee.y);
    
      myImage.src = "Demo picture/bone4.png";
    
      // 如果initialTime為null，記錄任務開始時間
      if (initialTime === null) {
        initialTime = new Date().getTime(); // 任務開始時間
      }
    
      const currentTime = new Date().getTime();
    
      // 檢查是否超過5秒仍未達到深蹲姿勢
      if (!squatCheck && currentTime - initialTime >= 5000) {
        // 用戶未達到深蹲姿勢超過5秒，給1分並結束任務
        fmsScore = 1;
        localStorage.setItem('KneeAngle', kneeAngle);
        localStorage.setItem('BottomAngle', bottomAngle);
        //document.getElementById('mySound').play();
        updateProgressBar(fmsScore);
    
        taskCompleted = true;
        initialTime = null; // 重置初始時間
        showModal();
    
      } else if (squatCheck) {
        // 當用戶達到蹲下姿勢時，開始記錄蹲下的時間
        if (startTime === null) {
          startTime = currentTime; // 記錄開始蹲下的時間
        }
    
        const timeElapsed = currentTime - startTime;
    
        // 確認蹲下並保持超過5秒
        if (timeElapsed >= 5000) {
          const sideViewCheck = Math.abs(leftShoulder.x - rightShoulder.x) < 0.05;
          const isHeelsRaiseddefault = isHeelsRaised ? 10 : 0;
    
          if (isHeelsRaiseddefault === 0) {
            fmsScore = 3; // Squat without raised heels, 3 points
          } else if (isHeelsRaiseddefault === 10) { 
            fmsScore = 2; // Squat with raised heels, 2 points
          }
    
          localStorage.setItem('KneeAngle', kneeAngle);
          localStorage.setItem('BottomAngle', bottomAngle);
          //document.getElementById('mySound').play();
          updateProgressBar(fmsScore);
    
          taskCompleted = true;
          initialTime = null; // 重置初始時間
          startTime = null; // 重置蹲下計時
          showModal();
    
        } else {
          document.getElementById('task-info').innerHTML = '請保持深蹲姿勢5秒不動';
        }
      } else {
        // 如果未保持蹲下姿勢，重置蹲下計時
        startTime = null;
        document.getElementById('task-info').innerHTML = '請正確深蹲';
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
          SE_stop = false;
          startTime = null;
          //document.getElementById('mySound').play();
        } else {
          document.getElementById('task-info').innerHTML = '請保持不動';
        }
      } else {
        drawTextWithBackground(canvasCtx, '請整個人都在紅框中', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
        startTime = null; // 重置开始时间
      }
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

