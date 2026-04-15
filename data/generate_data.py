import pandas as pd
import random

data = []

# Device mapping (for understanding)
device_names = {
    1: "AC",
    2: "Fan",
    3: "Heater",
    4: "Washing Machine",
    5: "Refrigerator",
    6: "TV"
}

for _ in range(500):
    hour = random.randint(0, 23)
    day = random.randint(0, 6)  # 0 = Sunday
    device = random.choice([1, 2, 3, 4, 5, 6])

    # Realistic usage behavior
    if device == 1:  # AC (mostly evening/night)
        if hour >= 18 or hour <= 6:
            duration = random.uniform(3, 6)
        else:
            duration = random.uniform(0.5, 2)

    elif device == 2:  # Fan (used anytime)
        duration = random.uniform(1, 4)

    elif device == 3:  # Heater (morning/evening)
        if hour <= 9 or hour >= 18:
            duration = random.uniform(2, 5)
        else:
            duration = random.uniform(0.5, 2)

    elif device == 4:  # Washing Machine (daytime)
        if 8 <= hour <= 20:
            duration = random.uniform(0.5, 1.5)
        else:
            duration = random.uniform(0.1, 0.5)

    elif device == 5:  # Refrigerator (runs almost all day)
        duration = random.uniform(20, 24)

    elif device == 6:  # TV (evening usage)
        if hour >= 17:
            duration = random.uniform(1, 4)
        else:
            duration = random.uniform(0.5, 2)

    data.append([hour, day, device, duration])

# Create DataFrame
df = pd.DataFrame(data, columns=["hour", "day", "device", "duration"])

# Save dataset
df.to_csv("energy_data.csv", index=False)

print("✅ Dataset created successfully!")
print(df.head())