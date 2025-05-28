import eel
import os, json
os.chdir(os.path.dirname(__file__))
eel.init("web")

@eel.expose
def save_to_json(data):
    """Save JavaScript data into a JSON file."""
    print("Received Data:", data)  # Debug incoming data
    file_path = f"Data/{FileName}.json"

    # Prevent empty file writes
    if not data.get("txt"):
        print("No valid content received!")
        return

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    print(f"Data saved successfully to {file_path}")

@eel.expose
def load_from_json():
    """Load data from JSON and send it to JavaScript."""
    file_path = f"Data/{FileName}.json"

    if not os.path.exists(file_path):  # Check if the file exists
        print("File not found! in ", file_path)
        return {}

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    print("Data loaded successfully:", file_path)  # Debugging log
    return data

@eel.expose
def File_Name(value):
    global FileName;
    FileName = value;
    print(f"Python variable set to: {FileName}")


eel.start("Menu.html", mode="default")
