<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "未登入"]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

// 設定正確的時區
date_default_timezone_set('Asia/Taipei'); // 設定為台北時間

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "資料庫連結失敗: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$sport_id = $data['sport_ID'];
$user_id = $_SESSION['user_id'];
$total_record = $data['total_record'];
$knee_score = $data['knee_score'];
$bottom_score = $data['bottom_score'];

// 使用 PHP 取得當前的日期和時間
$date = date('Y-m-d'); // 日期格式
$time = date('H:i:s'); // 時間格式

// SQL 插入語句
$sql = "INSERT INTO recordfms1 (sport_id, user_id, total_record, knee_score, bottom_score, date, time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

// 檢查 prepare 是否成功
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare 錯誤: " . $conn->error]);
    exit;
}

// 檢查資料類型是否正確
$stmt->bind_param("siiddss", $sport_id, $user_id, $total_record, $knee_score, $bottom_score, $date, $time);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "資料已儲存"]);
} else {
    echo json_encode(["status" => "error", "message" => "資料儲存失敗: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
