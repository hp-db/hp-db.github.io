import bs4
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD, DCTERMS
from rdflib import Namespace
import json
import hashlib

prefix2 = "/Users/nakamurasatoru/git/d_nagai/hpdb2/static/api"

prefix = "https://w3id.org/hpdb/api"

all = Graph()

with open('/Users/nakamurasatoru/git/d_nagai/hpdb2/static/data/curation.json') as f:
    df = json.load(f)

    selections = df["selections"]

    for selection in selections:
        members = selection["members"]

        manifest = selection["within"]["@id"]

        for member in members:

            g = Graph()
            g2 = Graph()

            member_id = member["@id"]

            metadataObj = {}

            metadata = member["metadata"]

            for obj in metadata:
                metadataObj[obj["label"]] = obj["value"]

            print(metadataObj)

            # hash = hashlib.md5(member_id.encode('utf-8')).hexdigest()

            hash = metadataObj["m_sort"]

            label = metadataObj["Möller No"][0] + "(" + metadataObj["Hieroglyph No"][0] + ")"

            # uri = "/Users/nakamurasatoru/git/d_nagai/hpdb2/src/static/data/" + hash + ".json"
            uri = prefix + "/items/"+hash

            subject = URIRef(uri)

            g.add((subject, DCTERMS.identifer, Literal(hash)))
            g.add((subject, RDF.type, URIRef(prefix + "/classes/Item")))
            g.add((subject, RDFS.label, Literal(label)))

            

            g.add((subject, URIRef(prefix + "/properties/vol"), Literal(metadataObj["Vol"], datatype=XSD.integer)))

            if metadataObj["Note"] != "":

                g.add((subject, URIRef(prefix + "/properties/notes"), Literal(metadataObj["Note"])))

            arr = metadataObj["Möller No"]
            for value in arr:
                
                value = value.replace("/", "_")

                uri2 = prefix + "/term/hieraticNo/"+value
                g.add((subject, URIRef(prefix + "/properties/hieraticNo"), URIRef(uri2)))
                g.add((URIRef(uri2), RDFS.label, Literal(value)))
                g.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/HieraticNo")))

                g2.add((URIRef(uri2), RDFS.label, Literal(value)))
                g2.add((URIRef(uri2), RDF.type, URIRef(prefix + "/classes/HieraticNo")))

                arr = metadataObj["Phone/Word Mod"]
                for value in arr:
                    if value != "":
                        g.add((URIRef(uri2), URIRef(prefix + "/properties/phonetic"), Literal(value)))
                        g2.add((URIRef(uri2), URIRef(prefix + "/properties/phonetic"), Literal(value)))

                g2.serialize(destination=prefix2 + '/term/hieraticNo/'+value+'.json', format='json-ld')

            arr = metadataObj["Hieroglyph No"]
            for value in arr:
                uri2 = prefix + "/term/hieroglyphNo/"+value
                g.add((subject, URIRef(prefix + "/properties/hieroglyphNo"), URIRef(uri2)))

                g.add((URIRef(uri2), RDFS.label, Literal(value)))

            

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

all.serialize(destination='data/all.rdf')
