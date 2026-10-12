verm1_init:
    la   t0, head_x
    li   t1, 5
    sw   t1, 0(t0)              # the head starts in column 5 ...
    la   t0, head_y
    li   t1, 12
    sw   t1, 0(t0)              # ... of row 12
    la   t0, step_q8
    sw   zero, 0(t0)            # no fraction of a step yet
    ret
