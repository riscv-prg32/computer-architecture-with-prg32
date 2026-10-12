    la   t0, food_x
    lw   t1, 0(t0)
    xor  t1, t1, t4             # 0 if same column
    la   t0, food_y
    lw   t2, 0(t0)
    xor  t2, t2, t6             # 0 if same row
    or   t1, t1, t2             # 0 only if both are equal
    bnez t1, 5f                 # not on the food
    la   t0, score
    lw   t1, 0(t0)
    addi t1, t1, 1
    sw   t1, 0(t0)
    call place_food
    call eat_sound
5:  lw   ra, 12(sp)
    addi sp, sp, 16
    ret
