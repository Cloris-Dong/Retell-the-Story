document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');
    const storyText = document.querySelector('.story-text');
    const delay = 2800; // 2.8 seconds delay between each animation
    const fadeInDuration = 300; // 0.3 seconds for fade-in effect

    // Initialize audio context and gain node
    let audioContext;
    let clickSound;
    let gainNode;

    // Initialize click sound
    function initClickSound() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5; // Set volume to 50%
        gainNode.connect(audioContext.destination);

        // Load click sound
        fetch('sounds/click.wav')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                clickSound = audioBuffer;
            })
            .catch(error => console.error('Error loading sound:', error));
    }

    // Play click sound
    function playClickSound() {
        if (audioContext && clickSound) {
            const source = audioContext.createBufferSource();
            source.buffer = clickSound;
            source.connect(gainNode);
            source.start(0);
        }
    }

    // Handle video loading
    function handleVideoLoad(video) {
        const loadingElement = video.querySelector('.loading');
        const errorElement = video.querySelector('.error');

        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'none';
        video.style.opacity = '1';

        // Force autoplay
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay failed:", error);
                // If autoplay fails, try to play on user interaction
                document.addEventListener('click', function playOnClick() {
                    video.play();
                    document.removeEventListener('click', playOnClick);
                }, { once: true });
            });
        }
    }

    // Hide the story text initially
    storyText.classList.remove('visible');

    // Function to shuffle and reorder the grid items
    function shuffleAndReorderItems() {
        // Create an array of indices and shuffle it
        const indices = Array.from({ length: gridItems.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Reorder the grid items based on shuffled indices
        const grid = document.querySelector('.grid');
        indices.forEach((newIndex, currentIndex) => {
            grid.appendChild(gridItems[newIndex]);
        });
    }

    // Function to adjust font size based on grid width
    function adjustFontSize() {
        const grid = document.querySelector('.grid');
        const gridWidth = grid.offsetWidth;
        const textWidth = gridWidth * 0.5; // Half of grid width
        storyText.style.width = `${textWidth}px`;

        // Calculate font size based on text width
        const textLength = storyText.textContent.length;
        const fontSize = Math.min(textWidth / textLength * 1.5, 48); // Limit max font size
        storyText.style.fontSize = `${fontSize}px`;
    }

    // Adjust font size on load and resize
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);

    function showVideos() {
        const gridItems = document.querySelectorAll('.grid-item');
        const totalDuration = 4000; // 4 seconds total
        const delayPerItem = totalDuration / gridItems.length;

        gridItems.forEach((item, index) => {
            const video = item.querySelector('video');
            if (!video) return;

            // Reset video state
            video.currentTime = 0;
            video.style.opacity = '0';

            const loadingElement = video.querySelector('.loading');
            const errorElement = video.querySelector('.error');
            if (loadingElement) loadingElement.style.display = 'block';
            if (errorElement) errorElement.style.display = 'none';

            setTimeout(() => {
                item.style.opacity = '1';

                // Try to play the video
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Error playing video:", error);
                        if (errorElement) errorElement.style.display = 'block';

                        // If video fails, try to load GIF
                        const gifSource = video.querySelector('source[type="image/gif"]');
                        if (gifSource) {
                            const img = document.createElement('img');
                            img.src = gifSource.src;
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'cover';
                            video.parentNode.replaceChild(img, video);
                        }
                    });
                }
            }, index * delayPerItem);
        });

        // Show story text after all videos
        setTimeout(() => {
            const storyText = document.querySelector('.story-text');
            if (storyText) {
                storyText.style.opacity = '1';
            }
        }, totalDuration);
    }

    // Add click event listener to the text
    storyText.addEventListener('click', () => {
        // Play click sound
        playClickSound();

        // 执行刷新操作
        shuffleAndReorderItems();
        showVideos();
    });

    // Add video event listeners
    document.querySelectorAll('.grid-item video').forEach(video => {
        const loadingElement = video.parentElement.querySelector('.loading');
        video.addEventListener('loadeddata', () => handleVideoLoad(video));
        video.addEventListener('error', () => {
            console.error('Error loading video:', video.src);
            if (loadingElement) {
                loadingElement.textContent = 'Error loading video';
            }
        });
    });

    // Initial setup
    initClickSound();
    shuffleAndReorderItems();

    // Start the sequence
    showVideos();

    // Add event listener for page visibility changes
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // Restart the sequence when the page becomes visible again
            shuffleAndReorderItems();
            showVideos();
        }
    });
});