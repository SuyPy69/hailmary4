import requests
import json
import os

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
# The URL of your FastAPI streamer on the backend machine
BACKEND_URL = "http://10.20.201.21:5001/stream"

# The folder where this script will save the data for your index.html to read
SAVE_FOLDER = "live_data"

# Create the folder if it doesn't exist
if not os.path.exists(SAVE_FOLDER):
    os.makedirs(SAVE_FOLDER)


def receive_and_save_data():
    print(f"Connecting to live backend stream at {BACKEND_URL}...")
    print(f"Incoming data will be saved to the '{SAVE_FOLDER}' folder.")
    print("Press Ctrl+C to stop.\n")

    try:
        # Connect to the FastAPI stream and keep the connection open
        with requests.get(BACKEND_URL, stream=True, timeout=10) as response:

            # Read the incoming stream line by line as the server sends it
            for line in response.iter_lines():
                if line:
                    decoded_line = line.decode('utf-8')

                    # Check if the line contains the actual data payload
                    if decoded_line.startswith("data: "):
                        # Strip the "data: " prefix so we just have pure JSON
                        json_string = decoded_line.replace("data: ", "", 1)

                        try:
                            # Convert the string into a Python dictionary
                            data = json.loads(json_string)

                            # -----------------------------------------------------
                            # SAVE EACH PIECE OF DATA TO ITS OWN LOCAL JSON FILE
                            # -----------------------------------------------------
                            keys_to_save = [
                                "crisises",
                                "active_routes",
                                "hospitals",
                                "tickets",
                                "truck_availability"
                            ]

                            for key in keys_to_save:
                                if key in data:
                                    filepath = os.path.join(SAVE_FOLDER, f"{key}.json")
                                    with open(filepath, 'w') as f:
                                        json.dump(data[key], f, indent=4)

                            print("[UPDATE] Successfully refreshed local data files.")

                        except json.JSONDecodeError:
                            print("[WARNING] Received malformed JSON from server.")

    except requests.exceptions.ConnectionError:
        print("\n[ERROR] Could not connect. Is the FastAPI streamer running on 10.20.201.21?")
    except KeyboardInterrupt:
        print("\n[STOPPED] Disconnected by user.")


if __name__ == "__main__":
    receive_and_save_data()