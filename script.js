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

    // Function to log debug information
    function logDebugInfo(message) {
        const debugInfo = document.getElementById('debug-info');
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        debugInfo.innerHTML += logMessage + '<br>';
        console.log(logMessage);
    }

    // Function to show a single video
    function showSingleVideo(item, index, delay) {
        return new Promise((resolve) => {
            setTimeout(async () => {
                logDebugInfo(`开始加载视频 ${index + 1}`);
                const video = item.querySelector('video');
                if (!video) {
                    logDebugInfo(`未找到视频 ${index + 1}`);
                    resolve();
                    return;
                }

                try {
                    // Show the video first
                    item.style.opacity = '1';
                    video.style.opacity = '1';

                    // Try to play the video
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                        logDebugInfo(`视频 ${index + 1} 开始播放`);
                    }
                } catch (error) {
                    logDebugInfo(`视频 ${index + 1} 播放失败: ${error.message}`);
                    // If video fails, try to load GIF
                    const gifSource = video.querySelector('source[type="image/gif"]');
                    if (gifSource && video.parentNode) {
                        logDebugInfo(`正在加载视频 ${index + 1} 的 GIF 替代`);
                        const img = document.createElement('img');
                        img.src = gifSource.src;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        try {
                            video.parentNode.replaceChild(img, video);
                        } catch (e) {
                            logDebugInfo(`替换视频 ${index + 1} 为 GIF 失败: ${e.message}`);
                        }
                    }
                }
                resolve();
            }, delay);
        });
    }

    // Modified showVideos function
    async function showVideos() {
        logDebugInfo('开始视频播放序列');
        const gridItems = document.querySelectorAll('.grid-item');
        const videoStartDelay = 2500; // 2.5 seconds after previous video starts
        const storyTextDelay = 3000; // 3 seconds delay after last video

        logDebugInfo(`找到 ${gridItems.length} 个视频元素`);

        // Reset all items first
        gridItems.forEach(item => {
            item.style.opacity = '0';
            const video = item.querySelector('video');
            if (video) {
                video.style.opacity = '0';
                video.currentTime = 0;
            }
        });

        // Show videos sequentially with consistent delays
        for (let i = 0; i < gridItems.length; i++) {
            const delay = i * videoStartDelay;
            await showSingleVideo(gridItems[i], i, delay);
        }

        // Show story text after all videos with 3s delay
        const totalDelay = (gridItems.length - 1) * videoStartDelay + storyTextDelay;
        setTimeout(() => {
            logDebugInfo('显示故事文本');
            const storyText = document.querySelector('.story-text');
            if (storyText) {
                storyText.style.opacity = '1';
            }
        }, totalDelay);
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
                // Reset all videos before reloading
                document.querySelectorAll('video').forEach(video => {
                    video.currentTime = 0;
                    video.load();
                });
                // Add a longer delay after sound ends before reloading
                setTimeout(() => {
                    location.reload();
                }, 500); // Increased to 500ms
            };
        } else {
            // If sound couldn't be played, reload after a longer delay
            setTimeout(() => {
                location.reload();
            }, 800); // Increased to 800ms
        }
    });

    // Initialize videos
    document.addEventListener('DOMContentLoaded', () => {
        const videos = document.querySelectorAll('.grid-item video');
        videos.forEach((video, index) => {
            console.log(`Initializing video ${index + 1}`);

            // Set up event listeners
            video.addEventListener('loadeddata', () => {
                console.log(`Video ${index + 1} loaded data`);
                handleVideoLoad(video);
            });

            video.addEventListener('error', (e) => {
                console.error(`Error loading video ${index + 1}:`, e);
                const loadingElement = video.parentElement.querySelector('.loading');
                if (loadingElement) {
                    loadingElement.textContent = 'Error loading video';
                }
                // If video fails to load, try to load GIF
                const gifSource = video.querySelector('source[type="image/gif"]');
                if (gifSource && video.parentNode) {
                    console.log(`Loading GIF for video ${index + 1}`);
                    const img = document.createElement('img');
                    img.src = gifSource.src;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    try {
                        video.parentNode.replaceChild(img, video);
                    } catch (e) {
                        console.error(`Error replacing video with GIF for video ${index + 1}:`, e);
                    }
                }
            });
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