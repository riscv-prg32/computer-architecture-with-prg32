1:  call draw_worm              # PLAY and OVER: the whole scene
    call draw_food
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
