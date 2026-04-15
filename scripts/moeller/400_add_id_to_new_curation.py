import pandas as pd
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD
from rdflib import Namespace
import numpy as np
import math
import sys
import argparse
import json
import urllib
import glob

files = glob.glob("data/add/*.json")

prev = -1

map = {
    1: 30,
    2: 22,
    3: 22
}

for file in files:

    # jsonファイルを読み込む
    f = open(file)
    # jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
    data = json.load(f)
    # ファイルを閉じる
    f.close()

    members = data["selections"][0]["members"]

    vol = int(file.split("/")[-1].split(".")[0])

    count = 1
    for member in members:        

        member_id = member["@id"]
        page = int(member_id.split("canvas/p")[1].split("#")[0])

        if page != prev:
            count = 1

        prev = page

        page_new = page - map[vol]

        member["label"] = str(vol).zfill(1) + str(page_new).zfill(2)+"0"+str(count).zfill(2)

        count += 1
      
    with open(file.replace("add", "add_new"), 'w') as f:
      json.dump(data, f, ensure_ascii=False, indent=4,
              sort_keys=True, separators=(',', ': '))