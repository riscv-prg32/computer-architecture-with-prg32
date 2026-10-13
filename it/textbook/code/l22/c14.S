    la   t0, erase_x
    sw   t3, 0(t0)              # remember the cell the tail leaves
    la   t0, erase_y
    sw   t4, 0(t0)
    la   t0, erase_on
    li   t5, 1
    sw   t5, 0(t0)
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
    call game_is_over           # the worm bit itself
    j    9f
