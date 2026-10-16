# Lecture 20: Buses and the Video Card: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the frame buffer; device controllers; buses and bandwidth; the video card; GPU and GPGPU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Buses and the Video Card: the code

This is the code deck of Lecture 20. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l20.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One pixel, please

The warm-up. The first four lines belong to the program: x in `a0`, y in `a1`, a colour in `a2`, and a call to `prg32_gfx_pixel`. The second half shows in principle, not as the literal source of the runtime, what is done with them: y is multiplied by 320, x added, the base address of the frame buffer added, and one byte stored there. The screen is thus an array in memory with one element per pixel, and drawing a pixel is a store instruction. Nothing appears until the frame is transmitted to the display. On a PC, holding the frame and transmitting it are the two functions of the video card.

## Slide 4: The complete program: l20.S (1 of 2)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 5: The complete program: l20.S (2 of 2)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 6: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 7: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 8: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 9: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 10: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 11: Exercises: paper first, then PRG32

Five exercises. Compute the memory of a 4K frame in True Color and the bytes per second required at 60 frames per second. Compute how long the display bus of PRG32 takes to send 20 rows. Draw a diagonal line pixel by pixel. Fill the screen once with a single call and once with 64,000 calls, and compare the frame rates, which makes the cost of per-pixel calls quantitative. Finally, modify one entry of the palette at each frame: every pixel that uses it changes at once without being redrawn, which demonstrates the power of indirection that an indexed frame buffer provides.
