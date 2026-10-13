draw_cell:                      # a0 = column, a1 = row, a2 = colour
    addi sp, sp, -16
    sw   ra, 12(sp)
    slli a0, a0, 3              # x = column * 8
    slli a1, a1, 3
    addi a1, a1, TOP            # y = row * 8 + 8
    mv   a4, a2                 # the colour is the fifth argument
    li   a2, CELL
    li   a3, CELL
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
