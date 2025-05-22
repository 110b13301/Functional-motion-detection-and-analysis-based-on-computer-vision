const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const dingDongSound = new Audio('ok.mp3');
const dingDongSound2 = new Audio('SE/shouder/end.mp3');
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

const backL_SE = new Audio('SE/shouder/back_L.mp3');
const backR_SE = new Audio('SE/shouder/back_R.mp3');
const fist_SE = new Audio('SE/shouder/fist.mp3');
let SE_stop = false;

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});
camera.start();

let startTime = null;
const requiredDuration = 3000; // 持續時間為3秒?
let taskCompleted = false;


// 定義任務列表
const tasks = ['兩隻手拇指包住握拳', '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手'];
let currentTaskIndex = 0;
let leftHandTasks = ['兩隻手拇指包住握拳', '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手'];

let isLeftHandDetection = false; 

// 標誌位，檢測是否已經開始
let isDetectionStarted = false;
let rightHandSize = 0; 
document.addEventListener('DOMContentLoaded', function() {
  // 顯示模態窗口
  var modal = document.getElementById("handSizeModal");
  var closeModal = document.getElementById("closeModal");
  var submitButton = document.getElementById("submitHandSize");

  // 顯示模態窗口當頁面載入時
  modal.style.display = "block";

  // 關閉模態窗口
  closeModal.onclick = function() {
    modal.style.display = "none";
  };

  // 當提交手掌大小時，記錄數值並關閉模態窗口
  submitButton.onclick = function() {
    var inputHandSize = document.getElementById("handSizeInput").value;
    if (inputHandSize) {
        handSize = parseFloat(inputHandSize);  // 將輸入的手掌大小記錄到 handSize 變數
        
        localStorage.setItem('handSize', handSize.toFixed(2)); // 存储手掌大小到 localStorage
        console.log("手掌大小已記錄:", handSize);  // 確認手掌大小已被記錄
        modal.style.display = "none";  // 關閉模態窗口
        document.getElementById("hand-info").innerHTML = `手掌大小: ${handSize.toFixed(2)} cm`; // 顯示手掌大小
    } else {
        alert("請輸入手掌大小");
    }
  };
});

// 當開始檢測時，從 localStorage 中讀取手掌大小
document.getElementById('start-button').addEventListener('click', function () {
  isDetectionStarted = true;
  isLeftHandDetection = false; 
  currentTaskIndex = 0; // 重置任務索引
  startTime = null; // 重置開始時間

  fistsDistance = 0; // 重置兩拳距離
  minDistanceDuringTask = Infinity; // 重置最短距離
  handSize = parseFloat(localStorage.getItem('handSize')) || 0; // 從 localStorage 讀取手掌大小
  document.getElementById('task-info').innerHTML = '請伸出自己的慣用手，手掌打開面對鏡頭';
  document.getElementById('hand-info').innerHTML = `手掌大小: ${handSize.toFixed(2)} cm`; // 顯示手掌大小
  document.getElementById('record-info').innerHTML = ''; // 清空得分
  startCountdown(); // 啟動倒數計時
});

document.getElementById('left-hand-button').addEventListener('click', function () {
  isDetectionStarted = true;
  isLeftHandDetection = true; 
  currentTaskIndex = 0; 
  startTime = null; 

  fistsDistance = 0; 
  minDistanceDuringTask = Infinity;
  
  // 慣用手的手掌大小
  handSize = parseFloat(localStorage.getItem('handSize')) || 0; 
  document.getElementById('task-info').innerHTML = '請兩隻手拇指包住握拳'; // 更新左手檢測任務資訊
  document.getElementById("hand-info").innerHTML = `手掌大小: ${handSize.toFixed(2)} cm`; 
  document.getElementById('record-info').innerHTML = ''; 
  startCountdown(); 
  this.style.display = 'none'; // 隱藏左手檢測按鈕
});



// 定義倒數計時和顯示結果的變數和函數
let countdown = 10;
let countdownInterval;
let handSize = 0; // 假設手掌大小的計算結果
let minDistanceDuringTask = Infinity; // 在最後任務中記錄的最短距離
let conditionMet = false;
function playSE() {
  if ((conditionMet == false) && SE_stop == false) {
    if (currentTaskIndex == 0) {
      fist_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 1) {
      backR_SE.play();
      SE_stop = true;
    }

  }
}
function playSE2() {
  if ((conditionMet == false) && SE_stop == false) {
    if (currentTaskIndex == 0) {
      fist_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 1) {
      backL_SE.play();
      SE_stop = true;
    }

  }
}

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
  const handInfoElement = document.getElementById("hand-info");
  handInfoElement.innerHTML = `
    <div>手掌大小: ${handSize.toFixed(2)} cm</div>
    <div>兩拳距離: ${fistsDistance.toFixed(2)} cm</div>
  `;

  // 計算得分
  const score = calculateScore();
  document.getElementById('record-info').innerHTML = `得分: ${score} 分`;
  // 存储 fistDistance 和 score 到 localStorage
  localStorage.setItem('handSize', handSize.toFixed(2));
  localStorage.setItem('fistsDistance1', fistsDistance.toFixed(2));
  localStorage.setItem('score_R', score);
  dingDongSound2.play();
    // 顯示'左手檢測'按鈕
  document.getElementById('left-hand-button').style.display = 'block';
}
function displayFinalResults2() {
  const handInfoElement = document.getElementById("hand-info");
  handInfoElement.innerHTML = `
    <div>手掌大小: ${handSize.toFixed(2)} cm</div>
    <div>兩拳距離: ${fistsDistance.toFixed(2)} cm</div>
  `;

  // 計算得分
  const score = calculateScore();
  document.getElementById('record-info').innerHTML = `得分: ${score} 分`;
  // 存储第二次 fistDistance 和 score 到 localStorage
  localStorage.setItem('fistsDistance2', fistsDistance.toFixed(2));
  localStorage.setItem('score_L', score);
  dingDongSound.play();

}


// 計算得分
function calculateScore() {
  if (handSize === 0) return 0; 

  const ratio = fistsDistance / handSize;
  if (ratio <= 1) {
    return 3;
  } else if (ratio <= 1.5) {
    return 2;
  } else {
    return 1;
  }
}

// 啟動倒數計時//待研究
function startCountdown() {
  countdown = currentTaskIndex === tasks.length - 1 ? 15 : 10; // 如果是最後一個任務，倒數15秒，否則倒數10秒
  countdownInterval = setInterval(updateCountdown, 1000);
}

function drawTextWithBackground(ctx, text, x, y, textColor, backgroundColor) {
  ctx.font = '40px Arial';
  ctx.textBaseline = 'top';
  const textWidth = ctx.measureText(text).width;
  const textHeight = 20; 

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x - textWidth / 2 - 10, y - 10, textWidth + 20, textHeight + 40);

  ctx.fillStyle = textColor;
  ctx.fillText(text, x - textWidth / 2, y);
}

function isHandInBox(landmarks, boxX, boxY, boxWidth, boxHeight) {
  for (const landmark of landmarks) {
    const x = landmark.x * canvasElement.width;
    const y = landmark.y * canvasElement.height;
    if (x < boxX || x > boxX + boxWidth || y < boxY || y > boxY + boxHeight) {
      return false;
    }
  }
  return true;
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

document.getElementById("confirm-button").addEventListener("click", function() {
  window.location.href = 'fms4end.php'; 
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
  const taskList = isLeftHandDetection ? leftHandTasks : tasks;
  const currentTask = taskList[currentTaskIndex];
  const PIXEL_TO_CM = 0.0264; // 像素 0.0264 公分
  

  
  // // 繪製紅框僅用於第一個任務
  // const boxX = canvasElement.width / 2.3;
  // const boxY = canvasElement.height / 12;
  // const boxWidth = (canvasElement.width / 2) - 180;
  // const boxHeight = (canvasElement.height / 2) + 140;

  const myImage = document.getElementById('demoimage');

if (currentTask === '兩隻手拇指包住握拳') {
  if ((conditionMet == false) && SE_stop == false) {
      fist_SE.play();
      SE_stop = true;
    }
  document.getElementById('task-info').innerHTML = '兩隻手拇指包住握拳';
  myImage.src = "Demo picture/fms4/1.png";
}
 else if (currentTask === '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手') {
  playSE();
  document.getElementById('task-info').innerHTML = '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手';
  myImage.src = "Demo picture/fms4/4.png";
}
else if (currentTask === '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手') {
  playSE2();
  document.getElementById('task-info').innerHTML = '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手';
  myImage.src = "Demo picture/fms4/3.png";
}


  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const landmarks = results.multiHandLandmarks[index];
      const handedness = results.multiHandedness[index].label;

      // 繪製手部骨架
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

      // 獲取中指指尖和手腕中心點的坐標
      const middleFingerTip = landmarks[12];
      const wrist = landmarks[0];

      // 計算手掌長度（中指指尖到手腕中心點的距離）
      const dx = (middleFingerTip.x - wrist.x) * canvasElement.width;
      const dy = (middleFingerTip.y - wrist.y) * canvasElement.height;
      const handLength = Math.sqrt(dx * dx + dy * dy);
      const handLengthCm = handLength * PIXEL_TO_CM * 2.5;


      if (currentTask === '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手') {
        if (results.multiHandLandmarks.length === 2) {
          const landmarks1 = results.multiHandLandmarks[0];
          const landmarks2 = results.multiHandLandmarks[1];

          const fist1 = landmarks1[10]; // 拇指指尖
          const fist2 = landmarks2[10]; // 拇指指尖

          // 計算兩拳之間的距離
          const dx = (fist1.x - fist2.x) * canvasElement.width;
          const dy = (fist1.y - fist2.y) * canvasElement.height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const distanceCm = distance * PIXEL_TO_CM * 7.4;

          fistsDistance = distanceCm; // 保存兩拳之間的距離
          
          // 更新最短距離
          if (distanceCm < minDistanceDuringTask && distanceCm > 3.00) {
            minDistanceDuringTask = distanceCm;
          }

          // 顯示兩拳之間的距離
          document.getElementById('hand-info').innerText = `兩拳距離: ${distanceCm.toFixed(2)} cm`;
        }
      }else if (currentTask === '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手') {
        if (results.multiHandLandmarks.length === 2) {
          const landmarks1 = results.multiHandLandmarks[0];
          const landmarks2 = results.multiHandLandmarks[1];

          const fist1 = landmarks1[10]; // 拇指指尖
          const fist2 = landmarks2[10]; // 拇指指尖

          // 計算兩拳之間的距離
          const dx = (fist1.x - fist2.x) * canvasElement.width;
          const dy = (fist1.y - fist2.y) * canvasElement.height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const distanceCm = distance * PIXEL_TO_CM * 7.4;

          fistsDistance = distanceCm; // 保存兩拳之間的距離
          
          // 更新最短距離
          if (distanceCm < minDistanceDuringTask && distanceCm > 3.00) {
            minDistanceDuringTask = distanceCm;
          }

          document.getElementById('hand-info').innerText = `兩拳距離: ${distanceCm.toFixed(2)} cm`;
        }
      }
    }


    if (currentTask === '兩隻手拇指包住握拳' && results.multiHandLandmarks.length === 2) {
      const hand1Landmarks = results.multiHandLandmarks[0];
      const hand2Landmarks = results.multiHandLandmarks[1];
      const hand1ThumbTip = hand1Landmarks[4];
      const hand1IndexFingerMcp = hand1Landmarks[5];
      const hand2ThumbTip = hand2Landmarks[4];
      const hand2IndexFingerMcp = hand2Landmarks[5];

      const isHand1Closed = hand1ThumbTip.y > hand1IndexFingerMcp.y;
      const isHand2Closed = hand2ThumbTip.y > hand2IndexFingerMcp.y;

      if (!isHand1Closed || !isHand2Closed) {
        drawTextWithBackground(canvasCtx, '請握拳，拇指包住', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      } else {
        conditionMet = results.multiHandLandmarks.length === 2; // 檢查是否有兩隻手
        conditionMet = true; 
        if (SE_stop === false) {
          fist_SE.play(); 
          SE_stop = true; 
        }
      }
    } else if (currentTask === '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手') {
      // conditionMet = results.multiHandLandmarks.length === 2 && isBackToScreenAndElbowUp(results.multiHandLandmarks[0]); // 檢查是否有兩隻手並且背對螢幕且右手肘高於肩膀
      // if (!conditionMet) {
      //   drawTextWithBackground(canvasCtx, '請背對螢幕並確保右手肘高於肩膀', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      // }
      conditionMet = results.multiHandLandmarks.length === 2 ; // 檢查是否有兩隻手並且背對螢幕且右手肘高於肩膀
      // if (!conditionMet) {
      //   drawTextWithBackground(canvasCtx, '請背對螢幕並確保右手肘高於肩膀', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      // }
    }else if (currentTask === '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手') {
      // conditionMet = results.multiHandLandmarks.length === 2 && isBackToScreenAndElbowUp2(results.multiHandLandmarks[0]); // 檢查是否有兩隻手並且背對螢幕且右手肘高於肩膀
      // if (!conditionMet) {
      //   drawTextWithBackground(canvasCtx, '請背對螢幕並確保左手肘高於肩膀', canvasElement.width / 2, canvasElement.height / 2, "red", "black");
      // }
      conditionMet = results.multiHandLandmarks.length === 2 ;
    }

    if (conditionMet) {
      if (startTime === null) {
        startTime = new Date().getTime();
      } else {
        const elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime >= requiredDuration) {
          if (currentTask === '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手') {
            fistsDistance = minDistanceDuringTask;
          } else if (currentTask === '背對螢幕，左手過頭頂在背後，向下伸，然後右手盡量靠近左手') {
            fistsDistance = minDistanceDuringTask;
          }
          taskCompleted = true;
          currentTaskIndex++;
          SE_stop = false;
          if (currentTaskIndex < taskList.length) {
            document.getElementById('task-info').innerText = taskList[currentTaskIndex];
            startCountdown();
          } else {
            if (isLeftHandDetection) {
              document.getElementById('task-info').innerText = '結束';
              isDetectionStarted = false;
              displayFinalResults2();
              showModal();
            } else if (currentTask === '背對螢幕，右手過頭頂在背後，向下伸，然後左手盡量靠近右手') {
              document.getElementById('task-info').innerText = '結束，請換左手測量';
              isDetectionStarted = false;
              displayFinalResults();
            } else {
              document.getElementById('task-info').innerText = '結束';
              isDetectionStarted = false;
              displayFinalResults2();
              showModal();
            }
          }
          startTime = null;
        }
      }
    } else {
      startTime = null;
    }
  
    canvasCtx.restore();
  }
}


