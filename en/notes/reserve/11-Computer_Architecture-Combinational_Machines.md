# Lecture 11: Combinational Machines

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Designing a combinational machine

The design of a combinational machine in four steps: a specification in words; a truth table, with the don't-cares; a minimisation, one output at a time; and a network of gates or of standard blocks. It is the method of Lecture 09. Above four or five inputs nobody draws maps any more: designers assemble ready-made blocks, which is why this lecture is a catalogue of them. Analysis goes the other way, from the schematic to the table.

## The concept of information

Six words to talk about information. The *attribute* is the meaning: the mark of an exam. The *type* is the set of possible values: the marks from 18 to 30, and 30 with honours. The *value* is the element actually taken: 30. The *cardinality* is the number of elements of the type, here 14. Then two distinctions: the same value can be written in many ways, which is the problem of encoding; and types can be simple or structured. Note that "30 with honours" is not a number: it is a fourteenth element.

## Alphabets and strings

An *alphabet* is a finite, non-empty set of symbols: the binary one has two, the decimal one ten. A *string*, or word, is a finite sequence of symbols of an alphabet, and its length is the number of its symbols. The string of length zero is the empty string. The set of all the strings over an alphabet S is written S with an asterisk. An infinite sequence is not a string. These definitions are the basis of the theory of codes, and later of formal languages.

## Codes of variable length

In a *variable-length* code frequent elements get short words and rare ones long words, which saves space and time. The reader must still know where each word ends, and this is ensured by the *prefix property*: no word is the beginning of another. You have already met two such codes: UTF-8, with one to four bytes per character, and the instructions of the kit, which are 16 or 32 bits long. The two lowest bits of an instruction say which: 11 means 32 bits.

## Composing decoders: from 2-to-4 to 4-to-16

Large decoders are built from small ones. To select one line out of sixteen from four bits, a first 2-to-4 decoder looks at the two high bits and enables one of four other decoders; all four receive the two low bits, and only the enabled one asserts one of its lines. Five small decoders do the work. This is modular composition, and it is the general strategy of digital design: solve a large problem with copies of the solution of a small one.

## Synthesising segment a

The synthesis of segment a with the method of Lecture 09. The segment is off only for the digits 1 and 4. The six unused BCD words are marked x. Using the x cells as 1s, four large groups cover the map: the two lower rows give A, the two right columns give C, the central square gives BD, and the four corners give B'D'. The result is a = A + C + BD + B'D'. Without the don't-cares the groups would be smaller and the expression longer. Try segment g yourself.

## Transmission with a parity check

The whole scheme of a transmission with a parity check. The source produces a word; a first parity network computes the parity bit and appends it; the word travels on a channel where it may be altered; a second network verifies the parity and raises an error signal if it is wrong. The caption states the limits precisely: a single parity bit detects any odd number of altered bits, cannot say which bit is wrong, and misses an even number of errors.
