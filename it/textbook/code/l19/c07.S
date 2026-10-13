trap_entry:
    addi sp, sp, -16
    sw   t0, 0(sp)            # software context: save what we use
    sw   t1, 4(sp)

    csrr t0, mcause           # why are we here?
    bgez t0, exception        # top bit 0: an exception
    ...                       # top bit 1: find the device, serve it

    lw   t0, 0(sp)            # restore the context
    lw   t1, 4(sp)
    addi sp, sp, 16
    mret                      # MIE := MPIE, PC := mepc
