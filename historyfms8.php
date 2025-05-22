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


//改這裡(加入)
// 根據選擇的日期查詢資料並取得最大 total_record
$sql1 = "SELECT * FROM recordfms1 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql2 = "SELECT * FROM recordfms2 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql3 = "SELECT * FROM recordfms3 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql4 = "SELECT * FROM recordfms4 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql5 = "SELECT * FROM recordfms5 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql6 = "SELECT * FROM recordfms6 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";
$sql7 = "SELECT * FROM recordfms7 WHERE user_id = ? AND date = ? ORDER BY total_record DESC LIMIT 1";

$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("is", $user_id, $selected_date);
$stmt1->execute();
$result1 = $stmt1->get_result();
$highest1 = $result1->fetch_assoc();

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("is", $user_id, $selected_date);
$stmt2->execute();
$result2 = $stmt2->get_result();
$highest2 = $result2->fetch_assoc();

$stmt3 = $conn->prepare($sql3);
$stmt3->bind_param("is", $user_id, $selected_date);
$stmt3->execute();
$result3 = $stmt3->get_result();
$highest3 = $result3->fetch_assoc();

$stmt4 = $conn->prepare($sql4);
$stmt4->bind_param("is", $user_id, $selected_date);
$stmt4->execute();
$result4 = $stmt4->get_result();
$highest4 = $result4->fetch_assoc();

$stmt5 = $conn->prepare($sql5);
$stmt5->bind_param("is", $user_id, $selected_date);
$stmt5->execute();
$result5 = $stmt5->get_result();
$highest5 = $result5->fetch_assoc();

$stmt6 = $conn->prepare($sql6);
$stmt6->bind_param("is", $user_id, $selected_date);
$stmt6->execute();
$result6 = $stmt6->get_result();
$highest6 = $result6->fetch_assoc();

$stmt7 = $conn->prepare($sql7);
$stmt7->bind_param("is", $user_id, $selected_date);
$stmt7->execute();
$result7 = $stmt7->get_result();
$highest7 = $result7->fetch_assoc();



$params = [$user_id];



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

  <title>總歷史紀錄</title>

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
    tbody {
        font-weight: bold;
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
        .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        }

    .table th {
        background-color: #f8f9fa;
        text-align: center;
        font-weight: bold;
    }

    .table td {
        padding: 8px;
        text-align: left;
        vertical-align: middle;
    }

    .table-bordered {
        border: 1px solid #dee2e6;
    }

    .table-bordered td,
    .table-bordered th {
        border: 1px solid #dee2e6;
    }
    .large-font {
    font-size: 20px;
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
  			<center><h1>總歷史紀錄報表</h1></center>
			<div id="day" class="post-tags my-5 text-uppercase font-size-12 letter-spacing text-center">
				<div id="content0"></div>
                    <form method="POST" action="historyfms8.php">
                        <label for="selected_date">選擇日期:</label>
                        <input type="date" name="selected_date" value="<?php echo htmlspecialchars($selected_date); ?>" required>
                        <button type="submit">查詢</button>
                    </form>

                    <?php
                    $display_date = date("Y年m月d日", strtotime($selected_date));
                    $weekday = date("l", strtotime($selected_date));
                    $weekday_translations = [
                        "Monday" => "星期一",
                        "Tuesday" => "星期二",
                        "Wednesday" => "星期三",
                        "Thursday" => "星期四",
                        "Friday" => "星期五",
                        "Saturday" => "星期六",
                        "Sunday" => "星期日"
                    ];
                    $weekday_chinese = $weekday_translations[$weekday];
                    ?>

                    <div style="text-align: center; margin-top: 20px; font-size: 20px;">
                        <p>日期：<?php echo $display_date; ?>   <?php echo $weekday_chinese; ?></p>
                    </div>
                    <div class="container">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th WIDTH=200>檢測項目</th>
                                <th WIDTH=220>項目內容</th>
                                <th WIDTH=60>評分</th>
                                <th>回饋</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 深蹲資料 -->
                            <?php if ($highest1): ?>
                                <tr>
                                    <td rowspan="2" class="large-font"><b><center>深蹲</center></b></td>
                                    <td><b>膝蓋角度: <?php echo htmlspecialchars($highest1['knee_score']); ?></b></td>
                                    <td rowspan="2"class="large-font"><b><center><?php echo htmlspecialchars($highest1['total_record']); ?></center></b></td>
                                    <td rowspan="2"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest1['total_record'];
                                        if ($score == 3) {
                                            echo "腳跟沒有墊高且蹲的下去。";
                                        } elseif ($score == 2) {
                                            echo "腳跟有墊高且蹲的下去。";
                                        } elseif ($score == 1) {
                                            echo "腳跟有墊高且蹲不下去。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td>臀部角度: <?php echo htmlspecialchars($highest1['bottom_score']); ?></td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>深蹲</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>
                            <?php endif; ?>
                            <!-- 跨欄未完成 -->
                            <?php if ($highest2): ?>
                                <tr>
                                    <td rowspan="2"class="large-font"><b><center>跨欄</center></b></td>
                                    <td>左腳評分: <?php echo htmlspecialchars($highest2['score_L']); ?></td>
                                    <td rowspan="2"class="large-font"><b><center><?php echo htmlspecialchars($highest2['total_record']); ?></center></b></td>
                                    <td rowspan="2"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest2['total_record'];
                                        if ($score == 3) {
                                            echo "必須做到髖、膝、踝保持一直線、腰椎無移動、棍子與欄架保持平行。";
                                        } elseif ($score == 2) {
                                            echo "髖、膝、踝未保持一直線、腰椎移動、棍子與欄架未保持平行，符合其中之一現象。";
                                        } elseif ($score == 1) {
                                            echo "腳與欄架發生接觸或未能保持平衡。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?></center>
                                    </td>
                                </tr>
                                <tr>
                                    <td>右腳評分: <?php echo htmlspecialchars($highest2['score_R']); ?></td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>跨欄</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>

                            <?php endif; ?>
                            
                            <!-- 弓箭步 -->

                            <?php if ($highest3): ?>
                                <tr>
                                    <td rowspan="5"class="large-font"><b><center>直線前蹲</center></b></td>
                                    <td>左腿評分:<?php echo htmlspecialchars($highest3['score_L']); ?></td>
                                    <td rowspan="5"class="large-font"><b><center><?php echo htmlspecialchars($highest3['total_record']); ?></center></b></td>
                                    <td rowspan="5"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest3['total_record'];
                                        if ($score == 3) {
                                            echo "長杆始終與各點保持接觸，同時長杆保持垂直；軀幹保持穩定，沒有側彎和前傾，雙腳保持朝前，後腿的膝蓋要落在前腳腳跟的正後方。";
                                        } elseif ($score == 2) {
                                            echo "長杆未能始終與各點接觸、長杆未能保持垂直、軀幹有明顯移動、雙腳沒有保持朝前或後腿膝蓋無法落在前腳腳跟的正後方。";
                                        } elseif ($score == 1) {
                                            echo "無法做出起始姿勢(步驟1~3)或無法完成動作。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?></center>
                                    </td>
                                </tr>
                                <tr>
                                    <td>右腿評分:<?php echo htmlspecialchars($highest3['score_R']); ?></td>
                                </tr>
                                <tr>
                                    <td>脛骨距離:<?php echo htmlspecialchars($highest3['tibial']); ?></td>
                                </tr>
                                <tr>
                                    <td>左腿的脛骨距離角度: <?php echo htmlspecialchars($highest3['L_distance']); ?> cm</td>
                                </tr>
                                <tr>
                                    <td>右腿的脛骨距離角度:<?php echo htmlspecialchars($highest3['R_distance']); ?> cm</td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>直線前蹲</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>
                            <?php endif; ?>


                            <!-- 肩部活動資料 -->
                            <?php if ($highest4): ?>
                                <tr>
                                    <td rowspan="4"class="large-font"><b><center>肩部活動</center></b></td>
                                    <td>左手評分: <?php echo htmlspecialchars($highest4['score_L']); ?></td>
                                    <td rowspan="4"class="large-font"><b><center><?php echo htmlspecialchars($highest4['total_record']); ?></center></b></td>
                                    <td rowspan="4"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest4['total_record'];
                                        if ($score == 3) {
                                            echo "雙拳之間的距離應小於一個手掌的長度。";
                                        } elseif ($score == 2) {
                                            echo "雙拳之間的距離小於一個半手掌的長度。";
                                        } elseif ($score == 1) {
                                            echo "雙拳之間的距離大於一個半手掌的長度。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?></center>
                                    </td>
                                </tr>
                                <tr>
                                    <td>右手評分: <?php echo htmlspecialchars($highest4['score_R']); ?></td>
                                </tr>
                                <tr>
                                    <td>左拳距離: <?php echo htmlspecialchars($highest4['L_distance']); ?> cm</td>
                                </tr>
                                <tr>
                                    <td>右拳距離: <?php echo htmlspecialchars($highest4['R_distance']); ?> cm</td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>肩部活動</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>
                            <?php endif; ?>

                            <?php if ($highest5): ?>
                                <tr>
                                    <td rowspan="4"class="large-font"><b><center>主動直膝抬腿</center></b></td>
                                    <td>左腿評分:<?php echo htmlspecialchars($highest5['score_L']); ?></td>
                                    <td rowspan="4"class="large-font"><b><center><?php echo htmlspecialchars($highest5['total_record']); ?></center></b></td>
                                    <td rowspan="4"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest5['total_record'];
                                        if ($score == 3) {
                                            echo "上腿腳踝的垂直線應落在大腿中點和髂前上棘之間，而下腿維持在起始姿勢上。";
                                        } elseif ($score == 2) {
                                            echo "上腿腳踝的垂直線落在大腿中點和髕骨中點之間，同時下腿維持在起始姿勢上。";
                                        } elseif ($score == 1) {
                                            echo "上腿腳踝的垂直線落在髕骨中點以下，同時下腿維持在起始姿勢上。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?></center>
                                    </td>
                                </tr>
                                <tr>
                                    <td>右腿評分:<?php echo htmlspecialchars($highest5['score_R']); ?></td>
                                </tr>
                                <tr>
                                    <td>抬左腿最後成功角度: <?php echo htmlspecialchars($highest5['L_distance']); ?>度</td>
                                </tr>
                                <tr>
                                    <td>抬右腿最後成功角度:<?php echo htmlspecialchars($highest5['R_distance']); ?>度</td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>主動直膝抬腿</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>
                            <?php endif; ?>


                            <?php if ($highest6): ?>
                                <tr>
                                    <td rowspan="1" class="large-font"><b><center>軀幹穩定伏地挺身</center></b></td>
                                    <td><b>單一評分: <?php echo htmlspecialchars($highest6['total_record']); ?></b></td>
                                    <td rowspan="1"class="large-font"><b><center><?php echo htmlspecialchars($highest6['total_record']); ?></center></b></td>
                                    <td rowspan="1"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest6['total_record'];
                                        if ($score == 3) {
                                            echo "能在拇指與額頭平齊的位置，同時脊柱沒有彎曲的情況下撐起。";
                                        } elseif ($score == 2) {
                                            echo "能在拇指與鎖骨平齊的位置，同時脊柱沒有彎曲的情況下撐起。";
                                        } elseif ($score == 1) {
                                            echo "腳跟有墊高且蹲不下去。";
                                        }elseif ($score == 0) {
                                            echo "無法在拇指與鎖骨平齊的位置撐起。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>軀幹穩定伏地挺身</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>
                            <?php endif; ?>

                            <?php if ($highest7): ?>
                                <tr>
                                    <td rowspan="2"class="large-font"><b><center>旋轉穩定性</center></b></td>
                                    <td>左邊評分: <?php echo htmlspecialchars($highest7['score_L']); ?></td>
                                    <td rowspan="2"class="large-font"><b><center><?php echo htmlspecialchars($highest7['total_record']); ?></center></b></td>
                                    <td rowspan="2"><center>
                                        <?php
                                        // 評分回饋邏輯
                                        $score = $highest7['total_record'];
                                        if ($score == 3) {
                                            echo "手和膝同時離開地面，肘和膝成一條線並平行於測試板，手指觸碰到腳踝，膝關節和肘關節可以完全伸展。";
                                        } elseif ($score == 2) {
                                            echo "能夠完成一次，但不滿足3分的要求。";
                                        } elseif ($score == 1) {
                                            echo "一次都無法完成或是無法做出起始姿勢。";
                                        }elseif ($score == 0) {
                                            echo "在執行過程中感到疼痛。";
                                        } else {
                                            echo "尚未評分";
                                        }
                                        ?></center>
                                    </td>
                                </tr>
                                <tr>
                                    <td>右邊評分: <?php echo htmlspecialchars($highest7['score_R']); ?></td>
                                </tr>
                                <?php else: ?>
                                <tr>
                                    <td class="large-font"><b><center>旋轉穩定性</center></b></td>
                                    <td colspan="3"><center>當日無資料</center></td>
                                </tr>

                            <?php endif; ?>
                            <?php
                            // 初始化總分變數
                            $total_sum = 0;

                            // 設置查詢的陣列
                            $record_tables = ['recordfms1', 'recordfms2', 'recordfms3', 'recordfms4', 'recordfms5', 'recordfms6', 'recordfms7'];

                            // 遍歷每個表並計算加總
                            foreach ($record_tables as $table) {
                                // 查詢當天最高的 total_record
                                $sql = "SELECT MAX(total_record) AS max_record FROM $table WHERE user_id = ? AND date = ?";
                                $stmt = $conn->prepare($sql);
                                $stmt->bind_param("is", $user_id, $selected_date);
                                $stmt->execute();
                                $result = $stmt->get_result();

                                // 累加最高分
                                if ($row = $result->fetch_assoc()) {
                                    $max_record = (int)$row['max_record'];
                                    $total_sum += $max_record;
                                }
                            }
                            ?>

                            <!-- 顯示加總結果 -->
                            <tr>
                                <td colspan="4" class="large-font"><center>當日總分: <b><?php echo htmlspecialchars($total_sum); ?></b></center></td>
                            </tr>
                            <tr>
                                <td colspan="4" class="large-font"><center>總分≦14的受試者基本動作質量有明顯不足，可能預示著運動損傷的風險</center></td>
                            </tr>

                        </tbody>
                    </table>
                </div>


                </div>
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