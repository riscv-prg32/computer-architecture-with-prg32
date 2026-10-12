draw_worm:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    li   s0, 0                  # s0 = i: segment 0 is the head
1:  la   t0, length
    lw   t1, 0(t0)
    bge  s0, t1, 3f
    la   t0, head_i
    lw   t1, 0(t0)
    sub  t1, t1, s0
    andi t1, t1, 255            # ring index of segment i
    la   t0, body_x
    add  t0, t0, t1
    lbu  a0, 0(t0)
    la   t0, body_y
    add  t0, t0, t1
    lbu  a1, 0(t0)
    li   a2, BODY
    bnez s0, 2f
    li   a2, GREEN              # the head is brighter
2:  call draw_cell
    addi s0, s0, 1
    j    1b
3:  lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
