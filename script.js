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
});