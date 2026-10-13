.equ SPEED_Q8, 96            # 96 / 256 = 0.375 pixel per frame

ball_update:
    la   t0, ball_x_q8
    lw   t1, 0(t0)           # position, in 1/256 of a pixel
    addi t1, t1, SPEED_Q8    # add a fraction of a pixel
    sw   t1, 0(t0)
    ret

ball_draw:
    ...
    la   t0, ball_x_q8
    lw   t1, 0(t0)
    srai a0, t1, 8           # x in whole pixels: drop 8 bits
    ...
    call prg32_gfx_rect
