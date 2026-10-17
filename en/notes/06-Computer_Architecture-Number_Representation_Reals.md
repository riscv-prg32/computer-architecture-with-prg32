# Lecture 06: Number Representation: Real Numbers

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: fixed point; one's complement and excess-k; IEEE 754 floating point; the name RV32IMAC. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) represent a real number in fixed point and compute with it using integer instructions; (2) decode an IEEE 754 single-precision number; (3) read the name RV32IMAC and say what the kit can and cannot compute in hardware. Builds on: only what Lecture 01 set up. Next: Lecture 07, Verm1, Part 1: A Head That Crosses the World.

Closing thread: Without an F extension, fractions are integers with an agreed scale: Verm1 will move its head by fractions of a cell exactly this way. Next: the first part of the project.

## Slide 1: Number Representation: Real Numbers

The previous lecture treated integers; this one treats numbers with a fractional part. It begins from a concrete engineering problem: a ball must move by less than one pixel per frame, on a processor with no instructions for real numbers. The first solution, fixed point, uses nothing beyond integer arithmetic already understood. Floating point then emerges as the general solution, together with the standard to which essentially every computer conforms, IEEE 754. The lecture is thus organised as a progression from a specific constraint to a general theory, and back to the constraint.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Two further encodings of signed integers, one's complement and excess-k, complete the previous lecture and are prerequisites for floating point. Fixed-point representation follows, which the course project will use. Then floating point: mantissa, exponent and normalisation, encoding and decoding in single precision, and the special patterns. The final outcome concerns the student's own kit: its processor has no floating-point instructions, and the student should be able to explain what programs do instead, and why.

## Slide 3: One's complement

In one's complement a negative number is obtained by inverting every bit of its positive counterpart: 6 is 0110, -6 is 1001. Negation could not be simpler. The cost is that already paid by sign and magnitude: zero has two representations, 0000 and 1111, and the range is symmetric, from -7 to +7 on four bits. The RISC-V instruction `not` computes precisely the one's complement of a register, and the previous lecture showed that adding 1 to it yields the two's complement.

## Slide 4: Arithmetic in one's complement

Addition in one's complement uses an ordinary binary adder with one correction: when a carry leaves the most significant position, 1 must be added to the result, an operation known as the *end-around carry*. The first example requires no correction; in the second and third the outgoing carry is brought round and added. This extra step, together with the double zero, explains why two's complement, in which the outgoing carry is simply discarded, prevailed in the design of arithmetic units.

## Slide 5: Excess-k (biased) representation

In excess-k representation every number is displaced upwards by a constant: X = x + k. With four bits and k = 8, the pattern 0000 denotes -8, 1000 denotes zero and 1111 denotes +7. Its valuable property is order preservation: a larger number always has a larger pattern, so two signed values can be compared as though they were natural numbers. Arithmetic is less convenient, since every sum must be corrected by subtracting k. This is precisely the encoding of the exponent in floating-point formats, where fast comparison matters more than convenient addition.

## Slide 6: Four bits, five readings

The table of Lecture 05, extended by two columns: the same sixteen patterns read as unsigned, sign and magnitude, one's complement, two's complement and excess-8. Three observations. Sign and magnitude and one's complement each have two zeros, highlighted. Two's complement and excess-8 cover the same range, -8 to +7, and differ only in the leftmost bit. And excess-8 is the only column in which values increase monotonically from the top of the table to the bottom, which is the order-preservation property in visual form.

## Slide 7: Numbers in fixed point

In fixed point the integer and fractional parts occupy adjacent positions within one word, and the position of the binary point is fixed. It is stored nowhere: it is a convention known to the program. If f bits are reserved for the fraction, the word contains the number multiplied by 2^f, and the smallest representable increment, the *resolution*, is 2^-f. The notation Qm.f specifies the division of the bits: Q24.8 denotes 24 integer bits and 8 fractional bits. Arithmetic is ordinary integer arithmetic, with rescaling only where a product or quotient requires it.

## Slide 8: Rational numbers: the approximation error

The real numbers are dense: between any two there are infinitely many others, so with a finite number of bits most of them cannot be represented, and each is replaced by its nearest representable neighbour. In Q24.8 the number 0.1 becomes 26/256, approximately 0.1016. The error never exceeds half the resolution. A value sufficiently close to zero rounds to zero, which is *underflow*, and which is why a speed of 0.001 pixels per frame would leave the ball motionless. In fixed point the absolute error bound is the same across the whole range.

## Slide 9: Real numbers in floating point

A real number is represented as a pair: a *mantissa* m and an *exponent* e, such that x equals m multiplied by the base raised to e. This is the scientific notation of the physics laboratory, and the point "floats" because the exponent determines its position. Since the same number admits infinitely many such pairs, a canonical one is selected by *normalisation*: the point is placed immediately after the first significant digit, so 346.09801 becomes 3.4609801 with exponent 2. Normalisation guarantees uniqueness and maximises the number of significant digits retained.

## Slide 10: Approximation: absolute and relative error

In floating point the spacing between consecutive representable numbers is not uniform: it is very fine near zero and coarse near the upper limit of the range. The absolute error therefore grows with the magnitude of the number. What remains approximately constant is the *relative* error, because every number carries the same number of significant digits, four in this example. Fixed point exhibits the opposite behaviour: constant absolute error, with relative error that becomes large near zero. The choice between the two is a choice of which error matters for the application.

## Slide 11: IEEE 754 single precision: 32 bits

The IEEE 754 single-precision format divides 32 bits into three fields: one sign bit, eight exponent bits and twenty-three fraction bits, with the value given by the formula in the centre. Two design decisions deserve attention. A normalised binary mantissa always begins with 1, so that bit need not be stored: it is the *hidden bit*, which yields one additional bit of precision at no cost. And the exponent is stored in excess-127, the encoding of the previous section, so that floating-point numbers of the same sign can be compared as natural numbers.

## Slide 12: Worked example: -5.125 in IEEE 754

A complete worked example: -5.125. The integer and fractional parts are converted separately: 5 is 101 and 0.125 is 0.001, so the number is 101.001. Normalisation moves the point two places: 1.01001 times 2^2. The sign bit is 1. The exponent field is 2 + 127 = 129, that is, 1000 0001. The fraction field is 01001 followed by zeros, without the leading 1. Concatenating the three fields and regrouping by four bits gives 0xC0A40000. The example should be reproduced on paper and then repeated with a number of one's own choosing.

## Slide 13: IEEE 754 at a glance

Single and double precision compared. Double precision uses 64 bits, with 11 exponent bits in excess-1023 and 52 fraction bits. Two rows are worth retaining as orders of magnitude: single precision provides about 7 significant decimal digits and a range reaching about 10^38; double precision about 16 digits and a range reaching about 10^308. The C types `float` and `double` correspond to these two formats on essentially every modern platform.

## Slide 14: IEEE 754: what the patterns mean

Not every pattern encodes an ordinary number. An exponent field strictly between its extremes denotes a normalised number. An exponent of all zeros denotes zero, if the fraction is also zero, or a *denormalised* number, which fills the gap around zero with gradually decreasing precision. An exponent of all ones denotes infinity, if the fraction is zero, or NaN, "not a number", the result of an invalid operation such as zero divided by zero. Two consequences are counter-intuitive and worth noting: there are two zeros, positive and negative, and NaN compares unequal to everything, itself included.

## Slide 15: Floating point on RISC-V, and on your kit

RISC-V supports floating point through two optional extensions, F for single precision and D for double, which add thirty-two registers, `f0` to `f31`, and instructions such as `fadd.s`. The processor of the kit, RV32IMAC, implements neither. A C program may still use `float`, but each operation is then compiled into a call to a software routine costing tens or hundreds of integer instructions. This is why PRG32 games use integers and fixed point: they are fast, sufficiently precise for the purpose, and transparent in the debugger.

## Slide 16: Reading the name RV32IMAC

The name RV32IMAC can now be read letter by letter. RV32I is the base: 32-bit registers and the integer instructions. M adds multiplication and division. A adds atomic instructions, for safe sharing of data among concurrent tasks. C adds compressed, 16-bit encodings of the most frequent instructions. F and D, the floating-point extensions, are absent. This modularity is a central design principle of RISC-V: a small mandatory base and optional extensions, so that the same architecture can serve an inexpensive microcontroller and a supercomputer.

## Slide 17: Check your understanding: Which signed encoding keeps the bit patterns in the same order as the numbers? / In Q24.8 fixed point, which real number does the word 0x00000180 represent?

For the first question, one should consider what each encoding does to ordering. In sign and magnitude and in both complements, negative numbers have a leftmost 1 and therefore, read as patterns, follow the positive ones. Only an encoding that adds a constant to every number preserves the order.

For the second, Q24.8 means that the word contains the number multiplied by 256. 0x180 is read as an integer and divided by 256; alternatively it is split directly into integer part 0x01 and fraction 0x80, that is, 128/256.

## Slide 18: Check your understanding: Which real number is the IEEE 754 single-precision pattern 0x40400000? / In IEEE 754, an exponent field of all ones with a fraction of all zeros means:

For the first question, the leading hexadecimal digits are written in binary and the fields separated: one sign bit, eight exponent bits, then the fraction. The bias of 127 is subtracted from the exponent, and the hidden 1 restored in front of the fraction.

For the second, the table of special patterns should be consulted. An exponent of all ones is reserved; the question is which of its two cases has a fraction of all zeros.

## Slide 19: Glossary: English and Italian

Twelve terms. In Italian the decimal separator is the comma, so *fixed point* and *floating point* become *virgola fissa* and *virgola mobile*. *Mantissa* is the traditional term for the significant digits; the standard calls the stored part the *fraction*. The *hidden bit* is the leading 1 that is not stored. *Denormalised* numbers are also termed subnormal.

## Slide 20: Conclusions and reading

Five conclusions. Integers admit several representations, chosen according to use. Fixed point stores a fraction as a scaled integer, with constant absolute error and the speed of integer arithmetic. Floating point stores mantissa and exponent, with an enormous range and approximately constant relative error. IEEE 754 is the universal standard, with special patterns for zero, infinity and NaN. On a processor lacking the F extension, fixed point is the natural choice. The next lecture is the first part of Verm1, in which the content of the last four lectures is put to work.
