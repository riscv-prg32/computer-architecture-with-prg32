    call prg32_input_read    # a0 = one bit per button
    andi t3, a0, 0x01        # bit 0: LEFT
    beqz t3, 1f              # 0: not pressed
    ...                      # 1: pressed
1:

# on the kit:
#   LEFT is a switch between pin GPIO18 and ground
#   pressed  -> the pin is at 0 volts
#   released -> the pin is at 3.3 volts
