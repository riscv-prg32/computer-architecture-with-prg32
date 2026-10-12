.option norvc
lw   t1, 0(t0)
addi t1, t1, 1
sw   t1, 0(t0)
ret
add  t2, t0, t1
addi t0, t0, 10
sub  t1, t0, t1
sub  t0, t1, t2
sw   a0, 8(sp)
