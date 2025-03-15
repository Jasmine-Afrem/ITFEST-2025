from fastapi import FastAPI, UploadFile, File
from transformers import AutoProcessor, AutoModelForVision2Seq
import torch
from PIL import Image
import io

app = FastAPI()

# Load the DeepSeek-VL2 model
processor = AutoProcessor.from_pretrained("deepseek-ai/deepseek-vl2")
model = AutoModelForVision2Seq.from_pretrained("deepseek-ai/deepseek-vl2").to("cuda" if torch.cuda.is_available() else "cpu")

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Read image from request
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Process the image
        inputs = processor(images=image, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
        outputs = model.generate(**inputs, max_length=512)
        extracted_text = processor.batch_decode(outputs, skip_special_tokens=True)[0]

        return {"extracted_text": extracted_text}

    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "OCR API is running!"}
