# Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: PRG32 and PRG32-QT: Setting Up Your Workshop

This lecture is a workshop, in both senses: you work with your hands, and you leave with a place where things can be made. Nothing here is theory. At the end your laptop runs PRG32-QT, the compiler for RISC-V is installed, and one cartridge built by you is stopped in the debugger. The quotation about the axe is the justification for spending two hours on tools: every later lecture assumes that building and running a program costs you one command and ten seconds.

## Slide 2: What you will have by the end

Five results, in the order in which you will reach them: a picture of the platform, PRG32-QT installed, the toolchain installed and checked, one cartridge built and stopped in the debugger, and a list of remedies for the usual failures. Treat it as a checklist. If you leave the lecture with the first two only, you can already follow the course; the third and the fourth must be in place before Lecture 02, when you write your first program.

## Slide 3: Four levels: install what you need

The installation has four levels, and you do not need them all. Level 1, PRG32-QT, takes five minutes and lets you play and debug any cartridge. Level 2, ESP-IDF and the PRG32 repository, is a large download and lets you build your own cartridges: everybody needs it before Lecture 02. Level 3, the QEMU emulator, and level 4, the physical kit, are optional. The caption is the important line for anyone worried about costs: the course can be followed with levels 1 and 2, with no board.

## Slide 4: The platform, in detail

Before installing anything, it helps to know what the pieces are and how they fit. The next six slides describe the platform: what PRG32 is, how a source file becomes something on the screen, what the hardware kit contains, the three machines on which a cartridge runs, PRG32-QT, and the keys that replace the joystick.

## Slide 5: PRG32: a runtime, a file format, a set of tools

The name PRG32 covers four things. A *firmware*, the resident program that owns the screen, the buttons and the sound. A *cartridge format*, your game as one small file. A *tool* on your laptop, the command `python3 -m prg32`, which builds, uploads and packages. And a *Store*, where finished games are shared. Your code is real 32-bit RISC-V machine code, and it meets the firmware through a contract of three functions: `init`, called once, then `update` and `draw`, called at every frame. Lecture 02 starts exactly from this contract.

## Slide 6: From your file to the screen

Follow a program from left to right. You write a source file in assembly or C. The compiler of the RISC-V toolchain turns it into machine code. The result is a cartridge, a file with code, data and a short header. The cartridge is uploaded over the network to a *host*, and there the runtime calls its three functions. The first three boxes live on your laptop and need level 2; the last two are a host, which can be PRG32-QT, QEMU or the board. The same file runs on all three because it reaches the runtime through a table of functions, the ABI.

## Slide 7: The kit: a console on a breadboard

The kit is a small console built on a breadboard. Its heart is an ESP32-C6, a chip with one RISC-V core at 160 MHz and Wi-Fi. Around it there are a 2.8 inch colour display, one or two audio amplifiers, a joystick and a few buttons, each wired directly to a pin of the chip. Note the two numbers of the screen: the panel has 320 by 240 pixels, and games draw in an area of 320 by 200. A game reaches the board over Wi-Fi. You do not need a kit to follow the course; the laboratory has some.

## Slide 8: Three ways to run the same cartridge

One cartridge, three hosts. Read the table by rows. On the board and in QEMU your code runs natively, on a real or an emulated chip; in PRG32-QT it is interpreted, one instruction after another. The board and QEMU need the toolchain; PRG32-QT does not, to play and to debug. Stepping through instructions needs extra tools on the first two, and is built into the third. A rule of thumb: use the board when you want the truth about time, and PRG32-QT when you want the truth about a register.

## Slide 9: PRG32-QT: the console on your laptop

PRG32-QT is the console as an application: it contains an interpreter of RV32IMAC and offers the cartridge the same functions as the firmware. Three things to remember. The speed profiles in *Settings*: *Accurate*, the default, timed like the ESP32-C6; *Optimal*, thirty frames per second; *Unlimited*. The Store browser, which downloads and runs published cartridges. And the debugger, which shows assembly, registers and memory and executes one instruction at a time. *Accurate* is the profile to keep: it tells you when your program would be too slow on the real chip.

## Slide 10: The controls, on a keyboard

On a keyboard the joystick is the arrow keys, or W A S D; button A is Z or J; button B is X or K; Start and Select are Enter or Space. In PRG32-QT, Escape leaves the game and returns to *Setup*. One detail of QEMU surprises everybody the first time: the keys must be typed in the terminal from which QEMU was started, not in the window that shows the picture. If a game in QEMU seems dead, click on the terminal.

## Slide 11: Step 1: install PRG32-QT

First step: install PRG32-QT. It takes about five minutes and needs neither a compiler nor an account. Do it now, in class, on your own laptop: every later slide of this lecture assumes that the application starts.

## Slide 12: Download the installer for your system

Find the row of your system and download that file from the *Releases* page of the PRG32-QT repository, always from the latest release. Windows has an installer, macOS a disk image (one for Apple Silicon, one for Intel), Linux and Raspberry Pi OS a Debian package. The number 0.4.1 is the version of October 2026: by the time you read this it may be higher, and the file names follow the same pattern. If you are not sure which Mac you have, the macOS slide tells you how to find out.

## Slide 13: PRG32-QT on Windows

On Windows there are four moves: download the Setup file, run it, accept the proposed folder, and start PRG32 from the Start menu. Two warnings may appear, and both are expected. SmartScreen may show a blue box because the installer is not from the Microsoft Store: choose *More info*, then *Run anyway*. The firewall may ask for permission: allow it on private networks. PRG32-QT listens on port 8080 to receive cartridges from the tools, and you will use this in step 3.

## Slide 14: PRG32-QT on macOS

On a Mac, first find out which processor you have: the Apple menu, *About This Mac*. "Chip Apple M..." means the ARM64 file; "Processor Intel" means the Intel one. Open the disk image and drag PRG32 onto *Applications*. At the first start macOS may refuse to open an application that does not come from the App Store: right-click it and choose *Open*, or use *Privacy and Security* in the System Settings. Then accept incoming connections and access to the local network, which the application needs to receive cartridges.

## Slide 15: PRG32-QT on Linux

On Linux the upper half of the listing installs the package: `apt install` with `./` before the file name installs the file together with what it depends on. The program is then `/usr/bin/PRG32`. The requirement to check is Qt 6.5 or newer: Debian 13 and Ubuntu 25.04 have it; Ubuntu 24.04 does not. The lower half is the alternative for older systems, building from source with the script in the repository. Lines that begin with `#` are comments: do not type them.

## Slide 16: Run it: your first cartridge, from the Store

Your first run. Start PRG32-QT: the *Setup* screen is the same one the firmware shows on the kit. Choose *Browse Store*, pick a game, download it and choose *Run Cartridge*. Play with the arrow keys, Z and X; Escape brings you back. Then open *Settings* and look at the three profiles. The green box states what success looks like: a game from the Store runs on your laptop. If the catalogue stays empty, the problem is the network, not PRG32-QT.

## Slide 17: What you should see

These are the three screens you should have seen: the *Setup* menu, the Store browser and *Settings*. They look the same on every operating system. Compare them with your own screen; if they match, level 1 is complete, and from now on you can run any cartridge and look inside it. If they do not, raise your hand now rather than later.

## Slide 18: Step 2: install the toolchain

Second step: the toolchain, that is, the compiler and the programs around it. This is the long part: a download of a few gigabytes that should have been started at home. The slides give the idea first, then the commands for each system, then the daily routine, and finally the command that checks everything.

## Slide 19: One idea behind every installation

One idea explains every installation and nearly every problem. The compiler comes with ESP-IDF, the development kit of Espressif, installed for two chips: `esp32c6`, the kit, and `esp32c3`, the emulator. But ESP-IDF is not active by itself: each new terminal must switch it on before the tools can be found. The box on the right shows the message you will certainly meet, `idf.py: command not found`. It does not mean that something is broken. It means that ESP-IDF is not active in the terminal in which you are typing.

## Slide 20: The toolchain on Windows

On Windows the first three steps use graphical installers: Git, Python, and the ESP-IDF Tools Installer, in which you choose a release 5.4 or newer and the targets `esp32c3` and `esp32c6`. The installer creates a shortcut called *ESP-IDF PowerShell*: always work in that window, never in a plain terminal. The five commands clone the PRG32 repository, install two Python packages and run the doctor. On Windows the interpreter is called `python`, not `python3`.

## Slide 21: The toolchain on macOS

On macOS there are three blocks. Homebrew installs the prerequisites. Then ESP-IDF is cloned and `install.sh` downloads the compilers for the two chips: be patient, it is the long part. The line `. ./export.sh` begins with a dot and a space, and the dot matters: it makes the script change the terminal you are in, instead of a copy that disappears. The last block clones PRG32 and runs the doctor. The same commands work on Apple Silicon and on Intel.

## Slide 22: The toolchain on Linux (Debian, Ubuntu)

On Debian and Ubuntu the first block is one long `apt` command, split over three lines by the backslashes: copy it whole. Steps 2 and 3 are identical to those of macOS. On other distributions the packages are the same, with other names. The last callout concerns only those who have a kit: your user must belong to the group `dialout` to reach the serial port of the board, and you must log out and in again for the change to take effect.

## Slide 23: Every new terminal: switch ESP-IDF on

This slide is the daily routine, and it prevents the most common mistake of the first weeks. In every new terminal, before anything else, activate ESP-IDF with `export.sh` and move into the PRG32 folder. Two aliases save typing: `get_idf` activates, `prg` stands for `python3 -m prg32`. On Windows, opening *ESP-IDF PowerShell* does the same. Try it deliberately once: open a new terminal, run the doctor without activating, and read the error. Having seen it here, you will recognise it at once later.

## Slide 24: The doctor: is everything in place?

The doctor checks the installation and prints one line per check. `[OK] idf.py found` means that ESP-IDF is active. `[OK] riscv32-esp-elf-gcc found` means that the RISC-V compiler can be reached. The lines about partitions mean that the PRG32 folder is complete. A line that begins with `[ERROR]` says what is wrong and what to do: read it to the end before asking for help. When every line is OK, level 2 is done. The last lines of the listing show the error you get in a terminal where ESP-IDF is not active.

## Slide 25: Step 3: your first build

Third step: use what you have installed. You build one cartridge from an example of the repository, send it to PRG32-QT and stop it in the debugger. This is the loop of the whole course in miniature: build, run, look inside.

## Slide 26: Build a cartridge from the examples

The command `cartridge build` takes a source file and writes a `.prg32` file. Three options are worth understanding. `--entry-prefix pong_c` is the name that precedes `_init`, `_update` and `_draw` in the source. `--portable` makes a cartridge that runs on every host, not only on one firmware image. `--out` names the result. The tool answers with the size of the code: a whole game of Pong is about three thousand bytes. The source here is C, taken from the examples, so that you test the compiler without writing a program.

## Slide 27: Send it to PRG32-QT

PRG32-QT must be running. The first command, `runtime`, asks it for its state: if it answers, the connection works. The second, `upload-and-run`, stores the cartridge in slot `cart0` and starts it; the game appears in the window of PRG32-QT. The command says `esp32c6` because, for the tool, PRG32-QT behaves like a board that listens on port 8080. The same command with the address of a real board, `http://192.168.4.1`, sends the game there. Without the tools you can also import the file from the menu of PRG32-QT.

## Slide 28: Look inside: the debugger

Now open the machine. In *Settings* enable *Run cartridges in RISC-V debug mode* and run the cartridge again: the game is on the left, the machine on the right. Pause: one instruction is highlighted, the next to be executed. Step a few times: the highlight moves and some registers change. *Update* and *Draw* show those two functions of the cartridge. Resume, then lower the speed and watch the game in slow motion. You are not expected to understand the registers today; the point is that the debugger opens and obeys.

## Slide 29: The machine, open

This is what you should see: on the right the listing in assembly with the current instruction highlighted, the thirty-two registers, a window on memory and the counters of the frame. Every element of this picture will be explained in the coming lectures, starting with the registers in Lecture 02. If you see this screen with a cartridge that you built yourself, your workshop is complete.

## Slide 30: Optional: QEMU and the kit

The last two levels are optional. QEMU runs the real firmware on an emulated chip, on your laptop. The kit is the real hardware. Neither is needed to pass the course; both are worth trying if you are curious about what is underneath PRG32-QT.

## Slide 31: Level 3: the QEMU emulator

Level 3 has three parts: the libraries that the emulator needs for its window, the emulator itself, and three commands of the tool. `qemu build` compiles the whole firmware, which takes several minutes the first time. `qemu upload` stages a cartridge into the flash image, and QEMU must be closed while it runs. `qemu run` starts the emulator, which opens on the *Setup* menu: choose *Run Cartridge* and then `cart0`. Remember to type in the terminal, not in the window with the picture.

## Slide 32: Level 4: the kit

Level 4 is the board. Connected by USB, `build-and-flash` compiles the firmware and writes it into the chip: once per board. The board then starts on the *Setup* menu and creates a Wi-Fi network called PRG32. Join it, and the upload command you already know works with the address `192.168.4.1`: from then on, no cables. The last command makes the board join an existing network instead. On Linux your user must be in the group `dialout`.

## Slide 33: When something does not work

Things will go wrong, and that is normal. The next two slides collect the usual symptoms with their causes and remedies, and a final check that tells you whether you are ready for the first program.

## Slide 34: Troubleshooting

Read the table from left to right: what you see, what it means, what to do. The first row covers most cases: `idf.py: command not found` means that ESP-IDF is not active in this terminal. `No module named prg32` means that you are not in the PRG32 folder. A refused connection means that PRG32-QT is not running, or that a firewall blocks port 8080. When you ask for help, paste the command and the complete message as text: a photograph of the screen cannot be searched or copied.

## Slide 35: Ready for Lecture 02?

Five checks, one for each thing you did: PRG32-QT runs a game from the Store; in a new terminal the doctor shows only OK; `cartridge build` produces `pong.prg32`; `upload-and-run` starts it; in debug mode pause and step work. If one is missing, the last column tells you which step to repeat. Anyone who is stuck should come to office hours or to the laboratory before Lecture 02, with the laptop.

## Slide 36: Check your understanding: In a new terminal, python3 -m prg32 doctor says: idf.py missing. What is the most likely cause?

Think about what "a new terminal" implies before you answer. Nothing was uninstalled, PRG32-QT is not involved in this command, and no board is needed for the doctor. Activation lasts as long as the terminal in which it was done, so a new terminal starts without it. The remedy is the one of the daily routine: `export.sh`, or the ESP-IDF PowerShell.

## Slide 37: Check your understanding: Which host lets you run and debug a cartridge without installing a compiler?

The question separates two activities: building a cartridge and running one. A compiler is needed only for the first. The board and QEMU run the real firmware, which must be compiled; PRG32-QT interprets the cartridge and has its own debugger, so it is the only host that needs nothing else.

## Slide 38: Check your understanding: Why does the same pong.prg32 run on the board, on QEMU and on PRG32-QT?

The cartridge is not recompiled, and it does not contain three programs. A portable cartridge does not call the firmware at fixed addresses: it goes through a table of functions, the ABI, and each host provides that table. This is the meaning of the option `--portable`, and the reason why the file is the same in every column of the table of the three hosts.

## Slide 39: Before the next lecture

Homework. Complete the five checks. Download three cartridges from the Store and, in each, find the first instruction of `update` with the debugger. Build another example. The fourth task is the real test: close everything, restart the computer and get back to a running cartridge without these slides. If you can do it, you have understood activation, and your workshop is yours.

## Slide 40: Glossary: English and Italian

Ten terms that you will meet in every document about PRG32, with the Italian commonly used in class. Three deserve attention. A *toolchain* is the chain of programs that turns source into an executable: compiler, assembler, linker. *To flash* means to write a program into the flash memory of a chip. A *host* is the machine on which a cartridge runs: the board, QEMU or PRG32-QT.

## Slide 41: Summary and reading

Four sentences to keep. PRG32 is a runtime, a cartridge format, a tool and a Store, and a cartridge runs unchanged on three hosts. PRG32-QT is enough to play and debug; ESP-IDF and the repository are needed to build. ESP-IDF must be activated in every new terminal. And you have completed the loop of the whole course: build, send, stop in the debugger. The readings are the README files of the two repositories; Lecture 02 uses this workshop for your first assembly program.
