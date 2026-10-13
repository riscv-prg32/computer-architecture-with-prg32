new_game:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, grid
    li   t1, COLS*ROWS
1:  sb   zero, 0(t0)            # empty the grid, one byte per cell
    addi t0, t0, 1
    addi t1, t1, -1
    bnez t1, 1b
    li   t1, 0                  # i = 0, 1, 2: three cells in row 12
2:  la   t0, body_x
    add  t0, t0, t1
    addi t2, t1, 3
    sb   t2, 0(t0)              # columns 3, 4, 5
    la   t0, body_y
    add  t0, t0, t1
    li   t3, 12
    sb   t3, 0(t0)
    la   t0, grid+12*COLS
    add  t0, t0, t2
    li   t3, 1
    sb   t3, 0(t0)              # mark the cell as occupied
    addi t1, t1, 1
    li   t3, 3
    blt  t1, t3, 2b
