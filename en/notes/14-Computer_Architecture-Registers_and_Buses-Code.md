# Lecture 14: Elementary Machines: Registers and Buses: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Elementary Machines: Registers and Buses: the code

This is the code deck of Lecture 14. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l14.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Send a byte one bit at a time

The loop sends a byte one bit at a time, most significant bit first. At each turn the byte is shifted right by 7 and masked with 1, which isolates its top bit; that bit would be put on a data line and a clock line pulsed; then the byte is shifted left by one, so that the next bit moves into the top position. After eight turns the whole byte has gone. The loop is a shift register in software. The chip of the kit contains hardware that does the same thing, millions of times per second.

## Slide 4: Buses on the PRG32 kit

The buses of the kit. Inside the chip the bus is parallel. The display is connected by SPI, a serial bus with a clock, a data line, a chip select and a line that distinguishes data from commands: every pixel of every frame travels on it bit by bit. The amplifier is connected by I2S, another serial bus, which carries 22,050 audio samples per second. The buttons use one wire each: a decoded representation. USB, serial as well, carries the firmware and the debug console.

## Slide 5: Shifts in RISC-V: a shift register in one instruction

The shift instructions move all the bits of a register in a single step: `slli` and `srli` fill with zeros, `srai` with copies of the sign bit; `sll`, `srl` and `sra` take the number of positions from a register. In hardware this is not a chain of flip-flops, which would need one clock pulse per position, but a *barrel shifter*, a combinational network of layers of multiplexers, and it is one of the units of the ALU. The code on the right shows the two conversions between parallel and serial.

## Slide 6: The complete program: l14.S (1 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l14.S (2 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l14.S (3 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l14.S (4 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l14.S (5 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: The complete program: l14.S (6 of 6)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 12: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 13: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 14: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 15: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 16: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 17: Exercises: paper first, then PRG32

Five exercises. Draw a 4-bit serial-in, parallel-out shift register and follow its content over four clock pulses. Write the enable and load signals that copy one register into another on a common bus. Complete the warm-up with the receiving loop. On PRG32, show a byte as eight lamps and shift it every half second. Finally make the bit that leaves on one side come back on the other: a rotation, also called a ring counter.
