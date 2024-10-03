document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();

    // 處理表單提交
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const selectedGenres = Array.from(document.querySelectorAll('.genre-tag.selected')).map(tag => tag.textContent);
        const selectedRelationship = document.querySelector('.relationship-tag.selected').dataset.value;
        
        // 獲取頭像數據
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarData = avatarPreview.src;

        // 創建用戶數據對象
        const userData = {
            nickname: formData.get('nickname'),
            avatar: avatarData,
            genres: selectedGenres,
            relationship: selectedRelationship
        };

        // 將數據保存到 localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log('提交的資料:', userData);
        alert('個人資料已更新！');
        // 返回電影瀏覽頁面
        window.location.href = 'index.html';
    });

    // 處理大頭照預覽
    document.getElementById('avatar').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('avatarPreview');
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // 處理關係類型選擇
    document.querySelectorAll('.relationship-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.relationship-tag').forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});

function loadProfileData() {
    // 從 localStorage 加載用戶數據
    const savedUserData = localStorage.getItem('userData');
    const userData = savedUserData ? JSON.parse(savedUserData) : {
        nickname: '',
        avatar: '',
        genres: [],
        relationship: ''
    };

    document.getElementById('nickname').value = userData.nickname;

    // 加載電影類型
    const genresList = ['動作', '喜劇', '科幻', '恐怖', '劇情', '動畫', '冒險', '奇幻'];
    const genresContainer = document.getElementById('movieGenres');
    genresContainer.innerHTML = '';
    genresList.forEach(genre => {
        const tag = document.createElement('span');
        tag.className = 'genre-tag' + (userData.genres.includes(genre) ? ' selected' : '');
        tag.textContent = genre;
        tag.onclick = function() {
            this.classList.toggle('selected');
        };
        genresContainer.appendChild(tag);
    });

    // 顯示當前頭像（如果有的話）
    const avatarPreview = document.getElementById('avatarPreview');
    if (userData.avatar) {
        avatarPreview.src = userData.avatar;
        avatarPreview.style.display = 'block';
    }

    // 設置關係類型
    if (userData.relationship) {
        document.querySelector(`.relationship-tag[data-value="${userData.relationship}"]`).classList.add('selected');
    }
}