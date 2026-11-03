<?php
require_once __DIR__ . '/config/session.php';
start_app_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: student_portal%20login.html');
    exit;
}

$usernameInput = $_POST['indexNumber'] ?? '';
$passwordInput = $_POST['password'] ?? '';
$username = is_string($usernameInput) ? trim($usernameInput) : '';
$password = is_string($passwordInput) ? $passwordInput : '';

if ($username === '' || $password === '') {
    header('Location: student_portal%20login.html?error=invalid');
    exit;
}

require_once __DIR__ . '/config/database.php';

$statement = $pdo->prepare(
    "SELECT u.username, u.password, s.student_id
     FROM users AS u
     INNER JOIN students AS s ON s.student_id = u.username
     WHERE u.username = :username
       AND u.role = 'student'
       AND s.status = 'Active'
     LIMIT 1"
);
$statement->execute(['username' => $username]);
$account = $statement->fetch();

if (!$account || !password_verify($password, $account['password'])) {
    header('Location: student_portal%20login.html?error=invalid');
    exit;
}

session_regenerate_id(true);
$_SESSION['role'] = 'student';
$_SESSION['student_id'] = $account['student_id'];

header('Location: student_dashboard.php');
exit;
