# Lecture 20: Buses and the Video Card: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the frame buffer; device controllers; buses and bandwidth; the video card; GPU and GPGPU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Buses and the Video Card: the code

This is the code deck of Lecture 20. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l20.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One pixel, please

The first four lines are yours: x in `a0`, y in `a1`, a colour in `a2`, and a call to `prg32_gfx_pixel`. The second half shows, in principle, what the runtime does with them: it multiplies y by 320, adds x, adds the address of the frame buffer, and stores one byte there. The screen is an array in memory with one element per pixel, and drawing a pixel is a store. Nothing appears until the frame is sent to the display. On a PC, keeping the frame and sending it are the job of the video card.

## Slide 4: The complete program: l20.S (1 of 2)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 5: The complete program: l20.S (2 of 2)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 6: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 7: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 8: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 9: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 10: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 11: Exercises: paper first, then PRG32

Five exercises. Compute the memory of a 4K frame in True Color and the bytes per second at 60 frames. Compute how long the display bus of PRG32 takes to send 20 rows. Draw a diagonal line pixel by pixel. Fill the screen once with a single call and once with 64,000 calls, and compare the frame rates. Finally change one entry of the palette at every frame: all the pixels that use it change together, without being redrawn.
