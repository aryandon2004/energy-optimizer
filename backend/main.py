from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os

app = FastAPI()

# ✅ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Correct model path
model_path = os.path.join(os.path.dirname(__file__), "../model/energy_model.pkl")
model = joblib.load(model_path)


@app.get("/")
def home():
    return {"message": "Energy Optimizer API Running"}


@app.get("/predict")
def predict(hour: int, day: int, device: int):
    prediction = model.predict([[hour, day, device]])[0]

    # Improved suggestion logic
    if prediction > 5:
        suggestion = "High usage! Reduce to save electricity"
    elif prediction > 3:
        suggestion = "Moderate usage"
    else:
        suggestion = "Efficient usage"

    return {
        "predicted_duration": float(prediction),
        "suggestion": suggestion
    }