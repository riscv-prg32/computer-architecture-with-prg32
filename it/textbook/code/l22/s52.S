place_food:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
1:  li   a0, 0
    li   a1, COLS-1
    call prg32_random_number
    mv   s0, a0                 # s0 = a column
    li   a0, 0
    li   a1, ROWS-1
    call prg32_random_number    # a0 = a row
    li   t1, COLS
    mul  t2, a0, t1
    add  t2, t2, s0
    la   t0, grid
    add  t0, t0, t2
    lbu  t3, 0(t0)
    bnez t3, 1b                 # on the worm: try again
    la   t0, food_x
    sw   s0, 0(t0)
    la   t0, food_y
    sw   a0, 0(t0)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
