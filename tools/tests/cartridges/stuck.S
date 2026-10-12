.option norelax
.section .text
.global stuck_init
.global stuck_update
.global stuck_draw
stuck_init:
    ret
stuck_update:
loop:
    j    loop
stuck_draw:
    ret
