document.addEventListener('DOMContentLoaded', () => {
    // Create spinner but don't add it immediately
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.style.position = 'fixed';
    spinner.style.top = '20px';
    spinner.style.left = '20px';
    spinner.style.width = '33.28px';
    spinner.style.height = '33.28px';
    spinner.style.borderRadius = '50%';
    spinner.style.display = 'inline-block';
    spinner.style.boxSizing = 'border-box';
    spinner.style.animation = 'animloader 2s linear infinite';
    spinner.style.zIndex = '9999';
    spinner.style.opacity = '0'; // Start invisible
    spinner.style.transition = 'opacity 0.2s ease'; // Add smooth fade-in

    // Delay adding the spinner for 0.3s
    setTimeout(() => {
        document.body.appendChild(spinner);
        // After adding to DOM, make it visible with slight delay for transition
        setTimeout(() => {
            spinner.style.opacity = '1';
        }, 10);
    }, 300); // 0.3 seconds delay

    // Set background color to dark gray
    document.body.style.backgroundColor = '#131313';
    document.body.style.color = 'white';
    document.body.style.fontFamily = "'Courier New', monospace";

    // Remove any noise effects if they exist
    const existingBgNoise = document.querySelector('.bg-noise');
    if (existingBgNoise) {
        existingBgNoise.remove();
    }

    const existingFilmGrain = document.querySelector('.film-grain');
    if (existingFilmGrain) {
        existingFilmGrain.remove();
    }

    // Add new spinner animation to the document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes animloader {
            0% {
                box-shadow: -72px 0 rgba(255, 255, 255, 0.9) inset;
            }
            100% {
                box-shadow: 48px 0 rgba(255, 255, 255, 0.9) inset;
            }
        }
        
        .story-text {
            font-size: 1.62em !important;
            position: absolute !important;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.3s ease;
            text-align: center;
            margin-top: 10px !important;
            display: block !important;
            width: 100% !important;
            left: 0 !important;
            top: 100% !important;
            transform: none !important;
            font-weight: 300 !important;
            letter-spacing: 1px;
            padding: 12px 0;
            border-radius: 4px;
            font-family: inherit;
        }
        
        .story-text::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 1px;
            background-color: white;
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .story-text:hover {
            color: white;
            letter-spacing: 1.5px;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
        }
        
        .story-text:hover::after {
            width: 80px;
        }
        
        .story-text:active {
            transform: scale(0.98) !important;
            opacity: 0.5;
        }
        
        @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }
        
        /* Additional container styles to ensure proper positioning */
        .container {
            position: relative !important;
            padding-bottom: 40px !important;
        }
        
        /* Update copyright to white color */
        .copyright {
            color: white !important;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

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

    // Function to adjust font size based on container width
    function adjustFontSize() {
        const container = document.querySelector('.container');
        const storyText = document.querySelector('.story-text');
        if (!container || !storyText) return;

        const containerWidth = container.offsetWidth;
        const maxWidth = containerWidth * 0.5; // 50% of container width
        const text = storyText.textContent;

        // Create temporary span to measure text width
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'nowrap';
        document.body.appendChild(span);

        // Binary search for optimal font size
        let minSize = 12;
        let maxSize = 48; // Maximum font size
        let optimalSize = minSize;

        while (minSize <= maxSize) {
            const midSize = Math.floor((minSize + maxSize) / 2);
            span.style.fontSize = midSize + 'px';
            span.textContent = text;

            if (span.offsetWidth <= maxWidth) {
                optimalSize = midSize;
                minSize = midSize + 1;
            } else {
                maxSize = midSize - 1;
            }
        }

        // Remove temporary span
        document.body.removeChild(span);

        // Apply the calculated font size
        storyText.style.fontSize = Math.min(optimalSize, 48) + 'px';
    }

    // Call adjustFontSize initially and on window resize
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
                const video = item.querySelector('video');
                if (!video) {
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
                    }
                } catch (error) {
                    // If video fails, try to load GIF
                    const gifSource = video.querySelector('source[type="image/gif"]');
                    if (gifSource && video.parentNode) {
                        const img = document.createElement('img');
                        img.src = gifSource.src;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        try {
                            video.parentNode.replaceChild(img, video);
                        } catch (e) {
                            // Ignore replacement error
                        }
                    }
                }
                resolve();
            }, delay);
        });
    }

    // Modified showVideos function
    async function showVideos() {
        const gridItems = document.querySelectorAll('.grid-item');
        const initialDelay = 300; // 0.3 seconds initial delay
        const videoStartDelay = 2500; // 2.5 seconds after previous video starts
        const storyTextDelay = 2000; // 2 seconds after last video starts

        // Reset all items first
        gridItems.forEach(item => {
            item.style.opacity = '0';
            const video = item.querySelector('video');
            if (video) {
                video.style.opacity = '0';
                video.currentTime = 0;
            }
        });

        // Hide story text initially
        const storyText = document.querySelector('.story-text');
        if (storyText) {
            storyText.style.opacity = '0';
            storyText.style.animation = 'none';

            // Ensure story text is within container but below grid
            const container = document.querySelector('.container');
            const grid = document.querySelector('.grid');

            // If story-text was moved to body, move it back to container
            if (storyText.parentElement !== container && container) {
                container.appendChild(storyText);
            }
        }

        // Add initial delay before starting the first video
        await new Promise(resolve => setTimeout(resolve, initialDelay));

        // Show videos sequentially with consistent delays
        for (let i = 0; i < gridItems.length; i++) {
            const delay = i * videoStartDelay;
            await showSingleVideo(gridItems[i], i, delay);

            // If this is the last video, show story text after 2 seconds
            if (i === gridItems.length - 1) {
                setTimeout(() => {
                    if (storyText) {
                        console.log('Showing story text with pulse animation');
                        storyText.style.opacity = '0.6'; // Start from 0.6 opacity
                        storyText.style.animation = 'pulse 2s infinite';

                        // Hide the spinner when story text appears
                        const spinner = document.querySelector('.spinner');
                        if (spinner) {
                            spinner.style.opacity = '0';
                            // Remove spinner from DOM after fade out
                            setTimeout(() => {
                                spinner.remove();
                            }, 300);
                        }
                    }
                }, storyTextDelay);
            }
        }
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
    let visibilityTimeout;
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // Clear any existing timeout
            if (visibilityTimeout) {
                clearTimeout(visibilityTimeout);
            }

            // Add a small delay before reload to ensure smooth transition
            visibilityTimeout = setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    });
});