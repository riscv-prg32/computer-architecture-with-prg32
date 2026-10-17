# Lecture 10: Introduction to Electronics and Digital Electronics: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: pull-up inputs; voltage, current, Ohm's law; the transistor as a switch; from volts to bits; CMOS gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: the clock (Lecture 13). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) explain how a MOS transistor works as a switch and how CMOS builds a gate; (2) read logic levels and noise margins from voltages; (3) size the resistor of an LED and explain the pull-up of a button. Builds on: only what Lecture 01 set up. Next: Lecture 11, Combinational Machines.

Bridge. In Lecture 02 the counter survived from one frame to the next in memory, not in a register. Today a memory cell costs about 6 transistors and a flip-flop about 20: remembering a bit is a circuit. Lecture 13 shows how latches and flip-flops keep a bit. Recall: Where did the counter of Lecture 02 live between two frames, and why not in t1?

Closing thread: A bit is a voltage inside a guaranteed range, and a gate is a few switches: the button of the kit is now a circuit you understand. Next: the machines built from gates.

## Slide 1: Introduction to Electronics and Digital Electronics: the code

This is the code deck of Lecture 10. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l10.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One button, one bit

The warm-up. In the program a pressed button reads as 1. On the board, however, the LEFT button is a switch between a pin of the chip, GPIO18, and ground: when pressed the pin is at 0 volts, when released at 3.3 volts. Pressed therefore means 0 volts, and yet the program reads 1. The four callouts turn this apparent contradiction into the questions of the lecture: what is a volt, why does the released pin sit at 3.3 V, and what decides that 0 V is a bit? The final section of the lecture answers all four.

## Slide 4: From the finger to the bit

The complete journey in seven steps. The finger closes the switch; the pin falls to 0 V in less than a microsecond; the input buffer sees a voltage below its threshold, a logic 0; the level is captured in a flip-flop; the firmware reads it with a load instruction, inverts it and packs it with the other buttons; the program tests it with `andi`. The right-hand column indicates where each step is explained: three in this lecture, the others in lectures already attended or still to come. Seven layers of abstraction separate a finger from a bit, and the course traverses all of them.

## Slide 5: The kit as a circuit

The kit considered as a circuit. A breadboard has holes connected in rows beneath its surface, so that components can be joined without soldering. Two long rails carry the supply, 3.3 V and ground, and a separate rail carries 5 V for the audio amplifiers. Every component shares the same ground: without a common reference the voltages of two parts would bear no relation to each other. Buttons connect a pin to ground; the display and the amplifiers receive digital signals. A pin driven high must never be connected directly to ground, since the resulting short circuit would draw an excessive current.

## Slide 6: The complete program: l10.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l10.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l10.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 10: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 11: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 12: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 13: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 14: Exercises: paper first, then the kit

Five exercises. Size the resistor for a blue LED and compute the power it dissipates. Compute the output of a voltage divider and determine how an input of the kit would read it, by comparison with the two thresholds. Draw a three-input NAND and count its transistors. Verify the NOR on the drawing by enumerating the input combinations. And on the kit, with the lamps cartridge running, connect a button pin to ground with a wire: the observation is to be explained, together with what would happen in the absence of the pull-up.
