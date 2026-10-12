    la   t0, value
    lw   t1, 0(t0)       # the whole word        t1 = 0x12345678
    lbu  t2, 0(t0)       # the byte at address A     t2 = 0x78
    lbu  t3, 1(t0)       # the byte at address A+1   t3 = 0x56
    lbu  t4, 3(t0)       # the byte at address A+3   t4 = 0x12

.section .data
value: .word 0x12345678
