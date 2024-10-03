document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('userData'));
    const matches = findMatches(currentUser);
    displayMatches(matches);
});

function findMatches(currentUser) {
    // 這裡使用與 app.js 中相同的 simulatedUsers 數組
    const simulatedUsers = [
        { id: 1, name: "User1", likedMovies: [1, 2, 3, 4] },
        { id: 2, name: "User2", likedMovies: [2, 3, 4, 5] },
        { id: 3, name: "User3", likedMovies: [3, 4, 5, 6] },
    ];

    return simulatedUsers.filter(user => {
        const commonMovies = currentUser.likedMovies.filter(movieId => 
            user.likedMovies.includes(movieId)
        );
        return commonMovies.length >= 2;
    });
}

function displayMatches(matches) {
    const matchesList = document.getElementById('matchesList');
    if (matches.length === 0) {
        matchesList.innerHTML = '<p>目前還沒有匹配結果，繼續瀏覽更多電影吧！</p>';
        return;
    }

    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match-item';
        matchElement.innerHTML = `
            <h2>${match.name}</h2>
            <p>共同喜歡的電影數量: ${getCommonMoviesCount(JSON.parse(localStorage.getItem('userData')), match)}</p>
            <button onclick="startChat(${match.id})">開始聊天</button>
        `;
        matchesList.appendChild(matchElement);
    });
}

function getCommonMoviesCount(user1, user2) {
    return user1.likedMovies.filter(movieId => user2.likedMovies.includes(movieId)).length;
}

function startChat(userId) {
    // 實現聊天功能
    alert(`開始與用戶 ${userId} 聊天`);
}