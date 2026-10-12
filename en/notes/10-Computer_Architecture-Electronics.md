# Lecture 10: Introduction to Electronics and Digital Electronics

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Introduction to Electronics and Digital Electronics

So far a gate has been a symbol and a truth table. This lecture gives it a body. It follows one bit, the bit of a button of the kit, from the finger that presses it to the register that your program reads, and along the way explains what a volt is, what a transistor does, and how two transistors make a NOT. No previous knowledge of physics is assumed. The quotation by Clarke is the feeling to dispel: a chip looks like magic only until you see what it is made of.

## Slide 2: What you will be able to do by the end

Six objectives. Use the four electrical quantities and Ohm's law on a simple circuit. Size the resistor of an LED and compute a voltage divider. Explain what a transistor is and how a MOS transistor works as a switch. Say how a voltage becomes a logic value, and what a noise margin is. Draw the inverter, the NAND and the NOR in CMOS and count their transistors. And explain pull-up resistors, floating inputs and why switching a gate takes time and energy.

## Slide 3: Warm-up on the machine

The warm-up is the test of a button that you know by heart, with one new piece of information in the comments: what the button is, physically, on the kit. Read the comments carefully: they contain an apparent contradiction.

## Slide 4: One button, one bit

In your program a pressed button is a 1. On the board the button LEFT is a switch between a pin of the chip, GPIO18, and ground. When it is pressed the pin is at 0 volts; when it is released the pin is at 3.3 volts. So pressed means 0 volts, and yet the program reads 1. The four callouts turn this into the questions of the lecture: what is a volt, why is the released pin at 3.3 V, and who decides that 0 V is a bit? The last section answers them.

## Slide 5: Electricity in four quantities

The first part is the minimum of electricity that a computer scientist needs: four quantities, one law, two ways of connecting components, and the component that explains why nothing is instantaneous.

## Slide 6: Four quantities

Four quantities, with the analogy of water in pipes. *Voltage* is the pressure that pushes; it is measured in volts and always between two points. *Current* is the flow, in amperes. *Resistance* is what hinders the flow, in ohms. *Power* is the work done each second, in watts. The last column ties each to the kit: 3.3 V of supply, about 10 mA through a lit LED, 45 kΩ inside each input pin. Remember the caption: when we say that a pin "is at 3.3 V", we mean with respect to ground, the common reference.

## Slide 7: Ohm's law, and the resistor of an LED

Ohm's law: the voltage across a resistor equals its resistance times the current through it. A circuit is a closed loop, and the drawing shows the simplest useful one: a supply, a resistor and an LED. The LED keeps about 2 V for itself; the resistor takes the remaining 1.3 V and thereby fixes the current. For 10 mA you need 1.3 divided by 0.010, that is 130 Ω, and the nearest standard value is 150 Ω. Without the resistor the current would be far too large and the LED would burn.

## Slide 8: Series, parallel and the voltage divider

Two ways of connecting resistors. In *series* the same current crosses both and the resistances add. In *parallel* the same voltage is across both and the total resistance is smaller than either. Two resistors in series form a *voltage divider*: the output, taken between them, is the supply multiplied by R2 over R1 plus R2. With equal resistors it is half the supply; if R2 is much smaller, the output is close to ground. Keep the divider in mind: it explains the button at the end of the lecture.

## Slide 9: Power and energy

Power is voltage times current, and in a resistor it becomes heat. Energy is power multiplied by time. For the LED of the previous slide the circuit takes 29 mW, of which 11 mW are heat in the resistor. The numbers are tiny, but the last line explains why they matter: every transistor that switches dissipates a little energy, and a processor has billions of them. Heat, not the number of transistors, is the limit of today's chips.

## Slide 10: The capacitor: why signals take time

A capacitor stores charge as a tank stores water, and its voltage cannot change instantly: it has to be filled or emptied through a resistance. The time needed is of the order of R times C. For an input pin of the kit, 45 kΩ times 2 pF is 90 nanoseconds. Every wire and every input of a transistor is a small capacitor, and this is where the delay of a gate comes from. A capacitor that is charged or empty is also a way of storing one bit: you will meet it again in the memory lecture.

## Slide 11: Semiconductors

The second part is about the material. A switch needs something that conducts or does not conduct on command, and silicon is the material that makes this possible.

## Slide 12: Conductors, insulators, semiconductors

Conductors let charge flow; insulators do not. Semiconductors lie in between, and their conduction can be controlled. The control is obtained by *doping*: adding a few atoms of another element. In n-type silicon there are extra electrons, negative carriers; in p-type silicon there are missing electrons, called holes, which behave as positive carriers. Where a p region meets an n region there is a *junction*. A chip is a slice of silicon with billions of such regions, connected by layers of metal.

## Slide 13: The diode and the LED

One junction makes a *diode*, a one-way valve: it conducts in one direction, once the voltage exceeds a threshold of about 0.7 V, and blocks in the other. A light-emitting diode, an LED, gives off light when it conducts; the colour depends on the material, and so does the threshold, which is why the LED of the earlier slide kept about 2 V. In a computer LEDs serve as indicators, as the backlight of displays and in optical links.

## Slide 14: The transistor: a switch with no moving parts

The history of the switch without moving parts, in six dates. The transistor of 1947 replaces the vacuum tube. The integrated circuit of 1958 puts several transistors on one piece of semiconductor. The MOS transistor of 1960 is small, simple to build and needs almost no control current. CMOS, in 1963, combines two complementary types so that power is drawn only when switching. In 1971 a whole processor fits on a chip with 2,300 transistors; today a chip holds tens of billions.

## Slide 15: The MOS transistor as a switch

A MOS transistor has three terminals: the *gate* controls whether current can pass between the other two, the *source* and the *drain*. There are two types, and the table says everything: an nMOS conducts when its gate is high; a pMOS conducts when its gate is low. They are complementary: what closes one opens the other. The gate is insulated, so it draws practically no current. One more fact will be needed shortly: an nMOS is good at connecting to ground, a pMOS at connecting to the supply.

## Slide 16: From volts to bits

Now electronics becomes digital. Four questions: when is a voltage a 1, why work with two levels at all, how transistors form gates, and what gates cost.

## Slide 17: Logic levels: when is a voltage a 1?

A digital circuit does not use exact voltages: it uses two ranges. The figure shows them for the kit. An output guarantees clean levels: above 2.64 V for a 1, below 0.33 V for a 0. An input is more tolerant: it reads 1 above 2.475 V and 0 below 0.825 V. The difference between what an output guarantees and what an input requires is the *noise margin*: a disturbance smaller than that cannot change the bit. Between the two input thresholds the value is undefined, and signals must cross that band quickly.

## Slide 18: Why digital?

Why give up the richness of analog signals? In an analog circuit the exact value is the information, so every stage adds a little noise, and the noise accumulates: each copy is worse than the previous one. In a digital circuit only the range matters, and every gate produces a fresh, clean level: noise does not accumulate, copies are perfect, and errors can even be detected and corrected. Analog circuits remain indispensable at the edges of a system, where it touches the world: sensors, radio, sound.

## Slide 19: The CMOS inverter: a NOT gate from two transistors

The first gate. One pMOS connects the output to the supply, one nMOS connects it to ground, and both gates are driven by the same input. With the input at 0 the pMOS conducts and the output is 1; with the input at 1 the nMOS conducts and the output is 0. It is a NOT. Exactly one of the two transistors conducts at any time, so no current flows from supply to ground when the input is still: this is why CMOS consumes almost nothing at rest.

## Slide 20: NAND and NOR in CMOS

Two inputs, four transistors. In the NAND the two nMOS are in series: the output reaches ground only if A and B are both 1. The two pMOS are in parallel: the output reaches the supply if either input is 0. Series is AND, parallel is OR. The NOR is the dual: series and parallel are exchanged, exactly as De Morgan's laws exchange AND and OR. Check both drawings yourself for the four combinations of the inputs, marking which transistors conduct.

## Slide 21: What gates cost, in transistors

The cost of circuits in transistors. A NOT costs 2, a NAND or a NOR 4, an AND or an OR 6, because they are a NAND or a NOR followed by an inverter. This reverses the intuition of the algebra: in CMOS the inverting gates come first, and an AND is more expensive than a NAND. A full adder needs about 28 transistors, a memory cell 6, a flip-flop about 20. Now the purpose of minimisation is concrete: fewer literals mean fewer transistors, less area, less energy and less time.

## Slide 22: Switching takes time and energy

The output of a gate drives the inputs of other gates, which are small capacitors. To change level it must charge or discharge them through the resistance of its own transistors, and this takes time: the *propagation delay*. It also takes energy, at every change of level. The power spent in switching is about C times V squared times f: the capacitance, the square of the supply voltage, and the frequency. Lowering the voltage saves the most, which is why chips moved from 5 V to about 1 V inside. Speed is paid for in heat.

## Slide 23: Scales of integration

How many transistors fit on one chip has grown through five scales. Small-scale integration: a few gates per chip, such as four NANDs in one package. Medium scale: hundreds of transistors, a decoder or a register. Large scale: thousands, the first microprocessors. Very large scale: hundreds of thousands and more. Today, tens of billions: a *system on a chip* such as the ESP32-C6 of the kit, which contains processor, memory, radio and peripherals in a few millimetres.

## Slide 24: Back to the machine

Everything is in place to explain the button of the warm-up, step by step, and to look at the kit as an electrical circuit.

## Slide 25: Pull-up: an input that is never left floating

An input connected to nothing is *floating*: it picks up noise and reads 0 or 1 at random. The remedy is a *pull-up* resistor that ties the pin to 3.3 V. With the button released no current flows, and the pin reads a clean 1. With the button pressed the switch joins the pin to ground: 0 V, a clean 0, and a negligible current of 73 microamperes flows through the resistor. It is a voltage divider whose lower resistor is either infinite or zero. The firmware then inverts the bit, so that in your program pressed is 1.

## Slide 26: From the finger to the bit

The whole journey in seven steps. The finger closes the switch; the pin falls to 0 V in less than a microsecond; the input buffer sees a voltage below its threshold, a logic 0; the level is captured in a flip-flop; the firmware reads it with a load instruction, inverts it and packs it with the others; your program tests it with `andi`. The right column says where each step is explained: three in this lecture, the others in lectures you have attended or will attend. Seven layers lie between a finger and a bit.

## Slide 27: The kit as a circuit

The kit seen as a circuit. A breadboard has holes joined in rows underneath, so components connect without soldering. Two long buses carry the supply, 3.3 V and ground, and a separate one carries 5 V for the audio amplifiers. Every part shares the same ground: without a common reference the voltages of two parts would mean nothing to each other. Buttons go from a pin to ground; the display and the amplifiers receive digital signals. Never connect a pin that is driven high directly to ground.

## Slide 28: Check your understanding: An LED drops 2 V and must carry 5 mA from a 3.3 V pin. Which resistor is needed?

Apply Ohm's law to the resistor, not to the whole circuit. The resistor sees the supply minus what the LED keeps: 3.3 minus 2. Divide that voltage by the current, in amperes: 5 mA is 0.005 A.

## Slide 29: Check your understanding: In a CMOS inverter with the input at 0:

With the input at 0, which of the two transistors has its gate at the level that makes it conduct? A pMOS conducts with a low gate, and it is the one connected to the supply. The two never conduct together, and the output is never left unconnected.

## Slide 30: Check your understanding: How many transistors does a two-input AND need in static CMOS?

An AND in CMOS is not built directly: it is a NAND followed by an inverter. Add the transistors of the two.

## Slide 31: Check your understanding: Why does the button input of the kit need a pull-up resistor?

Think of the released button: the pin is connected to nothing. What would it read? The pull-up has nothing to do with the LED, with speed or with protection: it gives the input a defined level when the switch is open.

## Slide 32: Exercises: paper first, then the kit

Five exercises. Size the resistor of a blue LED and compute the power it dissipates. Compute the output of a divider and say how an input of the kit would read it: compare it with the two thresholds. Draw a NAND with three inputs and count the transistors. Check the NOR on the drawing. And on the kit, with the lamps cartridge running, bridge a button pin to ground with a wire: explain what you see, and what would happen without the pull-up.

## Slide 33: Glossary: English and Italian

Fourteen terms. Note two false friends: *voltage* is in Italian *tensione*, and *ground* is *massa*. A *capacitor* is a *condensatore*. *Gate*, *source* and *drain* are not translated. The *noise margin* is the *margine di rumore*, and a *floating input* is an *ingresso flottante*.

## Slide 34: Conclusions and reading

Five conclusions. Voltage pushes, current flows, resistance hinders, and Ohm's law covers most of what a digital designer needs. A MOS transistor is a switch controlled by a voltage, in two complementary types. A bit is a range of voltages, made reliable by noise margins and by the regeneration of levels. CMOS gates are pairs of switch networks, and the inverting ones are the cheapest. Switching costs time and energy. The next lecture builds machines out of these gates.
