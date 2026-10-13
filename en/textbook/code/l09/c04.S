# a0 = A, a1 = B, a2 = Cin   (each 0 or 1)
# result: a3 = S, a4 = Cout

    xor  t0, a0, a1      # t0   = A xor B
    xor  a3, t0, a2      # S    = A xor B xor Cin
    and  t1, a0, a1      # t1   = A . B
    and  t2, t0, a2      # t2   = (A xor B) . Cin
    or   a4, t1, t2      # Cout = A . B + (A xor B) . Cin
