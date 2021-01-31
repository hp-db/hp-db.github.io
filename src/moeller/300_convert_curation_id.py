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


# jsonファイルを読み込む
f = open("data/id_map.json")
# jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
id_map = json.load(f)
# ファイルを閉じる
f.close()

errs = []

def get_curation_data(curation):
    
    path = curation.replace("https://moeller.jinsha.tsukuba.ac.jp/", "")

    # jsonファイルを読み込む
    f = open(path)
    # jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
    data = json.load(f)
    # ファイルを閉じる
    f.close()

    members = data["selections"][0]["members"]

    # pos = 1

    for member in members:
      label = member["label"]

      if label in id_map:
        member["label"] = id_map[label]
      else:
        errs.append(label)
      
    with open(path.replace("vol", "vol_new"), 'w') as f:
      json.dump(data, f, ensure_ascii=False, indent=4,
              sort_keys=True, separators=(',', ': '))

curation_map = {
    "1": {
        "curation": "https://moeller.jinsha.tsukuba.ac.jp/data/vol/01.json"
    },
    "2": {
        "curation": "https://moeller.jinsha.tsukuba.ac.jp/data/vol/02.json"
    },
    "3": {
        "curation": "https://moeller.jinsha.tsukuba.ac.jp/data/vol/03.json"
    }
}

for vol in curation_map:
    print("curation\t"+str(vol))
    get_curation_data(curation_map[vol]["curation"])

print(errs)

print(len(errs))

