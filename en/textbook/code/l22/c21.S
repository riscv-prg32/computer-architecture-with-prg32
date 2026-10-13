draw_full:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0
    li   a1, 0
    la   a2, title
    call draw_text
    call draw_score
    la   t0, state
    lw   t1, 0(t0)
    li   t2, TITLE
    bne  t1, t2, 1f
    li   a0, 132                # TITLE: only an invitation
    li   a1, 96
    la   a2, press_a
    call draw_text
    j    2f
