<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    // 若未登入，重導至登入頁
    header("Location: login.html");
    exit;
}

// 資料庫設置
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("資料庫連接失敗: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];

// 檢查是否有選擇日期
$selected_date = isset($_POST['selected_date']) ? $_POST['selected_date'] : date('Y-m-d');

// 根據選擇的日期查詢資料
$sql = "SELECT * FROM recordfms4 WHERE user_id = ? ";
$params = [$user_id];

if ($selected_date) {
    $sql .= "AND date = ? ORDER BY time DESC";  // 加入 ORDER BY time DESC 按時間降序排序
    array_push($params, $selected_date);
} else {
    $sql .= " ORDER BY date DESC, time DESC";  // 若無選擇日期，按日期和時間降序排序
}

$stmt = $conn->prepare($sql);

// 綁定參數
if ($selected_date) {
    $stmt->bind_param("is", ...$params);
} else {
    $stmt->bind_param("i", $user_id);
}

$stmt->execute();
$result = $stmt->get_result();
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

  <title>肩部活動歷史紀錄</title>

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
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
	/* 使滾動效果平滑 */
	html {
		scroll-behavior: smooth;
	}

	.tab-container {
    display: flex;
    position: fixed;
    left: 0;
    top: 7%; /* 從頁面頂部開始 */
    bottom: 0; /* 延伸到頁面底部 */
    width: 25%;
    background-color: rgb(85, 85, 85); /* 灰色背景覆蓋整個左側 */
    flex-direction: column;

	}
	.bor {
		display: inline-block;
		transition: background-color 0.3s ease;
		padding: 10px ;
		width: 300px;
		border: 2px solid white;
		background-color: gray;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		text-align: center;
		font-size: 30px;
		color: white;
	}
	.bor:hover {
 		 background-color: rgb(129, 216, 207); /* 滑鼠懸停時的底色 */
	}


	.list-group-item {
		background-color: rgb(85, 85, 85);
		border: none;
	}
	#date-display {
            font-size: 1.2em;
            margin: 20px;
        }
        .date-controls {
            cursor: pointer;
			font-size: 30px;
            padding: 5px;
        }
        #date-picker {
            display: none;
        }

</style>
</head>
<body>


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
  
      //檢查登入狀態的函數
      function checkLoginStatus() {
          const isLoggedIn = true; 
          updateLoginStatus(isLoggedIn);
      }
  
      checkLoginStatus();
  });
    </script>
<!-- Header Close -->

<div class="main-wrapper ">
<!-- Section Menu End -->
<!-- Header Close -->


<br><br>
<!-- Section Blog start -->
<section class="section blog ">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-3 col-md-8">
				<div class="card border-0 rounded-0 mb-5">
</div>

<div class="mb-5 categories tab-container">
	<ul class="list-group">
		
	<li class="list-group-item ">
		 <br>
	     <center><h2 style="color: white;">所有動作</h2></center>
	  </li>
	  <li class="list-group-item d-flex justify-content-between align-items-center rounded-0 border-0">
	  		<a href="historyfms1.php" class="bor" style="color: white; margin-right: 10px;" ><img src="images/fmspeople/1.png" width="50%" /></a>
			<a href="historyfms2.php" class="bor" style="color: white;" ><img src="images/fmspeople/2.png" width="50%"/></a>
	  </li>
	  <li class="list-group-item d-flex justify-content-between align-items-center rounded-0 border-0">
	  		<a href="historyfms3.php" class="bor" style="color: white; margin-right: 10px;" ><img src="images/fmspeople/3.png" width="50%" /></a>
			<a href="historyfms4.php" class="bor" style="color: white;" ><img src="images/fmspeople/4.png" width="50%"/></a>
	  </li>
	  <li class="list-group-item d-flex justify-content-between align-items-center rounded-0 border-0">
	  		<a href="historyfms5.php" class="bor" style="color: white; margin-right: 10px;" ><img src="images/fmspeople/5.png" width="50%" /></a>
			<a href="historyfms6.php" class="bor" style="color: white;" ><img src="images/fmspeople/6.png" width="50%"/></a>
	  </li>
	  <li class="list-group-item d-flex justify-content-between align-items-center rounded-0 border-0">
	  		<a href="historyfms7.php" class="bor" style="color: white; margin-right: 10px;" ><img src="images/fmspeople/7.png" width="50%" /></a>
			<a href="historyfms8.php" class="bor" style="color: white;" ><img src="images/fmspeople/8.png" width="50%"/></a>
	  </li>

	</ul>
</div>
</div>
<div class="col-lg-9 col-md-12">
	<div class="row">
		<div class="col-lg-12">
  			<center><h1>肩部活動歷史紀錄</h1></center>
			<div id="day" class="post-tags my-5 text-uppercase font-size-12 letter-spacing text-center">
				<a href="#day" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>日</a>
				<a href="#week" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>週</a>
				<a href="#month" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>月</a>
				<br><br>
				<div id="content0"></div>
                    <form method="POST" action="historyfms4.php">
                        <label for="selected_date">選擇日期:</label>
                        <input type="date" name="selected_date" value="<?php echo htmlspecialchars($selected_date); ?>" required>
                        <button type="submit">查詢</button>
                    </form>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>總分數</th>
                                <th>左手得分</th>
                                <th>右手得分</th>
                                <th>左手拳距離</th>
                                <th>右手拳距離</th>
                                <th>時間</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($row = $result->fetch_assoc()): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($row['date']); ?></td>
                                    <td><?php echo htmlspecialchars($row['total_record']); ?></td>
                                    <td><?php echo htmlspecialchars($row['score_L']); ?></td>
                                    <td><?php echo htmlspecialchars($row['score_R']); ?></td>
                                    <td><?php echo htmlspecialchars($row['L_distance']); ?> cm</td>
                                    <td><?php echo htmlspecialchars($row['R_distance']); ?> cm</td>
                                    <td><?php echo htmlspecialchars($row['time']); ?></td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
		</div>
		<div id="week" class="post-tags my-5 text-uppercase font-size-12 letter-spacing text-center">
			<a href="#day" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>日</a>
			<a href="#week" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>週</a>
			<a href="#month" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>月</a>
			<br><br>
			<?php
			// 計算當週的起始日期和結束日期
			$selected_date = isset($_POST['selected_date']) ? $_POST['selected_date'] : date('Y-m-d');
			$timestamp = strtotime($selected_date);
			$start_of_week = date('Y-m-d', strtotime('last sunday', $timestamp)); // 當週的開始日期
			$end_of_week = date('Y-m-d', strtotime('next saturday', $timestamp)); // 當週的結束日期

			// 查詢當週的最高 total_record
			$week_sql = "
				SELECT DATE(date) AS date, MAX(total_record) AS max_total_record
				FROM recordfms4
				WHERE user_id = ? AND date BETWEEN ? AND ?
				GROUP BY DATE(date)
				ORDER BY DATE(date)
			";

			$week_stmt = $conn->prepare($week_sql);
			$week_stmt->bind_param("iss", $user_id, $start_of_week, $end_of_week);
			$week_stmt->execute();
			$week_result = $week_stmt->get_result();

			$week_data = [];
			$days_of_week = ["日", "一", "二", "三", "四", "五", "六"];
			$max_records = array_fill(0, 7, 0); // 初始化一周的數據
			$date_labels = []; // 用來存放帶日期的標籤

			// 填充每一天的最大紀錄及日期標籤
			for ($i = 0; $i < 7; $i++) {
				$current_date = date('Y-m-d', strtotime("+$i days", strtotime($start_of_week)));
				$date_labels[$i] = $days_of_week[$i] . " (" . date('m/d', strtotime($current_date)) . ")";
			}

			while ($row = $week_result->fetch_assoc()) {
				$date = new DateTime($row['date']);
				$day_of_week = (int)$date->format('w'); // 取得該日期是星期幾
				$max_records[$day_of_week] = $row['max_total_record'];
			}

			$week_stmt->close();
			?>
			<canvas id="weeklyChart" width="400" height="200"></canvas>
			<script>
				const ctx = document.getElementById('weeklyChart').getContext('2d');
				const weeklyChart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: <?php echo json_encode($date_labels); ?>, // 使用帶日期的標籤
						datasets: [{
							label: '本周當天最高點',
							data: <?php echo json_encode($max_records); ?>,
							borderColor: 'rgba(75, 192, 192, 1)',
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderWidth: 2,
							fill: true,
						}]
					},
					options: {
						scales: {
							y: {
								beginAtZero: true,
								min: 0, // 設定 y 軸最小值
								max: 3, // 設定 y 軸最大值
								ticks: {
									callback: function(value) {
										// 只顯示 0, 1, 2, 3
										if (value >= 0 && value <= 3) {
											return value;
										}
									},
									stepSize: 1 // 設定刻度間隔
								}
							}
						}
					}
				});
			</script>
		</div>


			
		<div id="month" class="post-tags my-5 text-uppercase font-size-12 letter-spacing text-center">
			<a href="#day" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>日</a>
			<a href="#week" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>週</a>
			<a href="#month" class="mr-2 text-black"><i class="ti-bookmark mr-2 text-color"></i>月</a>

			<h2>長條圖</h2>
			
			<?php
				// 獲取當前月份的日期範圍
				$start_date = date('Y-m-01');  // 當月的第一天
				$end_date = date('Y-m-t');     // 當月的最後一天

				// 計算當前月份
				$current_month = date('Y年n月');

				// 根據當月日期查詢每日最高的 total_record
				$sql = "SELECT date, MAX(total_record) as max_total_record FROM recordfms4 WHERE user_id = ? AND date BETWEEN ? AND ? GROUP BY date";
				$stmt = $conn->prepare($sql);
				$stmt->bind_param("iss", $user_id, $start_date, $end_date);
				$stmt->execute();
				$result = $stmt->get_result();

				$activity_data = array_fill(1, date('t'), 0); // 初始化當月每一天的最大 total_record 為 0

				// 填充每天的最高 total_record
				while ($row = $result->fetch_assoc()) {
					$day = (int)date('d', strtotime($row['date']));
					$activity_data[$day] = $row['max_total_record'];
				}
				?>
				<h2 id="month-title"><?php echo $current_month; ?></h2>
				<canvas id="heatmap" width="400" height="200"></canvas>
				<script>
					var ctx2 = document.getElementById('heatmap').getContext('2d');
					var data = {
						labels: Array.from({length: <?php echo date('t'); ?>}, (_, i) => i + 1),
						datasets: [{
							label: '本月每日最高 total_record',
							data: <?php echo json_encode(array_values($activity_data)); ?>,
							backgroundColor: function(context) {
								var value = context.dataset.data[context.dataIndex];
								return value > 2 ? 'rgba(75, 192, 192, 0.6)' :
									value > 1 ? 'rgba(230, 231, 117, 0.6)' :
									value > 0 ? 'rgba(255, 99, 132, 0.6)' :
									
												'rgba(201, 203, 207, 0.6)';
							},
							borderColor: 'rgba(255, 255, 255, 0.8)',
							borderWidth: 1
						}]
					};

					var heatmap = new Chart(ctx2, {
						type: 'bar',
						data: data,
						options: {
							scales: {
								y: {
								beginAtZero: true,
								min: 0, // 設定 y 軸最小值
								max: 3, // 設定 y 軸最大值
								ticks: {
									callback: function(value) {
										// 只顯示 0, 1, 2, 3
										if (value >= 0 && value <= 3) {
											return value;
										}
									},
									stepSize: 1 // 設定刻度間隔
								}
							}
							}
						}
					});
				</script>

		
		</div>

		</div>
	</div>
</div>

</section>
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

<?php
$stmt->close();
$conn->close();
?>