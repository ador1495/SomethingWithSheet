import eel
import os, json
import zipfile
import shutil
os.chdir(os.path.dirname(__file__))
eel.init("web")
global DataType
DataType = 'Data'

@eel.expose
def save_to_json(data, FileName):
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}/{FileName}"

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    print(f"Data saved successfully to {file_path}")

@eel.expose
def load_from_json(FileName):
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}/{FileName}"

    if not os.path.exists(file_path):
        print("File not found! in ", file_path)
        return {}

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    print("Data loaded successfully:", file_path)  # Debugging log
    return data

@eel.expose
def selectFolder(Folder):
    folder_path = f"Data/{Folder}"
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path, exist_ok=True)
    
    print(f"Folder set to: {folder_path}/")

def folder_exist(path):
    return os.path.exists(path) and os.path.isdir(path)

@eel.expose
def get_file_list(path):
    return os.listdir(path) if os.path.exists(path) else []

@eel.expose
def delete(path):
    if os.path.exists(path):
        if os.path.isdir(path):  # Check if it's a directory
            shutil.rmtree(path)
        else:  # If it's a file, delete it
            os.remove(path)  
        print(f"Deleted: {path}")
    else:
        print(f"Path does not exist: {path}")

@eel.expose
def rename_file(old_path, new_path):
    if os.path.exists(old_path) and not os.path.exists(new_path):  # Prevent overwrite
        os.rename(old_path, new_path)
        print(f"Renamed: {old_path} → {new_path}")
    else:
        print("Rename failed: File may not exist or new name already in use.")

@eel.expose
def file_count():
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    file_path = f"Data/{Folder}"
    return len(get_file_list(file_path))









DATA_DIR = 'Data'
SAVED_DIR = 'Saved Data'

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SAVED_DIR, exist_ok=True)

from tkinter import Tk, filedialog

@eel.expose
def select_zip_file():
    root = Tk()
    root.withdraw()
    root.wm_attributes('-topmost', 1)  # Force dialog on top
    initialdir = 'Saved Data'
    file_path = filedialog.askopenfilename(filetypes=[("ZIP Files", "*.zip")])
    root.destroy()
    return file_path

@eel.expose

def extract_to_data(zip_path):
    if not zip_path:
        return "Error: No ZIP file selected"
    
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    try:
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            zipf.extractall(DATA_DIR)
        return f"Extracted successfully to {DATA_DIR}"
    except Exception as e:
        print(f"Extraction error: {e}")  # Log issue in console
        return f"Error: {str(e)}"


@eel.expose
def save_and_cleanup_zip():
    pre_data = get_file_list("Data")
    Folder = pre_data[0]
    original_zip_path = f'Saved Data/{Folder}.zip'
    try:
        if not original_zip_path:
            return "Error: No ZIP file selected"

        base_name = os.path.basename(original_zip_path)
        save_path = os.path.join(SAVED_DIR, base_name)

        with zipfile.ZipFile(save_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(DATA_DIR):
                for file in files:
                    abs_path = os.path.join(root, file)
                    rel_path = os.path.relpath(abs_path, DATA_DIR)
                    zipf.write(abs_path, rel_path)

        # Clean up Data folder safely
        if os.path.exists(DATA_DIR):
            shutil.rmtree(DATA_DIR)
        os.makedirs(DATA_DIR)

        return f"Saved to '{save_path}' and cleaned 'Data'"
    except Exception as e:
        return f"Error: {str(e)}"










pre_data = get_file_list("Data")
if len(pre_data) > 0:
    global Folder;
    Folder = pre_data[0];
    global FileName
    FileName = '1.json'
    eel.start("sheet.html", mode="default")
else:
    eel.start("Menu.html", mode="default")
