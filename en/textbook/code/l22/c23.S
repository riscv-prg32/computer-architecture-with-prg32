draw_head:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, head_i
    lw   t1, 0(t0)
    la   t0, body_x
    add  t0, t0, t1
    lbu  a0, 0(t0)
    la   t0, body_y
    add  t0, t0, t1
    lbu  a1, 0(t0)
    li   a2, GREEN
    call draw_cell
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
