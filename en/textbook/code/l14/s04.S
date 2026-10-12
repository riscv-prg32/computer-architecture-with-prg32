# a0 = the byte to send, most significant bit first

    li   t0, 8               # eight bits to go
1:  srli t1, a0, 7           # bring bit 7 down to bit 0
    andi t1, t1, 1           # t1 = the bit to put on the wire
    ...                      # drive the data line with t1,
    ...                      # then pulse the clock line
    slli a0, a0, 1           # shift left: the next bit moves up
    addi t0, t0, -1
    bnez t0, 1b
