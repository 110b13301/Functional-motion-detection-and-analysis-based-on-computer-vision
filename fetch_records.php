<?php
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

// 建立連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}

// 取得日期參數
$date = $_GET['date'];

// SQL 查詢語句
$sql = "SELECT * FROM records WHERE record_date = '$date' ORDER BY record_date DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<table class='table'>";
    echo "<tr><th>ID</th><th>運動ID</th><th>總記錄</th><th>左邊分數</th><th>右邊分數</th><th>左距離</th><th>右距離</th><th>日期</th></tr>";
    // 輸出數據
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>".$row["id"]."</td>";
        echo "<td>".$row["sport_id"]."</td>";
        echo "<td>".$row["total_record"]."</td>";
        echo "<td>".$row["score_L"]."</td>";
        echo "<td>".$row["score_R"]."</td>";
        echo "<td>".$row["L_distance"]."</td>";
        echo "<td>".$row["R_distance"]."</td>";
        echo "<td>".$row["record_date"]."</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "沒有資料";
}

// 關閉資料庫連接
$conn->close();
?>
