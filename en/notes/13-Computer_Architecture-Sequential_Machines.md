# Lecture 13: Sequential Machines

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: finite-state machines; the clock; latches and flip-flops; registers as flip-flops. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) describe a finite-state machine with a state diagram; (2) explain the clock and why a circuit must settle within one period; (3) tell a latch from a flip-flop and build a register. Builds on: only what Lecture 01 set up. Next: Lecture 14, Elementary Machines: Registers and Buses.

Closing thread: A register is flip-flops that sample on a clock edge: this is how the counter of Lecture 02 survived from one frame to the next, in hardware. Next: how registers exchange data.

## Slide 1: Sequential Machines

The third block of the course opens: state and memory. The machines of Lecture 11 had no memory: identical inputs always produced identical outputs. A computer, however, remembers: a counter persists from one frame to the next, and a game knows whether it is displaying the title or the playfield. This lecture introduces time and state, the model that describes every circuit with memory, and the elementary storage elements, latches and flip-flops, from which the registers of the processor are built. It is the conceptual hinge between logic and architecture.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Explaining why a sequential circuit requires the concepts of time and state. Defining a finite-state machine and distinguishing the Mealy and Moore models. Describing a machine by a state table and by a state diagram, and translating between them. Explaining how an SR latch stores a bit and why one input combination is forbidden. Distinguishing latches from flip-flops, level-triggering from edge-triggering. And recognising registers, counters and the program counter as sequential machines.

## Slide 3: The clock

The *clock* is a signal that alternates regularly between 0 and 1. The drawing labels its features: the period T, the high and low times, the rising edge, where it passes from 0 to 1, and the falling edge. The frequency is the number of periods per second, 1/T. Synchronous circuits change state on one of the two edges. For the kit, 160 MHz corresponds to a period of 6.25 nanoseconds, and every combinational network on the chip must settle within that interval: the critical path of Lecture 11 thus sets an upper bound on the clock frequency.

## Slide 4: The concept of state

The *state* is a summary of the entire past history of the inputs: whatever the circuit needs to know about the past in order to behave correctly from now on. It is held in state variables. A transition function computes the next state from the present state and the present inputs, and the state is updated once per clock cycle, as the formula on the right states compactly. The notion of state is a powerful abstraction: an unbounded history is replaced by a finite amount of information. Storing it requires elements with two stable conditions, latches and flip-flops.

## Slide 5: The finite-state automaton

The formal definition. A sequential machine is specified by five components: an input alphabet I and an output alphabet U, both finite sets of symbols; a finite set of states S; a next-state function, which assigns a next state to each pair of state and input; and an output function. The warm-up instantiates the definition: the input is "A pressed or not", the states are TITLE, PLAY and OVER, the next-state function is the code of `game_update`, and the output is the screen.

## Slide 6: Mealy machines and Moore machines

There are two ways of defining the output. In a *Mealy* machine the output depends on both the state and the input; it is written on the transitions and can respond to an input within the same cycle. In a *Moore* machine the output depends on the state alone; it is written inside the states and changes only when the state changes. The game of the warm-up is a Moore machine, since each state has its own screen. The two models have equal expressive power, although the number of states required may differ.

## Slide 7: General architecture of a sequential machine

The general architecture of every sequential machine. A combinational network computes the next state and the outputs from the inputs and the present state; a register of flip-flops holds the present state; at each clock edge the next state becomes the present state. The loop from the network to the register and back is what makes memory possible, and the register is what disciplines the loop: values circulate once per cycle, never faster. Every machine of Lecture 11 belongs to the upper block. This diagram, with suitable contents, describes the processor itself.

## Slide 8: State table and state diagram: a Mealy machine

Two equivalent descriptions of a machine, illustrated by a four-state Mealy example. In the *state table* each row is a present state and each column an input symbol; each cell gives the next state and, after the slash, the output. In the *state diagram* each state is a node and each transition an arrow labelled input/output. Translating between the two should be practised: the row of s0 is taken and its two arrows located in the drawing.

## Slide 9: The SR latch

The *SR latch* consists of two NOR gates, each with its output connected to an input of the other. S, for set, drives Q to 1; R, for reset, drives Q to 0. With both at 0 the latch retains its last value: it remembers which input was most recently 1. The table summarises the four cases, the last of which is forbidden. Because of the feedback, Q depends on itself: in a circuit with a loop a signal must be understood as a waveform in time, not as a single value.

## Slide 10: The SR latch in time

The latch observed in time. S rises to 1, and after the delay of the gates Q becomes 1. S then returns to 0 and nothing changes: the feedback holds Q at 1. This flat interval is the memory. Later R rises to 1, Q returns to 0, and remains there when R returns to 0. The four marked instants should be followed with the circuit of the previous slide at hand, determining the output of each gate at each instant.

## Slide 11: Why S = R = 1 is not allowed

With S and R both at 1, both NOR gates output 0, so Q and its complement are no longer complementary. Worse, if the two inputs then return to 0 simultaneously, the gates race, and the final state depends on which is faster. The outcome is unpredictable, and the latch may even oscillate, a condition known as metastability in its general form. A designer using an SR latch must guarantee that S and R are never 1 together. The JK and D elements were devised to eliminate this hazard at its root.

## Slide 12: Synchronous latches: adding a clock

In an asynchronous circuit the outputs may change whenever an input changes; in a synchronous one the clock determines when. To make the SR latch synchronous, S and R are passed through two AND gates together with the clock. When the clock is 0 both gates output 0 and the latch cannot change; when the clock is 1 it behaves as the plain latch. The clock thus decides when the inputs are heeded.

## Slide 13: The JK and D latches

Two refinements of the latch. In the *JK* latch the outputs are fed back to the input gates, so that the internal set and reset can never be 1 together; the combination J = K = 1, instead of being forbidden, inverts the output, which is called toggling. The *D* latch has a single input: D drives set and its negation drives reset, so the output simply follows D while the clock is active. D stands for delay, or data.

## Slide 14: The master-slave flip-flop

The *master-slave* flip-flop consists of two latches in series, enabled by opposite levels of the clock. When the clock is 0 the master is transparent and follows the input, while the slave is opaque. When the clock rises to 1 the master closes, retaining its content, and the slave opens and presents it. The two are never transparent simultaneously, so the input can never propagate directly to the output. The effect is that the output changes only at the rising edge: the flip-flop is *edge-triggered*.

## Slide 15: Latch or flip-flop? Watch the output

The difference made visible on the waveforms. The clock and the input D are identical for both elements. The output of the latch follows D throughout the high phase of the clock, and may therefore change in the middle of a phase. The output of the flip-flop changes only at rising edges, taking the value D has at that instant; short pulses of D between edges are ignored. The flip-flop's output is stable for a whole period, which is precisely the property a state register requires.

## Slide 16: A register is a row of flip-flops

A *register* is a row of flip-flops sharing a clock, one flip-flop per bit. With a load-enable signal it accepts a new value only on request and otherwise retains the old one. RISC-V has thirty-two registers of thirty-two bits, hence 1,024 flip-flops. The two machines of Lecture 11 now find their place: the decoder driven by the `rd` field asserts the load enable of a single register, and the multiplexers select which registers are read. The register file is thus a synthesis of the combinational and the sequential.

## Slide 17: Check your understanding: In a Moore machine the output depends on: / An SR latch built with NOR gates has Q = 1. S and R are both 0. What happens?

For the first question one recalls where the output is written in each kind of diagram. In a Moore machine it lies inside the nodes: it belongs to the state, and the input does not enter into it.

For the second, the table of the SR latch is consulted for the row with both inputs at 0. It is the row of memory: the feedback retains the stored value, whatever it was.

## Slide 18: Check your understanding: What distinguishes a D flip-flop from a D latch? / How many flip-flops are needed for a finite-state machine with 10 states?

For the first question: both elements store one bit and both have a clock. The difference lies in when they respond: the latch throughout the active level, the flip-flop only at the instant of an edge.

For the second, a machine with N states requires enough state variables to give each state a distinct code: the smallest k such that 2^k is at least N. This is the fixed-length code formula of Lecture 11.

## Slide 19: Glossary: English and Italian

Twelve terms. *Feedback* is *retroazione*. The *rising* and *falling edge* are the *fronte di salita* and *fronte di discesa*. *Level-triggered* and *edge-triggered* specify when a storage element responds. *Present state* and *next state* are the two values on either side of a clock edge. *Latch* and *flip-flop* are not translated; the general Italian term is *bistabile*.

## Slide 20: Conclusions and reading

Five conclusions. Digital circuits are combinational or sequential, and for the latter time and state are essential. A sequential machine realises a finite-state automaton, of Mealy or Moore type. Latches and flip-flops are the elementary memories, and feedback is what enables a circuit to remember. The clock determines when: latches respond during a level, flip-flops at an edge. Registers, counters, the program counter and the processor itself are sequential machines built around combinational networks. The next lecture assembles registers into the elementary machines of the datapath.
