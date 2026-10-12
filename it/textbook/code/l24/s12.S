# as written                 # as executed, after renaming
    lw   t0, 0(a0)                lw   p41, 0(a0)
    addi t0, t0, 1                addi p42, p41, 1
    sw   t0, 0(a0)                sw   p42, 0(a0)
    lw   t0, 4(a0)                lw   p43, 4(a0)      # a new t0
    addi t0, t0, 1                addi p44, p43, 1
    sw   t0, 4(a0)                sw   p44, 4(a0)
