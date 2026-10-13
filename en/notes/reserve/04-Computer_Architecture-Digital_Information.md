# Lecture 04: Representing Digital Information

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Fundamental concepts: the flow of data

Every computation has the same shape. Data enter from the world; a program, which is an algorithm made concrete, transforms them; results leave; and somebody uses them, which is what turns information into knowledge. On PRG32 you already know the four boxes by name: the buttons are read by `prg32_input_read`, your `update` function processes, your `draw` function produces the output, and the player reacts. Keep this picture: every program you will ever write is an instance of it.

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

## Five properties of an algorithm

Five properties make a procedure an algorithm. Its steps are *atomic*: they cannot be broken down further. They are *unambiguous*: the executor can interpret each in one way only. The algorithm is *finite* in steps and in data, it *terminates* in a finite time, and it is *effective*: it leads to one well-defined result. A RISC-V instruction is a good model of an atomic, unambiguous step: its meaning is fixed by the specification, bit by bit.
