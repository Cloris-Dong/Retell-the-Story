import os

from moviepy.editor import VideoFileClip


def convert_mp4_to_gif(input_file, output_file):
    """
    Convert an MP4 file to GIF format, keeping the original duration
    """
    try:
        # Load the video
        video = VideoFileClip(input_file)

        # Resize to 1x1 aspect ratio if needed
        if video.w != video.h:
            size = min(video.w, video.h)
            video = video.resize((size, size))

        # Convert to GIF using the full duration
        video.write_gif(output_file, fps=10)

        # Close the video to free up resources
        video.close()
        print(f"Successfully converted {input_file} to {output_file}")
    except Exception as e:
        print(f"Error converting {input_file}: {str(e)}")


def main():
    # Create output directory if it doesn't exist
    if not os.path.exists("gifs"):
        os.makedirs("gifs")

    # Specify the exact video files in order
    video_files = [
        "Gen-4 Wind blows the thin transparent sheet, revealing a vintage California car The car starts driving forward under golden sunlight, with dynamic shadows following it 2194347913.mp4",
        "Gen-4 A vintage light brown California car is parked in the center of the frame under warm golden sunlight A thin, semi-transparent sheet flutters gently over its top, moved by the wind like paper T.mp4",
        "BrownCar_0_A vintage light brown California car is parked under warm golden sunlight, partially covered by a thin, semi-transparent sheet fluttering gently in the wind like paper The camera holds sti.mp4",
        "BrownCar_0_A vintage light brown California car is parked in the center of the frame under warm golden sunlight A thin, semi-transparent sheet flutters gently over its top, moved by the wind like pap.mp4",
    ]

    # Convert each video file to GIF in the specified order
    for i, file in enumerate(video_files, 1):
        if os.path.exists(file):
            output_file = f"gifs/video{i}.gif"
            convert_mp4_to_gif(file, output_file)
        else:
            print(f"Warning: File not found: {file}")


if __name__ == "__main__":
    main()
