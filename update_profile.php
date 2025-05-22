<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("資料庫連線失敗: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];
$email = $_POST['email'];
$gender = $_POST['gender'];
$birth_year = $_POST['birth_year'];
$height = $_POST['height'];
$weight = $_POST['weight'];
$dominant_hand = $_POST['dominant_hand'];
$distance_to_tibial_tuberosity = $_POST['distance_to_tibial_tuberosity'];

// 更新使用者資料
$sql = "UPDATE topic_users SET email = ?, gender = ?, birth_year = ?, height = ?, weight = ?, dominant_hand = ?, distance_to_tibial_tuberosity = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssdsdsi", $email, $gender, $birth_year, $height, $weight, $dominant_hand, $distance_to_tibial_tuberosity, $user_id);

if ($stmt->execute()) {
    // 檢查是否有新密碼
    if (isset($_POST['new_password']) && !empty($_POST['new_password'])) {
        $new_password = $_POST['new_password'];
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

        // 更新密碼
        $sql = "UPDATE topic_users SET password = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $hashed_password, $user_id);

        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
            exit;
        }
    }
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
