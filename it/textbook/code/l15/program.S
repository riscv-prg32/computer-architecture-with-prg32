# ARC12 Computer Architecture - Lecture 15: Memory
# l15.S: the same memory read as a word and as bytes
#
# On the screen: five rows of lamps. The first is the word 0x12345678 read with lw.
# The other four are the bytes at addresses A, A+1, A+2, A+3 read with lbu: 0x78,
# 0x56, 0x34, 0x12. The lowest address holds the least significant byte: little-
# endian.
# Build: python3 -m prg32 cartridge build l15.S --portable \
#            --entry-prefix l15 --name l15 --out l15.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0

.section .text
.global l15_init
.global l15_update
.global l15_draw

l15_init:
    ret

l15_update:
    ret

l15_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    call prg32_console_clear
    la   t0, value
    lw   a0, 0(t0)       # the whole word
    call prg32_console_hex32

    la   t0, value
    lw   a0, 0(t0)       # the whole word: 0x12345678
    li   a1, 20
    call lamps32
    li   s0, 0           # byte number, 0 to 3
1:  la   t0, value
    add  t0, t0, s0      # address A + s0: one byte further each time
    lbu  a0, 0(t0)       # the byte at that address, zero-extended
    slli a1, s0, 4
    slli t1, s0, 3
    add  a1, a1, t1      # 24 * s0
    addi a1, a1, 60      # y = 60 + 24 * byte number
    call lamps32
    addi s0, s0, 1
    li   t0, 4
    blt  s0, t0, 1b
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

.section .data
value: .word 0x12345678
