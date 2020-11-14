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



path = "/Users/nakamura/git/d_nagai/hpdb/docs/data/curation.json"

# jsonファイルを読み込む
f = open(path)
# jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
data = json.load(f)
# ファイルを閉じる
f.close()

selections = data["selections"]

arr = []

for selection in selections:

  # print(selection)


  members = selection["members"]
  within = selection["within"]
  manifest = within["@id"]

  for member in members:

    id = member["@id"]
    area = id.split("#xywh=")[1].split(",")
    x = int(area[0])
    

    metadata = member["metadata"]
    key = ""
    vol = ""
    for m in metadata:
      if m["label"] == "h_sort":
        key = m["value"]
      if m["label"] == "Vol":
        vol = m["value"]
      if m["label"] == "Möller No":
        mno = m["value"][0]

    if x < 0 or int(area[2]) > 5000:
      arr.append(mno)

for e in arr:
  print(e)

print(len(arr))
