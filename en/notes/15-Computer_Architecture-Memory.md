# Lecture 15: Memory

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: memories and addresses; little-endian byte order; processor and memory; memory-mapped I/O. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Memory

You have used memory since the second lecture: every `lw` and `sw` reads or writes it. This lecture explains what a memory is, how it is organised, and what actually happens between the processor and the memory when a load is executed. The picture on the cover is the debugger of PRG32-QT, whose memory view will serve as your microscope. The quotation from Tron is a joke with a serious side: a machine with memory can keep a state, and with a state it can do almost anything.

## Slide 2: What you will be able to do by the end

Six objectives. Classify memories as volatile or persistent, on-line or off-line, and place them in a hierarchy. Describe how SRAM and DRAM store a bit and why they have different uses. Explain words, addresses and byte-addressable memory. Tell little-endian from big-endian order. Describe step by step how the processor reads and writes a word. And explain what memory-mapped input/output and DMA are.

## Slide 3: Memory

Memory is the part of a computer dedicated to keeping data and the instructions of programs. Two distinctions classify it. *Volatile* memories keep the information only while the machine is powered; *persistent* ones keep it when it is switched off. *On-line* means that the data are always accessible; *off-line* means that a medium must first be mounted, like a tape taken from a shelf.

## Slide 4: The memory hierarchy

The memory hierarchy. At the top the registers, inside the processor; then the cache, the main memory, solid-state and magnetic disks, and finally tapes and removable media. Going up, memories are faster and more expensive per bit; going down, larger and cheaper. The upper levels are volatile, the lower ones persistent. The last line explains why the hierarchy exists: no single technology is fast, large and cheap at once, so a computer combines several.

## Slide 5: Magnetic-core memory

In a magnetic-core memory each bit is a small ring of ferrite, and its value is the direction of the magnetic field in the ring. It was the main memory of the computers of the 1950s and 1960s, and it kept its content without power. The research began with An Wang at Harvard in 1949; Jay Forrester at MIT made it practical for the Whirlwind computer. Look at the photograph: every ring is threaded by wires, and one ring is one bit.

## Slide 6: Reading and writing a core

How a core is read and written. Two wires, X and Y, select one ring. Reading sets the selected bit to 0: if it contained a 1 a pulse appears on the sense wire, otherwise nothing. So reading destroys the content, and every read is followed by a write that stores the datum again. Writing sets the selected core to 1, unless an inhibit wire prevents it. Keep the idea of the destructive read followed by a rewrite: it returns in today's DRAM.

## Slide 7: SRAM and DRAM

The two kinds of RAM. In *static* RAM each bit is held by a bistable circuit like those of Lecture 13: it keeps its value as long as there is power, it is fast, and it needs several transistors per bit, so it is expensive: it is used for caches. In *dynamic* RAM each bit is a charge in a tiny capacitor behind one transistor: it is dense and cheap, but the charge leaks away, so the content must be refreshed periodically: it is the main memory of laptops and phones. The chip of the kit has only SRAM.

## Slide 8: Other memories

Other technologies. Ferroelectric RAM keeps its state without power. *Flash* memory is persistent and is erased in blocks: it is the memory of USB keys, phones and solid-state disks. One line concerns your kit directly: in a microcontroller the program lives in flash and the variables in SRAM. That is why your cartridges have a section of constants and a section of variables. The memory modules of a PC have gone, over the years, from a few megabytes to tens of gigabytes each.

## Slide 9: Words and addresses

The main memory is an array of *words*, each a string of m bits that the processor reads or writes in a single operation. Each word has an *address*, a number from 0 to N minus 1 written on n bits, with N equal to 2 to the n. The address is a code word, and the memory decodes it. *Random access* means that the access time does not depend on the position: every word is reached equally fast. Thirty-two address bits give four gibibytes of addresses.

## Slide 10: Byte-addressable memory

In a *byte-addressable* memory the smallest unit with an address is the byte. A word of 32 bits therefore occupies four consecutive addresses, and its address is that of its first byte. The strip shows the word of the warm-up followed by three characters. Two consequences that you have already met: the program counter advances by 4 from one instruction to the next, and the index of an array of words is multiplied by 4. RISC-V has loads and stores for each size: bytes, halfwords and words.

## Slide 11: Big-endian and little-endian

The two orders of the bytes of a word. *Little-endian*: the least significant byte at the lowest address. *Big-endian*: the most significant byte first. The same word, 0x10A3E6FF, is shown stored in the two ways. RISC-V is little-endian, like almost every processor in use today; network protocols, for historical reasons, send data big-endian. You notice the difference when you look at memory byte by byte, or when two different machines exchange binary data.

## Slide 12: Parameters of a memory

Two parameters describe a memory: the *capacity*, the number of locations and the bits of each, and the *access time*. The numbers of the kit are worth remembering: 512 KB of SRAM, 320 KB of ROM, and an external flash of a few megabytes. Of these, the PRG32 menu tells you what is left for your programs: about 98 KB of RAM and 509 KB of flash for cartridges. It is eight times a Commodore 64, and a tiny fraction of a laptop.

## Slide 13: The interface between processor and memory

The interface. Inside the processor two registers face the memory: MA, the memory address register, and MB, the memory buffer register. Three groups of lines connect them to the memory: the *address bus*, which goes one way, from the processor to the memory; the *data bus*, which goes both ways; and the control lines, read enable and write enable, which say what is being requested. MA and MB belong to the model of the processor: they are not among the registers you use in assembly.

## Slide 14: Synchronising processor and memory

How do the processor and the memory agree on when the datum is ready? In the *asynchronous* technique the memory signals with a line when it has finished, and the processor waits: more complex, but the two can be designed independently. In the *synchronous* technique a clock paces the operation, which completes within a cycle whose length is chosen according to the speed of the memory: simpler, and the rule inside a single chip.

## Slide 15: Connecting processor, memory and I/O

Two ways of connecting input and output. With a single bus, *memory-mapped I/O*, memory and devices share the same address space: a register of a device is read and written like a memory location, with no special instructions. With separate buses, *isolated I/O*, there are two address spaces and dedicated instructions. RISC-V follows the first way: it has no input or output instructions at all, only loads and stores.

## Slide 16: The three component buses, and DMA

The bus is in fact three buses: data, address and control. One more mechanism completes the picture. With *direct memory access*, DMA, a device exchanges whole blocks of data with the memory directly: the processor starts the transfer and is told when it is over, without copying each word itself. The display of the kit receives every frame in this way, and so does the audio amplifier.

## Slide 17: Check your understanding: A memory has 16 address lines and is byte-addressable. How large is it? / On RISC-V, value: .word 0xCAFE0001 is at address A. What does lbu t0, 0(t0) read if t0 = A?

Sixteen address lines select 2 to the 16 locations, and each location is one byte. Remember that 2 to the 10 is 1,024, a kibibyte.

Little-endian: which byte of 0xCAFE0001 is the least significant? That byte is at the lowest address, and `lbu` with offset 0 reads it.

## Slide 18: Check your understanding: Why must DRAM be refreshed? / How does a RISC-V program write to an output device?

Recall how DRAM stores a bit: a charge in a tiny capacitor. What happens to a charge left alone? The refresh has nothing to do with speed or with random access.

RISC-V has no `out` instruction and no thirty-third register. Devices have addresses, and a program reaches them with the instructions it uses for memory.

## Slide 19: Glossary: English and Italian

Ten terms. *Main memory* is *memoria centrale*. *Access time* is *tempo di accesso*. A *magnetic core* is a *nucleo di ferrite*. *Refresh* is the periodic rewriting of a DRAM. *Memory-mapped I/O* is input/output reached through memory addresses. The *address bus* and the *data bus* are the two main groups of lines of the interface.

## Slide 20: Conclusions and reading

Five conclusions. Memory is the component that keeps the state of data. Different kinds serve different purposes, because none is fast, large and cheap together. Data are stored as words with addresses; RISC-V addresses bytes and orders them little-endian. Access happens by selection on the address bus, transfer on the data bus and control lines. And in RISC-V devices are reached like memory. The next lecture treats the memory that survives when the power is off, and the cache.
