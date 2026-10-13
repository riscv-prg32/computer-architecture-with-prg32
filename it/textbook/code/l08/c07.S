# "idle" when NEITHER LEFT NOR RIGHT is pressed
    andi t3, t0, 0x03        # 0x03 = LEFT | RIGHT: keep both bits
    beqz t3, idle            # all zero: (LEFT + RIGHT)' is true

# the long way: test each button, the result is the same
    andi t3, t0, 0x01
    bnez t3, moving          # LEFT pressed: not idle
    andi t3, t0, 0x02
    bnez t3, moving          # RIGHT pressed: not idle
    j    idle                # LEFT' . RIGHT'
