# ARC12 Computer Architecture - Lecture 03: History of Computing
# l03.S: the stored program: a program that reads one of its own instructions as data
#
# On the screen: a row of 32 lamps showing 0x00130313, the machine code of addi t1,
# t1, 1, and a green square: the word read is the one expected.
# Build: python3 -m prg32 cartridge build l03.S --portable \
#            --entry-prefix l03 --name l03 --out l03.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ GREEN,  0x07e0
.equ RED,    0xf800

.section .text
.global l03_init
.global l03_update
.global l03_draw

l03_init:
    ret

l03_update:
    ret

# One instruction of the program.  For von Neumann's machine it is a number in
# the same memory as the data: the program can load it like any other word.
.option push
.option norvc                # keep it 32 bits long: no compressed form
specimen:
    addi t1, t1, 1
.option pop
    ret

l03_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    la   t0, specimen        # the ADDRESS of an instruction ...
    lw   s0, 0(t0)           # ... and the instruction, read as DATA
    mv   a0, s0
    li   a1, 60
    call lamps32             # show its 32 bits
    li   t0, 0x00130313      # what the assembler should have produced
    li   a4, RED
    bne  s0, t0, 1f
    li   a4, GREEN           # equal: instructions are numbers
1:  li   a0, 152
    li   a1, 100
    li   a2, 16
    li   a3, 16
    call prg32_gfx_rect
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

# lamps32: show the 32 bits of a word as a row of lamps, bit 31 on the left.
#   a0 = the word, a1 = y of the row.  A lamp is yellow for 1, grey for 0.
lamps32:
    addi sp, sp, -32
    sw   ra, 28(sp)
    sw   s0, 24(sp)
    sw   s1, 20(sp)
    sw   s2, 16(sp)
    mv   s0, a0              # the word
    mv   s1, a1              # y
    li   s2, 0               # lamp number, 0 on the left
1:  li   t0, 31
    sub  t0, t0, s2          # lamp i shows bit 31 - i
    srl  t1, s0, t0          # bring that bit down to bit 0
    andi t1, t1, 1           # keep it, clear all the others
    li   a4, GREY            # lamp off
    beqz t1, 2f
    li   a4, YELLOW          # lamp on
2:  slli a0, s2, 3
    add  a0, a0, s2          # 9 * i
    addi a0, a0, 16          # x = 16 + 9 * i
    mv   a1, s1
    li   a2, 8
    li   a3, 8
    call prg32_gfx_rect
    addi s2, s2, 1
    li   t0, 32
    blt  s2, t0, 1b
    lw   s2, 16(sp)
    lw   s1, 20(sp)
    lw   s0, 24(sp)
    lw   ra, 28(sp)
    addi sp, sp, 32
    ret
