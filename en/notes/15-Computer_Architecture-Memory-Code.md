# Lecture 15: Memory: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Memory: the code

This is the code deck of Lecture 15. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l15.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Read the same memory as a word and as bytes

`value` is a word that contains 0x12345678. `lw` loads all of it into `t1`. Then three `lbu` instructions load single bytes, at the address of the word, at that address plus 1 and plus 3: they give 0x78, 0x56 and 0x12. Two facts follow. A word occupies four consecutive addresses, because memory is addressed byte by byte. And the byte at the lowest address is the least significant: the little-endian order. Open the memory view of PRG32-QT at the address in `t0` and you see 78 56 34 12.

## Slide 4: Aligned and unaligned words

A word is *aligned* when it starts at an address that is a multiple of its size: a multiple of 4 for 32-bit words. An aligned word is fetched with a single access; an unaligned one straddles two memory words. In RISC-V the assembler aligns `.word` data for you, and a load from a misaligned address is, depending on the processor, slower or refused. The code on the right shows the typical case: after a string of six bytes, `.balign 4` skips two bytes so that the next word is aligned.

## Slide 5: Fetching a word: lw t1, 0(t0)

The six steps of `lw t1, 0(t0)`. The ALU computes the address and puts it in MA. MA drives the address bus. The control unit raises read enable. The memory decodes the address and puts the word on the data bus. The datum is captured in MB. MB is copied into `t1`. A store is symmetrical: the address goes to MA, the datum to MB, write enable is raised, and the memory stores what it finds on the data bus. The access time is what elapses between the second and the fifth step.

## Slide 6: Where things live on the ESP32-C6 (simplified)

A simplified map of the addresses of the ESP32-C6. Addresses that begin with 0x4000 are the ROM with the code that starts the chip; 0x4080 is the SRAM, where your cartridge is loaded; 0x4200 is the external flash with the firmware; 0x6000 are the registers of the peripherals. The same thirty-two address lines reach everything, and the same `lw` and `sw` operate everything. The cartridge address you saw in the debugger, 0x40800000, is the beginning of the RAM.

## Slide 7: The complete program: l15.S (1 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l15.S (2 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: The complete program: l15.S (3 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 10: The complete program: l15.S (4 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: The complete program: l15.S (5 of 5)

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

Five exercises. Compute address lines, data lines and total bits of a memory of 4 KiB words of 16 bits. Write, in order of address, the bytes stored by a word and by a string on a little-endian machine. List the steps of a store on the processor-memory interface. In PRG32-QT find your counter in the memory view and watch its four bytes change. And store a word, read it back as four bytes, rebuild it with shifts and ORs, and check that it matches.
