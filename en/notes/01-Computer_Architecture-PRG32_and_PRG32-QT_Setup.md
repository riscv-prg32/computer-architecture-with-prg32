# Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the pieces of PRG32. USE NOW: the PRG32 tools, the PRG32-QT debugger, the complete program (used, not studied, in this course). UNDERSTAND LATER: the init, update, draw contract (Lecture 02); registers (Lecture 02). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: PRG32 and PRG32-QT: Setting Up Your Workshop

This lecture is a workshop in both senses of the word: a session of practical work, and the place in which all subsequent work will be done. It contains no theory. Its outcome is a configured environment: PRG32-QT running on the student's laptop, the RISC-V toolchain installed and verified, and a first cartridge built by the student and halted in the debugger. The epigraph about sharpening the axe justifies devoting two hours to tools: every later lecture presupposes that building and running a program costs a single command and a few seconds, so that attention can be spent on the ideas rather than on the procedure.

## Slide 2: What you will have by the end

Five outcomes, listed in the order in which they are reached: a conceptual picture of the platform; PRG32-QT installed; the toolchain installed and checked; one cartridge built and stopped in the debugger; and a repertoire of remedies for the usual failures. The list doubles as a checklist. The first two outcomes are sufficient to follow the course; the third and fourth must be in place before Lecture 02, in which the first program is written.

## Slide 3: Four levels: install what you need

The installation is stratified into four levels, not all of which are required. Level 1, PRG32-QT, takes about five minutes and allows any cartridge to be played and debugged. Level 2, ESP-IDF together with the PRG32 repository, is a substantial download and enables the student to build cartridges; it is required by everyone before Lecture 02. Level 3, the QEMU emulator, and level 4, the physical kit, are optional. The caption addresses an important concern of equity: the entire course can be followed with levels 1 and 2 alone, without purchasing any hardware.

## Slide 4: PRG32: a runtime, a file format, a set of tools

The name PRG32 designates four distinct artefacts. A *firmware*: the resident program that owns the display, the buttons and the audio. A *cartridge format*: a game packaged as a single small file. A *tool* on the development machine, the command `python3 -m prg32`, which builds, uploads and packages cartridges. And a *Store*, where finished games are published. The student's code is genuine 32-bit RISC-V machine code, and it interacts with the firmware through a contract of three functions: `init`, invoked once, and `update` and `draw`, invoked at every frame. Lecture 02 takes this contract as its starting point.

## Slide 5: From your file to the screen

The slide traces a program through its life cycle, from left to right. A source file is written in assembly or C. The RISC-V toolchain translates it into machine code. The result is a cartridge: a file containing code, data and a short header. The cartridge is transmitted over the network to a *host*, whose runtime then calls the three entry points. The first three stages take place on the student's laptop and require level 2; the last two take place on a host, which may be PRG32-QT, QEMU or the board. One and the same file runs on all three because it reaches the runtime indirectly, through a table of functions: the application binary interface, or ABI, of PRG32.

## Slide 6: The kit: a console on a breadboard

The kit is a small console assembled on a breadboard. Its core is an Espressif ESP32-C6, a chip with a single RISC-V core clocked at 160 MHz and an integrated Wi-Fi radio. Around it are a 2.8-inch colour display, one or two audio amplifiers, a joystick and a few buttons, each wired directly to a pin of the chip. Two numbers concerning the screen should be distinguished: the panel has 320 by 240 pixels, while games draw within a viewport of 320 by 200. Cartridges reach the board over Wi-Fi. A personal kit is not required to follow the course; the laboratory provides a number of them.

## Slide 7: Three ways to run the same cartridge

One cartridge, three hosts, compared row by row. On the board and in QEMU the code runs natively, on a physical or an emulated chip respectively; in PRG32-QT it is interpreted, one instruction at a time. The board and QEMU require the toolchain, whereas PRG32-QT does not, either for playing or for debugging. Single-stepping requires additional tools on the first two hosts and is built into the third. A useful heuristic follows: the board is the authority on timing, PRG32-QT the authority on the content of a register.

## Slide 8: PRG32-QT: the console on your laptop

PRG32-QT is the console realised as an application: it contains an interpreter of the RV32IMAC instruction set and offers the cartridge the same services as the firmware. Three features matter. The speed profiles in *Settings*: *Accurate*, the default, which reproduces the timing of the ESP32-C6; *Optimal*, at thirty frames per second; and *Unlimited*. The Store browser, which downloads and runs published cartridges. And the debugger, which displays the disassembly, the registers and memory, and executes one instruction at a time. *Accurate* is the profile to retain, since it reveals when a program would be too slow on the real chip.

## Slide 9: The controls, on a keyboard

On a keyboard the joystick is mapped to the arrow keys or to W, A, S, D; button A to Z or J; button B to X or K; Start and Select to Enter or Space. In PRG32-QT, Escape leaves the game and returns to *Setup*. One property of QEMU routinely surprises first-time users: keystrokes must be typed into the terminal from which QEMU was launched, not into the window displaying the image. A game that appears unresponsive in QEMU usually only requires the terminal to be given focus.

## Slide 10: One idea behind every installation

A single idea explains every installation step and nearly every failure. The compiler is distributed with ESP-IDF, Espressif's development framework, installed for two targets: `esp32c6`, the kit, and `esp32c3`, the emulated chip. ESP-IDF, however, is not active by default: each new terminal must activate it before its tools can be located. The box on the right shows the message every student will eventually encounter, `idf.py: command not found`. It does not indicate a broken installation; it indicates that ESP-IDF has not been activated in the terminal in use.

## Slide 11: Troubleshooting

The table is read from left to right: symptom, diagnosis, remedy. Its first row accounts for most cases: `idf.py: command not found` means that ESP-IDF is not active in the current terminal. `No module named prg32` means that the command was not issued from the PRG32 folder. A refused connection means that PRG32-QT is not running, or that a firewall is blocking port 8080. When asking for help, the command and the complete message should be supplied as text: a photograph of a screen can be neither searched nor copied.

## Slide 12: Ready for Lecture 02?

Five checks, one for each step completed: PRG32-QT runs a game from the Store; in a fresh terminal the doctor reports only OK; `cartridge build` produces `pong.prg32`; `upload-and-run` starts it; and in debug mode pausing and stepping work. For any check that fails, the last column names the step to repeat. Students who remain blocked should attend office hours or the laboratory, with their laptop, before Lecture 02.

## Slide 13: Check your understanding: In a new terminal, python3 -m prg32 doctor says: idf.py missing. What is the most likely cause? / Which host lets you run and debug a cartridge without installing a compiler?

Before answering the first question, consider what "a new terminal" implies. Nothing has been uninstalled, PRG32-QT plays no part in this command, and the doctor needs no board. Activation lasts only as long as the terminal in which it was performed, so a new terminal begins without it. The remedy is the routine one: `export.sh`, or the ESP-IDF PowerShell.

The second question separates two activities: building a cartridge and running one. A compiler is needed only for the former. The board and QEMU execute the real firmware, which must itself be compiled; PRG32-QT interprets the cartridge and provides its own debugger, and is therefore the only host that requires nothing further.

## Slide 14: Check your understanding: Why does the same pong.prg32 run on the board, on QEMU and on PRG32-QT?

The cartridge is neither recompiled nor a bundle of three programs. A portable cartridge does not call the firmware at fixed addresses: it calls through a table of functions, the ABI, and each host supplies its own implementation of that table. This is the meaning of the `--portable` option, and the reason why the file is identical in every column of the table comparing the three hosts. The principle, a stable interface separating a program from the system that runs it, will recur throughout the course.

## Slide 15: Glossary: English and Italian

Ten terms that recur in every document concerning PRG32, with the Italian usually employed in class. Three deserve particular attention. A *toolchain* is the sequence of programs that transforms source code into an executable: compiler, assembler and linker. *To flash* is to write a program into the flash memory of a chip. A *host* is the machine on which a cartridge runs: the board, QEMU or PRG32-QT.

## Slide 16: Summary and reading

Four propositions summarise the lecture. PRG32 is a runtime, a cartridge format, a tool and a Store, and a cartridge runs unchanged on three hosts. PRG32-QT suffices for playing and debugging; ESP-IDF and the repository are required for building. ESP-IDF must be activated in every new terminal. And the student has now completed the cycle on which the whole course rests: build, transmit, halt in the debugger. The recommended readings are the README files of the two repositories. Lecture 02 uses this workshop to write the first program in assembly.
