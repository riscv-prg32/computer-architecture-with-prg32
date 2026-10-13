# Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: PRG32 and PRG32-QT: Setting Up Your Workshop: the code

This is the code deck of Lecture 01. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l01.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Download the installer for your system

Find the row of your system and download that file from the *Releases* page of the PRG32-QT repository, always from the latest release. Windows has an installer, macOS a disk image (one for Apple Silicon, one for Intel), Linux and Raspberry Pi OS a Debian package. The number 0.4.1 is the version of October 2026: by the time you read this it may be higher, and the file names follow the same pattern. If you are not sure which Mac you have, the macOS slide tells you how to find out.

## Slide 4: PRG32-QT on Windows

On Windows there are four moves: download the Setup file, run it, accept the proposed folder, and start PRG32 from the Start menu. Two warnings may appear, and both are expected. SmartScreen may show a blue box because the installer is not from the Microsoft Store: choose *More info*, then *Run anyway*. The firewall may ask for permission: allow it on private networks. PRG32-QT listens on port 8080 to receive cartridges from the tools, and you will use this in step 3.

## Slide 5: PRG32-QT on macOS

On a Mac, first find out which processor you have: the Apple menu, *About This Mac*. "Chip Apple M..." means the ARM64 file; "Processor Intel" means the Intel one. Open the disk image and drag PRG32 onto *Applications*. At the first start macOS may refuse to open an application that does not come from the App Store: right-click it and choose *Open*, or use *Privacy and Security* in the System Settings. Then accept incoming connections and access to the local network, which the application needs to receive cartridges.

## Slide 6: PRG32-QT on Linux

On Linux the upper half of the listing installs the package: `apt install` with `./` before the file name installs the file together with what it depends on. The program is then `/usr/bin/PRG32`. The requirement to check is Qt 6.5 or newer: Debian 13 and Ubuntu 25.04 have it; Ubuntu 24.04 does not. The lower half is the alternative for older systems, building from source with the script in the repository. Lines that begin with `#` are comments: do not type them.

## Slide 7: Run it: your first cartridge, from the Store

Your first run. Start PRG32-QT: the *Setup* screen is the same one the firmware shows on the kit. Choose *Browse Store*, pick a game, download it and choose *Run Cartridge*. Play with the arrow keys, Z and X; Escape brings you back. Then open *Settings* and look at the three profiles. The green box states what success looks like: a game from the Store runs on your laptop. If the catalogue stays empty, the problem is the network, not PRG32-QT.

## Slide 8: What you should see

These are the three screens you should have seen: the *Setup* menu, the Store browser and *Settings*. They look the same on every operating system. Compare them with your own screen; if they match, level 1 is complete, and from now on you can run any cartridge and look inside it. If they do not, raise your hand now rather than later.

## Slide 9: The toolchain on Windows

On Windows the first three steps use graphical installers: Git, Python, and the ESP-IDF Tools Installer, in which you choose a release 5.4 or newer and the targets `esp32c3` and `esp32c6`. The installer creates a shortcut called *ESP-IDF PowerShell*: always work in that window, never in a plain terminal. The five commands clone the PRG32 repository, install two Python packages and run the doctor. On Windows the interpreter is called `python`, not `python3`.

## Slide 10: The toolchain on macOS

On macOS there are three blocks. Homebrew installs the prerequisites. Then ESP-IDF is cloned and `install.sh` downloads the compilers for the two chips: be patient, it is the long part. The line `. ./export.sh` begins with a dot and a space, and the dot matters: it makes the script change the terminal you are in, instead of a copy that disappears. The last block clones PRG32 and runs the doctor. The same commands work on Apple Silicon and on Intel.

## Slide 11: The toolchain on Linux (Debian, Ubuntu)

On Debian and Ubuntu the first block is one long `apt` command, split over three lines by the backslashes: copy it whole. Steps 2 and 3 are identical to those of macOS. On other distributions the packages are the same, with other names. The last callout concerns only those who have a kit: your user must belong to the group `dialout` to reach the serial port of the board, and you must log out and in again for the change to take effect.

## Slide 12: Every new terminal: switch ESP-IDF on

This slide is the daily routine, and it prevents the most common mistake of the first weeks. In every new terminal, before anything else, activate ESP-IDF with `export.sh` and move into the PRG32 folder. Two aliases save typing: `get_idf` activates, `prg` stands for `python3 -m prg32`. On Windows, opening *ESP-IDF PowerShell* does the same. Try it deliberately once: open a new terminal, run the doctor without activating, and read the error. Having seen it here, you will recognise it at once later.

## Slide 13: The doctor: is everything in place?

The doctor checks the installation and prints one line per check. `[OK] idf.py found` means that ESP-IDF is active. `[OK] riscv32-esp-elf-gcc found` means that the RISC-V compiler can be reached. The lines about partitions mean that the PRG32 folder is complete. A line that begins with `[ERROR]` says what is wrong and what to do: read it to the end before asking for help. When every line is OK, level 2 is done. The last lines of the listing show the error you get in a terminal where ESP-IDF is not active.

## Slide 14: Build a cartridge from the examples

The command `cartridge build` takes a source file and writes a `.prg32` file. Three options are worth understanding. `--entry-prefix pong_c` is the name that precedes `_init`, `_update` and `_draw` in the source. `--portable` makes a cartridge that runs on every host, not only on one firmware image. `--out` names the result. The tool answers with the size of the code: a whole game of Pong is about three thousand bytes. The source here is C, taken from the examples, so that you test the compiler without writing a program.

## Slide 15: Send it to PRG32-QT

PRG32-QT must be running. The first command, `runtime`, asks it for its state: if it answers, the connection works. The second, `upload-and-run`, stores the cartridge in slot `cart0` and starts it; the game appears in the window of PRG32-QT. The command says `esp32c6` because, for the tool, PRG32-QT behaves like a board that listens on port 8080. The same command with the address of a real board, `http://192.168.4.1`, sends the game there. Without the tools you can also import the file from the menu of PRG32-QT.

## Slide 16: Look inside: the debugger

Now open the machine. In *Settings* enable *Run cartridges in RISC-V debug mode* and run the cartridge again: the game is on the left, the machine on the right. Pause: one instruction is highlighted, the next to be executed. Step a few times: the highlight moves and some registers change. *Update* and *Draw* show those two functions of the cartridge. Resume, then lower the speed and watch the game in slow motion. You are not expected to understand the registers today; the point is that the debugger opens and obeys.

## Slide 17: The machine, open

This is what you should see: on the right the listing in assembly with the current instruction highlighted, the thirty-two registers, a window on memory and the counters of the frame. Every element of this picture will be explained in the coming lectures, starting with the registers in Lecture 02. If you see this screen with a cartridge that you built yourself, your workshop is complete.

## Slide 18: Level 3: the QEMU emulator

Level 3 has three parts: the libraries that the emulator needs for its window, the emulator itself, and three commands of the tool. `qemu build` compiles the whole firmware, which takes several minutes the first time. `qemu upload` stages a cartridge into the flash image, and QEMU must be closed while it runs. `qemu run` starts the emulator, which opens on the *Setup* menu: choose *Run Cartridge* and then `cart0`. Remember to type in the terminal, not in the window with the picture.

## Slide 19: Level 4: the kit

Level 4 is the board. Connected by USB, `build-and-flash` compiles the firmware and writes it into the chip: once per board. The board then starts on the *Setup* menu and creates a Wi-Fi network called PRG32. Join it, and the upload command you already know works with the address `192.168.4.1`: from then on, no cables. The last command makes the board join an existing network instead. On Linux your user must be in the group `dialout`.

## Slide 20: The complete program: l01.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 21: The complete program: l01.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 22: The complete program: l01.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 23: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 24: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 25: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 26: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 27: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 28: Before the next lecture

Homework. Complete the five checks. Download three cartridges from the Store and, in each, find the first instruction of `update` with the debugger. Build another example. The fourth task is the real test: close everything, restart the computer and get back to a running cartridge without these slides. If you can do it, you have understood activation, and your workshop is yours.
