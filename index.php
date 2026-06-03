<?php
$galleryDir = 'gallery';
$thumbDir = 'gallery/thumbs';

if (!file_exists($galleryDir)) {
    mkdir($galleryDir, 0777, true);
}
if (!file_exists($thumbDir)) {
    mkdir($thumbDir, 0777, true);
}

function createThumbnail($sourcePath, $targetPath, $thumbWidth = 200) {
    list($width, $height, $type) = getimagesize($sourcePath);
    $thumbHeight = ($height / $width) * $thumbWidth;
    $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
    
    switch ($type) {
        case IMAGETYPE_JPEG:
            $source = imagecreatefromjpeg($sourcePath);
            imagecopyresampled($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $width, $height);
            imagejpeg($thumb, $targetPath, 80);
            break;
        case IMAGETYPE_PNG:
            $source = imagecreatefrompng($sourcePath);
            imagecopyresampled($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $width, $height);
            imagepng($thumb, $targetPath, 8);
            break;
        case IMAGETYPE_GIF:
            $source = imagecreatefromgif($sourcePath);
            imagecopyresampled($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $width, $height);
            imagegif($thumb, $targetPath);
            break;
        default:
            return false;
    }
    
    imagedestroy($source);
    imagedestroy($thumb);
    return true;
}

function buildGallery($galleryDir, $thumbDir) {
    $files = scandir($galleryDir);
    $images = [];
    
    foreach ($files as $file) {
        $filePath = $galleryDir . '/' . $file;
        if (is_file($filePath)) {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                $images[] = $file;
            }
        }
    }
    
    if (count($images) > 0) {
        echo "<div class='gallery'>";
        foreach ($images as $image) {
            $thumbPath = $thumbDir . '/' . $image;
            $fullPath = $galleryDir . '/' . $image;
            
            if (!file_exists($thumbPath)) {
                createThumbnail($fullPath, $thumbPath);
            }
            
            echo "<div class='gallery-item'>";
            echo "<a href='$fullPath' target='_blank'>";
            echo "<img src='$thumbPath' alt='$image' class='thumbnail'>";
            echo "</a>";
            echo "</div>";
        }
        echo "</div>";
    } else {
        echo "<div class='empty'><p>📷 В галерее пока нет изображений.<br>Загрузите первое изображение!</p></div>";
    }
}

$uploadMessage = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $fileName = basename($file['name']);
    $fileTmp = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    
    if ($fileError === UPLOAD_ERR_OK) {
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (in_array($extension, $allowedExtensions)) {
            $maxFileSize = 5 * 1024 * 1024;
            if ($fileSize <= $maxFileSize) {
                $newFileName = time() . '_' . uniqid() . '.' . $extension;
                $destination = $galleryDir . '/' . $newFileName;
                
                if (move_uploaded_file($fileTmp, $destination)) {
                    $thumbDestination = $thumbDir . '/' . $newFileName;
                    if (createThumbnail($destination, $thumbDestination)) {
                        $uploadMessage = "<div class='success'>✅ Файл успешно загружен!</div>";
                        header("Refresh:0");
                        exit();
                    } else {
                        $uploadMessage = "<div class='error'>❌ Ошибка при создании миниатюры</div>";
                    }
                } else {
                    $uploadMessage = "<div class='error'>❌ Ошибка при перемещении файла</div>";
                }
            } else {
                $uploadMessage = "<div class='error'>❌ Файл слишком большой. Максимальный размер 5MB</div>";
            }
        } else {
            $uploadMessage = "<div class='error'>❌ Разрешены только изображения (JPG, PNG, GIF)</div>";
        }
    } else {
        $uploadMessage = "<div class='error'>❌ Ошибка при загрузке файла</div>";
    }
}

$files = scandir($galleryDir);
$imageCount = 0;
foreach ($files as $file) {
    if (is_file($galleryDir . '/' . $file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
            $imageCount++;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Фотогалерея</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📸 Фотогалерея</h1>
        
        <!-- Форма загрузки изображения -->
        <div class="upload-form">
            <h2>📤 Загрузить новое изображение</h2>
            <?php echo $uploadMessage; ?>
            <form method="POST" enctype="multipart/form-data">
                <div class="file-input">
                    <label for="image">📁 Выберите файл</label>
                    <input type="file" name="image" id="image" accept="image/jpeg, image/png, image/gif" required>
                    <span class="file-name" id="fileName">Файл не выбран</span>
                </div>
                <button type="submit" class="submit-btn">📤 Загрузить</button>
            </form>
            <div class="info-text">
                <small>✅ Разрешены файлы: JPG, PNG, GIF | 📦 Максимальный размер: 5MB</small>
            </div>
        </div>
        
        <h2>🖼️ Галерея изображений</h2>
        <?php buildGallery($galleryDir, $thumbDir); ?>
        
        <div class="stats">
            📊 Всего изображений: <?php echo $imageCount; ?>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>