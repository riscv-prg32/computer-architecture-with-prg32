    la   t0, head_i
    li   t1, 2
    sw   t1, 0(t0)              # the head is entry 2 of the ring
    la   t0, length
    li   t1, 3
    sw   t1, 0(t0)
    la   t0, dir
    sw   zero, 0(t0)
    la   t0, want
    sw   zero, 0(t0)
    la   t0, step_q8
    sw   zero, 0(t0)
    la   t0, score
    sw   zero, 0(t0)
    call place_food
    la   t0, state
    li   t1, PLAY
    sw   t1, 0(t0)
    la   t0, dirty
    li   t1, 2
    sw   t1, 0(t0)              # a new screen: draw everything
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
