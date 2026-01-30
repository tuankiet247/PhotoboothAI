import requests
import json
import cv2
import base64
import os
import numpy as np  # <--- Cần thêm thư viện này để xử lý mảng dữ liệu ảnh
from dotenv import load_dotenv

# 1. Load API Key
load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")

# 2. Đọc prompt
# Giả sử file system_prompt.txt có nội dung
try:
    with open("system_prompt.txt", "r", encoding="utf-8") as f:
        user_prompt = f.read().strip()
except FileNotFoundError:
    user_prompt = "Describe this image" # Giá trị mặc định nếu không tìm thấy file

# 3. Đọc và mã hóa ảnh input
image_path = r"C:\Users\DELL\Downloads\z7475537740393_27454b9589648214f18e7e6b8ab7aeb0.jpg"

if not os.path.exists(image_path):
    print(f"Lỗi: Không tìm thấy file ảnh tại {image_path}")
    exit()

with open(image_path, "rb") as image_file:
    base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    print("Image encoded to base64.")

# 4. Gửi Request
print("Đang gửi request tới OpenRouter...")
response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "google/gemini-3-pro-image-preview", # Lưu ý: Chọn đúng model hỗ trợ Vision/Image Generation
        "max_tokens": 2000,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": user_prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    })
)

result = response.json()

if "usage" in result:
    usage_info = result["usage"]
    print(f"\n[Usage Report]")
    print(f"Input tokens (Ảnh + Prompt): {usage_info.get('prompt_tokens')}")
    print(f"Output tokens (Kết quả): {usage_info.get('completion_tokens')}")
    print(f"Tổng cộng: {usage_info.get('total_tokens')} tokens")

# 5. Xử lý kết quả và Decode để Show Frame
if "choices" in result:
    message = result["choices"][0]["message"]
    print("AI Content Response:", message.get("content")) # In nội dung text để debug

    # Kiểm tra xem có ảnh trả về không (Cấu trúc trả về tùy thuộc vào Model provider)
    # Một số model trả về url là link http, một số trả về base64 data URI
    if message.get("images"):
        for idx, img_data in enumerate(message["images"]):
            image_url_or_data = img_data["image_url"]["url"]
            
            img_array = None

            # TRƯỜNG HỢP 1: Trả về Base64 (Data URI)
            if image_url_or_data.startswith("data:image"):
                print("Phát hiện ảnh Base64, đang giải mã...")
                # Tách header "data:image/png;base64," ra khỏi chuỗi
                base64_str = image_url_or_data.split(",")[1]
                # Decode base64 thành bytes
                img_bytes = base64.b64decode(base64_str)
                # Chuyển bytes thành numpy array
                nparr = np.frombuffer(img_bytes, np.uint8)
                # Decode numpy array thành ảnh OpenCV
                img_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # TRƯỜNG HỢP 2: Trả về URL HTTP (Link tải)
            elif image_url_or_data.startswith("http"):
                print(f"Phát hiện URL ảnh, đang tải về từ: {image_url_or_data[:50]}...")
                resp_img = requests.get(image_url_or_data)
                nparr = np.frombuffer(resp_img.content, np.uint8)
                img_array = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # SHOW ẢNH
            if img_array is not None:
                # Lưu ảnh
                output_filename = f"output_decoded_{idx}.jpg"
                cv2.imwrite(output_filename, img_array)
                print(f"✅ Saved image to {output_filename}")
                
                # Show ảnh (User requested)
                try:
                    cv2.imshow(f"Result Image {idx}", img_array)
                    print("Đang hiển thị ảnh. Nhấn phím bất kỳ để đóng cửa sổ.")
                    cv2.waitKey(0) # Wait explicitly for user key press to close
                    cv2.destroyAllWindows()
                except Exception as e:
                    print(f"⚠️ Cannot show image: {e}")
            else:
                print("Không thể decode ảnh.")

    else:
        print("API phản hồi thành công nhưng không chứa key 'images'.")
        # Đôi khi ảnh nằm trong content dưới dạng markdown link, cần regex để bắt nếu cần.
else:
    print("Lỗi API (Full response):")
    print(json.dumps(result, indent=2))