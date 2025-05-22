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
  <title>旋轉穩定性結束頁面</title>

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
              <li><a class="dropdown-item" href="blog.html">深蹲紀錄</a></li>
              <li><a class="dropdown-item" href="blog-sidebar.html">跨欄紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">直線前蹲紀錄</a></li>
              <li><a class="dropdown-item" href="historyfms4.php">肩部活動紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">直線前蹲紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">主動直膝抬腿紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">軀幹穩定伏地挺身紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">旋轉穩定性紀錄</a></li>
              <li><a class="dropdown-item" href="blog-single.html">總歷史紀錄</a></li>
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
	
	  // Update the login status based on the cookie
	  function updateWelcomeMessage() {
		const urlParams = new URLSearchParams(window.location.search);
		const username = urlParams.get('username');

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
		const username = "yourUsername"; // 获取实际用户名
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
  <div class="main-wrapper ">

    <section class="section blog bg-gray">
      <div class="row justify-content-center">
        <div class="col-lg-9 col-md-12">
          <div class="row">
            <div class="col-lg-12 d-flex">
              <!-- 左邊影片 -->
              <div style="flex: 2; padding-right: 20px;">
                <video src="videos/HURDLE STEP/FMS4.mp4" width="100%" height="auto" autoplay="true" controls="true" alt="" class="img-fluid"></video>
              </div>
    
              <!-- 右邊結果 -->
              <div style="flex: 1; padding-left: 20px; border-left: 2px solid #ccc; font-size: 1.5rem; ">
                <h1>結果</h1>
                <div id="total_record">總分數: </div>
                <div id="score_L" >左邊得分: </div>
                <div id="score_R">右邊得分: </div>
                <h2>評分</h2>
                  3分:手和膝同時離開地面，肘和膝成一條線並平行於測試板，手指觸碰到腳踝，膝關節和肘關節可以完全伸展。<br>
                  2分:能夠完成一次，但不滿足3分的要求。<br>
                  1分:一次都無法完成或是無法做出起始姿勢。<br>
                  0分:在執行過程中感到疼痛。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <div class="container text-center mt-4">
    <button class="btn btn-main" id="submitBtn">再一次</button>
    <button class="btn btn-main" id="historyBtn">歷史紀錄</button>
    </div>

    <script>
// 確認 localStorage 中的變數是否存在，並檢查是否成功讀取
const score_L = parseFloat(localStorage.getItem('score_L')) ;
const score_R = parseFloat(localStorage.getItem('score_R')) ;
const total_record = score_R && score_L ? Math.min(parseInt(score_R), parseInt(score_L)) : '尚未計算';;

document.getElementById('total_record').innerText = `總分數: ${total_record} 分`;
document.getElementById('score_L').innerText = `左邊得分: ${!isNaN(score_L) ? score_L.toFixed(2) : '尚未檢測'}`;
document.getElementById('score_R').innerText = `右邊得分: ${!isNaN(score_R) ? score_R.toFixed(2) : '尚未檢測'}`;

// 提交資料到 recordfms1.php 並查看歷史紀錄
document.getElementById('historyBtn').addEventListener('click', () => {
    const user_id = <?php echo json_encode($_SESSION['user_id']); ?>;
    const data = {
      sport_ID: 'FMS7',
          user_id: user_id,
          total_record: Math.min(parseInt(score_R), parseInt(score_L)),
          score_L: parseInt(score_L),
          score_R: parseInt(score_R),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
    };

    console.log(data); // 查看發送的資料格式


    fetch('recordfms7.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(result => {
          alert('資料已成功提交喔！');
          console.log(result);
          window.location.href = 'historyfms7.php';
      })
      .catch(error => {
          console.error('Error:', error);
          alert('提交資料失敗，請稍後再試');
      });
});


// 提交按鈕事件
  document.getElementById('submitBtn').addEventListener('click', () => {
    const user_id = <?php echo json_encode($_SESSION['user_id']); ?>;

    const data = {
          sport_ID: 'FMS7',
          user_id: user_id,
          total_record: Math.min(parseInt(score_R), parseInt(score_L)),
          score_L: parseInt(score_L),
          score_R: parseInt(score_R),
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
    };

    fetch('recordfms7.php', {
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
          window.location.href = 'rotary.html';
      })
      .catch(error => {
          console.error('Error:', error);
          alert('提交資料失敗，請稍後再試');
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

<script src="js/FMS7.js"></script>