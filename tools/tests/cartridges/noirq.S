.option norelax
.section .text
.global noirq_init
.global noirq_update
.global noirq_draw
noirq_init:
    ret
noirq_update:
    csrci mstatus, 8        # try to clear mstatus.MIE
    ret
noirq_draw:
    ret
