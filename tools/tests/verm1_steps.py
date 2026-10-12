#!/usr/bin/env python3
"""Build and run the intermediate programs of the Verm1 tutorials: the "Run it" checkpoints that a student
reaches in the middle of a deck, made of regions of two parts plus the temporary code in verm1/steps.

    export PRG32_HOME=~/PRG32  PRG32QT_HEADLESS=~/PRG32-QT/build-macos/prg32qt-headless
    python3 tests/verm1_steps.py          # needs riscv32-esp-elf-gcc on the PATH
"""
import os, re, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent.parent / "verm1"
PRG, HL = os.environ["PRG32_HOME"], os.environ["PRG32QT_HEADLESS"]
TMP = Path(tempfile.mkdtemp())
FAIL = []

def regions(part):
    out, name = {}, None
    for line in (SRC / f"verm1_part{part}.S").read_text().split("\n"):
        m = re.match(r"#@ (.+)$", line)
        if m:
            name = m.group(1); out[name] = []
        elif name:
            out[name].append(line)
    return {k: "\n".join(v) for k, v in out.items()}

P = {n: regions(n) for n in (1, 2, 3, 4)}
stub = lambda n: (SRC / "steps" / f"{n}.S").read_text()

def compose(base, replace=(), after=None, drop=(), extra=()):
    """Regions of part `base` in file order; `replace` = (part, names) taken from another part;
    `after` = {name: [(part, new region), ...]} inserted after a region; `extra` = text put before the data."""
    rep = {n: p for p, names in replace for n in names}
    parts = []
    for name in P[base]:
        if name.startswith("data"):
            parts += list(extra); extra = ()
        if name not in drop:
            parts.append(P[rep.get(name, base)][name])
        for p, n in (after or {}).get(name, []):
            parts.append(P[p][n])
    return "\n".join(parts) + "\n"

def run(name, text, frames, inputs=()):
    src, cart, ppm = TMP / f"{name}.S", TMP / f"{name}.prg32", TMP / f"{name}.ppm"
    src.write_text(text)
    r = subprocess.run([sys.executable, "-m", "prg32", "cartridge", "build", str(src), "--portable", "--entry-prefix", "verm1",
                        "--name", "verm1", "--out", str(cart)], cwd=PRG, capture_output=True, text=True)
    if r.returncode or not cart.exists():
        raise SystemExit(f"BUILD FAILED {name}\n{r.stdout[-1500:]}{r.stderr[-1500:]}")
    args = [HL, str(cart), str(frames)]
    for a, b, m in inputs:
        for f in range(a, b):
            args += ["--input", f"{f}:{m}"]
    r = subprocess.run(args + ["--dump-ppm", str(ppm)], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(f"RUN FAILED {name}\n{r.stdout}{r.stderr}")
    d = ppm.read_bytes().split(b"\n", 3)
    return {"w": int(d[1].split()[0]), "px": d[3]}

def at(r, x, y):
    i = (y * r["w"] + x) * 3
    return tuple(r["px"][i:i + 3])

def cells(r, pred):
    return [(c, row) for row in range(24) for c in range(40) if pred(at(r, c * 8 + 4, row * 8 + 12))]

GREEN = lambda p: p[1] > 100 and p[0] < 60 and p[2] < 60          # head or body
FOOD = lambda p: p[0] > 200 and p[1] < 60 and p[2] < 60
WHITE = lambda r, x0, x1, y0, y1: sum(1 for y in range(y0, y1) for x in range(x0, x1) if at(r, x, y) == (255, 255, 255))

def check(what, got, want):
    ok = got == want
    print(f"  {'ok  ' if ok else 'FAIL'} {what}: {got}" + ("" if ok else f"  (expected {want})"), flush=True)
    if not ok:
        FAIL.append(what)

A = [(5, 7, 0x10)]

print("part 2, after step 2: steering, with the init and the draw of part 1")
t = compose(2, replace=[(1, ["init", "draw"])], drop=["step-eat", "food", "sound", "draw-cells", "draw-cell"], extra=[stub("p2_step_end")])
t = t.replace(P[2]["step-wrap"], P[2]["step-wrap"] + "\n" + stub("p2_step_end")).replace(stub("p2_step_end") + "\n" + P[2]["data"], P[2]["data"])
check("DOWN held 64 frames", cells(run("p2a", t, 64, [(0, 64, 8)]), GREEN), [(5, 22)])
check("LEFT held: the U-turn is refused", cells(run("p2a", t, 64, [(0, 64, 1)]), GREEN), [(15, 12)])

print("part 3, after step 2: the three states, with stubs")
keep = ["constants", "init", "update", "update-states", "draw", "draw-over", "draw-cell", "data", "data-ram"]
t = compose(3, replace=[(2, ["food", "sound"])], drop=[n for n in P[3] if n not in keep + ["food", "sound"]], extra=[stub("p3_stubs_a")])
r = run("p3a", t, 5)
check("title: PRESS A on screen", WHITE(r, 120, 200, 96, 104) > 20, True)
r = run("p3a", t, 12, A)
check("after A: no invitation, no worm, food drawn", (WHITE(r, 120, 200, 96, 104), len(cells(r, GREEN)), len(cells(r, FOOD))), (0, 0, 1))

print("part 3, after step 3: a worm that stands still")
keep += ["new-game-memory", "new-game-state", "draw-worm", "draw-score"]
t = compose(3, replace=[(2, ["food", "sound"])], drop=[n for n in P[3] if n not in keep + ["food", "sound"]], extra=[stub("p3_stubs_b")])
r1, r2 = run("p3b", t, 12, A), run("p3b", t, 80, A)
check("after A: three cells in row 12", cells(r1, GREEN), [(3, 12), (4, 12), (5, 12)])
check("nothing moves", r1["px"] == r2["px"], True)

print("part 4, after step 1: the score in digits")
t = compose(3, replace=[(4, ["draw-score", "data-ram"])], after={"draw-score": [(4, "to-decimal")]})
r = run("p4a", t, 12, A)
check("digits and BEST in the title line", (WHITE(r, 56, 80, 0, 8) > 20, WHITE(r, 256, 320, 0, 8) > 40), (True, True))
check("three cells", len(cells(r, GREEN)), 3)

print("part 4, after step 2: levels")
t = compose(3, replace=[(4, ["draw-score", "data-ram", "constants", "play-timer"])], after={"draw-score": [(4, "to-decimal")]})
r = run("p4b", t, 12 + 64, A)
check("32/256 per frame: 8 steps in 64 frames", max(cells(r, GREEN)), (5 + 8, 12))

print("part 4, after step 3: step records what changed, sounds")
t = compose(3, replace=[(4, ["draw-score", "data-ram", "constants", "play-timer", "step-head", "step-tail", "step-collide", "step-insert", "sound"])],
            after={"draw-score": [(4, "to-decimal")], "step-insert": [(4, "step-score"), (4, "game-over")]})
r = run("p4c", t, 12 + 64, A)
check("still 8 steps in 64 frames, three cells", (max(cells(r, GREEN)), len(cells(r, GREEN))), ((13, 12), 3))
turn = [(20, 28, 8), (28, 36, 1), (36, 44, 4)]
r2, r3 = run("p4c", t, 400, A + turn), run("p4c", t, 430, A + turn)
check("a worm of three cannot bite itself: still moving", r2["px"] != r3["px"], True)

print("FAILED: " + ", ".join(FAIL) if FAIL else "all Verm1 step checks passed")
sys.exit(1 if FAIL else 0)
