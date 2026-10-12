# Verm1 (say "vermone"), a tribute to Snake - part 1: a head that crosses the world
# ARC12 Computer Architecture, A.Y. 2026/27 - RISC-V assembly for PRG32
# Reference implementation contributed by Giuseppe Coviello
#@ constants
.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40              # 320 / 8 cells across
.equ ROWS,  24              # 192 / 8 cells down
.equ TOP,   8               # the top 8 pixels are the title line
.equ SPEED_Q8, 40           # 40/256 of a cell per frame (Q24.8)

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw
#@ init
verm1_init:
    la   t0, head_x
    li   t1, 5
    sw   t1, 0(t0)              # the head starts in column 5 ...
    la   t0, head_y
    li   t1, 12
    sw   t1, 0(t0)              # ... of row 12
    la   t0, step_q8
    sw   zero, 0(t0)            # no fraction of a step yet
    ret
#@ update
verm1_update:
    la   t0, step_q8
    lw   t1, 0(t0)
    addi t1, t1, SPEED_Q8       # add a fraction of a cell
    li   t2, 256
    blt  t1, t2, 2f             # less than one whole cell: wait
    sub  t1, t1, t2             # one cell done: keep the remainder
    sw   t1, 0(t0)

    la   t0, head_x
    lw   t3, 0(t0)
    addi t3, t3, 1              # one cell to the right
    li   t4, COLS
    blt  t3, t4, 1f
    li   t3, 0                  # past the right edge: back to column 0
1:  sw   t3, 0(t0)
    ret
2:  sw   t1, 0(t0)
    ret
#@ draw
verm1_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0                  # x
    li   a1, 0                  # y
    la   a2, title              # address of the string
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    la   t0, head_x
    lw   a0, 0(t0)
    slli a0, a0, 3              # x = column * 8
    la   t0, head_y
    lw   a1, 0(t0)
    slli a1, a1, 3
    addi a1, a1, TOP            # y = row * 8 + 8
    li   a2, CELL               # width
    li   a3, CELL               # height
    li   a4, GREEN
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
#@ data
.section .rodata
title:   .asciz "VERM1"

.section .data
head_x:  .word 5                # column of the head, 0 .. COLS-1
head_y:  .word 12               # row of the head, 0 .. ROWS-1
step_q8: .word 0                # fraction of a step, in 1/256
