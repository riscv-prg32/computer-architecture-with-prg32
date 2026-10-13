# parallel to serial, LSB first
andi t1, a0, 1     # take bit 0
srli a0, a0, 1     # next bit

# serial to parallel, MSB first
slli a1, a1, 1     # make room
or   a1, a1, t1    # insert bit
