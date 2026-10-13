    call prg32_input_read    # a0 = all the buttons, one bit each
    mv   t0, a0              # keep our own copy

    andi t3, t0, 0x01        # keep only bit 0: LEFT
    beqz t3, 1f              # zero: LEFT is not pressed
    addi t2, t2, -2          # move left
1:
    andi t3, t0, 0x02        # keep only bit 1: RIGHT
    beqz t3, 2f
    addi t2, t2, 2           # move right
2:
