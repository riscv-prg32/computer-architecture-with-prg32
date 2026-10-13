verm1_init:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, head_x
    li   t1, 5
    sw   t1, 0(t0)
    la   t0, head_y
    li   t1, 12
    sw   t1, 0(t0)
    la   t0, dir
    sw   zero, 0(t0)            # moving right
    la   t0, want
    sw   zero, 0(t0)
    la   t0, step_q8
    sw   zero, 0(t0)
    la   t0, score
    sw   zero, 0(t0)
    call place_food
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
