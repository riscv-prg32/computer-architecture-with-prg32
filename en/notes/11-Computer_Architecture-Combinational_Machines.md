# Lecture 11: Combinational Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Combinational Machines

The previous lectures gave you gates and a method to combine them. This one is a catalogue of the machines that designers actually use: decoders, encoders, multiplexers, comparators, parity networks, and finally the arithmetic logic unit. For each you learn what it does, how it is built, and where it sits inside a RISC-V processor. The young Turing of the quotation wants his carrots and peas kept apart: this lecture is about keeping things separate, and choosing among them.

## Slide 2: What you will be able to do by the end

Six objectives. Tell a combinational machine from a sequential one. Compute how many bits a code needs and recognise incomplete and redundant codes. Design a decoder and an encoder, and say what a transcoder does. Explain multiplexers and demultiplexers and build them from gates. Build a comparator and a parity network, knowing what a parity check can and cannot detect. And point to each of these machines inside the processor.

## Slide 3: A taxonomy of digital circuits

Digital circuits are of two kinds. In a *combinational* circuit the outputs at a given instant depend only on the inputs at that same instant: there is no memory and no feedback, and a truth table describes the circuit completely. In a *sequential* circuit the outputs depend also on the past history of the inputs: it needs the notions of time and of state. Adders, decoders and multiplexers are combinational; flip-flops, registers and the processor as a whole are sequential, and are the subject of Lecture 13.

## Slide 4: Real gates take time

A real gate does not answer instantly: its output settles after a *propagation delay*, as Lecture 10 explained. The delay of a network is that of its slowest path from an input to an output, the *critical path*. While signals are travelling the outputs may be temporarily wrong. So a combinational machine is correct only after it has settled, and something must say when to look at its outputs. That something is the clock, and it is where sequential machines begin.

## Slide 5: Codes of fixed length

A *code* associates each element of a set of N elements with a string of symbols, the *code word*. In a fixed-length code all the words have the same length m. With an alphabet of k symbols there are k to the m words, so m must be at least the logarithm of N, rounded up. In binary: fourteen marks need 4 bits, and the 32 registers of RISC-V need exactly 5. When N is not a power of two some words remain unused, and the code is *incomplete*.

## Slide 6: An incomplete code: binary-coded decimal

The classic incomplete code: decimal digits on four bits. In BCD 8421 each digit is simply its value in binary; in excess-3 the value is increased by three. Ten digits need four bits, and four bits give sixteen words, so six of them are never used: in BCD, the words from 1010 to 1111. Remember the caption: when you design a circuit that receives BCD digits, those six words are don't-cares and make the circuit simpler.

## Slide 7: Redundant codes

A *redundant* code uses more bits than the minimum, so only some of the possible words are legal. If a word arrives that is not legal, something altered it on the way, and the error is detected. Compare the two codes of the table. In Code 1 every 2-bit word is legal: an altered bit turns one element into another and nobody notices. Code 2 adds a third bit that makes the number of 1s even: any single altered bit produces an illegal word. Redundancy is the price paid for detecting errors.

## Slide 8: The decoded representation

In the *decoded* representation there are as many bits as elements, and exactly one of them is 1: one line per element. It is also called one-hot. It is expensive in wires but immediately usable, because the active line can directly switch something on. The practical rule is in the last line: keep information in a compact code inside a word, and decode it where a choice has to be acted upon.

## Slide 9: The decoder

A *decoder* receives a code word of m bits and asserts the one output, out of 2 to the m, that corresponds to it. The table and the circuit show the 2-to-4 decoder: each output is a minterm of the two inputs, built with one AND gate and, where needed, inverters. So a decoder generates all the minterms of its inputs. An *enable* input, when it is 0, keeps all the outputs at 0: it will be the key to composing decoders.

## Slide 10: The encoder

The *encoder* is the inverse machine: it receives N lines, of which one is active, and produces its number as a code word of m bits. Each output bit is the OR of the input lines whose number has a 1 in that position. If more than one line can be active at the same time a *priority encoder* is needed, which outputs the number of the most important active line. You will meet it again with interrupts, when several devices ask for attention at once.

## Slide 11: Transcoders: the seven-segment display

A *transcoder* converts a word of one code into the corresponding word of another code. The example is the display with seven segments: the input is a BCD digit, the outputs are the seven lines that light the segments, named from a to g. The table gives, for each digit, which segments are lit: the digit 2 lights a, b, g, e and d. There are seven outputs, so seven functions of four variables to synthesise, each with six don't-cares.

## Slide 12: The multiplexer

A *multiplexer* has 2 to the n data inputs, n selection lines and one output: it transfers to the output the input chosen by the selection lines. The formula shows how: each data input is multiplied by one minterm of the selection lines, and the products are added. With two inputs, Y = S'I0 + S I1: when S is 0 the first term passes I0, when S is 1 the second passes I1. The drawing is exactly this formula in gates. It is the machine of the warm-up.

## Slide 13: The demultiplexer

The *demultiplexer* is the inverse: one data input, n selection lines and 2 to the n outputs. The input is routed to the output chosen by the selection lines, and the other outputs stay at 0. With the data input fixed at 1 it is exactly a decoder. A multiplexer at one end of a wire and a demultiplexer at the other let many signals share that wire, one at a time: the idea behind every shared line, including the buses of Lecture 14.

## Slide 14: The comparator

A *comparator* receives two words and produces one bit, 1 when they are equal. Two bits are equal when their XNOR is 1; two words are equal when all their pairs of bits are equal, so the comparator is an AND of XNORs. The drawing shows it for words of two bits. In the processor it decides the branches `beq` and `bne`: the two registers are compared, and the branch is taken or not according to the result.

## Slide 15: Parity

The simplest redundant code adds one *parity bit* to each word, chosen so that the total number of 1s is, for example, even. The circuit that computes it is a *parity network*, a chain of XORs: the XOR of all the bits of a word is 1 when the number of 1s is odd, because XOR is addition modulo 2. The network is used twice: by the sender, to compute the bit to add, and by the receiver, to verify the parity of what arrived.

## Slide 16: The ALU is a set of machines and a multiplexer

The ALU receives two words, A and B. Inside it several units work at the same time on the same operands: an adder that also subtracts, a row of AND gates, a row of OR gates, a row of XOR gates, a shifter. All of them produce a result. A multiplexer lets one of the results through, and its selection lines come from a decoder that reads the instruction. There is no memory anywhere: the ALU is one large combinational machine, and its slowest path, the carry chain of the adder, limits the clock of the processor.

## Slide 17: Check your understanding: How many bits does a fixed-length binary code need for the 26 letters of the alphabet? / A decoder has 3 input lines and no enable. How many outputs does it have, and how many are 1 at any time?

Use the formula of the fixed-length code: the smallest m such that 2 to the m is at least 26. Four bits give sixteen words, which are not enough. And note that the result leaves some words unused.

A decoder with m inputs has 2 to the m outputs, and its output is a decoded representation: exactly one line active at any time.

## Slide 18: Check your understanding: A multiplexer with 8 data inputs needs how many selection lines? / A word with one even-parity bit is received with two bits altered. The parity check:

The relation is the inverse of the previous one: n selection lines choose among 2 to the n inputs. Eight is 2 to the third power.

Count the 1s. A parity check only knows whether their number is even or odd. Altering one bit changes that; altering two bits changes it twice, and brings it back to where it was.

## Slide 19: Glossary: English and Italian

Twelve terms. *Enable* is the input that switches a block on or off. *Code word* is each string of a code. Multiplexer and demultiplexer keep their names in Italian. A *transcoder* converts between two codes. The *parity bit* is the redundant bit added for the check.

## Slide 20: Conclusions and reading

Five conclusions. A code writes each element of a set as a string of symbols over an alphabet, its code word. A fixed-length binary code needs the logarithm of N bits, rounded up; a redundant code spends more to detect errors. Encoding, decoding and transcoding are done by combinational machines. Multiplexers select a source, demultiplexers a destination, comparators and parity networks check. And the processor uses all of them. What these machines lack is memory: after Part 2 of Verm1, Lecture 13 adds it.
