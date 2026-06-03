<?php
// 1. Объявление переменных $a и $b
$a = 10;
$b = -5;  

echo "<b>=== Задание 1 ===</b><br>";
echo "a = $a, b = $b<br>";

if ($a >= 0 && $b >= 0) {
    $result = $a - $b;
    echo "Оба числа положительные <br>";
    echo "Разность \$a - \$b = $result<br>";
} elseif ($a < 0 && $b < 0) {
    $result = $a * $b;
    echo "Оба числа отрицательные<br>";
    echo "Произведение \$a * \$b = $result<br>";
} else {
    $result = $a + $b;
    echo "Числа разных знаков<br>";
    echo "Сумма \$a + \$b = $result<br>";
}

echo "<br><b>=== Задание 2 ===</b><br>";
// 2. Присвоить переменной $а значение в промежутке [0..15]
$a = rand(0, 15);
echo "Случайное значение \$a = $a<br>";
echo "Вывод чисел от \$a до 15:<br>";

switch (true) {
    case ($a <= 15 && $a >= 0):
        for ($i = $a; $i <= 15; $i++) {
            echo $i . " ";
        }
        break;
    default:
        echo "Значение \$a выходит за пределы диапазона [0..15]";
}
echo "<br>";

echo "<br><b>=== Задание 3 ===</b><br>";
// 3. Арифметические операции в виде функций
function add($x, $y) {
    return $x + $y;
}

function subtract($x, $y) {
    return $x - $y;
}

function multiply($x, $y) {
    return $x * $y;
}

function divide($x, $y) {
    if ($y == 0) {
        return "Ошибка: деление на ноль!";
    }
    return $x / $y;
}

$num1 = 20;
$num2 = 5;
echo "Число 1: $num1, Число 2: $num2<br>";
echo "Сложение: " . add($num1, $num2) . "<br>";
echo "Вычитание: " . subtract($num1, $num2) . "<br>";
echo "Умножение: " . multiply($num1, $num2) . "<br>";
echo "Деление: " . divide($num1, $num2) . "<br>";

echo "<br><b>=== Задание 4 ===</b><br>";
// 4. Функция mathOperation
function mathOperation($arg1, $arg2, $operation) {
    switch ($operation) {
        case 'сложение':
        case 'add':
        case '+':
            return add($arg1, $arg2);
        case 'вычитание':
        case 'subtract':
        case '-':
            return subtract($arg1, $arg2);
        case 'умножение':
        case 'multiply':
        case '*':
            return multiply($arg1, $arg2);
        case 'деление':
        case 'divide':
        case '/':
            return divide($arg1, $arg2);
        default:
            return "Ошибка: неизвестная операция '$operation'";
    }
}

$x = 15;
$y = 3;
echo "Результаты вычислений для \$x = $x, \$y = $y:<br>";
echo "Сложение: " . mathOperation($x, $y, 'сложение') . "<br>";
echo "Вычитание: " . mathOperation($x, $y, 'вычитание') . "<br>";
echo "Умножение: " . mathOperation($x, $y, 'умножение') . "<br>";
echo "Деление: " . mathOperation($x, $y, 'деление') . "<br>";

echo "<br><b>Дополнительные примеры:</b><br>";
echo "15 + 7 = " . mathOperation(15, 7, '+') . "<br>";
echo "20 - 8 = " . mathOperation(20, 8, '-') . "<br>";
echo "6 * 4 = " . mathOperation(6, 4, '*') . "<br>";
echo "30 / 5 = " . mathOperation(30, 5, '/') . "<br>";
echo "10 / 0 = " . mathOperation(10, 0, '/') . "<br>";
echo "Неизвестная операция: " . mathOperation(5, 3, '%') . "<br>";
?>