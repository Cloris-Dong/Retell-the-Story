from PIL import Image


def resize_favicon():
    # 打开图片
    img = Image.open("favicon.png")

    # 获取原始尺寸
    width, height = img.size

    # 计算裁剪区域 - 缩小裁剪范围使图标更大
    target_size = min(width, height) * 0.6  # 减小裁剪区域到原来的60%
    left = (width - target_size) // 2
    top = (height - target_size) // 2
    right = left + target_size
    bottom = top + target_size

    # 裁剪为正方形
    img_cropped = img.crop((left, top, right, bottom))

    # 调整大小为64x64
    img_resized = img_cropped.resize((64, 64), Image.Resampling.LANCZOS)

    # 保存调整后的图片
    img_resized.save("favicon.png", "PNG")


if __name__ == "__main__":
    resize_favicon()
