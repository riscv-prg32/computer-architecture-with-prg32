# Lecture 08: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; the von Neumann architecture; analysis and synthesis; Boolean algebra; logic gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: minimisation, Karnaugh maps (Lecture 09). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Elements of Boolean Algebra

The second block of the course begins: logic. After learning what bits mean, you learn how they are combined. You have in fact been using Boolean algebra since the first days, every time you tested a button with `andi`; this lecture gives that operation a name and builds the algebra around it. The White Rabbit on the cover is always in a hurry: the processor too does everything by tiny logical steps, billions of them per second.

## Slide 2: What you will be able to do by the end

Five objectives. Describe a computer as three subsystems connected by a bus. Distinguish the two problems of logic design, analysis and synthesis. Write the truth tables and recognise the symbols of six gates. Apply the properties of the algebra, including De Morgan's laws, to simplify an expression. And, back on the machine, use the bitwise instructions of RISC-V to test, set, clear and toggle single bits of a register.

## Slide 3: The electronic computer: three subsystems and a bus

A computer has three subsystems: the processor, which executes instructions; the main memory, which holds instructions and data; and input/output, which connects the machine to the world. They are joined by a *bus*, a set of shared wires divided into address lines, data lines and control lines. It is the von Neumann model of Lecture 03 in today's terms. Everything that travels on the bus is a pattern of bits. On the ESP32-C6 all of this is inside one chip.

## Slide 4: The processor

The processor is where the processing capability resides. It executes instructions, which are explicit commands of two kinds: those that govern the transfer of information, inside the computer and to and from the devices, and those that specify arithmetic and logic operations. The memory holds the data and the sequence of instructions, and a sequence of instructions stored in memory is a *program*. The processor does one thing for ever: it fetches an instruction, executes it, and repeats.

## Slide 5: What kind of system is an electronic computer?

Four adjectives define an electronic computer. *Numeric*, or digital: all the information is strings of bits. *Automatic*: once started it proceeds by itself. *Stored-program*: the program is in memory and can be replaced, so the same machine does different jobs. *Electronic*: it is built from circuits that store and process bits. Each adjective excludes something: an abacus is numeric but not automatic; a mechanical music box is automatic but its program is fixed.

## Slide 6: Logic circuits

The circuits that store and process bits are called switching circuits, or *logic circuits*; connected together they form a switching network, and designing one is logic design. To describe what such circuits do we use an algebra. It plays for circuits the role that ordinary algebra plays for quantities: a notation in which you can calculate instead of trying every case. The values are two, 0 and 1: two voltage levels, two states of a switch.

## Slide 7: Two problems, one algebra

Two problems, and one algebra for both. *Analysis*: you are given the structure of a circuit, how it is made, and you must find its behaviour, what it does. Reading `andi t3, t0, 1` and saying what ends up in `t3` is analysis. *Synthesis* goes the other way: from a desired behaviour to a structure that realises it, for example from the table of a sum to an adder. Synthesis usually has many solutions; choosing the cheapest is the subject of the next lecture.

## Slide 8: Boolean algebra

In Boolean algebra a variable can take only two values, 0 and 1, and there are three basic operations. AND, the logical product, written with a dot or by simply putting the variables side by side. OR, the logical sum, written with a plus sign. NOT, the complement, written here with a prime, as in x', so that it can be typed. Do not be misled by the symbols: the plus is not an arithmetic sum, as you will see at once in the truth table of OR.

## Slide 9: The three fundamental operations

Each panel shows an operation in three ways: the symbol of the gate, the notation and the *truth table*, which lists the output for every combination of the inputs. AND gives 1 only when both inputs are 1. OR gives 0 only when both inputs are 0, so 1 OR 1 is 1, not 2. NOT has one input and inverts it. Learn the three shapes: a flat back and a round front for AND, a curved back and a pointed front for OR, a triangle with a small circle for NOT.

## Slide 10: Three more gates you will meet everywhere

Three more gates. XOR, the exclusive or, gives 1 when the two inputs are different: it is the sum bit of a one-bit addition. NAND and NOR are AND and OR followed by a negation: the small circle on the output of a symbol always means NOT. NAND gives 0 only when both inputs are 1; NOR gives 1 only when both are 0. They matter in practice because they are the gates that are cheapest to build with transistors, as Lecture 10 will show.

## Slide 11: Properties of Boolean algebra (1)

The first four properties, each in two forms, one for AND and one for OR. Commutative and associative are as in ordinary algebra; thanks to the second, AND and OR extend to any number of operands. *Idempotence* is new: x AND x is x, and x OR x is x; repeating a variable adds nothing. *Absorption* is the most useful for simplifying: x OR (x AND y) is simply x, because when x is 1 the result is 1 whatever y is, and when x is 0 both terms are 0.

## Slide 12: Properties of Boolean algebra (2)

Five more properties. The first distributive law is the familiar one. The second, x + yz = (x + y)(x + z), has no equivalent in ordinary algebra: here OR distributes over AND too. Then the constants: 1 is the identity for AND and 0 for OR; 0 annuls an AND and 1 saturates an OR. The complement laws say that a variable and its negation give 0 with AND and 1 with OR. Involution: negating twice returns the variable. Two of these, identity and null element, explain how a mask works.

## Slide 13: De Morgan's laws

De Morgan's laws connect the three operations: the complement of a product is the sum of the complements, and the complement of a sum is the product of the complements. The table proves the first by *perfect induction*: since the variables have only two values, a law can be verified by checking every row. The two highlighted columns are identical. In terms of gates: a NAND is an OR with negated inputs. You will use these laws constantly, on paper and in programs.

## Slide 14: Duality and precedence

Two general rules. *Duality*: every identity remains true if you swap AND with OR and 0 with 1; this is why the properties came in pairs, and it halves the work of proving them. *Precedence*: NOT is applied first, then AND, then OR, as powers come before products and products before sums; parentheses change the order. And a definition to remember: two expressions are equivalent when they have the same truth table.

## Slide 15: Simplifying with the algebra

The algebra at work. The expression xy + xy' needs two AND gates, an OR and an inverter. Collecting x with the distributive law gives x(y + y'); the complement law turns the parenthesis into 1; the identity law leaves x. Three gates have become a piece of wire. Each line of the table names the law that justifies it: when you simplify, always be able to say which law you are applying. The caption shows a second simplification that will be used again.

## Slide 16: Check your understanding: For which inputs is x NAND y equal to 0? / By De Morgan, (a . b')' is equal to:

NAND is AND followed by NOT. Start from AND: for which single row of its table is the output 1? That is the only row in which NAND is 0.

Apply the first law of De Morgan to the product of a and b': the complement becomes the sum of the complements, a' plus the complement of b'. Then use involution on the second term.

## Slide 17: Check your understanding: t0 = 0x0000005A. What is in t1 after andi t1, t0, 0x0F? / Which instruction turns bit 5 of t0 to 1 and leaves every other bit unchanged?

Write 0x5A in binary, 0101 1010, and the mask 0x0F, 0000 1111. The AND keeps the bits where the mask has 1, the low four, and clears the others.

Compare the four instructions with the table of the mask. AND with 0x20 would clear all the other bits. XOR would invert the bit, turning a 1 into a 0. An arithmetic addition would work only if the bit was 0, and would produce a carry otherwise. Only OR sets the bit and leaves the rest unchanged.

## Slide 18: Glossary: English and Italian

Twelve terms. *Truth table* is the table that defines a function by listing all cases. *Logical product* and *logical sum* are AND and OR. *To set*, *to clear* and *to toggle* a bit mean to put it to 1, to put it to 0 and to invert it; Italian has no single verbs for them and uses short phrases.

## Slide 19: Conclusions and reading

Four conclusions. The von Neumann architecture describes a real machine in simplified form. Boolean algebra describes logic functions that electronic circuits can implement. Three operations, a few properties and De Morgan's laws are enough to transform any expression. And a bitwise instruction is the algebra applied to thirty-two bits at once, with the mask as the identity law at work. The next lecture goes from operators to functions: canonical forms and minimisation.
