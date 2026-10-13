verm1_update:
    la   t0, step_q8
    lw   t1, 0(t0)
    addi t1, t1, SPEED_Q8       # add a fraction of a cell
    li   t2, 256
    blt  t1, t2, 2f             # less than one whole cell: wait
    sub  t1, t1, t2             # one cell done: keep the remainder
    sw   t1, 0(t0)

    la   t0, head_x
    lw   t3, 0(t0)
    addi t3, t3, 1              # one cell to the right
    li   t4, COLS
    blt  t3, t4, 1f
    li   t3, 0                  # past the right edge: back to column 0
1:  sw   t3, 0(t0)
    ret
2:  sw   t1, 0(t0)
    ret
