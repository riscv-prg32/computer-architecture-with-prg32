    # s0 = bit number, 0 to 6
    la   t0, buttons
    lw   t1, 0(t0)           # t1 = the button mask
    srl  t1, t1, s0          # bring bit number s0 down to bit 0
    andi t1, t1, 1           # keep it, clear all the others
    li   a4, GREY            # lamp off
    beqz t1, 1f
    li   a4, YELLOW          # lamp on
1:  call prg32_gfx_rect
