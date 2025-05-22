<?php
session_start();
session_unset(); // 清除所有 session 變量
session_destroy(); // 銷毀 session
setcookie("isLoggedIn", "", time() - 3600, "/"); // 移除 cookie
header("Location: login.html"); // 重定向到登入頁面
exit();
?>
