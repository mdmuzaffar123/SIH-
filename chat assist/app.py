from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)

API_KEY = "AIzaSyBUZbmF_uhvpPefbqprMGSvjbPCL46cCu0"
genai.configure(api_key=API_KEY)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        text = data.get("text", "")
        image = data.get("image", None)

        prompt = """You are an AI assistant for renewable energy. If an image is given analyze it in detail. Provide practical insights about renewable energy based on the image or question."""

        model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")
        
        if image:
            try:
                # Decode base64 image
                image_bytes = base64.b64decode(image)
                img = Image.open(BytesIO(image_bytes))
                
                # Generate content with image
                response = model.generate_content([prompt + "\n\nUser question: " + text, img])
            except Exception as img_error:
                print(f"Image processing error: {img_error}")
                response = model.generate_content(prompt + "\n\nUser question: " + text)
        else:
            response = model.generate_content(prompt + "\n\nUser question: " + text)

        reply = response.text if response.text else "No response generated"
        
        return jsonify({"reply": reply})
    
    except Exception as e:
        error_msg = str(e)
        print(f"Chat Error: {error_msg}")
        return jsonify({"reply": f"Error: {error_msg}"}), 500


if __name__ == "__main__":
    app.run(debug=True)


if __name__ == "__main__":
    app.run(debug=True)