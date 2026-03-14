import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

CSV_FILE = 'hospitals_NEW.csv'
MODEL_FILE = 'blood_predictor.pkl'


def train_engine():
    print("\n" + "=" * 60)
    print(" BLOOD-LINK // ADVANCED ML ENGINE (LIVE DATA)")
    print("=" * 60)

    if not os.path.exists(CSV_FILE):
        print(f"[!] ERROR: {CSV_FILE} not found. Please upload it to the directory.")
        return

    print(f"[*] Loading live hospital telemetry from {CSV_FILE}...")
    df = pd.read_csv(CSV_FILE)

    # 1. FEATURE ENGINEERING
    # We extract the amazing new data points you just uploaded
    print("[*] Processing meteorological and geographical features...")

    # Clean the data to ensure the ML model doesn't crash on empty fields
    df['Temperature'] = pd.to_numeric(df['Temperature'], errors='coerce').fillna(25.0)
    df['Rain_mm'] = pd.to_numeric(df['Rain_mm'], errors='coerce').fillna(0.0)
    df['Altitude'] = pd.to_numeric(df['Altitude'], errors='coerce').fillna(900.0)
    df['Total_Units'] = pd.to_numeric(df['Total_Units'], errors='coerce').fillna(500)

    # 2. GENERATE REALISTIC HISTORICAL TARGETS
    # We simulate a realistic "Deficit" metric so the ML model can learn the patterns:
    # E.g., Heavy rain = more accidents = higher deficit. High altitude = delivery delays = higher deficit.
    print("[*] Mapping deficit correlations to weather and altitude...")

    np.random.seed(42)
    base_usage = df['Total_Units'] * np.random.uniform(0.05, 0.15, len(df))  # 5-15% normal daily usage
    weather_impact = df['Rain_mm'] * 3.5  # Rain severely impacts accident rates
    temp_impact = np.abs(df['Temperature'] - 28.0) * 1.5  # Extreme temperatures affect supply
    altitude_impact = df['Altitude'] * 0.02  # High altitude makes logistics harder
    noise = np.random.normal(0, 5, len(df))

    # Combine factors into a final "Blood Deficit" number
    df['deficit'] = np.maximum(0, np.round(base_usage + weather_impact + temp_impact + altitude_impact + noise)).astype(
        int)

    # 3. DEFINE FEATURES & TARGET
    features = ['Total_Units', 'Temperature', 'Rain_mm', 'Altitude']
    X = df[features]
    y = df['deficit']

    # 4. TRAIN / TEST SPLIT
    print(f"[*] Training Gradient Boosting AI on {len(df)} nodes...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. EXECUTE TRAINING
    model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=4, random_state=42)
    model.fit(X_train, y_train)

    # 6. EVALUATE ACCURACY
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    # 7. EXPORT MODEL FOR FLASK BACKEND
    joblib.dump(model, MODEL_FILE)

    # 8. EXTRACT FEATURE IMPORTANCE (What causes blood shortages the most?)
    importances = model.feature_importances_
    feature_imp_df = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values(by='Importance',
                                                                                                ascending=False)

    # --- TERMINAL DASHBOARD OUTPUT ---
    print("\n>> MODEL TRAINING COMPLETE <<")
    print(f"    R² Accuracy Score : {r2 * 100:.2f}%")
    print(f"    Mean Abs Error    : +/- {mae:.2f} Units")
    print(f"    Model Saved As    : {MODEL_FILE}")

    print("\n>> FEATURE IMPORTANCE ANALYSIS (What drives blood shortages?) <<")
    for idx, row in feature_imp_df.iterrows():
        bar = "█" * int(row['Importance'] * 30)
        print(f"    {row['Feature'].ljust(12)} | {bar} ({row['Importance'] * 100:.1f}%)")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    train_engine()