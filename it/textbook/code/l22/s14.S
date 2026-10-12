    la   t0, score
    lw   t3, 0(t0)
    slli t3, t3, 2
    addi t3, t3, SPEED_MIN      # speed = 32 + 4 * score, in 1/256 of a cell
    li   t4, SPEED_MAX
    ble  t3, t4, 8f
    mv   t3, t4                 # ... but never more than 96
8:  la   t0, step_q8
    lw   t1, 0(t0)
    add  t1, t1, t3             # add a fraction of a cell
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
