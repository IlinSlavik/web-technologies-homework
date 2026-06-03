<?php
$pageTitle = "Мой первый PHP-сайт";
$heading1 = "Добро пожаловать на главную страницу!";
$currentYear = date("Y"); 

$siteName = "Мой сайт";
$author = "Вячеслав";
$description = "Этот сайт создан с использованием PHP";

require_once 'time_function.php';
$formattedTime = formatCurrentTime();

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .info-block {
            background: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .time-block {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
        }
        footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><?php echo $heading1; ?></h1>
        
        <div class="info-block">
            <p><strong>Название сайта:</strong> <?php echo $siteName; ?></p>
            <p><strong>Автор:</strong> <?php echo $author; ?></p>
            <p><strong>Описание:</strong> <?php echo $description; ?></p>
        </div>
        
        <div class="time-block">
            <h3>📅 Текущая дата и время</h3>
            <p><strong>Дата:</strong> <?php echo date("d.m.Y"); ?></p>
            <p><strong>Время с правильными склонениями:</strong> <?php echo $formattedTime; ?></p>
            <p><strong>Год:</strong> <?php echo $currentYear; ?></p>
        </div>
        
        <footer>
            <p>&copy; <?php echo $currentYear; ?> <?php echo $siteName; ?>. Все права защищены.</p>
        </footer>
    </div>
</body>
</html>