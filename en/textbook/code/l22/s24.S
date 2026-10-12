game_is_over:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, state
    li   t1, OVER
    sw   t1, 0(t0)              # PLAY --> OVER
    la   t0, dirty
    li   t1, 2
    sw   t1, 0(t0)              # a new screen: draw everything
    la   t0, score
    lw   t1, 0(t0)
    la   t0, best
    lw   t2, 0(t0)
    ble  t1, t2, 1f
    sw   t1, 0(t0)              # a new best score
1:  li   a2, 36                 # a long low note
    li   a4, 400
    call play_note
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
