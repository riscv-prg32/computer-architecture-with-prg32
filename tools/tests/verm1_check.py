#!/usr/bin/env python3
"""Build the four parts of Verm1, play them on the PRG32-QT headless runner with scripted input, check
the result and write the screenshots used by the tutorial decks into tools/assets.

    export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
    python3 tests/verm1_check.py          # needs riscv32-esp-elf-gcc on the PATH
"""
import os, struct, subprocess, sys, tempfile, zlib
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent.parent / "verm1"
ASSETS = HERE.parent / "assets"
PRG = os.environ["PRG32_HOME"]
HL = os.environ["PRG32QT_HEADLESS"]
TMP = Path(tempfile.mkdtemp())
FAIL = []

def run(part, frames, inputs=()):
    src = SRC / f"verm1_part{part}.S"
    cart = TMP / f"verm1_part{part}.prg32"
    if not cart.exists():
        r = subprocess.run([sys.executable, "-m", "prg32", "cartridge", "build", str(src), "--portable",
                            "--entry-prefix", "verm1", "--name", "verm1", "--out", str(cart)], cwd=PRG, capture_output=True, text=True)
        if r.returncode or not cart.exists():
            raise SystemExit(f"BUILD FAILED part {part}\n{r.stdout[-1500:]}{r.stderr[-1500:]}")
        print(f"part {part}: {r.stdout.strip().splitlines()[-1]}", flush=True)
    args = [HL, str(cart), str(frames)]
    for a, b, m in inputs:
        for f in range(a, b):
            args += ["--input", f"{f}:{m}"]
    ppm = TMP / "frame.ppm"
    r = subprocess.run(args + ["--dump-ppm", str(ppm)], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(f"RUN FAILED part {part}\n{r.stdout}{r.stderr}")
    d = ppm.read_bytes().split(b"\n", 3)
    w, h = map(int, d[1].split())
    return {"w": w, "h": h, "px": d[3]}

def at(r, x, y):
    i = (y * r["w"] + x) * 3
    return tuple(r["px"][i:i + 3])

def cells(r, pred):
    return [(c, row) for row in range(24) for c in range(40) if pred(at(r, c * 8 + 4, row * 8 + 12))]

HEAD = lambda p: p[1] > 200 and p[0] < 60 and p[2] < 60
BODY = lambda p: 100 < p[1] < 200 and p[0] < 60 and p[2] < 60
FOOD = lambda p: p[0] > 200 and p[1] < 60 and p[2] < 60

def png(name, r, scale=2):
    w, h, px = r["w"], r["h"], r["px"]
    rows = []
    for y in range(h):
        row = px[y * w * 3:(y + 1) * w * 3]
        rows += [b"\x00" + b"".join(row[i:i + 3] * scale for i in range(0, len(row), 3))] * scale
    ch = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d))
    (ASSETS / name).write_bytes(b"\x89PNG\r\n\x1a\n" + ch(b"IHDR", struct.pack(">IIBBBBB", w * scale, h * scale, 8, 2, 0, 0, 0))
                                + ch(b"IDAT", zlib.compress(b"".join(rows), 9)) + ch(b"IEND", b""))

def check(what, got, want):
    ok = got == want
    print(f"  {'ok  ' if ok else 'FAIL'} {what}: {got}" + ("" if ok else f"  (expected {want})"), flush=True)
    if not ok:
        FAIL.append(what)

OPP = {1: 2, 2: 1, 4: 8, 8: 4}

STEP = {2: (1, 0), 1: (-1, 0), 8: (0, 1), 4: (0, -1)}   # button mask -> (dx, dy)

def player(part, foods, start):
    """Scripted player: steer towards the food `foods` times without touching the body.  Returns the
    last frame, its input script, the frame number and the direction (button mask) of the worm."""
    inp, f, cur, eaten, last_food = list(start), (start[-1][1] + 5 if start else 3), 2, 0, None
    while True:
        r = run(part, f, inp)
        (hx, hy), (fx, fy) = cells(r, HEAD)[0], cells(r, FOOD)[0]
        body = set(cells(r, BODY))
        if last_food is not None and (fx, fy) != last_food:
            eaten += 1
        last_food = (fx, fy)
        if eaten >= foods:
            return r, inp, f, cur
        def score(m):                                    # smaller is better
            nx, ny = (hx + STEP[m][0]) % 40, (hy + STEP[m][1]) % 24
            if (nx, ny) in body:
                return 10000
            dx, dy = min((fx - nx) % 40, (nx - fx) % 40), min((fy - ny) % 24, (ny - fy) % 24)
            return dx + dy + (0 if m == cur else 0.5)
        want = min((m for m in STEP if m != OPP[cur]), key=score)
        if want != cur:
            inp.append((f, f + 3, want))
            cur = want
        f += 3
        if f > 3000:
            raise SystemExit("the scripted player lost its way")

print("part 1")
r = run(1, 64)
check("head after 64 frames", cells(r, HEAD), [(5 + (64 * 40 >> 8), 12)])
png("verm1_p1.png", r)
check("head after 240 frames (wrapped)", cells(run(1, 240), HEAD), [((5 + (240 * 40 >> 8)) % 40, 12)])

print("part 2")
check("DOWN held 64 frames", cells(run(2, 64, ((0, 64, 8),)), HEAD), [(5, 22)])
check("LEFT held: the U-turn is refused", cells(run(2, 64, ((0, 64, 1),)), HEAD), [(15, 12)])
check("UP held 200 frames (wrapped)", cells(run(2, 200, ((0, 200, 4),)), HEAD), [(5, (12 - (200 * 40 >> 8)) % 24)])
r, inp, f, cur = player(2, 2, [])
marks = sum(1 for i in range(8) if at(r, 57 + 4 * i, 3) == (255, 255, 255))
check("score marks after eating twice", marks, 2)
png("verm1_p2.png", r)

for part in (3, 4):
    print(f"part {part}")
    r = run(part, 5)
    check("title screen: no worm", len(cells(r, HEAD)) + len(cells(r, BODY)), 0)
    png(f"verm1_p{part}_title.png", r)
    r = run(part, 12, [(5, 7, 0x10)])
    check("A starts the game: three cells", len(cells(r, HEAD)) + len(cells(r, BODY)), 3)
    r, inp, f, cur = player(part, 4, [(5, 7, 0x10)])
    check("length after eating four times", len(cells(r, HEAD)) + len(cells(r, BODY)), 7)
    png(f"verm1_p{part}_play.png", r)
    turn, ff = [], f
    for m in {2: [8, 1, 4], 1: [8, 2, 4], 8: [1, 4, 2], 4: [1, 8, 2]}[cur]:   # a tight square: the worm bites itself
        turn.append((ff, ff + 8, m))
        ff += 8
    r2, r3 = run(part, ff + 30, inp + turn), run(part, ff + 60, inp + turn)
    check("game over: the screen is frozen", r2["px"] == r3["px"], True)
    check("game over: text on screen", sum(1 for x in range(100, 220) if at(r2, x, 100) == (255, 255, 255)) > 5, True)
    png(f"verm1_p{part}_over.png", r2)
    again = inp + turn + [(ff + 62, ff + 64, 0x10)]
    r4 = run(part, ff + 70, again)
    check("A after game over: title screen", len(cells(r4, HEAD)) + len(cells(r4, BODY)), 0)
    r5 = run(part, ff + 90, again + [(ff + 75, ff + 77, 0x10)])
    check("A again: a new game of three cells", len(cells(r5, HEAD)) + len(cells(r5, BODY)), 3)
    held = run(part, ff + 90, inp + turn + [(ff + 62, ff + 90, 0x10)])
    check("A held down causes one transition only", len(cells(held, HEAD)) + len(cells(held, BODY)), 0)

print("FAILED: " + ", ".join(FAIL) if FAIL else "all Verm1 checks passed")
sys.exit(1 if FAIL else 0)
