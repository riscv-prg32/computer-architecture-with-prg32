# Lecture 13: Sequential Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: finite-state machines; the clock; latches and flip-flops; registers as flip-flops. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Sequential Machines

The third block of the course begins: state and memory. The machines of Lecture 11 had no memory: the same inputs always gave the same outputs. A computer, however, remembers: a counter survives from one frame to the next, a game knows whether it is showing the title or the playfield. This lecture introduces time and state, the model that describes every circuit with memory, and the elementary memories, latches and flip-flops, from which the registers of the processor are built.

## Slide 2: What you will be able to do by the end

Six objectives. Explain why a sequential circuit needs the concepts of time and of state. Define a finite-state machine and distinguish Mealy from Moore. Describe a machine with a state table and with a state diagram. Explain how an SR latch remembers one bit and why one combination of its inputs is forbidden. Distinguish latches from flip-flops, level from edge. And recognise registers, counters and the program counter as sequential machines.

## Slide 3: The clock

The *clock* is a signal that alternates regularly between 0 and 1. The drawing names its parts: the period T, the high time and the low time, the rising edge, where it passes from 0 to 1, and the falling edge. The frequency is the number of periods per second, one divided by T. Synchronous circuits change state on one of the two edges. For the kit: 160 MHz means a period of 6.25 nanoseconds, and every combinational network in the chip must settle within that time.

## Slide 4: The concept of state

The *state* is a summary of the whole previous history of the inputs: everything the circuit needs to know about the past in order to behave correctly from now on. It is held by state variables. A transition function computes the next state from the present state and the present inputs, and the state is updated once per clock cycle. The formula on the right says it compactly. To store the state we need elements with two stable conditions: latches and flip-flops.

## Slide 5: The finite-state automaton

The formal definition. A sequential machine is made of five things: an input alphabet I and an output alphabet U, which are finite sets of symbols; a finite set of states S; a next-state function, which for each pair of state and input gives one next state; and an output function. Compare it with the warm-up: the input is "A pressed or not", the states are TITLE, PLAY and OVER, the next-state function is the code of `game_update`, and the output is the screen.

## Slide 6: Mealy machines and Moore machines

There are two ways of defining the output. In a *Mealy* machine the output depends on the state and on the input: it is written on the transitions, and it can react to an input in the same cycle. In a *Moore* machine the output depends on the state alone: it is written inside the states and changes only when the state changes. The game of the warm-up is a Moore machine: each state has its screen. The two models are equivalent, though the number of states may differ.

## Slide 7: General architecture of a sequential machine

The general architecture of every sequential machine. A combinational network computes the next state and the outputs from the inputs and the present state. A register of flip-flops holds the present state. At each clock edge the next state becomes the present state. The loop from the network to the register and back is what makes memory possible, and the register is what keeps the loop under control: values go round once per cycle, never faster. Everything in Lecture 11 lives in the upper box.

## Slide 8: State table and state diagram: a Mealy machine

The two equivalent descriptions of a machine, for a Mealy example with four states. In the *state table* each row is a present state and each column an input symbol; the cell gives the next state and, after the slash, the output. In the *state diagram* each state is a node and each transition an arrow labelled input slash output. Practise going from one to the other: take the row of s0 and find its two arrows in the drawing.

## Slide 9: The SR latch

The *SR latch*: two NOR gates, each with its output connected to an input of the other. S, for set, brings Q to 1; R, for reset, brings Q to 0. With both at 0 the latch keeps its last value: it remembers which input was 1 most recently. The table summarises the four cases, and the last one is forbidden. Because of the feedback Q depends on itself: in a circuit with a loop, a signal is a waveform in time and not a single value.

## Slide 10: The SR latch in time

The latch in time. S goes to 1, and after the delay of the gates Q becomes 1. Then S returns to 0 and nothing happens: the feedback keeps Q at 1. This flat stretch is the memory. Later R goes to 1, Q returns to 0, and it stays there when R returns to 0. Follow the four marked instants on the drawing with the circuit of the previous slide in front of you, working out the output of each gate.

## Slide 11: Why S = R = 1 is not allowed

With S and R both at 1, both NOR gates output 0, so Q and its complement are no longer complementary. Worse: if the two inputs then return to 0 together, the gates race against each other, and the final state depends on which is faster. The result is unpredictable, and the latch may even oscillate. Whoever uses an SR latch must guarantee that S and R are never 1 together. The JK and D elements were invented to remove this problem at the root.

## Slide 12: Synchronous latches: adding a clock

In an asynchronous circuit the outputs may change whenever an input changes. In a synchronous one the clock decides when. To make the SR latch synchronous, S and R pass through two AND gates together with the clock. When the clock is 0 both gates give 0 and the latch cannot change; when the clock is 1 it behaves like the plain latch. The clock decides when the inputs are listened to.

## Slide 13: The JK and D latches

Two improvements of the latch. In the *JK* latch the outputs are fed back to the input gates, so that the internal set and reset can never be 1 together; the combination J = K = 1, instead of being forbidden, inverts the output: it toggles. The *D* latch has a single input: D goes to set and its negation to reset, so the output simply takes the value of D while the clock is active. D stands for delay, or data.

## Slide 14: The master-slave flip-flop

The *master-slave* flip-flop is made of two latches in series, controlled by opposite levels of the clock. When the clock is 0 the master is open and follows the input, while the slave is closed. When the clock passes to 1 the master closes, keeping what it had, and the slave opens and shows it. The two are never transparent together, so the input can never run straight through to the output. The effect is that the output changes only at the rising edge: the flip-flop is *edge-triggered*.

## Slide 15: Latch or flip-flop? Watch the output

The difference, seen on the waveforms. The clock and the input D are the same for both. The output of the latch follows D for the whole high phase of the clock: it changes in the middle of a phase. The output of the flip-flop changes only at the rising edges, taking the value that D has at that instant; short pulses of D between two edges are ignored. The flip-flop's output is steady for a whole period, which is exactly what a state register needs.

## Slide 16: A register is a row of flip-flops

A *register* is a row of flip-flops with a common clock: one flip-flop per bit. With a load-enable signal it takes a new value only when asked, and otherwise keeps the old one. RISC-V has thirty-two registers of thirty-two bits: 1,024 flip-flops. Now the two machines of Lecture 11 find their place: the decoder driven by the field `rd` activates the load enable of one register only, and the multiplexers select which registers are read.

## Slide 17: Check your understanding: In a Moore machine the output depends on: / An SR latch built with NOR gates has Q = 1. S and R are both 0. What happens?

Recall where the output is written in the two kinds of diagram. In a Moore machine it is inside the nodes: it belongs to the state, and the input does not enter into it.

Look at the table of the SR latch: which row has both inputs at 0? It is the row of memory. The feedback keeps the stored value, whatever it was.

## Slide 18: Check your understanding: What distinguishes a D flip-flop from a D latch? / How many flip-flops are needed for a finite-state machine with 10 states?

Both elements store one bit and both have a clock. The difference is when they listen: the latch for the whole active level, the flip-flop only at the instant of an edge.

A machine with N states needs enough state variables to give each state a different code: the smallest k such that 2 to the k is at least N. It is the formula of the fixed-length codes of Lecture 11.

## Slide 19: Glossary: English and Italian

Twelve terms. *Feedback* is *retroazione*. The *rising* and *falling edge* are the *fronte di salita* and *di discesa*. *Level-triggered* and *edge-triggered* say when a memory element listens. *Present state* and *next state* are the two values around a clock edge. *Latch* and *flip-flop* are not translated; the general Italian word is *bistabile*.

## Slide 20: Conclusions and reading

Five conclusions. Digital circuits are combinational or sequential, and for the second kind time and state matter. A sequential machine implements a finite-state automaton, of the Mealy or the Moore type. Latches and flip-flops are the elementary memories, and feedback is what makes a circuit remember. The clock decides when: latches listen during a level, flip-flops on an edge. Registers, counters, the program counter and the processor are sequential machines built around combinational networks.
