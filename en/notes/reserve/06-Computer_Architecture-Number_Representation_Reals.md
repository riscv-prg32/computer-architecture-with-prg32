# Lecture 06: Number Representation: Real Numbers

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Example: the range of a small decimal format

A small decimal format, with four digits of mantissa and two of exponent, to see the shape of the representable set. The two bands marked *representable* are the numbers that can be written in this format: from about 10 to the minus 99 up to about 10 to the 99, with either sign. At the two ends there is *overflow*: the magnitude is too large for the exponent. In the middle, around zero, there is a gap, the region of *underflow*: numbers too small in magnitude collapse to zero. Binary floating point has exactly this shape.

## Beyond single and double

The story is not over. Half precision uses sixteen bits, with about three decimal digits. It matters because neural networks hold billions of numbers, and halving each of them halves memory and energy. Many models go further and store their numbers as 8-bit integers with a scale factor: fixed point again, at industrial scale. The last card states the general lesson: bits are a budget, and range, precision and cost pull in different directions.
