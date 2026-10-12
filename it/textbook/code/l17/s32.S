step:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)              # s0 = column of the new head
    sw   s1, 4(sp)              # s1 = row of the new head
    sw   s2, 0(sp)              # s2 = 0 when the worm eats
    la   t0, want
    lw   t1, 0(t0)
    la   t0, dir
    sw   t1, 0(t0)              # the wanted direction is now the direction
    slli t1, t1, 2              # table offset = direction * 4 bytes
    la   t0, dx
    add  t0, t0, t1
    lw   t2, 0(t0)              # t2 = dx[direction]
    la   t0, dy
    add  t0, t0, t1
    lw   t3, 0(t0)              # t3 = dy[direction]
