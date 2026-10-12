    la   t0, step_q8
    lw   t1, 0(t0)
    addi t1, t1, SPEED_Q8       # add a fraction of a cell
    li   t2, 256
    blt  t1, t2, 6f             # less than one whole cell: wait
    sub  t1, t1, t2
    sw   t1, 0(t0)
    call step                   # one whole cell: move
    j    7f
6:  sw   t1, 0(t0)
7:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret
