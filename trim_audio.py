import wave


def trim_audio(input_file, output_file, start_time, end_time):
    """
    Trim an audio file to a specific time range.

    Args:
        input_file (str): Path to input audio file
        output_file (str): Path to output audio file
        start_time (float): Start time in seconds
        end_time (float): End time in seconds
    """
    with wave.open(input_file, "rb") as wav_file:
        # Get file properties
        n_channels = wav_file.getnchannels()
        sample_width = wav_file.getsampwidth()
        frame_rate = wav_file.getframerate()

        # Calculate start and end frames
        start_frame = int(start_time * frame_rate)
        end_frame = int(end_time * frame_rate)

        # Read the audio data
        wav_file.setpos(start_frame)
        audio_data = wav_file.readframes(end_frame - start_frame)

        # Write to output file
        with wave.open(output_file, "wb") as output_wav:
            output_wav.setnchannels(n_channels)
            output_wav.setsampwidth(sample_width)
            output_wav.setframerate(frame_rate)
            output_wav.writeframes(audio_data)


if __name__ == "__main__":
    # Example usage
    input_file = "sounds/click.wav"
    output_file = "sounds/click_trimmed.wav"
    trim_audio(input_file, output_file, 0.1, 0.3)
