# Lecture 13: Sequential Machines

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Sequential circuits

In a combinational circuit the outputs depend only on the present inputs. In a *sequential* circuit they depend also on the past history of the inputs. The definition brings in two concepts. Time: when do we look at the signals, and when are they allowed to change? State: what does the circuit remember of the past? The large phrase on the right is a good summary: a sequential circuit is a combinational one plus something that remembers.

## Time: from continuous to discrete

A physical signal passes through infinitely many instants and infinitely many values. A digital system gives up both infinities. Values were reduced to two in Lecture 10, with thresholds. Time is reduced to a sequence of chosen instants, t0, t1, t2: the signal is read only at those instants, and what it does in between does not count. Who decides when those instants are? A dedicated periodic signal, the clock.

## Synthesis of a sequential network

The synthesis of a sequential network in five steps. Define inputs, outputs and states. Define the next-state and output functions with a state table or a diagram. Assign a binary code to each state: k variables for up to 2 to the k states. Synthesise the two combinational networks with the methods you know. Choose the memory elements. With D flip-flops the fourth step is simplest, because the network just has to compute the code of the next state.

## State table and state diagram: a Moore machine

The same transitions as a Moore machine. The output no longer depends on the input, so the table has a separate column for it and the diagram writes it inside each node; the arrows carry only the input symbol. In this example the output is simply the binary code of the state. Compare the two slides: the structure of states and transitions is identical, and only the place where the output is written changes.

## Memory elements

A circuit that can store one bit is a *bistable*: it has two stable states, 0 and 1, and stays in one of them until something changes it. There are two families, latches and flip-flops, and both have two outputs, Q and its complement. The idea is older than the transistor: the first electronic flip-flop was built in 1918 with two vacuum tubes, and the same circuit was at the heart of Colossus.

## Level triggering and its problem

A latch is *level-triggered*: for the whole time the clock is at its active level it is transparent, and every change of the inputs passes to the outputs. So within one clock cycle the state may change several times. In a machine with feedback this is fatal: the new state travels round the loop and changes the state again in the same cycle. A JK latch with both inputs at 1 keeps toggling as long as the clock is high. We need an element that changes at most once per cycle.

## Memory elements: a summary

A summary of the memory elements. The column *next state* gives the rule in compact form, where Q+ is the state after the change; the last column says when the change can happen: at any time for the plain latch, during the active level for clocked latches, on the edge for flip-flops. The T flip-flop, which toggles when T is 1, is a JK with its two inputs joined. Keep in mind the row of the D flip-flop: it is the memory element of today's processors.

## Synthesis example: a two-bit counter

A complete synthesis: a counter of two bits that goes 0, 1, 2, 3 and back to 0. Follow the six steps on the right. The states are the four values; the code is the count itself; the table gives the next state for each present state. With D flip-flops the inputs D1 and D0 are simply the bits of the next state. Minimising them as functions of Q1 and Q0 gives D0 = NOT Q0 and D1 = Q1 XOR Q0. Two flip-flops, an inverter and one XOR gate.
