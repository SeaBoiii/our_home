"""Writes build/artifact.html: index.html without its document skeleton
(doctype, html/head/body tags, charset and viewport metas), which is the form
the claude.ai artifact host expects; it adds its own skeleton when publishing."""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
for pat in (r'<!doctype html>\s*', r'<html[^>]*>\s*', r'</?head>\s*', r'</?body>\s*', r'</html>\s*',
            r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*'):
    html = re.sub(pat, '', html, flags=re.I)
out = ROOT / 'build' / 'artifact.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print(out, len(html))
