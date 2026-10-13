play_update:                    # a0 = buttons held
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, dir
    lw   t1, 0(t0)              # t1 = direction of the last step
    la   t0, want
    lw   t2, 0(t0)              # t2 = wanted direction, so far
    andi t3, a0, BTN_RIGHT
    beqz t3, 1f
    li   t2, DIR_RIGHT
1:  andi t3, a0, BTN_DOWN
    beqz t3, 2f
    li   t2, DIR_DOWN
2:  andi t3, a0, BTN_LEFT
    beqz t3, 3f
    li   t2, DIR_LEFT
3:  andi t3, a0, BTN_UP
    beqz t3, 4f
    li   t2, DIR_UP
4:  xor  t3, t2, t1             # opposite directions differ in bit 1 only
    li   t4, 2
    beq  t3, t4, 5f             # a U-turn: ignore the request
    sw   t2, 0(t0)
5:
