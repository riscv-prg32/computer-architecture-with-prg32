# Lecture 09: Elements of Boolean Algebra

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the adder; Boolean functions; canonical forms; minimisation, Karnaugh maps. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Elements of Boolean Algebra

The previous lecture supplied operators and their properties. This one addresses the practical question that follows: given what a circuit must do, how are its gates found? The answer is a method in three steps, truth table, canonical form and minimisation, applied to the most important circuit of the course, the adder. The lecture opens with two instructions that add two bits, and closes with the thirty-two adders that execute every `add` written so far. It thus passes from the algebra as a calculus to the algebra as a design method.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Mastering the vocabulary: literal, clause, factor, minterm, maxterm. Stating how many Boolean functions of n variables exist. Writing a function in both canonical forms from its truth table. Minimising a function of up to four variables with a Karnaugh map, the skill most exercised by the midterm and the laboratory. And deriving the half adder and the full adder, then explaining how thirty-two of them perform an addition.

## Slide 3: Boolean expressions: the vocabulary

Three terms. A *literal* is a variable, or its complement, as it occurs in an expression: a, b', x. A *clause*, or product term, is a logical product of literals: a b' x. A *factor*, or sum term, is a logical sum of literals: (a + x'). The number of literals is a first measure of the cost of an expression, because each occurrence of a variable is an input to some gate; counting literals is how two forms of the same function will be compared.

## Slide 4: How many functions of n variables?

A Boolean function assigns 0 or 1 to each combination of its n inputs. There are 2^n combinations, and for each of them two possible outputs, so the number of distinct functions is 2^(2^n): 4 for one variable, 16 for two, 256 for three, 65,536 for four. The number is finite but grows doubly exponentially. The last line states why the subject matters: every digital circuit can be written as a Boolean expression, and every Boolean expression can be built as a circuit. The correspondence between algebra and hardware is exact.

## Slide 5: The sixteen functions of two variables

All sixteen functions of two variables. Each row is a function, the four central columns giving its outputs for the inputs 00, 01, 10 and 11; the index of the function is that column of outputs read as a binary number. The gates of Lecture 08 appear among them, highlighted: AND is f1, XOR is f6, OR is f7, NOR is f8, XNOR is f9, NAND is f14. The remainder comprise the two constants, the two inputs passed through unchanged, their negations, and four less common functions such as implication.

## Slide 6: Functionally complete sets

A set of operators is *functionally complete* if every Boolean function can be expressed with it alone. AND, OR and NOT form a complete set. Since De Morgan's laws allow either AND or OR to be obtained from the other with the help of NOT, two operators suffice. The remarkable fact comes last: NAND alone is complete, and so is NOR alone. A single type of gate is sufficient to construct any digital circuit, an entire processor included, which is why NAND and NOR are called universal gates. Lecture 10 shows why this matters economically.

## Slide 7: The half adder

The half adder adds two bits A and B and produces a sum bit S and a carry C. The truth table shows that S is 1 when the inputs differ, which is XOR, and that C is 1 when both are 1, which is AND. The circuit on the right corresponds exactly to the two instructions of the warm-up. It is called "half" because it has no input for a carry from a less significant position, so on its own it can add only the least significant bits of two numbers.

## Slide 8: The full adder

The full adder has three inputs, the two operand bits A and B and an incoming carry, and two outputs, a sum bit and an outgoing carry. From the table, S is 1 when an odd number of inputs is 1, and the carry out is 1 when at least two inputs are 1. The circuit consists of two half adders and an OR gate: the first adds A and B, the second adds the incoming carry to their partial sum, and the OR merges the two possible carries, which can never both be 1. In the drawing, wires that cross without a dot are not connected.

## Slide 9: Minterms and maxterms

A *minterm* is a product containing every variable exactly once, complemented or not. Its defining property is that it equals 1 for exactly one row of the truth table: a'b'c is 1 only when a = 0, b = 0 and c = 1. A *maxterm* is a sum containing every variable exactly once, and it equals 0 for exactly one row. To write the minterm of a row, the variables that are 0 in that row are complemented; for the maxterm, those that are 1. Minterms and maxterms are the building blocks of the canonical forms.

## Slide 10: From the truth table to the canonical forms

The procedure applied to F. For each row in which F is 1 its minterm is written, and the OR of these minterms is the canonical form P: F is the sum of minterms 3, 4, 5, 6 and 7. For each row in which F is 0 its maxterm is written, and the AND of these maxterms is the canonical form S: the product of maxterms 0, 1 and 2. Both expressions are correct and unique, which is their theoretical value; neither is economical, since the first has five clauses and fifteen literals.

## Slide 11: Algebraic minimisation of F

The canonical form of F reduced step by step with the laws of Lecture 08. A is factored from four clauses; a second factoring takes place within the parenthesis; the complement law is applied twice; finally the simplification x + x'y = x + y. Fifteen literals become three: F = A + BC. The method works, but the caption identifies its weakness: at every step one had to see which law to apply. For larger functions this is impractical, and a method independent of insight is required.

## Slide 12: Karnaugh maps: the idea

A Karnaugh map is the truth table redrawn as a grid, one cell per row. Its essential feature is the ordering of the cells: any two neighbouring cells differ in the value of exactly one variable, which is why the columns are labelled 00, 01, 11, 10 (a Gray code) rather than in counting order. Consequently two adjacent 1s can be merged into a single clause with one literal fewer, by the law xy + xy' = x. The rule is to group the 1s into rectangles of 1, 2, 4 or 8 cells, each as large as possible, until every 1 is covered. The left and right edges are also adjacent.

## Slide 13: A map of three variables: our F

The function F placed on a three-variable map. 1s are written in the cells of minterms 3, 4, 5, 6 and 7. The red group covers the whole row A = 1, four cells in which both B and C vary, so the clause is A. The violet group covers the column BC = 11, in which A varies, so the clause is BC. Every 1 is covered and no group can be enlarged: F = A + BC. This is the result of the algebraic minimisation, obtained by inspection in a few seconds.

## Slide 14: A map of four variables

With four variables the map has sixteen cells, and both sets of labels follow the order 00, 01, 11, 10. The central red group of four yields BD. The four corners also form a group, because the map wraps around in both directions, as if drawn on the surface of a torus. In the corners B and D are both 0, so the clause is B'D'. The result has four literals instead of thirty-two. Before concluding that a 1 is isolated, the edges and corners should always be examined.

## Slide 15: Don't-care conditions

Some input combinations can never occur, or their output is irrelevant when they do. A decimal digit encoded on four bits uses only ten of the sixteen patterns, and the other six never appear. Their cells are marked x, a *don't care*, and each x may be treated as 1 or as 0, whichever is more advantageous: as 1 when it enlarges a group, and otherwise ignored. Greater freedom yields larger groups and therefore a cheaper circuit. Lecture 11 meets this situation in binary-coded decimal and the seven-segment display.

## Slide 16: Thirty-two full adders make an add

Thirty-two full adders are placed in a row, one per bit position. Each receives one bit of A, one bit of B and the carry from the position to its right, and passes its own carry to the left: this is a *ripple-carry adder*, and it is what executes `add t2, t0, t1`. The first incoming carry is 0. Subtraction uses the same adder: the second operand is complemented and the first incoming carry set to 1, which is exactly the two's complement negation of Lecture 05. The carry out of the last position is discarded. The carry must traverse all thirty-two stages, a delay whose consequences Lecture 11 examines.

## Slide 17: Check your understanding: How many distinct Boolean functions of three variables are there? / Which minterm of three variables A, B, C corresponds to row 5 of the truth table?

For the first question the formula for the number of functions is applied with n = 3, evaluating the exponent first: 2^3 = 8 is the number of rows of the truth table, and the answer is 2^8.

For the second, 5 is written in binary on three bits, 101. In a minterm a variable appears uncomplemented where the row has 1 and complemented where it has 0. The option containing plus signs can be discarded at once: it is a sum and therefore cannot be a minterm.

## Slide 18: Check your understanding: In a Karnaugh map, a rectangular group of four adjacent 1s eliminates: / In a full adder, the carry out is 1 when:

For the first question: a group of 2^k cells eliminates k variables, and four is 2^2. The three-variable map confirms it: the row of four 1s lost both B and C.

For the second, the table of the full adder is consulted. The carry out is 1 in the rows with two or three 1s among the inputs: it is the *majority* function. "An odd number of 1s" describes the other output, the sum bit.

## Slide 19: Glossary: English and Italian

Twelve terms. In Italian the canonical forms are designated P, for *prodotti*, and S, for *somme*; English texts use SOP and POS. The *half adder* is the *semisommatore*, the *full adder* the *sommatore completo*. A *don't care* is a *condizione di indifferenza*. The *ripple-carry adder* is the adder in which the carry propagates from each position to the next.

## Slide 20: Conclusions and reading

Five conclusions. A Boolean function is a truth table, and a truth table always yields a canonical expression. Minimisation optimises the network and reduces its cost. Karnaugh maps turn the algebra into a visual procedure: group the 1s and read off the clauses. The half adder and the full adder are the first genuine circuits of the course. And thirty-two full adders in a row execute the `add` typed in the first programming lecture. The next lecture asks what the gates themselves are made of.
