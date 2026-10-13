# Lecture 05: Number Representation: Integers: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Number Representation: Integers: the code

This is the code deck of Lecture 05. The lecture deck holds the concepts; this one holds everything you type and run: the listings with their explanation, the complete program, what it shows, and the way to test it on each of the three hosts.

## Slide 2: In this deck

What the deck contains, in the order of the slides. The program of the lecture is a file that you can build and run as it is: start from there, and come back to the listings to understand each part. The program of this lecture is ~/arc12/code/l05.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Hold LEFT and watch the number

The code reads the buttons, loads `marker_x` from memory, subtracts 1 if LEFT is pressed and stores it back: the load, modify, store of Lecture 02. Hold LEFT and the printed value goes 00000002, 00000001, 00000000, and then FFFFFFFF. Is it a bug? Is FFFFFFFF the number 4,294,967,295, or is it minus one? The fourth callout gives the answer in advance: both, depending on how the bits are read. The rest of the lecture is the set of rules behind that sentence.

## Slide 4: Properties of binary strings

Three properties of binary strings, each with a use. Adding zeros on the left does not change the value. Shifting left by k positions multiplies by 2 to the k: 00101, five, becomes 01010, ten. Shifting right by k divides by 2 to the k and discards the remainder. A shift is far cheaper for a circuit than a multiplication, and the code on the right shows the trick that compilers use: ten times x is eight times x plus two times x, two shifts and an addition.

## Slide 5: Negating a number

To change the sign of a number there are two methods. First: complement every bit, then add 1; six, 0110, becomes 1001 and then 1010, minus six. Second, faster by hand: starting from the right, copy the bits up to and including the first 1, and complement all the others. The code shows that RISC-V does not even need an instruction for this: `neg` is a pseudo-instruction for `sub` from the register `zero`. One exception: the most negative number has no positive partner, and negating it returns the number itself.

## Slide 6: The warm-up, explained

Now the warm-up can be explained completely. The marker was at 0, and `addi` with minus 1 moved one step back on a wheel of 2 to the 32 positions: the register now holds thirty-two ones. Read as unsigned they are 4,294,967,295; in two's complement they are minus 1. The function that prints shows the pattern and takes no side. The marker disappears because it is drawn off the screen in both readings. It was never a bug of the processor: the program lacked a decision.

## Slide 7: Signed or unsigned? You choose with the instruction

RISC-V registers have no type: thirty-two bits are signed or unsigned only for the instruction that reads them. The table shows where the two readings need different instructions. Addition, subtraction and the low part of a product are the same. Comparisons, branches, right shifts, loads of a byte, and division come in pairs: `slt` and `sltu`, `blt` and `bltu`, `sra` and `srl`, `lb` and `lbu`, `div` and `divu`. The letter u in the name always means unsigned. Choosing the wrong member of a pair is a classic error.

## Slide 8: Keeping the marker on the screen

The corrected program keeps the marker on the screen. After the two possible steps, `bgez` asks whether the position is greater than or equal to zero, reading it as a signed number: if not, the position is set to 0. Then `ble` compares it with the maximum, 304, again as signed, and limits it. This is called *clamping*. Note the method: a game does not detect the overflow afterwards; it keeps its values inside a range where overflow cannot happen. One `sw` at the end stores the adjusted value.

## Slide 9: Detecting overflow without flags

Many processors have a carry flag and an overflow flag; RISC-V has neither, and an overflow is detected with a comparison. Unsigned: after `add`, if the sum is smaller than one of the operands, the sum has wrapped around; `sltu` tests it in one instruction. Signed: adding a negative number must make the sum smaller, adding a non-negative one must not; if the two facts disagree, there was an overflow. Compare with the wheel: the first test detects the crossing at the top, the second the crossing at the bottom.

## Slide 10: The complete program: l05.S (1 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 11: The complete program: l05.S (2 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 12: The complete program: l05.S (3 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 13: The complete program: l05.S (4 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 14: The complete program: l05.S (5 of 5)

One page of the complete program, exactly as it is in the repository. Read it from the top: the header says what the program shows and how to build it; the three functions init, update and draw follow, then the data. Lines that you met in the listings of the lecture have the same comments here.

## Slide 15: Run it: what you should see

What the program shows when it runs, and what to press. Predict before you run: if the screen differs from this picture, the difference is information. The picture was written by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The quickest way: PRG32-QT on your own computer. Four steps, each with its command. PRG32-QT behaves like a board on port 8080, which is why the upload command says esp32c6. With debug mode enabled you can stop at any instruction and read registers and memory.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU runs the real firmware on an emulated chip, so the cartridge must be built for the architecture qemu. Stage the cartridge while QEMU is closed. The firmware opens on the Setup menu: choose Run Cartridge and the slot. Remember that the keyboard is read by the terminal, not by the window with the picture.

## Slide 18: Test it on the board

The same program on the kit. The firmware is written once, through USB; after that cartridges travel over Wi-Fi. The upload command is the one used for PRG32-QT with the address of the board. This is the only host that the automatic tests do not run: try it, and report what you see.

## Slide 19: If it does not work

The five most common symptoms, what each means, and what to do. Read the message before changing anything: it nearly always names the cause.

## Slide 20: Exercises: paper first, then PRG32

Five exercises, three on paper and two on the machine. Convert 2026 and the fraction 0.1; write minus 100 in two representations; compute three sums on eight bits and say which overflow. Then, in the clamp code, replace the signed branches with the unsigned ones and predict the behaviour before running: it is an instructive bug. Finally write an `update` that adds 0x10000000 at each frame and signals the signed overflow. The expected results are in the green box: cover it until you have your own.
