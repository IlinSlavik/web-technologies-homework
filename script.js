document.getElementById('image').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'Файл не выбран';
    document.getElementById('fileName').textContent = fileName;
});

document.querySelector('form').addEventListener('submit', function(e) {
    const fileInput = document.getElementById('image');
    if (fileInput.files.length === 0) {
        e.preventDefault();
        alert('Пожалуйста, выберите файл для загрузки');
    }
});