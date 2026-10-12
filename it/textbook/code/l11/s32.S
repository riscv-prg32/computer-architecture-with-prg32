# a0 = one byte        result: a0 = 1 if the number of 1 bits is odd

    srli t0, a0, 4
    xor  a0, a0, t0      # fold eight bits onto four
    srli t0, a0, 2
    xor  a0, a0, t0      # fold four bits onto two
    srli t0, a0, 1
    xor  a0, a0, t0      # fold two bits onto one
    andi a0, a0, 1       # keep the parity bit
