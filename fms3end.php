//成功
<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // 若未登入，重導至登入頁
    header("Location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>直線前蹲結束頁面</title>

  <!-- bootstrap.min css -->
  <link rel="stylesheet" href="plugins/bootstrap/css/bootstrap.min.css">
  <!-- Icofont Css -->
  <link rel="stylesheet" href="plugins/icofont/icofont.min.css">
  <!-- Themify Css -->
  <link rel="stylesheet" href="plugins/themify/css/themify-icons.css">
  <!-- animate.css -->
  <link rel="stylesheet" href="plugins/animate-css/animate.css">
  <!-- Magnify Popup -->
  <link rel="stylesheet" href="plugins/magnific-popup/dist/magnific-popup.css">
  <!-- Owl Carousel CSS -->
  <link rel="stylesheet" href="plugins/slick-carousel/slick/slick.css">
  <link rel="stylesheet" href="plugins/slick-carousel/slick/slick-theme.css">
  <!-- Main Stylesheet -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
<!-- Header Start -->
<nav class="navbar navbar-expand-lg navigation fixed-top" id="navbar" style="background-color: black;">
	<div class="container-fluid">
		<a class="navbar-brand" href="index.html">
		<h2 class="text-color text-capitalize"></i>CV<span class="text-white">FMS</span></h2>
		</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsid"
			aria-controls="navbarsid" aria-expanded="false" aria-label="Toggle navigation">
			<span class="ti-view-list"></span>
		</button>
		<div class="collapse text-center navbar-collapse" id="navbarsid">
			<ul class="navbar-nav mx-auto">
				<li class="nav-item active">
					<a class="nav-link" href="index.html">首頁 <span class="sr-only">(current)</span></a>
				</li>
				<li class="nav-item"><a class="nav-link" href="service.html">動作總覽</a></li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true"
						aria-expanded="false">運動專區</a>
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" href="squart.html">深蹲</a></li>
						<li><a class="dropdown-item" href="FMS2step.html">跨欄</a></li>
						<li><a class="dropdown-item" href="FMS3inline.html">直線前蹲</a></li>
						<li><a class="dropdown-item" href="FMS4shoulder.html">肩部活動</a></li>
						<li><a class="dropdown-item" href="FMS5active.html">主動直膝抬腿</a></li>
						<li><a class="dropdown-item" href="FMS6trunk.html">軀幹穩定伏地挺身</a></li>
						<li><a class="dropdown-item" href="FMS7rotary.html">旋轉穩定性</a></li>
					</ul>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true"
						aria-expanded="false">歷史紀錄</a>
					<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="historyfms1.php">深蹲紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms2.php">跨欄紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms3.php">直線前蹲紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms4.php">肩部活動紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms5.php">主動直膝抬腿紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms6.php">軀幹穩定伏地挺身紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms7.php">旋轉穩定性紀錄</a></li>
					<li><a class="dropdown-item" href="historyfms8.php">總歷史紀錄</a></li>
					</ul>
				</li>
	

			</ul>
      <div id="profile-icon-container" style="display: none;">
				<a href="modify.php">
				   <img src="person.png" alt="Profile" class="profile-icon"width=50dp>
				</a>
			 </div>
			<div class="my-md-0 ml-lg-4 mt-4 mt-lg-0 ml-auto text-lg-right mb-3 mb-lg-0">
				<a id="auth-link" href="login.html">
				  <h3 class="text-color mb-0" id="auth-text">登入</h3>
				</a>
			</div>
		</div>
	</div>
</nav>
<!-- 之後要加入 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
      function updateLoginStatus(isLoggedIn) {
          const authText = document.getElementById('auth-text');
          const profileIconContainer = document.getElementById('profile-icon-container');
  
          if (isLoggedIn) {
              authText.textContent = '登出';
              profileIconContainer.style.display = 'block';
              authText.onclick = function() {
                  // 執行登出邏輯，例如清除 session 並重新載入頁面
                  window.location.href = 'logout.php';
              };
          } else {
              authText.textContent = '登入';
              profileIconContainer.style.display = 'none';
          }
      }
  
      //檢查登入狀態的函數
      function checkLoginStatus() {
          const isLoggedIn = true; 
          updateLoginStatus(isLoggedIn);
      }
  
      checkLoginStatus();
  });
    </script>

<!-- 之後要加入 -->
<script>
	document.addEventListener('DOMContentLoaded', function() {
	  // Function to set a cookie
	  function setCookie(name, value, days) {
		const d = new Date();
		d.setTime(d.getTime() + (days*24*60*60*1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + value + ";" + expires + ";path=/";
	  }
	
	  // Function to get a cookie
	  function getCookie(name) {
		let cname = name + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for(let i = 0; i < ca.length; i++) {
		  let c = ca[i];
		  while (c.charAt(0) === ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(cname) === 0) {
			return c.substring(cname.length, c.length);
		  }
		}
		return "";
	  }
	
	  // Function to delete a cookie
	  function deleteCookie(name) {
		document.cookie = name + '=; Max-Age=-99999999;';
	  }
	//待改
    function updateWelcomeMessage() {
    const username = getCookie("username");
    if (username) {
      document.getElementById("username-display").innerText = "歡迎, " + decodeURIComponent(username) + "!";
    }
  }
	  function updateLoginStatus() {
		const isLoggedIn = getCookie("isLoggedIn") === "true";
		const authText = document.getElementById('auth-text');
		const profileIconContainer = document.getElementById('profile-icon-container');
		const authLink = document.getElementById('auth-link');
	
		if (isLoggedIn) {
		  authText.textContent = '登出';
		  profileIconContainer.style.display = 'block';
		  authLink.setAttribute('href', 'logout.php');
		} else {
		  authText.textContent = '登入';
		  profileIconContainer.style.display = 'none';
		  authLink.setAttribute('href', 'login.html');
		}
	  }
	
	  // Simulate login for testing (in real scenario, login form will set this cookie on server-side)
	  function login() {
		setCookie("isLoggedIn", "true", 1); // sets cookie for 1 day
		updateLoginStatus();
		const username = "admin"; // 获取实际用户名//待改
		setCookie("username", username, 1); // 设置 Cookie，有效期 1 天
		updateWelcomeMessage();
	  }
	
	  // Simulate logout
	  function logout() {
		deleteCookie("isLoggedIn");
		updateLoginStatus();
		deleteCookie("username");
		updateWelcomeMessage();
	  }
	  updateWelcomeMessage();
	  // Check and update the login status on page load
	  updateLoginStatus();
	
	  // Example: If you want to simulate a login/logout button, you could add event listeners:
	  document.getElementById('auth-link').addEventListener('click', function(event) {
		if (getCookie("isLoggedIn") === "true") {
		  logout();
		}
	  });
	});
	</script>
  <div class="main-wrapper">
  <section class="section blog bg-gray">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-md-12">
        <div class="row">
          <div class="col-lg-12 d-flex">
            <div style="flex: 1;   font-size: 1.5rem;">
              <!-- <video src="videos/FMS3.mp4" width="100%" height="auto" autoplay controls></video> -->
              <h1>結果</h1>
              <div id="total_record">總分數: </div>
              <div id="tibial">脛骨距離: </div>
              <div id="score_R">右邊分數:</div>              
              <div id="score_L">左邊分數:</div>
              <div id="R_distance">右抬腿成功角度: </div>
              <div id="L_distance">左抬腿成功角度: </div>
            </div>
            <div style="flex: 1; padding-left: 20px; border-left: 2px solid #ccc; font-size: 1.5rem;">
                <h2>評語:</h2>
                <div id="evaluation">尚未評分 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <div class="container text-center mt-4">
  <button class="btn btn-main" id="submitBtn"style="margin-right: 30pt;">再一次</button>  
  <button class="btn btn-main" id="historyBtn">歷史紀錄</button>
  </div>

  <script>
    // 確認 localStorage 中的變數是否存在，並檢查是否成功讀取
    const total_record = localStorage.getItem('TotalScore'); // 總分數
    const score_L = localStorage.getItem('fmsScoreLeft') ;
    const score_R = localStorage.getItem('fmsScoreRight') ;
    const R_distance =localStorage.getItem('RightKneeAngle') ; // 右抬腿成功角度
    const L_distance = localStorage.getItem('LeftKneeAngle'); // 左抬腿成功角度
    const tibial = localStorage.getItem('RightTibialDistance');
    
    function getEvaluation(score) {
      if (score == 3) {
        return "1.長杆始終與各點保持接觸，同時長杆保持垂直<br>2.軀幹保持穩定，沒有側彎和前傾<br>3.雙腳保持朝前，後腿的膝蓋要落在前腳腳跟的正後方";
      } else if (score == 2) {
        return "1.長杆未能始終與各點接觸<br>2.長杆未能保持垂直<br>3.軀幹有明顯移動<br>4.雙腳沒有保持朝前或後腿膝蓋無法落在前腳腳跟的正後方";
      } else if (score == 1) {
        return "長杆未能始終與各點接觸且無法完成動作";
      } else {
        return "尚未評分或數據錯誤。";
      }
    }
    const evaluationText = totalScore && !isNaN(totalScore) ? getEvaluation(totalScore) : "尚未檢測";
    document.getElementById('evaluation').innerHTML = `${evaluationText}`;


    // 顯示數據到頁面
    document.getElementById('score_L').innerText = `左手得分: ${score_L ? score_L + ' 分' : '尚未檢測'}`;
    document.getElementById('score_R').innerText = `右腿得分: ${score_R ? score_R + ' 分' : '尚未檢測'}`;
    document.getElementById('total_record').textContent = `總分數: ${total_record}`;
    document.getElementById('tibial').innerText = `脛骨距離:  ${tibial ? tibial+ ' 公分' : '尚未檢測'}`;

    document.getElementById('R_distance').innerText = `弓箭步右膝角度:  ${R_distance ? R_distance+ ' 度' : '尚未檢測'}`;
    document.getElementById('L_distance').innerText = `弓箭步左膝角度: ${L_distance ? L_distance + ' 度' : '尚未檢測'}`;

    // 提交資料到後端並查看歷史紀錄
    document.getElementById('historyBtn').addEventListener('click', () => {
    const user_id = <?php echo json_encode($_SESSION['user_id']); ?>; // 使用者ID

      const data = {
          sport_ID: 'FMS3',
          user_id: user_id,
          total_record: Math.min(parseInt(score_R), parseInt(score_L)),
          score_L: parseInt(score_L),
          score_R: parseInt(score_R),
          tibial: parseFloat(tibial), // 新增脛骨距離
          L_distance: parseFloat(L_distance),
          R_distance: parseFloat(R_distance),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
      };

      fetch('recordfms3.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(result => {
          alert('資料已成功提交！');
          console.log(result);
          window.location.href = 'historyfms3.php'; // 提交後查看歷史紀錄
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });
    
    
    
    // 提交按鈕事件
      document.getElementById('submitBtn').addEventListener('click', () => {
        const user_id = <?php echo json_encode($_SESSION['user_id']); ?>; // 使用者ID

        const data = {
            sport_ID: 'FMS3',
            user_id: user_id,
            total_record: Math.min(parseInt(score_R), parseInt(score_L)),
            score_L: parseInt(score_L),
            score_R: parseInt(score_R),
            tibial: parseFloat(tibial), // 新增脛骨距離
            L_distance: parseFloat(L_distance),
            R_distance: parseFloat(R_distance),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0]
        };

        fetch('recordfms3.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(result => {
            alert('資料已成功提交！');
            console.log(result);
            window.location.href = 'FMS3.php'; // 提交後查看歷史紀錄
        })
        .catch(error => {
            console.error('Error:', error);
        });
        });

    </script>
  </body>
</html>
<!-- Main jQuery -->
<script src="plugins/jquery/jquery.js"></script>
<!-- Bootstrap 4.3.1 -->
<script src="plugins/bootstrap/js/bootstrap.min.js"></script>
<!-- Slick Slider -->
<script src="plugins/slick-carousel/slick/slick.min.js"></script>
<!--  Magnific Popup-->
<script src="plugins/magnific-popup/dist/jquery.magnific-popup.min.js"></script>
<!-- Form Validator -->
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.32/jquery.form.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/jquery.validate.min.js"></script>
<!-- Google Map -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBu5nZKbeK-WHQ70oqOWo-_4VmwOwKP9YQ"></script>
<script src="plugins/google-map/gmap.js"></script>

<script src="js/FMS5.js"></script>