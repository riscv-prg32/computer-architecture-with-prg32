# Lecture 16: Permanent Memory: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: ROM, flash, firmware; the von Neumann architecture; the cache; secondary memory. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) classify permanent memories and say where the cartridge is kept; (2) explain a cache hit and a cache miss, and locality; (3) compare the access times of disks and solid-state storage. Builds on: the von Neumann architecture (Lecture 03). Next: Lecture 17, Verm1, Part 3: A Body, Rules and States.

Closing thread: Memory is a hierarchy: small and fast near the processor, large and slow far away, and locality makes the trick work. Next: the third part of Verm1, which needs memory for a whole body.

## Slide 1: Permanent Memory: the code

This is the code deck of Lecture 16. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l16.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Switch the kit off and on again

The warm-up. The title resides in the `.rodata` section, which is part of the cartridge file; the file is stored in flash memory and therefore survives. The best score is a variable in the `.data` section, which is copied into RAM when the cartridge starts; it lives in SRAM and is lost. After a power cycle the title is still present and the score has returned to 0. To retain a score permanently it would have to be written to a non-volatile memory, and the lecture surveys the memories that exist. The lesson concerns more than the score: every section of a program has a physical location, and that location determines its lifetime.

## Slide 4: The complete program: l16.S (1 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 5: The complete program: l16.S (2 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 6: The complete program: l16.S (3 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 7: The complete program: l16.S (4 of 4)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 8: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 9: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 10: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 11: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 12: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 13: Exercises

Five exercises. Compute the average rotational latency of a disk at 7,200 revolutions per minute, which is the time of half a revolution. Compute the average access time of a cache with a 95% hit rate, as a weighted mean of the hit and miss times. State where five objects reside on the kit: the boot code, the firmware, a cartridge, a variable and a register. Find the specifications of the storage of one's own laptop or phone. And measure on PRG32 two loops over a large array, one sequential and one strided: is there a difference, and why might there be none on this particular chip, which has no data cache in front of its SRAM?
