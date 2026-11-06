"""Local preview server for the walkthrough (no caching, so edits show on reload).

    python tools/serve.py   ->  http://127.0.0.1:8765

POST /shot?name=foo with a PNG body saves renders/web/foo.png, and
POST /tex?name=foo saves build/tex/foo.png (the canvas textures, so the
Blender build can use the same images as the walkthrough).
"""
import functools
import http.server
import pathlib
import re
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIRS = {'/shot': ROOT / 'renders' / 'web', '/tex': ROOT / 'build' / 'tex'}


class NoCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.html': 'text/html; charset=utf-8'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        name = urllib.parse.parse_qs(url.query).get('name', ['shot'])[0]
        out = DIRS.get(url.path)
        if out is None or not re.fullmatch(r'[\w-]{1,64}', name):
            self.send_error(404)
            return
        out.mkdir(parents=True, exist_ok=True)
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        (out / f'{name}.png').write_bytes(body)
        self.send_response(204)
        self.end_headers()


if __name__ == '__main__':
    handler = functools.partial(NoCache, directory=str(ROOT))
    http.server.ThreadingHTTPServer(('127.0.0.1', 8765), handler).serve_forever()
