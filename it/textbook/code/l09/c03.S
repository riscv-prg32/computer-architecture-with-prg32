# a0 and a1 hold one bit each: 0 or 1
# goal: compute a0 + a1, which needs two bits (0, 1 or 2)

    xor  t0, a0, a1      # low bit of the sum:  1 when the bits differ
    and  t1, a0, a1      # high bit, the carry: 1 when both are 1

#   a0 a1 | t1 t0
#    0  0 |  0  0        0 + 0 = 0
#    0  1 |  0  1        0 + 1 = 1
#    1  0 |  0  1        1 + 0 = 1
#    1  1 |  1  0        1 + 1 = 2  (binary 10)
