# Lecture 04: Representing Digital Information

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: analog and digital; bit, byte, word; hexadecimal; positional notation; a colour is a number; characters and strings; little-endian byte order; data structures; arrays in memory; algorithms. USE NOW: shifts as multiplications (Lecture 05) and, used without being studied in this course, the complete program, the PRG32 tools. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) distinguish analog from digital information and count the values that n bits can represent; (2) encode numbers, colours and text as bits: positional notation, hexadecimal, RGB565, ASCII; (3) name the basic data structures and the properties of an algorithm. Builds on: only what Lecture 01 set up. Next: Lecture 05, Number Representation: Integers.

Bridge. In Lecture 02 the instruction addi t1, t1, 1 appeared in memory as the word 0x00130313. Today the same 32 bits can be read as a number, a colour, four letters or an instruction: the code decides. Lecture 19 reads the instruction field by field. Recall: Name two different things one 32-bit word can mean, and what decides which meaning applies.

Closing thread: Bits mean nothing by themselves: a code gives them a meaning, and the same 32 bits can be a number, a colour, four letters or an instruction. Next: the codes for integers, and what happens when they run out of bits.

## Slide 1: Representing Digital Information

In Lecture 02 the student wrote 0x07e0, 255, `.asciz` and `.word` without knowing precisely what they denoted. This lecture names them. Its thesis is stated in the subtitle: everything inside the machine is a pattern of bits, whether a number, a colour, a letter or a list, and the meaning of a pattern is fixed by convention, not by the bits themselves. The lecture favours breadth over depth: the representation of numbers is treated formally in the next two lectures, while here the aim is to learn to read bits and to recognise that interpretation is an agreement.

## Slide 2: What you will be able to do by the end

Six learning outcomes, moving from the general to the particular and back. The student will distinguish analog from digital information, read a byte in binary and in hexadecimal, decode a PRG32 colour into its three fields, explain how text is stored, and describe how an array is laid out in memory and how assembly accesses one of its elements. The final outcome looks beyond the machine: what an algorithm is, when it is deterministic, and where machine learning belongs among algorithms.

## Slide 3: Analog and digital information

An *analog* quantity varies continuously, as a voltage or the hands of a watch do. A *digital* quantity is a sequence of symbols drawn from a finite alphabet, as the digits of a display are. In the figure the smooth curve is the analog signal and the staircase is its digital counterpart, obtained by *sampling* at regular instants and *quantising* each sample to one of a finite number of levels. Something is lost in the process, and something essential is gained: a finite set of levels can be counted, copied without error and checked. With only two levels, the symbol is the bit, and Lecture 10 will show why two levels are preferred.

## Slide 4: Bit, byte, word

The units of information, each tied to an object already encountered. A *bit* is one button. A *nibble*, four bits, is one hexadecimal digit. A *byte*, eight bits, is one ASCII character, and it is the reason why the bar of Lecture 02 never exceeded 255 pixels. A *halfword*, sixteen bits, is one PRG32 colour. A *word*, thirty-two bits, is one register and one instruction. The governing rule is that n bits yield 2^n distinct patterns. The caption adds the principle of the lecture: what a pattern means is not written in the bits.

## Slide 5: Counting in base 2 and base 16

Sixteen rows to be learned by heart, as multiplication tables once were. Each row gives the same number in decimal, in four-bit binary and as a single hexadecimal digit. The four binary positions weigh 8, 4, 2 and 1, so 1011 is 8 + 2 + 1 = 11, which hexadecimal writes as B; after 9, the hexadecimal digits continue with the letters A to F for the values ten to fifteen. Fluency matters more than understanding here, since the understanding is simple: covering two columns and reconstructing them from the third, until no thought is required, is the recommended exercise.

## Slide 6: Positional notation: what 11011001 means

In a positional system each digit contributes its value multiplied by the weight of its position, and the weights are successive powers of the base. The slide reads the byte 11011001 in this way: the positions weigh 128, 64, 32, 16, 8, 4, 2 and 1, and the weight is added wherever the bit is 1. The sum is 128 + 64 + 16 + 8 + 1 = 217. This is precisely the procedure applied unconsciously in base ten, where 217 denotes two hundreds, one ten and seven units. Lecture 05 states the general formula and the conversion algorithms.

## Slide 7: Why programmers write hexadecimal

Since sixteen is two to the fourth power, each hexadecimal digit corresponds to exactly four bits. Conversion therefore requires no arithmetic: the binary number is divided into groups of four bits from the right, and each group replaced by its digit from the table, so that 0000 0111 1110 0000 becomes 0, 7, E, 0. This is why programmers write hexadecimal: it is binary in compact form, with a register occupying eight hexadecimal digits instead of thirty-two bits. The prefix `0x` marks a number as hexadecimal.

## Slide 8: A colour is a number: RGB565

Here the green of Lecture 02 is opened up. A PRG32 colour is a sixteen-bit quantity divided into three fields: five bits of red, six of green, five of blue, a format known as RGB565. In 0x07E0 the red field is 00000, the green field 111111 and the blue field 00000: maximum green and nothing else. The extra bit given to green reflects the greater sensitivity of human vision to that component. The eight swatches show other combinations: yellow is red plus green, white is every field at its maximum. The sentence at the bottom restates the lesson of the lecture: the same sixteen bits could mean something else entirely.

## Slide 9: ASCII: one character, one byte

ASCII assigns a number to each character and fits it within one byte. Three observations follow from the table. The capital A is 65 and the small a is 97: they differ by 32, that is, by a single bit, which makes case conversion a bitwise operation. The character "0" is 48, not zero: a digit typed on a keyboard is a code, not yet a number, a distinction that Lecture 22 exploits when it converts a score into text. And some characters do not print: the newline, 10, and NUL, 0, which the next slide uses as the terminator of a string.

## Slide 10: Strings: a sequence of characters in memory

A string is a sequence of character codes stored in consecutive bytes, and the design question is how its end is marked. The C convention places a zero byte at the end; the Pascal convention stores the length first. The third row is the string of Lecture 02: `.asciz` stores the eleven characters of HELLO PRG32 followed by a zero, twelve bytes in total. The text-drawing function receives only the address of the first byte and reads until it meets the zero. Were the terminator missing, it would continue into whatever happens to follow in memory, an error with a long history in computer security.

## Slide 11: Unicode and UTF-8: every writing system

ASCII defines 128 characters, sufficient for English alone. Unicode assigns a number, the *code point*, to every character of every writing system. UTF-8 encodes that number in one to four bytes: ASCII characters retain their single byte, an accented letter takes two, the euro sign three, an emoji four. Two consequences follow. Pure ASCII text is already valid UTF-8, which explains the encoding's universal adoption. And the length of a string in bytes no longer equals its length in characters.

## Slide 12: Byte order: little-endian

A word occupies four bytes and memory assigns one address to each byte, so the order in which the bytes are stored must be specified. RISC-V is *little-endian*: the least significant byte occupies the lowest address, so 0x12345678 is stored as 78, 56, 34, 12. The opposite convention, *big-endian*, is used by network protocols. In ordinary use the order is invisible, because `lw` and `sw` are mutually consistent; it becomes visible when memory is inspected byte by byte in a debugger, or when data are exchanged with a machine of different convention. Lecture 15 returns to the question and turns it into an experiment.

## Slide 13: Five ways to organise data

Five ways to organise data. An *array* stores elements of the same type contiguously and reaches them by index. A *list* links each element to the next: cheap to modify, slow to access by position. A *stack* returns first the element inserted last, and was already used in Lecture 02 to save `ra`. A *dictionary* associates keys with values. A *tree* organises elements hierarchically. The sixth card states the point most relevant to this course: within the machine, every one of these structures is a set of bytes in memory together with a rule for locating the next element.

## Slide 14: Algorithms and computability

A problem is *computable* if some algorithm solves it. The Turing machine is the mathematical model of a programmed computer; the von Neumann machine is the architecture that realises it in hardware. The final line is the striking one: there exist problems that no algorithm can solve, and hence that no computer will ever solve, however fast. The classic example is the halting problem, deciding for an arbitrary program whether it will terminate, which Turing proved undecidable in 1936.

## Slide 15: Deterministic and non-deterministic algorithms

A *deterministic* algorithm, given the same input, always performs the same sequence of steps and produces the same result: `first_update` always adds one. A *non-deterministic* algorithm may behave differently on different runs with the same input. Two causes are common. The algorithm may use random numbers deliberately, as a game that places an enemy at random does; or its behaviour may depend on the relative timing of concurrent events. The first kind is a design choice of great utility, as probabilistic primality tests show; the second is a frequent source of errors that are difficult to reproduce.

## Slide 16: Machine learning

A classical program is a function written by a person: y = f(x). In *machine learning* the function is not written but constructed automatically from examples. Contemporary generative models apply this idea at enormous scale, with billions of learned parameters. Two remarks connect the topic to this course. Those parameters are bits in memory, multiplied and added by processors of the kind studied here. And a model may be wrong with great confidence: only someone who understands the fundamentals is in a position to verify what it asserts.

## Slide 17: Check your understanding: How many different values can one byte represent? / The PRG32 colour 0xF81F is:

The first question applies the rule that n bits give 2^n patterns, to a byte of eight bits. Two near-misses deserve attention: 8 is the number of bits, and 255 is the largest natural number a byte can hold, not the number of values, since zero must also be counted.

For the second, the four hexadecimal digits are written in binary, F as 1111, 8 as 1000, 1 as 0001, F as 1111, and the sixteen bits are divided as 5, 6 and 5: red 11111, green 000000, blue 11111. Red and blue are at maximum and green is absent.

## Slide 18: Check your understanding: How many bytes does .asciz "CIAO" occupy in memory? / On RISC-V, .word 0x0000ABCD is stored at address A. Which byte is at address A?

For the first question the characters are counted and the meaning of the z in `.asciz` recalled: the directive stores the string zero-terminated, adding one byte to the visible characters.

For the second, RISC-V is little-endian. The word is written as four bytes, 00 00 AB CD, from most to least significant, and the question is which of them occupies the lowest address. The distractor is 0x00, which would be correct on a big-endian machine.

## Slide 19: Glossary: English and Italian

Twelve terms. *Word* is *parola* in Italian, and on RV32 denotes thirty-two bits. *Sampling* and *quantisation* are the two operations of digitisation. *Byte order*, or *endianness*, is the order in which the bytes of a word are stored. The Italian *pila* translates *stack*, while *array* is often left untranslated or rendered as *vettore*.

## Slide 20: Conclusions and reading

Five propositions summarise the lecture. Digital information is a pattern of bits together with a convention for reading it. The same bits may be a number, a colour or two characters, and the program decides which. Hexadecimal is binary in compact form, four bits per digit. Text consists of numbers, and data structures of bytes plus a rule. Algorithms transform data into information on which decisions can be based. The next lecture treats the representation of numbers formally, beginning with a marker that walks off the left edge of the screen.
