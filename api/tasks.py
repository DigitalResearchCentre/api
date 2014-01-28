import os
import zipfile
from lxml import etree
from mycelery import app
from api.models import Text, RefsDecl


@app.task(bind=True)
def delete_text(self, text):
    text.delete()

@app.task(bind=True)
def delete_doc(self, doc):
    doc.delete()

@app.task(bind=True)
def add_text_file(self, xml, community):
    text = Text.add_root(tag='text')
    tei_el = etree.XML(xml)
    text.load_tei(tei_el, community)

@app.task(bind=True)
def add_image_zip(self, doc, zip_file):
    tmp_zip_path = os.path.join(
        settings.MEDIA_ROOT, str(random.getrandbits(64)))
    os.makedirs(tmp_zip_path, 0755)
    try:
        zip_file = zipfile.ZipFile(zip_file)
        zip_file.extractall(tmp_zip_path)
        file_lst = [
            f for f in os.listdir(tmp_zip_path) if f[0] not in ('.', '_')]
        content_folder = tmp_zip_path
        if len(file_lst) == 1:
            only_file = os.path.join(tmp_zip_path, file_lst[0])
            if os.path.isdir(only_file):
                content_folder = only_file
        for root, dirs, files in os.walk(content_folder):
            for f in files:
                src = os.path.join(root, f)
                dst = os.path.join(root, f.lower())
                os.rename(src, dst)
        doc.bind_files(content_folder)
    finally:
        shutil.rmtree(tmp_zip_path)




