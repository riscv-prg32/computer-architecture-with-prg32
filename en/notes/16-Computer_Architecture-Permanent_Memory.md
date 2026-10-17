# Lecture 16: Permanent Memory

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: ROM, flash, firmware; the von Neumann architecture; the cache; secondary memory. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

Roadmap. Today's outcomes: (1) classify permanent memories and say where the cartridge is kept; (2) explain a cache hit and a cache miss, and locality; (3) compare the access times of disks and solid-state storage. Builds on: the von Neumann architecture (Lecture 03). Next: Lecture 17, Verm1, Part 3: A Body, Rules and States.

Closing thread: Memory is a hierarchy: small and fast near the processor, large and slow far away, and locality makes the trick work. Next: the third part of Verm1, which needs memory for a whole body.

## Slide 1: Permanent Memory

The previous lecture treated the memory that forgets when power is removed. This one treats the memories that do not: the chips that hold the firmware, magnetic disks, optical media and tapes. Between the two it places the cache, a small fast memory that conceals the slowness of a large one, and the lecture's unifying idea is that this same strategy recurs at every scale. The epigraph is by a professor of numerical computing of this university, and every student eventually learns its truth: a datum does not exist until it has been saved.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Naming the functional units of a computer and locating them on a motherboard and on the kit. Distinguishing ROM, PROM, EPROM, EEPROM and flash, and stating what firmware is. Explaining why a cache makes a computer faster, and what a miss is. Describing the tracks, sectors and blocks of a magnetic disk and the components of its access time. Explaining how an optical disk stores bits and how a compact disc is read. And placing flash, solid-state disks, hard disks and tapes within a multi-level storage system.

## Slide 3: Functional units of a computer

Six cards: the processor, the main memory, the secondary memory, the input and output devices, the communication lines, and a remark on physical integration. Each card names the unit and locates it on the kit: the RISC-V core, the 512 KB of SRAM, the flash chip, the display with its joystick and amplifier. The last card states the difference between a PC and a microcontroller: the former distributes the units across a motherboard, the latter integrates almost all of them in a single package.

## Slide 4: Firmware: the BIOS and its heirs

*Firmware* is the basic software held in non-volatile memory. In a PC it was called the BIOS and performed four tasks: testing the devices at power-on, configuring them, starting the operating system, and offering elementary services for keyboard and disks; its contemporary successor is UEFI. The kit has an analogous chain: a small program in ROM starts a bootloader in flash, which starts the PRG32 firmware, which loads the selected cartridge. Each stage locates, verifies and starts the next, a structure known as a boot chain.

## Slide 5: From ROM to flash

The table, read from top to bottom, is a history of increasing convenience. A ROM is written by the manufacturer once and for all. A PROM can be written by the user, once. An EPROM can be erased in its entirety by exposure to ultraviolet light through a small window, and then rewritten. An EEPROM is erased electrically, one byte at a time, in circuit. *Flash* is erased electrically in blocks: less flexible than EEPROM, but far cheaper per bit, and today ubiquitous.

## Slide 6: Flash memory

Three properties of flash determine how it is used. It is erased by blocks, not by individual bytes: erasure sets every bit of a block to 1, and writing can only turn 1s into 0s. Each block tolerates a limited number of erasures, so a controller distributes writes evenly, a technique called wear levelling. And reading is fast, while writing, and above all erasing, are slow. This is why the best score of the warm-up is not simply written into the cartridge at every frame: flash is not a medium for variables.

## Slide 7: Why a cache?

While memory is being read or written the processor waits, and the slower the memory, the more clock cycles are lost. Why not make all memory as fast as the registers? Because it would then have to reside on the same chip as the processor, which precludes making it large. The compromise is a small, fast memory on the processor chip and a larger, slower one reached through the bus, which is the memory hierarchy of Lecture 15 reduced to its two upper levels.

## Slide 8: How a cache works

The *cache* is placed between the processor and main memory. At every access the processor looks first in the cache. If the content of the requested address is present, the access is a *hit* and the datum arrives at once. If it is not, the access is a *miss*: the datum is copied from main memory into the cache, together with a number of neighbouring locations, forming a cache line. The wager underlying the design is the principle of locality: a program that has just used an address is likely to use it, or its neighbours, again soon. Loops are the source of temporal locality, arrays of spatial locality.

## Slide 9: Cache levels and typical machines

Representative figures. A PC has several cache levels: a first level of tens of kilobytes inside each core, a second of hundreds of kilobytes, and a third of megabytes shared among the cores. The last column is the kit: no cache in front of its SRAM, which is already as fast as the core requires, and only the external flash is read through a small cache. Comparing the columns also shows how main memory and storage have grown over twenty years.

## Slide 10: Characteristics of secondary memories

Four properties characterise secondary memories in relation to main memory. They are non-volatile. Their capacity is several orders of magnitude larger, and their cost per bit several orders of magnitude lower. Their access is some orders of magnitude slower. Two further facts concern their organisation: information is stored in blocks, not individual bytes, and some media permit direct access to any block while others, such as tape, permit only sequential access.

## Slide 11: Magnetic disks: tracks, sectors, blocks

The geometry of a magnetic disk. Platters coated with a magnetisable material rotate at constant speed, while heads read and write. The surface is divided into concentric *tracks* and into *sectors*, wedge-shaped regions. A sector divides each track into *blocks*, and the block, identified by its track and sector, is the smallest addressable unit. *Formatting* is the operation that establishes this division. Access is direct: the head can reach any block without traversing all those that precede it.

## Slide 12: Access time of a magnetic disk

The access time of a disk is the sum of three components. *Seek time*: the time to move the head radially to the correct track. *Rotational latency*: the wait for the desired sector to arrive under the head, which depends on the rotation speed. *Transfer time*: the time for the block to pass under the head. The total is of the order of milliseconds, about a million times slower than RAM: during one disk access the processor of the kit could execute more than a hundred thousand instructions. The gap explains why operating systems work so hard to avoid disk accesses.

## Slide 13: Hard disks and solid-state disks

Two technologies serving the same purpose. A hard disk has magnetic platters and moving heads; its access time is dominated by mechanics, but its cost per terabyte is the lowest available, and it remains the choice for large archives and backups. A solid-state disk is flash memory with a controller and no moving parts; its access time is of the order of tens of microseconds, and it is the standard storage of laptops and phones. It uses the same technology as the flash chip of the kit.

## Slide 14: Optical disks

An optical disk is read by a laser beam whose reflection differs between the *pits* and the flat surface, the *land*. One point is invariably examined: 0 and 1 do not correspond to pit and land. A 1 is a *transition*, from pit to land or from land to pit; a 0 is the absence of a transition. Such disks are usually written once, because the physical modification is irreversible, which makes them suitable for distributing software and for archives that must not be altered.

## Slide 15: The compact disc

On a compact disc the information lies on a single spiral track, with 1.6 micrometres between successive turns. The recording density is constant along the spiral, so to read at a constant rate the disc must rotate faster near the centre and more slowly near the edge: this is *constant linear velocity*. The alternative, *constant angular velocity*, keeps the rotation fixed and wastes capacity in the outer region. The original speed was dictated by the requirements of audio playback.

## Slide 16: A multi-level permanent memory

Five levels of permanent memory, from the fastest to the cheapest: a RAM disk, a portion of main memory used as a disk; solid-state disks; hard disks; disk libraries, in which some disks are powered only when needed; and tape libraries, in which robots mount the tapes. The system migrates data automatically: frequently used data move towards the fast levels, the remainder sink towards the cheap ones. This is the principle of the cache, applied to storage, and the lecture thus closes on the idea with which it began.

## Slide 17: Check your understanding: Which memory can be erased electrically, in blocks, without removing it from the board? / What happens on a cache miss?

For the first question each entry of the table of non-volatile memories is examined with two questions: how is it erased, and in what quantity at a time? Only one is erased electrically and in blocks.

For the second: a miss is not an error. The program observes nothing beyond a longer access: the datum is fetched from main memory and retained in the cache together with its neighbours.

## Slide 18: Check your understanding: Which component of the access time of a hard disk depends on the rotation speed? / On an optical disk, a 1 is encoded as:

For the first question one asks which of the three components is a wait for the disk to rotate. The movement of the arm does not depend on rotation, and formatting and booting are not components of the access time.

For the second, the rule of optical disks applies: what matters is not the pit or the land but the transition between them.

## Slide 19: Glossary: English and Italian

Ten terms. The *motherboard* is the *scheda madre*. A cache *hit* and *miss* denote success and failure in finding the datum. *Seek time* and *latency* are two components of the access time of a disk. *Mass storage* denotes the secondary memory as a whole. A *tape library* is a storage system with robot-handled tapes.

## Slide 20: Conclusions and reading

Five conclusions. Non-volatile memories typically hold the firmware, the basic software of a machine. The cache improves performance by keeping a copy of part of main memory close to the processor. The same idea, a small fast level in front of a large slow one, recurs in storage systems. Permanent memories may be semiconductor, magnetic or optical. And a modern system comprises several levels, managed automatically. Part 3 of Verm1 follows, and uses memory as the project has not used it before.
