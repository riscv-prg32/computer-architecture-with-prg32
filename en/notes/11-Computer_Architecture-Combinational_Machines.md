# Lecture 11: Combinational Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: multiplexers; combinational machines; codes; decoders and encoders; comparators and parity; the ALU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: finite-state machines (Lecture 13). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) tell a combinational machine from a sequential one; (2) use decoders, multiplexers, comparators and parity; (3) explain the ALU as parallel units and a multiplexer. Builds on: only what Lecture 01 set up. Next: Lecture 12, Verm1, Part 2: Steering, Food and a Score.

Bridge. In Lecture 02 an instruction was a 32-bit number, and the processor somehow knew what to do with it. Today a decoder reads a field of that number, funct3, and drives the multiplexer that picks the ALU's result. Lecture 19 describes all the fields and the fetch, decode, execute cycle. Recall: Which part of the word of an instruction tells the ALU to add rather than to compute an AND?

Closing thread: The ALU that executed every add so far is one large combinational machine: many results computed at once, one chosen. Next: these circuits at work in the second part of Verm1.

## Slide 1: Combinational Machines

The previous lectures supplied gates and a method for combining them. This one is a catalogue of the standard combinational machines from which designers actually build systems: decoders, encoders, multiplexers, comparators, parity networks, and finally the arithmetic logic unit. For each, the lecture establishes what it computes, how it is constructed, and where it is located inside a RISC-V processor. The young Turing of the epigraph insists that his carrots and peas be kept apart; this lecture is likewise about keeping signals distinct and selecting among them.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Distinguishing a combinational machine from a sequential one. Computing the number of bits a code requires, and recognising incomplete and redundant codes. Designing a decoder and an encoder, and explaining what a transcoder does. Explaining multiplexers and demultiplexers and building them from gates. Building a comparator and a parity network, with a clear understanding of what a parity check can and cannot detect. And locating each of these machines within the processor.

## Slide 3: A taxonomy of digital circuits

Digital circuits fall into two classes. In a *combinational* circuit the outputs at a given instant depend only on the inputs at that same instant: there is neither memory nor feedback, and a truth table describes the circuit completely. In a *sequential* circuit the outputs depend also on the history of the inputs, so the notions of time and state are required. Adders, decoders and multiplexers are combinational; flip-flops, registers and the processor as a whole are sequential, and they are the subject of Lecture 13.

## Slide 4: Real gates take time

A physical gate does not respond instantaneously: its output settles after a *propagation delay*, whose origin Lecture 10 explained. The delay of a network is that of its slowest path from an input to an output, the *critical path*. While signals propagate, the outputs may be transiently incorrect. A combinational machine is therefore correct only once it has settled, and some mechanism must indicate when its outputs may be sampled. That mechanism is the clock, and with it the study of sequential machines begins.

## Slide 5: Codes of fixed length

A *code* associates each element of a set of N elements with a string of symbols, its *code word*. In a fixed-length code every word has the same length m. With an alphabet of k symbols there are k^m words, so m must be at least the logarithm to base k of N, rounded up. In binary, fourteen items require 4 bits, and the 32 registers of RISC-V require exactly 5, which is why each register field of an instruction is five bits wide. When N is not a power of two some words remain unused, and the code is *incomplete*.

## Slide 6: An incomplete code: binary-coded decimal

The classic incomplete code: decimal digits on four bits. In BCD 8421 each digit is simply its value in binary; in excess-3 the value is increased by three. Ten digits require four bits, and four bits give sixteen words, so six are never used: in BCD, the words from 1010 to 1111. The caption draws the design consequence: in a circuit that receives BCD digits, those six words are don't-care conditions, and exploiting them simplifies the circuit.

## Slide 7: Redundant codes

A *redundant* code uses more bits than the minimum, so that only some of the possible words are legal. The arrival of an illegal word reveals that something altered it in transit, and the error is detected. The two codes of the table make the point. In Code 1 every 2-bit word is legal, so an altered bit turns one element into another and the error passes unnoticed. Code 2 adds a third bit that makes the number of 1s even, so any single altered bit produces an illegal word. Redundancy is the price paid for error detection.

## Slide 8: The decoded representation

In the *decoded* representation there are as many bits as elements, and exactly one of them is 1: one line per element, a scheme also called one-hot. It is costly in wires but immediately usable, because the active line can directly enable the corresponding action. The design principle is stated in the last line: information is kept in a compact code inside a word, and decoded only at the point where a choice must be acted upon. The button word of Lecture 08 is an example of the decoded form.

## Slide 9: The decoder

A *decoder* receives an m-bit code word and asserts the single output, among 2^m, that corresponds to it. The table and the circuit show the 2-to-4 decoder: each output is a minterm of the two inputs, built from one AND gate and inverters where required. A decoder thus generates all the minterms of its inputs, and with an OR gate can therefore implement any function of them. An *enable* input, when 0, holds every output at 0; it is the key to composing small decoders into larger ones.

## Slide 10: The encoder

The *encoder* is the inverse machine: it receives N lines, of which one is active, and produces the index of the active line as an m-bit code word. Each output bit is the OR of the input lines whose index has a 1 in that position. If several lines may be active simultaneously, a *priority encoder* is required, which outputs the index of the most important active line. The problem it solves, choosing among simultaneous requests, reappears in Lecture 19, where interrupts are ordered by priority.

## Slide 11: Transcoders: the seven-segment display

A *transcoder* converts a word of one code into the corresponding word of another. The example is the seven-segment display: the input is a BCD digit, and the outputs are the seven lines, a to g, that light the segments. The table gives, for each digit, the segments that are lit: the digit 2 lights a, b, g, e and d. There are seven outputs, hence seven functions of four variables to synthesise, each with six don't-care conditions that the Karnaugh maps of Lecture 09 can exploit.

## Slide 12: The multiplexer

A *multiplexer* has 2^n data inputs, n selection lines and one output: it routes to the output the input designated by the selection lines. The formula shows how: each data input is multiplied by one minterm of the selection lines, and the products are summed. With two inputs, Y = S'I0 + S I1: when S is 0 the first term passes I0, when S is 1 the second passes I1. The drawing realises this formula directly in gates. It is the machine that the warm-up implemented in software.

## Slide 13: The demultiplexer

The *demultiplexer* is the inverse: one data input, n selection lines and 2^n outputs. The input is routed to the output designated by the selection lines, while the other outputs remain at 0. With the data input held at 1, a demultiplexer is precisely a decoder. A multiplexer at one end of a wire and a demultiplexer at the other allow many signals to share that wire, one at a time: the principle underlying every shared line, including the buses of Lecture 14.

## Slide 14: The comparator

A *comparator* receives two words and produces a single bit, 1 when they are equal. Two bits are equal when their XNOR is 1; two words are equal when all corresponding pairs of bits are equal, so the comparator is an AND of XNORs. The drawing shows the two-bit case. In the processor the comparator decides the branches `beq` and `bne`: the two registers are compared, and the branch is taken or not according to the result.

## Slide 15: Parity

The simplest redundant code appends a *parity bit* to each word, chosen so that the total number of 1s is, for instance, even. The circuit that computes it is a *parity network*, a tree of XOR gates: the XOR of all the bits of a word is 1 when the number of 1s is odd, because XOR is addition modulo 2. The same network is used twice: by the sender, to compute the bit to append, and by the receiver, to verify the parity of what has arrived.

## Slide 16: The ALU is a set of machines and a multiplexer

The ALU receives two words, A and B. Within it several units operate simultaneously on the same operands: an adder that also subtracts, a row of AND gates, a row of OR gates, a row of XOR gates, a shifter. Each produces a result, and a multiplexer passes one of them to the output, its selection lines driven by a decoder that reads the instruction. There is no memory anywhere: the ALU is one large combinational machine, and its slowest path, the carry chain of the adder, bounds the clock frequency of the processor. The catalogue of the lecture thus converges on the heart of the datapath.

## Slide 17: Check your understanding: How many bits does a fixed-length binary code need for the 26 letters of the alphabet? / A decoder has 3 input lines and no enable. How many outputs does it have, and how many are 1 at any time?

For the first question the fixed-length formula applies: the smallest m such that 2^m is at least 26. Four bits give sixteen words, which do not suffice; the result also leaves some words unused, making the code incomplete.

For the second, a decoder with m inputs has 2^m outputs, and its output is in decoded representation: exactly one line is active at any time.

## Slide 18: Check your understanding: A multiplexer with 8 data inputs needs how many selection lines? / A word with one even-parity bit is received with two bits altered. The parity check:

For the first question the relation is the inverse of the preceding one: n selection lines choose among 2^n inputs, and eight is 2^3.

For the second, one counts the 1s. A parity check knows only whether their number is even or odd. Altering one bit changes the parity; altering two bits changes it twice, restoring it. The check therefore detects every single-bit error and no double-bit error.

## Slide 19: Glossary: English and Italian

Twelve terms. *Enable* is the input that activates or deactivates a block. A *code word* is each string of a code. *Multiplexer* and *demultiplexer* retain their names in Italian. A *transcoder* converts between two codes. The *parity bit* is the redundant bit appended for the check.

## Slide 20: Conclusions and reading

Five conclusions. A code writes each element of a set as a string of symbols, its code word. A fixed-length binary code requires the ceiling of log2 N bits, and a redundant code spends additional bits to detect errors. Encoding, decoding and transcoding are performed by combinational machines. Multiplexers select a source, demultiplexers a destination, while comparators and parity networks verify. The processor employs every one of them. What these machines lack is memory: after Part 2 of Verm1, Lecture 13 supplies it.
