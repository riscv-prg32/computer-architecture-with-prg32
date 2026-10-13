verm1_update:
    addi sp, sp, -16
    sw   ra, 12(sp)
    sw   s0, 8(sp)
    sw   s1, 4(sp)
    call prg32_input_read
    mv   s0, a0                 # s0 = buttons held in this frame
    la   t0, prev_btn
    lw   t1, 0(t0)              # t1 = buttons held one frame ago
    sw   s0, 0(t0)
    not  t1, t1
    and  s1, s0, t1             # s1 = buttons pressed just now
