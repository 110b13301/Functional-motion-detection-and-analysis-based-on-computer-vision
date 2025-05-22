<?php
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("資料庫連線失敗: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$current_password = $data['current_password'];

// 從資料庫中查詢該使用者的密碼
$sql = "SELECT password FROM topic_users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

$response = [];
if (password_verify($current_password, $user['password'])) {
    $response['success'] = true;
} else {
    $response['success'] = false;
}

echo json_encode($response);
?>
