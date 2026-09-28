"""Cross-host evaluation harness. A user-supplied command performs real runs; absent runs stay not-run."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import time

SKILL=Path(__file__).resolve().parents[1]


def score(case,folder):
    result=[]
    for assertion in case['assertions']:
        file=(folder/assertion['file']).resolve()
        if not file.is_relative_to(folder.resolve()):raise ValueError('Assertion escapes output directory')
        present=file.is_file();passed=present
        if present and 'contains' in assertion:passed=assertion['contains'] in file.read_text(encoding='utf-8')
        if present and 'json' in assertion:
            try:
                data=json.loads(file.read_text(encoding='utf-8'))
                for key in assertion['json'].split('.'):data=data[key]
                passed=data==assertion['equals']
            except (ValueError,KeyError,TypeError):passed=False
        result.append({'assertion':assertion,'status':'pass' if passed else 'fail','sha256':hashlib.sha256(file.read_bytes()).hexdigest() if present else None})
    return result


def run(destination,host,command=None,timeout=600):
    if not host.strip():raise ValueError('Provide a host label')
    if command is not None and (not isinstance(command,list) or not command or not all(isinstance(x,str) for x in command)):raise ValueError('Command must be a JSON string array, never a shell expression')
    destination=Path(destination).resolve();destination.mkdir(parents=True,exist_ok=False)
    cases=json.loads((SKILL/'evals/cross-platform.json').read_text(encoding='utf-8'))['cases'];results=[]
    for case in cases:
        folder=destination/case['id'];folder.mkdir();prompt=folder/'prompt.txt'
        prompt.write_text(case['prompt']+'\nWrite deliverables into: '+str(folder)+'\n',encoding='utf-8')
        record={'case':case['id'],'host':host,'status':'not-run','manualReview':case['manualReview'],'manualReviewStatus':'not-checked'}
        if command:
            args=[x.replace('{prompt_file}',str(prompt)).replace('{output_dir}',str(folder)).replace('{skill_dir}',str(SKILL)) for x in command]
            start=time.monotonic()
            try:
                completed=subprocess.run(args,cwd=folder,capture_output=True,text=True,timeout=timeout,shell=False)
                (folder/'stdout.txt').write_text(completed.stdout,encoding='utf-8');(folder/'stderr.txt').write_text(completed.stderr,encoding='utf-8')
                checks=score(case,folder);record.update(status='checks-passed' if completed.returncode==0 and all(c['status']=='pass' for c in checks) else 'failed',exitCode=completed.returncode,checks=checks)
            except subprocess.TimeoutExpired:record['status']='timeout'
            except OSError as exc:record.update(status='unavailable',error=str(exc))
            record['seconds']=round(time.monotonic()-start,2)
        results.append(record)
    report={'schemaVersion':1,'host':host,'results':results,'notes':['Automated assertions check deliverables, not overall aesthetic quality.','Manual review remains not-checked until separately documented by a reviewer.','Do not publish transcripts or generated client artifacts without permission.']}
    (destination/'evaluation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    (destination/'evaluation.md').write_text('# Dazzler host evaluation\n\n| Case | Host | Execution | Visual/task review |\n|---|---|---|---|\n'+''.join(f"| {r['case']} | {host.replace('|','/')} | {r['status']} | {r['manualReviewStatus']} |\n" for r in results),encoding='utf-8')
    return report


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--host',required=True);parser.add_argument('--out',required=True);parser.add_argument('--command-file');parser.add_argument('--timeout',type=int,default=600);args=parser.parse_args()
    if args.timeout<1:raise SystemExit('timeout must be positive')
    command=json.loads(Path(args.command_file).read_text()) if args.command_file else None
    print(json.dumps(run(args.out,args.host,command,args.timeout),indent=2))
