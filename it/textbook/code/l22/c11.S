play_note:                      # a2 = MIDI note, a4 = milliseconds
    addi sp, sp, -16
    sw   ra, 12(sp)
    li   a0, 0                  # channel
    li   a1, 0                  # instrument
    li   a3, 255                # volume
    call prg32_audio_note
    lw   ra, 12(sp)
    addi sp, sp, 16
    ret
