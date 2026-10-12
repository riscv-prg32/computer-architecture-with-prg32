step:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, want
    lw   t1, 0(t0)
    la   t0, dir
    sw   t1, 0(t0)              # the wanted direction is now the direction
    slli t1, t1, 2              # table offset = direction * 4 bytes
    la   t0, dx
    add  t0, t0, t1
    lw   t2, 0(t0)              # t2 = dx[direction]: -1, 0 or +1
    la   t0, dy
    add  t0, t0, t1
    lw   t3, 0(t0)              # t3 = dy[direction]
