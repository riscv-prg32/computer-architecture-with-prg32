draw_text:                      # a0 = x, a1 = y, a2 = address of the string
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
