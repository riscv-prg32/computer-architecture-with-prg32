# Lecture 15: Memory

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: memories and addresses; little-endian byte order; processor and memory; memory-mapped I/O. USE NOW: the complete program, the PRG32 tools (used, not studied, in this course). UNDERSTAND LATER: nothing. A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: Memory

Memory has been in use since the second lecture: every `lw` and `sw` reads or writes it. This lecture explains what a memory is, how it is organised, and what actually takes place between processor and memory when a load executes. The cover shows the PRG32-QT debugger, whose memory view serves as the instrument of observation throughout. The epigraph from Tron is playful but makes a serious point: a machine with memory can retain a state, and with state it can do almost anything, as the previous two lectures established.

## Slide 2: What you will be able to do by the end

Six learning outcomes. Classifying memories as volatile or persistent, on-line or off-line, and placing them in a hierarchy. Describing how SRAM and DRAM store a bit and why they serve different purposes. Explaining words, addresses and byte-addressable memory. Distinguishing little-endian from big-endian ordering. Describing step by step how the processor reads and writes a word. And explaining memory-mapped input/output and DMA.

## Slide 3: Memory

Memory is the part of a computer dedicated to retaining data and the instructions of programs. Two distinctions classify it. *Volatile* memories retain information only while powered; *persistent* ones retain it when power is removed. *On-line* means that the data are always accessible; *off-line* means that a medium must first be mounted, as a tape taken from a shelf.

## Slide 4: The memory hierarchy

The memory hierarchy. At the top are the registers, within the processor; then the cache, main memory, solid-state and magnetic disks, and finally tapes and removable media. Moving upwards, memories become faster and more expensive per bit; moving downwards, larger and cheaper. The upper levels are volatile, the lower ones persistent. The last line states the reason for the hierarchy: no single technology is simultaneously fast, large and inexpensive, so a computer combines several and exploits the locality of programs to make the combination behave almost as well as the fastest level.

## Slide 5: Magnetic-core memory

In a magnetic-core memory each bit is a small ferrite ring, and its value is the direction of magnetisation of the ring. It was the main memory of the computers of the 1950s and 1960s, and it retained its content without power. The research began with An Wang at Harvard in 1949; Jay Forrester at MIT made it practical for the Whirlwind computer. In the photograph each ring is threaded by wires, and each ring is one bit.

## Slide 6: Reading and writing a core

How a core is read and written. Two wires, X and Y, select one ring. Reading drives the selected core to 0: if it held a 1, a pulse appears on the sense wire, otherwise nothing does. Reading is therefore destructive, and every read must be followed by a write that restores the datum. Writing drives the selected core to 1 unless an inhibit wire prevents it. The pattern of destructive read followed by rewrite deserves to be remembered, because it recurs in contemporary DRAM.

## Slide 7: SRAM and DRAM

The two families of random-access memory. In *static* RAM each bit is held by a bistable circuit of the kind studied in Lecture 13: it retains its value as long as power is present, it is fast, and it requires several transistors per bit, which makes it costly; it is used for caches. In *dynamic* RAM each bit is a charge stored in a tiny capacitor behind a single transistor: it is dense and inexpensive, but the charge leaks away, so the content must be refreshed periodically; it is the main memory of laptops and phones. The chip of the kit contains only SRAM.

## Slide 8: Other memories

Other technologies. Ferroelectric RAM retains its state without power. *Flash* memory is persistent and is erased in blocks; it is the memory of USB keys, phones and solid-state disks, studied in Lecture 16. One line concerns the kit directly: in a microcontroller the program resides in flash and the variables in SRAM, which is why cartridges distinguish a section of constants from a section of variables. The memory modules of a PC have grown, over the decades, from a few megabytes to tens of gigabytes each.

## Slide 9: Words and addresses

Main memory is an array of *words*, each a string of m bits that the processor reads or writes in a single operation. Each word has an *address*, a number from 0 to N - 1 written on n bits, with N = 2^n. The address is a code word, and the memory decodes it exactly as the small memory of Lecture 14 did. *Random access* means that the access time does not depend on the position: every word is reached equally fast. Thirty-two address bits yield four gibibytes of addresses.

## Slide 10: Byte-addressable memory

In a *byte-addressable* memory the smallest addressable unit is the byte. A 32-bit word therefore occupies four consecutive addresses, and its address is that of its first byte. The strip shows the word of the warm-up followed by three characters. Two consequences have already been encountered: the program counter advances by 4 from one instruction to the next, and the index into an array of words is multiplied by 4. RISC-V provides loads and stores for each size: bytes, halfwords and words.

## Slide 11: Big-endian and little-endian

The two orderings of the bytes of a word. *Little-endian*: the least significant byte at the lowest address. *Big-endian*: the most significant byte first. The same word, 0x10A3E6FF, is shown stored both ways. RISC-V is little-endian, like nearly every processor in current use; network protocols, for historical reasons, transmit data big-endian. The distinction becomes visible when memory is inspected byte by byte, or when two machines of different convention exchange binary data. The byte-order slide of Lecture 04 is here completed and turned into an experiment.

## Slide 12: Parameters of a memory

Two parameters characterise a memory: its *capacity*, the number of locations and the number of bits in each, and its *access time*. The figures for the kit are worth retaining: 512 KB of SRAM, 320 KB of ROM, and an external flash of a few megabytes. Of these, the PRG32 menu reports what remains available to programs: about 98 KB of RAM and 509 KB of flash for cartridges. This is eight times the memory of a Commodore 64, and a minute fraction of a laptop's.

## Slide 13: The interface between processor and memory

The interface. Within the processor two registers face the memory: MA, the memory address register, and MB, the memory buffer register. Three groups of lines connect them to the memory: the *address bus*, unidirectional, from processor to memory; the *data bus*, bidirectional; and the control lines, read enable and write enable, which specify the operation requested. MA and MB belong to the reference model of the processor of Lecture 18; they are internal and do not appear among the registers available in assembly.

## Slide 14: Synchronising processor and memory

How do processor and memory agree on when the datum is ready? In the *asynchronous* technique the memory signals completion on a dedicated line and the processor waits; the scheme is more complex, but the two can be designed independently. In the *synchronous* technique a clock paces the operation, which completes within a cycle whose length is chosen according to the speed of the memory; the scheme is simpler, and it is the rule within a single chip.

## Slide 15: Connecting processor, memory and I/O

Two ways of attaching input and output. With a single bus, *memory-mapped I/O*, memory and devices share one address space, and a device register is read and written like any memory location, with no special instructions. With separate buses, *isolated I/O*, there are two address spaces and dedicated instructions. RISC-V adopts the first approach: it has no input or output instructions whatever, only loads and stores. The uniformity simplifies the instruction set at the cost of reserving part of the address space.

## Slide 16: The three component buses, and DMA

The bus is in fact three buses: data, address and control. One further mechanism completes the picture. With *direct memory access*, DMA, a device exchanges entire blocks of data with memory directly: the processor initiates the transfer and is notified on completion, without copying each word itself. The display of the kit receives every frame in this way, and so does the audio amplifier. Lecture 21 places DMA among the three ways of dealing with a device.

## Slide 17: Check your understanding: A memory has 16 address lines and is byte-addressable. How large is it? / On RISC-V, value: .word 0xCAFE0001 is at address A. What does lbu t0, 0(t0) read if t0 = A?

For the first question: sixteen address lines select 2^16 locations, each of one byte, and 2^10 = 1,024 bytes is one kibibyte.

For the second: in little-endian order the question is which byte of 0xCAFE0001 is the least significant. That byte occupies the lowest address, and `lbu` with offset 0 reads it.

## Slide 18: Check your understanding: Why must DRAM be refreshed? / How does a RISC-V program write to an output device?

For the first question one recalls how DRAM stores a bit, as a charge in a tiny capacitor, and asks what becomes of a charge left to itself. Refresh concerns neither speed nor random access.

For the second: RISC-V has no `out` instruction and no thirty-third register. Devices have addresses, and a program reaches them with the same instructions it uses for memory.

## Slide 19: Glossary: English and Italian

Ten terms. *Main memory* is *memoria centrale*. *Access time* is *tempo di accesso*. A *magnetic core* is a *nucleo di ferrite*. *Refresh* is the periodic rewriting of a DRAM. *Memory-mapped I/O* is input/output accessed through memory addresses. The *address bus* and the *data bus* are the two principal groups of lines of the interface.

## Slide 20: Conclusions and reading

Five conclusions. Memory is the component that retains the state of data. Different kinds serve different purposes, because none is fast, large and cheap at once. Data are stored as addressed words; RISC-V addresses individual bytes and orders them little-endian. An access proceeds by selection on the address bus, transfer on the data bus, and coordination through the control lines. And in RISC-V devices are reached exactly as memory is. The next lecture treats memory that survives the removal of power, together with the cache.
