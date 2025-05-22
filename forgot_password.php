<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:/AppServ/www/topic/theme/vendor/autoload.php';// 如果用 composer 安裝
require 'C:/AppServ/www/topic/theme/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'C:/AppServ/www/topic/theme/vendor/phpmailer/phpmailer/src/SMTP.php';
require 'C:/AppServ/www/topic/theme/vendor/phpmailer/phpmailer/src/Exception.php';


$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "資料庫連結失敗"]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // 隨機生成新密碼
    $new_password = bin2hex(random_bytes(2)); // 4 個隨機字元 (2 bytes = 4 hex digits)
    $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

    // 更新資料庫中的密碼
    $sql = "UPDATE topic_users SET password = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $hashed_password, $email);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // 使用 PHPMailer 發送郵件
            $mail = new PHPMailer(true);
            try {
                // 郵件伺服器設定
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com'; // 替換為您的 SMTP 主機
                $mail->SMTPAuth = true;
                $mail->Username = 'skes98055@gmail.com'; // 替換為您的 SMTP 使用者名
                $mail->Password = 'gvuk umro kbum waye'; // 替換為您的 SMTP 密碼
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // 或 PHPMailer::ENCRYPTION_SMTPS
                $mail->Port = 587; // 常用的 SMTP 端口，依您的伺服器設定而定
                $mail->CharSet = 'UTF-8';

                // 收件人與寄件人設定
                $mail->setFrom('skes98055@gmail.com', 'CVFMS管理員'); // 寄件人
                $mail->addAddress($email); // 收件人
                $mail->addReplyTo('skes98055@gmail.com', 'CVFMS管理員');

                // 郵件內容
                $mail->isHTML(true); // 設定郵件內容為 HTML 格式
                $mail->Subject = '您的新密碼';
                $mail->Body = "您好，<br><br>您的新密碼是：<strong>$new_password</strong><br><br>請使用此密碼登入並立即更改密碼以確保帳戶安全。<br><br>謝謝！";
                $mail->AltBody = "您好，您的新密碼是：$new_password。請使用此密碼登入並立即更改密碼以確保帳戶安全。謝謝！";

                $mail->send();
                echo json_encode(["success" => true, "message" => "新密碼已寄到您的電子郵件"]);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "error" => "郵件無法寄送，錯誤：{$mail->ErrorInfo}"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "電子郵件未註冊"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();

}
$conn->close();
?>
