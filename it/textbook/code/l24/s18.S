    la   t0, grid
    li   t1, COLS*ROWS
    vsetvli t2, t1, e8, m1, ta, ma  # elements are bytes
    vmv.v.i v0, 0                   # a register full of zeros
1:  vsetvli t2, t1, e8, m1, ta, ma  # t2 = bytes of this turn
    vse8.v  v0, (t0)                # store t2 bytes at once
    add  t0, t0, t2
    sub  t1, t1, t2
    bnez t1, 1b
