# multiply by 4
slli t0, t0, 2

# divide by 2 (unsigned)
srli t0, t0, 1

# x * 10 = x*8 + x*2
slli t1, t0, 3
slli t2, t0, 1
add  t0, t1, t2
