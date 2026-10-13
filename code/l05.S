# ARC12 Computer Architecture - Lecture 05: Number Representation: Integers
# l05.S: hold LEFT and watch a number go below zero
#
# On the screen: the 32 bits of marker_x as lamps. It starts at 2 (one lamp); each
# frame with LEFT held subtracts 1: after 2, 1 and 0 every lamp lights up, 0xFFFFFFFF,
# which is -1.
# Build: python3 -m prg32 cartridge build l05.S --portable \
#            --entry-prefix l05 --name l05 --out l05.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ BTN_LEFT, 1

.section .text
.global l05_init
.global l05_update
.global l05_draw

l05_init:
    ret

l05_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read      # a0 = button mask
    mv   t0, a0

    la   t1, marker_x
    lw   t2, 0(t1)             # t2 = marker_x, starts at 2
    andi t3, t0, BTN_LEFT      # is LEFT pressed?
    beqz t3, 1f
    addi t2, t2, -1            # one step to the left
1:  sw   t2, 0(t1)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

l05_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    call prg32_console_clear   # the number in hexadecimal, on the console
    la   t0, marker_x          # (the board and QEMU show it on the screen,
    lw   a0, 0(t0)             #  PRG32-QT in its log)
    call prg32_console_hex32
    la   t0, marker_x          # and the same number, bit by bit
    lw   a0, 0(t0)
    li   a1, 96
    call lamps32
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

.section .data
marker_x: .word 2
