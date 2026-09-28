"""Sync only the canonical, public template library into the GitHub Pages docs folder."""
from pathlib import Path
import shutil

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'skills/dazzler-frontend/assets/templates'
target=ROOT/'docs/templates'
if __name__=='__main__':
    shutil.copytree(source,target,dirs_exist_ok=True)
    print('Synced public template gallery to docs/templates; publishing requires the normal Git workflow.')
