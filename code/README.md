# The programs of the lectures

One complete RISC-V program per lecture: the listings shown on the slides, put together in a cartridge
that runs as it is on the three hosts of PRG32 and draws something that a test can check. They are the
programs that the code decks print in full and that the textbook prints at the end of each chapter
("The program of this chapter").

| File | Lecture | It shows | Press |
| --- | --- | --- | --- |
| `l00.S` | 00 Course introduction | a first program: two lines of text on a blue screen | |
| `l01.S` | 01 Setting up | a test pattern: four colour bars and `PRG32 OK` | |
| `l02.S` | 02 First contact | load, modify, store: a bar that grows one pixel per frame (entry prefix `first`) | |
| `l03.S` | 03 History of computing | the stored program: an instruction read back as data | |
| `l04.S` | 04 Digital information | an array in memory, one bar per element | |
| `l05.S` | 05 Integers | two's complement: a number that goes below zero, bit by bit | LEFT |
| `l06.S` | 06 Real numbers | fixed point: three-eighths of a pixel per frame | |
| `l08.S` | 08 Boolean algebra 1 | masks: one lamp per button; De Morgan at the joystick | any button |
| `l09.S` | 09 Boolean algebra 2 | the full adder, one gate per instruction, as a truth table | |
| `l10.S` | 10 Electronics | one button, one bit | LEFT |
| `l11.S` | 11 Combinational machines | a multiplexer in software | |
| `l13.S` | 13 Sequential machines | a game is a state machine | A |
| `l14.S` | 14 Registers and buses | a byte sent one bit at a time, and rebuilt | |
| `l15.S` | 15 Memory | the same memory read as a word and as bytes: little-endian | |
| `l16.S` | 16 Permanent memory | what stays in the file and what lives in RAM | A, then restart |
| `l18.S` | 18 The processor | `z = x + y` on a load-store machine | |
| `l19.S` | 19 Instructions and interrupts | four instructions read back as machine code | |
| `l20.S` | 20 The video card | one pixel | |
| `l21.S` | 21 Input and output | polling the joystick; a register that survives a call | LEFT, A |
| `l24.S` | 24 Beyond one core | the loop that empties the map of Verm1 | |

Lectures 07, 12, 17 and 22 are the four parts of Verm1, in `../verm1`; Lecture 23 packages it.

Each file starts with a header that says what appears on the screen and how to build it; the entry
prefix is the name of the file, except for `l02.S`.

## Running a program

From the folder of the PRG32 repository, with ESP-IDF active (Lecture 01), and this repository in
`~/arc12`:

```bash
# PRG32-QT, running on this computer
python3 -m prg32 cartridge build ~/arc12/code/l05.S --portable \
    --entry-prefix l05 --name l05 --out l05.prg32
python3 -m prg32 esp32c6 upload-and-run l05.prg32 --url http://localhost:8080 --slot cart0

# QEMU: build the firmware once, then stage the cartridge with QEMU closed
python3 -m prg32 qemu build
python3 -m prg32 cartridge build ~/arc12/code/l05.S --portable \
    --entry-prefix l05 --name l05 --architecture qemu --out l05-qemu.prg32
python3 -m prg32 qemu upload l05-qemu.prg32
python3 -m prg32 qemu run            # on Setup: Run Cartridge, cart0; type in the terminal

# the board: write the firmware once, join the Wi-Fi network PRG32 (password prg32game)
python3 -m prg32 esp32c6 build-and-flash
python3 -m prg32 cartridge build ~/arc12/code/l05.S --portable \
    --entry-prefix l05 --name l05 --architecture esp32c6 --out l05-esp32c6.prg32
python3 -m prg32 esp32c6 upload-and-run l05-esp32c6.prg32 --url http://192.168.4.1 --slot cart0
```

The code deck of each lecture gives these steps with the name of its own program, and Appendix B of the
textbook has the guide in full.

## How they are tested

`../tools/tests/cartridges/run.py` builds every program, runs it on the PRG32-QT headless runner with
scripted input and checks the pixels of the frame (for `l05.S`: one lamp at the start, every lamp lit
after LEFT has been held for three frames). It also builds every program for the architectures `esp32c6`
and `qemu`, and stages the QEMU cartridge into a copy of the flash image of the emulator.

| Host | Covered by the tests |
| --- | --- |
| PRG32-QT | built, run, picture checked |
| QEMU | built for `qemu`, accepted by the flash image; the picture is not checked (the emulator needs its window) |
| the board | built for `esp32c6`; not run (there is no board on the test machine) |

When a program changes, run the tests: they rewrite `../tools/assets/lab_lNN.png`, the picture shown in
the code deck and in the book. Then `npm run textbook` and `node build.js` in `../tools`.
