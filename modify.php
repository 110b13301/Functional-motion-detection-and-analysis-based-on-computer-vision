<?php
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

// 連接到資料庫
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("資料庫連線失敗: " . $conn->connect_error);
}

session_start();
$user_id = $_SESSION['user_id'];

// 取得使用者資料
$sql = "SELECT * FROM topic_users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();
?>
<!doctype html>

<html lang="en">
  <head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="GYm,fitness,business,company,agency,multipurpose,modern,bootstrap4">

  <!-- theme meta -->
  <meta name="theme-name" content="gymfit" />

  <meta name="author" content="Themefisher.com">

  <title>個人資料頁面</title>

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
  <style>
        .container { max-width: 600px; margin: auto; padding: 80px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"], input[type="email"], input[type="number"], input[type="password"] { width: 100%; padding: 8px; box-sizing: border-box; }
        .btn { padding: 10px 15px; color: #fff; background-color: #007bff; border: none; cursor: pointer; }

        .error { color: red; }
        .password-container { position: relative; }
        .password-container input[type="password"], .password-container input[type="text"] { padding-right: 30px; }
        .password-container .toggle-password {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    </style>
</head>
<>


<!-- Section Menu Start -->
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

    // 這裡假設 checkLoginStatus 是你用來檢查登入狀態的函數
    function checkLoginStatus() {
        // 模擬檢查登入狀態的例子，你需要根據實際情況修改
        const isLoggedIn = true; // 這裡使用 true 作為範例，實際情況應該是透過伺服器返回
        updateLoginStatus(isLoggedIn);
    }

    checkLoginStatus();
});
  </script>

<!-- Header Close -->
</n></n></n>

<!-- Section Menu End -->
<div class="container">
        <h1>編輯個人資料</h1>
        <form id="profileForm" method="POST" action="update_profile.php">
            <div class="form-group">
                <label for="username">帳號</label>
                <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($user['username']); ?>" readonly>
            </div>
            <div class="form-group">
                <label for="email">電子郵件</label>
                <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>" required>
            </div>
            <label for="text">密碼</label>
            <button type="button" class="btn btn-main" id="changePasswordBtn">變更密碼</button>
            <div id="changePasswordSection" style="display:none;">
                <div class="form-group">
                    <label for="current_password">原密碼</label>
                    <div class="password-container">
                        <input type="password" id="current_password" name="current_password">
                        <span class="toggle-password" onclick="togglePasswordVisibility('current_password')">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        </span>
                    </div>
                    <button type="button" class="btn btn-main" id="verifyPasswordBtn">確認原密碼</button>
                    <div id="passwordError" class="error" style="display:none;"></div>
                </div>
                <!-- 新增密碼 -->
                <div id="newPasswordSection" style="display:none;">
                    <div class="form-group">
                        <label for="new_password">新密碼</label>
                        <div class="password-container">
                            <input type="password" id="new_password" name="new_password">
                            <span class="toggle-password" onclick="togglePasswordVisibility('new_password')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm_new_password">確認新密碼</label>
                        <div class="password-container">
                            <input type="password" id="confirm_new_password" name="confirm_new_password">
                            <span class="toggle-password" onclick="togglePasswordVisibility('confirm_new_password')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="gender">性別</label>
                <select id="gender" name="gender" required>
                    <option value="男" <?php if ($user['gender'] == '男') echo 'selected'; ?>>男</option>
                    <option value="女" <?php if ($user['gender'] == '女') echo 'selected'; ?>>女</option>
                </select>
            </div>
            <div class="form-group">
                <label for="birth_year">出生年</label>
                <input type="number" id="birth_year" name="birth_year" value="<?php echo htmlspecialchars($user['birth_year']); ?>">
            </div>
            <div class="form-group">
                <label for="height">身高</label>
                <input type="text" id="height" name="height" value="<?php echo htmlspecialchars($user['height']); ?>" required>
            </div>
            <div class="form-group">
                <label for="weight">體重</label>
                <input type="number" id="weight" name="weight" step="0.1" value="<?php echo htmlspecialchars($user['weight']); ?>">
            </div>
            <div class="form-group">
                <label for="dominant_hand">慣用手</label>
                <input type="text" id="dominant_hand" name="dominant_hand" value="<?php echo htmlspecialchars($user['dominant_hand']); ?>">
            </div>
            <div class="form-group">
                <label for="distance_to_tibial_tuberosity">地面到脛骨粗隆頂端的距離</label>
                <input type="number" id="distance_to_tibial_tuberosity" name="distance_to_tibial_tuberosity" step="0.1" value="<?php echo htmlspecialchars($user['distance_to_tibial_tuberosity']); ?>">
            </div>
            <button type="submit" class="btn btn-main">儲存變更</button>
        </form>
    </div>

    <script>
        document.getElementById('changePasswordBtn').addEventListener('click', function() {
            document.getElementById('changePasswordBtn').style.display = 'none';
            document.getElementById('changePasswordSection').style.display = 'block';
        });

        function togglePasswordVisibility(fieldId) {
            var field = document.getElementById(fieldId);
            if (field.type === "password") {
                field.type = "text";
            } else {
                field.type = "password";
            }
        }

        document.getElementById('verifyPasswordBtn').addEventListener('click', function() {
            var currentPassword = document.getElementById('current_password').value;
            var userId = "<?php echo $user_id; ?>";

            // 使用 fetch 發送 POST 請求來驗證原密碼
            fetch('verify_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ current_password: currentPassword, user_id: userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('verifyPasswordBtn').style.display = 'none';
                    document.getElementById('newPasswordSection').style.display = 'block';
                } else {
                    document.getElementById('passwordError').innerText = '原密碼不正確';
                    document.getElementById('passwordError').style.display = 'block';
                }
            });
        });
    </script>
        <script>
        // JavaScript 部分
        document.getElementById('profileForm').addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = new FormData(this);

            fetch('update_profile.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('變更個人資料完畢');
                    window.location.href = 'modify.php';
                } else {
                    alert('更新失敗: ' + data.error);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    </script>


<!-- Section Course Start尾部可加 -->

<!-- Section Footer End -->

<!-- Section Footer Scripts -->
   </div>

   <!--
    Essential Scripts
    =====================================-->


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

   <script src="js/script.js"></script>

   </body>

   </html>




