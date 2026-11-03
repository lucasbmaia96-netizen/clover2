"""Prévia local dos grimórios. Requer apenas Python 3; não instala dependências."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from functools import partial
import argparse,webbrowser,threading
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--porta',type=int,default=0)
parser.add_argument('--sem-navegador',action='store_true')
args=parser.parse_args()
root=Path(__file__).resolve().parent/'grimorio_oficial'/'html'
server=ThreadingHTTPServer(('127.0.0.1',args.porta),partial(SimpleHTTPRequestHandler,directory=str(root)))
url=f'http://127.0.0.1:{server.server_port}/editor.html'
print('Editor dos grimórios:',url,flush=True)
print('Mantenha esta janela aberta. Ctrl+C para encerrar.',flush=True)
if not args.sem_navegador:
 threading.Timer(.6,lambda:webbrowser.open(url)).start()
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
