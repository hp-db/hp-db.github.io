# -*- coding: utf-8 -*-
import cv2
import math
import glob
import os
import csv
import json

arr = [
    {
        "oid" : "4a1fbed0-f2a2-4cf5-8a0a-fa310c62ca50",
        "vol" : "1"
    },{
        "oid" : "56653a59-0d55-4d1a-a7e3-2242e02859a1",
        "vol" : "2"
    },{
        "oid" : "8aaa203c-1c5a-4fef-973b-4fb174d60d37",
        "vol" : "3"
    }
]

for obj in arr:

    vol = obj["vol"]
    oid = obj["oid"]

    page_index_map = {}

    with open('data/0'+vol+'.csv', 'r') as f:
        reader = csv.reader(f)
        header = next(reader)  # ヘッダーを読み飛ばしたい時

        for row in reader:
            page_index_map[int(row[1])] = int(row[0])

    files = glob.glob("data/json/"+vol+"-*.json")

    members = []

    for file in sorted(files):
        filename = os.path.basename(file).split(".")[0]
        print(filename)
        index = int(filename.split("-")[1])
        page = page_index_map[index]

        canvas_id = "https://iiif.dl.itc.u-tokyo.ac.jp/repo/iiif/"+oid+"/canvas/p"+str(page)

        try:
            f = open(file, 'r')
            #ココ重要！！
            data = json.load(f)  # JSON形式で読み込む
        except:
            continue

        member_id = canvas_id+"#xywh="+data["xywh"]

        print(member_id)

        members.append({
            "@id" : member_id,
            "@type": "sc:Canvas",
            "label": filename,
            "metadata": [
                {
                    "label": "ID",
                    "value": filename
                }
            ]
        })

    curation_id = "https://moeller.jinsha.tsukuba.ac.jp/data/vol/0"+vol+".json"

    curation = {
        "@context": [
            "http://iiif.io/api/presentation/2/context.json",
            "http://codh.rois.ac.jp/iiif/curation/1/context.json"
        ],
        "@id": curation_id,
        "@type": "cr:Curation",
        "label": "Curating list",
        "selections": [
            {
                "@id": curation_id+"/range1",
                "@type": "sc:Range",
                "label": "Manual curation by IIIF Curation Viewer",
                "members": members,
                "within": {
                    "@id": "https://iiif.dl.itc.u-tokyo.ac.jp/repo/iiif/"+oid+"/manifest",
                    "@type": "sc:Manifest",
                    "label": "ieratische Paläographie. Band "+vol
                }
            }
        ]
    }

    fw = open("/Users/nakamura/git/d_nagai/hpdb/docs/data/vol/0"+vol+".json", 'w')
    json.dump(curation, fw, ensure_ascii=False, indent=4,
            sort_keys=True, separators=(',', ': '))
