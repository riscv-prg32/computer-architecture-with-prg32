    li   t5, COLS
    mul  t4, t4, t5
    add  t4, t4, t3             # cell number of the tail = row * 40 + column
    la   t0, grid
    add  t0, t0, t4
    sb   zero, 0(t0)            # the tail cell is free again
6:  li   t5, COLS
    mul  t4, s1, t5
    add  t4, t4, s0             # cell number of the new head
    la   t0, grid
    add  t0, t0, t4
    lbu  t1, 0(t0)
    beqz t1, 7f                 # a free cell: go on
    la   t0, state
    li   t1, OVER
    sw   t1, 0(t0)              # the worm bit itself: PLAY --> OVER
    la   t0, score
    lw   t1, 0(t0)
    la   t0, best
    lw   t2, 0(t0)
    ble  t1, t2, 9f
    sw   t1, 0(t0)              # a new best score
    j    9f
