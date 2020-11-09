import bs4
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD
from rdflib import Namespace

soup = bs4.BeautifulSoup(open('data/table.html'), 'html.parser')

trs = soup.find_all("tr")

prefix2 = "/Users/nakamurasatoru/git/d_nagai/hpdb2/src/static/api"

prefix = "https://w3id.org/hpdb/api"

all = Graph()

for tr in trs:
    print("---------------------")
    print(tr)
    tds = tr.find_all("td")

    if len(tds) < 4:
        continue

    g = Graph()

    print(tds)

    hie = tds[0].text.strip()
    ga = tds[1].text.strip()

    if ga == "" or "(" in ga:
        continue

    uni = tds[2].text.strip()

    desc = tds[3].text.strip()

    trans = ""
    if len(tds) > 4:
        trans = tds[4].text.strip()

    ph = ""
    if len(tds) > 5:
        ph = tds[5].text.strip()

    notes = ""
    if len(tds) > 6:
        notes = tds[6].text.strip()

    subject = URIRef(prefix + "/term/hieroglyphNo/"+ga)

    g.add((subject, RDFS.label, Literal(ga)))
    g.add((subject, URIRef("http://schema.org/name"), Literal(hie)))
    g.add((subject, RDF.type, URIRef(prefix + "/classes/HieroglyphNo")))

    if desc != "":
        g.add((subject, URIRef("http://schema.org/description"), Literal(desc)))

    if uni != "":
        g.add((subject, URIRef(prefix + "/properties/unicode"), Literal(uni)))
    
    if trans != "":
        g.add((subject, URIRef(prefix + "/properties/transliteration"), Literal(trans)))
    
    if ph != "":
        g.add((subject, URIRef(prefix + "/properties/phonetic"), Literal(ph)))
    
    if notes != "":
        g.add((subject, URIRef(prefix + "/properties/notes"), Literal(notes)))


    g.serialize(destination=prefix2 + '/term/hieroglyphNo/'+ga+'.json', format='json-ld')

    

    all += g

all.serialize(destination='data/list.rdf')
