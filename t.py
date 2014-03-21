from lxml import etree

f = open('Cx1-TC.xml')
xml = f.read()
f.close()

def test():
    root = etree.XML(xml)
    nsmap = {
        'tei': 'http://www.tei-c.org/ns/1.0',
        'det': 'http://textualcommunities.usask.ca/',
    }
    # pb = root.xpath('//tei:pb[@n="373r"]', namespaces=nsmap)[0]
    pb = None
    for el in root.iter():
        if el.tag == 'pb' and el.attrs.get('n') == '373r':
            pb = el
    # cur = pb
    # while cur is not None:
        # for el in cur.iter():
            # print el.tag
        # while cur is not None and not cur.getnext() is not None:
            # cur = cur.getparent()
        # if cur is not None:
            # cur = cur.getnext()
    return

if __name__ == '__main__':
    import timeit
    t = timeit.timeit('test()', number=100, setup="from __main__ import test")
    print t

