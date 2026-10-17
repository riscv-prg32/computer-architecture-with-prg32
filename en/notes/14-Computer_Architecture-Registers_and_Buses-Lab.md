# Lecture 14: Elementary Machines: Registers and Buses: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: shift registers; registers as flip-flops; buses and three-state gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: memory-mapped I/O (Lecture 15); memories and addresses (Lecture 15). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) explain how registers share a bus through three-state buffers; (2) use a shift register for serial transfer. Builds on: registers as flip-flops (Lecture 13). Next: Lecture 15, Memory.

Closing thread: A bus is a road that only one register may drive at a time, and a shift register turns a word into a stream of bits: the display of the kit receives its pixels this way. Next: memory.

## Slide 1: Elementary Machines: Registers and Buses: the code

This is the code deck of Lecture 14. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l14.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Send a byte one bit at a time

The warm-up loop transmits a byte one bit at a time, most significant bit first. At each iteration the byte is shifted right by 7 and masked with 1, isolating its top bit; that bit would be placed on a data line and a clock line pulsed; the byte is then shifted left by one, so that the next bit moves into the top position. After eight iterations the whole byte has been sent. The loop is a shift register realised in software. The two elided lines would write to memory-mapped GPIO registers, a mechanism explained in Lecture 15. The chip of the kit contains dedicated hardware that performs the same operation millions of times per second.

## Slide 4: Buses on the PRG32 kit

The buses of the kit. Within the chip the bus is parallel. The display is connected by SPI, a serial bus with a clock line, a data line, a chip-select line and a line distinguishing data from commands; every pixel of every frame travels across it bit by bit. The amplifier is connected by I2S, another serial bus, which carries 22,050 audio samples per second. The buttons use one wire each, a decoded representation. USB, also serial, carries the firmware and the debug console. The kit thus exemplifies the general trend stated in the lecture: parallel inside the chip, serial between chips.

## Slide 5: Shifts in RISC-V: a shift register in one instruction

The shift instructions move every bit of a register in a single step: `slli` and `srli` fill with zeros, `srai` with copies of the sign bit, while `sll`, `srl` and `sra` take the shift amount from a register. In hardware this is not a chain of flip-flops, which would require one clock pulse per position, but a *barrel shifter*, a combinational network of layers of multiplexers, and one of the units of the ALU. The code on the right shows the two conversions, parallel to serial and serial to parallel.

## Slide 6: The complete program: l14.S (1 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l14.S (2 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l14.S (3 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l14.S (4 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l14.S (5 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: The complete program: l14.S (6 of 6)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 12: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 13: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 14: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 15: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 16: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 17: Exercises: paper first, then PRG32

Five exercises. Draw a 4-bit serial-in, parallel-out shift register and trace its content over four clock pulses. Write the enable and load signals that copy one register into another over a common bus. Complete the warm-up with the receiving loop, which reconstructs the byte. On PRG32, display a byte as eight lamps and shift it every half second. Finally, make the bit that leaves on one side re-enter on the other: a rotation, which in hardware is called a ring counter.
