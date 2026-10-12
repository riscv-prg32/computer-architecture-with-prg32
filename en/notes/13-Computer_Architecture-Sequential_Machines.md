# Lecture 13: Sequential Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Sequential Machines

The third block of the course begins: state and memory. The machines of Lecture 11 had no memory: the same inputs always gave the same outputs. A computer, however, remembers: a counter survives from one frame to the next, a game knows whether it is showing the title or the playfield. This lecture introduces time and state, the model that describes every circuit with memory, and the elementary memories, latches and flip-flops, from which the registers of the processor are built.

## Slide 2: What you will be able to do by the end

Six objectives. Explain why a sequential circuit needs the concepts of time and of state. Define a finite-state machine and distinguish Mealy from Moore. Describe a machine with a state table and with a state diagram. Explain how an SR latch remembers one bit and why one combination of its inputs is forbidden. Distinguish latches from flip-flops, level from edge. And recognise registers, counters and the program counter as sequential machines.

## Slide 3: Warm-up on the machine

The warm-up is a fragment of a game with three screens. As you read it, notice that the same button does different things at different moments: something in the program must remember where it is.

## Slide 4: A game is a state machine

A game with a title screen, a playfield and a game-over screen. The variable `state` holds one of three values. `game_update` reads the button A and the present state: in TITLE, pressing A leads to PLAY; in OVER, pressing A leads back to TITLE; otherwise nothing changes. So the effect of A depends on the state. This is a *state machine*: `update` computes the next state from the present state and the input, the state survives in memory from frame to frame, and `draw` shows a screen for each state.

## Slide 5: Time and state

What does a combinational machine lack? Two things: a notion of when, and a memory of what happened. This part introduces them: time, made discrete by a clock, and state.

## Slide 6: Sequential circuits

In a combinational circuit the outputs depend only on the present inputs. In a *sequential* circuit they depend also on the past history of the inputs. The definition brings in two concepts. Time: when do we look at the signals, and when are they allowed to change? State: what does the circuit remember of the past? The large phrase on the right is a good summary: a sequential circuit is a combinational one plus something that remembers.

## Slide 7: Time: from continuous to discrete

A physical signal passes through infinitely many instants and infinitely many values. A digital system gives up both infinities. Values were reduced to two in Lecture 10, with thresholds. Time is reduced to a sequence of chosen instants, t0, t1, t2: the signal is read only at those instants, and what it does in between does not count. Who decides when those instants are? A dedicated periodic signal, the clock.

## Slide 8: The clock

The *clock* is a signal that alternates regularly between 0 and 1. The drawing names its parts: the period T, the high time and the low time, the rising edge, where it passes from 0 to 1, and the falling edge. The frequency is the number of periods per second, one divided by T. Synchronous circuits change state on one of the two edges. For the kit: 160 MHz means a period of 6.25 nanoseconds, and every combinational network in the chip must settle within that time.

## Slide 9: The concept of state

The *state* is a summary of the whole previous history of the inputs: everything the circuit needs to know about the past in order to behave correctly from now on. It is held by state variables. A transition function computes the next state from the present state and the present inputs, and the state is updated once per clock cycle. The formula on the right says it compactly. To store the state we need elements with two stable conditions: latches and flip-flops.

## Slide 10: Finite-state machines

A real circuit has a finite number of state variables, so a finite number of states. Its behaviour is described by a mathematical model, the finite-state machine, which is the subject of this part.

## Slide 11: The finite-state automaton

The formal definition. A sequential machine is made of five things: an input alphabet I and an output alphabet U, which are finite sets of symbols; a finite set of states S; a next-state function, which for each pair of state and input gives one next state; and an output function. Compare it with the warm-up: the input is "A pressed or not", the states are TITLE, PLAY and OVER, the next-state function is the code of `game_update`, and the output is the screen.

## Slide 12: Mealy machines and Moore machines

There are two ways of defining the output. In a *Mealy* machine the output depends on the state and on the input: it is written on the transitions, and it can react to an input in the same cycle. In a *Moore* machine the output depends on the state alone: it is written inside the states and changes only when the state changes. The game of the warm-up is a Moore machine: each state has its screen. The two models are equivalent, though the number of states may differ.

## Slide 13: General architecture of a sequential machine

The general architecture of every sequential machine. A combinational network computes the next state and the outputs from the inputs and the present state. A register of flip-flops holds the present state. At each clock edge the next state becomes the present state. The loop from the network to the register and back is what makes memory possible, and the register is what keeps the loop under control: values go round once per cycle, never faster. Everything in Lecture 11 lives in the upper box.

## Slide 14: Synthesis of a sequential network

The synthesis of a sequential network in five steps. Define inputs, outputs and states. Define the next-state and output functions with a state table or a diagram. Assign a binary code to each state: k variables for up to 2 to the k states. Synthesise the two combinational networks with the methods you know. Choose the memory elements. With D flip-flops the fourth step is simplest, because the network just has to compute the code of the next state.

## Slide 15: State table and state diagram: a Mealy machine

The two equivalent descriptions of a machine, for a Mealy example with four states. In the *state table* each row is a present state and each column an input symbol; the cell gives the next state and, after the slash, the output. In the *state diagram* each state is a node and each transition an arrow labelled input slash output. Practise going from one to the other: take the row of s0 and find its two arrows in the drawing.

## Slide 16: State table and state diagram: a Moore machine

The same transitions as a Moore machine. The output no longer depends on the input, so the table has a separate column for it and the diagram writes it inside each node; the arrows carry only the input symbol. In this example the output is simply the binary code of the state. Compare the two slides: the structure of states and transitions is identical, and only the place where the output is written changes.

## Slide 17: The warm-up as a state diagram

The game of the warm-up drawn as a diagram: three states, with A leading from TITLE to PLAY and from OVER to TITLE, and the end of the lives leading from PLAY to OVER. The loops on each state are the cases in which nothing changes. The table below lists, for each state, the input that changes it, the next state and the output drawn. Draw the diagram before writing the code: for a game it is the most useful design habit there is.

## Slide 18: Latches

How does a circuit made of gates remember? The answer is feedback: an output connected back to an input. The simplest such circuit is the latch.

## Slide 19: Memory elements

A circuit that can store one bit is a *bistable*: it has two stable states, 0 and 1, and stays in one of them until something changes it. There are two families, latches and flip-flops, and both have two outputs, Q and its complement. The idea is older than the transistor: the first electronic flip-flop was built in 1918 with two vacuum tubes, and the same circuit was at the heart of Colossus.

## Slide 20: The SR latch

The *SR latch*: two NOR gates, each with its output connected to an input of the other. S, for set, brings Q to 1; R, for reset, brings Q to 0. With both at 0 the latch keeps its last value: it remembers which input was 1 most recently. The table summarises the four cases, and the last one is forbidden. Because of the feedback Q depends on itself: in a circuit with a loop, a signal is a waveform in time and not a single value.

## Slide 21: The SR latch in time

The latch in time. S goes to 1, and after the delay of the gates Q becomes 1. Then S returns to 0 and nothing happens: the feedback keeps Q at 1. This flat stretch is the memory. Later R goes to 1, Q returns to 0, and it stays there when R returns to 0. Follow the four marked instants on the drawing with the circuit of the previous slide in front of you, working out the output of each gate.

## Slide 22: Why S = R = 1 is not allowed

With S and R both at 1, both NOR gates output 0, so Q and its complement are no longer complementary. Worse: if the two inputs then return to 0 together, the gates race against each other, and the final state depends on which is faster. The result is unpredictable, and the latch may even oscillate. Whoever uses an SR latch must guarantee that S and R are never 1 together. The JK and D elements were invented to remove this problem at the root.

## Slide 23: Synchronous latches: adding a clock

In an asynchronous circuit the outputs may change whenever an input changes. In a synchronous one the clock decides when. To make the SR latch synchronous, S and R pass through two AND gates together with the clock. When the clock is 0 both gates give 0 and the latch cannot change; when the clock is 1 it behaves like the plain latch. The clock decides when the inputs are listened to.

## Slide 24: The JK and D latches

Two improvements of the latch. In the *JK* latch the outputs are fed back to the input gates, so that the internal set and reset can never be 1 together; the combination J = K = 1, instead of being forbidden, inverts the output: it toggles. The *D* latch has a single input: D goes to set and its negation to reset, so the output simply takes the value of D while the clock is active. D stands for delay, or data.

## Slide 25: Level triggering and its problem

A latch is *level-triggered*: for the whole time the clock is at its active level it is transparent, and every change of the inputs passes to the outputs. So within one clock cycle the state may change several times. In a machine with feedback this is fatal: the new state travels round the loop and changes the state again in the same cycle. A JK latch with both inputs at 1 keeps toggling as long as the clock is high. We need an element that changes at most once per cycle.

## Slide 26: Flip-flops

The flip-flop is that element: it changes on an edge of the clock, and only then.

## Slide 27: The master-slave flip-flop

The *master-slave* flip-flop is made of two latches in series, controlled by opposite levels of the clock. When the clock is 0 the master is open and follows the input, while the slave is closed. When the clock passes to 1 the master closes, keeping what it had, and the slave opens and shows it. The two are never transparent together, so the input can never run straight through to the output. The effect is that the output changes only at the rising edge: the flip-flop is *edge-triggered*.

## Slide 28: Latch or flip-flop? Watch the output

The difference, seen on the waveforms. The clock and the input D are the same for both. The output of the latch follows D for the whole high phase of the clock: it changes in the middle of a phase. The output of the flip-flop changes only at the rising edges, taking the value that D has at that instant; short pulses of D between two edges are ignored. The flip-flop's output is steady for a whole period, which is exactly what a state register needs.

## Slide 29: Memory elements: a summary

A summary of the memory elements. The column *next state* gives the rule in compact form, where Q+ is the state after the change; the last column says when the change can happen: at any time for the plain latch, during the active level for clocked latches, on the edge for flip-flops. The T flip-flop, which toggles when T is 1, is a JK with its two inputs joined. Keep in mind the row of the D flip-flop: it is the memory element of today's processors.

## Slide 30: Back to the machine

From one bit to the processor. The last part shows the register, the program counter, a small counter designed step by step, and the processor itself as one large sequential machine.

## Slide 31: A register is a row of flip-flops

A *register* is a row of flip-flops with a common clock: one flip-flop per bit. With a load-enable signal it takes a new value only when asked, and otherwise keeps the old one. RISC-V has thirty-two registers of thirty-two bits: 1,024 flip-flops. Now the two machines of Lecture 11 find their place: the decoder driven by the field `rd` activates the load enable of one register only, and the multiplexers select which registers are read.

## Slide 32: The program counter: a register in a loop

The *program counter*, PC, is the register that holds the address of the instruction being executed. Its next value is computed by a small network: an adder gives PC plus 4, the address of the following instruction, and a multiplexer chooses between that and the target of a branch. At each clock edge the next value becomes the present one. It has exactly the shape of the general architecture. With only the plus 4 path it is a counter, the simplest of all state machines.

## Slide 33: Synthesis example: a two-bit counter

A complete synthesis: a counter of two bits that goes 0, 1, 2, 3 and back to 0. Follow the six steps on the right. The states are the four values; the code is the count itself; the table gives the next state for each present state. With D flip-flops the inputs D1 and D0 are simply the bits of the next state. Minimising them as functions of Q1 and Q0 gives D0 = NOT Q0 and D1 = Q1 XOR Q0. Two flip-flops, an inverter and one XOR gate.

## Slide 34: The processor is a sequential machine

The whole processor is a sequential machine. Its state is the program counter, the thirty-two registers and the memory. Its input is the instruction found at the address in the PC, with the data it reads. The next-state network is made of decoders, multiplexers and the ALU. At the clock edge the registers named by the instruction take their new values. Running a program is a walk through the states of a very large state machine, and single-stepping in PRG32-QT shows that walk one state at a time.

## Slide 35: Check your understanding: In a Moore machine the output depends on:

Recall where the output is written in the two kinds of diagram. In a Moore machine it is inside the nodes: it belongs to the state, and the input does not enter into it.

## Slide 36: Check your understanding: An SR latch built with NOR gates has Q = 1. S and R are both 0. What happens?

Look at the table of the SR latch: which row has both inputs at 0? It is the row of memory. The feedback keeps the stored value, whatever it was.

## Slide 37: Check your understanding: What distinguishes a D flip-flop from a D latch?

Both elements store one bit and both have a clock. The difference is when they listen: the latch for the whole active level, the flip-flop only at the instant of an edge.

## Slide 38: Check your understanding: How many flip-flops are needed for a finite-state machine with 10 states?

A machine with N states needs enough state variables to give each state a different code: the smallest k such that 2 to the k is at least N. It is the formula of the fixed-length codes of Lecture 11.

## Slide 39: Exercises: paper first, then PRG32

Five exercises. Design a machine that outputs 1 when the last two inputs were both 1, as a Moore and as a Mealy machine, and compare the number of states. Complete a timing diagram of an SR latch. Synthesise a counter modulo 3 with two D flip-flops, and think about the unused fourth state. Add a PAUSE state to the game of the warm-up, drawing the diagram first. And make the button A work only when it is pressed again: this is edge detection in software.

## Slide 40: Glossary: English and Italian

Twelve terms. *Feedback* is *retroazione*. The *rising* and *falling edge* are the *fronte di salita* and *di discesa*. *Level-triggered* and *edge-triggered* say when a memory element listens. *Present state* and *next state* are the two values around a clock edge. *Latch* and *flip-flop* are not translated; the general Italian word is *bistabile*.

## Slide 41: Conclusions and reading

Five conclusions. Digital circuits are combinational or sequential, and for the second kind time and state matter. A sequential machine implements a finite-state automaton, of the Mealy or the Moore type. Latches and flip-flops are the elementary memories, and feedback is what makes a circuit remember. The clock decides when: latches listen during a level, flip-flops on an edge. Registers, counters, the program counter and the processor are sequential machines built around combinational networks.
