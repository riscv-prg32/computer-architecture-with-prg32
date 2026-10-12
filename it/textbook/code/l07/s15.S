verm1_draw:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, BLACK
    call prg32_gfx_clear
    li   a0, 0                  # x
    li   a1, 0                  # y
    la   a2, title              # address of the string
    li   a3, WHITE
    li   a4, BLACK
    call prg32_gfx_text8
    la   t0, head_x
    lw   a0, 0(t0)
    slli a0, a0, 3              # x = column * 8
    la   t0, head_y
    lw   a1, 0(t0)
    slli a1, a1, 3
    addi a1, a1, TOP            # y = row * 8 + 8
    li   a2, CELL               # width
    li   a3, CELL               # height
    li   a4, GREEN
    call prg32_gfx_rect
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
