# ARC12 Computer Architecture - Lecture 06: Number Representation: Real Numbers
# l06.S: three-eighths of a pixel per frame, with integers only
#
# On the screen: a white square that crosses the screen slowly from the left: one
# pixel every 2.67 frames.
# Build: python3 -m prg32 cartridge build l06.S --portable \
#            --entry-prefix l06 --name l06 --out l06.prg32
.option norelax

.equ SPEED_Q8, 96            # 96 / 256 = 0.375 pixel per frame

.section .text
.global l06_init
.global l06_update
.global l06_draw

l06_init:
    ret

l06_update:
ball_update:
    la   t0, ball_x_q8
    lw   t1, 0(t0)           # position, in 1/256 of a pixel
    addi t1, t1, SPEED_Q8    # add a fraction of a pixel
    sw   t1, 0(t0)
    ret

l06_draw:
ball_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0
    call prg32_gfx_clear
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    srai a0, t1, 8           # x in whole pixels: drop 8 bits
    li   a1, 100
    li   a2, 8
    li   a3, 8
    li   a4, 0xffff
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret

.section .data
ball_x_q8: .word 0           # Q24.8: 24 bits of pixels, 8 bits of fraction
