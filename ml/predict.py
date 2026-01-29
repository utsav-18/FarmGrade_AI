import sys
import json
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# 🔇 Silence TensorFlow logs (CRITICAL)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

# 📁 Absolute path fix (CRITICAL)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "turmeric_grading_cnn.keras")

# ✅ Load model safely
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

CLASS_NAMES = ["Grade A", "Grade B", "Grade C"]

PRICE_MAP = {
    "Grade A": "120-150 INR per kg",
    "Grade B": "80-110 INR per kg",
    "Grade C": "40-70 INR per kg"
}

def preprocess(img):
    img = img.convert("RGB").resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)

def predict(image):
    x = preprocess(image)
    preds = model.predict(x, verbose=0)[0]
    idx = int(np.argmax(preds))

    return {
        "grade": CLASS_NAMES[idx],
        "confidence": round(float(preds[idx]) * 100, 2),
        "price": PRICE_MAP[CLASS_NAMES[idx]],
        "crop": "Turmeric"
    }

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        image = Image.open(image_path)
        result = predict(image)

        # ✅ ONLY JSON OUTPUT (IMPORTANT)
        print(json.dumps(result))

    except Exception as e:
        # ✅ Always return JSON, even on error
        print(json.dumps({ "error": str(e) }))
