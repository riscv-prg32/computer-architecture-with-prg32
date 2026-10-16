# Lecture 01: PRG32 and PRG32-QT: Setting Up Your Workshop: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the pieces of PRG32. USE NOW: the PRG32 tools, the PRG32-QT debugger, the complete program (used, not studied, in this course). UNDERSTAND LATER: the init, update, draw contract (Lecture 02); registers (Lecture 02). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: PRG32 and PRG32-QT: Setting Up Your Workshop: the code

This is the code deck of Lecture 01. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l01.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Download the installer for your system

The student locates the row corresponding to their operating system and downloads that file from the *Releases* page of the PRG32-QT repository, always choosing the latest release. Windows is served by an installer, macOS by a disk image (one for Apple Silicon and one for Intel processors), Linux and Raspberry Pi OS by a Debian package. The version number 0.4.1 is that of October 2026; it may since have increased, but file names follow the same pattern. The slide on macOS explains how to determine which processor a Mac contains.

## Slide 4: PRG32-QT on Windows

On Windows the installation consists of four actions: download the Setup file, run it, accept the proposed folder, and start PRG32 from the Start menu. Two warnings may appear, and both are expected. SmartScreen may display a blue dialogue because the installer does not come from the Microsoft Store; the remedy is *More info*, then *Run anyway*. The firewall may request permission, which should be granted for private networks: PRG32-QT listens on port 8080 to receive cartridges from the tools, a facility used in step 3.

## Slide 5: PRG32-QT on macOS

On a Mac the first task is to identify the processor, from the Apple menu, *About This Mac*: "Chip Apple M..." calls for the ARM64 image, "Processor Intel" for the Intel one. The disk image is opened and PRG32 dragged onto *Applications*. On first launch macOS may refuse to open an application not distributed through the App Store; it can be opened with a right-click and *Open*, or authorised under *Privacy and Security* in System Settings. Incoming connections and access to the local network must then be accepted, since the application needs them to receive cartridges.

## Slide 6: PRG32-QT on Linux

On Linux the upper half of the listing installs the package: `apt install` with `./` preceding the file name installs that file together with its dependencies, and the program is then available as `/usr/bin/PRG32`. The requirement to verify is Qt 6.5 or later, which Debian 13 and Ubuntu 25.04 satisfy and Ubuntu 24.04 does not. The lower half is the alternative for older systems: building from source with the script provided in the repository. Lines beginning with `#` are comments and are not to be typed.

## Slide 7: Run it: your first cartridge, from the Store

The first execution. On starting PRG32-QT the *Setup* screen appears, identical to the one the firmware shows on the kit. Selecting *Browse Store*, choosing a game, downloading it and choosing *Run Cartridge* runs it; the arrow keys, Z and X control the game, and Escape returns to Setup. The three profiles under *Settings* should then be examined. The green box defines success: a game from the Store runs on the student's laptop. An empty catalogue indicates a network problem, not a fault of PRG32-QT.

## Slide 8: What you should see

The three screens that should now have been seen: the *Setup* menu, the Store browser and *Settings*. They are identical on every operating system. If the student's screen matches, level 1 is complete, and any cartridge can henceforth be run and inspected. If it does not, the moment to ask is now rather than later, while the installation is still fresh.

## Slide 9: The toolchain on Windows

On Windows the first three steps use graphical installers: Git, Python, and the ESP-IDF Tools Installer, in which a release 5.4 or later and the targets `esp32c3` and `esp32c6` are selected. The installer creates a shortcut named *ESP-IDF PowerShell*; all work must be done in that window and never in a plain terminal, because only there is the environment activated. The five commands that follow clone the PRG32 repository, install two Python packages and run the doctor. On Windows the interpreter is invoked as `python`, not `python3`.

## Slide 10: The toolchain on macOS

On macOS the procedure has three blocks. Homebrew installs the prerequisites. ESP-IDF is then cloned, and `install.sh` downloads the compilers for the two chips; this is the lengthy part. The line `. ./export.sh` begins with a dot followed by a space, and the dot is significant: it causes the script to modify the current shell, rather than a child process whose changes would vanish on exit. The final block clones PRG32 and runs the doctor. The same commands work on Apple Silicon and on Intel machines.

## Slide 11: The toolchain on Linux (Debian, Ubuntu)

On Debian and Ubuntu the first block is a single long `apt` command, split across three lines by backslashes, and must be copied in full. Steps 2 and 3 are identical to those for macOS. Other distributions provide the same packages under different names. The last callout concerns only owners of a kit: to reach the board's serial port the user must belong to the group `dialout`, and the change takes effect only after logging out and in again.

## Slide 12: Every new terminal: switch ESP-IDF on

This slide describes the daily routine and forestalls the most common error of the first weeks. In every new terminal, before anything else, ESP-IDF is activated with `export.sh` and the working directory set to the PRG32 folder. Two aliases reduce typing: `get_idf` performs the activation, and `prg` abbreviates `python3 -m prg32`. On Windows, opening *ESP-IDF PowerShell* achieves the same. The error is worth provoking once on purpose, by running the doctor in a fresh terminal without activation: having seen the message here, one recognises it immediately thereafter.

## Slide 13: The doctor: is everything in place?

The doctor verifies the installation and prints one line per check. `[OK] idf.py found` confirms that ESP-IDF is active; `[OK] riscv32-esp-elf-gcc found` that the RISC-V compiler is reachable; the lines concerning partitions that the PRG32 folder is complete. A line beginning with `[ERROR]` states what is wrong and how to correct it, and should be read to the end before help is sought. When every line reports OK, level 2 is complete. The final lines of the listing show the error produced in a terminal in which ESP-IDF has not been activated.

## Slide 14: Build a cartridge from the examples

The command `cartridge build` takes a source file and produces a `.prg32` file. Three options merit understanding. `--entry-prefix pong_c` is the name that precedes `_init`, `_update` and `_draw` in the source, and thus identifies the three entry points. `--portable` produces a cartridge that runs on every host rather than on a single firmware image. `--out` names the output file. The tool reports the size of the code: a complete game of Pong occupies about three thousand bytes. The source is a C example from the repository, chosen so that the compiler can be tested before any program has been written.

## Slide 15: Send it to PRG32-QT

PRG32-QT must be running. The first command, `runtime`, queries its state; a reply confirms that the connection works. The second, `upload-and-run`, stores the cartridge in slot `cart0` and starts it, and the game appears in the PRG32-QT window. The command names the `esp32c6` because, from the tool's point of view, PRG32-QT behaves as a board listening on port 8080. The same command, addressed to `http://192.168.4.1`, sends the game to a physical board. Without the tools, the file can also be imported from the PRG32-QT menu.

## Slide 16: Look inside: the debugger

The machine is now opened. In *Settings*, *Run cartridges in RISC-V debug mode* is enabled and the cartridge run again: the game appears on the left, the machine on the right. Pausing highlights one instruction, the next to be executed. Stepping a few times moves the highlight and changes some registers. *Update* and *Draw* jump to those two functions of the cartridge. Execution is then resumed and the speed lowered, to watch the game in slow motion. The registers are not expected to be understood today; the objective is to establish that the debugger opens and responds.

## Slide 17: The machine, open

The expected view: on the right, the assembly listing with the current instruction highlighted, the thirty-two registers, a window onto memory, and the per-frame counters. Every element of this picture will be explained in the coming lectures, beginning with the registers in Lecture 02. A student who sees this screen with a cartridge of their own making has completed the workshop.

## Slide 18: Level 3: the QEMU emulator

Level 3 comprises three parts: the libraries the emulator needs for its window, the emulator itself, and three commands of the tool. `qemu build` compiles the entire firmware, which takes several minutes the first time. `qemu upload` stages a cartridge into the flash image, and requires QEMU to be closed. `qemu run` starts the emulator, which opens on the *Setup* menu, from which *Run Cartridge* and then `cart0` are chosen. Keystrokes, once again, go to the terminal rather than to the window with the image.

## Slide 19: Level 4: the kit

Level 4 is the physical board. With the board connected by USB, `build-and-flash` compiles the firmware and writes it into the chip, an operation performed once per board. The board then starts on its *Setup* menu and creates a Wi-Fi network named PRG32. Once the laptop has joined that network, the familiar upload command works with the address `192.168.4.1`, and no cable is needed thereafter. The last command makes the board join an existing network instead. On Linux the user must belong to the group `dialout`.

## Slide 20: The complete program: l01.S (1 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 21: The complete program: l01.S (2 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 22: The complete program: l01.S (3 of 3)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 23: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 24: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 25: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 26: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 27: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 28: Before the next lecture

The assignment for the next lecture. The five checks are to be completed. Three cartridges are to be downloaded from the Store and, in each, the first instruction of `update` located with the debugger. A further example is to be built. The fourth task is the genuine test: close everything, restart the computer, and return to a running cartridge without consulting these slides. A student who succeeds has internalised the activation procedure, and the workshop is truly theirs.
