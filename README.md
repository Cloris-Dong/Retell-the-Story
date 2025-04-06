# Interactive GIF Sequence

An interactive web page that displays a sequence of GIFs with sound effects. The GIFs play in a randomized order, and users can restart the sequence by clicking a button, which also triggers a satisfying click sound.

## Features

- Responsive grid layout for GIF display
- Automatic GIF sequence playback
- Randomized GIF order on each playback
- Click sound effect when restarting the sequence
- Smooth fade-in animations
- Automatic font size adjustment based on viewport
- Copyright notice display after GIF sequence
- Lazy loading for better performance

## Live Demo

Visit the live demo at: [https://cloris-dong.github.io/Retell-the-Story/](https://cloris-dong.github.io/Retell-the-Story/)

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Web Audio API
- Intersection Observer API for lazy loading

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Cloris-Dong/Retell-the-Story.git
cd Retell-the-Story
```

2. Open `index.html` in your web browser.

## Usage

- The GIF sequence will start playing automatically when the page loads
- Click the "Retell the Story" text to restart the sequence with a new random order
- The sequence will also restart when returning to the page after it was hidden

## Performance Optimization

The project uses several techniques to optimize performance:

1. Lazy Loading:
   - GIFs are loaded only when they are about to be displayed
   - Reduces initial page load time
   - Saves bandwidth by loading content on demand

2. Progressive Loading:
   - GIFs appear one by one with smooth transitions
   - Users can start viewing content before all files are loaded
   - Better user experience on slower connections

## Converting MP4 to GIF

If you have the original MP4 files, you can convert them to GIF using the provided script:

1. Install required Python packages:
```bash
pip install moviepy
```

2. Run the conversion script:
```bash
python convert_videos.py
```

This will create GIF files in the `gifs` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Sound effects: Custom click sound implementation
- GIFs: Original content 