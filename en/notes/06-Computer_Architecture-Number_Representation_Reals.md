# Lecture 06: Number Representation: Real Numbers

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Number Representation: Real Numbers

The previous lecture dealt with whole numbers. This one deals with numbers that have a fractional part, and it starts from a practical problem: a ball that must move by less than one pixel per frame, on a processor that has no instructions for real numbers. The solution, fixed point, uses only what you already know. Floating point then appears as the general answer, with the standard that every computer follows, IEEE 754.

## Slide 2: What you will be able to do by the end

Six objectives. Two encodings of signed integers that complete the previous lecture, one's complement and excess-k: they are needed to understand floating point. Then fixed point, which you will use in the project. Then floating point: mantissa, exponent, normalisation, encoding and decoding a number in single precision, and the special patterns. Finally a fact about your own kit: its processor has no floating-point instructions, and you will be able to say what programs do instead.

## Slide 3: Warm-up on the machine

The lecture opens on the machine with the problem of the slow ball. Read the code on the next slide and, before running it, try to say why the position is not simply stored in pixels.

## Slide 4: Three-eighths of a pixel, with integers only

One pixel per frame is too fast, and zero is no movement at all: the ball needs 0.375 pixels per frame. The trick is to store the position multiplied by 256. `ball_update` adds 96 at each frame, and 96 divided by 256 is 0.375. `ball_draw` needs whole pixels, so it shifts the value right by 8 positions, that is, divides by 256, with `srai`. All the arithmetic is done with integer instructions. The suffix `_q8` in the names is a reminder that the value carries eight fractional bits.

## Slide 5: More encodings for signed integers

Before fractions, two more ways of writing signed integers. They are relatives of two's complement, and each has one property that makes it useful in a specific place: you will find both inside floating-point numbers.

## Slide 6: One's complement

In one's complement a negative number is obtained by inverting every bit of the positive one: 6 is 0110, minus 6 is 1001. Changing sign is as simple as it can be. The price is the same as for sign and magnitude: zero has two representations, 0000 and 1111, and the range is symmetric, from minus 7 to plus 7 on four bits. The instruction `not` of RISC-V computes exactly the one's complement of a register.

## Slide 7: Arithmetic in one's complement

Addition in one's complement works with the ordinary adder, with one correction: when there is a carry out of the leftmost bit, 1 must be added to the result. It is called the *end-around carry*. The first example needs no correction. In the second and third, the carry out is brought round and added. The extra step and the double zero are the reasons why two's complement, in which the carry is simply discarded, won.

## Slide 8: Excess-k (biased) representation

In excess-k every number is shifted upward by a constant: X = x + k. With four bits and k = 8, the pattern 0000 means minus 8, 1000 means zero and 1111 means plus 7. The valuable property is that order is preserved: a larger number always has a larger pattern, so two signed numbers can be compared as if they were naturals. Arithmetic is less convenient, because every sum must be corrected. This is the encoding of the exponent in floating-point numbers.

## Slide 9: Four bits, five readings

The table of Lecture 05 with two more columns: the same sixteen patterns read as unsigned, sign and magnitude, one's complement, two's complement and excess-8. Three observations. Sign and magnitude and one's complement have two zeros, highlighted. Two's complement and excess-8 cover the same range, minus 8 to plus 7, and differ only in the leftmost bit. And excess-8 is the only column in which the values grow steadily from the top to the bottom of the table.

## Slide 10: Fixed point

Now the fractions. Fixed point is the method of the warm-up, stated in general: it represents numbers with a fractional part using nothing but integer hardware.

## Slide 11: Numbers in fixed point

In fixed point the integer part and the fractional part sit side by side in one word, and the position of the point is fixed. It is not stored anywhere: it is an agreement that the program knows. If f bits are reserved for the fraction, the word contains the number multiplied by 2 to the f, and the smallest step that can be represented, the *resolution*, is 2 to the minus f. The notation Qm.f says how the bits are divided: Q24.8 means 24 integer bits and 8 fractional bits.

## Slide 12: The ball, bit by bit: Q24.8

The ball seen bit by bit. The word 0x00002A60 is divided into 24 bits of integer part, 0x2A, that is 42 pixels, and 8 bits of fraction, 0x60, that is 96/256 = 0.375. As an integer the word is 10848, and 10848 divided by 256 is 42.375. The table gives the rules: addition and subtraction work as for integers, because the points are aligned; to obtain whole pixels, shift right by f; after a multiplication, shift right by f, because the product has twice the fractional bits.

## Slide 13: Rational numbers: the approximation error

The real numbers are dense: between any two there are infinitely many others, so with a finite number of bits most of them cannot be represented, and each is replaced by the nearest representable one. In Q24.8 the number 0.1 becomes 26/256, about 0.1016. The error is at most half the resolution. A number too close to zero becomes zero: this is *underflow*, and it is why a speed of 0.001 pixels per frame would leave the ball still. In fixed point the absolute error is the same everywhere.

## Slide 14: Floating point

Fixed point covers a fixed range with a fixed step. What if a program needs both very large and very small numbers? Floating point gives up constant precision in exchange for an enormous range.

## Slide 15: Real numbers in floating point

A real number is written as a pair: a *mantissa* m and an *exponent* e, such that x is m times the base raised to e. It is the scientific notation of the physics laboratory. The point "floats" because the exponent says where it is. Since the same number has infinitely many such pairs, one is chosen by a rule, *normalisation*: the point is placed just after the first significant digit, so 346.09801 becomes 3.4609801 with exponent 2.

## Slide 16: Example: the range of a small decimal format

A small decimal format, with four digits of mantissa and two of exponent, to see the shape of the representable set. The two bands marked *representable* are the numbers that can be written in this format: from about 10 to the minus 99 up to about 10 to the 99, with either sign. At the two ends there is *overflow*: the magnitude is too large for the exponent. In the middle, around zero, there is a gap, the region of *underflow*: numbers too small in magnitude collapse to zero. Binary floating point has exactly this shape.

## Slide 17: Approximation: absolute and relative error

In floating point the distance between two consecutive representable numbers is not constant. Near zero they are extremely close together; near the upper limit they are far apart. The absolute error therefore grows with the size of the number. What stays constant is the *relative* error, because every number has the same number of significant digits: four in this example. It is the opposite of fixed point, where the absolute error is constant and the relative error becomes large near zero.

## Slide 18: IEEE 754 single precision: 32 bits

The single-precision format of IEEE 754 divides 32 bits into three fields: one bit of sign, eight of exponent, twenty-three of fraction. The value is given by the formula in the middle. Two details deserve attention. A normalised binary mantissa always begins with 1, so that bit is not stored: it is the *hidden bit*, and it gives one more bit of precision for free. And the exponent is stored in excess-127, the encoding of the previous section, so that exponents can be compared as natural numbers.

## Slide 19: Worked example: -5.125 in IEEE 754

A complete example: minus 5.125. Convert the two parts to binary: 5 is 101 and 0.125 is 0.001, so the number is 101.001. Normalise by moving the point two places: 1.01001 times 2 to the 2. The sign bit is 1. The exponent field is 2 plus 127, 129, that is 1000 0001. The fraction is 01001 followed by zeros, without the leading 1. Putting the three fields together and regrouping in fours gives 0xC0A40000. Redo it on paper, then try with another number.

## Slide 20: IEEE 754 at a glance

Single and double precision side by side. Double precision has 64 bits, 11 of exponent in excess-1023 and 52 of fraction. Two rows are worth remembering as orders of magnitude: single precision gives about 7 significant decimal digits and reaches about 10 to the 38; double precision gives about 16 digits and reaches about 10 to the 308. The types `float` and `double` of the C language are these two formats.

## Slide 21: IEEE 754: what the patterns mean

Not all the patterns are ordinary numbers. An exponent field between the two extremes is a normalised number. An exponent of all zeros means zero, if the fraction is zero too, or a *denormalised* number, which fills the gap around zero with decreasing precision. An exponent of all ones means infinity, if the fraction is zero, or NaN, "not a number", the result of an invalid operation such as zero divided by zero. Note that there are two zeros, plus and minus, and that NaN is not equal to anything, itself included.

## Slide 22: Floating point is not the real numbers

Floating-point numbers behave almost like the real numbers, and the "almost" causes real bugs. 0.1 has no finite binary expansion, so it is stored approximately, and 0.1 plus 0.2 is not exactly 0.3, as the code shows. Hence the rule: never test two floating-point results for equality; compare their difference with a tolerance. Addition is not even associative. For money and for positions in a game, scaled integers, that is fixed point, are often the right tool.

## Slide 23: Beyond single and double

The story is not over. Half precision uses sixteen bits, with about three decimal digits. It matters because neural networks hold billions of numbers, and halving each of them halves memory and energy. Many models go further and store their numbers as 8-bit integers with a scale factor: fixed point again, at industrial scale. The last card states the general lesson: bits are a budget, and range, precision and cost pull in different directions.

## Slide 24: Back to the machine

The lecture closes on the machine: how RISC-V handles floating point, and what the letters in the name of your processor mean.

## Slide 25: Floating point on RISC-V, and on your kit

RISC-V handles floating point through two optional extensions, F for single precision and D for double: they add thirty-two registers, `f0` to `f31`, and instructions such as `fadd.s`. The processor of the kit, RV32IMAC, has neither. A C program can still use `float`, but each operation becomes a call to a software routine that costs tens or hundreds of integer instructions. This is why PRG32 games use integers and fixed point: they are fast, exact enough, and visible in the debugger.

## Slide 26: Reading the name RV32IMAC

The name RV32IMAC can now be read letter by letter. RV32I is the base: 32-bit registers and the integer instructions. M adds multiplication and division. A adds the atomic instructions for sharing data safely between tasks. C adds compressed, 16-bit encodings of the most common instructions. F and D, the floating-point extensions, are absent. This modularity is a design choice of RISC-V: a small mandatory base and optional extensions, so that the same architecture fits a cheap microcontroller and a supercomputer.

## Slide 27: Check your understanding: Which signed encoding keeps the bit patterns in the same order as the numbers?

Think of what each encoding does to the order. In sign and magnitude and in the complements, negative numbers have the leftmost bit at 1, so as patterns they come after the positive ones. Only an encoding that adds a constant to every number keeps the order intact.

## Slide 28: Check your understanding: In Q24.8 fixed point, which real number does the word 0x00000180 represent?

Q24.8 means that the word is the number multiplied by 256. Read 0x180 as an integer and divide by 256; or split it directly: integer part 0x01, fraction 0x80, which is 128/256.

## Slide 29: Check your understanding: Which real number is the IEEE 754 single-precision pattern 0x40400000?

Write the first hexadecimal digits in binary and cut the fields: one bit of sign, eight of exponent, then the fraction. Subtract 127 from the exponent, and do not forget the hidden 1 in front of the fraction.

## Slide 30: Check your understanding: In IEEE 754, an exponent field of all ones with a fraction of all zeros means:

Go back to the table of the special patterns. An exponent of all ones is reserved: which of its two cases has a fraction of all zeros?

## Slide 31: Exercises: paper first, then PRG32

Five exercises. On paper: write minus 6 in the four encodings; encode 10.5 and 0.15625 in single precision; decode 0xBF800000. On PRG32: run the ball with three speeds and count after how many frames it moves by one pixel, then give it a vertical speed and make it bounce by changing the sign of the speed with `neg` at the edges. The results are in the green box; work them out before looking.

## Slide 32: Glossary: English and Italian

Twelve terms. In Italian the decimal separator is a comma, so *fixed point* and *floating point* are *virgola fissa* and *virgola mobile*. *Mantissa* is the traditional word for the significant digits; the standard calls the stored part *fraction*. The *hidden bit* is the leading 1 that is not stored. *Denormalised* numbers are also called subnormal.

## Slide 33: Conclusions and reading

Five conclusions. Integers have several representations, chosen according to use. Fixed point stores a fraction as a scaled integer: constant absolute error, the speed of integers. Floating point stores mantissa and exponent: an enormous range, constant relative error. IEEE 754 is the universal standard, with special patterns for zero, infinity and NaN. And on a processor without the F extension, fixed point is the natural choice. Next comes the first part of Verm1, where the last four lectures are put to work.
