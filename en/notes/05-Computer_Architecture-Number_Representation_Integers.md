# Lecture 05: Number Representation: Integers

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: two's complement; base conversions; naturals and overflow; shifts as multiplications; sign and magnitude; signed or unsigned instructions; sign extension. USE NOW: the PRG32 runtime calls, the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Number Representation: Integers

This lecture begins the formal treatment of numbers. It opens with a small surprise on the machine, a marker that walks left past zero and shows FFFFFFFF, and it ends by explaining exactly why that happens. In between you learn to convert between bases, to say which numbers fit in a given number of bits, and to write negative numbers. The quotation by Trilussa, the One arguing with the Zero, is a reminder that in a positional system even a zero has its weight.

## Slide 2: What you will be able to do by the end

Six objectives. The first three are skills on paper: converting between bases 2, 8, 10 and 16, saying which naturals fit in n bits, and encoding signed integers in two ways. The fourth is arithmetic: adding, subtracting and negating in two's complement, and recognising an overflow. The last two return to the machine: explaining the FFFFFFFF of the warm-up, and choosing the RISC-V instruction that reads the same bits as signed or as unsigned.

## Slide 3: Positional systems: base 2, 8, 10 and 16

A positional system with base b uses b digits, from 0 to b minus 1, and the value of a number is the sum of each digit times the power of b that corresponds to its position: the formula in the caption. The table shows thirteen in four bases: 1101 in binary, 15 in octal, 13 in decimal, D in hexadecimal. It is always the same number: only its writing changes. Base 10 has no special status for a machine; it is the base of people with ten fingers.

## Slide 4: Bases that are powers of two share the same bits

Bases that are powers of two share the same bits. The slide takes 127, writes it in binary, and groups the bits from the right: in fours, each group is one hexadecimal digit, giving 7F; in threes, each group is one octal digit, giving 177. No division is needed, only a table lookup. Two details: always group from the right, the least significant end, and pad the leftmost group with zeros if it is incomplete.

## Slide 5: Converting an integer: repeated division

To convert an integer from base 10 to base r, divide by r repeatedly: each remainder is a digit, and the quotient is divided again until it becomes zero. The three tables do it for 127 with r equal to 8, 16 and 2. The yellow box holds the detail that is most often got wrong: the first remainder is the *least* significant digit, so the remainders must be read from the bottom up. Check: 177 in octal is 64 + 56 + 7 = 127.

## Slide 6: Converting a fraction: repeated multiplication

For a number between 0 and 1 the procedure is the mirror image: multiply by r repeatedly; each time the integer part of the product is a digit, starting from the most significant, and the fractional part is multiplied again. 0.875 gives 0.111 and stops, because the fraction becomes zero. 0.8 never stops: the same fractions return, and the digits 1100 repeat for ever. A number that is finite in base ten can be periodic in base two, and with a finite number of bits it must be cut. This is the origin of the rounding errors of Lecture 06.

## Slide 7: Natural numbers on n bits

For natural numbers the law is the simplest possible: X is x written in binary. With n bits there are 2 to the n patterns, so the numbers go from 0 to 2 to the n minus 1: with four bits, from 0 to 15, as the strip shows. The table gives the cases you meet on RISC-V: a byte reaches 255, a halfword 65,535, a word 4,294,967,295. The last is the unsigned reading of FFFFFFFF: half of the answer to the warm-up.

## Slide 8: Overflow

The definition to remember. A register has a finite number of bits, so it represents a finite subset of an infinite set of numbers. The arithmetic operations are closed on the whole set, not on the subset: the sum of two representable numbers may fall outside. When this happens there is an *overflow*. The example uses seven bits, which cover 0 to 127: 100 and 38 are both representable, and their sum, 138, is not. Overflow is not a fault of the machine: it is a consequence of finiteness.

## Slide 9: Arithmetic on four bits

Four calculations on four bits, done column by column as in decimal: 1 plus 1 is 0 with a carry of 1. Six plus eight fits. Fourteen plus three gives seventeen, which needs a fifth bit: an overflow. The difference borrows as in decimal. The product of two numbers of n bits may need 2n bits, which is why RISC-V has two instructions: `mul` for the low half of the product and `mulhu` for the high half. Redo the four calculations by hand, covering the results.

## Slide 10: Sign and magnitude

The most natural idea: use the leftmost bit for the sign and the remaining bits for the magnitude. It is easy for a person to read, and it has two defects. Zero has two representations, plus zero and minus zero. And arithmetic is awkward: to add two numbers of opposite sign the circuit must compare the magnitudes, subtract the smaller from the larger and choose the sign. A representation that makes addition complicated is a poor law in the sense of the previous section.

## Slide 11: Two's complement

Two's complement. Non-negative numbers are represented by themselves. A negative number x is represented by 2 to the n minus its magnitude: on four bits, minus 3 is 16 minus 3, that is 13, 1101. The range is not symmetric: from minus 2 to the n minus 1 up to 2 to the n minus 1, minus 1, so on four bits from minus 8 to plus 7. Zero has one representation only, and the leftmost bit is 1 exactly when the number is negative. For a 32-bit register the range is about minus two billion to plus two billion.

## Slide 12: Four bits, three readings

The same sixteen patterns read in three ways. In the left table, where the leftmost bit is 0, the three readings agree. In the right table they differ: 1000 is 8 as unsigned, minus zero in sign and magnitude, and minus 8 in two's complement; 1111 is 15, minus 7 or minus 1. The sentence at the bottom is the key to the whole lecture: the bits do not say which column is right. The program says it, through the instructions it chooses.

## Slide 13: The number wheel

With n bits the numbers form a circle: after the last pattern comes the first. Adding 1 moves one step clockwise. The inner ring gives the unsigned value, the outer discs the value in two's complement. The wheel "breaks" in two different places. For the unsigned reading the break is at the top, between 1111 and 0000: crossing it is a carry. For two's complement it is at the bottom, between 0111 and 1000: crossing it is a signed overflow. And one step back from 0000 is 1111: this is the FFFFFFFF of the warm-up.

## Slide 14: Two's complement arithmetic

Three calculations that show the advantage of two's complement. To add 2 and minus 6, simply add the two patterns: 0010 plus 1010 is 1100, which reads minus 4. To add two negative numbers, add the patterns and discard the carry out of the leftmost position. Even the product works on the low four bits. The first row of bullets is the point: the adder does not need to know the signs. The circuit that adds natural numbers already gives the right answer for signed ones.

## Slide 15: Detecting overflow

There are two overflows, and they are independent. For unsigned numbers, overflow is a carry out of the leftmost bit: 128 plus 130 on eight bits leaves 2 in the register. For signed numbers, overflow is a result with the wrong sign: 127 plus 127 produces no carry out, but the pattern reads minus 2. The rule: two positive operands that give a negative sum, or two negative ones that give a positive sum. Two operands of opposite sign can never overflow, because the result lies between them.

## Slide 16: Sign extension: the same number on more bits

How is a number moved to more bits without changing its value? For two's complement, copy the sign bit into all the new positions: minus 1 on four bits, 1111, becomes 1111 1111 on eight; plus 5, 0101, becomes 0000 0101. This is *sign extension*. The processor does it whenever a short value meets a long one: the twelve-bit constant of `addi` is sign-extended to thirty-two bits, and `lb` sign-extends the byte it loads, while `lbu` fills with zeros.

## Slide 17: Check your understanding: Which number does the 8-bit pattern 1111 1100 represent in two's complement? / On 8 bits, which addition produces a signed overflow?

The leftmost bit is 1, so the number is negative: discard 252, which is the unsigned reading. To find the magnitude, change the sign: complement, 0000 0011, and add one, 0000 0100, which is 4. The pattern is minus 4.

On eight bits in two's complement the range is from minus 128 to plus 127. Compute each sum and see whether it falls in the range. Remember that operands of opposite sign cannot overflow, which excludes two options at once.

## Slide 18: Check your understanding: t0 holds 0xFFFFFFFF and t1 holds 1. After slt t2, t0, t1 and sltu t3, t0, t1: / How is 0.625 written in binary?

The same two registers, two instructions that differ by one letter. `slt` reads FFFFFFFF as minus 1, which is less than 1. `sltu` reads it as more than four billion, which is not. This question is the whole lecture in one line.

Use repeated multiplication: 0.625 times 2 is 1.25, digit 1; 0.25 times 2 is 0.5, digit 0; 0.5 times 2 is 1.0, digit 1. Check with the weights: one half plus one eighth is 0.625.

## Slide 19: Glossary: English and Italian

Twelve terms. *Signed integer* is in Italian *numero relativo* or *intero con segno*. *Carry* and *borrow* are the digit carried in an addition and the one borrowed in a subtraction. *Sign extension* is the operation that widens a signed number. *To clamp* has no single Italian word: it means to limit a value to an interval.

## Slide 20: Conclusions and reading

Five conclusions. Each base has its use: two for circuits, sixteen for people who read bits. With n bits there are 2 to the n numbers, and the encoding law says which. Two's complement turns subtraction into addition. Overflow is the price of finite registers: detect it, or design it away as with the clamp. And in RISC-V the bits have no type: the instruction chooses. The next lecture completes the picture with the real numbers.
