    la   t0, head_i
    lw   t5, 0(t0)              # t5 = ring index of the head
    la   t0, body_x
    add  t0, t0, t5
    lbu  s0, 0(t0)              # one byte: the column of the head
    add  s0, s0, t2
    bgez s0, 1f
    li   s0, COLS-1             # off the left edge: wrap
1:  li   t4, COLS
    blt  s0, t4, 2f
    li   s0, 0
2:  la   t0, body_y
    add  t0, t0, t5
    lbu  s1, 0(t0)
    add  s1, s1, t3
    bgez s1, 3f
    li   s1, ROWS-1
3:  li   t4, ROWS
    blt  s1, t4, 4f
    li   s1, 0
4:
