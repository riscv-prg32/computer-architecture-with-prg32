# Verm1 (say "vermone"), a tribute to Snake - part 3: a body, rules and states
# ARC12 Computer Architecture, A.Y. 2026/27 - RISC-V assembly for PRG32
# Reference implementation contributed by Giuseppe Coviello
.option norelax
.equ BLACK, 0x0000          # RGB565 colours
.equ WHITE, 0xffff
.equ GREEN, 0x07e0          # the head
.equ BODY,  0x03e0          # the body: a darker green
.equ RED,   0xf800          # the food
.equ CELL,  8               # a cell is 8 x 8 pixels
.equ COLS,  40
.equ ROWS,  24
.equ TOP,   8
.equ SPEED_Q8, 40           # 40/256 of a cell per frame
.equ BTN_LEFT,  0x01
.equ BTN_RIGHT, 0x02
.equ BTN_UP,    0x04
.equ BTN_DOWN,  0x08
.equ BTN_A,     0x10
.equ DIR_RIGHT, 0           # bit 0 = vertical, bit 1 = backwards
.equ DIR_DOWN,  1
.equ DIR_LEFT,  2
.equ DIR_UP,    3
.equ TITLE, 0               # the three states of the game
.equ PLAY,  1
.equ OVER,  2
.section .text
.global verm1_init
.global verm1_update
.global verm1_draw

verm1_init:
    la   t0, state
    sw   zero, 0(t0)            # start on the title screen
    la   t0, prev_btn
    sw   zero, 0(t0)
    ret
verm1_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    sw   s1, 4(sp)
    call prg32_input_read
    mv   s0, a0                 # s0 = buttons held in this frame
    la   t0, prev_btn
    lw   t1, 0(t0)              # t1 = buttons held one frame ago
    sw   s0, 0(t0)
    not  t1, t1
    and  s1, s0, t1             # s1 = buttons pressed just now
    la   t0, state
    lw   t1, 0(t0)              # t1 = present state
    li   t2, PLAY
    beq  t1, t2, u_play
    andi t3, s1, BTN_A          # TITLE or OVER: wait for a new press of A
    beqz t3, u_done
    li   t2, TITLE
    beq  t1, t2, u_start
    sw   t2, 0(t0)              # OVER --A--> TITLE
    j    u_done
u_start:
    call new_game               # TITLE --A--> PLAY
    j    u_done
u_play:
    mv   a0, s0
    call play_update
u_done:
    lw   s1, 4(sp)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
new_game:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, grid
    li   t1, COLS*ROWS
1:  sb   zero, 0(t0)            # empty the grid, one byte per cell
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
    li   t1, 0                  # i = 0, 1, 2: three cells in row 12
2:  la   t0, body_x
    add  t0, t0, t1
    addi t2, t1, 3
    sb   t2, 0(t0)              # columns 3, 4, 5
    la   t0, body_y
    add  t0, t0, t1
    li   t3, 12
    sb   t3, 0(t0)
    la   t0, grid+12*COLS
    add  t0, t0, t2
    li   t3, 1
    sb   t3, 0(t0)              # mark the cell as occupied
    addi t1, t1, 1
    li   t3, 3
    blt  t1, t3, 2b
    la   t0, head_i
    li   t1, 2
    sw   t1, 0(t0)              # the head is entry 2 of the ring
    la   t0, length
    li   t1, 3
    sw   t1, 0(t0)
    la   t0, dir
    sw   zero, 0(t0)
    la   t0, want
    sw   zero, 0(t0)
    la   t0, step_q8
    sw   zero, 0(t0)
    la   t0, score
    sw   zero, 0(t0)
    call place_food
    la   t0, state
    li   t1, PLAY
    sw   t1, 0(t0)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
play_update:                    # a0 = buttons held
    addi sp, sp, -16
    sw   ra, 12(sp)
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
    sw   t2, 0(t0)
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
    sw   s0, 8(sp)              # s0 = column of the new head
    sw   s1, 4(sp)              # s1 = row of the new head
    sw   s2, 0(sp)              # s2 = 0 when the worm eats
    la   t0, want
    lw   t1, 0(t0)
    la   t0, dir
    sw   t1, 0(t0)              # the wanted direction is now the direction
    slli t1, t1, 2              # table offset = direction * 4 bytes
    la   t0, dx
    add  t0, t0, t1
    lw   t2, 0(t0)              # t2 = dx[direction]
    la   t0, dy
    add  t0, t0, t1
    lw   t3, 0(t0)              # t3 = dy[direction]
    la   t0, head_i
    lw   t5, 0(t0)              # t5 = ring index of the head
    la   t0, body_x
    add  t0, t0, t5
    lbu  s0, 0(t0)              # one byte: the column of the head
    add  s0, s0, t2
    bgez s0, 1f
    li   s0, COLS-1             # off the left edge: wrap
1:  li   t4, COLS
    blt  s0, t4, 2f
    li   s0, 0
2:  la   t0, body_y
    add  t0, t0, t5
    lbu  s1, 0(t0)
    add  s1, s1, t3
    bgez s1, 3f
    li   s1, ROWS-1
3:  li   t4, ROWS
    blt  s1, t4, 4f
    li   s1, 0
4:
    la   t0, food_x
    lw   t1, 0(t0)
    xor  t1, t1, s0
    la   t0, food_y
    lw   t2, 0(t0)
    xor  t2, t2, s1
    or   s2, t1, t2             # s2 = 0 if the new head is on the food
    la   t0, length
    lw   t1, 0(t0)
    bnez s2, 5f                 # not eating: the tail moves on
    li   t2, 255
    bge  t1, t2, 5f             # the ring is full: no more growth
    addi t1, t1, 1
    sw   t1, 0(t0)              # eating: one cell longer, the tail stays
    j    6f
5:  la   t0, head_i
    lw   t2, 0(t0)
    sub  t2, t2, t1
    addi t2, t2, 1
    andi t2, t2, 255            # ring index of the tail
    la   t0, body_x
    add  t0, t0, t2
    lbu  t3, 0(t0)
    la   t0, body_y
    add  t0, t0, t2
    lbu  t4, 0(t0)
    li   t5, COLS
    mul  t4, t4, t5
    add  t4, t4, t3             # cell number of the tail = row * 40 + column
    la   t0, grid
    add  t0, t0, t4
    sb   zero, 0(t0)            # the tail cell is free again
6:  li   t5, COLS
    mul  t4, s1, t5
    add  t4, t4, s0             # cell number of the new head
    la   t0, grid
    add  t0, t0, t4
    lbu  t1, 0(t0)
    beqz t1, 7f                 # a free cell: go on
    la   t0, state
    li   t1, OVER
    sw   t1, 0(t0)              # the worm bit itself: PLAY --> OVER
    la   t0, score
    lw   t1, 0(t0)
    la   t0, best
    lw   t2, 0(t0)
    ble  t1, t2, 9f
    sw   t1, 0(t0)              # a new best score
    j    9f
7:  li   t1, 1
    sb   t1, 0(t0)              # occupy the new cell
    la   t0, head_i
    lw   t1, 0(t0)
    addi t1, t1, 1
    andi t1, t1, 255            # the ring wraps after entry 255
    sw   t1, 0(t0)
    la   t0, body_x
    add  t0, t0, t1
    sb   s0, 0(t0)              # write the new head into the ring
    la   t0, body_y
    add  t0, t0, t1
    sb   s1, 0(t0)
    bnez s2, 9f
    la   t0, score
    lw   t1, 0(t0)
    addi t1, t1, 1
    sw   t1, 0(t0)
    call place_food
    call eat_sound
9:  lw   s2, 0(sp)
    lw   s1, 4(sp)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
place_food:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
1:  li   a0, 0
    li   a1, COLS-1
    call prg32_random_number
    mv   s0, a0                 # s0 = a column
    li   a0, 0
    li   a1, ROWS-1
    call prg32_random_number    # a0 = a row
    li   t1, COLS
    mul  t2, a0, t1
    add  t2, t2, s0
    la   t0, grid
    add  t0, t0, t2
    lbu  t3, 0(t0)
    bnez t3, 1b                 # on the worm: try again
    la   t0, food_x
    sw   s0, 0(t0)
    la   t0, food_y
    sw   a0, 0(t0)
    lw   s0, 8(sp)
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
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0
    li   a1, 0
    la   a2, title
    call draw_text
    la   t0, state
    lw   t1, 0(t0)
    li   t2, TITLE
    bne  t1, t2, 1f
    li   a0, 132                # TITLE: only an invitation
    li   a1, 96
    la   a2, press_a
    call draw_text
    j    2f
1:  call draw_score             # PLAY and OVER: the whole scene
    call draw_worm
    la   t0, food_x
    lw   a0, 0(t0)
    la   t0, food_y
    lw   a1, 0(t0)
    li   a2, RED
    call draw_cell
    la   t0, state
    lw   t1, 0(t0)
    li   t2, OVER
    bne  t1, t2, 2f
    li   a0, 124
    li   a1, 96
    la   a2, game_over
    call draw_text
2:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret

draw_text:                      # a0 = x, a1 = y, a2 = address of the string
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
draw_worm:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   s0, 0                  # s0 = i: segment 0 is the head
1:  la   t0, length
    lw   t1, 0(t0)
    bge  s0, t1, 3f
    la   t0, head_i
    lw   t1, 0(t0)
    sub  t1, t1, s0
    andi t1, t1, 255            # ring index of segment i
    la   t0, body_x
    add  t0, t0, t1
    lbu  a0, 0(t0)
    la   t0, body_y
    add  t0, t0, t1
    lbu  a1, 0(t0)
    li   a2, BODY
    bnez s0, 2f
    li   a2, GREEN              # the head is brighter
2:  call draw_cell
    addi s0, s0, 1
    j    1b
3:  lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
draw_score:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
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
2:  lw   s0, 8(sp)
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
.section .rodata                # constants: they stay in the cartridge file
title:     .asciz "VERM1"
press_a:   .asciz "PRESS A"
game_over: .asciz "GAME OVER"
dx:        .word  1, 0, -1,  0  # right, down, left, up
dy:        .word  0, 1,  0, -1
.section .data                  # variables: they live in RAM
state:     .word TITLE
prev_btn:  .word 0              # the buttons one frame ago
dir:       .word 0
want:      .word 0
step_q8:   .word 0
score:     .word 0
best:      .word 0              # lost when the power goes
food_x:    .word 0
food_y:    .word 0
head_i:    .word 0              # ring index of the head
length:    .word 0              # number of cells of the worm
body_x:    .space 256           # the ring: one byte per segment
body_y:    .space 256
grid:      .space COLS*ROWS     # one byte per cell: 1 = worm
