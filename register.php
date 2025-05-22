<?php
//資料庫連結，每個人不同
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "資料庫連線失敗"]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $height = $_POST['height'];
    $gender = $_POST['gender'];

    if (!preg_match("/^[a-zA-Z0-9._%+-]+@(gmail\.com|mailst\.cjcu\.edu\.tw)$/", $email)) {
        echo json_encode(["status" => "error", "message" => "請使用有效的 Google 信箱或學校信箱進行註冊。"]);
        exit;
    }

    // 檢查信箱是否已經註冊
    $sql_check_email = "SELECT id FROM topic_users WHERE email = ?";
    $stmt = $conn->prepare($sql_check_email);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "此信箱已經被註冊。"]);
        exit;
    }
    // // 檢查用戶名和密碼的長度(未來再加入)
    // if (strlen($username) < 3 || strlen($username) > 20) {
    //     echo json_encode(["status" => "error", "message" => "用戶名長度應該在3到20個字符之間。"]);
    //     exit;
    // }
    // if (strlen($password) < 8) {
    //     echo json_encode(["status" => "error", "message" => "密碼長度至少8個字符。"]);
    //     exit;
    // }

    if ($password !== $confirm_password) {
        echo json_encode(["status" => "error", "message" => "密碼與確認密碼不一致。"]);
        exit;
    }

    // 雜湊密碼
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $sql_insert = "INSERT INTO topic_users (username, email, password, height, gender)
                   VALUES (?, ?, ?, ?, ?)";// 插入資料到資料庫
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("sssss", $username, $email, $hashed_password, $height, $gender);

    if ($stmt_insert->execute()) {
        echo json_encode(["status" => "success", "message" => "註冊成功"]);
    } else {
        echo json_encode(["status" => "error", "message" => "註冊失敗，請稍後再試。"]);
    }

    $stmt->close();
    $stmt_insert->close();
}

$conn->close();
?>
