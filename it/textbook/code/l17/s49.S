eat_sound:
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0                  # channel
    li   a1, 0                  # instrument
    li   a2, 72                 # note: C5
    li   a3, 255                # volume
    li   a4, 60                 # milliseconds
    call prg32_audio_note
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
