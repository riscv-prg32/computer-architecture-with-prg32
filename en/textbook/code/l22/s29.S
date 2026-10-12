draw_changes:
    addi sp, sp, -16
    sw   ra, 12(sp)
    la   t0, erase_on
    lw   t1, 0(t0)
    beqz t1, 1f
    la   t0, erase_x
    lw   a0, 0(t0)
    la   t0, erase_y
    lw   a1, 0(t0)
    li   a2, BLACK
    call draw_cell              # the cell the tail has left
1:  la   t0, old_x
    lw   a0, 0(t0)
    la   t0, old_y
    lw   a1, 0(t0)
    li   a2, BODY
    call draw_cell              # the old head is now body
    call draw_head
    call draw_food
    call draw_score
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
