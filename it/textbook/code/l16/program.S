# ARC12 Computer Architecture - Lecture 16: Permanent Memory
# l16.S: what stays in the file and what lives in RAM
#
# On the screen: the title HIGH SCORE and two bars: the score of this run, which grows
# while A is held and falls back to zero when A is released, and the best score, which
# never goes down. Restart the cartridge: the title is still there, the best score is
# zero again.
# Build: python3 -m prg32 cartridge build l16.S --portable \
#            --entry-prefix l16 --name l16 --out l16.prg32
.option norelax

.equ BLACK,  0x0000
.equ WHITE,  0xffff
.equ GREEN,  0x07e0
.equ YELLOW, 0xffe0

.section .text
.global l16_init
.global l16_update
.global l16_draw

l16_init:
    ret

l16_update:
game_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    call prg32_input_read
    andi t2, a0, 0x10        # button A
    la   t0, score
    lw   a0, 0(t0)
    addi a0, a0, 1           # A held: one more point per frame
    bnez t2, 2f
    li   a0, 0               # A released: the run is over
2:  sw   a0, 0(t0)

    la   t0, best
    lw   t1, 0(t0)
    ble  a0, t1, 1f         # new score not better: skip
    sw   a0, 0(t0)          # remember the best score ... in RAM
1:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret

l16_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 20
    li   a1, 20
    la   a2, title           # read from .rodata: it is always there
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    la   t0, score
    lw   a2, 0(t0)
    andi a2, a2, 255         # width = score, at most 255 pixels
    li   a0, 20
    li   a1, 60
    li   a3, 12
    li   a4, GREEN
    call prg32_gfx_rect
    la   t0, best
    lw   a2, 0(t0)
    andi a2, a2, 255
    li   a0, 20
    li   a1, 100
    li   a3, 12
    li   a4, YELLOW
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .rodata            # part of the cartridge file
title: .asciz "HIGH SCORE"  # stored in flash: it survives

.section .data              # copied into RAM at start
best:  .word 0              # lives in RAM: it is lost
score: .word 0
