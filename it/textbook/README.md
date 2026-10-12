# Architettura dei calcolatori: prima programmare, poi formalizzare

Libro di testo di ARC12, *Architettura dei Calcolatori e Laboratorio di Architettura
dei Calcolatori*, Università degli Studi di Napoli "Parthenope", A.A. 2026/27.
Edizione italiana di *Computer Architecture: Program First, Formalise Later*
(`../../en/textbook`), che resta l'edizione di riferimento. Sorgente LaTeX, pronto per
Overleaf. 412 pagine.

Il libro segue una a una le 25 presentazioni in `../slides`: **il Capitolo N è la
Lezione N** (i capitoli sono numerati da 0, come le lezioni).

Autore: Raffaele Montella. L'implementazione di riferimento di Verm1, il progetto del
corso (i quattro programmi dell'Appendice D), è un contributo di Giuseppe Coviello.

## Compilare

**Overleaf.** *New Project → Upload Project*, scegliere
`ARC12-Architettura-dei-calcolatori-libro.zip` (in questa cartella). Il documento
principale è `main.tex`, il compilatore è **pdfLaTeX**, la bibliografia usa BibTeX con
lo stile `plainnat-it.bst`, incluso.

**In locale.**

```bash
latexmk -pdf main.tex
```

Il PDF compilato è `Architettura_dei_calcolatori-Prima_programmare_poi_formalizzare.pdf`.

## Rapporto con l'edizione inglese

Le due edizioni hanno la stessa struttura, gli stessi nomi di file e le stesse
etichette (`\label`), così che un capitolo si confronta con il suo originale riga per
riga. Cambiano il testo, `arc12style.sty` (babel italiano, virgola decimale, stringhe
fisse) e lo stile della bibliografia.

- **Listati.** `code/lNN/sKK.*` sono esportati dalle presentazioni italiane
  (`../../tools/decks/it`) e sono identici a quelli dell'edizione inglese, commenti
  compresi: sono il codice provato da `../../tools/tests`. Fa eccezione l'unico
  listato di solo testo (`code/l19/s04.txt`), che è tradotto.
- **Figure.** Le stesse dell'edizione inglese (`figures/`), con le etichette dei
  diagrammi TikZ tradotte.
- **Appendici E e F** (risposte e glossario) sono generate dalle presentazioni
  italiane; non vanno modificate a mano:

  ```bash
  cd ../../tools
  node textbook/export_listings.js it
  node textbook/quiz_glossary.js && python3 textbook/gen_appendices.py it
  ```

Quando cambia un capitolo inglese, va aggiornato il capitolo italiano con lo stesso
nome di file. Domande, opzioni e glossari dei capitoli devono coincidere con quelli
delle presentazioni italiane, da cui è generata l'Appendice E.
