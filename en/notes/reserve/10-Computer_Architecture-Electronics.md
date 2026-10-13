# Lecture 10: Introduction to Electronics and Digital Electronics

*Notes of the slides of the specification that are in neither deck (decks/plan.js, drop): their content is in the textbook.*

## Power and energy

Power is voltage times current, and in a resistor it becomes heat. Energy is power multiplied by time. For the LED of the previous slide the circuit takes 29 mW, of which 11 mW are heat in the resistor. The numbers are tiny, but the last line explains why they matter: every transistor that switches dissipates a little energy, and a processor has billions of them. Heat, not the number of transistors, is the limit of today's chips.

## The diode and the LED

One junction makes a *diode*, a one-way valve: it conducts in one direction, once the voltage exceeds a threshold of about 0.7 V, and blocks in the other. A light-emitting diode, an LED, gives off light when it conducts; the colour depends on the material, and so does the threshold, which is why the LED of the earlier slide kept about 2 V. In a computer LEDs serve as indicators, as the backlight of displays and in optical links.

## Scales of integration

How many transistors fit on one chip has grown through five scales. Small-scale integration: a few gates per chip, such as four NANDs in one package. Medium scale: hundreds of transistors, a decoder or a register. Large scale: thousands, the first microprocessors. Very large scale: hundreds of thousands and more. Today, tens of billions: a *system on a chip* such as the ESP32-C6 of the kit, which contains processor, memory, radio and peripherals in a few millimetres.
