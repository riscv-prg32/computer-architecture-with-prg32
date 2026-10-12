place_food:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0
    li   a1, COLS-1
    call prg32_random_number    # a0 = a column, 0 .. 39
    la   t0, food_x
    sw   a0, 0(t0)
    li   a0, 0
    li   a1, ROWS-1
    call prg32_random_number    # a0 = a row, 0 .. 23
    la   t0, food_y
    sw   a0, 0(t0)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
