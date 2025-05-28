import eel
import os, json
os.chdir(os.path.dirname(__file__))
eel.init("web")
global DataType
DataType = 'Data'

@eel.expose
def save_to_json(data, FileName):
    file_path = f"{DataType}/{Folder}/{FileName}"

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    print(f"Data saved successfully to {file_path}")

@eel.expose
def load_from_json(FileName):
    file_path = f"{DataType}/{Folder}/{FileName}"

    if not os.path.exists(file_path):
        print("File not found! in ", file_path)
        return {}

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    
    print("Data loaded successfully:", file_path)  # Debugging log
    return data

@eel.expose
def selectFolder(value):
    global DataType
    DataType = 'Saved Data'
    global Folder
    Folder = value
    if not folder_exist(f"Saved Data/{Folder}"):
        os.makedirs(f"Saved Data/{Folder}", exist_ok=True)
    print(f"Folder set to: {DataType}/{Folder}/")

def folder_exist(path):
    return os.path.exists(path) and os.path.isdir(path)

@eel.expose
def get_file_list(path):
    return os.listdir(path) if os.path.exists(path) else []

pre_data = get_file_list("Data")
print(len(pre_data))
if len(pre_data) > 0:
    global Folder;
    Folder = pre_data[0];
    global FileName
    FileName = '1.json'
    eel.start("sheet.html?isNew=false", mode="default")
else:
    eel.start("Menu.html", mode="default")