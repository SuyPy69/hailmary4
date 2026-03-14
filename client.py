import requests
import json
import os
import time

BACKEND_URL = "http://10.20.201.21:5001/stream"
SAVE_FOLDER = "live_data"

if not os.path.exists(SAVE_FOLDER):
    os.makedirs(SAVE_FOLDER)


def receive_and_save_data():
    print(f"Connecting to live backend stream at {BACKEND_URL}...")
    last_save_time = 0
    save_interval = 60  # Saves every 60 seconds

    try:
        with requests.get(BACKEND_URL, stream=True, timeout=10) as response:
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')
                    if decoded_line.startswith("data: "):
                        json_string = decoded_line.replace("data: ", "", 1)

                        try:
                            data = json.loads(json_string)
                            current_time = time.time()

                            # Save immediately on first run, then every 60s
                            if current_time - last_save_time >= save_interval:

                                # Exact keys matching the backend's payload
                                keys_to_save = [
                                    "crisises",
                                    "supply_logs",
                                    "ticket",
                                    "hospitals",
                                    "truck_availability"
                                ]

                                for key in keys_to_save:
                                    if key in data:
                                        filepath = os.path.join(SAVE_FOLDER, f"{key}.json")
                                        with open(filepath, 'w') as f:
                                            json.dump(data[key], f, indent=4)

                                print(f"[{time.strftime('%H:%M:%S')}] SAVED! Check the '{SAVE_FOLDER}' folder.")
                                last_save_time = current_time

                        except json.JSONDecodeError:
                            print("[WARNING] Malformed JSON.")

    except Exception as e:
        print(f"\n[ERROR] Could not connect: {e}")


if __name__ == "__main__":
    receive_and_save_data()