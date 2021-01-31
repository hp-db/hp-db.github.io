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

path = "data/example.xlsx"

all = Graph()

input_file = pd.ExcelFile(path)

input_sheet_name=input_file.sheet_names

df_list=[]
for sheet in input_sheet_name:
    df_list.append(input_file.parse(sheet, header=None, index_col=None))

for df in df_list:

    g = Graph()

    r_count = len(df.index)
    c_count = len(df.columns)

    map = {}

    for i in range(1, c_count):
        uri = df.iloc[0, i]
        
        uri_sp = uri.split("@")

        uri = uri_sp[0]

        uri = uri.replace("sh:", "http://www.w3.org/ns/shacl#")

        uri = uri.replace("<", "").replace(">", "")

        obj = {}
        map[i] = obj
        obj["uri"] = uri
        
        if len(uri_sp) == 2:
            obj["lang"] = uri_sp[1]

    shape_uri = df.iloc[0, 0]

    id = shape_uri.split("/")[-1]

    shape_uri = URIRef(shape_uri)

    class_uri = df.iloc[1, 1]
    class_uri = URIRef(class_uri)

    g.add((shape_uri, RDF.type, URIRef("http://www.w3.org/ns/shacl#NodeShape")))
    g.add((shape_uri, URIRef("http://www.w3.org/ns/shacl#targetClass"), class_uri))
        
    for j in range(2, r_count):

        p1 = df.iloc[j,0]

        p1 = p1.replace("sh:", "http://www.w3.org/ns/shacl#")

        p1 = URIRef(p1)

        blank = BNode()
        g.add((shape_uri, p1, blank))

        g.add((blank, URIRef("http://www.w3.org/ns/shacl#order"), Literal(j-1)))

        for i in map:
            value = df.iloc[j,i]

            if not pd.isnull(value) and value != 0:

                obj = map[i]

                if pd.isnull(obj["uri"]):
                    continue

                p = URIRef(obj["uri"])

                if str(value).startswith("http") and obj["uri"] != "http://www.w3.org/2004/02/skos/core#example":
                    g.add((blank, p, URIRef(value)))
                else:
                    if "lang" in obj:
                        value = Literal(value, lang=obj["lang"])
                    else:
                        value = Literal(value)
                    g.add((blank, p, value))
                    
        
       

    g.serialize(destination="../static/api/shapes/"+id+".json", format='json-ld')
    all += g
   
all.serialize(destination="data/shapes.rdf", format='pretty-xml')