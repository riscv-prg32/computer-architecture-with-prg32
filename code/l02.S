# ARC12 Computer Architecture - Lecture 02: First Contact: RISC-V Assembly on PRG32
# l02.S: the four steps of the lecture in one file
#
# On the screen: HELLO PRG32 and, under it, a green bar that grows by one pixel per
# frame and starts again at 256.
# Build: python3 -m prg32 cartridge build l02.S --portable \
#            --entry-prefix first --name first --out first.prg32
.option norelax

.equ BLACK, 0x0000
.equ WHITE, 0xffff
.equ GREEN, 0x07e0

.section .text
.global first_init
.global first_update
.global first_draw

first_init:                  # step 1: a function that returns
    ret

first_update:                # step 3: a value that survives between frames
    # A leaf function: it calls nothing, so it needs no stack frame.
    la   t0, counter         # t0 = ADDRESS of counter
    lw   t1, 0(t0)           # t1 = VALUE stored there   (load)
    addi t1, t1, 1           # one tick per frame        (modify)
    sw   t1, 0(t0)           # write it back             (store)
    ret

first_draw:                  # step 2: say hello
    addi sp, sp, -16         # prologue: a 16-byte frame
    sw   ra, 12(sp)          # save the return address
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 32              # x
    li   a1, 40              # y
    la   a2, title           # address of the string
    li   a3, WHITE           # foreground
    li   a4, BLACK           # background
    call prg32_gfx_text8

    la   t0, counter         # step 4: make the counter visible
    lw   t1, 0(t0)
    andi a2, t1, 255         # width = counter modulo 256
    li   a0, 32              # x
    li   a1, 60              # y
    li   a3, 8               # height
    li   a4, GREEN
    call prg32_gfx_rect

    lw   ra, 12(sp)          # epilogue: restore ra
    addi sp, sp, 16          # release the frame
    ret

.section .rodata
title:
    .asciz "HELLO PRG32"

.section .data
counter: .word 0
