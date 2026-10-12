# Verm1 (say "vermone"), a tribute to Snake - part 2: steering and food
# ARC12 Computer Architecture, A.Y. 2026/27 - RISC-V assembly for PRG32
# Reference implementation contributed by Giuseppe Coviello
.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0
.equ RED,   0xf800
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40
.equ ROWS,  24
.equ TOP,   8
.equ SPEED_Q8, 40           # 40/256 of a cell per frame
.equ BTN_LEFT,  0x01        # one bit per button
.equ BTN_RIGHT, 0x02
.equ BTN_UP,    0x04
.equ BTN_DOWN,  0x08
.equ DIR_RIGHT, 0           # a direction is a 2-bit code:
.equ DIR_DOWN,  1           #   bit 0 = vertical
.equ DIR_LEFT,  2           #   bit 1 = backwards
.equ DIR_UP,    3

.section .text
.global verm1_init
.global verm1_update
.global verm1_draw
verm1_init:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, head_x
    li   t1, 5
    sw   t1, 0(t0)
    la   t0, head_y
    li   t1, 12
    sw   t1, 0(t0)
    la   t0, dir
    sw   zero, 0(t0)            # moving right
    la   t0, want
    sw   zero, 0(t0)
    la   t0, step_q8
    sw   zero, 0(t0)
    la   t0, score
    sw   zero, 0(t0)
    call place_food
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
verm1_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read       # a0 = one bit per button
    la   t0, dir
    lw   t1, 0(t0)              # t1 = direction of the last step
    la   t0, want
    lw   t2, 0(t0)              # t2 = wanted direction, so far
    andi t3, a0, BTN_RIGHT
    beqz t3, 1f
    li   t2, DIR_RIGHT
1:  andi t3, a0, BTN_DOWN
    beqz t3, 2f
    li   t2, DIR_DOWN
2:  andi t3, a0, BTN_LEFT
    beqz t3, 3f
    li   t2, DIR_LEFT
3:  andi t3, a0, BTN_UP
    beqz t3, 4f
    li   t2, DIR_UP
4:  xor  t3, t2, t1             # opposite directions differ in bit 1 only
    li   t4, 2
    beq  t3, t4, 5f             # a U-turn: ignore the request
    sw   t2, 0(t0)              # remember it for the next step
5:
    la   t0, step_q8
    lw   t1, 0(t0)
    addi t1, t1, SPEED_Q8       # add a fraction of a cell
    li   t2, 256
    blt  t1, t2, 6f             # less than one whole cell: wait
    sub  t1, t1, t2
    sw   t1, 0(t0)
    call step                   # one whole cell: move
    j    7f
6:  sw   t1, 0(t0)
7:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret
step:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, want
    lw   t1, 0(t0)
    la   t0, dir
    sw   t1, 0(t0)              # the wanted direction is now the direction
    slli t1, t1, 2              # table offset = direction * 4 bytes
    la   t0, dx
    add  t0, t0, t1
    lw   t2, 0(t0)              # t2 = dx[direction]: -1, 0 or +1
    la   t0, dy
    add  t0, t0, t1
    lw   t3, 0(t0)              # t3 = dy[direction]
    la   t0, head_x
    lw   t4, 0(t0)
    add  t4, t4, t2
    bgez t4, 1f
    li   t4, COLS-1             # off the left edge: wrap
1:  li   t5, COLS
    blt  t4, t5, 2f
    li   t4, 0                  # off the right edge: wrap
2:  sw   t4, 0(t0)              # t4 = new column
    la   t0, head_y
    lw   t6, 0(t0)
    add  t6, t6, t3
    bgez t6, 3f
    li   t6, ROWS-1
3:  li   t5, ROWS
    blt  t6, t5, 4f
    li   t6, 0
4:  sw   t6, 0(t0)              # t6 = new row
    la   t0, food_x
    lw   t1, 0(t0)
    xor  t1, t1, t4             # 0 if same column
    la   t0, food_y
    lw   t2, 0(t0)
    xor  t2, t2, t6             # 0 if same row
    or   t1, t1, t2             # 0 only if both are equal
    bnez t1, 5f                 # not on the food
    la   t0, score
    lw   t1, 0(t0)
    addi t1, t1, 1
    sw   t1, 0(t0)
    call place_food
    call eat_sound
5:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret
place_food:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0
    li   a1, COLS-1
    call prg32_random_number    # a0 = a column, 0 .. 39
    la   t0, food_x
    sw   a0, 0(t0)
    li   a0, 0
    li   a1, ROWS-1
    call prg32_random_number    # a0 = a row, 0 .. 23
    la   t0, food_y
    sw   a0, 0(t0)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
eat_sound:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0                  # channel
    li   a1, 0                  # instrument
    li   a2, 72                 # note: C5
    li   a3, 255                # volume
    li   a4, 60                 # milliseconds
    call prg32_audio_note
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
verm1_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0
    li   a1, 0
    la   a2, title
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    li   s0, 0                  # s0 = i: one mark per point
1:  la   t0, score
    lw   t1, 0(t0)
    bge  s0, t1, 2f
    slli a0, s0, 2
    addi a0, a0, 56             # x = 56 + 4 * i
    li   a1, 1
    li   a2, 3
    li   a3, 6
    li   a4, WHITE
    call prg32_gfx_rect
    addi s0, s0, 1
    j    1b
2:
    la   t0, food_x
    lw   a0, 0(t0)
    la   t0, food_y
    lw   a1, 0(t0)
    li   a2, RED
    call draw_cell
    la   t0, head_x
    lw   a0, 0(t0)
    la   t0, head_y
    lw   a1, 0(t0)
    li   a2, GREEN
    call draw_cell
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
draw_cell:                      # a0 = column, a1 = row, a2 = colour
    addi sp, sp, -16
    sw   ra, 12(sp)
    slli a0, a0, 3              # x = column * 8
    slli a1, a1, 3
    addi a1, a1, TOP            # y = row * 8 + 8
    mv   a4, a2                 # the colour is the fifth argument
    li   a2, CELL
    li   a3, CELL
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
.section .rodata
title:   .asciz "VERM1"
dx:      .word  1, 0, -1,  0    # right, down, left, up
dy:      .word  0, 1,  0, -1

.section .data
head_x:  .word 5
head_y:  .word 12
dir:     .word 0                # direction of the last step
want:    .word 0                # direction asked by the player
step_q8: .word 0
score:   .word 0
food_x:  .word 20
food_y:  .word 12
