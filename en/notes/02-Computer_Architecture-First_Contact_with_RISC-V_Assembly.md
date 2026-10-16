# Lecture 02: First Contact: RISC-V Assembly on PRG32

*ARC12 Computer Architecture, A.Y. 2026/27. Slide notes.* One note per slide: what the slide shows, how to read it, and what to take away. Generated headings, hand-written text; in a code deck the notes of the generated slides (the complete program, the test guides) are generated too. `node notes.js` checks that every slide has its note.

Learning status of this lecture. UNDERSTAND NOW: registers, compute, move, jump; registers; the init, update, draw contract; arguments in a0 to a7; why ra is saved; address, value, load, store; the base instructions; pseudo-instructions; an instruction is a number; tracing by hand. USE NOW: the calling convention (Lecture 18); bit masks (Lecture 08) and, used without being studied in this course, the assembler directives, the PRG32 tools, the PRG32 runtime calls, the PRG32-QT debugger, the complete program. UNDERSTAND LATER: the stack (Lecture 18); addressing modes (Lecture 19); instruction formats (Lecture 19); hexadecimal (Lecture 04); two's complement (Lecture 05); fixed point (Lecture 06); Boolean algebra (Lecture 08); the adder (Lecture 09); from volts to bits (Lecture 10); latches and flip-flops (Lecture 13); the processor cycle (Lecture 19); the Verm1 project (Lecture 07). A slide without a badge is context: a story, an example, a question, an exercise.

## Slide 1: First Contact: RISC-V Assembly on PRG32

This is the first lecture in which a program is written, and it deliberately precedes any theory. Over two hours the student builds four small cartridges, each a complete program that runs. Full understanding of every detail is neither expected nor required today. The aim is to *observe* registers, memory and a procedure call at work, so that the lectures that follow have concrete phenomena to explain. The epigraph sets the register of the session: fewer words, more code.

## Slide 2: What you will be able to do by the end

Six learning outcomes. The first four are operational: building and running a cartridge, naming the registers, calling a function with its arguments, and preserving a value in memory between frames. The fifth is a change of perspective with lasting consequences: an instruction is a 32-bit number. The sixth is the most important for the course as a whole: the student leaves with a list of questions, each of which is the subject of a later lecture. Today's lecture is therefore as much an inventory of problems as a body of answers.

## Slide 3: The machine you are programming

The whole machine is described by four cards. There are 32 *registers*, each holding a 32-bit value, and the processor can operate only on values held in registers. Instructions fall into three classes. *Compute*: arithmetic and logical operations between registers, such as `add` or `addi`. *Move*: transfers between a register and memory, `lw` to load a word and `sw` to store one; no other instruction accesses memory. *Jump*: instructions that alter which instruction executes next. This is the load-store discipline of RISC-V, and every computation a computer performs is a long sequence of these three kinds.

## Slide 4: The registers you will actually use

The registers carry names that reflect their use. `a0` to `a7` pass the arguments of a call, and `a0` also returns the result. `t0` to `t6` are temporaries, freely usable and not preserved across calls. `s0` to `s11` are preserved across calls. `ra` holds the return address, `sp` the top of the stack, and `zero` always reads as 0. The caption contains the essential point: these roles are not imposed by the hardware, which treats `x1` to `x31` identically. They are an agreement, the *calling convention*, and it is this agreement that allows assembly written by the student and C code of the framework to call one another. It is used today and studied formally in Lecture 18.

## Slide 5: The contract: three functions that you write

The interface between a game and PRG32 is a contract of three functions supplied by the programmer. `init` is called once, when the cartridge starts, to establish the initial state. `update` is called once per frame, to read the input and modify the state. `draw` is called once per frame, to render the state as an image. The firmware locates them by name: a prefix chosen by the programmer followed by `_init`, `_update` and `_draw`. The separation of responsibilities should be adopted from the first day: `update` decides, `draw` displays, and neither does the other's work.

## Slide 6: Why save ra? The stack frame

Why must `ra` be saved? The instruction `call` writes into `ra` the address to which control must return. The callee, however, may itself make calls, each of which overwrites `ra`. A function that calls another must therefore first preserve its own return address in memory: it decrements `sp` by 16 to reserve space, the *stack frame*, and stores `ra` at `12(sp)`; after the call it performs the inverse operations. The diagram shows the frame, with the stack growing towards lower addresses; the 16-byte size follows from the alignment that the convention requires of `sp`. Omitting this pair of operations is the classic first error: the function returns to the wrong place. Why `ra` is saved must be understood today; the stack as a data structure is treated formally in Lecture 18.

## Slide 7: Address or value? The crux of memory

This slide separates two notions that beginners routinely conflate: an address and a value. After `la`, `t0` contains *where* the counter is stored; after `lw`, `t1` contains *what* is stored there, 41 in the diagram. `addi` modifies the copy in the register to 42, while memory continues to hold 41 until `sw` writes the new value back. The two arrows should be followed carefully. The box on the right recommends a habit worth adopting at once: annotate every register in the comments as holding either an ADDRESS or a VALUE. This simple discipline prevents the most frequent error of the first month. The ways in which an instruction can designate its operands, the addressing modes, are studied in Lecture 19.

## Slide 8: The instructions you have just used

Five families account for every instruction written today: arithmetic (`add`, `sub`), logical (`and`, `or`, `xor`), immediate forms taking a small constant (`addi`, `andi`), memory (`lw`, `sw`) and control (`call`, `ret`). In every instruction the result is written to the first register named: `add t0, t1, t2` places `t1 + t2` in `t0`. The base integer instruction set, RV32I, comprises about forty instructions; a quarter of them have already been used.

## Slide 9: Pseudo-instructions: shortcuts the assembler expands

Several of the instructions written today do not exist in the hardware: they are *pseudo-instructions*, notational conveniences that the assembler expands into real instructions. `li t0, 42` becomes `addi t0, zero, 42`; `mv` is an `addi` with constant 0; `ret` is an indirect jump to the address in `ra`; `beqz` is a comparison with the register `zero`. The frequency with which `zero` appears in the middle column is instructive: a register hard-wired to 0 allows a small instruction set to do the work of a much larger one, a characteristic economy of RISC design.

## Slide 10: One instruction is one 32-bit number

An instruction is a number. `addi t1, t1, 1` is the 32-bit word 0x00130313, and the coloured strip shows its fields: twelve bits for the constant 1, five for the source register (`t1` is register number 6), three that select the addition, five for the destination register and seven for the opcode, which identifies the class of instruction. The format need not be memorised now; it is the subject of Lecture 19. What matters today is the principle: assembly is a readable notation for machine code, and an instruction stored in memory is data like any other. This is the stored-program idea that the next lecture places in its historical context.

## Slide 11: PRG32-QT: a microscope for registers

PRG32-QT executes the same cartridge on the laptop and can halt between any two instructions, displaying every register. It should be used now on the third step: navigate to `update`, pause, and execute the four instructions of `first_update` one at a time while observing `t0` and `t1`. Before each step, the expected change should be stated aloud; a prediction made explicit is a prediction that can be wrong, and therefore informative. The final line is a principle worth retaining: the board is the authority on time, PRG32-QT the authority on the content of a register.

## Slide 12: Trace it by hand: three frames of first_update

A trace by hand records, frame by frame, what each instruction leaves in `t1` and in memory. The early frames hold no surprise. The highlighted row does: at frame 256 the counter reaches 256 and yet the width of the bar is 0, because `andi` with 255 retains only the eight least significant bits, and 256 in binary is a one followed by eight zeros. The mask operation thus computes the remainder modulo 256, a fact used today and explained in Lecture 08. Tracing by hand is slow and unglamorous, and it is the most valuable debugging skill this course teaches.

## Slide 13: Questions your program has already raised

Each row of the table records something observed today, the question it raises, and the lecture that answers it. Why hexadecimal? Lectures 04 and 05. How does a register hold a negative number? Lecture 05. What does AND do to thirty-two bits at once? Lectures 08 and 09. How does a circuit remember a bit? Lectures 13 and 15. How is 0x00130313 decoded and executed? Lectures 18 and 19. The last row is the project: from three functions and a rectangle to a complete game. The table is the map of the course drawn from the student's own program, and it is worth keeping at hand.

## Slide 14: Check your understanding: After la t0, counter and lw t1, 0(t0), what does t0 hold? / A function that calls prg32_gfx_clear must save one register before the call. Which one?

The first question tests the distinction between address and value. `la` loads the address of the label into `t0`; `lw` then uses `t0` to locate the word and copies its content into `t1`, leaving `t0` unchanged. `t0` therefore still holds the address. Anyone who chose "the value" should return to the slide with the two arrows.

The second question turns on the effect of `call`, which writes the return address into `ra`. A function that must later return to its own caller needs its original `ra`, which the call has just overwritten. `a0` is intended to be overwritten, `sp` is restored by the callee, and `t0` is a temporary that no one has undertaken to preserve.

## Slide 15: Check your understanding: t1 holds 300. What does andi a2, t1, 255 leave in a2?

The calculation is best done in binary. 300 equals 256 + 44: a one in bit position 8 followed by the eight bits of 44. The mask 255 consists of eight ones, so the AND retains the eight least significant bits and clears all others. The result is 44. Subtracting 255 from 300 yields 45, a plausible but wrong answer: a bitwise AND is not a subtraction, and the distinction between arithmetic and logical operations on the same bits recurs throughout the course.

## Slide 16: Glossary: English and Italian

Twelve terms of the lecture, with the Italian used in class. *Load* and *store* are always named from the processor's point of view: a load brings a value from memory into a register, a store sends it back. An *immediate* is a constant encoded within the instruction itself. A *branch* is a jump taken only if a condition holds. The *calling convention* is the agreement governing the roles of the registers across procedure calls.

## Slide 17: Summary and reading

Four propositions summarise the lecture. A RISC-V processor consists of thirty-two registers and a small set of instructions that compute, move data and alter control flow. A PRG32 game consists of three functions; arguments travel in `a0` to `a7`, and a function that calls another must save `ra`. Variables reside in memory: `la` yields the address, `lw` and `sw` the value. An instruction is a 32-bit number, and assembly is its readable notation. The next lecture steps back to trace the history that produced this machine.
