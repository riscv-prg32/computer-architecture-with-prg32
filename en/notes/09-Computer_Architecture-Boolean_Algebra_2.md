# Lecture 09: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Elements of Boolean Algebra

The previous lecture gave you operators and properties. This one answers the practical question that follows: given what a circuit must do, how do you find the gates? The answer is a method in three steps, truth table, canonical form and minimisation, and you will apply it to the most important circuit of the course, the adder. The lecture opens with two instructions that add two bits, and it closes with the thirty-two adders that execute every `add` you have typed.

## Slide 2: What you will be able to do by the end

Five objectives. Know the vocabulary: literal, clause, factor, minterm, maxterm. Say how many Boolean functions of n variables exist. Write a function in its two canonical forms starting from the truth table. Minimise a function of up to four variables with a Karnaugh map: this is the skill that the midterm and the laboratory exercise most. And derive the half adder and the full adder, explaining how thirty-two of them carry out an addition.

## Slide 3: Warm-up on the machine

The warm-up asks you to add two bits without using `add`. Try to guess the two instructions before you look at the next slide: you met both in the previous lecture.

## Slide 4: One-bit addition without add

The sum of two bits can be 0, 1 or 2, so the result needs two bits. `xor` gives the low bit, which is 1 when the two inputs differ; `and` gives the high bit, the carry, which is 1 only when both are 1. The comment under the code is a truth table with two outputs: check its four rows. This pair of gates has a name, the *half adder*. The last callout states the problem of the day: here the gates were given; how do you find them when only the table is known?

## Slide 5: Boolean functions

First the vocabulary and the objects. This part defines the pieces of an expression, counts the functions that exist, lists those of two variables, and introduces the truth table and the two adders, which will serve as examples for the rest of the lecture.

## Slide 6: Boolean expressions: the vocabulary

Three words. A *literal* is a variable or its complement as it appears in an expression: a, b', x. A *clause*, or product term, is a logical product of literals: a b' x. A *factor*, or sum term, is a logical sum of literals: (a + x'). The number of literals is a measure of the cost of an expression, because each occurrence of a variable is an input of some gate. You will count literals to compare two forms of the same function.

## Slide 7: How many functions of n variables?

A Boolean function assigns a 0 or a 1 to each combination of its n inputs. The combinations are 2 to the n, and for each of them there are two possible outputs: so the functions are 2 to the power 2 to the n. With one variable there are 4, with two 16, with three 256, with four 65,536. The number is finite but grows extremely fast. The last line is the reason for studying all this: every digital circuit can be written as an expression, and every expression can be built as a circuit.

## Slide 8: The sixteen functions of two variables

All sixteen functions of two variables. Each row is a function, and the four middle columns are its outputs for the inputs 00, 01, 10 and 11; the number of the function is that column of outputs read as a binary number. Among them you recognise, highlighted, the gates of Lecture 08: AND is f1, XOR is f6, OR is f7, NOR is f8, XNOR is f9, NAND is f14. The others are the two constants, the two inputs passed unchanged, their negations, and four less common functions.

## Slide 9: Functionally complete sets

A set of operators is *functionally complete* if every Boolean function can be built with it. AND, OR and NOT are complete. By De Morgan's laws one of AND and OR can be obtained from the other with NOT, so two operators are enough. The surprising fact is the last one: NAND alone is complete, and so is NOR alone. A single type of gate is enough to build any digital circuit, a whole processor included; this is why NAND and NOR are called universal gates.

## Slide 10: Truth tables

A truth table defines a function by listing its value for every combination of the inputs. With n variables it has 2 to the n rows, written in counting order: 000, 001, 010 and so on. The table on the right defines the function F that accompanies you through the whole lecture: it is 1 on rows 3, 4, 5, 6 and 7. You will write it in canonical form, minimise it with the algebra, and then again with a Karnaugh map, and compare the results.

## Slide 11: The half adder

The half adder adds two bits A and B and produces a sum bit S and a carry C. From the table, S is 1 when the inputs are different, which is the XOR, and C is 1 when both are 1, which is the AND. The circuit on the right is exactly the two instructions of the warm-up. It is called "half" because it has no input for a carry coming from a previous position, so by itself it can only add the least significant bits of two numbers.

## Slide 12: The full adder

The full adder has three inputs: the two bits A and B and a carry in. It produces a sum bit and a carry out. Read the table: S is 1 when an odd number of inputs is 1; the carry out is 1 when at least two inputs are 1. The circuit is made of two half adders and an OR: the first adds A and B, the second adds the carry in to their sum, and the OR combines the two possible carries. In the drawing, wires that cross without a dot are not connected.

## Slide 13: Canonical forms

Now the method. The canonical forms are a recipe that always works: from any truth table they produce an expression, without any ingenuity. The price is that the expression is usually far from the simplest.

## Slide 14: Elementary forms: functions of level 2

Two standard shapes of expression, both with two levels of gates. Type P, the *sum of products*: clauses joined by OR, built as a layer of AND gates that feed one OR gate. Type S, the *product of sums*: factors joined by AND, built as a layer of OR gates that feed one AND gate. Any function can be written in either shape. Keep the two abbreviations in mind, SOP and POS: you will find them in every textbook.

## Slide 15: Minterms and maxterms

A *minterm* is a product that contains every variable once, complemented or not. Its special property is that it is 1 for exactly one row of the truth table: a'b'c is 1 only when a is 0, b is 0 and c is 1. A *maxterm* is a sum that contains every variable once, and it is 0 for exactly one row. To write the minterm of a row, complement the variables that are 0 in that row; for the maxterm, complement those that are 1.

## Slide 16: From the truth table to the canonical forms

The recipe applied to F. For each row where F is 1, write its minterm; the OR of these minterms is the canonical form P: F is the sum of minterms 3, 4, 5, 6 and 7. For each row where F is 0, write its maxterm; the AND of these maxterms is the canonical form S: the product of maxterms 0, 1 and 2. Both expressions are correct and unique. Neither is economical: the first has five clauses and fifteen literals.

## Slide 17: Algebraic minimisation of F

The canonical form of F reduced step by step with the laws of Lecture 08. Collect A from four clauses; collect again inside the parenthesis; apply the complement law twice; finally apply the simplification x + x'y = x + y. Fifteen literals become three: F = A + BC. It works, but notice what the caption says: at each step you had to see which law to apply. For a larger function that is not practical. A method is needed that does not depend on inspiration.

## Slide 18: The goal of minimisation

Minimising means finding, among all the two-level forms of a function, one with the fewest and smallest gates: lower cost, less power, a faster circuit. Three methods exist. Karnaugh maps are graphical and practical for up to four or five variables: they are the method of this course. Quine's method is algebraic, and McCluskey's is tabular and suited to a program: together they are the ancestors of the tools that design real chips today.

## Slide 19: Karnaugh maps

Karnaugh maps turn the algebra into a picture. Learn the rules on small maps, and practise until reading a map becomes automatic: it is one of the standard exercises of the midterm.

## Slide 20: Karnaugh maps: the idea

A Karnaugh map is the truth table redrawn as a grid, with one cell for each row. The essential point is the order of the cells: two neighbouring cells differ in the value of one variable only, which is why the columns are labelled 00, 01, 11, 10 and not in counting order. Because of this, two adjacent 1s can be merged into a single clause with one literal less. The rule: group the 1s in rectangles of 1, 2, 4 or 8 cells, as large as possible, until every 1 is covered. The left and right edges are adjacent too.

## Slide 21: A map of two variables

The smallest example. F is 1 in three cells. The red group covers the row where A is 1: inside it B takes both values, so B disappears and the clause is A. The violet group covers the column where B is 1: A changes, so the clause is B. The result is F = A + B: the function was simply OR. Note that the cell AB belongs to both groups: using a 1 twice is allowed, because x + x = x.

## Slide 22: A map of three variables: our F

The function F of the lecture on a map of three variables. Write 1 in the cells of minterms 3, 4, 5, 6 and 7. The red group takes the whole row A = 1, four cells: two variables change, B and C, and the clause is A. The violet group takes the column BC = 11: A changes, and the clause is BC. Every 1 is covered and no group can be enlarged: F = A + BC. It is the result of the algebraic minimisation, found by eye in a few seconds.

## Slide 23: A map of four variables

With four variables the map has sixteen cells, and both pairs of labels follow the order 00, 01, 11, 10. The red group of four in the centre gives BD. The four corners form one group as well, because the map wraps around in both directions: imagine it drawn on the surface of a doughnut. In the corners B and D are both 0, so the clause is B'D'. The result has four literals instead of thirty-two. Always look at the edges and the corners before concluding that a 1 is isolated.

## Slide 24: Don't-care conditions

Sometimes a combination of inputs can never occur, or the output does not matter when it does. A decimal digit coded on four bits uses only ten of the sixteen patterns: the other six never appear. Their cells are marked with an x, a *don't care*, and each x may be read as 1 or as 0, whichever is more convenient. Use an x as 1 when it lets you make a group larger; ignore it otherwise. More freedom means larger groups and a cheaper circuit.

## Slide 25: Back to the machine

The method has produced the full adder. The last part shows where that circuit lives in the processor, and what it looks like as a program.

## Slide 26: Thirty-two full adders make an add

Put thirty-two full adders in a row, one per bit position. Each receives one bit of A, one bit of B and the carry from the position on its right, and passes its own carry to the left: a *ripple-carry adder*. This is what executes `add t2, t0, t1`. The first carry in is 0. For a subtraction the same adder is used: the second operand is complemented and the first carry in is 1, which is the two's complement of Lecture 05. The carry out of the last position is simply dropped.

## Slide 27: A full adder, one gate per instruction

The full adder written as five instructions, one per gate: two `xor` for the sum, two `and` and an `or` for the carry out. The program is the schematic, read from left to right. It lets you practise both problems of Lecture 08. Analysis: single-step it in PRG32-QT for the eight input combinations and fill in the truth table. Synthesis: derive these gates from the table. With whole registers as inputs, the same five lines work on all thirty-two bit positions at once.

## Slide 28: Check your understanding: How many distinct Boolean functions of three variables are there?

Use the formula for the number of functions with n equal to 3. Do the exponent first: 2 to the 3 is 8, the number of rows of the truth table; then 2 to the 8.

## Slide 29: Check your understanding: Which minterm of three variables A, B, C corresponds to row 5 of the truth table?

Write 5 in binary on three bits: 101. In a minterm a variable appears plain where the row has a 1 and complemented where it has a 0. Discard at once the option with plus signs: that is a sum, so it cannot be a minterm.

## Slide 30: Check your understanding: In a Karnaugh map, a rectangular group of four adjacent 1s eliminates:

A group of 2 to the k cells eliminates k variables. Four is 2 squared. Check it on the map of three variables: the row of four 1s lost both B and C.

## Slide 31: Check your understanding: In a full adder, the carry out is 1 when:

Look at the table of the full adder. The carry out is 1 in the rows with two or three 1s among the inputs: it is the *majority* function. "An odd number of 1s" describes the other output, the sum bit.

## Slide 32: Exercises: paper first, then PRG32

Five exercises. Write the canonical forms of the two outputs of the full adder. Minimise the carry out with a map of three variables and count the gates saved. Minimise a function of four variables given as a list of minterms: remember the corners. Build NOT, AND and OR using only NAND gates and check each with a truth table. Then program the full adder on PRG32 and show its outputs as lamps for the eight input combinations.

## Slide 33: Glossary: English and Italian

Twelve terms. In Italian the canonical forms are named with the letters P, for *prodotti*, and S, for *somme*; English texts say SOP and POS. The *half adder* is the *semisommatore* and the *full adder* the *sommatore completo*. A *don't care* is a *condizione di indifferenza*. The *ripple-carry adder* is the adder in which the carry propagates from one position to the next.

## Slide 34: Conclusions and reading

Five conclusions. A Boolean function is a truth table, and a truth table always yields a canonical expression. Minimisation optimises the network to make it cheaper. Karnaugh maps turn the algebra into a picture: group the 1s and read the clauses. The half adder and the full adder are the first real circuits of the course. And thirty-two full adders in a row execute the `add` you typed in the first lecture. Next: what the gates themselves are made of.
