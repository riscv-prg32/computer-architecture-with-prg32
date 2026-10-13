# ARC12 Computer Architecture - Lecture 04: Representing Digital Information
# l04.S: an array in memory, an element in a register
#
# On the screen: four horizontal bars, one per element of the array (32, 11, 34, 22,
# four pixels per unit); element 2, the one the listing loads, is yellow.
# Build: python3 -m prg32 cartridge build l04.S --portable \
#            --entry-prefix l04 --name l04 --out l04.prg32
.option norelax

.equ BLACK,  0x0000
.equ WHITE,  0xffff
.equ YELLOW, 0xffe0

.section .text
.global l04_init
.global l04_update
.global l04_draw

l04_init:
    ret

l04_update:
    ret

l04_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   s0, 0               # index i, 0 to 3
1:  la   t0, scores          # t0 = ADDRESS of element 0
    mv   t1, s0              # index i
    slli t1, t1, 2           # offset = i * 4 bytes (shift left by 2)
    add  t0, t0, t1          # ADDRESS of element i
    lw   a2, 0(t0)           # VALUE of scores[i]
    slli a2, a2, 2           # width: four pixels per unit
    li   a4, WHITE
    li   t0, 2
    bne  s0, t0, 2f
    li   a4, YELLOW          # scores[2] = 34: the element of the slide
2:  li   a0, 20              # x
    slli a1, s0, 5
    addi a1, a1, 30          # y = 30 + 32 * i
    li   a3, 16              # height
    call prg32_gfx_rect
    addi s0, s0, 1
    li   t0, 4
    blt  s0, t0, 1b
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
scores: .word 32, 11, 34, 22     # four 32-bit words, 16 bytes
