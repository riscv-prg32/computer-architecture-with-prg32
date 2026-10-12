# Lecture 21: Input and Output

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Input and Output

This lecture is about the border between the machine and the world: the devices through which information enters and leaves. You will see how a picture is formed on a screen, what happens between a key and the processor, what a mouse says, how a laser printer works. The thread that ties them together is that each of these devices, inside, is made of machines you have already designed. And the lecture begins and ends on the kit, with the device you have used since the first laboratory: a button.

## Slide 2: What you will be able to do by the end

Five objectives. Describe how a picture is formed on a cathode-ray tube and on a liquid crystal display, and what an active matrix adds. Explain the path of a key press: matrix, encoder, shift register, serial interface. Say what a mouse sends to the computer and how often. Describe the stages of laser printing. Explain how the kit reads its joystick, and compare three techniques: polling, interrupts and direct memory access.

## Slide 3: Warm-up on the machine

The warm-up asks a simple question about something you do in every game: what is behind a button?

## Slide 4: Read the world, once per frame

A function that reads the input once per frame. `prg32_input_read` returns in `a0` a word with one bit per button; the code copies it into `s0`, a saved register, because the word must survive the call that plays a note. Then each button is tested with `andi` and a mask: 0x10 for A, 0x01 for LEFT. Behind each bit there is a switch on an input pin of the chip. The program asks, once per frame, and this way of proceeding has a name: polling. The other devices are less simple.

## Slide 5: Displays

The first group of devices: displays, from the cathode-ray tube to liquid crystals.

## Slide 6: The video: an introduction

A graphical display is a matrix of points, the *pixels*, each lit with its own intensity; an image is composed by switching pixels on and off. The first displays showed only characters, in black and white. The density of the pixels gives the resolution, the bits per pixel give the number of colours, from 256 to sixteen million and more. The size is the length of the diagonal, in inches. The display of the kit measures 2.8 inches, with 320 by 240 pixels.

## Slide 7: The cathode-ray tube: a short history

The cathode-ray tube has a history of more than a century. It was born as a laboratory instrument with Crookes, in the 1870s; Braun made it an oscilloscope in 1897, its first practical use; Rosing in 1907 used it to display shapes from a received signal, the root of television; in 1934 the first television set with a CRT reached the market. From the 1970s to the 1990s it was the display of every terminal and personal computer.

## Slide 8: How a CRT works

How a CRT works. A cathode, heated to incandescence, emits electrons. A high voltage between cathode and anode accelerates them into a beam, which other fields focus. Magnetic or electric fields deflect the beam, which strikes a point of the screen: the inner surface is coated with phosphor, and the point lights up. By sweeping the beam line by line, many times per second, the whole picture is painted before the eye notices that the first points have faded.

## Slide 9: Liquid crystal displays

Liquid crystal displays have replaced the tube almost everywhere: better picture, less bulk, weight and power, less strain for the eyes. Liquid crystals are organic molecules that flow like a liquid but keep an ordered structure. An electric field changes their orientation, and with it the way they rotate the polarisation of the light that crosses them. The useful image is the last line of the slide: a crystal is a valve for light, opened and closed by a voltage.

## Slide 10: Inside an LCD panel

Inside a panel there are many cells, each with its contacts, placed between two polarising filters with perpendicular axes, and a light behind. When the crystals of a cell are not driven they rotate the light, which then passes the front filter; when they are driven the light is blocked. In a colour screen each cell is divided in three, with a red, a green and a blue filter: these are the sub-pixels in the photograph, and the three fields of an RGB colour end up there as three voltages.

## Slide 11: Driving the cells: from segments to the active matrix

How are millions of cells driven? A calculator has one contact per segment, which is impossible for a screen. A *passive matrix* has contacts per row and per column: only one pixel at a time is driven, and the others must remember their state by themselves, which they do badly; hence trails and crosstalk. An *active matrix* puts a transistor in every cell, in a thin film on the glass: the transistor keeps the state of its pixel while the others are updated. This is TFT, the technology of the display of the kit.

## Slide 12: Keyboard and mouse

The second group: the two input devices of every desk, the keyboard and the mouse.

## Slide 13: The keyboard

The keyboard derives from that of the typewriter and is the main device for entering characters. Its keys are grouped: alphanumeric, special, arrows and functions. Remember one fact, already met in the previous lecture: the keyboard and the video are not connected to each other. When a letter you type appears on the screen, it is because a program read a code from the keyboard and drew a character. Today keyboards are connected by USB or by radio.

## Slide 14: The path of a key press

The path of a key press, from left to right. The keys are switches arranged in rows and columns: pressing D closes one crossing. An *encoder* turns the combination of row and column into a code of n bits. A *shift register* turns those n bits in parallel into n bits in series. A *serial interface*, for example a USB controller, delivers the code to the system bus and raises an interrupt. The encoder is that of Lecture 11, the shift register that of Lecture 14: you have designed every block of this slide.

## Slide 15: The mouse

The mouse was invented in the 1960s by Douglas Engelbart: a wooden box with two wheels underneath and a wire coming out of the back, like a tail. The two wheels measured the movement along the two axes. In the mechanical mouse a ball turns two rollers, each connected to a counter. In the optical mouse a light and a tiny camera observe the surface below and measure how it moves. In all three, movement becomes two numbers.

## Slide 16: What a mouse sends

What a mouse sends. Each time it moves by a minimum distance, about a hundredth of an inch, it sends three bytes: the movement along x since the last report, the movement along y, and the state of the buttons. Note that it sends movements, not positions: it is the program that keeps the position of the pointer, by adding. Inside, as on the right: two counters, a shift register, a serial interface. The software that talks to the device is its device driver.

## Slide 17: Printers

The third group: the classic output device on paper.

## Slide 18: The printer

A printer is described by its speed, in lines or pages per minute, and by its resolution, in dots per inch. The technologies, in historical order: daisy wheel and chain printers, which struck whole characters and are disused; dot matrix, in which needles strike an inked ribbon; ink jet, with tiny drops of ink; laser. A printer is also a small computer, with its own processor, memory and firmware.

## Slide 19: The laser printer

The laser printer derives from the photocopier. A drum is charged to about a thousand volts. A laser beam, reflected by a rotating mirror, scans the drum along its length, switched on and off to draw one line of points; the points it strikes lose their charge. The toner is attracted by the points still charged. The drum is pressed against the paper and transfers the toner, which heated rollers fix. Follow the path of the paper in the figure. The page exists first as a bitmap in the printer's memory.

## Slide 20: Back to the machine

Back to the kit: its devices, and the three general techniques with which a processor deals with any device.

## Slide 21: The devices of the PRG32 kit

The devices of the kit in a table: for each, the direction, the connection and the functions with which a cartridge uses it. The joystick and the buttons are inputs, one switch per pin. The display is an output on an SPI bus. The amplifier with its speaker is an output on an I2S bus. The Wi-Fi radio and the USB port work in both directions. Notice that you have never touched any of these connections directly: the runtime does it, and offers you functions.

## Slide 22: Three ways to deal with a device

Three ways to deal with a device. *Polling*: the program asks the device, again and again, whether it has something; simple, and wasteful when nothing happens. *Interrupts*: the device asks for attention when it needs it, as in Lecture 19. *Direct memory access*: the device exchanges whole blocks of data with the memory by itself, and the processor is only told when it has finished. On the kit all three are at work: you poll the joystick, the timer interrupts, the display and the sound are fed by DMA.

## Slide 23: Check your understanding: What does the encoder of a keyboard controller do?

Think of the diagram of the key press: what goes into the encoder, and what comes out?

## Slide 24: Check your understanding: In a colour LCD, a pixel is made of:

Recall the photograph of the pixels under the magnifier: how many coloured elements make up one pixel?

## Slide 25: Check your understanding: Why does a passive-matrix LCD show trails behind moving objects?

The answer is in what a passive matrix lacks: something in each cell that keeps its state while the others are being driven.

## Slide 26: Check your understanding: A PRG32 game reads the joystick once per frame. This technique is called:

Who takes the initiative, the program or the device? In the warm-up it is the program, once per frame.

## Slide 27: Exercises: paper first, then PRG32

Five exercises. How many bits does the code of a keyboard with 104 keys need, and what matrix could it have? How much memory does a printer need for the bitmap of a page at 600 dots per inch? Move a pointer on the screen with the joystick, keeping it inside the screen. Make button A act only once per press, by detecting the edge. And draw a score with seven-segment digits, using the table of Lecture 11.

## Slide 28: Glossary: English and Italian

Ten terms. A *cathode-ray tube* is a *tubo a raggi catodici*; the *backlight* is the *retroilluminazione*. A *pointing device* is any device, like the mouse, that indicates a position. *Dot-matrix* and *ink-jet* printers are *ad aghi* and *a getto d'inchiostro*. *Polling* is *interrogazione ciclica*, though the English word is the one in use.

## Slide 29: Conclusions and reading

Five conclusions. Input/output devices are a fundamental part of computers. Display technology has gone from an electron beam to a transistor behind every pixel. Keyboard, mouse and printer have changed little outside, and inside are made of encoders, counters and shift registers. A device reaches the processor through a controller and a bus, and is handled by polling, interrupts or DMA. And on the kit the whole chain, from a switch to a pixel, can be followed instruction by instruction. Next comes the last part of Verm1.
