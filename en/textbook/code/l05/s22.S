# neg t0, t1 is a pseudo-instruction:
sub  t0, zero, t1

# the same thing by hand:
not  t0, t1        # complement
addi t0, t0, 1     # plus one
