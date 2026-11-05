"""Optional Windows voice-to-key bridge. No changes to RedM or voice chat."""
from __future__ import annotations

import argparse
import ctypes
from ctypes import wintypes
import json
from pathlib import Path
import queue
import sys
import time
import unicodedata
import urllib.request
import zipfile

PHRASE = "magia imbuída em trevas"
MODEL_NAME = "vosk-model-small-pt-0.3"
MODEL_URL = f"https://alphacephei.com/vosk/models/{MODEL_NAME}.zip"


def normalize(text):
    return " ".join("".join(c for c in unicodedata.normalize("NFD", text.casefold())
                            if unicodedata.category(c) != "Mn").split())


def recognized(result):
    if normalize(result.get("text", "")) != normalize(PHRASE):
        return False
    words = result.get("result", [])
    return bool(words) and sum(w.get("conf", 0) for w in words) / len(words) >= .75


def model_path(folder):
    model = folder / MODEL_NAME
    if (model / "conf/model.conf").is_file():
        return model
    folder.mkdir(parents=True, exist_ok=True)
    archive = folder / (MODEL_NAME + ".zip")
    print("Primeira execução: baixando o modelo de português do Vosk (cerca de 31 MB).", flush=True)
    temporary = archive.with_suffix(".download")
    urllib.request.urlretrieve(MODEL_URL, temporary)
    temporary.replace(archive)
    with zipfile.ZipFile(archive) as z:
        for item in z.infolist():
            target = (folder / item.filename).resolve()
            if not target.is_relative_to(folder.resolve()):
                raise RuntimeError("O arquivo do modelo contém um caminho inválido.")
        z.extractall(folder)
    if not (model / "conf/model.conf").is_file():
        raise RuntimeError("Modelo de português incompleto. Apague a pasta cache e tente novamente.")
    archive.unlink()
    return model


class WindowsKey:
    def __init__(self, key):
        if sys.platform != "win32":
            raise RuntimeError("Este teste de voz foi preparado para Windows.")
        self.vk = 0x6F + int(key[1:])
        self.user = ctypes.WinDLL("user32", use_last_error=True)
        self.kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        self.user.GetForegroundWindow.restype = wintypes.HWND
        self.user.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
        self.kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        self.kernel.OpenProcess.restype = wintypes.HANDLE
        self.kernel.QueryFullProcessImageNameW.argtypes = [wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD)]
        self.kernel.CloseHandle.argtypes = [wintypes.HANDLE]
        class Mouse(ctypes.Structure):
            _fields_ = [("dx", wintypes.LONG), ("dy", wintypes.LONG), ("data", wintypes.DWORD),
                        ("flags", wintypes.DWORD), ("time", wintypes.DWORD), ("extra", ctypes.c_size_t)]
        class Keyboard(ctypes.Structure):
            _fields_ = [("vk", wintypes.WORD), ("scan", wintypes.WORD), ("flags", wintypes.DWORD),
                        ("time", wintypes.DWORD), ("extra", ctypes.c_size_t)]
        class Hardware(ctypes.Structure):
            _fields_ = [("message", wintypes.DWORD), ("low", wintypes.WORD), ("high", wintypes.WORD)]
        class Union(ctypes.Union):
            _fields_ = [("mouse", Mouse), ("keyboard", Keyboard), ("hardware", Hardware)]
        class Input(ctypes.Structure):
            _anonymous_ = ("value",)
            _fields_ = [("type", wintypes.DWORD), ("value", Union)]
        self.Input, self.Keyboard = Input, Keyboard
        self.user.SendInput.argtypes = [wintypes.UINT, ctypes.POINTER(Input), ctypes.c_int]
        self.user.SendInput.restype = wintypes.UINT

    def game_active(self):
        pid = wintypes.DWORD()
        self.user.GetWindowThreadProcessId(self.user.GetForegroundWindow(), ctypes.byref(pid))
        handle = self.kernel.OpenProcess(0x1000, False, pid.value)
        if not handle:
            return False
        try:
            size = wintypes.DWORD(32768)
            buffer = ctypes.create_unicode_buffer(size.value)
            if not self.kernel.QueryFullProcessImageNameW(handle, 0, buffer, ctypes.byref(size)):
                return False
            name = Path(buffer.value).stem.casefold()
            return name == "rdr2" or name.startswith("redm")
        finally:
            self.kernel.CloseHandle(handle)

    def press(self):
        event = self.Input(type=1)
        event.keyboard = self.Keyboard(vk=self.vk)
        if self.user.SendInput(1, ctypes.byref(event), ctypes.sizeof(event)) != 1:
            raise RuntimeError("O Windows não conseguiu enviar a tecla para o jogo.")
        try:
            time.sleep(.07)
        finally:
            event.keyboard.flags = 2
            if self.user.SendInput(1, ctypes.byref(event), ctypes.sizeof(event)) != 1:
                raise RuntimeError("O Windows não conseguiu liberar a tecla enviada.")


def main():
    parser = argparse.ArgumentParser(description="Teste local de voz para Grimório das Trevas")
    parser.add_argument("--tecla", default="F7", choices=[f"F{i}" for i in range(1, 13)])
    parser.add_argument("--dispositivo", type=int, default=None, help="Índice opcional do microfone")
    parser.add_argument("--listar-microfones", action="store_true")
    args = parser.parse_args()
    import sounddevice as sd
    from vosk import Model, KaldiRecognizer, SetLogLevel
    if args.listar_microfones:
        print(sd.query_devices())
        return
    key = WindowsKey(args.tecla)
    SetLogLevel(-1)
    model = Model(str(model_path(Path(__file__).resolve().parent / "cache")))
    rate = int(sd.query_devices(args.dispositivo, "input")["default_samplerate"])
    recognizer = KaldiRecognizer(model, rate, json.dumps([PHRASE, "[unk]"], ensure_ascii=False))
    recognizer.SetWords(True)
    audio = queue.Queue(maxsize=32)
    def callback(data, frames, timing, status):
        if status:
            print("Microfone:", status, flush=True)
        try:
            audio.put_nowait(bytes(data))
        except queue.Full:
            pass
    print(f'Escutando o microfone: diga "{PHRASE}" com o RedM em primeiro plano.', flush=True)
    print(f"A frase envia {args.tecla} ao jogo. Ctrl+C encerra e libera o microfone.", flush=True)
    print("O áudio é reconhecido localmente; não é gravado nem enviado a um servidor.", flush=True)
    last = -10.0
    with sd.RawInputStream(samplerate=rate, blocksize=8000, device=args.dispositivo,
                           dtype="int16", channels=1, callback=callback):
        while True:
            if not recognizer.AcceptWaveform(audio.get()):
                continue
            result = json.loads(recognizer.Result())
            if not recognized(result) or time.monotonic() - last < 3:
                continue
            if not key.game_active():
                print("Frase reconhecida; aguardando o jogo ficar em primeiro plano.", flush=True)
                continue
            key.press()
            last = time.monotonic()
            print(f"Frase reconhecida; {args.tecla} enviado ao jogo.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nReconhecimento encerrado.")
    except Exception as error:
        print(f"Não foi possível iniciar/continuar o teste de voz: {error}", file=sys.stderr)
        sys.exit(1)
