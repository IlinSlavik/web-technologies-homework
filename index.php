<?php
echo "<b>=== Задание 1: Цикл do...while для вывода чисел от 0 до 10 ===</b><br><br>";

function printNumbersWithType() {
    $i = 0;
    do {
        if ($i == 0) {
            echo "$i – это ноль.<br>";
        } elseif ($i % 2 == 0) {
            echo "$i – чётное число.<br>";
        } else {
            echo "$i – нечётное число.<br>";
        }
        $i++;
    } while ($i <= 10);
}

printNumbersWithType();

echo "<br><b>=== Задание 2: Массив областей и городов ===</b><br><br>";

$regions = [
    'Московская область' => ['Москва', 'Зеленоград', 'Клин', 'Подольск', 'Сергиев Посад'],
    'Ленинградская область' => ['Санкт-Петербург', 'Всеволожск', 'Павловск', 'Кронштадт', 'Гатчина'],
    'Рязанская область' => ['Рязань', 'Касимов', 'Скопин', 'Сасово', 'Ряжск'],
    'Нижегородская область' => ['Нижний Новгород', 'Арзамас', 'Дзержинск', 'Бор', 'Кстово'],
    'Свердловская область' => ['Екатеринбург', 'Нижний Тагил', 'Каменск-Уральский', 'Первоуральск']
];

foreach ($regions as $region => $cities) {
    echo "<b>$region:</b><br>";
    echo implode(', ', $cities) . ".<br><br>";
}

echo "<br><b>=== Задание 3: Транслитерация строк ===</b><br><br>";

$translitTable = [
    'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd',
    'е' => 'e', 'ё' => 'yo', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
    'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n',
    'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
    'у' => 'u', 'ф' => 'f', 'х' => 'kh', 'ц' => 'ts', 'ч' => 'ch',
    'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
    'э' => 'e', 'ю' => 'yu', 'я' => 'ya',

    'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D',
    'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh', 'З' => 'Z', 'И' => 'I',
    'Й' => 'Y', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N',
    'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
    'У' => 'U', 'Ф' => 'F', 'Х' => 'Kh', 'Ц' => 'Ts', 'Ч' => 'Ch',
    'Ш' => 'Sh', 'Щ' => 'Sch', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '',
    'Э' => 'E', 'Ю' => 'Yu', 'Я' => 'Ya'
];

function transliterate($string, $table) {
    $result = '';
    $length = mb_strlen($string, 'UTF-8');
    
    for ($i = 0; $i < $length; $i++) {
        $char = mb_substr($string, $i, 1, 'UTF-8');
        if (isset($table[$char])) {
            $result .= $table[$char];
        } else {
            $result .= $char;
        }
    }
    
    return $result;
}

$testStrings = [
    'Привет мир!',
    'Кошка и собака',
    'Я люблю PHP'
];

foreach ($testStrings as $test) {
    echo "Исходная строка: $test<br>";
    echo "Транслитерация: " . transliterate($test, $translitTable) . "<br><br>";
}

echo "<br><b>=== Задание 4: Динамическое меню с вложенными подменю ===</b><br><br>";

$menuItems = ['Главная', 'О нас', 'Услуги', 'Новости', 'Контакты'];

echo "<ul>";
foreach ($menuItems as $item) {
    echo "<li><a href='#'>$item</a></li>";
}
echo "</ul>";
?>


<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #333;
        overflow: hidden;
        display: inline-block;
    }
    li {
        float: left;
    }
    li a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }
    li a:hover {
        background: #111;
    }
</style>