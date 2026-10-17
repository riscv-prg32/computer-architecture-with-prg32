# Lecture 05: Number Representation: Integers: the code

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: two's complement; base conversions; naturals and overflow; shifts as multiplications; sign and magnitude; signed or unsigned instructions; sign extension. USE NOW: the PRG32 runtime calls, the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) convert between bases and read an n-bit pattern as unsigned and as two's complement; (2) recognise overflow in unsigned and in signed addition; (3) choose between signed and unsigned instructions, including lb and lbu. Builds on: only what Lecture 01 set up. Next: Lecture 06, Number Representation: Real Numbers.

Closing thread: The 0xFFFFFFFF of a counter that went below zero is -1 in two's complement: the bits did not change, the reading did. Next: fractions on a chip with no floating-point unit.

## Slide 1: Number Representation: Integers: the code

This is the code deck of Lecture 05. Where the lecture deck develops the concepts, this deck contains everything that is written and executed: each listing with its commentary, the complete program of the lecture, the output it is expected to produce, and the procedure for testing it on each of the three hosts. The two decks are meant to be read together: the concepts explain the code, and the code gives the concepts an observable consequence.

## Slide 2: In this deck

The contents of the deck, in the order of the slides. The program of the lecture is a complete source file that can be built and executed as it stands. The recommended approach is to run it first, observe its behaviour, and then return to the individual listings to understand how each part contributes to that behaviour. The program of this lecture is ~/arc12/code/l05.S; tools/tests/cartridges/run.py builds it, runs it on PRG32-QT with scripted input and checks the pixels of the frame.

## Slide 3: Hold LEFT and watch the number

The warm-up. The code reads the buttons, loads `marker_x` from memory, subtracts 1 if LEFT is pressed and stores the result back: the load-modify-store idiom of Lecture 02. Holding LEFT, the printed value runs 00000002, 00000001, 00000000, and then FFFFFFFF. Is this an error? Is FFFFFFFF the number 4,294,967,295, or minus one? The fourth callout anticipates the answer: both, depending on how the bits are interpreted. The remainder of the lecture develops the rules behind that sentence, and by its end the phenomenon should be fully explicable.

## Slide 4: Properties of binary strings

Three properties of binary strings, each with a practical use. Extending a number on the left with zeros leaves its value unchanged. Shifting left by k positions multiplies by 2^k: 00101, five, becomes 01010, ten. Shifting right by k positions divides by 2^k and discards the remainder. A shift is far cheaper in hardware than a general multiplication, and the code on the right shows the decomposition that compilers routinely apply: ten times x equals eight times x plus two times x, that is, two shifts and one addition. Shifts also underlie the fixed-point arithmetic of Lecture 06.

## Slide 5: Negating a number

Two methods change the sign of a two's complement number. The first complements every bit and adds 1: six, 0110, becomes 1001 and then 1010, minus six. The second, faster by hand, scans from the right, copies the bits up to and including the first 1, and complements all the others. The justification of the first method is algebraic: the complement of x equals (2^n - 1) - x, so adding 1 yields 2^n - x, the representation of -x. RISC-V needs no dedicated instruction: `neg` is a pseudo-instruction for `sub` from the register `zero`. One exception remains: the most negative number has no positive counterpart, and negating it returns the same pattern.

## Slide 6: The warm-up, explained

The warm-up can now be explained completely. The marker stood at 0, and `addi` with -1 moved it one step backwards on a circle of 2^32 positions, leaving thirty-two ones in the register. Read as unsigned, they denote 4,294,967,295; read in two's complement, -1. The printing routine displays the pattern and takes no position on its meaning. The marker disappears because it is drawn off screen under either interpretation. The processor did not err: the program lacked a decision about how its value was to be interpreted and constrained.

## Slide 7: Signed or unsigned? You choose with the instruction

RISC-V registers carry no type: thirty-two bits are signed or unsigned only for the instruction that reads them. The table identifies where the two interpretations require different instructions. Addition, subtraction and the low half of a product are identical for both. Comparisons, branches, right shifts, byte loads and division come in pairs: `slt` and `sltu`, `blt` and `bltu`, `sra` and `srl`, `lb` and `lbu`, `div` and `divu`. The letter u in the mnemonic always denotes the unsigned variant. Selecting the wrong member of a pair is a classic and instructive error.

## Slide 8: Keeping the marker on the screen

The corrected program keeps the marker on the screen. After the two possible displacements, `bgez` tests whether the position is greater than or equal to zero, interpreting it as a signed number, and if it is not, sets it to 0. `ble` then compares it with the maximum, 304, again as a signed number, and limits it accordingly. This technique is called *clamping*. The method deserves notice: a game does not detect overflow after the fact, but keeps its values within a range in which overflow cannot occur. A single `sw` at the end stores the adjusted value.

## Slide 9: Detecting overflow without flags

Many processors provide a carry flag and an overflow flag; RISC-V provides neither, and overflow is detected by comparison. In the unsigned case, if the sum after `add` is smaller than one of the operands, the result has wrapped around, a condition that `sltu` tests in a single instruction. In the signed case, adding a negative number must decrease the sum and adding a non-negative one must not; if these two facts disagree, overflow has occurred. In terms of the number wheel, the first test detects the crossing at the top and the second the crossing at the bottom. The absence of flags is a deliberate design choice, discussed in Lecture 18.

## Slide 10: The complete program: l05.S (1 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 11: The complete program: l05.S (2 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 12: The complete program: l05.S (3 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 13: The complete program: l05.S (4 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 14: The complete program: l05.S (5 of 5)

One page of the complete program, reproduced exactly as it appears in the repository. It should be read from the top. The header states what the program displays and how it is built; the three entry points, init, update and draw, follow, and the data sections close the file. Lines already met in the listings of the lecture carry the same comments here, so that each fragment can be located within the whole.

## Slide 15: Run it: what you should see

The expected behaviour of the program, and the input it requires. The outcome should be predicted before the program is run: any discrepancy between prediction and screen is information about one's model of the machine, and is worth explaining before it is corrected. The image was produced by the automatic test, not drawn by hand.

## Slide 16: Test it on PRG32-QT

The most direct route: PRG32-QT on one's own computer, in four steps, each with its command. PRG32-QT presents itself to the tools as a board listening on port 8080, which is why the upload command names the esp32c6. With debug mode enabled, execution can be halted at any instruction and the registers and memory inspected.

## Slide 17: Test it on QEMU

The same program on the emulator. QEMU executes the actual firmware on an emulated chip, so the cartridge must be built for the qemu architecture and staged while QEMU is not running. The firmware starts on its Setup menu, from which Run Cartridge and the slot are selected. Keyboard input is read by the terminal from which QEMU was launched, not by the window that displays the image.

## Slide 18: Test it on the board

The same program on the physical kit. The firmware is written once, over USB; thereafter cartridges are transferred over Wi-Fi with the same upload command used for PRG32-QT, addressed to the board. This is the only host not exercised by the automatic tests, so observations made on the board are particularly valuable and should be reported.

## Slide 19: If it does not work

The five most frequent symptoms, their meaning, and the corrective action. The error message should be read in full before anything is changed: in nearly every case it names the cause. When asking for help, the command and the complete message should be reported verbatim.

## Slide 20: Exercises: paper first, then PRG32

Five exercises, three on paper and two on the machine. Convert 2026 and the fraction 0.1; write -100 in two representations; compute three eight-bit sums and determine which overflow. Then, in the clamping code, replace the signed branches by their unsigned counterparts and predict the behaviour before running it: the resulting error is instructive precisely because it is predictable. Finally, write an `update` that adds 0x10000000 at each frame and signals the signed overflow. The expected results are given in the green box, which should remain covered until one's own answers have been obtained.
