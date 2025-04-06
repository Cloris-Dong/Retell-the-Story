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

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Web Audio API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Cloris-Dong/Retell-the-Story.git
cd Retell-the-Story
```

2. Download required media files:
   - Create a `gifs` directory in the project root
   - Download the GIF files from [Google Drive](https://drive.google.com/drive/folders/1mcpuWudznWGXsA0PgjD001qdJKnZha2n?usp=sharing)
   - Place the GIF files in the `gifs` directory

3. Open `index.html` in your web browser.

## Usage

- The GIF sequence will start playing automatically when the page loads
- Click the "Retell the Story" text to restart the sequence with a new random order
- The sequence will also restart when returning to the page after it was hidden

## Media Files

The following media files are required but not included in the Git repository:
- GIF files in the `gifs` directory
- Sound effects in the `sounds` directory

You can download these files from:
- Media files: [Google Drive](https://drive.google.com/drive/folders/1mcpuWudznWGXsA0PgjD001qdJKnZha2n?usp=sharing)

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