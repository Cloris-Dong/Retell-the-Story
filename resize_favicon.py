import os

from PIL import Image


def resize_favicon(input_path="favicon.png", output_path="favicon.png", size=(64, 64)):
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGBA if not already
            if img.mode != "RGBA":
                img = img.convert("RGBA")

            # Create a backup of the original file
            if os.path.exists(input_path):
                backup_path = input_path + ".backup"
                if not os.path.exists(backup_path):
                    os.rename(input_path, backup_path)
                    print(f"Original file backed up as {backup_path}")

            # Calculate crop dimensions (remove 20% from each edge)
            width, height = img.size
            crop_left = int(width * 0.2)
            crop_top = int(height * 0.2)
            crop_right = width - crop_left
            crop_bottom = height - crop_top

            # Crop the image
            cropped_img = img.crop((crop_left, crop_top, crop_right, crop_bottom))

            # Resize the image
            resized_img = cropped_img.resize(size, Image.Resampling.LANCZOS)

            # Save the resized image
            resized_img.save(output_path, "PNG", optimize=True)
            print(
                f"Successfully cropped edges by 20% and resized to {size[0]}x{size[1]} pixels"
            )
            print(f"New file saved as: {output_path}")

            # Print file sizes
            original_size = os.path.getsize(backup_path) / 1024  # Convert to KB
            new_size = os.path.getsize(output_path) / 1024  # Convert to KB
            print(f"\nOriginal size: {original_size:.2f}KB")
            print(f"New size: {new_size:.2f}KB")

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    resize_favicon()
