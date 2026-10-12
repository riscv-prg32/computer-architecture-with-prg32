#!/usr/bin/env python3
"""Package the finished Verm1 as a Cartridge Store bundle, exactly as Lecture 23 does, and check the ZIP.
Nothing is uploaded: the publish step needs a personal token and is left to the author.

    export PRG32_HOME=~/PRG32
    python3 tests/verm1_store.py [output folder]     # needs riscv32-esp-elf-gcc on the PATH
"""
import json, os, shutil, subprocess, sys, tempfile, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent.parent / "verm1"
PRG = os.environ["PRG32_HOME"]
OUT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(tempfile.mkdtemp())
OUT.mkdir(parents=True, exist_ok=True)

def prg32(*args):
    r = subprocess.run([sys.executable, "-m", "prg32", *map(str, args)], cwd=PRG, capture_output=True, text=True)
    print("$ python3 -m prg32 " + " ".join(str(a).replace(str(OUT), "~/verm1") for a in args))
    print(r.stdout.strip()[-1200:])
    if r.returncode:
        raise SystemExit("FAILED\n" + r.stderr[-1500:])
    return r.stdout

shutil.copy(SRC / "verm1_part4.S", OUT / "verm1.S")
for f in ("manifest.json", "metadata.json", "colophon.json", "icon.png"):
    shutil.copy(SRC / "store" / f, OUT / f)
for arch in ("esp32c6", "qemu"):
    cart = OUT / f"verm1-{arch}.prg32"
    prg32("cartridge", "build", OUT / "verm1.S", "--portable", "--entry-prefix", "verm1", "--name", "verm1", "--architecture", arch, "--out", cart)
    prg32("store", "attach-metadata", cart, "--metadata", OUT / "metadata.json", "--icon", OUT / "icon.png",
          "--colophon", OUT / "colophon.json", "--architecture", arch, "--out", cart)
summary = json.loads(prg32("cartridge", "summary", OUT / "verm1-esp32c6.prg32"))
prg32("store", "inspect-metadata", OUT / "verm1-esp32c6.prg32")
prg32("store", "pack-bundle", "--manifest", OUT / "manifest.json", "--out", OUT / "verm1-1.0.0.zip")
names = sorted(zipfile.ZipFile(OUT / "verm1-1.0.0.zip").namelist())
print("bundle:", names, (OUT / "verm1-1.0.0.zip").stat().st_size, "bytes")
ok = summary.get("import_model") == "abi-table" and {"manifest.json", "icon.png", "verm1-esp32c6.prg32", "verm1-qemu.prg32"} <= set(names)
print("Verm1 bundle check passed" if ok else "FAILED: unexpected summary or bundle content")
sys.exit(0 if ok else 1)
