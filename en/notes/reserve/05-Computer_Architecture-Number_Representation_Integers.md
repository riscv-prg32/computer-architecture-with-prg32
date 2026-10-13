# Lecture 05: Number Representation: Integers

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Encoding strategies

A representation is a law, X = R(x), that associates a number x with a string of bits X. Keep the two letters apart for the whole lecture: small x is the number we mean, capital X is the pattern stored in the register. Different kinds of numbers call for different laws, and a good law is one that makes addition and comparison easy to build as circuits. This criterion, the simplicity of the circuit, will decide the winner among the representations of signed numbers.

## Subtraction is addition.

The consequence that matters for hardware. To compute y minus x, add to y the two's complement of x. So a subtractor is not needed: an adder and a circuit that complements the bits are enough, and from addition come multiplication and division. This is the engineering reason for the choice of two's complement, and you will see the adder itself in the lectures on logic.
