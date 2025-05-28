import eel
import os, json
os.chdir(os.path.dirname(__file__))
eel.init("web")
global DataType
DataType = 'Data'

@eel.expose
def save_to_json(data):
    """Save JavaScript data into a JSON file."""
    print("Received Data:", data)  # Debug incoming data
    file_path = f"{DataType}/{Folder}/{FileName}"

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
    file_path = f"{DataType}/{Folder}/{FileName}"

    if not os.path.exists(file_path):  # Check if the file exists
        print("File not found! in ", file_path)
        return {}

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    print("Data loaded successfully:", file_path)  # Debugging log
    return data

@eel.expose
def File_Name(value):
    global DataType
    DataType = 'Saved Data'
    global Folder
    Folder = value
    folder_path = f"{DataType}/{Folder}"
    
    # Ensure folder existence
    if not folder_exist(folder_path):
        os.makedirs(folder_path, exist_ok=True)
    
    global FileName
    try:
        files = get_file_list(folder_path)
    except Exception as e:
        print(f"Error retrieving files: {e}")
        files = []
    
    if files:
        FileName = files[0]  # Get first file
    else:
        FileName = '1.json'  # Default file if folder is empty or doesn't exist
    
    print(f"Python variable set to: {folder_path}/{FileName}")

# Function to check if folder exists
def folder_exist(path):
    return os.path.exists(path) and os.path.isdir(path)

# Function to get list of files in folder
def get_file_list(path):
    return os.listdir(path) if os.path.exists(path) else []

pre_data = get_file_list("Data")
print(len(pre_data))
if len(pre_data) > 0:
    global Folder;
    Folder = pre_data[0];
    if len(Folder) > 0:
        global FileName
        FileName = get_file_list(f"Data/{Folder}")[0]
        eel.start("sheet.html?isNew=false", mode="default")
    else:
        pass
else:
    eel.start("Menu.html", mode="default")
