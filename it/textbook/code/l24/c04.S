    add  t0, t1, t2        # i1
    add  t3, t0, t4        # i2 needs the t0 of i1: it must wait
    lw   t5, 0(t6)         # i3 is independent: it could go now
    beqz t3, skip          # i4: which way? known only after i2
    addi t5, t5, 1         # i5: executed, or not?
skip:
