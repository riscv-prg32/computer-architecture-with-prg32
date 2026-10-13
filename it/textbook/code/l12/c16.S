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
