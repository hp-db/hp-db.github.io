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

files = glob.glob("/Users/nakamura/Desktop/EG_Moller_Hieratic_文字cut/JPEG/*/*.tif")
rows = []

for file in files:
  line = "convert "+file+" "+file.replace(".tif", ".jpg")
  rows.append([line])

  print(line)

import csv

f = open('batch.sh', 'w')

writer = csv.writer(f, lineterminator='\n')
writer.writerows(rows)

f.close()