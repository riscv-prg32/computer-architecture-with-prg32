.section .text
.global verm1_init
.global verm1_update
.global verm1_draw

verm1_init:
    la   t0, state
    sw   zero, 0(t0)            # start on the title screen
    la   t0, prev_btn
    sw   zero, 0(t0)
    ret
