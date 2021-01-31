import pandas as pd
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD
from rdflib import Namespace
import numpy as np
import math
import sys
import argparse
import json
import urllib.parse

path = "../static/data/curation_old.json"

json_open = open(path, 'r')
df = json.load(json_open)

selections = df["selections"]

# print(len(selections))

index = []

for selection in selections:
    members = selection["members"]

    manifest = selection["within"]["@id"]

    for member in members:
        # print(member)

        metadataObj = {}

        metadata = member["metadata"]

        metadata2 = []

        for m in metadata:
            label = m["label"]
            value = m["value"]

            if label not in metadataObj:
                metadataObj[label] = []

            values = value if isinstance(value, list) else [str(value)]

            for value in values:

                value = value.strip()

                if value != "":

                    metadataObj[label].append(value) 

        id = member["label"].replace("[", "").replace("]", "")

        # print(metadataObj)

        metadataObj["_label"] = id

        metadataObj["_id"] = id
        metadataObj["_image"] = member["thumbnail"]

        mid = member["@id"]

        mid_spl = mid.split("#xywh=")

        canvas = mid_spl[0]
        xywh = mid_spl[1]

        related = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest="+manifest+"&canvas="+canvas+"&xywh="+xywh+"&xywh_highlight=border"
        metadataObj["_related"] = related

        metadataObj["_url"] = "https://w3id.org/hpdb/item/" + id

        index.append(metadataObj)

fw = open("../static/data/index.json", 'w')
json.dump(index, fw, ensure_ascii=False, indent=4,
        sort_keys=True, separators=(',', ': '))