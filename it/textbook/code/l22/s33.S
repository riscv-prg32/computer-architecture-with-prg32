draw_food:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, food_x
    lw   a0, 0(t0)
    la   t0, food_y
    lw   a1, 0(t0)
    li   a2, RED
    call draw_cell
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
