#!/usr/bin/env python3
"""Checks that the Italian textbook is in step with the English one (the reference) and that both
books agree with their slide decks.

    python3 textbook/check_editions.py        (from tools/, after quiz_glossary.js)

1. Structure: every file of en/textbook has its counterpart in it/textbook with the same labels,
   references, citations, listings and figures, environments and hexadecimal constants.
2. Decks: the questions, the options and the glossary of every chapter are those of the deck of the
   same language (from which Appendix E is generated).
Differences in the other numbers are printed as a hint and do not fail the check: a translation
writes "anni Ottanta" for "1980s" and "pone a 1" for "sets".
"""
import collections, difflib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
C = collections.Counter
STRICT = ("label", "ref", "cite", "files", "env", "hex")


def feats(t):
    t = re.sub(r"(?<!\\)%.*", "", t)
    u = re.sub(r"(?<=\d),(?=\d)", ".", t.replace("\\,", ""))
    return {
        "label": C(re.findall(r"\\label\{([^}]*)\}", t)),
        "ref": C(re.findall(r"\\(?:eq)?ref\{([^}]*)\}", t)),
        "cite": C(x for m in re.findall(r"\\cite[tp]?\{([^}]*)\}", t) for x in m.split(",")),
        "files": C(re.findall(r"\{((?:code/|[\w.-]+\.(?:png|jpg|jpeg))[^}]*)\}", t)),
        "env": C(re.findall(r"\\begin\{([a-zA-Z*-]+)\}", t)),
        "hex": C(re.findall(r"\\hex\{([^}]*)\}", t)),
        "numbers": C(re.findall(r"\d+(?:\.\d+)?", u)),
    }


def norm(s):
    s = re.sub(r"\\(?:code|ins|reg|key|fname|texttt|emph|text|mathit)\{([^{}]*)\}", r"\1", s)
    s = re.sub(r"\\hex\{([^{}]*)\}", r"0x\1", s)
    for _ in range(2):
        s = re.sub(r"\\nott\{([^{}]*)\}", r"\1'", s)
    for a, b in (("\\riscv", "RISC-V"), ("\\prg", "PRG32"), ("\\Omega", "Ω"), ("\\times", "x"), ("\\cdot", "."),
                 ("\\,", ""), ("\\_", "_"), ("\\`a", "à"), ("\\`u", "ù")):
        s = s.replace(a, b)
    return re.sub(r"[\\${}~\s.,:;'()]", "", s).lower()


bad = hints = 0
for sub in ("chapters", "appendices", "frontmatter"):
    for e in sorted((ROOT / "en" / "textbook" / sub).glob("*.tex")):
        i = ROOT / "it" / "textbook" / sub / e.name
        if not i.exists():
            print("MISSING it/textbook/%s/%s" % (sub, e.name)); bad += 1; continue
        a, b = feats(e.read_text(encoding="utf-8")), feats(i.read_text(encoding="utf-8"))
        generated = e.name in ("app_answers.tex", "app_glossary.tex")
        for k in a:
            if a[k] == b[k] or (generated and k == "numbers"):
                continue
            line = "%-38s %-8s en only %s  it only %s" % (e.name, k, dict(a[k] - b[k]), dict(b[k] - a[k]))
            if k in STRICT:
                print("FAIL " + line); bad += 1
            else:
                print("hint " + line[:230]); hints += 1

checked = 0
for lang in ("en", "it"):
    decks = {d["n"]: d for d in json.load(open(ROOT / "tools" / "textbook" / ("quiz_glossary.%s.json" % lang), encoding="utf-8"))}
    for f in sorted((ROOT / lang / "textbook" / "chapters").glob("ch*.tex")):
        n, t = int(f.name[2:4]), f.read_text(encoding="utf-8")
        qs, dq = re.findall(r"\\begin\{quiz\}\{(.*?)\}\n(.*?)\\end\{quiz\}", t, re.S), decks[n]["quiz"]
        if len(qs) != len(dq):
            print("FAIL %s %s: %d questions, the deck has %d" % (lang, f.name, len(qs), len(dq))); bad += 1; continue
        for (q, body), d in zip(qs, dq):
            opts = [o.strip() for o in re.split(r"\\item", body)[1:]]
            if len(opts) != len(d["opts"]):
                print("FAIL %s %s: options of \"%s\"" % (lang, f.name, d["q"][:50])); bad += 1; continue
            for x, y in [(q, d["q"])] + list(zip(opts, d["opts"])):
                checked += 1
                if difflib.SequenceMatcher(None, norm(x), norm(y)).ratio() < 0.8:
                    print("FAIL %s %s\n     book: %s\n     deck: %s" % (lang, f.name, x[:110], y[:110])); bad += 1
        g = re.search(r"\\begin\{glossarytable\}(.*?)\\end\{glossarytable\}", t, re.S)
        rows = {tuple(norm(x) for x in r.split("&")) for r in g.group(1).split("\\\\") if "&" in r} if g else set()
        drows = {(norm(x), norm(y)) for x, y in decks[n]["gloss"]}
        if rows != drows:
            print("FAIL %s %s glossary: book only %s, deck only %s" % (lang, f.name, sorted(rows - drows)[:3], sorted(drows - rows)[:3])); bad += 1

print("%d quiz items checked, %d hint(s), %d failure(s)" % (checked, hints, bad))
sys.exit(1 if bad else 0)
