# Lecture 08: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: bit masks; the von Neumann architecture; analysis and synthesis; Boolean algebra; logic gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: minimisation, Karnaugh maps (Lecture 09). A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) tell the analysis of a logic circuit from its synthesis; (2) apply the axioms and theorems of Boolean algebra, De Morgan's included; (3) set, clear and test bits with masks. Builds on: the von Neumann architecture (Lecture 03). Next: Lecture 09, Elements of Boolean Algebra.

Closing thread: andi t3, t0, 1 is a row of 32 AND gates: Boolean algebra describes both the instruction and the circuit. Next: from a truth table to the smallest circuit.

## Slide 1: Elements of Boolean Algebra

The second block of the course opens: logic. Having established what bits mean, the course turns to how they are combined. Boolean algebra has in fact been in use since the first weeks, every time a button was tested with `andi`; this lecture names that operation and constructs the algebra around it. The White Rabbit on the cover, always in a hurry, is an apt emblem: the processor too accomplishes everything through minute logical steps, billions of them per second.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Describing a computer as three subsystems connected by a bus. Distinguishing the two fundamental problems of logic design, analysis and synthesis. Writing the truth tables of six gates and recognising their symbols. Applying the properties of the algebra, De Morgan's laws included, to simplify an expression. And, returning to the machine, using the bitwise instructions of RISC-V to test, set, clear and toggle individual bits of a register.

## Slide 3: The electronic computer: three subsystems and a bus

A computer comprises three subsystems: the processor, which executes instructions; the main memory, which holds instructions and data; and the input/output subsystem, which connects the machine to the world. They communicate through a *bus*, a set of shared lines divided into address lines, data lines and control lines. This is the von Neumann model of Lecture 03 expressed in contemporary terms. Everything that travels on the bus is a pattern of bits. On the ESP32-C6 all three subsystems reside on a single chip.

## Slide 4: The processor

The processor is where the capacity for computation resides. It executes instructions, explicit commands of two kinds: those that govern the transfer of information, within the computer and between it and its devices, and those that specify arithmetic and logical operations. Memory holds both the data and the sequence of instructions, and a sequence of instructions stored in memory is a *program*. The processor performs a single activity indefinitely: it fetches an instruction, executes it, and repeats. Lecture 19 examines this cycle in detail.

## Slide 5: What kind of system is an electronic computer?

Four attributes characterise an electronic computer. *Numeric*, or digital: all information is represented as strings of bits. *Automatic*: once started, it proceeds without intervention. *Stored-program*: the program resides in memory and can be replaced, so the same machine performs different tasks. *Electronic*: it is built from circuits that store and process bits. Each attribute excludes something: an abacus is numeric but not automatic; a mechanical music box is automatic but its program is fixed.

## Slide 6: Logic circuits

The circuits that store and process bits are called switching circuits, or *logic circuits*; interconnected, they form a switching network, and their design is called logic design. Describing their behaviour requires an algebra, which plays for circuits the role that ordinary algebra plays for quantities: a notation in which one can calculate rather than enumerate every case. The values are two, 0 and 1, corresponding physically to two voltage levels or two states of a switch, a correspondence that Lecture 10 makes precise.

## Slide 7: Two problems, one algebra

Two problems, addressed by one algebra. *Analysis*: given the structure of a circuit, how it is built, determine its behaviour, what it computes. Reading `andi t3, t0, 1` and stating what `t3` will contain is analysis. *Synthesis* proceeds in the opposite direction: from a specified behaviour to a structure that realises it, for example from the table of a sum to an adder. Analysis has a unique answer; synthesis in general has many, and choosing the least costly among them is the minimisation problem treated in Lecture 09.

## Slide 8: Boolean algebra

In Boolean algebra a variable takes only two values, 0 and 1, and there are three fundamental operations. AND, the logical product, written with a dot or by juxtaposition. OR, the logical sum, written with a plus sign. NOT, the complement, written here with a prime, as x', for ease of typing. The notation should not mislead: the plus sign does not denote arithmetic addition, as the truth table of OR immediately shows.

## Slide 9: The three fundamental operations

Each panel presents an operation in three forms: the symbol of the gate, the algebraic notation, and the *truth table*, which lists the output for every combination of inputs. AND yields 1 only when both inputs are 1. OR yields 0 only when both inputs are 0, so 1 OR 1 equals 1, not 2. NOT has a single input and inverts it. The three shapes should be learned: a flat back and rounded front for AND, a curved back and pointed front for OR, a triangle with a small circle for NOT.

## Slide 10: Three more gates you will meet everywhere

Three further gates. XOR, the exclusive OR, yields 1 when its inputs differ; it is the sum bit of a one-bit addition, as the warm-up of Lecture 09 shows. NAND and NOR are AND and OR followed by negation, and the small circle at the output of a symbol always denotes NOT. NAND yields 0 only when both inputs are 1; NOR yields 1 only when both are 0. Their practical importance is that they are the gates most economically built from transistors, as Lecture 10 demonstrates.

## Slide 11: Properties of Boolean algebra (1)

The first four properties, each stated in a form for AND and a form for OR. Commutativity and associativity hold as in ordinary algebra, and the latter allows AND and OR to be extended to any number of operands. *Idempotence* is new: x AND x is x, and x OR x is x; repeating a variable contributes nothing. *Absorption* is the most useful for simplification: x OR (x AND y) equals x, because when x is 1 the result is 1 whatever y may be, and when x is 0 both terms are 0.

## Slide 12: Properties of Boolean algebra (2)

Five further properties. The first distributive law is the familiar one. The second, x + yz = (x + y)(x + z), has no counterpart in ordinary algebra: here OR also distributes over AND. Then the constants: 1 is the identity element for AND and 0 for OR; 0 annihilates an AND and 1 saturates an OR. The complement laws state that a variable combined with its negation gives 0 under AND and 1 under OR. Involution: double negation restores the variable. Two of these properties, identity and the null element, are precisely what makes a bit mask work.

## Slide 13: De Morgan's laws

De Morgan's laws relate the three operations: the complement of a product is the sum of the complements, and the complement of a sum is the product of the complements. The table proves the first by *perfect induction*: since each variable takes only two values, a law can be established by checking every row exhaustively, and the two highlighted columns are identical. In terms of gates, a NAND is an OR with inverted inputs. These laws will be used constantly, both on paper and in programs.

## Slide 14: Duality and precedence

Two general principles. *Duality*: every identity remains valid when AND and OR are interchanged together with 0 and 1; this is why the properties appeared in pairs, and it halves the work of proving them. *Precedence*: NOT is applied first, then AND, then OR, just as exponentiation precedes multiplication and multiplication precedes addition; parentheses override the order. And a definition to retain: two expressions are equivalent when they have the same truth table.

## Slide 15: Simplifying with the algebra

The algebra at work. The expression xy + xy' requires two AND gates, an OR gate and an inverter. Factoring x by the distributive law gives x(y + y'); the complement law reduces the parenthesis to 1; the identity law leaves x. Four gates have become a wire. Each line of the derivation names the law that justifies it, and this discipline should be adopted: in a simplification, every step must be attributable to a law. The caption shows a second simplification that will recur in Lecture 09.

## Slide 16: Check your understanding: For which inputs is x NAND y equal to 0? / By De Morgan, (a . b')' is equal to:

For the first question, NAND is AND followed by NOT. Starting from AND, one identifies the single row of its table whose output is 1; that is the only row in which NAND yields 0.

For the second, the first of De Morgan's laws is applied to the product of a and b': the complement becomes the sum of the complements, a' plus the complement of b'. Involution then simplifies the second term.

## Slide 17: Check your understanding: t0 = 0x0000005A. What is in t1 after andi t1, t0, 0x0F? / Which instruction turns bit 5 of t0 to 1 and leaves every other bit unchanged?

For the first question, 0x5A is written in binary, 0101 1010, and the mask 0x0F as 0000 1111. The AND retains the bits where the mask has a 1, the low four, and clears the rest.

For the second, the four instructions are compared against the table of mask operations. AND with 0x20 would clear every other bit; XOR would invert the bit, turning a 1 into a 0; an arithmetic addition would work only if the bit were 0, and would otherwise propagate a carry. Only OR sets the bit while leaving all others unchanged.

## Slide 18: Glossary: English and Italian

Twelve terms. The *truth table* defines a function by exhaustive enumeration of its cases. *Logical product* and *logical sum* are AND and OR. *To set*, *to clear* and *to toggle* a bit mean to make it 1, to make it 0 and to invert it; Italian has no single verbs for these and uses short phrases.

## Slide 19: Conclusions and reading

Four conclusions. The von Neumann architecture describes a real machine in simplified form. Boolean algebra describes the logical functions that electronic circuits implement. Three operations, a handful of properties and De Morgan's laws suffice to transform any expression. And a bitwise instruction is the algebra applied to thirty-two bits in parallel, with the mask as the identity and null-element laws at work. The next lecture passes from operators to functions: canonical forms and minimisation.
