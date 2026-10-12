    li   a0, 100             # x
    li   a1, 50              # y
    li   a2, 0xf800          # red, in RGB565
    call prg32_gfx_pixel     # ... where does it go?

# what the runtime does, in principle:
    li   t0, 320
    mul  t1, a1, t0          # y * 320
    add  t1, t1, a0          # + x  =  position in the frame
    la   t2, framebuffer
    add  t2, t2, t1          # ADDRESS of that pixel
    sb   t3, 0(t2)           # store its palette index (one byte)
