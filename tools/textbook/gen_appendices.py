#!/usr/bin/env python3
"""Generates <lang>/textbook/appendices/app_answers.tex and app_glossary.tex from
tools/textbook/quiz_glossary.<lang>.json (written by quiz_glossary.js).

    node textbook/quiz_glossary.js && python3 textbook/gen_appendices.py [en|it]      (from tools/)

Without a language both books are generated.  What depends on the language (the short chapter titles,
the prose, the word for "Lecture" and the answers typeset by hand) is in the table L below.
"""
import json, os, re, sys

LANGS = ("en", "it")
if len(sys.argv) < 2:
    for l in LANGS:
        if os.spawnv(os.P_WAIT, sys.executable, [sys.executable, os.path.abspath(__file__), l]):
            raise SystemExit(1)
    raise SystemExit(0)
LANG = sys.argv[1]
if LANG not in LANGS:
    raise SystemExit("usage: gen_appendices.py [%s]" % "|".join(LANGS))
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(os.path.dirname(os.path.dirname(HERE)), LANG, "textbook")
with open(os.path.join(HERE, "quiz_glossary.%s.json" % LANG), encoding="utf-8") as f:
    decks = json.load(f)


def write(name, text):
    with open(os.path.join(ROOT, "appendices", name), "w", encoding="utf-8") as f:
        f.write(text)


L = {"en": {
    "titles": {1: "Setting Up", 2: "First Contact", 3: "History of Computing", 4: "Digital Information",
               5: "Integers", 6: "Real Numbers", 7: "Verm1, Part 1", 8: "Boolean Algebra: Operators and Properties",
               9: "Boolean Algebra: Functions and Minimisation", 10: "Electronics", 11: "Combinational Machines",
               12: "Verm1, Part 2", 13: "Sequential Machines", 14: "Registers and Buses", 15: "Memory",
               16: "Permanent Memory", 17: "Verm1, Part 3", 18: "The Processor", 19: "Instructions and Interrupts",
               20: "Buses and the Video Card", 21: "Input and Output", 22: "Verm1, Part 4",
               23: "The Cartridge Store", 24: "Beyond One Core"},
    # Answers whose Boolean notation is typeset by hand (the decks write x' for the complement).
    "patches": [
        ("\\emph{a' + b.} (a . b')' = a' + (b')' = a' + b, using involution on the second term.",
         "\\emph{$\\nott{a}+b$.} $\\nott{a\\cdot\\nott{b}}=\\nott{a}+\\nott{\\nott{b}}=\\nott{a}+b$, using involution on the second term."),
        ("\\emph{AB'C.} Row 5 is 101: A = 1, B = 0, C = 1, so the minterm is A B' C.",
         "\\emph{$A\\,\\nott{B}\\,C$.} Row 5 is 101: $A=1$, $B=0$, $C=1$, so the minterm is $A\\,\\nott{B}\\,C$."),
        ("$2^{$2^{3}$}$ = $2^{8}$ = 256.", "$2^{2^{3}}=2^{8}=256$."),
        ("1.1 (binary) x $2^{128-127}$ = 1.5 $\\times$ 2 = 3.0.", "$1.1_2\\times 2^{128-127}=1.5\\times 2=3.0$."),
        ("AB + Cin(A $\\oplus$ B) = AB + ACin + BCin", "$AB+C_{in}(A\\oplus B)=AB+AC_{in}+BC_{in}$"),
        ("Cout is the majority function", "$C_{out}$ is the majority function"),
    ],
    "lecture": (r"\bLecture(s?) 0?(\d+)", lambda m: "Chapter%s~%s" % (m.group(1), m.group(2))),
    "range": (r"(Chapters~\d+ (?:and|to|or)) 0?(\d+)", r"\1~\2"),
    "chapter": "Chapter",
    "answers": ("E -- Answers to the questions", "Answers to the Questions", [
        "Each topical and tutorial chapter ends with multiple-choice questions in the",
        "style of the midterm test (section \\emph{Check your understanding}). The",
        "answers follow: the letter, the text of the right option, and a line of",
        "explanation. Answer first, and read afterwards: a question whose answer has",
        "been read teaches nothing."]),
    "glossary": ("F -- English-Italian glossary", "English--Italian Glossary", [
        "The course is taught in a bilingual setting: the lectures are in Italian, and",
        "the slides, this book and the technical documentation are in English. This",
        "glossary gathers, in alphabetical order, the terms of the glossaries that close",
        "the chapters, with the chapter in which each is introduced."],
        ("English", "Italiano", "Ch.")),
}, "it": {
    "titles": {1: "L'installazione", 2: "Primo contatto", 3: "Storia della computazione", 4: "Informazione digitale",
               5: "Gli interi", 6: "I reali", 7: "Verm1, parte 1", 8: "Algebra di Boole: operatori e proprietà",
               9: "Algebra di Boole: funzioni e minimizzazione", 10: "Elettronica", 11: "Macchine combinatorie",
               12: "Verm1, parte 2", 13: "Macchine sequenziali", 14: "Registri e bus", 15: "La memoria",
               16: "La memoria permanente", 17: "Verm1, parte 3", 18: "Il processore", 19: "Istruzioni e interruzioni",
               20: "I bus e la scheda video", 21: "Ingresso e uscita", 22: "Verm1, parte 4",
               23: "Il Cartridge Store", 24: "Oltre un solo core"},
    "patches": [
        ("\\emph{a' + b.} (a . b')' = a' + (b')' = a' + b, usando l'involuzione sul secondo termine.",
         "\\emph{$\\nott{a}+b$.} $\\nott{a\\cdot\\nott{b}}=\\nott{a}+\\nott{\\nott{b}}=\\nott{a}+b$, usando l'involuzione sul secondo termine."),
        ("\\emph{AB'C.} La riga 5 è 101: A = 1, B = 0, C = 1, quindi il mintermine è A B' C.",
         "\\emph{$A\\,\\nott{B}\\,C$.} La riga 5 è 101: $A=1$, $B=0$, $C=1$, quindi il mintermine è $A\\,\\nott{B}\\,C$."),
        ("$2^{$2^{3}$}$ = $2^{8}$ = 256.", "$2^{2^{3}}=2^{8}=256$."),
        ("1,1 (binario) x $2^{128-127}$ = 1,5 $\\times$ 2 = 3,0.", "$1,1_2\\times 2^{128-127}=1,5\\times 2=3,0$."),
        ("AB + Cin(A $\\oplus$ B) = AB + ACin + BCin", "$AB+C_{in}(A\\oplus B)=AB+AC_{in}+BC_{in}$"),
        ("Cout è la funzione di maggioranza", "$C_{out}$ è la funzione di maggioranza"),
    ],
    "lecture": (r"\bLezion([ei]) 0?(\d+)", lambda m: "Capitol%s~%s" % ("o" if m.group(1) == "e" else "i", m.group(2))),
    "range": (r"(Capitoli~\d+ (?:e|a|o)) 0?(\d+)", r"\1~\2"),
    "chapter": "Capitolo",
    "answers": ("E -- Risposte alle domande", "Risposte alle domande", [
        "Ogni capitolo tematico e ogni capitolo tutorial termina con domande a scelta",
        "multipla nello stile della prova intercorso (paragrafo \\emph{Verificate di aver",
        "capito}). Seguono le risposte: la lettera, il testo dell'opzione giusta, e una",
        "riga di spiegazione. Prima rispondete, e poi leggete: una domanda di cui si è",
        "letta la risposta non insegna niente."]),
    "glossary": ("F -- Glossario inglese-italiano", "Glossario inglese--italiano", [
        "La documentazione tecnica, i nomi delle istruzioni e buona parte della",
        "letteratura sono in inglese. Questo glossario raccoglie, in ordine alfabetico",
        "del termine inglese, i termini dei glossari che chiudono i capitoli, con il",
        "capitolo in cui ciascuno è introdotto."],
        ("Inglese", "Italiano", "Cap.")),
}}[LANG]
TITLES, PATCHES = L["titles"], L["patches"]


def esc(s):
    s = s.replace("\\", "\\textbackslash{}")
    for a, b in [("&", "\\&"), ("%", "\\%"), ("#", "\\#"), ("_", "\\_")]:
        s = s.replace(a, b)
    s = s.replace("Ω", "$\\Omega$").replace("µ", "$\\mu$").replace("~", "\\textasciitilde{}")
    s = re.sub(r"ceil\(log2 (\w+)\)", r"$\\lceil\\log_2 \1\\rceil$", s)
    s = re.sub(r"([\w.]+)\^\(([^)]+)\)", r"$\1^{\2}$", s)
    s = re.sub(r"([\w.]+)\^(-?\w+)", r"$\1^{\2}$", s)
    s = re.sub(r"(?<=[\w)]) x (?=[\w(])", r" $\\times$ ", s)
    s = s.replace("<=", "$\\le$").replace(">=", "$\\ge$")
    s = re.sub(r" < ", r" $<$ ", s)
    s = re.sub(r" > ", r" $>$ ", s)
    # The decks say "Lecture NN"; in the book the same thing is "Chapter N".
    if LANG == "it":
        s = re.sub(r"(?<![\d.,])([1-9]\d{0,2})((?:\.\d{3})+)(?![\d.])", lambda m: m.group(1) + m.group(2).replace(".", "\\,"), s)
    s = re.sub(L["lecture"][0], L["lecture"][1], s)
    s = re.sub(L["range"][0], L["range"][1], s)
    return s.replace(" xor ", " $\\oplus$ ")


RULE = "% " + "=" * 76
A, G = L["answers"], L["glossary"]
out = [RULE, "%  Appendix " + A[0] + " (generated by tools/gen_appendices.py", "%  from the slide decks, where they are the speaker notes of the quiz slides)", RULE,
       "\\chapter{%s}" % A[1], "\\label{app:answers}", ""] + A[2] + [""]
for d in decks:
    if not d["quiz"]:
        continue
    out.append("\\section*{%s %d: %s}" % (L["chapter"], d["n"], TITLES[d["n"]]))
    out.append("\\begin{description}[leftmargin=3.2em,labelwidth=2.6em,itemsep=3pt]")
    for i, q in enumerate(d["quiz"], 1):
        opt = esc(q["opts"][q["ans"]]).rstrip(".")
        out.append("\\answer{%d.%d}{%s}{\\emph{%s.} %s}" % (d["n"], i, "ABCDEF"[q["ans"]], opt, esc(q["why"])))
    out.append("\\end{description}\n")
text = "\n".join(out)
for a, b in PATCHES:
    if a not in text:
        raise SystemExit("patch no longer applies: " + a[:60])
    text = text.replace(a, b)
write("app_answers.tex", text)

gloss = {}
for d in decks:
    for en, it in d["gloss"]:
        gloss.setdefault((en.strip(), it.strip()), []).append(d["n"])
rows = sorted(gloss.items(), key=lambda kv: kv[0][0].lower())
o = [RULE, "%  Appendix " + G[0] + " (generated by tools/gen_appendices.py)", RULE,
     "\\chapter{%s}" % G[1], "\\label{app:glossary}", ""] + G[2] + ["",
     "{\\small", "\\begin{longtable}{@{}p{0.4\\textwidth}p{0.44\\textwidth}r@{}}", "\\toprule",
     "\\textbf{%s} & \\textbf{%s} & \\textbf{%s}\\\\" % G[3], "\\midrule", "\\endhead", "\\bottomrule", "\\endfoot"]
for (en, it), ns in rows:
    o.append("%s & %s & %s\\\\" % (esc(en), esc(it), ", ".join(str(n) for n in sorted(set(ns)))))
o += ["\\end{longtable}}", ""]
write("app_glossary.tex", "\n".join(o))
print(LANG, "answers:", sum(len(d["quiz"]) for d in decks), " glossary entries:", len(rows))
