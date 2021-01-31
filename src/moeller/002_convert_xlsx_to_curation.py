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
import unicodedata
# 正規表現操作のライブラリ
import re

canvas_image_map = {}
curation_data = {}

EXCEL_PATH = "data/Moller_All-Data_20210129.xlsx"

curation_uri = "https://moeller.jinsha.tsukuba.ac.jp/data/curation.json"

def get_manifest_data(vol):
    path = "../pm/data/manifests/"+vol+".json"

    # jsonファイルを読み込む
    f = open(path)
    # jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
    data = json.load(f)
    # ファイルを閉じる
    f.close()

    '''
    res = urllib.request.urlopen(manifest)
    # json_loads() でPythonオブジェクトに変換
    data = json.loads(res.read())
    '''

    canvases = data["sequences"][0]["canvases"]

    for canvas in canvases:
      canvas_image_map[canvas["@id"]] = canvas["thumbnail"]["service"]["@id"]

    return canvases

def get_curation_data(curation):
    path = curation.replace("https://moeller.jinsha.tsukuba.ac.jp/", "")

    print("aaa", path)

    path = path.replace("vol", "vol_new")

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
      member_id = member["@id"]
      tmp = member_id.split("#xywh=")
      thumbnail_url = canvas_image_map[tmp[0]]+"/"+tmp[1]+"/,200/0/default.jpg"

      curation_data[label] = {
        "thumbnail_url" : thumbnail_url,
        # "related" : "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation="+curation_uri+"&pos="+str(len(curation_data.keys())+1),
        "member_id" : member_id
      }

def get_curation_data_new(data):

    members = data["selections"][0]["members"]

    # pos = 1

    for member in members:
      label = member["label"]
      member_id = member["@id"]
      tmp = member_id.split("#xywh=")
      thumbnail_url = canvas_image_map[tmp[0]]+"/"+tmp[1]+"/,200/0/default.jpg"

      curation_data[label] = {
        "thumbnail_url" : thumbnail_url,
        # "related" : "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation="+curation_uri+"&pos="+str(len(curation_data.keys())+1),
        "member_id" : member_id
      }

manifest_map = {
    "1": {
        "manifest": "https://moeller.jinsha.tsukuba.ac.jp/data/manifest/4a1fbed0-f2a2-4cf5-8a0a-fa310c62ca50/manifest.json"
    },
    "2": {
        "manifest": "https://moeller.jinsha.tsukuba.ac.jp/data/manifest/56653a59-0d55-4d1a-a7e3-2242e02859a1/manifest.json"
    },
    "3": {
        "manifest": "https://moeller.jinsha.tsukuba.ac.jp/data/manifest/8aaa203c-1c5a-4fef-973b-4fb174d60d37/manifest.json"
    }
}

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

for vol in manifest_map:
    print("manifest\t"+str(vol))
    manifest_data = manifest_map[vol]
    manifest_data["canvases"] = get_manifest_data(vol)

for vol in curation_map:
    print("curation\t"+str(vol))
    get_curation_data(curation_map[vol]["curation"])

files = glob.glob("data/add_new/*.json")

for file in files:

    # jsonファイルを読み込む
    f = open(file)
    # jsonデータを読み込んだファイルオブジェクトからPythonデータを作成
    data = json.load(f)
    # ファイルを閉じる
    f.close()

    get_curation_data_new(data)

path = EXCEL_PATH

manifest_members = {}

df = pd.read_excel(path, sheet_name=0, header=None, index_col=None, engine="openpyxl")

r_count = len(df.index)
c_count = len(df.columns)

def handleAs(data):
  targets=["*3", "*2"]
  for target in targets:
    if target in data:
      data = data.replace(target, target.replace("*", "×"))

  return data

def handleSplit(data):

  targets = ["(", ")", "=", "×3", "×2", "/", ","]

  for target in targets:
    data = data.replace(target, "+")

  data = data.split("+")

  arr = []

  for i in data:
    if i not in arr and i != "":
      arr.append(i.strip())

  return arr

def toSearch(data):
  arr = []
  fields = ["*", "-", "?", "bis", "ter", "quat"]
  for e in data:
    for field in fields:
      e = e.replace(field, "")

      if e[-1:] in ["A", "B", "C", "D", "E", "F", "a", "b", "c"]:
        e = e[:-1]

      if e not in arr and e != "":
        arr.append(e)

  return arr

for j in range(1, r_count):

    # print(j)

    sort = str(df.iloc[j,1])

    if sort != "107004" and False:
      continue

    m_sort = str(df.iloc[j,2]).zfill(8)
    h_sort = str(df.iloc[j,4]).zfill(8)

    vol = str(df.iloc[j,12]) # *

    m_no_str = unicodedata.normalize("NFKC", str(df.iloc[j,16]))

    m_no_str = handleAs(m_no_str)

    h_no_str = unicodedata.normalize("NFKC", str(df.iloc[j,19]))

    h_no_str = handleAs(h_no_str)

    item_str = unicodedata.normalize("NFKC", str(df.iloc[j,15]))

    # m_no = m_no_str.replace("=", "+").split("+") # 要検討
    # h_no = h_no_str.replace("=", "+").split("+") # 要検討

    m_no = handleSplit(m_no_str)
    h_no = handleSplit(h_no_str)
    item_no = handleSplit(item_str)

    page = str(df.iloc[j,13])

    order = str(df.iloc[j,14])

    m_no2 = toSearch(m_no)

    h_no2 = toSearch(h_no)

    item_no2 = toSearch(item_no)

    ph = df.iloc[j,20]
    if pd.isnull(ph):
      ph = ""

    ph = unicodedata.normalize("NFKC", ph)
    ph2 = handleSplit(ph)

    ###

    note = df.iloc[j,21]

    categories = df.iloc[j,18].split(",")
    numeral = [] if pd.isnull(df.iloc[j,17]) else str(df.iloc[j,17]).split(",")

    

    unit = df.iloc[j, 10]

    stype = df.iloc[j, 8]

    type = df.iloc[j, 6]

    ###

    if vol not in manifest_map:
        print("invalid", vol)
        continue

    manifest = manifest_map[vol]["manifest"]

    if vol == "1":
        canvas_index = int(page) + 29
    elif vol == "2":
        canvas_index = int(page) + 21
    elif vol == "3":
        canvas_index = int(page) + 21

    canvas_id = manifest_map[vol]["canvases"][canvas_index]["@id"]

    if manifest not in manifest_members:
        manifest_members[manifest] = {}

    if pd.isnull(note) or note == 0:
      note = ""

    manifest_members[manifest][sort] = {
        "vol": vol,
        "m_no_str" : m_no_str,
        "h_no_str" : h_no_str,
        "item_no_str" : item_str,
        "m_no": m_no,
        "h_no": h_no,
        "item_no" : item_no,
        "m_no2": m_no2,
        "h_no2": h_no2,
        "item_no2" : item_no2,
        "m_sort": m_sort,
        "h_sort": h_sort,
        "ph": ph,
        "ph2": ph2,
        "note" : note,
        "thumbnail_id": sort,
        "canvas_id": canvas_id,
        "page" : page,
        "order" : order,
        "type" : type,
        "stype" : stype,
        "categories": categories,
        "numeral": numeral,
        
        "unit" : unit
    }

selections = []

missing = []

pos = 1

for manifest in manifest_members:

    # print(manifest)

    members = []

    # print(manifest_members[manifest])

    for key in sorted(manifest_members[manifest]):

        # print(key)

        obj = manifest_members[manifest][key]

        vol = obj["vol"]

        '''
        {
          "label": "Hieratic No",
          "value": obj["m_no"]
        },
        {
          "label": "Hieratic No Mod",
          "value": obj["m_no2"]
        },
      
          {
            "label": "Hieroglyph No",
            "value": obj["h_no"]
          },
          {
            "label": "Hieroglyph No Mod",
            "value": obj["h_no2"]
          },
        '''

        metadata = [
            {
              "label": "Vol",
              "value": vol
            },
            {
              "label": "Hieratic No",
              "value": obj["m_no_str"]
            },
            {
              "label": "Hieroglyph No",
              "value": obj["h_no_str"]
            },
            {
              "label": "Item Label",
              "value": obj["item_no_str"]
            },

            {
              "label": "Hieratic No Mod",
              "value": obj["m_no"]
            },
            {
              "label": "Hieroglyph No Mod",
              "value": obj["h_no"]
            },
             {
              "label": "Item Label Mod",
              "value": obj["item_no"]
            },

            {
              "label": "Hieratic No Search",
              "value": obj["m_no2"]
            },            
            {
              "label": "Hieroglyph No Search",
              "value": obj["h_no2"]
            },
            {
              "label": "Item Label Search",
              "value": obj["item_no2"]
            },
           
            {
              "label": "Phone/Word",
              "value": obj["ph"]
            },
            {
              "label": "Phone/Word Mod",
              "value": obj["ph2"]
            },
            {
              "label": "Note",
              
              "value": obj["note"]
            },
            {
              "label": "m_sort",
              "value": obj["m_sort"]
            },
            {
              "label": "h_sort",
              "value": obj["h_sort"]
            },
            {
              "label": "Page",
              "value": obj["page"]
            },
            {
              "label": "Order",
              "value": obj["order"]
            },
            {
              "label": "Item Type",
              "value": obj["type"]
            },
            {
              "label": "Category Class",
              "value": obj["categories"]
            }
          ]

        if len(obj["numeral"]) > 0:
          metadata.append({
            "label": "Numeral",
            "value": obj["numeral"]
          })

        if not pd.isnull(obj["stype"]):
          metadata.append({
            "label": "Sub Type",
            "value": obj["stype"]
          })

        if not pd.isnull(obj["unit"]):
          metadata.append({
            "label": "Unit",
            "value": obj["unit"]
          })

        member = {
          "@id": obj["canvas_id"],
          "@type": "sc:Canvas",
          "label": str(key),
          "metadata": metadata
        }

        thumbnail_id = obj["thumbnail_id"]

        if thumbnail_id in curation_data:
          curation_obj = curation_data[thumbnail_id]
          member["related"] = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation="+curation_uri+"&pos="+str(pos)
          member["thumbnail"] = curation_obj["thumbnail_url"]
          member["@id"] = curation_obj["member_id"]
        else:
          # member["related"] = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?curation="+curation_uri+"&pos="+str(pos)
          # member["thumbnail"] = "https://diyhistory.org/public/hpdb/"+vol+"/"+obj["thumbnail_id"]+".jpg"

          missing.append(thumbnail_id)

        pos += 1

        members.append(member)

    selection = {
      "@id": curation_uri+"/range"+vol,
      "@type": "sc:Range",
      "label": "Manual curation by IIIF Curation Viewer",
      "members": members,
      "within": {
        "@id": manifest,
        "@type": "sc:Manifest",
        "label": vol
      }
    }
    selections.append(selection)

curation = {
  "@context": [
    "http://iiif.io/api/presentation/2/context.json",
    "http://codh.rois.ac.jp/iiif/curation/1/context.json"
  ],
  "@id": curation_uri,
  "@type": "cr:Curation",
  "label": "Curating list",
  "selections": selections
}

with open("../../static/data/curation_old.json", 'w') as f:
    json.dump(curation, f, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))


print("missing", missing)
print("missing length", len(missing))

# print(curation_data)