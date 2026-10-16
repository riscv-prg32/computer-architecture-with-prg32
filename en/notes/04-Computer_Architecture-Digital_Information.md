# Lecture 04: Representing Digital Information

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: analog and digital; bit, byte, word; hexadecimal; positional notation; a colour is a number; characters and strings; little-endian byte order; data structures; arrays in memory; algorithms. USE NOW: shifts as multiplications (Lecture 05) and, used without being studied in this course, the complete program, the PRG32 tools. UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Representing Digital Information

In Lecture 02 you typed 0x07e0, 255, `.asciz` and `.word` without knowing exactly what they were. This lecture gives them names. Its thesis is in the subtitle: everything inside the machine is a pattern of bits, whether it is a number, a colour, a letter or a list. The lecture is wide rather than deep: numbers are treated formally in the next two lectures; here you learn to read bits and to see that their meaning is a matter of agreement.

## Slide 2: What you will be able to do by the end

Six objectives, from the general to the particular and back. You will tell analog from digital, read a byte in binary and in hexadecimal, decode a PRG32 colour into its three fields, say how text is stored, and describe how an array lives in memory and how assembly reaches one of its elements. The last objective looks beyond the machine: what an algorithm is, when it is deterministic, and where machine learning fits.

## Slide 3: Analog and digital information

An *analog* quantity varies continuously, like a voltage or the hands of a watch. A *digital* quantity is a sequence of symbols from a finite alphabet, like the digits of a display. In the figure the smooth curve is the analog signal; the staircase is its digital version, obtained by *sampling* at regular instants and *quantising* each sample to one of a few levels. Something is lost, and something is gained: a finite number of levels can be counted, copied without error and checked. With two levels only, the symbol is the bit.

## Slide 4: Bit, byte, word

The units of information, each tied to something you have used. A *bit* is one button. A *nibble*, four bits, is one hexadecimal digit. A *byte*, eight bits, is one ASCII character, and it is the reason why the bar of Lecture 02 was at most 255 wide. A *halfword*, sixteen bits, is one colour. A *word*, thirty-two bits, is one register and one instruction. The rule to remember: n bits give 2 to the n patterns. And the caption: what a pattern means is not written in the bits.

## Slide 5: Counting in base 2 and base 16

Sixteen rows to learn by heart, as you once learned the multiplication tables. Each row gives the same number in decimal, in binary with four bits, and in hexadecimal with one digit. The four binary columns weigh 8, 4, 2 and 1: 1011 is 8 + 2 + 1 = 11, which hexadecimal writes B. After 9 the hexadecimal digits continue with the letters A to F for the values ten to fifteen. Cover two columns and reconstruct them from the third until you no longer need to think.

## Slide 6: Positional notation: what 11011001 means

In a positional system a digit is worth its value times the weight of its position, and the weights are the powers of the base. The slide reads the byte 11011001 this way: the positions weigh 128, 64, 32, 16, 8, 4, 2 and 1; where the bit is 1 the weight is added, where it is 0 it is not. The sum is 128 + 64 + 16 + 8 + 1 = 217. It is exactly what you do in base ten without noticing: 217 is 2 hundreds, 1 ten and 7 units.

## Slide 7: Why programmers write hexadecimal

Sixteen is two to the fourth power, so one hexadecimal digit corresponds to exactly four bits. To convert, cut the binary number into groups of four from the right and replace each group using the table: 0000 0111 1110 0000 becomes 0, 7, E, 0. No arithmetic is needed. This is why programmers use hexadecimal: it is binary written compactly. A register is eight hexadecimal digits instead of thirty-two bits. The prefix `0x` announces that a number is hexadecimal.

## Slide 8: A colour is a number: RGB565

Here the green of Lecture 02 is opened. A PRG32 colour is sixteen bits divided into three fields: five bits of red, six of green, five of blue. The format is called RGB565. In 0x07E0 the red field is 00000, the green field is 111111 and the blue field is 00000: maximum green and nothing else. The eight swatches show other combinations: yellow is red plus green, white is everything. The sentence at the bottom is the lesson of the whole lecture: the same sixteen bits could be something else entirely.

## Slide 9: ASCII: one character, one byte

ASCII assigns a number to each character and fits it in one byte. Three observations from the table. The capital A is 65 and the small a is 97: they differ by 32, that is by a single bit. The character "0" is 48, not zero: a digit typed on a keyboard is not yet a number. And there are characters that do not print: the newline, 10, and NUL, 0, which you will meet on the next slide as the end of a string.

## Slide 10: Strings: a sequence of characters in memory

A string is a sequence of character codes in consecutive bytes. The problem is how to know where it ends. The C convention marks the end with a zero byte; the Pascal convention writes the length first. The third row is your string of Lecture 02: `.asciz` stores the eleven characters of HELLO PRG32 followed by a zero, twelve bytes in all. The function that draws text receives only the address of the first byte and reads until it finds the zero. If the zero were missing, it would continue with whatever follows in memory.

## Slide 11: Unicode and UTF-8: every writing system

ASCII has 128 characters, enough for English only. Unicode assigns a number, called a *code point*, to every character of every writing system. UTF-8 stores that number in one to four bytes: the characters of ASCII keep their single byte, an accented letter takes two, the euro sign three, an emoji four. Two consequences. Plain ASCII text is already valid UTF-8. And the length of a string in bytes is no longer its length in characters.

## Slide 12: Byte order: little-endian

A word is four bytes, and memory has one address per byte: in which order are the four bytes stored? RISC-V is *little-endian*: the least significant byte goes at the lowest address, so 0x12345678 is stored as 78, 56, 34, 12. The opposite order, *big-endian*, is used by network protocols. Normally you do not notice, because `lw` and `sw` are consistent with each other. You notice when you look at memory byte by byte in a debugger, or exchange data with a different machine.

## Slide 13: Five ways to organise data

Five structures. An *array* keeps elements of the same type one after another and reaches them by index. A *list* links each element to the next: easy to modify, slow to reach by position. A *stack* returns first what was put in last; you used one in Lecture 02 to save `ra`. A *dictionary* associates keys with values. A *tree* is a hierarchy. The sixth card is the one that matters for this course: in the machine all of them are bytes in memory, plus a rule for finding the next element.

## Slide 14: Algorithms and computability

A problem is *computable* if an algorithm can solve it. The Turing machine is the mathematical model of a computer with a program; the von Neumann machine is the architecture that realises it in hardware. The last line is the surprising one: there are problems that no algorithm can solve, and therefore that no computer will ever solve, however fast. The classic example is deciding, for any program, whether it will stop.

## Slide 15: Deterministic and non-deterministic algorithms

In a *deterministic* algorithm the same input always produces the same sequence of steps and the same result: `first_update` always adds one. A *non-deterministic* algorithm can behave differently at each run with the same input. There are two common reasons: it uses random numbers on purpose, like a game that places an enemy at random, or it depends on the timing of several things that happen together. The first kind is useful; the second is a frequent source of bugs.

## Slide 16: Machine learning

A classical program is a function written by a person: y = f(x). In *machine learning* the function is not written: it is built automatically from examples. Today's generative models are this idea at an enormous scale, with billions of learned numbers. Two remarks connect it to this course. Those numbers are bits in memory, multiplied and added by processors. And a model can be wrong with great confidence: only someone who knows the fundamentals can check what it says.

## Slide 17: Check your understanding: How many different values can one byte represent? / The PRG32 colour 0xF81F is:

Apply the rule that n bits give 2 to the n patterns. A byte has eight bits. Be careful with the two near-misses: 8 is the number of bits, and 255 is the largest natural number that a byte can hold, not the number of values, because zero counts too.

Write the four hexadecimal digits in binary: F is 1111, 8 is 1000, 1 is 0001, F is 1111. Then cut the sixteen bits as 5, 6 and 5: red 11111, green 000000, blue 11111. Red and blue at maximum, no green.

## Slide 18: Check your understanding: How many bytes does .asciz "CIAO" occupy in memory? / On RISC-V, .word 0x0000ABCD is stored at address A. Which byte is at address A?

Count the characters and remember what the z of `.asciz` adds. The directive stores the string *zero-terminated*: one more byte than the visible characters.

RISC-V is little-endian. Write the word as four bytes, 00 00 AB CD, from the most to the least significant, and ask which one goes at the lowest address. The trap is 0x00, which would be right on a big-endian machine.

## Slide 19: Glossary: English and Italian

Twelve terms. *Word* is *parola* in Italian, and on RV32 it means thirty-two bits. *Sampling* and *quantisation* are the two operations of digitising. *Byte order*, or *endianness*, is the order of the bytes of a word in memory. Note that the Italian *pila* is the *stack*, while *array* is often left untranslated or rendered as *vettore*.

## Slide 20: Conclusions and reading

Five sentences to keep. Digital information is a pattern of bits plus a convention for reading it. The same bits can be a number, a colour or two characters: the program decides. Hexadecimal is binary written compactly, four bits per digit. Text is numbers, and structures are bytes plus a rule. Algorithms turn data into information on which decisions can be based. The next lecture treats the representation of numbers formally, starting from a marker that walks off the left edge of the screen.
