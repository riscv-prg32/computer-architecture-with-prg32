# Lecture 09: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

## Slide 1: Elements of Boolean Algebra

The previous lecture gave you operators and properties. This one answers the practical question that follows: given what a circuit must do, how do you find the gates? The answer is a method in three steps, truth table, canonical form and minimisation, and you will apply it to the most important circuit of the course, the adder. The lecture opens with two instructions that add two bits, and it closes with the thirty-two adders that execute every `add` you have typed.

## Slide 2: What you will be able to do by the end

Five objectives. Know the vocabulary: literal, clause, factor, minterm, maxterm. Say how many Boolean functions of n variables exist. Write a function in its two canonical forms starting from the truth table. Minimise a function of up to four variables with a Karnaugh map: this is the skill that the midterm and the laboratory exercise most. And derive the half adder and the full adder, explaining how thirty-two of them carry out an addition.

## Slide 3: Boolean expressions: the vocabulary

Three words. A *literal* is a variable or its complement as it appears in an expression: a, b', x. A *clause*, or product term, is a logical product of literals: a b' x. A *factor*, or sum term, is a logical sum of literals: (a + x'). The number of literals is a measure of the cost of an expression, because each occurrence of a variable is an input of some gate. You will count literals to compare two forms of the same function.

## Slide 4: How many functions of n variables?

A Boolean function assigns a 0 or a 1 to each combination of its n inputs. The combinations are 2 to the n, and for each of them there are two possible outputs: so the functions are 2 to the power 2 to the n. With one variable there are 4, with two 16, with three 256, with four 65,536. The number is finite but grows extremely fast. The last line is the reason for studying all this: every digital circuit can be written as an expression, and every expression can be built as a circuit.

## Slide 5: The sixteen functions of two variables

All sixteen functions of two variables. Each row is a function, and the four middle columns are its outputs for the inputs 00, 01, 10 and 11; the number of the function is that column of outputs read as a binary number. Among them you recognise, highlighted, the gates of Lecture 08: AND is f1, XOR is f6, OR is f7, NOR is f8, XNOR is f9, NAND is f14. The others are the two constants, the two inputs passed unchanged, their negations, and four less common functions.

## Slide 6: Functionally complete sets

A set of operators is *functionally complete* if every Boolean function can be built with it. AND, OR and NOT are complete. By De Morgan's laws one of AND and OR can be obtained from the other with NOT, so two operators are enough. The surprising fact is the last one: NAND alone is complete, and so is NOR alone. A single type of gate is enough to build any digital circuit, a whole processor included; this is why NAND and NOR are called universal gates.

## Slide 7: The half adder

The half adder adds two bits A and B and produces a sum bit S and a carry C. From the table, S is 1 when the inputs are different, which is the XOR, and C is 1 when both are 1, which is the AND. The circuit on the right is exactly the two instructions of the warm-up. It is called "half" because it has no input for a carry coming from a previous position, so by itself it can only add the least significant bits of two numbers.

## Slide 8: The full adder

The full adder has three inputs: the two bits A and B and a carry in. It produces a sum bit and a carry out. Read the table: S is 1 when an odd number of inputs is 1; the carry out is 1 when at least two inputs are 1. The circuit is made of two half adders and an OR: the first adds A and B, the second adds the carry in to their sum, and the OR combines the two possible carries. In the drawing, wires that cross without a dot are not connected.

## Slide 9: Minterms and maxterms

A *minterm* is a product that contains every variable once, complemented or not. Its special property is that it is 1 for exactly one row of the truth table: a'b'c is 1 only when a is 0, b is 0 and c is 1. A *maxterm* is a sum that contains every variable once, and it is 0 for exactly one row. To write the minterm of a row, complement the variables that are 0 in that row; for the maxterm, complement those that are 1.

## Slide 10: From the truth table to the canonical forms

The recipe applied to F. For each row where F is 1, write its minterm; the OR of these minterms is the canonical form P: F is the sum of minterms 3, 4, 5, 6 and 7. For each row where F is 0, write its maxterm; the AND of these maxterms is the canonical form S: the product of maxterms 0, 1 and 2. Both expressions are correct and unique. Neither is economical: the first has five clauses and fifteen literals.

## Slide 11: Algebraic minimisation of F

The canonical form of F reduced step by step with the laws of Lecture 08. Collect A from four clauses; collect again inside the parenthesis; apply the complement law twice; finally apply the simplification x + x'y = x + y. Fifteen literals become three: F = A + BC. It works, but notice what the caption says: at each step you had to see which law to apply. For a larger function that is not practical. A method is needed that does not depend on inspiration.

## Slide 12: Karnaugh maps: the idea

A Karnaugh map is the truth table redrawn as a grid, with one cell for each row. The essential point is the order of the cells: two neighbouring cells differ in the value of one variable only, which is why the columns are labelled 00, 01, 11, 10 and not in counting order. Because of this, two adjacent 1s can be merged into a single clause with one literal less. The rule: group the 1s in rectangles of 1, 2, 4 or 8 cells, as large as possible, until every 1 is covered. The left and right edges are adjacent too.

## Slide 13: A map of three variables: our F

The function F of the lecture on a map of three variables. Write 1 in the cells of minterms 3, 4, 5, 6 and 7. The red group takes the whole row A = 1, four cells: two variables change, B and C, and the clause is A. The violet group takes the column BC = 11: A changes, and the clause is BC. Every 1 is covered and no group can be enlarged: F = A + BC. It is the result of the algebraic minimisation, found by eye in a few seconds.

## Slide 14: A map of four variables

With four variables the map has sixteen cells, and both pairs of labels follow the order 00, 01, 11, 10. The red group of four in the centre gives BD. The four corners form one group as well, because the map wraps around in both directions: imagine it drawn on the surface of a doughnut. In the corners B and D are both 0, so the clause is B'D'. The result has four literals instead of thirty-two. Always look at the edges and the corners before concluding that a 1 is isolated.

## Slide 15: Don't-care conditions

Sometimes a combination of inputs can never occur, or the output does not matter when it does. A decimal digit coded on four bits uses only ten of the sixteen patterns: the other six never appear. Their cells are marked with an x, a *don't care*, and each x may be read as 1 or as 0, whichever is more convenient. Use an x as 1 when it lets you make a group larger; ignore it otherwise. More freedom means larger groups and a cheaper circuit.

## Slide 16: Thirty-two full adders make an add

Put thirty-two full adders in a row, one per bit position. Each receives one bit of A, one bit of B and the carry from the position on its right, and passes its own carry to the left: a *ripple-carry adder*. This is what executes `add t2, t0, t1`. The first carry in is 0. For a subtraction the same adder is used: the second operand is complemented and the first carry in is 1, which is the two's complement of Lecture 05. The carry out of the last position is simply dropped.

## Slide 17: Check your understanding: How many distinct Boolean functions of three variables are there? / Which minterm of three variables A, B, C corresponds to row 5 of the truth table?

Use the formula for the number of functions with n equal to 3. Do the exponent first: 2 to the 3 is 8, the number of rows of the truth table; then 2 to the 8.

Write 5 in binary on three bits: 101. In a minterm a variable appears plain where the row has a 1 and complemented where it has a 0. Discard at once the option with plus signs: that is a sum, so it cannot be a minterm.

## Slide 18: Check your understanding: In a Karnaugh map, a rectangular group of four adjacent 1s eliminates: / In a full adder, the carry out is 1 when:

A group of 2 to the k cells eliminates k variables. Four is 2 squared. Check it on the map of three variables: the row of four 1s lost both B and C.

Look at the table of the full adder. The carry out is 1 in the rows with two or three 1s among the inputs: it is the *majority* function. "An odd number of 1s" describes the other output, the sum bit.

## Slide 19: Glossary: English and Italian

Twelve terms. In Italian the canonical forms are named with the letters P, for *prodotti*, and S, for *somme*; English texts say SOP and POS. The *half adder* is the *semisommatore* and the *full adder* the *sommatore completo*. A *don't care* is a *condizione di indifferenza*. The *ripple-carry adder* is the adder in which the carry propagates from one position to the next.

## Slide 20: Conclusions and reading

Five conclusions. A Boolean function is a truth table, and a truth table always yields a canonical expression. Minimisation optimises the network to make it cheaper. Karnaugh maps turn the algebra into a picture: group the 1s and read the clauses. The half adder and the full adder are the first real circuits of the course. And thirty-two full adders in a row execute the `add` you typed in the first lecture. Next: what the gates themselves are made of.
