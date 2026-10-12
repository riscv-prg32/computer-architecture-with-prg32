    la   t0, food_x
    lw   a0, 0(t0)
    la   t0, food_y
    lw   a1, 0(t0)
    li   a2, RED
    call draw_cell
    la   t0, head_x
    lw   a0, 0(t0)
    la   t0, head_y
    lw   a1, 0(t0)
    li   a2, GREEN
    call draw_cell
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
