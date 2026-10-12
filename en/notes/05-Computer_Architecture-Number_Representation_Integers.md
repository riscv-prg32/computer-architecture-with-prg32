# Lecture 05: Number Representation: Integers

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Number Representation: Integers

This lecture begins the formal treatment of numbers. It opens with a small surprise on the machine, a marker that walks left past zero and shows FFFFFFFF, and it ends by explaining exactly why that happens. In between you learn to convert between bases, to say which numbers fit in a given number of bits, and to write negative numbers. The quotation by Trilussa, the One arguing with the Zero, is a reminder that in a positional system even a zero has its weight.

## Slide 2: What you will be able to do by the end

Six objectives. The first three are skills on paper: converting between bases 2, 8, 10 and 16, saying which naturals fit in n bits, and encoding signed integers in two ways. The fourth is arithmetic: adding, subtracting and negating in two's complement, and recognising an overflow. The last two return to the machine: explaining the FFFFFFFF of the warm-up, and choosing the RISC-V instruction that reads the same bits as signed or as unsigned.

## Slide 3: Warm-up on the machine

As always, the lecture starts on the machine. A few lines move a marker to the left when you hold a button, and print its position. Run it before reading on, and write down what you expect to see when the position passes zero.

## Slide 4: Hold LEFT and watch the number

The code reads the buttons, loads `marker_x` from memory, subtracts 1 if LEFT is pressed and stores it back: the load, modify, store of Lecture 02. Hold LEFT and the printed value goes 00000002, 00000001, 00000000, and then FFFFFFFF. Is it a bug? Is FFFFFFFF the number 4,294,967,295, or is it minus one? The fourth callout gives the answer in advance: both, depending on how the bits are read. The rest of the lecture is the set of rules behind that sentence.

## Slide 5: Bases and conversions

The first part is about bases: what a positional system is in general, why bases 2, 8 and 16 are relatives, and two algorithms, one to convert the integer part of a number and one for the fractional part.

## Slide 6: Positional systems: base 2, 8, 10 and 16

A positional system with base b uses b digits, from 0 to b minus 1, and the value of a number is the sum of each digit times the power of b that corresponds to its position: the formula in the caption. The table shows thirteen in four bases: 1101 in binary, 15 in octal, 13 in decimal, D in hexadecimal. It is always the same number: only its writing changes. Base 10 has no special status for a machine; it is the base of people with ten fingers.

## Slide 7: Bases that are powers of two share the same bits

Bases that are powers of two share the same bits. The slide takes 127, writes it in binary, and groups the bits from the right: in fours, each group is one hexadecimal digit, giving 7F; in threes, each group is one octal digit, giving 177. No division is needed, only a table lookup. Two details: always group from the right, the least significant end, and pad the leftmost group with zeros if it is incomplete.

## Slide 8: Converting an integer: repeated division

To convert an integer from base 10 to base r, divide by r repeatedly: each remainder is a digit, and the quotient is divided again until it becomes zero. The three tables do it for 127 with r equal to 8, 16 and 2. The yellow box holds the detail that is most often got wrong: the first remainder is the *least* significant digit, so the remainders must be read from the bottom up. Check: 177 in octal is 64 + 56 + 7 = 127.

## Slide 9: Converting a fraction: repeated multiplication

For a number between 0 and 1 the procedure is the mirror image: multiply by r repeatedly; each time the integer part of the product is a digit, starting from the most significant, and the fractional part is multiplied again. 0.875 gives 0.111 and stops, because the fraction becomes zero. 0.8 never stops: the same fractions return, and the digits 1100 repeat for ever. A number that is finite in base ten can be periodic in base two, and with a finite number of bits it must be cut. This is the origin of the rounding errors of Lecture 06.

## Slide 10: Natural numbers and overflow

The second part answers the question "which numbers fit?". It defines what a representation is, treats the natural numbers, states three useful properties of strings of bits, and introduces overflow, the central idea of the lecture.

## Slide 11: Encoding strategies

A representation is a law, X = R(x), that associates a number x with a string of bits X. Keep the two letters apart for the whole lecture: small x is the number we mean, capital X is the pattern stored in the register. Different kinds of numbers call for different laws, and a good law is one that makes addition and comparison easy to build as circuits. This criterion, the simplicity of the circuit, will decide the winner among the representations of signed numbers.

## Slide 12: Natural numbers on n bits

For natural numbers the law is the simplest possible: X is x written in binary. With n bits there are 2 to the n patterns, so the numbers go from 0 to 2 to the n minus 1: with four bits, from 0 to 15, as the strip shows. The table gives the cases you meet on RISC-V: a byte reaches 255, a halfword 65,535, a word 4,294,967,295. The last is the unsigned reading of FFFFFFFF: half of the answer to the warm-up.

## Slide 13: Properties of binary strings

Three properties of binary strings, each with a use. Adding zeros on the left does not change the value. Shifting left by k positions multiplies by 2 to the k: 00101, five, becomes 01010, ten. Shifting right by k divides by 2 to the k and discards the remainder. A shift is far cheaper for a circuit than a multiplication, and the code on the right shows the trick that compilers use: ten times x is eight times x plus two times x, two shifts and an addition.

## Slide 14: Overflow

The definition to remember. A register has a finite number of bits, so it represents a finite subset of an infinite set of numbers. The arithmetic operations are closed on the whole set, not on the subset: the sum of two representable numbers may fall outside. When this happens there is an *overflow*. The example uses seven bits, which cover 0 to 127: 100 and 38 are both representable, and their sum, 138, is not. Overflow is not a fault of the machine: it is a consequence of finiteness.

## Slide 15: Arithmetic on four bits

Four calculations on four bits, done column by column as in decimal: 1 plus 1 is 0 with a carry of 1. Six plus eight fits. Fourteen plus three gives seventeen, which needs a fifth bit: an overflow. The difference borrows as in decimal. The product of two numbers of n bits may need 2n bits, which is why RISC-V has two instructions: `mul` for the low half of the product and `mulhu` for the high half. Redo the four calculations by hand, covering the results.

## Slide 16: Signed integers

So far the numbers had no sign. The third part presents the ways of writing negative numbers with bits, compares them, and shows why one of them, two's complement, is used by every processor.

## Slide 17: Sign and magnitude

The most natural idea: use the leftmost bit for the sign and the remaining bits for the magnitude. It is easy for a person to read, and it has two defects. Zero has two representations, plus zero and minus zero. And arithmetic is awkward: to add two numbers of opposite sign the circuit must compare the magnitudes, subtract the smaller from the larger and choose the sign. A representation that makes addition complicated is a poor law in the sense of the previous section.

## Slide 18: Two's complement

Two's complement. Non-negative numbers are represented by themselves. A negative number x is represented by 2 to the n minus its magnitude: on four bits, minus 3 is 16 minus 3, that is 13, 1101. The range is not symmetric: from minus 2 to the n minus 1 up to 2 to the n minus 1, minus 1, so on four bits from minus 8 to plus 7. Zero has one representation only, and the leftmost bit is 1 exactly when the number is negative. For a 32-bit register the range is about minus two billion to plus two billion.

## Slide 19: Four bits, three readings

The same sixteen patterns read in three ways. In the left table, where the leftmost bit is 0, the three readings agree. In the right table they differ: 1000 is 8 as unsigned, minus zero in sign and magnitude, and minus 8 in two's complement; 1111 is 15, minus 7 or minus 1. The sentence at the bottom is the key to the whole lecture: the bits do not say which column is right. The program says it, through the instructions it chooses.

## Slide 20: The number wheel

With n bits the numbers form a circle: after the last pattern comes the first. Adding 1 moves one step clockwise. The inner ring gives the unsigned value, the outer discs the value in two's complement. The wheel "breaks" in two different places. For the unsigned reading the break is at the top, between 1111 and 0000: crossing it is a carry. For two's complement it is at the bottom, between 0111 and 1000: crossing it is a signed overflow. And one step back from 0000 is 1111: this is the FFFFFFFF of the warm-up.

## Slide 21: Two's complement arithmetic

Three calculations that show the advantage of two's complement. To add 2 and minus 6, simply add the two patterns: 0010 plus 1010 is 1100, which reads minus 4. To add two negative numbers, add the patterns and discard the carry out of the leftmost position. Even the product works on the low four bits. The first row of bullets is the point: the adder does not need to know the signs. The circuit that adds natural numbers already gives the right answer for signed ones.

## Slide 22: Negating a number

To change the sign of a number there are two methods. First: complement every bit, then add 1; six, 0110, becomes 1001 and then 1010, minus six. Second, faster by hand: starting from the right, copy the bits up to and including the first 1, and complement all the others. The code shows that RISC-V does not even need an instruction for this: `neg` is a pseudo-instruction for `sub` from the register `zero`. One exception: the most negative number has no positive partner, and negating it returns the number itself.

## Slide 23: Subtraction is addition.

The consequence that matters for hardware. To compute y minus x, add to y the two's complement of x. So a subtractor is not needed: an adder and a circuit that complements the bits are enough, and from addition come multiplication and division. This is the engineering reason for the choice of two's complement, and you will see the adder itself in the lectures on logic.

## Slide 24: Detecting overflow

There are two overflows, and they are independent. For unsigned numbers, overflow is a carry out of the leftmost bit: 128 plus 130 on eight bits leaves 2 in the register. For signed numbers, overflow is a result with the wrong sign: 127 plus 127 produces no carry out, but the pattern reads minus 2. The rule: two positive operands that give a negative sum, or two negative ones that give a positive sum. Two operands of opposite sign can never overflow, because the result lies between them.

## Slide 25: Back to the machine

The last part goes back to RISC-V. It explains the warm-up, shows how the processor distinguishes signed from unsigned, corrects the program of the marker, detects an overflow without flags, and ends with sign extension.

## Slide 26: The warm-up, explained

Now the warm-up can be explained completely. The marker was at 0, and `addi` with minus 1 moved one step back on a wheel of 2 to the 32 positions: the register now holds thirty-two ones. Read as unsigned they are 4,294,967,295; in two's complement they are minus 1. The function that prints shows the pattern and takes no side. The marker disappears because it is drawn off the screen in both readings. It was never a bug of the processor: the program lacked a decision.

## Slide 27: Signed or unsigned? You choose with the instruction

RISC-V registers have no type: thirty-two bits are signed or unsigned only for the instruction that reads them. The table shows where the two readings need different instructions. Addition, subtraction and the low part of a product are the same. Comparisons, branches, right shifts, loads of a byte, and division come in pairs: `slt` and `sltu`, `blt` and `bltu`, `sra` and `srl`, `lb` and `lbu`, `div` and `divu`. The letter u in the name always means unsigned. Choosing the wrong member of a pair is a classic error.

## Slide 28: Keeping the marker on the screen

The corrected program keeps the marker on the screen. After the two possible steps, `bgez` asks whether the position is greater than or equal to zero, reading it as a signed number: if not, the position is set to 0. Then `ble` compares it with the maximum, 304, again as signed, and limits it. This is called *clamping*. Note the method: a game does not detect the overflow afterwards; it keeps its values inside a range where overflow cannot happen. One `sw` at the end stores the adjusted value.

## Slide 29: Detecting overflow without flags

Many processors have a carry flag and an overflow flag; RISC-V has neither, and an overflow is detected with a comparison. Unsigned: after `add`, if the sum is smaller than one of the operands, the sum has wrapped around; `sltu` tests it in one instruction. Signed: adding a negative number must make the sum smaller, adding a non-negative one must not; if the two facts disagree, there was an overflow. Compare with the wheel: the first test detects the crossing at the top, the second the crossing at the bottom.

## Slide 30: Sign extension: the same number on more bits

How is a number moved to more bits without changing its value? For two's complement, copy the sign bit into all the new positions: minus 1 on four bits, 1111, becomes 1111 1111 on eight; plus 5, 0101, becomes 0000 0101. This is *sign extension*. The processor does it whenever a short value meets a long one: the twelve-bit constant of `addi` is sign-extended to thirty-two bits, and `lb` sign-extends the byte it loads, while `lbu` fills with zeros.

## Slide 31: Check your understanding: Which number does the 8-bit pattern 1111 1100 represent in two's complement?

The leftmost bit is 1, so the number is negative: discard 252, which is the unsigned reading. To find the magnitude, change the sign: complement, 0000 0011, and add one, 0000 0100, which is 4. The pattern is minus 4.

## Slide 32: Check your understanding: On 8 bits, which addition produces a signed overflow?

On eight bits in two's complement the range is from minus 128 to plus 127. Compute each sum and see whether it falls in the range. Remember that operands of opposite sign cannot overflow, which excludes two options at once.

## Slide 33: Check your understanding: t0 holds 0xFFFFFFFF and t1 holds 1. After slt t2, t0, t1 and sltu t3, t0, t1:

The same two registers, two instructions that differ by one letter. `slt` reads FFFFFFFF as minus 1, which is less than 1. `sltu` reads it as more than four billion, which is not. This question is the whole lecture in one line.

## Slide 34: Check your understanding: How is 0.625 written in binary?

Use repeated multiplication: 0.625 times 2 is 1.25, digit 1; 0.25 times 2 is 0.5, digit 0; 0.5 times 2 is 1.0, digit 1. Check with the weights: one half plus one eighth is 0.625.

## Slide 35: Exercises: paper first, then PRG32

Five exercises, three on paper and two on the machine. Convert 2026 and the fraction 0.1; write minus 100 in two representations; compute three sums on eight bits and say which overflow. Then, in the clamp code, replace the signed branches with the unsigned ones and predict the behaviour before running: it is an instructive bug. Finally write an `update` that adds 0x10000000 at each frame and signals the signed overflow. The expected results are in the green box: cover it until you have your own.

## Slide 36: Glossary: English and Italian

Twelve terms. *Signed integer* is in Italian *numero relativo* or *intero con segno*. *Carry* and *borrow* are the digit carried in an addition and the one borrowed in a subtraction. *Sign extension* is the operation that widens a signed number. *To clamp* has no single Italian word: it means to limit a value to an interval.

## Slide 37: Conclusions and reading

Five conclusions. Each base has its use: two for circuits, sixteen for people who read bits. With n bits there are 2 to the n numbers, and the encoding law says which. Two's complement turns subtraction into addition. Overflow is the price of finite registers: detect it, or design it away as with the clamp. And in RISC-V the bits have no type: the instruction chooses. The next lecture completes the picture with the real numbers.
