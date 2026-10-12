# Lecture 20: Buses and the Video Card

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Buses and the Video Card

With this lecture the course leaves the processor and turns to what surrounds it. The subject is the path of an image: from a number in memory to a point of light on the screen. On the way you meet two general ideas, the controller of a peripheral and the bus, and one specific machine, the video card, with its processor, the GPU. The kit has no video card at all, and this is an advantage: every step that a card would hide is done by code you can read.

## Slide 2: What you will be able to do by the end

Five objectives. Explain what a peripheral controller is and why devices must be synchronised with the processor. Characterise a bus by its width, speed and transfer rate. Describe the job of a video card: frame buffer, resolution, colour depth and output interface. Compute how much memory a frame needs and how long it takes to send it along a bus. And explain what a GPU does and what it means to use it for general computation.

## Slide 3: Warm-up on the machine

The warm-up follows a single pixel, from the call that draws it to the place where it is stored.

## Slide 4: One pixel, please

The first four lines are yours: x in `a0`, y in `a1`, a colour in `a2`, and a call to `prg32_gfx_pixel`. The second half shows, in principle, what the runtime does with them: it multiplies y by 320, adds x, adds the address of the frame buffer, and stores one byte there. The screen is an array in memory with one element per pixel, and drawing a pixel is a store. Nothing appears until the frame is sent to the display. On a PC, keeping the frame and sending it are the job of the video card.

## Slide 5: Peripherals and controllers

Before the video card, the general case: how any peripheral is connected to the processor.

## Slide 6: Input/output devices

Peripherals serve the interaction between the user and the system. They have limited autonomy: the processor controls and coordinates them. And they work *asynchronously*, at their own pace, so mechanisms of synchronisation are needed: to know when an input datum is available, and when an output device has finished. The terminal, the most common instrument of interaction, is really two independent devices, a keyboard and a video; it is the processor that copies to the video what arrives from the keyboard.

## Slide 7: Controllers

A peripheral is never connected to the processor directly: between them is a *controller*. Look at the diagram: the processor and the memory are on the bus, and so are the controllers; each controller has its device on the other side. The controller manages the dialogue with the device and presents a few registers on the bus, which the processor reads and writes like memory. When an operation ends it usually raises an interrupt, as in the previous lecture. The video card is the controller of the monitor.

## Slide 8: Buses

All the units of the diagram share the same road. The next slides say what a bus is, how it is measured and why it becomes a bottleneck.

## Slide 9: What characterises a bus

A bus is a communication channel shared by several units, and its characteristics decide the performance of the whole system. Its *width* is the number of bits of the data bus. Its *speed* is the frequency at which it works. Their product is the *transfer rate*: a 32-bit bus at 66 MHz carries 4 bytes 66 million times per second, 264 megabytes per second. A bus is also a standard: signals, connectors and a protocol on which all the units agree.

## Slide 10: Buses: advantages and disadvantages

Why buses, and what they cost. The advantages: new devices are added easily; a peripheral can move to another computer with the same bus; one set of wires connects many peripherals; the cost per byte is low. The disadvantages: the bandwidth of the bus limits the transfer speed; the maximum speed falls as the bus gets longer and as more devices are attached; and, being shared, the bus carries only one transfer at a time.

## Slide 11: Buses through the years

Forty years of buses in one table. Read it by columns. The early buses, ISA, PCI, AGP for the video card alone, IDE and SCSI for disks, were parallel: many wires side by side. Their successors, PCI Express, Serial ATA, USB, are serial: few wires, much faster. It is the lesson of Lecture 14. The last row is the kit: SPI, I2C and I2S are the small serial buses that connect chips on the same board.

## Slide 12: The video card

Now the video card itself: what it does, how it is connected to the monitor, and the two numbers that describe an image, resolution and colour depth.

## Slide 13: What a video card does

The function of a video card is to send the monitor the information to display. It translates the representation of the image that the processor produces into a form the monitor can show. It has memory of its own, the *video memory*, which holds the frame: the frame buffer. Every time the screen is redrawn, the card reads that memory and sends the signal for the colour of each pixel. And it has its own processing capability, which the last part of the lecture examines.

## Slide 14: Analogue and digital monitors

Two generations of monitors. A cathode-ray monitor has an analogue input: the card must convert the digital image into analogue signals with a component called RAMDAC, and noise and distortion enter along the cable. A liquid-crystal monitor has a digital input: the card adapts colours and resolution, and each pixel of the output corresponds exactly to one pixel of the screen. The conversion to analogue, and its defects, disappear.

## Slide 15: Video outputs

The outputs, in order of time. VGA, analogue, for cathode-ray monitors. DVI, the first digital output, which arrived with LCD monitors. HDMI, digital, which also carries audio. DisplayPort, digital, which also travels on USB-C connectors. The last row is the kit: the display is reached over an SPI bus, and the chip on the display module, an ILI9341, plays the part of the monitor's electronics for a panel of 320 by 240 pixels.

## Slide 16: Resolution: the size of the pixel grid

*Resolution* is the size of the grid of pixels, columns by rows. The table goes from 320 by 200, 64,000 pixels, the resolution of the Commodore 64 and of the PRG32 viewport, to 4K with more than eight million. The third column is the aspect ratio: the traditional 4:3 has given way to 16:9. Resolution determines the definition of the image, and also how many pixels must be stored and sent for every frame.

## Slide 17: Colour depth: bits per pixel

*Colour depth* is the number of bits per pixel. With 4 bits there are 16 colours; with 8 bits, 256, and each value is usually an index into a table of colours, the *palette*; with 16 bits, 65,536, in the RGB565 format you know; with 24 bits, more than sixteen million, 256 shades for each primary. Memory for a frame is pixels times bytes per pixel. PRG32 uses the two middle rows together: an 8-bit frame buffer of indices and a palette of 256 RGB565 colours.

## Slide 18: Following the pixel on PRG32

The path of the pixel on the kit, in five boxes: your code, the frame buffer in RAM, the palette that turns an index into a colour, the SPI bus, the display. The table does the arithmetic. One frame at one byte per pixel is 64,000 bytes; at two bytes it would be a quarter of the chip's RAM. On the bus each pixel travels as 16 bits: about a million bits per frame, 38 milliseconds at 27 MHz. Hence the two engineering answers: an indexed frame buffer, and sending only what changed.

## Slide 19: Memory and bandwidth: the pressure on video hardware

The same arithmetic, at the scale of a PC, explains the history of video hardware. More definition means more memory for each frame, and the flow of data towards the card risks saturating the bus. The two answers were more memory on the card itself, and a wider or dedicated bus: AGP first, PCI Express today. The figure on the right gives the scale: a 4K screen at 60 frames per second is about one and a half gigabytes of pixels every second.

## Slide 20: GPU and GPGPU

The last part: the processor on the video card, built for pixels and now used for much more.

## Slide 21: The graphics processing unit

As graphical interfaces spread, computing images took a growing share of processor time. To relieve the CPU, video cards received dedicated processors: *graphics processing units*. They accelerate raster operations, such as copying blocks of pixels, and 3D graphics: transformations, textures, lighting. Programs reach them through libraries, and a *device driver* adapts the software to the primitives of each GPU. On the kit there is no GPU: a rectangle is a loop of stores executed by the RISC-V core, and you can see its cost.

## Slide 22: General-purpose computing on GPUs

A GPU applies the same operation, in parallel, to whole matrices of pixels. Nothing obliges those numbers to be pixels: *GPGPU* is the use of graphics processors for general computation. A GPU has a very large number of simple cores, and is programmed with models such as CUDA and OpenCL. Scientific simulation, data analysis and, above all today, the training and use of neural networks run on GPUs. The picture recalls the parallel sum of Lecture 04: the same operation on many data at once.

## Slide 23: Check your understanding: How much memory does a frame of 640 x 480 pixels need in True Color (24 bits)?

Memory for a frame is the number of pixels times the bytes per pixel. First compute the pixels, then remember how many bytes 24 bits are.

## Slide 24: Check your understanding: A 16-bit bus works at 50 MHz, one transfer per cycle. What is its transfer rate?

Transfer rate is width times frequency. Convert the width into bytes before multiplying.

## Slide 25: Check your understanding: In an 8-bit indexed frame buffer, the byte of a pixel contains:

"Indexed" is the key word. The byte does not describe the colour: it says where to find it.

## Slide 26: Check your understanding: What is GPGPU?

Expand the acronym: the first two letters stand for "general-purpose".

## Slide 27: Exercises: paper first, then PRG32

Five exercises. Compute the memory of a 4K frame in True Color and the bytes per second at 60 frames. Compute how long the display bus of PRG32 takes to send 20 rows. Draw a diagonal line pixel by pixel. Fill the screen once with a single call and once with 64,000 calls, and compare the frame rates. Finally change one entry of the palette at every frame: all the pixels that use it change together, without being redrawn.

## Slide 28: Glossary: English and Italian

Ten terms. A *peripheral* is a *periferica*; its *controller* keeps the English name. *Bus width* and *transfer rate* are *larghezza del bus* and *velocità di trasferimento*. *Colour depth* is *profondità di colore*. A *palette* is a *tavolozza*, though programmers say palette. A *device driver* is the software that adapts programs to a specific device.

## Slide 29: Conclusions and reading

Five conclusions. Input/output devices are a fundamental part of a computer. Each is managed by a controller that interfaces it to the bus. A bus is characterised by width, speed and transfer rate, and its bandwidth is a limit to design around. A video card displays graphics and text: a frame buffer, a resolution, a colour depth, an output. And its processors, the GPUs, are used today for high-performance computing. The next lecture covers the other devices of input and output.
