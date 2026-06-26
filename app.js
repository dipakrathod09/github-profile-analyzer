const searchForm = document.getElementById('search-form');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const profileDashboard = document.getElementById('profile-dashboard');
const clearBtn = document.getElementById('clear-history-btn');
let searchHistory = JSON.parse(localStorage.getItem('gitHistory')) || [];

async function fetchUserProfile(username) {
    const initialState = document.getElementById('initial-state');
    if (initialState) initialState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    profileDashboard.classList.add('hidden');
    try {
        const [profileRes, repoRes] = await Promise.all([fetch(`https://api.github.com/users/${username}`), fetch(`https://api.github.com/users/${username}/repos?per_page=100`)]);


        if (profileRes.status === 403 || repoRes.status === 403) {
            throw new Error('Rate limit exceeded');
        }


        if (!profileRes.ok || !repoRes.ok) {
            throw new Error('User not found');
        }

        const remaining = profileRes.headers.get('x-ratelimit-remaining');
        const limit = profileRes.headers.get('x-ratelimit-limit');
        if (remaining && limit) {
            document.getElementById('rate-display').textContent = `Rate Limit: ${remaining} / ${limit}`;
        }
        const profileData = await profileRes.json();
        const reposData = await repoRes.json();


        renderProfile(profileData);
        renderRepositories(reposData);
        renderLanguages(reposData);

        saveSearch(profileData.login);
        profileDashboard.classList.remove('hidden');


    } catch (error) {
        profileDashboard.classList.add('hidden');

        const errorMessage = document.getElementById('error-message');
        if (error.message === 'Rate limit exceeded') {
            errorMessage.textContent = 'API Rate Limit Exceeded!';
            errorMessage.nextElementSibling.textContent = 'Please wait a while before searching again.';
        } else {
            errorMessage.textContent = 'Oops! User not found.';
            errorMessage.nextElementSibling.textContent = 'Check the spelling and try again.';
        }
        errorState.classList.remove('hidden');
        console.error(error);
    } finally {
        loadingState.classList.add('hidden');
    }

}

function renderRepositories(repos) {
    const container = document.getElementById('repos-container');
    container.innerHTML = '';

    if (repos.length === 0) {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = '<p>No repositories found.</p>';
        container.appendChild(card);
        return;
    }

    const topRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);

    topRepos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
        ${repo.name}
        </a></h3>
        <p>${repo.description || 'No description available'}</p>
        <div class="repo-meta">
        <span>⭐ ${repo.stargazers_count}</span>
        <span>🍴 ${repo.forks_count}</span>
        <span>📝 ${repo.language || 'N/A'}</span>
        </div>
        `;
        container.appendChild(card);
    });
}

function renderProfile(user) {
    document.getElementById('user-avatar').src = user.avatar_url;
    document.getElementById('user-name').textContent = user.name || user.login;
    document.getElementById('user-bio').textContent = user.bio || 'No bio available';
    document.getElementById('user-followers').textContent = user.followers;
    document.getElementById('user-following').textContent = user.following;
    document.getElementById('user-repos-count').textContent = user.public_repos;
    document.getElementById('user-handle').textContent = `@${user.login}`;
    document.getElementById('user-handle').href = user.html_url;
}

function renderLanguages(repos) {
    const LANGUAGE_COLORS = {
        'JavaScript': '#f1e05a',
        'Python': '#3572a5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#3178c6',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'Ruby': '#701516',
        'PHP': '#4f5d95',
        'Go': '#00add8'
    };

    const container = document.getElementById('languages-container');
    container.innerHTML = '';

    const languageCount = repos.reduce((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {});

    const totalReposWithLanguage = Object.values(languageCount).reduce((sum, count) => sum + count, 0);

    if (totalReposWithLanguage === 0) {
        container.innerHTML = '<p>No language data available.</p>';
        return;
    }

    const sortedLanguages = Object.entries(languageCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

    sortedLanguages.forEach(([lang, count]) => {
        const percentage = Math.round((count / totalReposWithLanguage) * 100);

        const barColor = LANGUAGE_COLORS[lang] || 'linear-gradient(90deg, #6f42c1, #007bff)';

        const langBar = document.createElement('div');
        langBar.className = 'language-metric';
        langBar.innerHTML = `
            <div class="language-name">${lang}</div>
            <div class="language-progress-bar">
                <div class="language-bar-fill" style="width: ${percentage}%; background: ${barColor}; box-shadow: 0 0 12px ${barColor}55;"></div>
            </div>
            <div class="language-percent">${percentage}%</div>
        `;
        container.appendChild(langBar);
    });
}

function saveSearch(username) {
    searchHistory = searchHistory.filter(name => name.toLowerCase() !== username.toLowerCase());

    searchHistory.unshift(username);
    searchHistory = searchHistory.slice(0, 5);

    localStorage.setItem('gitHistory', JSON.stringify(searchHistory));

    renderRecentSearches();
}
function renderRecentSearches() {
    const container = document.getElementById('recent-searches');
    container.innerHTML = '';

    if (searchHistory.length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }

    searchHistory.forEach(name => {
        const badge = document.createElement('span');
        badge.className = 'history-badge';
        badge.textContent = name;

        badge.addEventListener('click', () => {
            document.getElementById('search-input').value = name;
            fetchUserProfile(name);
        });

        container.appendChild(badge);
    });
}

renderRecentSearches();

document.getElementById('clear-history-btn').addEventListener('click', () => {
    searchHistory = [];
    localStorage.removeItem('gitHistory');
    renderRecentSearches();
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('search-input').value.trim();
    if (username) {
        fetchUserProfile(username);
    }
});