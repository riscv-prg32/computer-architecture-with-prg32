    la   t0, counter
    lw   t1, 0(t0)
    andi a2, t1, 255      # width = counter modulo 256
    li   a0, 32           # x
    li   a1, 60           # y
    li   a3, 8            # height
    li   a4, GREEN        # .equ GREEN, 0x07e0
    call prg32_gfx_rect
