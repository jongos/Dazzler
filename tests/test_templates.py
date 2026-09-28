import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from collections import Counter
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('templates',ROOT/'skills/dazzler-frontend/scripts/templates.py');templates=importlib.util.module_from_spec(spec);spec.loader.exec_module(templates)

class TemplateTests(unittest.TestCase):
    def test_counts_categories_and_integrity(self):
        c=templates.catalog();self.assertEqual(Counter(t['format'] for t in c['templates']),{'docx':10,'html':10,'ui':10})
        self.assertEqual(Counter(t['category'] for t in c['templates'] if t['format']=='ui'),{'general-webapp':3,'data-visualization':2,'restaurant':4,'generic-business':1})
        for path,digest in c['files'].items():self.assertEqual(hashlib.sha256((templates.ROOT/path).read_bytes()).hexdigest(),digest,path)
    def test_exports_preserve_resources_and_refuse_overwrite(self):
        with tempfile.TemporaryDirectory() as td:
            for ident in ['docx-legal','html-family','restaurant-cafe']:
                out=Path(td)/ident;result=templates.export(ident,out);self.assertTrue(Path(result['entrypoint']).is_file());self.assertTrue((out/'LICENSE.txt').is_file())
                if result['format']!='docx':self.assertTrue((out/'fonts/work-sans/fonts.css').is_file())
                with self.assertRaises(ValueError):templates.export(ident,out)
            with self.assertRaises(ValueError):templates.export('unknown',Path(td)/'unknown')
    def test_word_structure_and_no_inherited_title_rule(self):
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        for t in templates.select('docx'):
            with ZipFile(templates.ROOT/t['path']) as z:
                document=ET.fromstring(z.read('word/document.xml'));styles=ET.fromstring(z.read('word/styles.xml'))
                self.assertFalse(styles.findall('.//w:pBdr',ns))
                self.assertTrue(document.findall('.//w:tbl',ns));self.assertTrue(document.findall('.//w:tblHeader',ns))
                self.assertGreater(len(''.join(document.itertext())),800,t['id'])
                self.assertEqual(len(document.findall('.//w:br[@w:type="page"]',ns))+1,t['plannedPages'])
    def test_json_matches_embedded_data(self):
        import re
        for t in templates.select('ui'):
            folder=templates.ROOT/t['path'];s=(folder/'index.html').read_text(encoding='utf-8')
            embedded=re.search(r'<script id="template-data" type="application/json">(.*?)</script>',s,re.S).group(1)
            self.assertEqual(json.loads(embedded),json.loads((folder/'template.json').read_text(encoding='utf-8')))

if __name__=='__main__':unittest.main()
