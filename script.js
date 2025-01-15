let isClickActive = false;
let isPaused = false;
let isLoopingGifActive = false;
let currentAudio = null; // Current audio object
let timerInterval = null;

function playHoverGif(container) {
    if (isClickActive) return;
    const hoverGif = container.querySelector('.hover-gif');
    hoverGif.style.display = 'block';
    hoverGif.src = hoverGif.src.split('?')[0] + `?t=${Date.now()}`; // Force reload
}

function resetHoverGif(container) {
    if (isClickActive) return;
    const hoverGif = container.querySelector('.hover-gif');
    hoverGif.style.display = 'none';
}

function playClickGif(container) {
    if (isClickActive) return;
    isClickActive = true;

    const id = container.dataset.id;
    const staticImage = container.querySelector('.static-image');
    const clickGif = container.querySelector('.click-gif');
    const hoverGif = container.querySelector('.hover-gif');
    const emptyCase = container.querySelector('.empty-case');
    const recordPlayer = document.querySelector('.record-player');
    const timer = document.getElementById('timer');

    // Hide other states and show click GIF
    staticImage.style.display = 'none';
    hoverGif.style.display = 'none';
    emptyCase.style.display = 'none';
    clickGif.style.display = 'block';
    clickGif.src = clickGif.src.split('?')[0] + `?t=${Date.now()}`; // Force reload

    // Play corresponding GIF and audio
    recordPlayer.src = `./imgs/${id}/${id}_add_record.gif`;
    setTimeout(() => {
        recordPlayer.src = `./imgs/${id}/${id}_record_turning.gif`;
        clickGif.style.display = 'none'; // Hide click GIF after animation
        emptyCase.style.display = 'block'; // Show empty case while audio is playing
        isLoopingGifActive = true;

        // Show controls and timer
        document.querySelector('.controls').classList.add('visible');
        timer.style.display = 'inline'; // Show the timer

        // Load and play the audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        currentAudio = new Audio(`./audio/${id}.wav`);
        currentAudio.play();

        // Start the timer
        startTimer();

        // Reset state after audio ends
        currentAudio.onended = stopPlayback;
    }, 2500);
}

function togglePlayPause() {
    if (!isLoopingGifActive || !currentAudio) return;

    const recordPlayer = document.querySelector('.record-player');
    const pauseIcon = document.getElementById('pause-icon');
    const playIcon = document.getElementById('play-icon');

    // Extract the audio id from the current audio object
    const id = currentAudio.src.split('/').slice(-1)[0].split('.')[0]; // Extract the file name without extension

    if (isPaused) {
        currentAudio.play();
        recordPlayer.src = `./imgs/${id}/${id}_record_turning.gif`; // Update to turning GIF
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        isPaused = false;
    } else {
        currentAudio.pause();
        recordPlayer.src = `./imgs/${id}/${id}_record_paused.png`; // Update to paused image
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        isPaused = true;
    }
}



function stopPlayback() {
    if (!currentAudio) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;

    const recordPlayer = document.querySelector('.record-player');
    const timer = document.getElementById('timer');
    const pauseIcon = document.getElementById('pause-icon');
    const playIcon = document.getElementById('play-icon');

    // Reset the record player to an empty state
    recordPlayer.src = './imgs/player_empty.png';
    isLoopingGifActive = false;
    isPaused = false;
    isClickActive = false;

    // Hide controls and reset timer
    document.querySelector('.controls').classList.remove('visible');
    timer.style.display = 'none';

    clearInterval(timerInterval);
    timer.textContent = "-0:00";

    // Reset play/pause button to default "pause" state
    pauseIcon.style.display = 'block';
    playIcon.style.display = 'none';
}



function rewindAudio() {
    if (!currentAudio || !isLoopingGifActive) return;
    currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 15);
}

function forwardAudio() {
    if (!currentAudio || !isLoopingGifActive) return;
    currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 15);
}

function startTimer() {
    const timer = document.getElementById('timer');
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (currentAudio) updateTimer();
    }, 1000);
}

function updateTimer() {
    const timer = document.getElementById('timer');
    const remainingTime = Math.ceil(currentAudio.duration - currentAudio.currentTime);

    if (remainingTime <= 0) {
        timer.textContent = "-0:00";
        clearInterval(timerInterval);
        return;
    }

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timer.textContent = `-${minutes}:${seconds.toString().padStart(2, '0')}`;
}