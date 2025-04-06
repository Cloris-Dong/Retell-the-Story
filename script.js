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
    function handleVideoLoad(video, loadingElement) {
        console.log('Video loaded:', video.src);
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        video.style.opacity = '1';
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
        // Reset all items to initial state
        gridItems.forEach(item => {
            item.classList.remove('visible');
            const video = item.querySelector('video');
            const loadingElement = item.querySelector('.loading');
            if (video) {
                video.currentTime = 0;
                video.style.opacity = '0';
                if (loadingElement) {
                    loadingElement.style.display = 'block';
                }
                // Force video reload
                const src = video.src;
                video.src = '';
                setTimeout(() => {
                    video.src = src;
                    video.play().catch(error => {
                        console.error('Error playing video:', error);
                        if (loadingElement) {
                            loadingElement.textContent = 'Error playing video';
                        }
                    });
                }, 50);
            }
        });
        storyText.classList.remove('visible');

        // Get the current order of items in the grid
        const grid = document.querySelector('.grid');
        const currentOrder = Array.from(grid.children);

        // Show each video after its calculated delay
        currentOrder.forEach((item, index) => {
            // Calculate delay based on position (2.8 seconds between each)
            const itemDelay = index * delay;

            // Show each video after its calculated delay
            setTimeout(() => {
                item.classList.add('visible');
                const video = item.querySelector('video');
                if (video) {
                    video.style.opacity = '1';
                }

                // If this is the last video (bottom-right), show the text after 5 seconds
                if (index === currentOrder.length - 1) {
                    // Show the text 5 seconds after the last video appears
                    setTimeout(() => {
                        storyText.classList.add('visible');
                    }, 5000);
                }
            }, itemDelay);
        });
    }

    // Add click event listener to the text
    storyText.addEventListener('click', () => {
        // Play click sound
        playClickSound();
        // 等待音效播放完成
        return new Promise(resolve => {
            clickSound.addEventListener('ended', resolve, { once: true });
        })
            .then(() => {
                // 音效播放完成后，再执行刷新操作
                shuffleAndReorderItems();
                showVideos();
            })
            .catch(error => {
                console.log("Audio playback failed:", error);
                // 如果音频播放失败，仍然执行刷新操作
                shuffleAndReorderItems();
                showVideos();
            });
    });

    // Add video event listeners
    document.querySelectorAll('.grid-item video').forEach(video => {
        const loadingElement = video.parentElement.querySelector('.loading');
        video.addEventListener('loadeddata', () => handleVideoLoad(video, loadingElement));
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