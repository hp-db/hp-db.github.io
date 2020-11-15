import cv2
import numpy as np
import glob
import json
import urllib.request
import tempfile
import requests
import requests
import shutil
import os


def download_img(url, file_name):
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(file_name, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

# files = glob.glob("/Users/nakamura/Dropbox/U-PARL_Moeller/input/*.jpg")
# files = glob.glob("input/*.jpg")

manifest = "https://iiif.dl.itc.u-tokyo.ac.jp/repo/iiif/415073/manifest"
num = "3"

res = urllib.request.urlopen(manifest)
# json_loads() でPythonオブジェクトに変換
data = json.loads(res.read())

canvases = data["sequences"][0]["canvases"]

th = 30

rep = "full/full"

for index in range(len(canvases)):


    canvas = canvases[index]
    image_url = canvas["images"][0]["resource"]["@id"].replace("full/full", rep)
    print(image_url)

    if index < th:
        continue

    file = "data/target_all/"+num+"/input/"+str(index+1).zfill(3)+".jpg"

    if not os.path.exists(file):
        download_img(image_url, file)
