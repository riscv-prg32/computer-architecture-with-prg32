# ARC12 Computer Architecture - Lecture 19: Instructions and Interrupts
# l19.S: four words in memory: a function read back as machine code
#
# On the screen: four rows of 32 lamps, the machine code of lw t1, 0(t0) / addi t1,
# t1, 1 / sw t1, 0(t0) / ret, and beside each a green square: the word in memory is
# the one decoded by hand in the lecture.
# Build: python3 -m prg32 cartridge build l19.S --portable \
#            --entry-prefix l19 --name l19 --out l19.prg32
.option norelax

.equ BLACK,  0x0000
.equ GREY,   0x4208
.equ YELLOW, 0xffe0
.equ GREEN,  0x07e0
.equ RED,    0xf800

.section .text
.global l19_init
.global l19_update
.global l19_draw

l19_init:
    ret

l19_update:
    ret

# The function of Lecture 02, kept in its uncompressed 32-bit forms.
.option push
.option norvc
sample:
    lw   t1, 0(t0)           # 0x0002A303
    addi t1, t1, 1           # 0x00130313
    sw   t1, 0(t0)           # 0x0062A023
    ret                      # 0x00008067
.option pop

l19_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    sw   s1, 4(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   s0, 0               # which instruction, 0 to 3
1:  la   t0, sample
    slli t1, s0, 2           # instructions are 4 bytes apart
    add  t0, t0, t1
    lw   s1, 0(t0)           # the instruction, fetched as a datum
    mv   a0, s1
    slli a1, s0, 5
    addi a1, a1, 30          # y = 30 + 32 * s0
    call lamps32
    la   t0, expected        # compare with the encoding worked out by hand
    slli t1, s0, 2
    add  t0, t0, t1
    lw   t2, 0(t0)
    li   a4, RED
    bne  s1, t2, 2f
    li   a4, GREEN
2:  li   a0, 306
    slli a1, s0, 5
    addi a1, a1, 30
    li   a2, 8
    li   a3, 8
    call prg32_gfx_rect
    addi s0, s0, 1
    li   t0, 4
    blt  s0, t0, 1b
    lw   s1, 4(sp)
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

.section .rodata
expected: .word 0x0002A303, 0x00130313, 0x0062A023, 0x00008067
