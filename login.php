<?php
session_start();

// 顯示所有錯誤信息（開發過程中使用，正式上線時可關閉）
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 資料庫連接設置
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

// 建立資料庫連接
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "資料庫連結失敗: " . $conn->connect_error]));
}

// 檢查請求方法
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['user_name'];
    $password = $_POST['user_password'];

    $sql = "SELECT id, username, password FROM topic_users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $username, $hashed_password);
        $stmt->fetch();

        // 檢查密碼是否正確
        if (password_verify($password, $hashed_password)) {
            $_SESSION['user_id'] = $user_id; // 儲存使用者 ID 到 session
            setcookie("isLoggedIn", "true", time() + (86400 * 1), "/"); // 設置 cookie
            // 傳遞使用者名稱到 index.html
            echo json_encode(["status" => "success", "username" => $username]);
        } else {
            echo json_encode(["status" => "error", "message" => "帳號密碼錯誤"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "信箱未註冊"]);
    }

    $stmt->close();
}

$conn->close();
?>
