# Learning status: design guide / Stato di apprendimento: guida grafica

The course programs first and formalises later, so every lecture shows more than it explains. Each slide that
matters says what the student is expected to do with it **by the end of the lecture**. The three states are
expectations in time, not levels of difficulty.

Il corso prima programma e poi formalizza, quindi ogni lezione mostra più di quanto spieghi. Ogni slide che
conta dice che cosa ci si aspetta che lo studente sappia farne **alla fine della lezione**. I tre stati sono
attese nel tempo, non livelli di difficoltà.

| State (id) | English | Italiano | The student... / Lo studente... |
| --- | --- | --- | --- |
| `understand-now` | UNDERSTAND NOW | DA COMPRENDERE OGGI | explains, traces by hand and applies it on their own / lo spiega, lo segue a mano, lo applica da solo |
| `use-now` | USE NOW | DA UTILIZZARE OGGI | follows and uses the recipe; the inside comes later, or is not a subject of the course / segue e usa la ricetta; l'interno viene dopo, o non è oggetto del corso |
| `understand-later` | UNDERSTAND LATER | DA COMPRENDERE PIÙ AVANTI | recognises the name and the purpose; a named later lecture explains it / riconosce il nome e lo scopo; lo spiega una lezione successiva indicata |

A slide without a badge is context: a story, an example, a question, an exercise.
Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## The badge / L'etichetta

```
 ▌📖 UNDERSTAND NOW · registers                       solid frame, solid bar, book
 ▌▌🔧 USE NOW · the calling convention → Lecture 18     solid frame, double bar, wrench
 ⁞ 🕓 UNDERSTAND LATER · instruction formats → Lecture 19   dashed frame, dotted bar, clock
```

- **Where.** In the free band above the slide title (y = 0.10 to 0.40 in), right-aligned to the margin, on light
  and dark slides alike. Nothing else of the layout lives in that band, so a badge never covers a title, a
  listing, a figure or the footer; `textbook/check_mastery.js` verifies it on every built slide.
  *Dove: nella fascia libera sopra il titolo, allineata a destra; nient'altro vi è disegnato.*
- **How many.** One per slide, two at most (for a slide that mixes, e.g. *understand* the registers and *use* the
  calling convention). Never on questions, exercises, glossaries and summaries. A range of slides (a whole
  conceptual block) can be marked at once in `decks/mastery.js`.
  *Quante: una per slide, al massimo due; mai su domande, esercizi, glossari e riepiloghi.*
- **What it says.** The state in bold capitals, then the concept (its label in `registry.json`), then, for USE
  NOW and UNDERSTAND LATER, the lecture that explains it. With more than two concepts only the destinations are
  shown ("→ Lectures 04–19"); the notes name them all.
  *Che cosa dice: lo stato, il concetto, e la lezione che lo spiega.*
- **Legend.** On every cover, the three badges without a concept; the notes of the cover explain them and list
  the concepts of the lecture by state; the notes of the last slide of the lecture deck repeat the list as a
  recap. Each marked slide has one sentence in its notes ("USE NOW: the calling convention (studied in Lecture 18).").
  *Legenda: sulla copertina; nelle note della copertina e, come riepilogo, dell'ultima slide.*
- **Book.** Each chapter opens, after "In this chapter", with the box *Learning status of this chapter* /
  *Stato di apprendimento di questo capitolo* (`code/lNN/status.tex`, generated); "How to Use This Book" explains
  the badges. The LaTeX macro is `\masterychip{now|use|later}{text}` in `arc12style.sty`.

## Colour and accessibility / Colore e accessibilità

| State | Text | Background | Bar and frame | Text on background | Bar on background | Bar on white slide |
| --- | --- | --- | --- | ---: | ---: | ---: |
| understand-now | `#075985` | `#E0F2FE` | `#0369A1` | 6.59:1 | 5.17:1 | 5.93:1 |
| use-now | `#92400E` | `#FEF3C7` | `#B45309` | 6.37:1 | 4.51:1 | 5.02:1 |
| understand-later | `#6B21A8` | `#F3E8FF` | `#7E22CE` | 7.39:1 | 5.92:1 | 6.98:1 |

The ratios are computed by `textbook/check_mastery.js` at every run (they are printed in `coverage.md`), which
fails below WCAG AA: 4.5:1 for text, 3:1 for the bar. The hues are the starting tokens of the brief (blue, amber,
violet), darkened for the text. **Colour is never the only cue**: the label is always written, and the state is
repeated by two shapes that survive grey print, projectors and colour-vision differences — the left bar (solid,
double, dotted) with the frame (solid, solid, dashed), and the icon (book, wrench, clock).

*I rapporti di contrasto sono calcolati a ogni verifica; il colore non è mai l'unico indizio: testo, barra
(continua, doppia, a punti), cornice (continua, continua, tratteggiata) e icona (libro, chiave inglese, orologio).*

## Data, not decoration / Dati, non decorazione

| File | What it holds |
| --- | --- |
| `concepts/registry.json` (schema `registry.schema.json`) | one entry per concept: stable id, English and Italian label, `intro` (first exposure), `use` (first use), `formal` (the lecture that explains it, or `null` with a `reason`), `practice` (questions and exercises that check it), `review` (an issue left to the author) |
| `decks/mastery.js` | for each lecture, the slides of the specification that carry a status, in the numbering of `decks/plan.js`; one file for both languages, so the two editions cannot disagree |
| `lib/mastery.js` | the states, the labels in both languages, the style tokens, the drawing of the badges, the sentences of the notes |
| `textbook/check_mastery.js` | the checks, and the generated `coverage.md` |
| `tests/mastery_test.js` | unit tests of the parser and of the texts |

`intro`, `use` and `formal` are not opinions written twice: the checker recomputes them from `decks/mastery.js`
and fails if the registry disagrees. A badge UNDERSTAND LATER must point to a concept whose formal lecture comes
later; a concept that the course uses and never studies (the PRG32 tools, the runtime calls) must say why.

## How to mark a slide / Come marcare una slide

1. Read the slide and decide what the student must be able to do with it at the end of the lecture.
2. If the concept is new, add it to `registry.json` with both labels (at most 40 characters: they must fit in a
   badge) and the questions that check it.
3. Add the slide to `decks/mastery.js`: `14: "use logic.bitmask"`, `"6-9": "now num.base-conversion"`, or two badges
   `11: ["now abi.return-address", "later arch.stack"]`.
4. `node textbook/check_mastery.js` tells you the `intro` / `use` / `formal` to write in the registry, and fails
   on anything inconsistent. Then `node build.js`, `node notes.js`, `npm run textbook`.

If the judgement is doubtful, do not guess: write it in the `review` field of the concept. It is listed under
*Needs review* in `coverage.md`.
