// 移除或注釋掉 simulateLogin 函數

// 修改 initializeLiff 函數
function initializeLiff() {
    if (!liff) {
        console.error('LIFF SDK not loaded');
        return;
    }
    liff.init({ liffId: "2006312514-vmWgWw4w" }) // 替換為您的 LIFF ID
        .then(() => {
            if (!liff.isLoggedIn()) {
                document.getElementById('liffLoginButton').style.display = 'block';
            } else {
                checkUserProfile();
            }
        })
        .catch((err) => {
            console.error('LIFF初始化失敗', err);
        });
}

// 修改 liffLogin 函數
function liffLogin() {
    if (!liff.isLoggedIn()) {
        liff.login();
    }
}

// 修改 checkUserProfile 函數
function checkUserProfile() {
    liff.getProfile()
        .then(profile => {
            let userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                // 如果沒有用戶資料，跳轉到資料填寫頁面
                window.location.href = 'profile.html';
            } else {
                // 如果有用戶資料，顯示電影瀏覽頁面
                document.getElementById('login').style.display = 'none';
                document.getElementById('movieSwipe').style.display = 'flex';
                loadMovieList();
            }
        })
        .catch((err) => {
            console.error('獲取用戶資料失敗', err);
        });
}

// 確保在文檔加載完成後初始化 LIFF
document.addEventListener('DOMContentLoaded', initializeLiff);

// 修改登錄按鈕事件監聽器
document.getElementById('liffLoginButton').addEventListener('click', liffLogin);

// 在文件加載完成後自動調用simulateLogin
document.addEventListener('DOMContentLoaded', simulateLogin);

// LINE登入
function liffLogin() {
    if (!liff.isLoggedIn()) {
        liff.login();
    }
}

// 加載用戶資料
function loadUserProfile() {
    liff.getProfile()
        .then(profile => {
            const userProfileElement = document.getElementById('userProfile');
            userProfileElement.innerHTML = `
                <h2>歡迎, ${profile.displayName}!</h2>
                <img src="${profile.pictureUrl}" alt="個人頭像" width="100">
            `;
            document.getElementById('userPreferences').style.display = 'block';
        })
        .catch((err) => {
            console.error('獲取用戶資料失敗', err);
        });
}

// TMDB API配置
const TMDB_API_KEY = '392f3431bc009e57f5dc58f12e4949ee';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

// 獲取正在上映的電影
async function getNowPlayingMovies() {
    try {
        const response = await fetch(`${TMDB_API_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=zh-TW&page=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('正在上映的電影:', data.results);
        return data.results;
    } catch (error) {
        console.error('獲取正在上映的電影失敗:', error);
        return [];
    }
}

// 獲取即將上映的電影
async function getUpcomingMovies() {
    try {
        const response = await fetch(`${TMDB_API_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=zh-TW&page=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('即將上映的電影:', data.results);
        return data.results;
    } catch (error) {
        console.error('獲取即將上映的電影失敗:', error);
        return [];
    }
}

let currentMovieIndex = 0;
let allMovies = [];

// 修改 loadMovieList 函數
async function loadMovieList() {
    try {
        const nowPlayingMovies = await getNowPlayingMovies();
        const upcomingMovies = await getUpcomingMovies();
        
        allMovies = [...nowPlayingMovies, ...upcomingMovies];
        console.log('所有電影:', allMovies);
        if (allMovies.length > 0) {
            displayMovieStack();
            setupSwipe();
        } else {
            console.error('沒有找到電影');
        }
    } catch (error) {
        console.error('加載電影列表失敗', error);
        throw error; // 重新拋出錯誤以便上層函數處理
    }
}

// 新增 displayMovieStack 函數
function displayMovieStack() {
    const movieCards = document.querySelectorAll('.movie-card');
    for (let i = 0; i < 3; i++) {
        if (currentMovieIndex + i < allMovies.length) {
            displayMovie(allMovies[currentMovieIndex + i], movieCards[i]);
        } else {
            movieCards[i].style.display = 'none';
        }
    }
}

// 修改 displayMovie 函數
function displayMovie(movie, cardElement) {
    console.log('顯示電影:', movie);
    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path_to_placeholder_image.jpg';
    cardElement.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h2 class="movie-title">${movie.title}</h2>
            <p class="movie-description">${movie.overview || '暫無簡介'}</p>
            <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span class="rating-value">${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
        </div>
    `;
    cardElement.style.display = 'block';
    
    // 添加點擊展開功能
    cardElement.addEventListener('click', function() {
        this.classList.toggle('expanded');
    });
}

// 切換想看清單
function toggleWatchlist(movieId) {
    // 這裡可以實現將電影添加到用戶的想看清單的邏輯
    alert(`電影ID ${movieId} 已添加您的想看清單！`);
}

// 發起約會請求
function createDateRequest(movieTitle) {
    // 這裡可以實現發送約會請求的邏輯
    alert(`您已發起觀看 ${movieTitle} 的約會請求！`);
}

// 保存用戶偏好
function saveUserPreferences(event) {
    event.preventDefault();
    const form = event.target;
    const preferences = {
        age: form.age.value,
        location: form.location.value,
        favoriteGenres: Array.from(form.favoriteGenres.selectedOptions).map(option => option.value),
        favoriteDirectors: form.favoriteDirectors.value.split(',').map(s => s.trim()),
        favoriteActors: form.favoriteActors.value.split(',').map(s => s.trim())
    };
    
    // 這裡可以將preferences保存到後端或本地存儲
    console.log('戶偏好:', preferences);
    alert('您的偏好已保存！');
    
    // 保存後顯示電影列表
    document.getElementById('userPreferences').style.display = 'none';
    document.getElementById('movieList').style.display = 'block';
    loadMovieList();
}

// 初始化LIFF
initializeLiff();

// 綁定登入按鈕事件
document.getElementById('liffLoginButton').addEventListener('click', liffLogin);

// 修改 setupSwipe 函數
function setupSwipe() {
    const movieCard = document.querySelector('.movie-card');
    const hammer = new Hammer(movieCard);

    let startX;
    let startY;
    let isDragging = false;

    hammer.on('panstart', function(e) {
        isDragging = true;
        startX = e.center.x;
        startY = e.center.y;
        movieCard.style.transition = 'none';
    });

    hammer.on('panmove', function(e) {
        if (!isDragging) return;
        const deltaX = e.center.x - startX;
        const deltaY = e.center.y - startY;
        const rotation = deltaX * 0.1; // 添加旋轉效果

        movieCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;

        // 根據滑動方向改變背景顏色
        if (deltaX > 0) {
            movieCard.style.boxShadow = '0 0 10px 5px rgba(52, 199, 89, 0.3)'; // 綠色陰影表示喜歡
        } else if (deltaX < 0) {
            movieCard.style.boxShadow = '0 0 10px 5px rgba(255, 59, 48, 0.3)'; // 紅色陰影示不喜歡
        } else {
            movieCard.style.boxShadow = '';
        }
    });

    hammer.on('panend', function(e) {
        isDragging = false;
        movieCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

        const deltaX = e.deltaX;
        const threshold = 100; // 滑動閾值

        if (deltaX > threshold) {
            console.log('Swiped right (like)');
            movieCard.style.transform = 'translateX(100%) rotate(10deg)';
            likeMovie(allMovies[currentMovieIndex].id); // 添加這行
            setTimeout(loadNextMovie, 300);
        } else if (deltaX < -threshold) {
            console.log('Swiped left (dislike)');
            movieCard.style.transform = 'translateX(-100%) rotate(-10deg)';
            setTimeout(loadNextMovie, 300);
        } else {
            // 如果滑動不夠遠，卡片回到原位
            movieCard.style.transform = 'translate(0, 0) rotate(0deg)';
            movieCard.style.boxShadow = '';
        }
    });

    // 保留點擊按鈕的功能
    document.querySelector('.dislike').addEventListener('click', function() {
        console.log('Clicked dislike');
        animateSwipe('left');
    });

    document.querySelector('.like').addEventListener('click', function() {
        console.log('Clicked like');
        animateSwipe('right');
    });
}

// 新增 animateSwipe 函數
function animateSwipe(direction) {
    const movieCard = document.querySelector('.movie-card');
    movieCard.style.transition = 'transform 0.3s ease';
    
    if (direction === 'left') {
        movieCard.style.transform = 'translateX(-100%) rotate(-10deg)';
    } else {
        movieCard.style.transform = 'translateX(100%) rotate(10deg)';
    }

    setTimeout(loadNextMovie, 300);
}

// 修改 loadNextMovie 函數
function loadNextMovie() {
    currentMovieIndex++;
    if (currentMovieIndex >= allMovies.length) {
        currentMovieIndex = 0; // 循環回到第一部電影
    }
    displayMovieStack();
    resetCardPosition();
    checkForMatches(); // 添加這行
}

// 修改 likeMovie 函數
function likeMovie(movieId) {
    let userData = JSON.parse(localStorage.getItem('userData')) || { likedMovies: [] };
    if (!userData.likedMovies.includes(movieId)) {
        userData.likedMovies.push(movieId);
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Liked movie:', movieId); // 添加日誌
        checkForMatches(); // 每次喜歡電影後立即檢查匹配
    }
}

// 修改 checkForMatches 函數
function checkForMatches() {
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    if (!currentUser || !currentUser.likedMovies) return;

    console.log('Checking for matches. User liked movies:', currentUser.likedMovies); // 添加日誌

    const matches = findMatches(currentUser);
    console.log('Found matches:', matches); // 添加日誌

    if (matches.length > 0) {
        alert(`您有新的匹配！點擊"匹配"圖標查看詳情。`);
        // 可以在這裡更新UI，例如在匹配圖標上添加一個通知標記
    }
}

// 修改 findMatches 函數
function findMatches(currentUser) {
    return simulatedUsers.filter(user => {
        const commonMovies = currentUser.likedMovies.filter(movieId => 
            user.likedMovies.includes(movieId)
        );
        console.log(`Comparing with ${user.name}. Common movies:`, commonMovies); // 添加日誌
        return commonMovies.length >= 2; // 至少有兩部共同喜歡的電影
    });
}

// 新增 resetCardPosition 函數
function resetCardPosition() {
    const movieCard = document.querySelector('.movie-card');
    movieCard.style.transition = 'none';
    movieCard.style.transform = 'translate(0, 0) rotate(0deg)';
    movieCard.style.boxShadow = '';
    // 強制重繪
    movieCard.offsetHeight;
    movieCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
}

// 確保這個函數在文檔加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 綁定導航功能
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.querySelector('i').className;
            document.querySelectorAll('.nav-item').forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            if (target.includes('fa-film')) {
                showMovieSwipe();
            } else if (target.includes('fa-user')) {
                showProfileSettings();
            } else if (target.includes('fa-users')) {
                window.location.href = 'matches.html'; // 添加這行
            }
            // 可以在這裡添加其他導航項的處理
        });
    });

    // 其他初始化代碼...
});

function showMovieSwipe() {
    document.getElementById('movieSwipe').style.display = 'flex';
    document.getElementById('profileSettings').style.display = 'none';
}

function showProfileSettings() {
    console.log('Showing profile settings'); // 添加日誌
    document.getElementById('movieSwipe').style.display = 'none';
    document.getElementById('profileSettings').style.display = 'block';
    loadProfileData();
}

function loadProfileData() {
    console.log('Loading profile data'); // 添加日誌
    // 這裡可以從後端或本地存儲加載用戶資料
    // 暫時使用模擬數據
    const userData = {
        nickname: '電影愛好者',
        avatar: '',
        genres: ['動作', '喜劇', '科幻'],
        bio: '我是一個熱愛電影的人！'
    };

    document.getElementById('nickname').value = userData.nickname;
    document.getElementById('bio').value = userData.bio;

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
    } else {
        avatarPreview.style.display = 'none';
    }
}

// 處理表單提交
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const selectedGenres = Array.from(document.querySelectorAll('.genre-tag.selected')).map(tag => tag.textContent);
    formData.append('genres', JSON.stringify(selectedGenres));

    // 這裡可以發送數據到後端
    console.log('提交的資料:', Object.fromEntries(formData));
    alert('個人資料已更新！');
    // 返回電影瀏覽頁面
    showMovieSwipe();
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

// 修改模擬用戶數據，使用實際的電影ID
const simulatedUsers = [
    { id: 1, name: "User1", likedMovies: [238, 240, 242, 244] }, // 使用實際的TMDB電影ID
    { id: 2, name: "User2", likedMovies: [240, 242, 244, 246] },
    { id: 3, name: "User3", likedMovies: [242, 244, 246, 248] },
];

// LINE 登錄函數
function liffLogin() {
    if (!liff.isLoggedIn()) {
        liff.login();
    }
}

// 檢查用戶資料
function checkUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        // 如果沒有用戶資料，跳轉到資料填寫頁面
        window.location.href = 'profile.html';
    } else {
        // 如果有用戶資料，顯示電影瀏覽頁面
        showMovieSwipe();
    }
}

// 修改登錄按鈕事件監聽器
document.getElementById('liffLoginButton').addEventListener('click', liffLogin);