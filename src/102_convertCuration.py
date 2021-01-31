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
            metadataObj[label] = value

            if "Search" not in label and value != "" and "_sort" not in label:
                metadata2.append({
                    "label" : label,
                    "value" : value
                })

        member["metadata"] = metadata2

        id = member["label"].replace("[", "").replace("]", "")

        uri = "https://w3id.org/hpdb/api/items/"+id
        member["seeAlso"] = uri

        mid = member["@id"]

        mid_spl = mid.split("#xywh=")

        canvas = mid_spl[0]
        xywh = mid_spl[1]

        related = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest="+manifest+"&canvas="+canvas+"&xywh="+xywh+"&xywh_highlight=border"

        member["related"] = related

        # break

fw = open("../static/data/curation.json", 'w')
json.dump(df, fw, ensure_ascii=False, indent=4,
        sort_keys=True, separators=(',', ': '))