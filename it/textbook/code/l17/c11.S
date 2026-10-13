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
