# Lecture 02, first contact with assembly: facilitation guide

The first time most students meet a program. The lecture keeps a running program at its start and splits the rest
into short cycles: **observe, predict, explain one concept, run or trace, check, connect**. Slide numbers are those of
the lecture deck (the code deck is noted *Lab*).

## The learning contract (slide 2)

**Prerequisites:** only Lecture 01: what a program is, the terminal, PRG32-QT running.

**Outcomes, each with its check:**

| Outcome | Check |
| --- | --- |
| 1. Build and run a cartridge, and say when the runtime calls `init`, `update` and `draw` | checkpoint 1 (slide 8; item CP02.1) |
| 2. Read a line of assembly: label, instruction, operands, comment | exit ticket, question 1 (A02.1) |
| 3. Tell an address from a value, and trace what `la`, `lw`, `addi` and `sw` leave behind | checkpoint 2 (slide 14; item CP02.2) and the deck question on `la`/`lw` |

**Used today, not expected to be understood yet** (slide 15 lists them with their lecture): hexadecimal and binary
in depth (04, 05), the stack frame that saves `ra` (18), the calling convention (18), the encoding of an instruction
(19), the mask `andi 255` (08), pseudo-instructions beyond `li`, `la`, `mv`, `ret`.

## Concept by concept: what is asked today

| Concept | Today the student must | Status |
| --- | --- | --- |
| init / update / draw contract | say when each is called | understand |
| registers; compute, move, jump | say what a register holds; which instructions touch memory | understand |
| functions, call and return | say what `call` and `ret` do, where arguments go | understand |
| one line of assembly | name label, instruction, operands, comment, directive | understand |
| address and value; `la`, `lw`, `addi`, `sw` | trace them | understand |
| the trace by hand | fill in a row of the trace | understand |
| pseudo-instructions | know that `li` becomes `addi` | understand (light) |
| an instruction is a number | say that a program lives in memory as numbers | understand (light) |
| saving `ra`, the stack frame | copy the pattern; know that Lecture 18 explains it | use (Lab deck) |
| the calling convention, the roles of `s` registers | use `a0`-`a7` for arguments | use |
| hexadecimal, binary | read `0x1F`, recognise `0xFF` | use |
| the debugger | pause, step, read a register | use (Lab deck) |

## Plan of 90 minutes

| Min | Slides | Do | Pause and ask | Likely misconception |
| ---: | --- | --- | --- | --- |
| 0-5 | 1-2 | Run the finished program of the lecture: HELLO PRG32 and the green bar. Read the contract. | "What do you think makes the bar grow?" | |
| 5-15 | 3 | Binary and hexadecimal: just enough to read 0x1F. | "What is 0x10?" | 0x10 = 10 |
| 15-30 | 4-7 | The machine, the registers, functions, the contract. | | init runs every frame |
| 30-35 | 8 | **Checkpoint 1.** One minute alone, one with a neighbour, then show of hands. | "Who chose 60 for init? Why?" | add reads memory |
| 35-45 | 9 | How to read one line; then step 1 and the build (Lab). | "Which part of this line is ignored by the assembler?" | the comment is executed |
| 45-60 | 10-11 | Steps 2 and 3 (Lab), address or value (slide 10). Point at the badge on saving `ra`: *use now, Lecture 18*. | "After `la`, what is in t0?" | t0 holds 41 |
| 60-70 | 11-13 | Step 4, the instructions used, pseudo-instructions, an instruction is a number. | "Is `li` a real instruction?" | every word exists in hardware |
| 70-78 | 14 | **Checkpoint 2.** Three minutes on the two rows marked ?, then reveal them stepping in PRG32-QT. | "Who wrote 256 for the width?" | the mask is forgotten |
| 78-85 | 15-16 | *Not yet* (slide 15): say aloud that none of this is expected today. The closing map (slide 16). | "Which box explains the bar restarting?" | |
| 85-90 | 17-20 | Exit ticket, alone, on paper (questions in the notes of the last slide and in `exit-tickets.md`). | | |

## Recovering a student who cannot complete a step

- **The build fails.** Read the first line that says *error* together; nine times out of ten it is ESP-IDF not active
  (Lecture 01) or a typo in a label. Compare with the file `labs/05-asm-first-contact/stepN_*.S` of the step.
- **The program builds but shows nothing.** Check the entry prefix (`first`) and the three `.global` lines.
- **The student is lost in the explanation.** Point to the contract (slide 2): only three things are asked today. Let
  them complete the trace of checkpoint 2 with a neighbour; it is the outcome that matters most.
- **The student finishes early.** The exercises of the deck, or the question: "what would change if `counter` were in `.rodata`?"

## Toolchain facts the explanation must match

- `li t0, 42` is emitted as `addi t0, zero, 42`; `la` as `auipc` plus `addi`; `ret` as `jalr zero, 0(ra)`.
- `addi t1, t1, 1` is the word `0x00130313`.
- The runtime calls `first_init` once and `first_update`, `first_draw` once per frame; the prefix is given with
  `--entry-prefix first`. These facts are checked by `tools/tests` (encodings and the headless runner).
