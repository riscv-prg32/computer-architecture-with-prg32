# Lecture 08: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Elements of Boolean Algebra

The second block of the course begins: logic. After learning what bits mean, you learn how they are combined. You have in fact been using Boolean algebra since the first days, every time you tested a button with `andi`; this lecture gives that operation a name and builds the algebra around it. The White Rabbit on the cover is always in a hurry: the processor too does everything by tiny logical steps, billions of them per second.

## Slide 2: What you will be able to do by the end

Five objectives. Describe a computer as three subsystems connected by a bus. Distinguish the two problems of logic design, analysis and synthesis. Write the truth tables and recognise the symbols of six gates. Apply the properties of the algebra, including De Morgan's laws, to simplify an expression. And, back on the machine, use the bitwise instructions of RISC-V to test, set, clear and toggle single bits of a register.

## Slide 3: Warm-up on the machine

The warm-up is code that you already know. Read it again with a new question in mind: what exactly does `andi` do to the thirty-two bits of a register?

## Slide 4: Is LEFT pressed?

`prg32_input_read` returns all the buttons at once in `a0`, one bit per button. `andi t3, t0, 0x01` keeps bit 0 and forces every other bit to zero; the result is different from zero exactly when LEFT is pressed, and `beqz` skips the movement otherwise. The same pattern, with 0x02, tests RIGHT. The constant used with `andi` is called a *mask*. The last callout asks the question of the lecture: `andi` is thirty-two AND gates working side by side, so what is an AND?

## Slide 5: One bit per button

The value returned by the buttons is a word in which each bit has a meaning: bit 0 is LEFT, bit 1 RIGHT, bit 2 UP, bit 3 DOWN, bits 4 and 5 are A and B, bit 6 is START. If you hold RIGHT and A together you get 0x12, that is 0001 0010. In the picture each lamp is one bit of this word. Every question you can ask about the joystick, such as "is LEFT pressed but not RIGHT?", is a Boolean expression over these seven variables.

## Slide 6: The computer as a logic machine

Before the algebra, a look at the machine from one level below the instructions: which parts it is made of, what the processor does, and what kind of circuits everything is built from.

## Slide 7: The electronic computer: three subsystems and a bus

A computer has three subsystems: the processor, which executes instructions; the main memory, which holds instructions and data; and input/output, which connects the machine to the world. They are joined by a *bus*, a set of shared wires divided into address lines, data lines and control lines. It is the von Neumann model of Lecture 03 in today's terms. Everything that travels on the bus is a pattern of bits. On the ESP32-C6 all of this is inside one chip.

## Slide 8: The processor

The processor is where the processing capability resides. It executes instructions, which are explicit commands of two kinds: those that govern the transfer of information, inside the computer and to and from the devices, and those that specify arithmetic and logic operations. The memory holds the data and the sequence of instructions, and a sequence of instructions stored in memory is a *program*. The processor does one thing for ever: it fetches an instruction, executes it, and repeats.

## Slide 9: What kind of system is an electronic computer?

Four adjectives define an electronic computer. *Numeric*, or digital: all the information is strings of bits. *Automatic*: once started it proceeds by itself. *Stored-program*: the program is in memory and can be replaced, so the same machine does different jobs. *Electronic*: it is built from circuits that store and process bits. Each adjective excludes something: an abacus is numeric but not automatic; a mechanical music box is automatic but its program is fixed.

## Slide 10: Logic circuits

The circuits that store and process bits are called switching circuits, or *logic circuits*; connected together they form a switching network, and designing one is logic design. To describe what such circuits do we use an algebra. It plays for circuits the role that ordinary algebra plays for quantities: a notation in which you can calculate instead of trying every case. The values are two, 0 and 1: two voltage levels, two states of a switch.

## Slide 11: Two problems, one algebra

Two problems, and one algebra for both. *Analysis*: you are given the structure of a circuit, how it is made, and you must find its behaviour, what it does. Reading `andi t3, t0, 1` and saying what ends up in `t3` is analysis. *Synthesis* goes the other way: from a desired behaviour to a structure that realises it, for example from the table of a sum to an adder. Synthesis usually has many solutions; choosing the cheapest is the subject of the next lecture.

## Slide 12: Boolean algebra

Now the algebra itself: its variables, its three basic operations, three more gates that are used everywhere, and the properties that allow you to transform expressions.

## Slide 13: Boolean algebra

In Boolean algebra a variable can take only two values, 0 and 1, and there are three basic operations. AND, the logical product, written with a dot or by simply putting the variables side by side. OR, the logical sum, written with a plus sign. NOT, the complement, written here with a prime, as in x', so that it can be typed. Do not be misled by the symbols: the plus is not an arithmetic sum, as you will see at once in the truth table of OR.

## Slide 14: The three fundamental operations

Each panel shows an operation in three ways: the symbol of the gate, the notation and the *truth table*, which lists the output for every combination of the inputs. AND gives 1 only when both inputs are 1. OR gives 0 only when both inputs are 0, so 1 OR 1 is 1, not 2. NOT has one input and inverts it. Learn the three shapes: a flat back and a round front for AND, a curved back and a pointed front for OR, a triangle with a small circle for NOT.

## Slide 15: Three more gates you will meet everywhere

Three more gates. XOR, the exclusive or, gives 1 when the two inputs are different: it is the sum bit of a one-bit addition. NAND and NOR are AND and OR followed by a negation: the small circle on the output of a symbol always means NOT. NAND gives 0 only when both inputs are 1; NOR gives 1 only when both are 0. They matter in practice because they are the gates that are cheapest to build with transistors, as Lecture 10 will show.

## Slide 16: Properties of Boolean algebra (1)

The first four properties, each in two forms, one for AND and one for OR. Commutative and associative are as in ordinary algebra; thanks to the second, AND and OR extend to any number of operands. *Idempotence* is new: x AND x is x, and x OR x is x; repeating a variable adds nothing. *Absorption* is the most useful for simplifying: x OR (x AND y) is simply x, because when x is 1 the result is 1 whatever y is, and when x is 0 both terms are 0.

## Slide 17: Properties of Boolean algebra (2)

Five more properties. The first distributive law is the familiar one. The second, x + yz = (x + y)(x + z), has no equivalent in ordinary algebra: here OR distributes over AND too. Then the constants: 1 is the identity for AND and 0 for OR; 0 annuls an AND and 1 saturates an OR. The complement laws say that a variable and its negation give 0 with AND and 1 with OR. Involution: negating twice returns the variable. Two of these, identity and null element, explain how a mask works.

## Slide 18: De Morgan's laws

De Morgan's laws connect the three operations: the complement of a product is the sum of the complements, and the complement of a sum is the product of the complements. The table proves the first by *perfect induction*: since the variables have only two values, a law can be verified by checking every row. The two highlighted columns are identical. In terms of gates: a NAND is an OR with negated inputs. You will use these laws constantly, on paper and in programs.

## Slide 19: Duality and precedence

Two general rules. *Duality*: every identity remains true if you swap AND with OR and 0 with 1; this is why the properties came in pairs, and it halves the work of proving them. *Precedence*: NOT is applied first, then AND, then OR, as powers come before products and products before sums; parentheses change the order. And a definition to remember: two expressions are equivalent when they have the same truth table.

## Slide 20: Simplifying with the algebra

The algebra at work. The expression xy + xy' needs two AND gates, an OR and an inverter. Collecting x with the distributive law gives x(y + y'); the complement law turns the parenthesis into 1; the identity law leaves x. Three gates have become a piece of wire. Each line of the table names the law that justifies it: when you simplify, always be able to say which law you are applying. The caption shows a second simplification that will be used again.

## Slide 21: Back to the machine

Back to the instructions. The gates you have just studied are inside the processor, thirty-two of each kind for every bitwise instruction.

## Slide 22: Bitwise instructions: the algebra on a whole register

`and`, `or`, `xor` and `not` apply one gate to every pair of corresponding bits of two registers, all positions at once. The third column works out an example on eight bits: with a equal to 1100 1010 and b equal to 0000 1111, AND gives 0000 1010, OR gives 1100 1111, XOR gives 1100 0101. The last column shows the same operators in C. `not` is a pseudo-instruction: it is `xori` with minus 1, because minus 1 in two's complement is all ones.

## Slide 23: Four things to do with a mask

The four standard uses of a mask, each resting on a law of the algebra. To *test* a bit, AND with a mask that has 1 in that position: x AND 1 is x, x AND 0 is 0. To *set* it to 1, OR with the same mask. To *clear* it, AND with the complemented mask. To *toggle* it, XOR with the mask. In the last three cases the other bits are unchanged, and this is the whole point: a mask acts on the bits you choose and leaves the rest alone.

## Slide 24: De Morgan at the joystick

De Morgan in a program. The player is idle when neither LEFT nor RIGHT is pressed. The short version uses a mask with two bits, 0x03: the result is zero only if both bits are zero, that is NOT (LEFT OR RIGHT). The long version tests each button separately: (NOT LEFT) AND (NOT RIGHT). The second law of De Morgan says that the two are the same condition. Two instructions instead of five: simplifying an expression is useful in software as well as in hardware.

## Slide 25: One lamp per bit: shifting and masking

How to read bit number n of a word when n is in a register: shift the word right by n positions, so that the bit you want arrives in position 0, then mask with 1. Here `s0` holds the number of the lamp, `srl` shifts the button word, `andi` isolates the bit, and the colour is chosen accordingly: grey for off, yellow for on. Shift and mask is one of the most common idioms in low-level programming.

## Slide 26: Check your understanding: For which inputs is x NAND y equal to 0?

NAND is AND followed by NOT. Start from AND: for which single row of its table is the output 1? That is the only row in which NAND is 0.

## Slide 27: Check your understanding: By De Morgan, (a . b')' is equal to:

Apply the first law of De Morgan to the product of a and b': the complement becomes the sum of the complements, a' plus the complement of b'. Then use involution on the second term.

## Slide 28: Check your understanding: t0 = 0x0000005A. What is in t1 after andi t1, t0, 0x0F?

Write 0x5A in binary, 0101 1010, and the mask 0x0F, 0000 1111. The AND keeps the bits where the mask has 1, the low four, and clears the others.

## Slide 29: Check your understanding: Which instruction turns bit 5 of t0 to 1 and leaves every other bit unchanged?

Compare the four instructions with the table of the mask. AND with 0x20 would clear all the other bits. XOR would invert the bit, turning a 1 into a 0. An arithmetic addition would work only if the bit was 0, and would produce a carry otherwise. Only OR sets the bit and leaves the rest unchanged.

## Slide 30: Exercises: paper first, then PRG32

Five exercises. Prove the second law of De Morgan with a truth table. Simplify an expression, naming the law at each step. Write the mask and the test for "A and B pressed together": note that testing for a non-zero result would mean A or B. Change the lamps so that they show the complement of the buttons. And convert a letter between upper and lower case with one instruction, remembering from Lecture 04 that the two differ in one bit.

## Slide 31: Glossary: English and Italian

Twelve terms. *Truth table* is the table that defines a function by listing all cases. *Logical product* and *logical sum* are AND and OR. *To set*, *to clear* and *to toggle* a bit mean to put it to 1, to put it to 0 and to invert it; Italian has no single verbs for them and uses short phrases.

## Slide 32: Conclusions and reading

Four conclusions. The von Neumann architecture describes a real machine in simplified form. Boolean algebra describes logic functions that electronic circuits can implement. Three operations, a few properties and De Morgan's laws are enough to transform any expression. And a bitwise instruction is the algebra applied to thirty-two bits at once, with the mask as the identity law at work. The next lecture goes from operators to functions: canonical forms and minimisation.
