verm1_draw:
    la   t0, dirty
    lw   t1, 0(t0)
    beqz t1, 3f                 # nothing changed: nothing to draw
    sw   zero, 0(t0)
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   t2, 2
    beq  t1, t2, 1f
    call draw_changes           # one step: a few cells
    j    2f
1:  call draw_full              # a new screen: everything
2:  lw   ra, 12(sp)
    addi sp, sp, 16
3:  ret
