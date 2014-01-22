from mycelery import app

@app.task
def add_text(text, xml):
    history = History.objects.create(action='add-text')
    if history.check(text, xml):
        text.add_text(xml)

@app.task
def delete_text(text):
    history = History.objects.create(action='delete-text')
    if history.check(text, xml):
        text.delete()

@app.task
def add_doc(doc, xml):
    history = History.objects.create(action='add-doc')
    if history.check(doc, xml):
        doc.add_doc(xml)


