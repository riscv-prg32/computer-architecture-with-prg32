# Lecture 05: Number Representation: Integers

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: two's complement; base conversions; naturals and overflow; shifts as multiplications; sign and magnitude; signed or unsigned instructions; sign extension. USE NOW: the PRG32 runtime calls, the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) convert between bases and read an n-bit pattern as unsigned and as two's complement; (2) recognise overflow in unsigned and in signed addition; (3) choose between signed and unsigned instructions, including lb and lbu. Builds on: only what Lecture 01 set up. Next: Lecture 06, Number Representation: Real Numbers.

Closing thread: The 0xFFFFFFFF of a counter that went below zero is -1 in two's complement: the bits did not change, the reading did. Next: fractions on a chip with no floating-point unit.

## Slide 1: Number Representation: Integers

This lecture begins the formal treatment of numerical representation. It opens with a puzzle observed on the machine, a marker that moves left past zero and displays FFFFFFFF, and closes by explaining it completely. Between the two, the student learns to convert between bases, to determine which numbers a given number of bits can represent, and to encode negative numbers. The epigraph from Trilussa, in which the One mocks the Zero, carries a precise mathematical point: in a positional system the zero, worthless on its own, gives every other digit its weight.

## Slide 2: What you will be able to do by the end

Six learning outcomes. The first three are skills exercised on paper: converting between bases 2, 8, 10 and 16, determining which natural numbers fit in n bits, and encoding signed integers in two representations. The fourth concerns arithmetic: addition, subtraction and negation in two's complement, together with the detection of overflow. The last two return to the machine: explaining the FFFFFFFF of the warm-up, and choosing the RISC-V instruction that interprets the same bits as signed or as unsigned.

## Slide 3: Positional systems: base 2, 8, 10 and 16

A positional system of base b uses b digits, from 0 to b - 1, and the value of a numeral is the sum of each digit multiplied by the power of b corresponding to its position, as the formula in the caption states. The table writes thirteen in four bases: 1101 in binary, 15 in octal, 13 in decimal, D in hexadecimal. The number is the same in every case; only its notation changes. Base ten enjoys no privilege for a machine: it is merely the base of a species with ten fingers.

## Slide 4: Bases that are powers of two share the same bits

Bases that are powers of two share the same underlying bits, which makes conversion among them purely a matter of regrouping. The slide writes 127 in binary and groups its bits from the right: groups of four give the hexadecimal digits, 7F; groups of three give the octal digits, 177. No division is required, only a table lookup. Two details must be respected: grouping always starts from the right, the least significant end, and the leftmost group is padded with zeros if incomplete.

## Slide 5: Converting an integer: repeated division

To convert an integer from base ten to base r, one divides by r repeatedly: each remainder is a digit, and the quotient is divided again until it reaches zero. The three tables perform the procedure for 127 with r equal to 8, 16 and 2. The highlighted box addresses the most frequent error: the first remainder is the *least* significant digit, so the remainders must be read from the bottom upwards. The result can always be checked by evaluating it positionally: 177 in octal is 64 + 56 + 7 = 127.

## Slide 6: Converting a fraction: repeated multiplication

For a number between 0 and 1 the procedure is the mirror image: one multiplies by r repeatedly, and at each step the integer part of the product is a digit, starting from the most significant, while the fractional part is multiplied again. 0.875 yields 0.111 and terminates, because the fraction becomes zero. 0.8 never terminates: the same fractions recur and the digits 1100 repeat indefinitely. A number with a finite representation in base ten may thus be periodic in base two, and a finite number of bits must truncate it. This is the origin of the rounding errors studied in Lecture 06.

## Slide 7: Natural numbers on n bits

For natural numbers the representation law is the simplest possible: X is x written in binary. With n bits there are 2^n patterns, so the representable range is 0 to 2^n - 1, from 0 to 15 for four bits as the strip shows. The table gives the sizes that occur on RISC-V: a byte reaches 255, a halfword 65,535, a word 4,294,967,295. The last value is the unsigned reading of FFFFFFFF, and thus half of the answer to the warm-up.

## Slide 8: Overflow

The definition to retain. A register has a finite number of bits and therefore represents a finite subset of an infinite set of numbers. The arithmetic operations are closed over the whole set but not over the subset: the sum of two representable numbers may fall outside it, and when it does an *overflow* has occurred. The example uses seven bits, which cover 0 to 127: 100 and 38 are both representable, while their sum, 138, is not. Overflow is not a malfunction of the machine; it is a necessary consequence of finiteness, and the engineering question is how to detect or avoid it.

## Slide 9: Arithmetic on four bits

Four calculations on four bits, performed column by column exactly as in decimal: 1 plus 1 gives 0 with a carry of 1. Six plus eight fits. Fourteen plus three yields seventeen, which requires a fifth bit: an overflow. Subtraction borrows as in decimal. The product of two n-bit numbers may require 2n bits, which is why RISC-V provides two instructions, `mul` for the low half of the product and `mulhu` for the high half. The four calculations are worth redoing by hand with the results covered.

## Slide 10: Sign and magnitude

The most natural idea is to devote the leftmost bit to the sign and the remaining bits to the magnitude. The representation is easy for people to read but has two defects. Zero has two representations, plus zero and minus zero. And arithmetic becomes awkward: to add two numbers of opposite sign, a circuit must compare the magnitudes, subtract the smaller from the larger, and select the sign of the result. A representation that complicates addition is a poor choice of law in the sense introduced earlier. Sign and magnitude nonetheless survives in the mantissa of floating-point numbers, as Lecture 06 shows.

## Slide 11: Two's complement

Two's complement. Non-negative numbers are represented by themselves; a negative number x is represented by 2^n - |x|, so that on four bits -3 is represented by 16 - 3 = 13, that is 1101. The range is asymmetric, from -2^(n-1) to 2^(n-1) - 1, hence from -8 to +7 on four bits. Zero has a unique representation, and the leftmost bit is 1 exactly when the number is negative. For a 32-bit register the range extends from about minus two billion to plus two billion. This is the representation used by every modern processor, RISC-V included.

## Slide 12: Four bits, three readings

The same sixteen patterns read according to three laws. In the left table, where the leftmost bit is 0, the three readings coincide. In the right table they diverge: 1000 is 8 unsigned, minus zero in sign and magnitude, and -8 in two's complement; 1111 is 15, -7 or -1. The sentence at the bottom is the key to the entire lecture: the bits do not indicate which column is correct. The program indicates it, through the instructions it chooses to apply to them.

## Slide 13: The number wheel

With n bits the numbers form a circle: the last pattern is followed by the first, because arithmetic is performed modulo 2^n. Adding 1 moves one step clockwise. The inner ring shows the unsigned value, the outer discs the two's complement value. The circle is "broken" at two different points. For the unsigned reading the discontinuity lies at the top, between 1111 and 0000, and crossing it is a carry. For two's complement it lies at the bottom, between 0111 and 1000, and crossing it is a signed overflow. One step back from 0000 reaches 1111: this is precisely the FFFFFFFF of the warm-up.

## Slide 14: Two's complement arithmetic

Three calculations exhibit the decisive advantage of two's complement. To add 2 and -6, one simply adds the two patterns: 0010 plus 1010 is 1100, which reads -4. To add two negative numbers, one adds the patterns and discards the carry out of the leftmost position. Even the low four bits of the product are correct. The first line of bullets states the consequence: the adder need not know the signs of its operands. The circuit that adds natural numbers already yields the correct result for signed ones, so a single adder serves both.

## Slide 15: Detecting overflow

There are two distinct notions of overflow, and they are independent. For unsigned numbers, overflow is a carry out of the leftmost bit: 128 plus 130 on eight bits leaves 2 in the register. For signed numbers, overflow is a result of the wrong sign: 127 plus 127 produces no carry out, yet the pattern reads -2. The rule follows: two positive operands yielding a negative sum, or two negative operands yielding a positive sum. Operands of opposite sign can never overflow, because the exact result lies between them and is therefore representable.

## Slide 16: Sign extension: the same number on more bits

How can a number be widened to more bits without changing its value? In two's complement, by copying the sign bit into every new position: -1 on four bits, 1111, becomes 1111 1111 on eight; +5, 0101, becomes 0000 0101. This is *sign extension*. The processor performs it whenever a narrow value meets a wide one: the twelve-bit immediate of `addi` is sign-extended to thirty-two bits, and `lb` sign-extends the byte it loads, whereas `lbu` fills the upper bits with zeros. The choice between the two loads is a statement about what the byte means.

## Slide 17: Check your understanding: Which number does the 8-bit pattern 1111 1100 represent in two's complement? / On 8 bits, which addition produces a signed overflow?

For the first question, the leftmost bit is 1, so the number is negative, and 252, the unsigned reading, is to be discarded. The magnitude is found by negation: complementing gives 0000 0011, and adding one gives 0000 0100, which is 4. The pattern therefore represents -4.

For the second, the eight-bit two's complement range runs from -128 to +127. Each sum is computed and compared with the range. Recalling that operands of opposite sign cannot overflow eliminates two options at once.

## Slide 18: Check your understanding: t0 holds 0xFFFFFFFF and t1 holds 1. After slt t2, t0, t1 and sltu t3, t0, t1: / How is 0.625 written in binary?

For the first question: the same two registers, and two instructions that differ by a single letter. `slt` interprets FFFFFFFF as -1, which is less than 1; `sltu` interprets it as a value above four billion, which is not. The question condenses the entire lecture into one line.

For the second, repeated multiplication is applied: 0.625 times 2 is 1.25, digit 1; 0.25 times 2 is 0.5, digit 0; 0.5 times 2 is 1.0, digit 1. The result is verified with the positional weights: one half plus one eighth is 0.625.

## Slide 19: Glossary: English and Italian

Twelve terms. *Signed integer* is rendered in Italian as *numero relativo* or *intero con segno*. *Carry* and *borrow* denote the digit carried in addition and the digit borrowed in subtraction. *Sign extension* is the operation that widens a signed number while preserving its value. *To clamp* has no single Italian equivalent: it means to constrain a value to an interval.

## Slide 20: Conclusions and reading

Five conclusions. Each base has its purpose: base two for circuits, base sixteen for people who read bits. With n bits exactly 2^n numbers are representable, and the encoding law determines which. Two's complement reduces subtraction to addition, so that one adder serves signed and unsigned arithmetic alike. Overflow is the price of finite registers: it must be detected, or designed away, as the clamp does. And in RISC-V bits carry no type: the instruction decides how they are read. The next lecture completes the picture with the representation of real numbers.
