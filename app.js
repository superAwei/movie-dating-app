// 初始化LIFF
function initializeLiff() {
    if (!liff) {
        console.error('LIFF SDK not loaded');
        return;
    }
    liff.init({ liffId: "2006312514-vmWgWw4w" })
        .then(() => {
            if (!liff.isLoggedIn()) {
                document.getElementById('liffLoginButton').style.display = 'block';
            } else {
                document.getElementById('login').style.display = 'none';
                document.getElementById('movieList').style.display = 'block';
                document.getElementById('userProfile').style.display = 'block';
                loadUserProfile();
                loadMovieList(); // 使用新的loadMovieList函數
            }
        })
        .catch((err) => {
            console.error('LIFF初始化失敗', err);
        });
}

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
    const response = await fetch(`${TMDB_API_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=zh-TW&page=1`);
    const data = await response.json();
    return data.results;
}

// 獲取即將上映的電影
async function getUpcomingMovies() {
    const response = await fetch(`${TMDB_API_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=zh-TW&page=1`);
    const data = await response.json();
    return data.results;
}

// 加載電影列表
async function loadMovieList() {
    try {
        const nowPlayingMovies = await getNowPlayingMovies();
        const upcomingMovies = await getUpcomingMovies();
        
        const movieListElement = document.getElementById('movieList');
        movieListElement.innerHTML = '<h2>正在上映的電影</h2>';
        
        nowPlayingMovies.forEach(movie => {
            movieListElement.innerHTML += createMovieCard(movie);
        });
        
        movieListElement.innerHTML += '<h2>即將上映的電影</h2>';
        
        upcomingMovies.forEach(movie => {
            movieListElement.innerHTML += createMovieCard(movie);
        });
    } catch (error) {
        console.error('加載電影列表失敗', error);
    }
}

// 創建電影卡片HTML
function createMovieCard(movie) {
    return `
        <div class="movie">
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}海報">
            <p>${movie.overview}</p>
            <button onclick="toggleWatchlist('${movie.id}')">加入想看清單</button>
            <button onclick="createDateRequest('${movie.title}')">發起約會</button>
        </div>
    `;
}

// 切換想看清單
function toggleWatchlist(movieId) {
    // 這裡可以實現將電影添加到用戶的想看清單的邏輯
    alert(`電影ID ${movieId} 已添加���您的想看清單！`);
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
    console.log('用戶偏好:', preferences);
    alert('您的偏好已保存！');
    
    // 保存後顯示電影列表
    document.getElementById('userPreferences').style.display = 'none';
    document.getElementById('movieList').style.display = 'block';
    loadMovieList();
}

// 綁定表單提交事件
document.getElementById('preferencesForm').addEventListener('submit', saveUserPreferences);

// 初始化LIFF
initializeLiff();

// 綁定登入按鈕事件
document.getElementById('liffLoginButton').addEventListener('click', liffLogin);