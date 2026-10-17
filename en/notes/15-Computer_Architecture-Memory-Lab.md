# Lecture 15: Memory: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: memories and addresses; little-endian byte order; processor and memory; memory-mapped I/O. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) compute the capacity of a memory from its address and data lines; (2) describe the interface between processor and memory during a load; (3) explain memory-mapped input/output. Builds on: little-endian byte order (Lecture 04). Next: Lecture 16, Permanent Memory.

Bridge. Since Lecture 02, lw t1, 0(t0) has read a word at an address computed from t0. Today that address is the one placed on the address bus, register plus constant. Lecture 19 calls this base plus displacement and compares it with the other addressing modes. Recall: In lw t1, 8(t0), which address goes on the address bus?

Closing thread: Every lw and sw of the course is a short dialogue on the address bus, the data bus and two control lines; a device answers on the same bus. Next: memory that survives without power, and caches.

## Slide 1: Memory: the code

This is the code deck of Lecture 15. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l15.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Read the same memory as a word and as bytes

The warm-up. `value` is a word containing 0x12345678. `lw` loads all of it into `t1`; three `lbu` instructions then load single bytes at the address of the word and at that address plus 1 and plus 3, yielding 0x78, 0x56 and 0x12. Two facts follow. A word occupies four consecutive addresses, because memory is addressed byte by byte. And the byte at the lowest address is the least significant, which is little-endian order. Opening the memory view of PRG32-QT at the address held in `t0` displays 78 56 34 12, so the byte-order slide of Lecture 04 becomes an observation.

## Slide 4: Aligned and unaligned words

A word is *aligned* when it begins at an address that is a multiple of its size, a multiple of 4 for 32-bit words. An aligned word is fetched in a single access; an unaligned one straddles two memory words. In RISC-V the assembler aligns `.word` data automatically, and a load from a misaligned address is, depending on the implementation, slower or refused altogether; the specification leaves the choice to the implementer, and correct programs keep their data aligned. The code on the right shows the typical case: after a string of six bytes, `.balign 4` skips two bytes so that the following word is aligned.

## Slide 5: Fetching a word: lw t1, 0(t0)

The six steps of `lw t1, 0(t0)`. The ALU computes the address and places it in MA. MA drives the address bus. The control unit asserts read enable. The memory decodes the address and places the word on the data bus. The datum is captured in MB. MB is copied into `t1`. A store is symmetrical: the address goes to MA, the datum to MB, write enable is asserted, and the memory stores what it finds on the data bus. The access time is the interval between the second and the fifth step, and Lecture 19 places these steps within the processor cycle.

## Slide 6: Where things live on the ESP32-C6 (simplified)

A simplified address map of the ESP32-C6. Addresses beginning 0x4000 hold the ROM containing the start-up code; 0x4080 is the SRAM, into which the cartridge is loaded; 0x4200 is the external flash holding the firmware; 0x6000 are the registers of the peripherals. The same thirty-two address lines reach everything, and the same `lw` and `sw` operate everything, which is memory-mapped I/O in concrete form. The cartridge address seen in the debugger, 0x40800000, is the beginning of RAM.

## Slide 7: The complete program: l15.S (1 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: The complete program: l15.S (2 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 9: The complete program: l15.S (3 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 10: The complete program: l15.S (4 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: The complete program: l15.S (5 of 5)

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

Five exercises. Compute the address lines, data lines and total number of bits of a memory of 4 Ki words of 16 bits. Write, in order of increasing address, the bytes stored for a word and for a string on a little-endian machine. List the steps of a store on the processor-memory interface. In PRG32-QT, locate the counter in the memory view and observe its four bytes change. And store a word, read it back as four bytes, reconstruct it with shifts and ORs, and verify that the result matches: an exercise that combines the byte order of this lecture with the bitwise operations of Lecture 08.
