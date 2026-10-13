    la   t0, dirty
    li   t1, 1
    sw   t1, 0(t0)              # the screen must follow: a few cells
    bnez s2, 9f
    la   t0, score
    lw   t1, 0(t0)
    addi t1, t1, 1
    sw   t1, 0(t0)
    call place_food
    li   a2, 72                 # a short high note
    li   a4, 60
    call play_note
9:  lw   s2, 0(sp)
    lw   s1, 4(sp)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
