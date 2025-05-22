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

date_default_timezone_set('Asia/Taipei'); // 設定時區

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "資料庫連結失敗: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$sport_id = $data['sport_ID'];
$user_id = $_SESSION['user_id'];
$total_record = $data['total_record'];
$date = date('Y-m-d'); // 當前日期
$time = date('H:i:s'); // 當前時間

$sql = "INSERT INTO recordfms6 (sport_id, user_id, total_record, date, time) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare 錯誤: " . $conn->error]);
    exit;
}

// 正確的參數綁定
$stmt->bind_param("sisss", $sport_id, $user_id, $total_record, $date, $time);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "資料已儲存"]);
} else {
    echo json_encode(["status" => "error", "message" => "資料儲存失敗: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
