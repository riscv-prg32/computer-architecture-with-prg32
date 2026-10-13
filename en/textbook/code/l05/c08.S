    andi t3, t0, BTN_LEFT
    beqz t3, 1f
    addi t2, t2, -SPEED
1:  andi t3, t0, BTN_RIGHT
    beqz t3, 2f
    addi t2, t2, SPEED
2:
    bgez t2, 3f            # x < 0 ?  clamp to 0
    li   t2, 0
3:  li   t3, MAX_X         # .equ MAX_X, 304
    ble  t2, t3, 4f        # x > 304 ?  clamp to 304
    mv   t2, t3
4:
    sw   t2, 0(t1)         # one store, after all adjustments
