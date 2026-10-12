# Lecture 16: Permanent Memory

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; `node notes.js` checks that every slide has its note.

## Slide 1: Permanent Memory

The previous lecture dealt with the memory that forgets when the power goes. This one deals with the memories that do not: the chips that hold the firmware, the disks, the optical media, the tapes. Between the two it places the cache, a small fast memory that hides the slowness of a large one. The quotation is by a professor of numerical computing of this university, and every student learns its truth sooner or later: a datum does not exist unless it has been saved.

## Slide 2: What you will be able to do by the end

Six objectives. Name the functional units of a computer and find them on a motherboard and on the kit. Distinguish ROM, PROM, EPROM, EEPROM and flash, and say what firmware is. Explain why a cache makes a computer faster, and what a miss is. Describe tracks, sectors and blocks of a magnetic disk and the components of its access time. Explain how an optical disk stores bits. And place flash, solid-state disks, hard disks and tapes in a storage system with several levels.

## Slide 3: Warm-up on the machine

The warm-up is an experiment with the power switch. A cartridge has a title and a best score. Predict which of the two is still there after you switch the kit off and on again.

## Slide 4: Switch the kit off and on again

The title is in the section `.rodata`, which is part of the cartridge file: the file is stored in flash memory and survives. The best score is a variable in the section `.data`, which is copied into RAM when the cartridge starts: it lives in SRAM and is lost. So after a power cycle the title is there and the score is 0 again. To keep a score for ever it must be written into a permanent memory, and the lecture presents the ones that exist. Note where each section of a program lives.

## Slide 5: The components of a computer

Before the memories, a look at whole machines: which units make up a computer, and where they are on a real board.

## Slide 6: Functional units of a computer

Six cards: the processor, the main memory, the secondary memory, the input and output devices, the communication lines, and a remark about packaging. Each card names the unit and then says where it is on the kit: the RISC-V core, the 512 KB of SRAM, the flash chip, the display with joystick and amplifier. The last card is the difference between a PC and a microcontroller: the first spreads the units over a motherboard, the second puts almost all of them in one package.

## Slide 7: The motherboard

A motherboard, seen as an architecture. Sockets for the processors and slots for the memory modules, close together because the bus between them must be short. A chipset that connects processor, memory and peripherals. Expansion buses for video cards. Connections for storage and for the outside world. And a flash chip with the firmware that starts the machine. From this point of view a board of twenty years ago and one of today have much in common: the units are the same.

## Slide 8: Firmware: the BIOS and its heirs

*Firmware* is the basic software kept in a non-volatile memory. In a PC it was called BIOS and did four jobs: test the devices at power-on, configure them, start the operating system, and offer basic functions for keyboard and disks; today its heir is called UEFI. The kit has a similar chain: a small program in ROM starts a bootloader in flash, which starts the PRG32 firmware, which loads the cartridge you choose. Each stage finds, checks and starts the next.

## Slide 9: Non-volatile memories

The memories that keep their content without power. They form a family in which each generation is easier to rewrite than the previous one.

## Slide 10: From ROM to flash

Read the table from top to bottom as a history of convenience. A ROM is written by the manufacturer once and for all. A PROM can be written by the user, once. An EPROM can be erased, all at once, by exposing it to ultraviolet light through a small window, and written again. An EEPROM is erased electrically, one byte at a time, without removing it. *Flash* is erased electrically in blocks: less flexible than EEPROM, but much cheaper, and today it is everywhere.

## Slide 11: Flash memory

Three properties of flash explain how it is used. It is erased by blocks, not by single bytes: erasing sets all the bits of a block to 1, and writing can only turn 1s into 0s. Each block survives a limited number of erasures, so a controller spreads the writes evenly. And reading is fast, while writing and above all erasing are slow. This is why the best score of the warm-up is not simply written into the cartridge at every frame: flash is not a place for variables.

## Slide 12: The cache

The cache is not a permanent memory, but it belongs here because it rests on the idea that organises all the levels of memory: a small fast level in front of a large slow one.

## Slide 13: Why a cache?

While the memory is being read or written the processor waits, and the slower the memory the more clock cycles are lost. Why not make all the memory as fast as the registers? Because it would have to be on the same chip as the processor, and it could not then be large. The compromise: a small, fast memory on the processor chip, and a larger, slower one reached through the bus.

## Slide 14: How a cache works

The *cache* sits between the processor and the main memory. At every access the processor looks in the cache first. If the content of the requested address is there, it is a *hit* and the datum arrives at once. If it is not, it is a *miss*: the datum is copied from the main memory into the cache, together with a number of neighbouring locations. The bet behind this is the principle of locality: a program that has just used an address will probably use it, or its neighbours, again soon. Loops and arrays are the reason.

## Slide 15: Cache levels and typical machines

Typical numbers. A PC has several levels of cache: a first level of tens of kilobytes inside each core, a second level of hundreds of kilobytes, and a third level of megabytes shared by the cores. The last column is the kit: no cache at all in front of its SRAM, because that memory is already as fast as the core needs; only the external flash is read through a small cache. Comparing the three columns also shows how main memory and storage have grown in twenty years.

## Slide 16: Secondary memory

Now the memories that hold what must survive: the secondary memory, also called mass storage.

## Slide 17: Characteristics of secondary memories

Four properties define secondary memories with respect to the main memory. They are non-volatile. Their capacity is several orders of magnitude larger. Their cost per bit is several orders of magnitude lower. And their access is some orders of magnitude slower. Two more facts concern their organisation: information is stored in blocks, not in single bytes, and some media allow direct access to any block while others, like tapes, only sequential access.

## Slide 18: Magnetic disks: tracks, sectors, blocks

The geometry of a magnetic disk. Platters coated with a magnetisable material spin at constant speed, and heads read and write. The surface is divided into concentric *tracks* and into *sectors*, slices like those of a cake. A sector cuts each track into *blocks*, and the block, identified by its track and sector, is the smallest unit that can be addressed. *Formatting* is the operation that draws this division. Access is direct: the head goes to any block without passing over all the previous ones.

## Slide 19: Access time of a magnetic disk

The access time of a disk is the sum of three times. *Seek time*: the time to move the head radially to the right track. *Latency*: the wait for the desired sector to pass under the head, which depends on the speed of rotation. *Transfer time*: the time for the block to pass under the head. The total is a matter of milliseconds: a million times slower than RAM. In the time of one disk access the processor of the kit could execute more than a hundred thousand instructions.

## Slide 20: Hard disks and solid-state disks

Two technologies for the same job. A hard disk has magnetic platters and moving heads: its access time is dominated by mechanics, but its cost per terabyte is the lowest, and it remains the choice for large archives and backups. A solid-state disk is flash memory with a controller and no moving parts: its access time is tens of microseconds, and it is the standard storage of laptops and phones. It is the same technology as the flash chip of the kit.

## Slide 21: Optical disks

A third family of permanent memories reads bits with light. Its commercial importance has declined, but its ideas, the spiral track and the coding by transitions, are worth knowing.

## Slide 22: Optical disks

An optical disk is read by a laser beam whose reflection changes between the *pits* and the flat surface, the *land*. The point that is always asked in the exam: 0 and 1 are not pit and land. A 1 is a *change*, from pit to land or from land to pit; a 0 is no change. Such disks are usually written once, because the physical modification is irreversible, which makes them suitable for distributing programs and for archives that must not be altered.

## Slide 23: The compact disc

In a compact disc the information is on a single spiral track, with a distance of 1.6 micrometres between one turn and the next. The recording density is constant along the spiral, so to read at a constant rate the disk must turn faster near the centre and more slowly near the edge: this is *constant linear velocity*. The alternative, *constant angular velocity*, keeps the rotation constant and wastes the outer part of the disk. The speed was originally set by the needs of music.

## Slide 24: DVD and CD compared

A DVD is a compact disc with everything made smaller: pits of 0.4 instead of 0.83 micrometres and a track pitch of 0.74 instead of 1.6. It can also have two layers and two sides. The result is about 5 GB per layer against 0.68 GB, and a much higher transfer rate. The physical dimensions of the disk, 120 millimetres of diameter and 1.2 of thickness, are the same.

## Slide 25: Storage on several levels

The last idea of the lecture: a real system does not choose one permanent memory, it uses several, arranged in levels.

## Slide 26: A multi-level permanent memory

Five levels of permanent memory, from the fastest to the cheapest: a RAM disk, which is a piece of main memory used as a disk; solid-state disks; hard disks; disk libraries, in which some disks are switched on only when needed; and tape libraries, in which robots mount the tapes. The system moves the data automatically: what is used often migrates towards the fast levels, the rest sinks towards the cheap ones. It is the idea of the cache, applied to storage.

## Slide 27: Storage at scale

Three pictures of storage at different scales: the disk and tape libraries of a data centre, a solid-state disk, the inside of a DVD drive. The sentence under them sums up the lecture: from a chip of a few megabytes on the kit to rooms of petabytes, the hierarchy is the same.

## Slide 28: Check your understanding: Which memory can be erased electrically, in blocks, without removing it from the board?

Go through the table of non-volatile memories asking two questions for each: how is it erased, and how much at a time? Only one is erased electrically and in blocks.

## Slide 29: Check your understanding: What happens on a cache miss?

A miss is not an error. The program does not notice anything, except that this access takes longer: the datum is fetched from the main memory and kept in the cache together with its neighbours.

## Slide 30: Check your understanding: Which component of the access time of a hard disk depends on the rotation speed?

Which of the three times is a wait for the disk to turn? The movement of the arm does not depend on the rotation; formatting and booting are not components of the access time.

## Slide 31: Check your understanding: On an optical disk, a 1 is encoded as:

Recall the rule of optical disks: what counts is not the pit or the land, but the passage from one to the other.

## Slide 32: Exercises

Five exercises. Compute the average latency of a disk at 7,200 revolutions per minute: half a revolution. Compute the average access time of a cache with 95% of hits. Say where five things live on the kit: the boot code, the firmware, a cartridge, a variable, a register. Find the specifications of the storage of your own laptop or phone. And measure on PRG32 two loops over a large array, one in order and one in jumps: is there a difference, and why might there not be on this chip?

## Slide 33: Glossary: English and Italian

Ten terms. The *motherboard* is the *scheda madre*. A cache *hit* and *miss* are a success and a failure in finding the datum. *Seek time* and *latency* are two components of the access time of a disk. *Mass storage* is the secondary memory as a whole. A *tape library* is a storage system with tapes handled by robots.

## Slide 34: Conclusions and reading

Five conclusions. Non-volatile memories usually hold the firmware, the basic software of a machine. The cache improves performance by keeping a copy of part of the main memory close to the processor. The same idea, a small fast level in front of a large slow one, is used again in storage. Permanent memories can be semiconductor, magnetic or optical. And a modern system has several levels, managed automatically. Next comes Part 3 of Verm1, which uses memory as it has never been used so far in the project.
