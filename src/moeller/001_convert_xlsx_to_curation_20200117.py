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

# 正規表現操作のライブラリ
import re

canvas_image_map = {}
curation_data = {}


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
    '''
    try:
      res = urllib.request.urlopen(curation)
    except:
      print("err")
      return

    # json_loads() でPythonオブジェクトに変換
    data = json.loads(res.read())

    '''
    path = curation.replace("https://moeller.jinsha.tsukuba.ac.jp/", "")

    print("aaa", path)

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

    return "aaa"

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

id_map = {}

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


path = "data/mollerdata20191122.xlsx"

manifest_members = {}

df = pd.read_excel(path, sheet_name=0, header=None, index_col=None, engine="openpyxl")

r_count = len(df.index)
c_count = len(df.columns)


for j in range(1, r_count):

    # print(j)

    sort = df.iloc[j,1]

    m_sort = str(df.iloc[j,0])
    h_sort = str(df.iloc[j,2])

    vol = str(df.iloc[j,4]) # *
    m_no = str(df.iloc[j,7]).split("+") # *
    h_no = str(df.iloc[j,8]).split("+")

    page = str(df.iloc[j,5])

    order = str(df.iloc[j,6])

    m_no2 = []
    for m in m_no:
      ms = m.replace("*", "").replace("-", "").replace("?", "").replace("/", "+").split("+")
      for m2 in ms:
        if m2[-1:] in ["A", "B", "C", "a", "b", "c"]:
          m2 = m2[:-1]
        m2 = m2.replace("bis", "")
        m_no2.append(m2)

    h_no2 = []
    for h in h_no:
      hs = h.replace("*", "").replace("-", "").replace("?", "").replace("/", "+").split("+")
      for h2 in hs:
        if h2[-1:] in ["A", "B", "C", "a", "b", "c"]:
          h2 = h2[:-1]
        h_no2.append(h2)

    ph = df.iloc[j,9]
    if pd.isnull(ph) or ph == "":
        ph = ""

    ph = ph.split(", ")

    ph2 = []
    for e in ph:
      ph2.append(e.replace("(", "").replace(")", ""))

    note = df.iloc[j,10]

    ###

    page = df.iloc[j, 5] # *
    order = df.iloc[j, 6]

    # 比較対象メラー番号
    m_no0 = m_no[0]

    if m_no0 == "272/273":
      m_no0 = "273"

    m_no0 = m_no0.split("/")[0]

    last_word = m_no0[-1:]

    # 最後の文字が英語の場合
    if not last_word.isdecimal():

      # re.sub(正規表現パターン, 置換後文字列, 置換したい文字列)
      # \D : 10進数でない任意の文字。（全角数字等を含む）
      num = re.sub("\\D", "", m_no0)

      l = m_no0.replace(num, "")

      thumbnail_id = str(vol) + "-" + str(page).zfill(2) + "-" + num.zfill(3) + l.upper()

      replace_map = {
        "1-05-061BIS": "1-05-061C",
        "2-13-160BIS": "2-13-160C",
        "3-32-340BIS": "3-32-340C",
        "3-32-340TER": "3-32-340D"
      }

      for key in replace_map:
        thumbnail_id = thumbnail_id.replace(key, replace_map[key])

      thumbnail_id = thumbnail_id.replace("BIS", "B") #BISはBに置換
    else:
      thumbnail_id = str(vol) + "-" + str(page).zfill(2) + "-" + m_no0.zfill(3)

    id_map[thumbnail_id] = str(vol) + str(page).zfill(2) + "0" + str(order).zfill(2)

    if vol not in manifest_map:
        continue

    manifest = manifest_map[vol]["manifest"]

    if vol == "1":
        canvas_index = int(page) + 29
    elif vol == "2":
        canvas_index = int(page) + 21
    elif vol == "3":
        canvas_index = int(page) + 21
    else:
        continue

    canvas_id = manifest_map[vol]["canvases"][canvas_index]["@id"]

    if manifest not in manifest_members:
        manifest_members[manifest] = {}

    

    if pd.isnull(note) or note == 0:
      note = ""

    manifest_members[manifest][sort] = {
        "vol": vol,
        "m_no": m_no,
        "h_no": h_no,
        "m_no2": m_no2,
        "h_no2": h_no2,
        "m_sort": m_sort,
        "h_sort": h_sort,
        "ph": ph,
        "ph2": ph2,
        "note" : note,
        "thumbnail_id": thumbnail_id,
        "canvas_id": canvas_id,
        "page" : page,
        "order" : order
    }

selections = []

missing = []

pos = 1

for manifest in manifest_members:

    print(manifest)

    members = []

    for key in sorted(manifest_members[manifest]):
        obj = manifest_members[manifest][key]

        vol = obj["vol"]

        metadata = [
            {
              "label": "Vol",
              "value": vol
            },
            {
              "label": "Möller No",
              "value": obj["m_no"]
            },
            {
              "label": "Möller No Mod",
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
              "label": "Category",
              "value": "基本字"
            }
          ]

        param1 = {
              "label": "Compound",
              "value": "単体字"
            }
        if len(obj["h_no2"]) > 1:
          param1 = {
              "label": "Compound",
              "value": "複合字"
            }
        metadata.append(param1)

        categories = []
        for e in obj["h_no2"]:
          category = None
          if "Aa" in e:
            category = "Aa"
          else:
            category = e[0:1]
            if category == "" or category.isdigit():
              category = None
          if category != None and category not in categories:
            categories.append(category)

        if len(categories) > 0:
          metadata.append({
              "label": "Class",
              "value": categories
            })
          

        member = {
          "@id": obj["canvas_id"],
          "@type": "sc:Canvas",
          "label": "["+str(key)+"]",
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

with open("data/id_map.json", 'w') as f:
    json.dump(id_map, f, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))