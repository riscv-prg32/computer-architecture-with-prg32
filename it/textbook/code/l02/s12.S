first_update:
    # A leaf function: it calls nothing,
    # so it needs no stack frame.
    la   t0, counter      # t0 = ADDRESS of counter
    lw   t1, 0(t0)        # t1 = VALUE stored there   (load)
    addi t1, t1, 1        # one tick per frame        (modify)
    sw   t1, 0(t0)        # write it back             (store)
    ret

.section .data
counter: .word 0
