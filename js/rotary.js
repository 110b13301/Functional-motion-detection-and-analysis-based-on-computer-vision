const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const redFence_SE = new Audio('SE/other/red_fence.MP3');
//const dontMove_SE = new Audio('SE/other/dont_move.mp3'); 請保持不動和完成會有跳針問題，暫不添加
//const done_SE = new Audio('SE/other/done.mp3');
const dog_SE = new Audio('SE/rotary/dog.mp3');
const TFRS_SE = new Audio('SE/rotary/touch_foot_R_S.mp3');
const extendR_SE = new Audio('SE/rotary/extend_R.mp3');
const TFRE_SE = new Audio('SE/rotary/touch_foot_R_E.mp3');
const SW_SE = new Audio('SE/rotary/switch.mp3');
const TFLS_SE = new Audio('SE/rotary/touch_foot_L_S.mp3');
const extendL_SE = new Audio('SE/rotary/extend_L.mp3');
const TFLE_SE = new Audio('SE/rotary/touch_foot_L_E.mp3');
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
let timeLimit = 60000; // 60秒時間限制
let timeoutId = null;
let startTime = null;
const requiredDuration = 3000; // 持續時間為3秒
let taskCompleted = false;
let bufferTimeStart = null; // 用于记录缓冲时间的开始
let taskCounter = 0; // 累次計次

// 定义任务列表
const tasks = ['紅框', '狗爬式1', '摸腳1', '伸直', '摸腳2', '狗爬式2', '轉身']; //const tasks = ['紅框', '狗爬式1', '摸腳1', '伸直', '摸腳2', '狗爬式2']
let currentTaskIndex = 0;

let sc3 = 0;
let sc1 = false;
let changePos = false;

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
  if (SE_stop == false) {
    if (currentTaskIndex == 0) {
      redFence_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 1) {
      dog_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 2) {
      if (changePos == false) {
        TFRS_SE.play();
        SE_stop = true;
      }
      else {
        TFLS_SE.play();
        SE_stop = true;
      }
    }
    if (currentTaskIndex == 3) {
      if (changePos == false) {
        extendR_SE.play();
        SE_stop = true;
      }
      else {
        extendL_SE.play();
        SE_stop = true;
      }
    }
    if (currentTaskIndex == 4) {
      if (changePos == false) {
        TFRE_SE.play();
        SE_stop = true;
      }
      else {
        TFLE_SE.play();
        SE_stop = true;
      }
    }
    if (currentTaskIndex == 5) {
      dog_SE.play();
      SE_stop = true;
    }
    if (currentTaskIndex == 6) {
      SW_SE.play();
      SE_stop = true;
    }
  }
  //dontMove_stop = false;
  //done_stop = false;
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
  window.location.href = 'fms7end.php'; // 跳轉到下一頁
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
    playSE();
    document.getElementById('task-info').innerHTML = '請站在紅框中測試環境';
  } else if (currentTask === '狗爬式1') {
    playSE();
    document.getElementById('task-info').innerHTML = '請趴著，並以雙手和雙膝著地，雙腳踝關節跖屈';
  } else if (currentTask === '摸腳1') {
    if (changePos == false) {
      playSE();
      document.getElementById('task-info').innerHTML = '請同時伸出右手與抬起右腿，右手觸碰右腳踝的外側';
    } else {
      playSE();
      document.getElementById('task-info').innerHTML = '請同時伸出左手與抬起左腿，左手觸碰左腳踝的外側';
    }
  } else if (currentTask === '伸直') {
    if (changePos == false) {
      playSE();
      document.getElementById('task-info').innerHTML = '請將右手與右腿向外伸直';
    } else {
      playSE();
      document.getElementById('task-info').innerHTML = '請將左手與左腿向外伸直';
    }
  } else if (currentTask === '摸腳2') {
    if (changePos == false) {
      playSE();
      document.getElementById('task-info').innerHTML = '請收回右手與右腿，並用右手觸碰右腳踝的外側';
    } else {
      playSE();
      document.getElementById('task-info').innerHTML = '請收回左手與左腿，並用左手觸碰左腳踝的外側';
    }
  } else if (currentTask === '狗爬式2') {
    playSE();
    document.getElementById('task-info').innerHTML = '請趴著，並以雙膝和雙手著地，雙腳踝關節跖屈';
  } else if (currentTask === '轉身') {
    playSE();
    document.getElementById('task-info').innerHTML = '請將身體轉向另一側並趴著，以雙手和雙膝著地，雙腳踝關節跖屈';
    //drawTextWithBackground(canvasCtx, '請站著不動3秒鐘', canvasElement.width / 2, textY, "white", "black");
  }

  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

    const r11 = results.poseLandmarks[11];
    const r12 = results.poseLandmarks[12];
    const r13 = results.poseLandmarks[13];
    const r14 = results.poseLandmarks[14];
    const r15 = results.poseLandmarks[15];
    const r16 = results.poseLandmarks[16];
    const r17 = results.poseLandmarks[17];
    const r18 = results.poseLandmarks[18];
    const r19 = results.poseLandmarks[19];
    const r20 = results.poseLandmarks[20];

    const r23 = results.poseLandmarks[23];
    const r24 = results.poseLandmarks[24];
    const r25 = results.poseLandmarks[25];
    const r26 = results.poseLandmarks[26];
    const r27 = results.poseLandmarks[27];
    const r28 = results.poseLandmarks[28];
    const r29 = results.poseLandmarks[29];
    const r30 = results.poseLandmarks[30];
    const r31 = results.poseLandmarks[31];
    const r32 = results.poseLandmarks[32];

    const ArmAngleL = calculateAngle(r11, r13, r15);
    const ArmAngleR = calculateAngle(r12, r14, r16);
    const hipAngleL = calculateAngle(r11, r23, r25);
    const hipAngleR = calculateAngle(r12, r24, r26);
    const legAngleL = calculateAngle(r23, r25, r27);
    const legAngleR = calculateAngle(r24, r26, r28);
    const footAngleL = calculateAngle(r25, r27, r31);
    const footAngleR = calculateAngle(r26, r28, r32);

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
    let handMiddlex;
    let handMiddley;
    let footMiddlex;
    let footMiddley;
    let radius;
    let distance;

    function startTaskTimer() {
      // 清除之前的計時器
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    
      if (currentTaskIndex != 6) {
        // 開始新的計時器
        timeoutId = setTimeout(() => {
          document.getElementById('task-info').innerHTML = '時間到了，進入下一個步驟';
          sc1 = true;
          currentTaskIndex++; // 跳到下一個任務
          startTaskTimer(); // 重新開始計時器
          if (currentTaskIndex >= 6) {
            if (currentTaskIndex == 7) {
              currentTaskIndex = 2; // 重置任务索引到90度任务
              SE_stop = false;
              changePos = true;
            } else if (changePos == false) {
              displayFinalResults();
              currentTaskIndex = 6;
              SE_stop = false;
            } else {
              taskCounter ++;// 增加計次
              //currentTaskIndex = 2; // 重置任务索引到90度任务
              document.getElementById('task-info').innerHTML = '結束';
              displayFinalResults();
              showModal();
            }
          }
        }, timeLimit);
      }
    }

    function posDetect() {
      if (currentTask === '摸腳1' || currentTask === '摸腳2') {
        if (distance <= radius) {
          sc3 ++;
        }
      }
      if (currentTask === '伸直') {
        if (changePos == false && (Math.abs(r12.y - r26.y) <= 0.05) && ArmAngleR >= 170 && legAngleR >= 170) {
          sc3 ++;
        }
        if (changePos == true && (Math.abs(r11.y - r25.y) <= 0.05) && ArmAngleL >= 170 && legAngleL >= 170) {
          sc3 ++;
        }
      }
    }

    function displayFinalResults() {
      // 顯示得分
      const score = calculateScore();
      if (changePos == false) {
        document.getElementById('left-arm-angle').innerHTML = `得分: ${score} 分`; // 存储 score 到 localStorage
        localStorage.setItem('score_R', score);
      } else {
        document.getElementById('left-arm-angle').innerHTML = `得分: ${score} 分`;
        localStorage.setItem('score_L', score);
        //dingDongSound.play();
      }
      sc3 = 0;
      sc1 = false;
    }

    // 計算得分
    function calculateScore() {
      if (sc1 == true) {
        return 1;
      } else if (sc3 >= 3) {
        return 3;
      } else {
        return 2;
      }
    }

    if (currentTask === '狗爬式1' || currentTask === '狗爬式2') {
      if (changePos == false) {
        myImage.src="Demo picture/rotary/01.png";
        posCheck1 = (r12.x > r24.x) && (r12.x > r16.x - 0.1 && r12.x < r16.x + 0.1) && (r24.x > r26.x - 0.1 && r24.x < r26.x + 0.1) && (r16.y < r26.y + 0.1 && r16.y > r26.y - 0.1);
        angleCheck = (footAngleR >= 120 && footAngleR <= 180);
      }
      else {
        myImage.src="Demo picture/rotary/04.png";
        posCheck1 = (r11.x < r23.x) && (r11.x > r15.x - 0.1 && r11.x < r15.x + 0.1) && (r23.x > r25.x - 0.1 && r23.x < r25.x + 0.1) && (r15.y < r25.y + 0.1 && r15.y > r25.y - 0.1);
        angleCheck = (footAngleL >= 120 && footAngleL <= 180);
      }
    } else if (currentTask === '摸腳1' || currentTask === '摸腳2') {
      if (changePos == false) {
        myImage.src="Demo picture/rotary/02.png";
        handMiddlex = (r18.x + r20.x) / 2;
        handMiddley = (r18.y + r20.y) / 2;
        footMiddlex = (r28.x + r30.x) / 2;
        footMiddley = (r28.y + r30.y) / 2;
        radius = Math.sqrt(Math.pow(r28.x - r30.x, 2) + Math.pow(r28.y - r30.y, 2)); // 计算半径
        distance = Math.sqrt(Math.pow(handMiddlex - footMiddlex, 2) + Math.pow(handMiddley - footMiddley, 2)); // 计算距离
  
        posCheck1 = (distance <= (radius * 1.5));
        angleCheck = (hipAngleR < 90);
      }
      else {
        myImage.src="Demo picture/rotary/05.png";
        handMiddlex = (r17.x + r19.x) / 2;
        handMiddley = (r17.y + r19.y) / 2;
        footMiddlex = (r27.x + r29.x) / 2;
        footMiddley = (r27.y + r29.y) / 2;
        radius = Math.sqrt(Math.pow(r27.x - r29.x, 2) + Math.pow(r27.y - r29.y, 2)); // 计算半径
        distance = Math.sqrt(Math.pow(handMiddlex - footMiddlex, 2) + Math.pow(handMiddley - footMiddley, 2)); // 计算距离
  
        posCheck1 = (distance <= (radius * 1.5));
        angleCheck = (hipAngleL < 90);
      }
    } else if (currentTask === '伸直') {
      if (changePos == false) {
        myImage.src="Demo picture/rotary/03.png";
        posCheck1 = (r16.x > r14.x) && (r14.x > r12.x) && (r24.x > r26.x) && (r26.x > r28.x);
        posCheck2 = (Math.abs(r16.y - r14.y) <= 0.1) && (Math.abs(r14.y - r12.y) <= 0.1) && (Math.abs(r24.y - r26.y) <= 0.1) && (Math.abs(r26.y - r28.y) <= 0.1);
      }
      else {
        myImage.src="Demo picture/rotary/06.png";
        posCheck1 = (r15.x < r13.x) && (r13.x < r11.x) && (r23.x < r25.x) && (r25.x < r27.x);
        posCheck2 = (Math.abs(r15.y - r13.y) <= 0.1) && (Math.abs(r13.y - r11.y) <= 0.1) && (Math.abs(r23.y - r25.y) <= 0.1) && (Math.abs(r25.y - r27.y) <= 0.1);
      }
      //squatCheck = (r23.y > r25.y) && (r24.y > r26.y); //檢查臀部y軸是否低於膝蓋y軸 判斷是否深蹲
    } else if (currentTask === '轉身') {
      if (changePos == false) {
        myImage.src="Demo picture/rotary/04.png";
        posCheck1 = (r11.x < r23.x) && (r11.x > r15.x - 0.05 && r11.x < r15.x + 0.05) && (r23.x > r25.x - 0.05 && r23.x < r25.x + 0.05) && (r15.y < r25.y + 0.05 && r15.y > r25.y - 0.05);
        angleCheck = (footAngleL >= 120 && footAngleL <= 180);
      }
      else {
        myImage.src="Demo picture/rotary/04.png";
        posCheck1 = false;
        angleCheck = false;
      }
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
      } else if (currentTask === '狗爬式1' || currentTask === '狗爬式2' || currentTask === '轉身') {
        checkCondition = (posCheck1 && angleCheck);
      } else if (currentTask === '摸腳1' || currentTask === '摸腳2') {
        checkCondition = posCheck1;
      } else if (currentTask === '伸直') {
        checkCondition = (posCheck1 && posCheck2);
      }

      if (checkCondition) {
        if (startTime === null) {
          startTime = new Date().getTime(); // 記錄開始時間
        }
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= requiredDuration) {
          //if (done_stop == false && currentTaskIndex <= 7) {
          //  done_SE.play();
          //  done_stop = true;
          //}
          document.getElementById('task-info').innerHTML = '完成';
          //dontMove_stop = false;
          SE_stop = false;
          if (bufferTimeStart === null) {
            bufferTimeStart = currentTime; // 记录缓冲时间开始
          } else if (currentTime - bufferTimeStart >= 2000) { // 2秒缓冲时间
            posDetect();
            taskCompleted = true;
            currentTaskIndex++;
            SE_stop = false;
            startTaskTimer(); // 使用者完成動作，重新啟動計時器
            if (currentTaskIndex >= 6) {
              if (currentTaskIndex == 7) {
                currentTaskIndex = 2; // 重置任务索引到90度任务
                SE_stop = false;
                changePos = true;
              } else if (changePos == false) {
                displayFinalResults();
                currentTaskIndex = 6;
                SE_stop = false;
              } else {
                taskCounter ++;// 增加計次
                //currentTaskIndex = 2; // 重置任务索引到90度任务
                document.getElementById('task-info').innerHTML = '結束';
                displayFinalResults();
                showModal();
              }
            }
            startTime = null; // 重置開始時間
            bufferTimeStart = null; // 重置缓冲时间
          }
        } else {
          //if (dontMove_stop == false && currentTaskIndex <= 7) {
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