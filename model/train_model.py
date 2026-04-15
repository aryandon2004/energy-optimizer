import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load data
df = pd.read_csv("../data/energy_data.csv")

X = df[["hour", "day", "device"]]
y = df["duration"]

# Train model
model = RandomForestRegressor(n_estimators=100)
model.fit(X, y)

# Save model
joblib.dump(model, "energy_model.pkl")

print("Model trained & saved!")