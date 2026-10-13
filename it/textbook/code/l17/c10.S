verm1_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0
    li   a1, 0
    la   a2, title
    call draw_text
    la   t0, state
    lw   t1, 0(t0)
    li   t2, TITLE
    bne  t1, t2, 1f
    li   a0, 132                # TITLE: only an invitation
    li   a1, 96
    la   a2, press_a
    call draw_text
    j    2f
1:  call draw_score             # PLAY and OVER: the whole scene
    call draw_worm
    la   t0, food_x
    lw   a0, 0(t0)
    la   t0, food_y
    lw   a1, 0(t0)
    li   a2, RED
    call draw_cell
