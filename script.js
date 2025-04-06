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
        // Create audio context only when needed
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.5; // Set volume to 50%
            gainNode.connect(audioContext.destination);
        }

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
        if (!audioContext) {
            initClickSound();
        }

        if (audioContext && clickSound) {
            const source = audioContext.createBufferSource();
            source.buffer = clickSound;
            source.connect(gainNode);

            // Resume audio context if it's suspended (Safari requirement)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            source.start(0);
            return source; // Return the source for tracking
        }
        return null;
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
                // If autoplay fails, try to load GIF
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
        console.log('Starting showVideos function');
        const gridItems = document.querySelectorAll('.grid-item');
        const totalDuration = 4000; // 4 seconds total
        const delayPerItem = totalDuration / gridItems.length;

        console.log(`Found ${gridItems.length} grid items`);

        // Reset all items first
        gridItems.forEach(item => {
            item.style.opacity = '0';
            const video = item.querySelector('video');
            if (video) {
                video.style.opacity = '0';
                video.currentTime = 0;
                const loadingElement = video.querySelector('.loading');
                const errorElement = video.querySelector('.error');
                if (loadingElement) loadingElement.style.display = 'block';
                if (errorElement) errorElement.style.display = 'none';
            }
        });

        // Hide story text
        const storyText = document.querySelector('.story-text');
        if (storyText) {
            storyText.style.opacity = '0';
        }

        // Show videos one by one
        gridItems.forEach((item, index) => {
            const video = item.querySelector('video');
            if (!video) {
                console.log(`No video found in grid item ${index + 1}`);
                return;
            }

            console.log(`Setting up video ${index + 1} to show in ${index * delayPerItem}ms`);

            setTimeout(() => {
                console.log(`Showing video ${index + 1}`);
                item.style.opacity = '1';
                video.style.opacity = '1';

                // Try to play the video
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log(`Video ${index + 1} started playing successfully`);
                    }).catch(error => {
                        console.error(`Error playing video ${index + 1}:`, error);
                        // If video fails, try to load GIF
                        const gifSource = video.querySelector('source[type="image/gif"]');
                        if (gifSource) {
                            console.log(`Loading GIF for video ${index + 1}`);
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
            console.log('Showing story text');
            const storyText = document.querySelector('.story-text');
            if (storyText) {
                storyText.style.opacity = '1';
            }
        }, totalDuration);
    }

    // Add click handler for the story text
    document.querySelector('.story-text').addEventListener('click', () => {
        // Initialize audio context on first click if needed
        if (!audioContext) {
            initClickSound();
        }

        // Play click sound and wait for it to finish before reloading
        const source = playClickSound();
        if (source) {
            // Wait for the sound to finish before reloading
            source.onended = () => {
                location.reload();
            };
        } else {
            // If sound couldn't be played, reload after a short delay
            setTimeout(() => {
                location.reload();
            }, 200);
        }
    });

    // Add video event listeners
    document.querySelectorAll('.grid-item video').forEach((video, index) => {
        console.log(`Setting up video ${index + 1} event listeners`);
        const loadingElement = video.parentElement.querySelector('.loading');

        video.addEventListener('loadeddata', () => {
            console.log(`Video ${index + 1} loaded data`);
            handleVideoLoad(video);
        });

        video.addEventListener('error', (e) => {
            console.error(`Error loading video ${index + 1}:`, e);
            if (loadingElement) {
                loadingElement.textContent = 'Error loading video';
            }
            // If video fails to load, try to load GIF
            const gifSource = video.querySelector('source[type="image/gif"]');
            if (gifSource) {
                console.log(`Loading GIF for video ${index + 1}`);
                const img = document.createElement('img');
                img.src = gifSource.src;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                video.parentNode.replaceChild(img, video);
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