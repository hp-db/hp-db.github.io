import bs4
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD, DCTERMS
from rdflib import Namespace
import json
import hashlib

prefix2 = "../static/api"

prefix = "https://w3id.org/hpdb/api"

all = Graph()

gardiner = {}

with open('data/gardiner.json') as f:
    df = json.load(f)
    for obj in df:
        gardiner[obj["id"]] = obj

with open('../static/data/curation.json') as f:
    df = json.load(f)

    selections = df["selections"]

    for selection in selections:
        members = selection["members"]

        manifest = selection["within"]["@id"]

        for member in members:

            g = Graph()
            g2 = Graph()
            g4itemNo = Graph()

            member_id = member["@id"]

            metadataObj = {}

            metadata = member["metadata"]

            for obj in metadata:
                metadataObj[obj["label"]] = obj["value"]

            # print(metadataObj)

            # hash = hashlib.md5(member_id.encode('utf-8')).hexdigest()

            hash = member["seeAlso"].split("/")[-1]

            # label = metadataObj["Hieratic No"][0] + "(" + metadataObj["Hieroglyph No"][0] + ")"
            label = hash

            # uri = "/Users/nakamurasatoru/git/d_nagai/hpdb2/src/static/data/" + hash + ".json"
            uri = prefix + "/items/"+hash

            subject = URIRef(uri)

            # g.add((subject, DCTERMS.identifer, Literal(hash)))
            g.add((subject, RDF.type, URIRef(prefix + "/classes/Item")))
            g.add((subject, RDFS.label, Literal(label)))

            

            g.add((subject, URIRef(prefix + "/properties/vol"), Literal(metadataObj["Vol"], datatype=XSD.integer)))

            if "Note" in metadataObj and metadataObj["Note"] != "":

                g.add((subject, URIRef(prefix + "/properties/notes"), Literal(metadataObj["Note"])))

            arr = metadataObj["Hieratic No Mod"]
            for value in arr:
                
                value = value.replace("/", "_")

                uri2 = prefix + "/term/hieraticNo/"+value
                g.add((subject, URIRef(prefix + "/properties/hieraticNo"), URIRef(uri2)))
                g.add((URIRef(uri2), RDFS.label, Literal(value)))
                g.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/HieraticNo")))

                g2.add((URIRef(uri2), RDFS.label, Literal(value)))
                g2.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/HieraticNo")))

                arr_ph = metadataObj["Phone/Word Mod"]
                for value_ph in arr_ph:
                    if value_ph != "":
                        g.add((URIRef(uri2), URIRef(prefix + "/properties/phonetic"), Literal(value_ph)))
                        g2.add((URIRef(uri2), URIRef(prefix + "/properties/phonetic"), Literal(value_ph)))

                g2.serialize(destination=prefix2 + '/term/hieraticNo/'+value+'.json', format='json-ld')

            arr = metadataObj["Item Label Mod"]
            for value in arr:
                
                value = value.replace("/", "_")

                uri2 = prefix + "/term/itemNo/"+value
                g.add((subject, URIRef(prefix + "/properties/itemNo"), URIRef(uri2)))
                
                g.add((URIRef(uri2), RDFS.label, Literal(value)))
                g.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/ItemNo")))

                g4itemNo.add((URIRef(uri2), RDFS.label, Literal(value)))
                g4itemNo.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/ItemNo")))

                g4itemNo.serialize(destination=prefix2 + '/term/itemNo/'+value+'.json', format='json-ld')

            arr = metadataObj["Hieroglyph No Mod"]
            for k in range(len(arr)):
                value = arr[k]
                uri2 = prefix + "/term/hieroglyphNo/"+value
                g.add((subject, URIRef(prefix + "/properties/hieroglyphNo"), URIRef(uri2)))
                
                g.add((URIRef(uri2), RDFS.label, Literal(value)))

                

                arr2 = metadataObj["Category Class"]

                if len(arr) != len(arr2):
                    if "Aa" in value:
                        category = "Aa"
                    else:
                        category = value[0:1]

                else:
                    category = arr2[k]

                uri3 = prefix + "/term/categoryClass/"+category
                g.add((URIRef(uri2), URIRef(prefix + "/properties/categoryClass"), URIRef(uri3)))
                g.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/HieroglyphNo")))

                g.add((URIRef(uri3), RDFS.label, Literal(category)))
                g.add((URIRef(uri3), RDF.type, URIRef(prefix + "/classes/Category")))

                if category in gardiner:
                    e = gardiner[category]
                    g.add((URIRef(uri3), URIRef("http://schema.org/description"), Literal(e["label"])))
                    g.add((URIRef(uri3), URIRef(prefix + "/properties/notes"), Literal(e["note"])))

                    

            g.add((subject, URIRef(prefix + "/properties/itemType"), Literal(metadataObj["Item Type"])))
            
            if "Sub Type" in metadataObj:
                g.add((subject, URIRef(prefix + "/properties/subType"), Literal(metadataObj["Sub Type"])))
            
            if "Numeral" in metadataObj:
                g.add((subject, URIRef(prefix + "/properties/numeral"), Literal(metadataObj["Numeral"])))

            if "Unit" in metadataObj:
                g.add((subject, URIRef(prefix + "/properties/unit"), Literal(metadataObj["Unit"])))

            g.add((subject, URIRef(prefix + "/properties/page"), Literal(int(metadataObj["Page"]))))
            g.add((subject, URIRef(prefix + "/properties/order"), Literal(int(metadataObj["Order"]))))

            if "thumbnail" in member:
                g.add((subject, URIRef("http://schema.org/image"), URIRef(member["thumbnail"])))

            if "related" in member:

                member_id_spl = member_id.split("#xywh=")

                canvas = member_id_spl[0]
                xywh = member_id_spl[1]

                url = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest="+manifest+"&canvas="+canvas+"&xywh="+xywh+"&xywh_highlight=border"

                g.add((subject, URIRef("http://schema.org/relatedLink"), URIRef(url)))

            g.add((subject, URIRef("http://schema.org/url"), URIRef("http://w3id.org/hpdb/item/"+hash)))

            g.add((subject, URIRef("http://schema.org/license"), URIRef("http://creativecommons.org/licenses/by/4.0/")))

            g.serialize(destination=prefix2 + '/items/'+hash+'.json', format='json-ld')

            all += g
            all += g2

            # break

all.serialize(destination='data/all_new.rdf')
