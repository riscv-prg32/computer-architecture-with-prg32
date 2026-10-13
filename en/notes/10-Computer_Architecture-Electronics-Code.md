# Lecture 10: Introduction to Electronics and Digital Electronics: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Introduction to Electronics and Digital Electronics: the code

This is the code deck of Lecture 10. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l10.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: One button, one bit

In your program a pressed button is a 1. On the board the button LEFT is a switch between a pin of the chip, GPIO18, and ground. When it is pressed the pin is at 0 volts; when it is released the pin is at 3.3 volts. So pressed means 0 volts, and yet the program reads 1. The four callouts turn this into the questions of the lecture: what is a volt, why is the released pin at 3.3 V, and who decides that 0 V is a bit? The last section answers them.

## Slide 4: From the finger to the bit

The whole journey in seven steps. The finger closes the switch; the pin falls to 0 V in less than a microsecond; the input buffer sees a voltage below its threshold, a logic 0; the level is captured in a flip-flop; the firmware reads it with a load instruction, inverts it and packs it with the others; your program tests it with `andi`. The right column says where each step is explained: three in this lecture, the others in lectures you have attended or will attend. Seven layers lie between a finger and a bit.

## Slide 5: The kit as a circuit

The kit seen as a circuit. A breadboard has holes joined in rows underneath, so components connect without soldering. Two long buses carry the supply, 3.3 V and ground, and a separate one carries 5 V for the audio amplifiers. Every part shares the same ground: without a common reference the voltages of two parts would mean nothing to each other. Buttons go from a pin to ground; the display and the amplifiers receive digital signals. Never connect a pin that is driven high directly to ground.

## Slide 6: The complete program: l10.S (1 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 7: The complete program: l10.S (2 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 8: The complete program: l10.S (3 of 3)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 9: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 10: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 11: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 12: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 13: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 14: Exercises: paper first, then the kit

Five exercises. Size the resistor of a blue LED and compute the power it dissipates. Compute the output of a divider and say how an input of the kit would read it: compare it with the two thresholds. Draw a NAND with three inputs and count the transistors. Check the NOR on the drawing. And on the kit, with the lamps cartridge running, bridge a button pin to ground with a wire: explain what you see, and what would happen without the pull-up.
