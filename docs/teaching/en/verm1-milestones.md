# Verm1: the four milestones

Verm1 (read "vermone", the big worm) is built in four parts, one after each block of four lectures, and published in
Lecture 23. Each part starts from the finished file of the previous one and ends with a game that runs. This guide
gives, for each part, what to know before starting, what the student should see at each checkpoint, the mistakes that
come up most often and how to recover, the concepts involved (ids of `tools/concepts/registry.json`) and a short
reflection to close.

**The reference programs** are `verm1/verm1_partN.S` (in the course material, `~/arc12/verm1/`). The checkpoints below
are the "Run it" slides of each code deck; `tools/tests/verm1_check.py` builds and plays every part with a scripted
player, and `tools/tests/verm1_steps.py` builds and checks the intermediate programs of Parts 2 and 3.

**Rescue path, for every part.** A student who missed the previous part, or whose file does not work, starts from the
reference file of the previous part (Part 1 starts from the skeleton of Lecture 02). Copy it, build it, run it, and check
that it shows what the previous part ended with. Then continue the tutorial from step 1 of the new part. Nothing in a
part depends on a variant that a student added in "Make it yours".

## Part 1, Lecture 07: a head that crosses the world

- **Before starting.** Lecture 02 (the contract, `la`/`lw`/`sw`, saving `ra`), Lecture 04 (colours in RGB565, arrays),
  Lecture 05 (shifts as multiplications), Lecture 06 (fixed point).
- **Concepts.** now: `verm1.project`, `prg32.contract`, `info.rgb565`, `data.array`, `mem.sections`, `mem.load-store`,
  `abi.return-address`, `num.shift-multiply`, `num.fixed-point`, `asm.pseudo`, `mem.endianness`; use: `tool.prg32-cli`, `tool.debugger`.
- **Checkpoints.**
  1. Step 2: the title VERM1 and a grid with a green head at column 5 of row 12.
  2. Step 3: the head moves right, about five cells per second, leaves at column 39 and returns at column 0.
  3. Changing `SPEED_Q8` changes the speed as predicted: 256 is one cell per frame.
  4. Step 4: in PRG32-QT, `step_q8` grows by `SPEED_Q8` every frame and wraps at 256.
- **Common mistakes and recovery.**
  - The head is drawn in the wrong place: the cell is `column x 8` and `row x 8 + 8`; check the two `slli` by 3.
  - The program returns to the wrong place or freezes: `verm1_draw` calls functions and must save `ra` (prologue and
    epilogue); compare with the reference.
  - The head never wraps: the comparison with `COLS` must be done after the increment, with the right branch.
  - A variable put in `.rodata` never changes: variables go in `.data`.
- **Reflection and exit check.** Exit ticket of Lecture 07 (A07.1, A07.2). Reflect: "Which line decides the speed, and why is it a fraction?"

## Part 2, Lecture 12: steering, food and a score

- **Before starting.** Part 1 running; Lecture 08 (masks, AND, OR, XOR), Lecture 09 (Boolean functions), Lecture 10
  (pull-up inputs), Lecture 11 (codes, multiplexers, comparators).
- **Concepts.** now: `logic.bitmask`, `comb.codes`, `data.array`, `elec.pullup`, `logic.boolean-algebra`,
  `num.fixed-point`, `comb.mux`, `num.signed-unsigned`, `comb.comparator-parity`, `abi.call-args`; use: `prg32.api`,
  `abi.calling-convention`, `tool.prg32-cli`, `tool.debugger`.
- **Checkpoints.**
  1. Step 2: holding DOWN turns the head down at its next step, wrapping from row 23 to row 0.
  2. While the head goes right, holding LEFT does nothing: the U-turn is refused.
  3. DOWN then LEFT: two turns, and the head goes left.
  4. Step 3: a red cell of food; eating it moves it, plays a note and adds a mark next to VERM1.
- **Common mistakes and recovery.**
  - A button has no effect: the mask does not match the button bit; print the buttons in the debugger (`a0` in update).
  - The U-turn is accepted: directions are RIGHT 0, DOWN 1, LEFT 2, UP 3, and two directions are opposite when their
    XOR is 2; check the constant compared with `t3`.
  - The food is never eaten: the comparison uses addresses instead of values (`la` without `lw`).
  - The score is not reset: `init` must store zero in `score`.
- **Reflection and exit check.** Exit ticket of Lecture 12 (A12.1). Reflect: "Which rule of the game is a single logic instruction?"

## Part 3, Lecture 17: a body, rules and states

- **Before starting.** Part 2 running; Lecture 13 (finite-state machines, flip-flops), Lecture 14 (registers),
  Lecture 15 (memory, addresses), Lecture 16 (the memory hierarchy).
- **Concepts.** now: `data.array`, `seq.fsm`, `mem.sections`, `seq.latch-ff`, `num.fixed-point`; use:
  `abi.calling-convention`, `tool.prg32-cli`, `tool.debugger`.
- **Checkpoints.**
  1. Step 2: the title line and PRESS A; pressing A removes the invitation, the food appears at column 0 of row 0, and
     nothing moves. In the debugger `state` goes from 0 to 1.
  2. Step 3: after A, a worm of three cells in row 12, columns 3 to 5; in memory `body_x` starts with 03 04 05 and
     the grid has three bytes at 01 from `grid + 12 x 40 + 3`.
  3. Step 4: the worm moves, grows when it eats, and the game ends when it bites itself (state 2, OVER); A returns to the title.
- **Common mistakes and recovery.**
  - The wrong cell of the grid is read or written: the index is `row x 40 + column`; check the multiplication by shifts.
  - Writing past the end of the body: the ring index must be reduced with `andi ..., 255` after every increment.
  - The worm bites itself when it should not: the tail must be cleared from the grid before the head is written.
  - The game never leaves TITLE: compare `state` with the constant `PLAY`, not with the button value.
- **Reflection and exit check.** Exit ticket of Lecture 17 (A17.1, A17.2). Reflect: "Where in memory is the state of the game, and what changes it?"

## Part 4, Lecture 22: the finished game

- **Before starting.** Part 3 running; Lecture 18 (stack, calling convention), Lecture 19 (instructions, the processor
  cycle), Lecture 20 (the frame buffer), Lecture 21 (input and output).
- **Concepts.** now: `num.division`, `info.text`, `num.fixed-point`, `abi.calling-convention`, `data.array`, `seq.fsm`,
  `io.framebuffer`, `cpu.cycle`; use: `tool.prg32-cli`, `tool.debugger`.
- **Checkpoints.**
  1. Step 1: VERM1 000 and BEST 000; eating gives 001, 002; after a defeat BEST shows the score. `score_txt` reads
     30 30 33 00 after three meals.
  2. Step 2: the worm starts slower and speeds up at every meal; at score 0, eight frames between two steps.
  3. Step 3: biting yourself plays a long low note; `erase_x` and `erase_y` follow the tail.
  4. Step 4: only the changed cells are drawn: the game looks the same, and step 5 measures how much work each frame saves.
- **Common mistakes and recovery.**
  - The digits appear in the wrong order: `to_decimal` produces the units first and stores them at offset 2.
  - Strange characters instead of digits: 48, the code of '0', was not added.
  - The worm seems frozen while the game goes on: `dirty` is not set after a step, so `verm1_draw` draws nothing.
  - The game becomes unplayable: the speed must stop at `SPEED_MAX`.
- **Reflection and exit check.** Exit ticket of Lecture 22 (A22.1, A22.2). Reflect: "Which lecture of the course does each part of your game use?"

## After Part 4

Lecture 23 turns the game into a bundle for the Cartridge Store; the checklist and the exit ticket of Lecture 23 are the
last checks. Publishing is optional and personal.
