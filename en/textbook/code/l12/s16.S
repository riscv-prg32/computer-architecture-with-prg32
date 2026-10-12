    la   t0, head_x
    lw   t4, 0(t0)
    add  t4, t4, t2
    bgez t4, 1f
    li   t4, COLS-1             # off the left edge: wrap
1:  li   t5, COLS
    blt  t4, t5, 2f
    li   t4, 0                  # off the right edge: wrap
2:  sw   t4, 0(t0)              # t4 = new column
    la   t0, head_y
    lw   t6, 0(t0)
    add  t6, t6, t3
    bgez t6, 3f
    li   t6, ROWS-1
3:  li   t5, ROWS
    blt  t6, t5, 4f
    li   t6, 0
4:  sw   t6, 0(t0)              # t6 = new row
