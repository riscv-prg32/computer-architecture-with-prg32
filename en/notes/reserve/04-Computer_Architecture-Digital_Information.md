# Lecture 04: Representing Digital Information

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Numbers: naturals, integers, reals

A preview of the next two lectures. Natural numbers are the positional pattern itself: with n bits, from 0 to 2 to the n minus 1. Signed integers use *two's complement*, the subject of Lecture 05. Real numbers use fixed point or the floating point of the IEEE 754 standard, the subject of Lecture 06, in which the bits are divided into a sign, an exponent and a fraction. You are not asked to understand the formats today: only to see that numbers, too, need a convention.

## Data, big data and data science

*Big data* are data that exceed what traditional database tools can handle, in quantity or in variety: structured tables and unstructured text, positions, time series. The orders of magnitude are petabytes and zettabytes. Extracting knowledge and value from them requires parallel computing, and the discipline that does it is *data science*. Keep the link with the previous slides: however large, these data are still bytes with a convention.

## Where the data come from

Four sources of data: sensors, which measure the physical world; transactions, which record every purchase; public data, opened by institutions; and social media, where people leave preferences and opinions. Each source poses its own problems of quality and of privacy. Before data can be analysed they must be acquired, cleaned, stored and integrated: in practice this preparation takes most of the work.

## GPGPU: general-purpose computing on graphics processors

A graphics processor, or GPU, has thousands of simple cores designed to apply the same operation to many data at once. The figure shows a parallel sum: the numbers are added in pairs, then the partial sums in pairs, and so on, so that N numbers need about log2 N steps instead of N. The hardware born for video games is the one that trains neural networks today. Under every core there are still registers, instructions and bits; Lecture 24 returns to GPUs.

## Data mining

*Data mining* is the set of techniques for extracting information and knowledge from large quantities of data. The slide names three families: decision trees, which classify by a sequence of questions; rule learning and Bayesian methods, which reason with probabilities; and neural networks, which recognise patterns. They are subjects of later courses. Here it is enough to know that they exist and that they are algorithms like any other.

## Deterministic and non-deterministic algorithms

In a *deterministic* algorithm the same input always produces the same sequence of steps and the same result: `first_update` always adds one. A *non-deterministic* algorithm can behave differently at each run with the same input. There are two common reasons: it uses random numbers on purpose, like a game that places an enemy at random, or it depends on the timing of several things that happen together. The first kind is useful; the second is a frequent source of bugs.

## Machine learning

A classical program is a function written by a person: y = f(x). In *machine learning* the function is not written: it is built automatically from examples. Today's generative models are this idea at an enormous scale, with billions of learned numbers. Two remarks connect it to this course. Those numbers are bits in memory, multiplied and added by processors. And a model can be wrong with great confidence: only someone who knows the fundamentals can check what it says.
