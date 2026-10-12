    la   t0, grid
    li   t1, COLS*ROWS
1:  sb   zero, 0(t0)            # one byte per turn of the loop
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
