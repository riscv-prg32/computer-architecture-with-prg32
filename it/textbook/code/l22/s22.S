7:  li   t1, 1
    sb   t1, 0(t0)              # occupy the new cell
    la   t0, head_i
    lw   t1, 0(t0)
    addi t1, t1, 1
    andi t1, t1, 255            # the ring wraps after entry 255
    sw   t1, 0(t0)
    la   t0, body_x
    add  t0, t0, t1
    sb   s0, 0(t0)              # write the new head into the ring
    la   t0, body_y
    add  t0, t0, t1
    sb   s1, 0(t0)
