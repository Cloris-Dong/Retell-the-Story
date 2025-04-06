document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid-item');
    const storyText = document.querySelector('.story-text');
    const delay = 2800; // 2.8 seconds delay between each animation
    const gifDurations = [5000, 10000, 5000, 10000]; // Durations for each GIF in milliseconds
    const fadeInDuration = 300; // 0.3 seconds for fade-in effect

    // Create audio element for click sound
    const clickSound = new Audio('sounds/click.wav');

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

    function showGifs() {
        // Reset all items to initial state
        gridItems.forEach(item => {
            item.classList.remove('visible');
            // Reset GIF by reloading the image
            const img = item.querySelector('img');
            const src = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = src;
            }, 50);
        });
        storyText.classList.remove('visible');

        // Get the current order of items in the grid
        const grid = document.querySelector('.grid');
        const currentOrder = Array.from(grid.children);

        // Show each GIF after its calculated delay
        currentOrder.forEach((item, index) => {
            // Calculate delay based on position (2.8 seconds between each)
            const itemDelay = index * delay;

            // Show each GIF after its calculated delay
            setTimeout(() => {
                item.classList.add('visible');

                // If this is the last GIF (bottom-right), show the text after 5 seconds
                if (index === currentOrder.length - 1) {
                    // Show the text 5 seconds after the last GIF appears
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
        clickSound.currentTime = 0; // Reset sound to beginning
        clickSound.play()
            .then(() => {
                // 等待音效播放完成
                return new Promise(resolve => {
                    clickSound.addEventListener('ended', resolve, { once: true });
                });
            })
            .then(() => {
                // 音效播放完成后，再执行刷新操作
                shuffleAndReorderItems();
                showGifs();
            })
            .catch(error => {
                console.log("Audio playback failed:", error);
                // 如果音频播放失败，仍然执行刷新操作
                shuffleAndReorderItems();
                showGifs();
            });
    });

    // Initial setup
    shuffleAndReorderItems();

    // Start the sequence
    showGifs();

    // Add event listener for page visibility changes
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            // Restart the sequence when the page becomes visible again
            shuffleAndReorderItems();
            showGifs();
        }
    });

    // 获取所有GIF元素
    const gifs = document.querySelectorAll('.gif-container img');
    const retellButton = document.getElementById('retell-button');
    const copyright = document.getElementById('copyright');
    let currentIndex = 0;
    let isPlaying = false;
    let audioContext;
    let clickSound;
    let gainNode;

    // 初始化点击音效
    function initClickSound() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        clickSound = audioContext.createOscillator();
        gainNode = audioContext.createGain();

        clickSound.connect(gainNode);
        gainNode.connect(audioContext.destination);

        clickSound.type = 'sine';
        clickSound.frequency.setValueAtTime(1000, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    }

    // 播放点击音效
    function playClickSound() {
        if (!clickSound) {
            initClickSound();
        }

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

        clickSound.start();
        clickSound.stop(audioContext.currentTime + 0.1);
    }

    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 当 GIF 进入视口时加载它
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });

    // 初始化懒加载
    function initLazyLoading() {
        gifs.forEach(img => {
            // 保存原始 src 到 data-src
            img.dataset.src = img.src;
            // 设置占位图或空白
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            // 开始观察
            observer.observe(img);
        });
    }

    // 随机打乱数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 显示GIF序列
    async function showGifSequence() {
        if (isPlaying) return;
        isPlaying = true;

        // 隐藏重播按钮和版权信息
        retellButton.style.opacity = '0';
        copyright.style.opacity = '0';

        // 重置所有GIF的显示状态
        gifs.forEach(gif => {
            gif.style.opacity = '0';
            gif.style.display = 'none';
        });

        // 随机打乱GIF顺序
        const shuffledGifs = shuffleArray([...gifs]);

        // 依次显示GIF
        for (let i = 0; i < shuffledGifs.length; i++) {
            const gif = shuffledGifs[i];
            gif.style.display = 'block';

            // 确保 GIF 已加载
            if (gif.dataset.src) {
                gif.src = gif.dataset.src;
                gif.removeAttribute('data-src');
            }

            // 淡入效果
            await new Promise(resolve => {
                gif.style.opacity = '1';
                setTimeout(resolve, 2800);
            });
        }

        // 显示重播按钮和版权信息
        setTimeout(() => {
            retellButton.style.opacity = '1';
            copyright.style.opacity = '1';
        }, 5000);

        isPlaying = false;
    }

    // 页面加载完成后初始化
    initLazyLoading();
    showGifSequence();

    // 点击重播按钮时重新播放序列
    retellButton.addEventListener('click', () => {
        playClickSound();
        showGifSequence();
    });

    // 当页面重新获得焦点时重新播放序列
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            showGifSequence();
        }
    });
});