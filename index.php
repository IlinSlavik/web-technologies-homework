<?php
$host = 'MySQL-8.0';
$dbname = 'menu_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}

function getMenuItems($pdo, $parent_id = NULL) {
    $sql = "SELECT * FROM menu_items WHERE parent_id " . ($parent_id === NULL ? "IS NULL" : "= :parent_id") . " ORDER BY sort_order";
    $stmt = $pdo->prepare($sql);
    
    if ($parent_id !== NULL) {
        $stmt->bindParam(':parent_id', $parent_id);
    }
    
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function renderMenu($pdo, $parent_id = NULL, $level = 0) {
    $items = getMenuItems($pdo, $parent_id);
    $html = '';
    
    if ($level === 0) {
        $html .= '<div class="menu-container" id="menuContainer">';
    }
    
    foreach ($items as $item) {
        $hasChildren = hasChildren($pdo, $item['id']);
        $itemId = 'menu-item-' . $item['id'];
        
        $html .= '<div class="menu-item" data-id="' . $item['id'] . '">';
        $html .= '<div class="menu-header ' . ($hasChildren ? 'has-children' : '') . '">';
        
        if ($hasChildren) {
            $html .= '<div class="toggle"></div>';
        } else {
            $html .= '<div class="toggle-placeholder"></div>';
        }
        
        $html .= '<span class="item-label">' . htmlspecialchars($item['label']) . '</span>';
        $html .= '</div>';
        
        if ($hasChildren) {
            $html .= '<div class="menu-content">';
            $html .= renderMenu($pdo, $item['id'], $level + 1);
            $html .= '</div>';
        }
        
        $html .= '</div>';
    }
    
    if ($level === 0) {
        $html .= '</div>';
    }
    
    return $html;
}

function hasChildren($pdo, $parent_id) {
    $sql = "SELECT COUNT(*) FROM menu_items WHERE parent_id = :parent_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':parent_id', $parent_id);
    $stmt->execute();
    return $stmt->fetchColumn() > 0;
}

$menuHTML = renderMenu($pdo);
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Каталог товаров - Древовидное меню</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php echo $menuHTML; ?>
    <script src="script.js"></script>
</body>
</html>