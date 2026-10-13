# Lecture 09: Elements of Boolean Algebra

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Truth tables

A truth table defines a function by listing its value for every combination of the inputs. With n variables it has 2 to the n rows, written in counting order: 000, 001, 010 and so on. The table on the right defines the function F that accompanies you through the whole lecture: it is 1 on rows 3, 4, 5, 6 and 7. You will write it in canonical form, minimise it with the algebra, and then again with a Karnaugh map, and compare the results.

## Elementary forms: functions of level 2

Two standard shapes of expression, both with two levels of gates. Type P, the *sum of products*: clauses joined by OR, built as a layer of AND gates that feed one OR gate. Type S, the *product of sums*: factors joined by AND, built as a layer of OR gates that feed one AND gate. Any function can be written in either shape. Keep the two abbreviations in mind, SOP and POS: you will find them in every textbook.

## The goal of minimisation

Minimising means finding, among all the two-level forms of a function, one with the fewest and smallest gates: lower cost, less power, a faster circuit. Three methods exist. Karnaugh maps are graphical and practical for up to four or five variables: they are the method of this course. Quine's method is algebraic, and McCluskey's is tabular and suited to a program: together they are the ancestors of the tools that design real chips today.

## A map of two variables

The smallest example. F is 1 in three cells. The red group covers the row where A is 1: inside it B takes both values, so B disappears and the clause is A. The violet group covers the column where B is 1: A changes, so the clause is B. The result is F = A + B: the function was simply OR. Note that the cell AB belongs to both groups: using a 1 twice is allowed, because x + x = x.
