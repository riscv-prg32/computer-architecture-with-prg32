# Lecture 11: Combinational Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Combinational Machines

The previous lectures gave you gates and a method to combine them. This one is a catalogue of the machines that designers actually use: decoders, encoders, multiplexers, comparators, parity networks, and finally the arithmetic logic unit. For each you learn what it does, how it is built, and where it sits inside a RISC-V processor. The young Turing of the quotation wants his carrots and peas kept apart: this lecture is about keeping things separate, and choosing among them.

## Slide 2: What you will be able to do by the end

Six objectives. Tell a combinational machine from a sequential one. Compute how many bits a code needs and recognise incomplete and redundant codes. Design a decoder and an encoder, and compose small decoders into larger ones. Explain multiplexers and demultiplexers and build them from gates. Build a comparator and a parity network, knowing what a parity check can and cannot detect. And point to each of these machines inside the processor.

## Slide 3: Warm-up on the machine

The warm-up is a piece of assembly that chooses one colour out of four. While you read it, ask yourself whether the result depends on anything that happened before.

## Slide 4: Choose one of four colours

`a0` holds a number from 0 to 3. The four instructions are the array access of Lecture 04: load the address of the table, multiply the selector by 4, add, and load the selected word. The same selector always gives the same colour, and nothing is remembered from one use to the next. This behaviour, outputs that depend only on the present inputs, defines the machines of today. In hardware this particular one is a *multiplexer*: four data inputs, two selection bits, one output.

## Slide 5: Combinational machines

First the definition and the method: what a combinational machine is, how one is designed, and a warning about time.

## Slide 6: A taxonomy of digital circuits

Digital circuits are of two kinds. In a *combinational* circuit the outputs at a given instant depend only on the inputs at that same instant: there is no memory and no feedback, and a truth table describes the circuit completely. In a *sequential* circuit the outputs depend also on the past history of the inputs: it needs the notions of time and of state. Adders, decoders and multiplexers are combinational; flip-flops, registers and the processor as a whole are sequential, and are the subject of Lecture 13.

## Slide 7: Designing a combinational machine

The design of a combinational machine in four steps: a specification in words; a truth table, with the don't-cares; a minimisation, one output at a time; and a network of gates or of standard blocks. It is the method of Lecture 09. Above four or five inputs nobody draws maps any more: designers assemble ready-made blocks, which is why this lecture is a catalogue of them. Analysis goes the other way, from the schematic to the table.

## Slide 8: Real gates take time

A real gate does not answer instantly: its output settles after a *propagation delay*, as Lecture 10 explained. The delay of a network is that of its slowest path from an input to an output, the *critical path*. While signals are travelling the outputs may be temporarily wrong. So a combinational machine is correct only after it has settled, and something must say when to look at its outputs. That something is the clock, and it is where sequential machines begin.

## Slide 9: Codes

Many of the machines of this lecture treat codes: they translate, select and check them. So before the machines we need to say precisely what information is and what a code is.

## Slide 10: The concept of information

Six words to talk about information. The *attribute* is the meaning: the mark of an exam. The *type* is the set of possible values: the marks from 18 to 30, and 30 with honours. The *value* is the element actually taken: 30. The *cardinality* is the number of elements of the type, here 14. Then two distinctions: the same value can be written in many ways, which is the problem of encoding; and types can be simple or structured. Note that "30 with honours" is not a number: it is a fourteenth element.

## Slide 11: Alphabets and strings

An *alphabet* is a finite, non-empty set of symbols: the binary one has two, the decimal one ten. A *string*, or word, is a finite sequence of symbols of an alphabet, and its length is the number of its symbols. The string of length zero is the empty string. The set of all the strings over an alphabet S is written S with an asterisk. An infinite sequence is not a string. These definitions are the basis of the theory of codes, and later of formal languages.

## Slide 12: Codes of fixed length

A *code* associates each element of a set of N elements with a string of symbols, the *code word*. In a fixed-length code all the words have the same length m. With an alphabet of k symbols there are k to the m words, so m must be at least the logarithm of N, rounded up. In binary: fourteen marks need 4 bits, and the 32 registers of RISC-V need exactly 5. When N is not a power of two some words remain unused, and the code is *incomplete*.

## Slide 13: An incomplete code: binary-coded decimal

The classic incomplete code: decimal digits on four bits. In BCD 8421 each digit is simply its value in binary; in excess-3 the value is increased by three. Ten digits need four bits, and four bits give sixteen words, so six of them are never used: in BCD, the words from 1010 to 1111. Remember the caption: when you design a circuit that receives BCD digits, those six words are don't-cares and make the circuit simpler.

## Slide 14: Redundant codes

A *redundant* code uses more bits than the minimum, so only some of the possible words are legal. If a word arrives that is not legal, something altered it on the way, and the error is detected. Compare the two codes of the table. In Code 1 every 2-bit word is legal: an altered bit turns one element into another and nobody notices. Code 2 adds a third bit that makes the number of 1s even: any single altered bit produces an illegal word. Redundancy is the price paid for detecting errors.

## Slide 15: Codes of variable length

In a *variable-length* code frequent elements get short words and rare ones long words, which saves space and time. The reader must still know where each word ends, and this is ensured by the *prefix property*: no word is the beginning of another. You have already met two such codes: UTF-8, with one to four bytes per character, and the instructions of the kit, which are 16 or 32 bits long. The two lowest bits of an instruction say which: 11 means 32 bits.

## Slide 16: Decoders and encoders

The first family of machines translates between a compact code and a set of separate lines, one for each element.

## Slide 17: The decoded representation

In the *decoded* representation there are as many bits as elements, and exactly one of them is 1: one line per element. It is also called one-hot. It is expensive in wires but immediately usable, because the active line can directly switch something on. The practical rule is in the last line: keep information in a compact code inside a word, and decode it where a choice has to be acted upon.

## Slide 18: The decoder

A *decoder* receives a code word of m bits and asserts the one output, out of 2 to the m, that corresponds to it. The table and the circuit show the 2-to-4 decoder: each output is a minterm of the two inputs, built with one AND gate and, where needed, inverters. So a decoder generates all the minterms of its inputs. An *enable* input, when it is 0, keeps all the outputs at 0: it will be the key to composing decoders.

## Slide 19: Composing decoders: from 2-to-4 to 4-to-16

Large decoders are built from small ones. To select one line out of sixteen from four bits, a first 2-to-4 decoder looks at the two high bits and enables one of four other decoders; all four receive the two low bits, and only the enabled one asserts one of its lines. Five small decoders do the work. This is modular composition, and it is the general strategy of digital design: solve a large problem with copies of the solution of a small one.

## Slide 20: In the processor: which register is written?

A decoder at work in the processor. The instruction `addi t1, t1, 1` contains a 5-bit field, `rd`, with the number of the destination register: 00110, that is 6, the register `t1`. A 5-to-32 decoder turns those five bits into thirty-two write-enable lines, of which only the sixth is active: only that register receives the result. The same instruction contains two more register numbers, which select the registers to be read.

## Slide 21: The encoder

The *encoder* is the inverse machine: it receives N lines, of which one is active, and produces its number as a code word of m bits. Each output bit is the OR of the input lines whose number has a 1 in that position. If more than one line can be active at the same time a *priority encoder* is needed, which outputs the number of the most important active line. You will meet it again with interrupts, when several devices ask for attention at once.

## Slide 22: Transcoders: the seven-segment display

A *transcoder* converts a word of one code into the corresponding word of another code. The example is the display with seven segments: the input is a BCD digit, the outputs are the seven lines that light the segments, named from a to g. The table gives, for each digit, which segments are lit: the digit 2 lights a, b, g, e and d. There are seven outputs, so seven functions of four variables to synthesise, each with six don't-cares.

## Slide 23: Synthesising segment a

The synthesis of segment a with the method of Lecture 09. The segment is off only for the digits 1 and 4. The six unused BCD words are marked x. Using the x cells as 1s, four large groups cover the map: the two lower rows give A, the two right columns give C, the central square gives BD, and the four corners give B'D'. The result is a = A + C + BD + B'D'. Without the don't-cares the groups would be smaller and the expression longer. Try segment g yourself.

## Slide 24: Multiplexers and demultiplexers

The second family selects: a multiplexer chooses one source among many, a demultiplexer one destination among many.

## Slide 25: The multiplexer

A *multiplexer* has 2 to the n data inputs, n selection lines and one output: it transfers to the output the input chosen by the selection lines. The formula shows how: each data input is multiplied by one minterm of the selection lines, and the products are added. With two inputs, Y = S'I0 + S I1: when S is 0 the first term passes I0, when S is 1 the second passes I1. The drawing is exactly this formula in gates. It is the machine of the warm-up.

## Slide 26: The demultiplexer

The *demultiplexer* is the inverse: one data input, n selection lines and 2 to the n outputs. The input is routed to the output chosen by the selection lines, and the other outputs stay at 0. With the data input fixed at 1 it is exactly a decoder. A multiplexer at one end of a wire and a demultiplexer at the other let many signals share that wire, one at a time: the idea behind every shared line, including the buses of Lecture 14.

## Slide 27: In the processor: register or constant?

A multiplexer at work in the processor. `add t2, t0, t1` adds two registers; `addi t2, t0, 5` adds a register and a constant taken from the instruction. Both use the same adder. A multiplexer in front of the second input of the ALU chooses between the value of a register and the constant: its selection line is 0 for `add` and 1 for `addi`. It is a multiplexer on whole words: thirty-two one-bit multiplexers with a common selection line. Reading a register is a multiplexer too.

## Slide 28: Comparing and checking

The third family checks: are two words equal? Has a word arrived as it was sent?

## Slide 29: The comparator

A *comparator* receives two words and produces one bit, 1 when they are equal. Two bits are equal when their XNOR is 1; two words are equal when all their pairs of bits are equal, so the comparator is an AND of XNORs. The drawing shows it for words of two bits. In the processor it decides the branches `beq` and `bne`: the two registers are compared, and the branch is taken or not according to the result.

## Slide 30: Parity

The simplest redundant code adds one *parity bit* to each word, chosen so that the total number of 1s is, for example, even. The circuit that computes it is a *parity network*, a chain of XORs: the XOR of all the bits of a word is 1 when the number of 1s is odd, because XOR is addition modulo 2. The network is used twice: by the sender, to compute the bit to add, and by the receiver, to verify the parity of what arrived.

## Slide 31: Transmission with a parity check

The whole scheme of a transmission with a parity check. The source produces a word; a first parity network computes the parity bit and appends it; the word travels on a channel where it may be altered; a second network verifies the parity and raises an error signal if it is wrong. The caption states the limits precisely: a single parity bit detects any odd number of altered bits, cannot say which bit is wrong, and misses an even number of errors.

## Slide 32: A parity network in seven instructions

A parity network in software, for one byte. Each pair of instructions shifts the value right and combines it with itself by XOR: the first fold brings eight bits onto four, the second four onto two, the third two onto one. The last instruction keeps only the lowest bit, which is the parity. In hardware the same three levels are a tree of seven XOR gates. Trace it by hand with 0x53, which has four 1s, and with 0x13, which has three.

## Slide 33: The arithmetic logic unit

The last machine contains all the others. The arithmetic logic unit is the part of the processor that computes, and it is built entirely from the blocks of this lecture.

## Slide 34: The ALU is a set of machines and a multiplexer

The ALU receives two words, A and B. Inside it several units work at the same time on the same operands: an adder that also subtracts, a row of AND gates, a row of OR gates, a row of XOR gates, a shifter. All of them produce a result. A multiplexer lets one of the results through, and its selection lines come from a decoder that reads the instruction. There is no memory anywhere: the ALU is one large combinational machine, and its slowest path, the carry chain of the adder, limits the clock of the processor.

## Slide 35: RISC-V instructions and the ALU

How an instruction chooses the operation. The 3-bit field `funct3` of the instruction is a compact code: 000 for sum or difference, 001 for shift left, 100 for XOR, 110 for OR, 111 for AND. A small decoder turns it into the selection lines of the multiplexer of the ALU. Where two instructions share a value, such as `add` and `sub`, one more bit elsewhere in the instruction distinguishes them. A code, a decoder, a multiplexer: the whole lecture in one table.

## Slide 36: Check your understanding: How many bits does a fixed-length binary code need for the 26 letters of the alphabet?

Use the formula of the fixed-length code: the smallest m such that 2 to the m is at least 26. Four bits give sixteen words, which are not enough. And note that the result leaves some words unused.

## Slide 37: Check your understanding: A decoder has 3 input lines and no enable. How many outputs does it have, and how many are 1 at any time?

A decoder with m inputs has 2 to the m outputs, and its output is a decoded representation: exactly one line active at any time.

## Slide 38: Check your understanding: A multiplexer with 8 data inputs needs how many selection lines?

The relation is the inverse of the previous one: n selection lines choose among 2 to the n inputs. Eight is 2 to the third power.

## Slide 39: Check your understanding: A word with one even-parity bit is received with two bits altered. The parity check:

Count the 1s. A parity check only knows whether their number is even or odd. Altering one bit changes that; altering two bits changes it twice, and brings it back to where it was.

## Slide 40: Exercises: paper first, then PRG32

Five exercises. Synthesise segment g with a map, using the don't-cares. Build a 3-to-8 decoder from two 2-to-4 decoders with enable and one inverter. Implement a function with one multiplexer by putting its truth table on the data inputs, and recognise the function. Write a comparator in assembly with only `xor` and `sltiu`. And draw a seven-segment digit on PRG32: a table of ten bytes, one per digit, and seven rectangles lit by testing its bits: a transcoder in software.

## Slide 41: Glossary: English and Italian

Twelve terms. *Enable* is the input that switches a block on or off. *Code word* is each string of a code. Multiplexer and demultiplexer keep their names in Italian. A *transcoder* converts between two codes. The *parity bit* is the redundant bit added for the check.

## Slide 42: Conclusions and reading

Five conclusions. Information is an attribute, a type and a value, and a code writes the value as a string. A fixed-length binary code needs the logarithm of N bits, rounded up; a redundant code spends more to detect errors. Encoding, decoding and transcoding are done by combinational machines. Multiplexers select a source, demultiplexers a destination, comparators and parity networks check. And the processor uses all of them. What these machines lack is memory: after Part 2 of Verm1, Lecture 13 adds it.
