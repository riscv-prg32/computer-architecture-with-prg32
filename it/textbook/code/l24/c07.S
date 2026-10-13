    la   t0, numbers
    li   t1, 16                 # sixteen words to add
    vsetvli t2, zero, e32, m1, ta, ma
    vmv.v.i v1, 0               # v1 = partial sums, one per lane
1:  vsetvli t2, t1, e32, m1, tu, ma
    vle32.v v2, (t0)            # load t2 words
    vadd.vv v1, v1, v2          # add them, lane by lane
    slli t3, t2, 2
    add  t0, t0, t3
    sub  t1, t1, t2
    bnez t1, 1b
    vsetvli t2, zero, e32, m1, ta, ma
    vmv.s.x v3, zero
    vredsum.vs v3, v1, v3       # add the lanes together
    vmv.x.s a0, v3
