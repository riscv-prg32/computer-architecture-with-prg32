    la   t0, state
    lw   t1, 0(t0)              # t1 = present state
    li   t2, PLAY
    beq  t1, t2, u_play
    andi t3, s1, BTN_A          # TITLE or OVER: wait for a new press of A
    beqz t3, u_done
    li   t2, TITLE
    beq  t1, t2, u_start
    sw   t2, 0(t0)              # OVER --A--> TITLE
    j    u_done
u_start:
    call new_game               # TITLE --A--> PLAY
    j    u_done
u_play:
    mv   a0, s0
    call play_update
u_done:
    lw   s1, 4(sp)
    lw   s0, 8(sp)
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
