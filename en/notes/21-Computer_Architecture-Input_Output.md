# Lecture 21: Input and Output

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: polling, interrupts, DMA; CRT and LCD displays; keyboard and mouse; printers. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) describe how displays, keyboards and printers work; (2) compare polling with interrupts for reading a device. Builds on: only what Lecture 01 set up. Next: Lecture 22, Verm1, Part 4: The Finished Game.

Closing thread: Reading the joystick once per frame is polling: simple, and blind between two reads. Next: the finished game.

## Slide 1: Input and Output

This lecture concerns the boundary between the machine and the world: the devices through which information enters and leaves. It shows how an image is formed on a screen, what happens between a key and the processor, what a mouse communicates, and how a laser printer works. The unifying thread is that each of these devices is internally composed of machines already designed in this course, encoders, counters, shift registers and controllers. The lecture begins and ends on the kit, with the device used since the first laboratory session: a button.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Describing how an image is formed on a cathode-ray tube and on a liquid-crystal display, and what an active matrix adds. Explaining the path of a key press: matrix, encoder, shift register, serial interface. Stating what a mouse sends to the computer and how often. Describing the stages of laser printing. And explaining how the kit reads its joystick, comparing three techniques: polling, interrupts and direct memory access.

## Slide 3: The video: an introduction

A graphical display is a matrix of points, the *pixels*, each lit at its own intensity; an image is composed by turning pixels on and off. The earliest displays showed only characters, in black and white. The density of the pixels determines the resolution, and the bits per pixel the number of colours, from 256 to sixteen million and beyond. The size of a display is the length of its diagonal, in inches. The display of the kit measures 2.8 inches, with 320 by 240 pixels.

## Slide 4: The cathode-ray tube: a short history

The cathode-ray tube has a history of more than a century. It began as a laboratory instrument with Crookes in the 1870s; Braun turned it into an oscilloscope in 1897, its first practical application; Rosing in 1907 used it to display shapes from a received signal, the origin of television; and in 1934 the first television receiver with a CRT reached the market. From the 1970s to the 1990s it was the display of every terminal and personal computer.

## Slide 5: How a CRT works

The operation of a CRT. A cathode, heated to incandescence, emits electrons. A high voltage between cathode and anode accelerates them into a beam, which further fields focus. Magnetic or electric fields deflect the beam, which strikes a point of the screen; the inner surface is coated with phosphor, and the point emits light. By sweeping the beam line by line, many times per second, the whole image is painted before the eye perceives that the first points have faded, a reliance on the persistence of vision.

## Slide 6: Liquid crystal displays

Liquid-crystal displays have replaced the tube almost everywhere, offering a better image, less bulk, weight and power consumption, and less eye strain. Liquid crystals are organic molecules that flow like a liquid yet retain an ordered structure. An electric field alters their orientation, and with it the way they rotate the polarisation of the light passing through them. The image on the last line is apt: a crystal is a valve for light, opened and closed by a voltage.

## Slide 7: Inside an LCD panel

A panel contains many cells, each with its contacts, placed between two polarising filters with perpendicular axes, with a light source behind. When the crystals of a cell are not driven they rotate the light, which then passes the front filter; when they are driven the light is blocked. In a colour screen each cell is subdivided into three, with red, green and blue filters: these are the sub-pixels visible in the photograph, and the three fields of an RGB colour, from Lecture 04, end up there as three voltages.

## Slide 8: Driving the cells: from segments to the active matrix

How are millions of cells driven? A calculator has one contact per segment, an approach impossible at the scale of a screen. A *passive matrix* has contacts per row and per column: only one pixel at a time is driven, and the others must retain their state unaided, which they do poorly, producing trails and crosstalk. An *active matrix* places a transistor in every cell, in a thin film on the glass, and the transistor holds the state of its pixel while the others are updated. This is TFT, the technology of the display of the kit; the transistor acts as a one-pixel memory, an idea recognisable from Lecture 13.

## Slide 9: The keyboard

The keyboard derives from that of the typewriter and is the principal device for entering characters. Its keys are grouped into alphanumeric keys, special keys, arrows and function keys. One fact, already met in the previous lecture, deserves repetition: keyboard and display are not connected to each other. When a typed letter appears on the screen, it is because a program has read a code from the keyboard and drawn a character. Today keyboards are connected by USB or by radio.

## Slide 10: The path of a key press

The path of a key press, from left to right. The keys are switches arranged in rows and columns, so that pressing D closes one crossing. An *encoder* converts the combination of row and column into an n-bit code. A *shift register* converts those n parallel bits into n serial bits. A *serial interface*, for instance a USB controller, delivers the code to the system bus and raises an interrupt. The encoder is that of Lecture 11 and the shift register that of Lecture 14: every block on this slide has already been designed in the course.

## Slide 11: The mouse

The mouse was invented in the 1960s by Douglas Engelbart: a wooden box with two wheels underneath and a cable emerging from the back, like a tail. The two wheels measured movement along the two axes. In the mechanical mouse a ball turns two rollers, each connected to a counter. In the optical mouse a light source and a tiny camera observe the surface beneath and measure its displacement. In every case movement is converted into two numbers.

## Slide 12: What a mouse sends

What a mouse transmits. Each time it moves by a minimum distance, about a hundredth of an inch, it sends three bytes: the displacement along x since the last report, the displacement along y, and the state of the buttons. It sends displacements, not positions: the program maintains the position of the pointer by accumulating them. Internally, as shown on the right, there are two counters, a shift register and a serial interface. The software that communicates with the device is its device driver.

## Slide 13: The printer

A printer is characterised by its speed, in lines or pages per minute, and by its resolution, in dots per inch. The technologies, in historical order: daisy-wheel and chain printers, which struck whole characters and are now obsolete; dot-matrix printers, in which needles strike an inked ribbon; ink-jet printers, which project tiny droplets; and laser printers. A printer is itself a small computer, with its own processor, memory and firmware.

## Slide 14: The laser printer

The laser printer derives from the photocopier. A drum is charged to about a thousand volts. A laser beam, deflected by a rotating mirror, scans the drum along its length, switched on and off to draw one line of points, and the points it strikes lose their charge. The toner is attracted by the points that remain charged. The drum is pressed against the paper and transfers the toner, which heated rollers then fuse. The page exists first as a bitmap in the printer's memory, so printing is, at bottom, another frame buffer read out line by line.

## Slide 15: The devices of the PRG32 kit

The devices of the kit in a table: for each, the direction, the connection and the functions through which a cartridge uses it. The joystick and buttons are inputs, one switch per pin. The display is an output on an SPI bus. The amplifier with its speaker is an output on an I2S bus. The Wi-Fi radio and the USB port operate in both directions. None of these connections has ever been touched directly by a cartridge: the runtime manages them and offers functions, an abstraction whose value this lecture makes clear.

## Slide 16: Three ways to deal with a device

Three ways of dealing with a device. *Polling*: the program repeatedly asks the device whether it has something; simple, and wasteful when nothing happens. *Interrupts*: the device requests attention when it needs it, as in Lecture 19. *Direct memory access*: the device exchanges whole blocks of data with memory by itself, and the processor is notified only on completion. All three are at work on the kit: the joystick is polled, the timer interrupts, and the display and the sound are fed by DMA. The choice among them balances simplicity, responsiveness and processor time.

## Slide 17: Check your understanding: What does the encoder of a keyboard controller do? / In a colour LCD, a pixel is made of:

For the first question one considers the diagram of the key press: what enters the encoder, and what leaves it?

For the second, one recalls the photograph of the pixels under magnification and counts how many coloured elements form one pixel.

## Slide 18: Check your understanding: Why does a passive-matrix LCD show trails behind moving objects? / A PRG32 game reads the joystick once per frame. This technique is called:

For the first question the answer lies in what a passive matrix lacks: an element in each cell that retains its state while the others are driven.

For the second, the question is who takes the initiative, the program or the device. In the warm-up it is the program, once per frame.

## Slide 19: Glossary: English and Italian

Ten terms. A *cathode-ray tube* is a *tubo a raggi catodici*; the *backlight* is the *retroilluminazione*. A *pointing device* is any device, such as the mouse, that indicates a position. *Dot-matrix* and *ink-jet* printers are *ad aghi* and *a getto d'inchiostro*. *Polling* is *interrogazione ciclica*, though the English term prevails in practice.

## Slide 20: Conclusions and reading

Five conclusions. Input/output devices are a fundamental part of computers. Display technology has progressed from an electron beam to a transistor behind every pixel. Keyboard, mouse and printer have changed little externally, and internally consist of encoders, counters and shift registers. A device reaches the processor through a controller and a bus, and is serviced by polling, interrupts or DMA. And on the kit the entire chain, from a switch to a pixel, can be followed instruction by instruction. The last part of Verm1 follows.
