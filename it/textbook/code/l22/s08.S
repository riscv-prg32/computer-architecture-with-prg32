to_decimal:                     # a0 = value 0..999, a1 = address of 3 chars
    li   t0, 10
    remu t1, a0, t0             # the units: the remainder of value / 10
    addi t1, t1, 48             # 48 is the ASCII code of '0'
    sb   t1, 2(a1)
    divu a0, a0, t0
    remu t1, a0, t0             # the tens
    addi t1, t1, 48
    sb   t1, 1(a1)
    divu a0, a0, t0
    remu t1, a0, t0             # the hundreds
    addi t1, t1, 48
    sb   t1, 0(a1)
    ret                         # a leaf function: no stack frame needed
