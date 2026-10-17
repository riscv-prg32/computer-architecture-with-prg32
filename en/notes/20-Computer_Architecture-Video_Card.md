# Lecture 20: Buses and the Video Card

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: the frame buffer; device controllers; buses and bandwidth; the video card; GPU and GPGPU. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) explain why devices sit behind controllers and how the processor talks to them; (2) compute the size of a frame buffer and the bandwidth of a video signal; (3) describe what a video card and a GPU do. Builds on: only what Lecture 01 set up. Next: Lecture 21, Input and Output.

Closing thread: Every rectangle drawn since Lecture 02 ended in a frame buffer that a controller sends to the screen many times a second. Next: the other devices: displays, keyboards, printers.

## Slide 1: Buses and the Video Card

With this lecture the course leaves the processor and turns to its surroundings. The subject is the path of an image, from a number in memory to a point of light on the screen. Along the way two general ideas are encountered, the peripheral controller and the bus, together with one specific machine, the video card and its processor, the GPU. The kit has no video card at all, and for teaching purposes this is an advantage: every step that a card would conceal is performed by code that can be read, and its cost measured.

## Slide 2: What you will be able to do by the end

Five learning outcomes. Explaining what a peripheral controller is and why devices must be synchronised with the processor. Characterising a bus by its width, speed and transfer rate. Describing the function of a video card: frame buffer, resolution, colour depth and output interface. Computing the memory a frame requires and the time needed to send it across a bus. And explaining what a GPU does and what it means to use it for general-purpose computation.

## Slide 3: Input/output devices

Peripherals serve the interaction between the user and the system. They enjoy limited autonomy, being controlled and coordinated by the processor. And they operate *asynchronously*, at their own pace, so synchronisation mechanisms are required: to know when an input datum is available, and when an output device has completed its task. The terminal, the most common instrument of interaction, consists in fact of two independent devices, a keyboard and a display; it is the processor that copies to the display what arrives from the keyboard.

## Slide 4: Controllers

A peripheral is never connected directly to the processor: a *controller* is interposed. In the diagram, processor and memory sit on the bus, and so do the controllers, each with its device on the far side. The controller manages the dialogue with the device and presents a few registers on the bus, which the processor reads and writes as memory, by the memory-mapped I/O of Lecture 15. When an operation completes, the controller typically raises an interrupt, as in the previous lecture. The video card is the controller of the monitor.

## Slide 5: What characterises a bus

A bus is a communication channel shared by several units, and its characteristics determine the performance of the whole system. Its *width* is the number of bits of the data bus; its *speed* is the frequency at which it operates; their product is the *transfer rate*. A 32-bit bus at 66 MHz carries 4 bytes 66 million times per second, 264 megabytes per second. A bus is also a standard: signals, connectors and a protocol on which all the attached units agree.

## Slide 6: Buses: advantages and disadvantages

The merits and costs of buses. The advantages: new devices are added easily; a peripheral can be moved to another computer with the same bus; one set of wires connects many peripherals; the cost per byte transferred is low. The disadvantages: the bandwidth of the bus bounds the transfer speed; the maximum speed decreases as the bus grows longer and as more devices are attached; and, being shared, the bus carries only one transfer at a time, the limitation already observed for the common bus of Lecture 14.

## Slide 7: Buses through the years

Forty years of buses in one table, best read by columns. The early buses, ISA, PCI, AGP for the video card alone, IDE and SCSI for disks, were parallel, with many wires side by side. Their successors, PCI Express, Serial ATA and USB, are serial: few wires, far higher speeds. This is the trend stated in Lecture 14, now documented historically. The last row is the kit: SPI, I2C and I2S are the small serial buses that connect chips on the same board.

## Slide 8: What a video card does

The function of a video card is to supply the monitor with the information to be displayed. It translates the representation of the image produced by the processor into a form the monitor can render. It has a memory of its own, the *video memory*, which holds the frame, the frame buffer. At every refresh of the screen the card reads that memory and emits the signal encoding the colour of each pixel. It also has its own processing capability, which the last part of the lecture examines.

## Slide 9: Analogue and digital monitors

Two generations of monitor. A cathode-ray monitor has an analogue input: the card must convert the digital image into analogue signals with a component called the RAMDAC, and noise and distortion enter along the cable. A liquid-crystal monitor has a digital input: the card adapts colours and resolution, and each output pixel corresponds exactly to one pixel of the panel. The conversion to analogue, and its defects, disappear, an instance of the advantage of digital representation argued in Lecture 10.

## Slide 10: Video outputs

The outputs, in chronological order. VGA, analogue, for cathode-ray monitors. DVI, the first digital output, which arrived with LCD monitors. HDMI, digital, which also carries audio. DisplayPort, digital, which can also travel over USB-C connectors. The last row is the kit: the display is reached over an SPI bus, and the chip on the display module, an ILI9341, plays the role of the monitor electronics for a panel of 320 by 240 pixels, with its own memory for the frame.

## Slide 11: Resolution: the size of the pixel grid

*Resolution* is the size of the pixel grid, columns by rows. The table ranges from 320 by 200, 64,000 pixels, the resolution of the Commodore 64 and of the PRG32 viewport, to 4K, with more than eight million. The third column gives the aspect ratio, where the traditional 4:3 has given way to 16:9. Resolution determines the definition of the image, and also the number of pixels that must be stored and transmitted for each frame.

## Slide 12: Colour depth: bits per pixel

*Colour depth* is the number of bits per pixel. With 4 bits there are 16 colours; with 8 bits, 256, each value usually an index into a colour table, the *palette*; with 16 bits, 65,536, in the familiar RGB565 format; with 24 bits, more than sixteen million, with 256 levels for each primary. The memory required by a frame is the number of pixels times the bytes per pixel. PRG32 combines the two middle rows: an 8-bit frame buffer of indices and a palette of 256 RGB565 colours, trading colour freedom for memory.

## Slide 13: Following the pixel on PRG32

The path of a pixel on the kit, in five stages: the program, the frame buffer in RAM, the palette that maps an index to a colour, the SPI bus, the display. The table carries out the arithmetic. One frame at one byte per pixel occupies 64,000 bytes; at two bytes it would consume a quarter of the chip's RAM. On the bus each pixel travels as 16 bits, about a million bits per frame, or 38 milliseconds at 27 MHz. Two engineering responses follow: an indexed frame buffer, and transmitting only what has changed, which Verm1 Part 4 implements.

## Slide 14: Memory and bandwidth: the pressure on video hardware

The same arithmetic at the scale of a PC explains the history of video hardware. Higher definition requires more memory per frame, and the stream of data towards the card threatens to saturate the bus. The two responses were more memory on the card itself and a wider or dedicated bus: AGP first, PCI Express today. The figure on the right conveys the scale: a 4K screen at 60 frames per second amounts to about one and a half gigabytes of pixels every second.

## Slide 15: The graphics processing unit

As graphical interfaces spread, computing images consumed a growing share of processor time. To relieve the CPU, video cards acquired dedicated processors, *graphics processing units*, which accelerate raster operations, such as copying blocks of pixels, and 3D graphics: transformations, textures, lighting. Programs reach them through libraries, and a *device driver* adapts the software to the primitives of each GPU. The kit has no GPU: a rectangle is a loop of stores executed by the RISC-V core, and its cost is directly observable.

## Slide 16: General-purpose computing on GPUs

A GPU applies the same operation in parallel to whole matrices of pixels, and nothing requires those numbers to be pixels: *GPGPU* is the use of graphics processors for general computation. A GPU contains a very large number of simple cores and is programmed with models such as CUDA and OpenCL. Scientific simulation, data analysis and, above all today, the training and inference of neural networks run on GPUs. The picture recalls the parallel sum of Lecture 04: one operation applied to many data at once. Lecture 24 returns to this model of computation.

## Slide 17: Check your understanding: How much memory does a frame of 640 x 480 pixels need in True Color (24 bits)? / A 16-bit bus works at 50 MHz, one transfer per cycle. What is its transfer rate?

For the first question: the memory required by a frame is the number of pixels times the bytes per pixel. The pixels are computed first, then one recalls how many bytes 24 bits represent.

For the second: the transfer rate is width times frequency, with the width converted to bytes before multiplying.

## Slide 18: Check your understanding: In an 8-bit indexed frame buffer, the byte of a pixel contains: / What is GPGPU?

For the first question "indexed" is the key word: the byte does not describe the colour but indicates where to find it.

For the second, the acronym is expanded: its first two letters stand for "general-purpose".

## Slide 19: Glossary: English and Italian

Ten terms. A *peripheral* is a *periferica*; its *controller* retains the English name. *Bus width* and *transfer rate* are *larghezza del bus* and *velocità di trasferimento*. *Colour depth* is *profondità di colore*. A *palette* is a *tavolozza*, though programmers say palette. A *device driver* is the software that adapts programs to a specific device.

## Slide 20: Conclusions and reading

Five conclusions. Input/output devices are a fundamental part of a computer. Each is managed by a controller that interfaces it to the bus. A bus is characterised by width, speed and transfer rate, and its bandwidth is a constraint that designs must respect. A video card displays graphics and text through a frame buffer, a resolution, a colour depth and an output interface. And its processors, the GPUs, are today used for high-performance computing. The next lecture covers the other input and output devices.
