# Lecture 10: Introduction to Electronics and Digital Electronics

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: pull-up inputs; voltage, current, Ohm's law; the transistor as a switch; from volts to bits; CMOS gates. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: the clock (Lecture 13). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Introduction to Electronics and Digital Electronics

Until now a gate has been a symbol and a truth table; this lecture gives it a physical body. It follows a single bit, that of a button of the kit, from the finger that presses it to the register the program reads, explaining along the way what a volt is, what a transistor does, and how two transistors make a NOT gate. No prior knowledge of physics is assumed. The epigraph by Arthur C. Clarke names the impression the lecture sets out to dispel: a chip appears to be magic only until one sees what it is made of.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Applying the four electrical quantities and Ohm's law to a simple circuit. Sizing the resistor of an LED and computing a voltage divider. Explaining what a transistor is and how a MOS transistor operates as a switch. Stating how a voltage becomes a logic value, and what a noise margin is. Drawing the CMOS inverter, NAND and NOR and counting their transistors. And explaining pull-up resistors, floating inputs, and why switching a gate costs time and energy.

## Slide 3: Four quantities

Four quantities, introduced through the analogy of water in pipes. *Voltage* is the pressure that drives the flow; it is measured in volts and is always defined between two points. *Current* is the flow, in amperes. *Resistance* is the opposition to the flow, in ohms. *Power* is the work done per second, in watts. The last column relates each to the kit: a 3.3 V supply, about 10 mA through a lit LED, 45 kΩ inside each input pin. The caption fixes a convention: saying that a pin "is at 3.3 V" means 3.3 V with respect to ground, the common reference.

## Slide 4: Ohm's law, and the resistor of an LED

Ohm's law: the voltage across a resistor equals its resistance multiplied by the current through it. A circuit is a closed loop, and the drawing shows the simplest useful one: a supply, a resistor and an LED. The LED holds about 2 V across itself; the resistor takes the remaining 1.3 V and thereby determines the current. For 10 mA the resistance must be 1.3 / 0.010 = 130 Ω, and the nearest standard value is 150 Ω, which errs on the side of a smaller current. Without the resistor the current would be limited only by the supply and the LED would be destroyed.

## Slide 5: Series, parallel and the voltage divider

Two ways of combining resistors. In *series* the same current flows through both and the resistances add. In *parallel* the same voltage appears across both and the combined resistance is smaller than either. Two resistors in series form a *voltage divider*: the output, taken at their junction, equals the supply multiplied by R2/(R1 + R2). With equal resistors it is half the supply; if R2 is much smaller than R1, the output approaches ground. The divider should be kept in mind, because it explains the button circuit at the end of the lecture.

## Slide 6: The capacitor: why signals take time

A capacitor stores charge as a tank stores water, and its voltage cannot change instantaneously: it must be charged or discharged through a resistance. The time required is of the order of R times C, the time constant; after one time constant the voltage has covered about 63% of its excursion. For an input pin of the kit, 45 kΩ times 2 pF gives 90 nanoseconds. Every wire and every transistor input behaves as a small capacitor, and this is the physical origin of gate delay. A capacitor that is charged or discharged is also a means of storing a bit, as the DRAM cell of Lecture 15 shows.

## Slide 7: Conductors, insulators, semiconductors

Conductors permit the flow of charge; insulators prevent it. Semiconductors lie between the two, and their conductivity can be controlled. The control is achieved by *doping*: introducing a small number of atoms of another element. In n-type silicon there is an excess of electrons, which act as negative carriers; in p-type silicon there is a deficit of electrons, called holes, which behave as positive carriers. Where a p region meets an n region a *junction* is formed. A chip is a slice of silicon containing billions of such regions, interconnected by layers of metal.

## Slide 8: The transistor: a switch with no moving parts

The history of the switch without moving parts, in six dates. The transistor of 1947 replaces the vacuum tube. The integrated circuit of 1958 places several transistors on a single piece of semiconductor. The MOS transistor of 1960 is small, simple to manufacture and requires almost no control current. CMOS, in 1963, combines two complementary types so that power is consumed essentially only during switching. In 1971 a complete processor fits on one chip with 2,300 transistors; a contemporary chip holds tens of billions.

## Slide 9: The MOS transistor as a switch

A MOS transistor has three terminals: the *gate* controls whether current may pass between the other two, the *source* and the *drain*. There are two types, and the table contains everything needed: an nMOS conducts when its gate is high, a pMOS when its gate is low. They are complementary, since the voltage that closes one opens the other. The gate is insulated and draws practically no current. One further fact will be needed shortly: an nMOS is effective at connecting a node to ground, a pMOS at connecting it to the supply.

## Slide 10: Logic levels: when is a voltage a 1?

A digital circuit does not use exact voltages but two ranges, shown in the figure for the kit. An output guarantees clean levels: above 2.64 V for a 1, below 0.33 V for a 0. An input is more tolerant: it reads 1 above 2.475 V and 0 below 0.825 V. The difference between what an output guarantees and what an input requires is the *noise margin*: a disturbance smaller than the margin cannot alter the bit. Between the two input thresholds the logical value is undefined, and signals must traverse that band quickly.

## Slide 11: Why digital?

Why renounce the richness of analog signals? In an analog circuit the exact value is the information, so every stage adds a little noise and the noise accumulates: each copy is worse than its predecessor. In a digital circuit only the range matters, and every gate regenerates a fresh, clean level: noise does not accumulate, copies are perfect, and errors can even be detected and corrected, as Lecture 11 shows with parity. Analog circuits remain indispensable at the boundaries of a system, where it meets the physical world: sensors, radio, sound.

## Slide 12: The CMOS inverter: a NOT gate from two transistors

The first gate. A pMOS connects the output to the supply, an nMOS connects it to ground, and both gates are driven by the same input. With the input at 0 the pMOS conducts and the output is 1; with the input at 1 the nMOS conducts and the output is 0. The circuit is a NOT. At any steady input exactly one of the two transistors conducts, so no current flows from supply to ground at rest: this is why CMOS consumes almost no static power, and the reason for its universal adoption.

## Slide 13: NAND and NOR in CMOS

Two inputs, four transistors. In the NAND the two nMOS are in series: the output is connected to ground only if A and B are both 1. The two pMOS are in parallel: the output is connected to the supply if either input is 0. Series realises AND, parallel realises OR. The NOR is the dual circuit, with series and parallel interchanged, exactly as De Morgan's laws interchange AND and OR. Both drawings should be checked for the four input combinations, marking which transistors conduct in each case.

## Slide 14: What gates cost, in transistors

The cost of circuits measured in transistors. A NOT costs 2, a NAND or a NOR 4, an AND or an OR 6, because each is a NAND or NOR followed by an inverter. This reverses the intuition suggested by the algebra: in CMOS the inverting gates are the primitive ones, and an AND is more expensive than a NAND. A full adder requires about 28 transistors, a memory cell 6, a flip-flop about 20. The purpose of minimisation now becomes concrete: fewer literals mean fewer transistors, and hence less area, less energy and less delay.

## Slide 15: Switching takes time and energy

The output of a gate drives the inputs of other gates, which are small capacitors. To change level it must charge or discharge them through the resistance of its own transistors, which takes time, the *propagation delay*, and energy, at every transition. The dynamic power is approximately C times V^2 times f: capacitance, the square of the supply voltage, and the switching frequency. Reducing the voltage yields the largest saving, which is why internal supply voltages fell from 5 V to about 1 V. Speed is paid for in heat. The propagation delay reappears in Lecture 11 as the critical path and in Lecture 13 as the reason for the clock.

## Slide 16: Pull-up: an input that is never left floating

An input connected to nothing is *floating*: it picks up noise and reads 0 or 1 unpredictably. The remedy is a *pull-up* resistor that ties the pin to 3.3 V. With the button released no current flows, and the pin reads a clean 1. With the button pressed the switch connects the pin to ground: 0 V, a clean 0, while a negligible current of 73 microamperes flows through the resistor. The circuit is a voltage divider whose lower resistance is either infinite or zero. The firmware then inverts the bit, so that in the program "pressed" reads as 1. The warm-up is thereby explained completely.

## Slide 17: Check your understanding: An LED drops 2 V and must carry 5 mA from a 3.3 V pin. Which resistor is needed? / In a CMOS inverter with the input at 0:

For the first question, Ohm's law is applied to the resistor alone, not to the whole circuit. The resistor sees the supply minus what the LED retains, 3.3 - 2 V, and that voltage is divided by the current expressed in amperes: 5 mA is 0.005 A.

For the second, one asks which of the two transistors has its gate at the level that makes it conduct when the input is 0. A pMOS conducts with a low gate, and it is the one connected to the supply. The two transistors never conduct together, and the output is never left unconnected.

## Slide 18: Check your understanding: How many transistors does a two-input AND need in static CMOS? / Why does the button input of the kit need a pull-up resistor?

For the first question: an AND is not built directly in CMOS but as a NAND followed by an inverter, so the transistors of the two are added.

For the second, one considers the released button: the pin is then connected to nothing. What would it read? The pull-up is unrelated to the LED, to speed or to protection: it gives the input a defined level when the switch is open.

## Slide 19: Glossary: English and Italian

Fourteen terms. Two false friends deserve note: *voltage* is *tensione* in Italian, and *ground* is *massa*. A *capacitor* is a *condensatore*. *Gate*, *source* and *drain* are not translated. The *noise margin* is the *margine di rumore*, and a *floating input* is an *ingresso flottante*.

## Slide 20: Conclusions and reading

Five conclusions. Voltage drives, current flows, resistance opposes, and Ohm's law covers most of what a digital designer needs. A MOS transistor is a voltage-controlled switch, available in two complementary types. A bit is a range of voltages, made reliable by noise margins and by the regeneration of levels at every gate. CMOS gates are pairs of complementary switch networks, and the inverting gates are the cheapest. Switching costs time and energy. The next lecture builds functional machines from these gates.
