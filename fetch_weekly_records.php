<?php
$servername = "localhost";
$username = "root";
$password = "92mysqlcindy";
$dbname = "topictest";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$start_date = $_POST['start_date'];
$end_date = $_POST['end_date'];

// 查詢每一天的最高總分
$sql = "SELECT DATE(record_time) as date, MAX(total_record) as max_score FROM record 
        WHERE DATE(record_time) BETWEEN '$start_date' AND '$end_date'
        GROUP BY DATE(record_time)";

$result = $conn->query($sql);

$records = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
}

echo json_encode($records);
$conn->close();
?>
