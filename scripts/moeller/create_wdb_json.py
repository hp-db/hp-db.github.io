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
import csv

def get_data(manifest):
  res = urllib.request.urlopen(manifest)

  data = json.loads(res.read())

  map = {}

  canvases = data["sequences"][0]["canvases"]
  for canvas in canvases:
    map[canvas["@id"]] = canvas["thumbnail"]["service"]["@id"]

  return map

thumbs = {}

with open('data/thumb.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)  # ヘッダーを読み飛ばしたい時

    for row in reader:
        filename = str(row[0])        
        area = row[1].replace("\"", "")
        canvas = str(row[3])

        thumbs[filename] = {
          "area" : area,
          "canvas" : canvas
        }


path = "/Users/nakamurasatoru/git/d_nagai/hpdb/docs/data/curation.json"

# jsonファイルを読み込む
f = open(path)
# jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
data = json.load(f)
# ファイルを閉じる
f.close()

selections = data["selections"]

for selection in selections:

  # print(selection)


  members = selection["members"]
  within = selection["within"]
  manifest = within["@id"]

  print(manifest)

  if manifest != "https://moeller.jinsha.tsukuba.ac.jp/data/manifest/56653a59-0d55-4d1a-a7e3-2242e02859a1/manifest.json":
    continue

  mani_data = get_data(manifest)

  vol = "2"

  for member in members:

    # print(member)

    metadata = member["metadata"]

    for obj in metadata:
      label = obj["label"]
      value = obj["value"]

      if label == "Möller No":
        mno = value[0].split("/")[0]

    '''
    mno = mno.upper()
    mno = mno.replace("BIS", "bis")
    '''

    print(mno)
    
    member["related"] = 'https://moeller.jinsha.tsukuba.ac.jp/search?fc-Vol=2&fc-Hieratic%20No='+mno

    if mno in thumbs:
      tmp = thumbs[mno]
      canvas = "https://iiif.dl.itc.u-tokyo.ac.jp/repo/iiif/56653a59-0d55-4d1a-a7e3-2242e02859a1/canvas/p"+tmp["canvas"]
      base_image = mani_data[canvas]
      thumbnail = base_image+"/"+tmp["area"]+"/140,/0/default.jpg"
      
    else:
      thumbnail = "https://wdb.jinsha.tsukuba.ac.jp/wdb/hdb/moeller/"+mno+".png"

    member["thumbnail"] = thumbnail

    curation_uri = "https://moeller.jinsha.tsukuba.ac.jp/curation/"+mno+".json"

    curation = {
      "@context": [
          "http://iiif.io/api/presentation/2/context.json",
          "http://codh.rois.ac.jp/iiif/curation/1/context.json"
      ],
      "@id": curation_uri,
      "@type": "cr:Curation",
      "label": "Curating list",
      "selections": [
          {
              "@id": curation_uri + "/range1",
              "@type": "sc:Range",
              "label": "Manual curation by IIIF Curation Viewer",
              "members": [member],
              "within": {
                  "@id": manifest,
                  "@type": "sc:Manifest",
                  "label": "["+vol+"]"
              }
          }
        ]
    }

    with open("/Users/nakamurasatoru/git/d_nagai/hpdb/docs/curation/2/"+mno+".json", 'w') as f:
        json.dump(curation, f, ensure_ascii=False, indent=4,
                sort_keys=True, separators=(',', ': '))