import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import sys

ROOT=Path(__file__).resolve().parents[1]
def load(name):
    spec=importlib.util.spec_from_file_location(name,ROOT/f'skills/dazzler-frontend/scripts/{name}.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
project=load('project');evaluation=load('evaluate')

class ProjectToolsTests(unittest.TestCase):
    def test_brand_reports_conflicts_and_preserves_source_lines(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'x.css';p.write_text('/* comment\n more */\n:root {--brand:#345678}\n.dark{--brand:#112233}\np{font-family:Work Sans}')
            report=project.brand(p);self.assertEqual(report['status'],'review-required');self.assertEqual(len(report['conflicts']),1);self.assertEqual(report['observations'][0]['line'],3);self.assertEqual(report['locks'],{})
    def test_apply_revert_and_stale_edit_guard(self):
        with tempfile.TemporaryDirectory() as td:
            r=Path(td);(r/'style.css').write_text('old');(r/'new.css').write_text('new')
            project.plan_change(r,'style.css',r/'new.css',r/'plan');project.apply_change(r/'plan');self.assertEqual((r/'style.css').read_text(),'new')
            project.apply_change(r/'plan',True);self.assertEqual((r/'style.css').read_text(),'old')
            (r/'style.css').write_text('unrelated edit')
            with self.assertRaises(ValueError):project.apply_change(r/'plan')
            self.assertEqual((r/'style.css').read_text(),'unrelated edit')
    def test_path_escape_and_tampered_preview_rejected(self):
        with tempfile.TemporaryDirectory() as td:
            r=Path(td);(r/'a').write_text('old');(r/'b').write_text('new')
            with self.assertRaises(ValueError):project.plan_change(r,'../elsewhere',r/'b',r/'plan')
            project.plan_change(r,'a',r/'b',r/'plan');(r/'plan/after.txt').write_text('tampered')
            with self.assertRaises(ValueError):project.apply_change(r/'plan')
    def test_asset_export_carries_licenses_and_refuses_overwrite(self):
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)/'icons';items=project.assets('icon','practical',out,['check','search']);self.assertEqual(len(items),2);self.assertTrue((out/'LICENSE.txt').exists());self.assertTrue((out/'ATTRIBUTION.txt').exists())
            with self.assertRaises(FileExistsError):project.assets('icon','',out,['check'])
    def test_document_export_escapes_content_and_has_print_rules(self):
        system={'fonts':{'body':'Work Sans','heading':'Young Serif'},'palette':{'modes':{'light':{'tokens':{'text':'#16181B','background':'#FFFFFF','border':'#666666'}}}}}
        with tempfile.TemporaryDirectory() as td:
            out=Path(td)/'doc.html';project.export_document({'title':'<script>bad</script>','sections':[{'heading':'Example','body':'Text','table':[['A','B'],['1','2']]}]},system,out)
            s=out.read_text();self.assertNotIn('<script>',s);self.assertIn('@page',s);self.assertIn('<table>',s)
            slides=Path(td)/'slides.html';project.export_document({'sections':[{'heading':'Long','body':'word '*150}]},system,slides,'slides')
            slide_html=slides.read_text();self.assertEqual(slide_html.count('<section>'),3);self.assertIn('break-before:page',slide_html)
            with self.assertRaises(ValueError):project.export_document({'sections':[{}]},system,out)
    def test_evaluation_without_host_is_not_run(self):
        with tempfile.TemporaryDirectory() as td:
            result=evaluation.run(Path(td)/'eval','unavailable-host');self.assertTrue(all(r['status']=='not-run' for r in result['results']))
    def test_harness_actual_failed_process_does_not_pass(self):
        with tempfile.TemporaryDirectory() as td:
            result=evaluation.run(Path(td)/'eval','test-fixture',[sys.executable,'-c','raise SystemExit(3)']);self.assertTrue(all(r['status']=='failed' for r in result['results']))
    def test_artifact_assertions_require_values_not_only_files(self):
        with tempfile.TemporaryDirectory() as td:
            r=Path(td);(r/'design.json').write_text('{"brandSeed":"#FFFFFF"}')
            result=evaluation.score({'assertions':[{'file':'design.json','json':'brandSeed','equals':'#345678'}]},r)
            self.assertEqual(result[0]['status'],'fail');self.assertEqual(len(result[0]['sha256']),64)

if __name__=='__main__':unittest.main()
