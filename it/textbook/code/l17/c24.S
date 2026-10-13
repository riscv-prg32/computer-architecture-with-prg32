    la   t0, food_x
    lw   t1, 0(t0)
    xor  t1, t1, s0
    la   t0, food_y
    lw   t2, 0(t0)
    xor  t2, t2, s1
    or   s2, t1, t2             # s2 = 0 if the new head is on the food
    la   t0, length
    lw   t1, 0(t0)
    bnez s2, 5f                 # not eating: the tail moves on
    li   t2, 255
    bge  t1, t2, 5f             # the ring is full: no more growth
    addi t1, t1, 1
    sw   t1, 0(t0)              # eating: one cell longer, the tail stays
    j    6f
5:  la   t0, head_i
    lw   t2, 0(t0)
    sub  t2, t2, t1
    addi t2, t2, 1
    andi t2, t2, 255            # ring index of the tail
    la   t0, body_x
    add  t0, t0, t2
    lbu  t3, 0(t0)
    la   t0, body_y
    add  t0, t0, t2
    lbu  t4, 0(t0)
