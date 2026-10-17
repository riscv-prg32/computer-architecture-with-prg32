# Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: program, source and machine code; the pieces of PRG32. USE NOW: the terminal, the PRG32 tools, the PRG32-QT debugger, the complete program (used, not studied, in this course). UNDERSTAND LATER: the init, update, draw contract (Lecture 02); registers (Lecture 02). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) explain the path from a source file to a running cartridge: source, translator, machine code, cartridge, host; (2) run a cartridge in PRG32-QT and build one with the terminal. Builds on: Lecture 00, and Starting from Zero for a reader who has never programmed. Next: Lecture 02, First Contact: RISC-V Assembly on PRG32.

Closing thread: You now own the whole cycle: write a source file, translate it, send the cartridge to a host, stop it in the debugger. Next: writing the source file yourself.

## Slide 1: PRG32 and PRG32-QT: Setting Up Your Workshop

This lecture is a workshop in both senses of the word: a session of practical work, and the place in which all subsequent work will be done. It contains no theory. Its outcome is a configured environment: PRG32-QT running on the student's laptop, the RISC-V toolchain installed and verified, and a first cartridge built by the student and halted in the debugger. The epigraph about sharpening the axe justifies devoting two hours to tools: every later lecture presupposes that building and running a program costs a single command and a few seconds, so that attention can be spent on the ideas rather than on the procedure.

## Slide 2: What you will have by the end

Five outcomes, listed in the order in which they are reached: a conceptual picture of the platform; PRG32-QT installed; the toolchain installed and checked; one cartridge built and stopped in the debugger; and a repertoire of remedies for the usual failures. The list doubles as a checklist. The first two outcomes are sufficient to follow the course; the third and fourth must be in place before Lecture 02, in which the first program is written.

## Slide 3: Four levels: install what you need

The installation is stratified into four levels, not all of which are required. Level 1, PRG32-QT, takes about five minutes and allows any cartridge to be played and debugged. Level 2, ESP-IDF together with the PRG32 repository, is a substantial download and enables the student to build cartridges; it is required by everyone before Lecture 02. Level 3, the QEMU emulator, and level 4, the physical kit, are optional. The caption addresses an important concern of equity: the entire course can be followed with levels 1 and 2 alone, without purchasing any hardware.

## Slide 4: What a program is

This slide assumes nothing, because most of the class has never written a program. A processor is a machine that executes instructions: small, exact orders such as "add these two numbers" or "copy this value". It executes hundreds of millions of them each second, but each one does very little. A program is a list of such instructions. Inside the computer the list is stored as numbers, and this numeric form is called machine code.

People do not write machine code. They write source code: an ordinary text file, in a programming language, which a translator then turns into machine code. For assembly, the language of this course, the translator is called an assembler; for C it is called a compiler. The box shows the same instruction in both forms. The line on top is what you will type; the number below, written in hexadecimal (Lecture 02 shows how to read it), is what the processor receives. The toolchain is the whole set of translators and helper programs. Installing it is the purpose of step 2.

## Slide 5: Firmware, runtime, host: who runs your program

A game does not run on an empty machine. On the kit, another program, the firmware, starts as soon as the board is switched on and stays in memory. It is kept in *flash* memory, the kind that keeps its contents when the power is off, as in a USB stick. It controls the screen, the buttons and the sound. Your game is a guest of the firmware: it is loaded into memory and called by it.

The runtime is the part of the firmware that the game talks to. It calls the game once for every frame, that is, for every new picture on the screen, and it lends the game ready-made functions for drawing and for sound. Any machine that offers this runtime is called a host. There are three: the real board; QEMU, an emulator; and PRG32-QT, an application for your laptop. An emulator, like the interpreter inside PRG32-QT, is a program that imitates a processor: it reads machine code and does, in software, what the chip would do in hardware. This is why a laptop can run a cartridge built for a different processor.

## Slide 6: The terminal: talking to the computer in text

Every installation in this lecture uses the terminal, so it is introduced before anything is installed. The terminal is a window in which you give the computer orders by typing them, instead of clicking. It shows a prompt, a short line ending in `$` or `>`, and waits. You type a command and press Enter; the computer runs it and prints its answer below.

The table lists the six commands needed this week. At any moment the terminal is "in" one folder, the current folder, and commands act on the files there. `pwd` shows which folder it is, `ls` (or `dir` on Windows) lists its contents, and `cd` moves into another folder; `cd ..` moves back up one level. `Ctrl+C` stops a program that does not end by itself. Two habits save a great deal of typing and of errors: the Tab key completes a name that you have started to type, and the up arrow recalls the previous command.

## Slide 7: Reading what the computer answers

Three more words appear in every installation guide. A path names a file by listing the folders that lead to it, separated by `/` (or `\` on Windows). The sign `~` stands for your home folder, the personal folder that the system gives to each user. A repository is a folder of source code whose whole history is recorded by a program called git; `git clone` copies a repository from the Internet onto your laptop.

The second half of the slide is about errors, because a beginner meets many of them in the first week and they are not a sign of failure. A command that succeeds often prints little or nothing. A command that fails prints a message, and the message nearly always names the cause. It should be read in full, starting from the first line that says error, before anything is changed. The four messages listed cover most problems of this lecture. The box shows the first one: the terminal could not find a program called `python3`. When asking for help, copy the command and the complete message as text, not a photograph of the screen.

## Slide 8: PRG32: a runtime, a file format, a set of tools

The name PRG32 designates four distinct artefacts. A *firmware*: the resident program that owns the display, the buttons and the audio. A *cartridge format*: a game packaged as a single small file. A *tool* on the development machine, the command `python3 -m prg32`, which builds, uploads and packages cartridges. And a *Store*, where finished games are published. The student's code is genuine 32-bit RISC-V machine code, and it interacts with the firmware through a contract of three functions: `init`, invoked once, and `update` and `draw`, invoked at every frame. Lecture 02 takes this contract as its starting point.

## Slide 9: From your file to the screen

The slide traces a program through its life cycle, from left to right. A source file is written in assembly or C. The RISC-V toolchain translates it into machine code. The result is a cartridge: a file containing code, data and a short header. The cartridge is transmitted over the network to a *host*, whose runtime then calls the three entry points. The first three stages take place on the student's laptop and require level 2; the last two take place on a host, which may be PRG32-QT, QEMU or the board. One and the same file runs on all three because it reaches the runtime indirectly, through a table of functions. That table is part of the *application binary interface*, or ABI, of PRG32: an agreement on how a program and the runtime call each other, fixed down to the level of the machine code, so that neither needs to know where the other sits in memory.

## Slide 10: The kit: a console on a breadboard

The kit is a small console assembled on a breadboard, a plastic board with rows of holes into which components and wires are pushed, with no soldering. Its core is an Espressif ESP32-C6, a chip with a single RISC-V core and an integrated Wi-Fi radio. A *core* is one processor. It works in steps paced by a *clock*, an electrical signal that ticks at a fixed rate; 160 MHz means 160 million ticks per second. Around it are a 2.8-inch colour display, one or two audio amplifiers, a joystick and a few buttons, each wired directly to a pin of the chip, one of the metal legs through which the chip exchanges electrical signals with the outside. Two numbers concerning the screen should be distinguished: the panel has 320 by 240 pixels, while games draw within a viewport of 320 by 200. Cartridges reach the board over Wi-Fi. A personal kit is not required to follow the course; the laboratory provides a number of them.

## Slide 11: Three ways to run the same cartridge

One cartridge, three hosts, compared row by row. On the board and in QEMU the code runs *natively*: the machine code is executed by a RISC-V chip, a physical one on the board and an emulated one in QEMU, together with the real firmware. In PRG32-QT it is *interpreted*: a program on the laptop reads each instruction and carries it out in software, one at a time. The board and QEMU require the toolchain, whereas PRG32-QT does not, either for playing or for debugging. Single-stepping requires additional tools on the first two hosts and is built into the third. A useful heuristic follows: the board is the authority on timing, PRG32-QT the authority on the content of a register.

## Slide 12: PRG32-QT: the console on your laptop

PRG32-QT is the console realised as an application: it contains an interpreter of the RV32IMAC instruction set and offers the cartridge the same services as the firmware. Three features matter. The speed profiles in *Settings*: *Accurate*, the default, which reproduces the timing of the ESP32-C6; *Optimal*, at thirty frames per second; and *Unlimited*. The Store browser, which downloads and runs published cartridges. And the debugger, which displays the disassembly, that is, the machine code translated back into readable assembly, together with the registers and memory, and executes one instruction at a time. *Accurate* is the profile to retain, since it reveals when a program would be too slow on the real chip.

## Slide 13: The controls, on a keyboard

On a keyboard the joystick is mapped to the arrow keys or to W, A, S, D; button A to Z or J; button B to X or K; Start and Select to Enter or Space. In PRG32-QT, Escape leaves the game and returns to *Setup*. One property of QEMU routinely surprises first-time users: keystrokes must be typed into the terminal from which QEMU was launched, not into the window displaying the image. A game that appears unresponsive in QEMU usually only requires the terminal to be given focus.

## Slide 14: One idea behind every installation

A single idea explains every installation step and nearly every failure. The compiler is distributed with ESP-IDF, Espressif's development framework, installed for two targets: `esp32c6`, the kit, and `esp32c3`, the emulated chip. ESP-IDF, however, is not active by default: each new terminal must activate it before its tools can be located. The box on the right shows the message every student will eventually encounter, `idf.py: command not found`. It does not indicate a broken installation; it indicates that ESP-IDF has not been activated in the terminal in use.

## Slide 15: Troubleshooting

The table is read from left to right: symptom, diagnosis, remedy. Its first row accounts for most cases: `idf.py: command not found` means that ESP-IDF is not active in the current terminal. `No module named prg32` means that the command was not issued from the PRG32 folder. A refused connection means that PRG32-QT is not running, or that a firewall is blocking port 8080. When asking for help, the command and the complete message should be supplied as text: a photograph of a screen can be neither searched nor copied.

## Slide 16: Ready for Lecture 02?

Five checks, one for each step completed: PRG32-QT runs a game from the Store; in a fresh terminal the doctor reports only OK; `cartridge build` produces `pong.prg32`; `upload-and-run` starts it; and in debug mode pausing and stepping work. For any check that fails, the last column names the step to repeat. Students who remain blocked should attend office hours or the laboratory, with their laptop, before Lecture 02.

## Slide 17: Check your understanding: In a new terminal, python3 -m prg32 doctor says: idf.py missing. What is the most likely cause? / Which host lets you run and debug a cartridge without installing a compiler?

Before answering the first question, consider what "a new terminal" implies. Nothing has been uninstalled, PRG32-QT plays no part in this command, and the doctor needs no board. Activation lasts only as long as the terminal in which it was performed, so a new terminal begins without it. The remedy is the routine one: `export.sh`, or the ESP-IDF PowerShell.

The second question separates two activities: building a cartridge and running one. A compiler is needed only for the former. The board and QEMU execute the real firmware, which must itself be compiled; PRG32-QT interprets the cartridge and provides its own debugger, and is therefore the only host that requires nothing further.

## Slide 18: Check your understanding: Why does the same pong.prg32 run on the board, on QEMU and on PRG32-QT? / What does an assembler do?

The cartridge is neither recompiled nor a bundle of three programs. A portable cartridge does not call the firmware at fixed addresses: it calls through a table of functions, the ABI, and each host supplies its own implementation of that table. This is the meaning of the `--portable` option, and the reason why the file is identical in every column of the table comparing the three hosts. The principle, a stable interface separating a program from the system that runs it, will recur throughout the course.

The last question checks the vocabulary of the start of the lecture. The assembler does not run anything: it is a translator, which reads source code written by a person and produces the machine code that a processor executes. Running the result is the job of a host and of its runtime; sending it to a host is the job of the PRG32 tools; showing the registers is the job of the debugger.

## Slide 19: Glossary: English and Italian

Ten terms that recur in every document concerning PRG32, with the Italian usually employed in class. Three deserve particular attention. A *toolchain* is the sequence of programs that transforms source code into an executable: compiler, assembler and *linker*, the program that joins the separately translated pieces into one file. *To flash* is to write a program into the flash memory of a chip. A *host* is the machine on which a cartridge runs: the board, QEMU or PRG32-QT.

## Slide 20: Summary and reading

Four propositions summarise the lecture. PRG32 is a runtime, a cartridge format, a tool and a Store, and a cartridge runs unchanged on three hosts. PRG32-QT suffices for playing and debugging; ESP-IDF and the repository are required for building. ESP-IDF must be activated in every new terminal. And the student has now completed the cycle on which the whole course rests: build, transmit, halt in the debugger. The recommended readings are the README files of the two repositories. Lecture 02 uses this workshop to write the first program in assembly.
