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

// 建立資料庫連線
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "資料庫連結失敗: " . $conn->connect_error]);
    exit;
}

// 接收 JSON 資料
$data = json_decode(file_get_contents("php://input"), true);

$sport_id = $data['sport_ID'];
$user_id = $_SESSION['user_id'];
$total_record = (int) $data['total_score'];
$score_L = (float) $data['left_score'];
$score_R = (float) $data['right_score'];
$date = $data['date'];
$time = $data['time'];

$sql = "INSERT INTO recordfms2(sport_id, user_id, total_record, score_L, score_R, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "SQL prepare 錯誤: " . $conn->error]);
    exit;
}

$stmt->bind_param("siidsss", $sport_id, $user_id, $total_record, $score_L, $score_R, $date, $time);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "資料已儲存"]);
} else {
    echo json_encode(["status" => "error", "message" => "資料儲存失敗: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
