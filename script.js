const categorySelect = document.getElementById('category');
const fetchBtn = document.getElementById('fetch-btn');
const speakBtn = document.getElementById('speak-btn');
const jokeInfoDiv = document.getElementById('joke-info');

let currentJokeText = ''; // Store joke for speech

async function fetchJoke(category) {
    try {
        jokeInfoDiv.innerHTML = '<p>Loading...</p>';
        speakBtn.disabled = true;

        // Build API URL with category (Any or specific)
        let url = 'https://v2.jokeapi.dev/joke/' + (category === 'Any' ? 'Any' : category);
        url += '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'; // Safe mode

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch joke. Try again!');
        }
        const data = await response.json();

        // Handle single or two-part jokes
        let jokeText = '';
        if (data.error) {
            throw new Error('API error: ' + data.message);
        } else if (data.type === 'single') {
            jokeText = data.joke;
        } else {
            jokeText = `${data.setup} <br> ${data.delivery}`;
        }

        // Update UI
        currentJokeText = jokeText.replace(/<br>/g, ' '); // For speech
        jokeInfoDiv.innerHTML = `<p class="joke-text">${jokeText}</p>`;
        speakBtn.disabled = false; // Enable speech
    } catch (error) {
        console.error('Fetch error:', error);
        jokeInfoDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        speakBtn.disabled = true;
    }
}

// Text-to-speech
function speakJoke() {
    if (currentJokeText) {
        const utterance = new SpeechSynthesisUtterance(currentJokeText);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// Fetch on button click
fetchBtn.addEventListener('click', () => {
    const category = categorySelect.value;
    fetchJoke(category);
});

// Speak on button click
speakBtn.addEventListener('click', speakJoke);

// Fetch a random joke on page load
fetchJoke('Any');
