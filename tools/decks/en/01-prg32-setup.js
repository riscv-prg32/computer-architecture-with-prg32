// Lecture 01 - PRG32 and PRG32-QT: the platform in detail, and a step-by-step installation on Windows, macOS and Linux.
// New deck.  Sources: PRG32 README and docs/usage, PRG32-QT README and docs (PLATFORMS, NETWORKING, DEBUGGING), textbook chapters setup and prg32qt.
// The cartridge commands of step 3 were run on macOS against a running PRG32-QT (http://localhost:8080).
Deck({
  n: "01", file: "01-Computer_Architecture-PRG32_and_PRG32-QT_Setup",
  title: "PRG32 and PRG32-QT: Setting Up Your Workshop", short: "PRG32 setup",
  sub: "The platform in detail, and a step-by-step installation on Windows, macOS and Linux",
  quote: ["Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", "attributed to Abraham Lincoln"],
  cover: "prg32qt_debugger.png",
  notes: "New in 2026/27: a hands-on lecture. Students bring a laptop; at the end everyone has PRG32-QT running and a cartridge built by their own toolchain. The steps come from the README of PRG32, the documentation of PRG32-QT and chapter 3 of the textbook. The cartridge commands of step 3 were run on macOS against PRG32-QT; the Windows and Linux installations follow the official instructions and were not run for these slides. Ask the students to do the long download of step 2 at home, before the lecture: the classroom network will not survive sixty copies of ESP-IDF. Version numbers are those of October 2026: check the release pages before class.",
  slides: [
    O("What you will have by the end", [
      "A clear picture of the pieces of PRG32: runtime, cartridge, tools, hosts, Store",
      "PRG32-QT installed on your laptop: you can play any cartridge and look inside it",
      "The RISC-V toolchain installed and checked: you can build cartridges of your own",
      "One cartridge built by you, running in PRG32-QT, stopped in the debugger",
      "A list of what to do when something does not work",
    ]),
    G("Four levels: install what you need", ["Level", "You install", "You can", "Needed"], [
      ["1", "PRG32-QT", "play cartridges, download from the Store, use the debugger", "by everybody, today"],
      ["2", "ESP-IDF and the PRG32 repository", "build your own cartridges from assembly or C", "by everybody, before Lecture 02"],
      ["3", "the QEMU emulator", "run the real firmware on your laptop", "optional"],
      ["4", "the kit: an ESP32-C6 board", "run on real hardware", "optional"],
    ], "Level 1 takes five minutes. Level 2 is a large download and takes from half an hour to an hour: at home, on a good connection. Levels 3 and 4 are for the curious, and for the laboratory.", { widths: [1.1, 4.0, 5.2, 2.9], caption: "The course can be followed with levels 1 and 2 only. No board is required." }),

    H("The platform, in detail", "What PRG32 is made of, before you install it."),
    T("PRG32: a runtime, a file format, a set of tools", [
      "An open-source platform for teaching RISC-V assembly and C, developed at Parthenope",
      ["Four things, one name", ["a resident firmware: the program that owns the screen, the buttons and the sound", "a cartridge format: your game as one small file, .prg32", "a tool on your laptop: python3 -m prg32 builds, uploads, packages", "a Cartridge Store: where finished games are shared"]],
      "Your code runs as real 32-bit RISC-V machine code, RV32IMAC",
      "The contract between your game and the runtime is three functions: init, update, draw",
    ], "github.com/riscv-prg32/PRG32. The runtime calls init once, then update and draw at every frame: Lecture 02 starts from this contract.", { img: "prg32_logo.png", cap: "github.com/riscv-prg32/PRG32" }),
    F("From your file to the screen", ["verm1.S|your source: assembly or C", "compiler|the RISC-V toolchain turns it into machine code", "verm1.prg32|a cartridge: code, data, a header", "upload|over the network, to a host", "runtime|calls init, update, draw"],
      "The first three boxes are on your laptop, and need level 2. The last two are a host: PRG32-QT, QEMU or the board.", "The compiler is riscv32-esp-elf-gcc, installed by ESP-IDF. The cartridge is loaded at address 0x40800000 and reaches the runtime through a table of functions, the ABI: this is why the same file runs on three different hosts."),
    T("The kit: a console on a breadboard", [
      "An Espressif ESP32-C6: one RISC-V core at 160 MHz, with Wi-Fi",
      "A 2.8 inch colour display, 320 by 240 pixels: games draw in a viewport of 320 by 200",
      "One or two small audio amplifiers, a joystick and buttons, wired straight to the pins of the chip",
      "A game reaches it over Wi-Fi: the board creates a network called PRG32, and you upload the cartridge to it",
      "You do not need one to follow the course: everything runs on your laptop",
    ], "Display: ILI9341 over SPI. Audio: MAX98357A over I2S. The bill of materials and the wiring are in docs/hardware of the PRG32 repository. The laboratory has kits.", { img: "kit_breadboard.png", cap: "The PRG32 kit on a breadboard", wide: true }),
    G("Three ways to run the same cartridge", ["", "ESP32-C6 board", "Espressif QEMU", "PRG32-QT"], [
      ["How code runs", "natively on the chip", "natively on an emulated ESP32-C3", "interpreted RV32IMAC guest"],
      ["Needs a toolchain", "yes (ESP-IDF)", "yes (ESP-IDF)", "no, to play and debug"],
      ["Cartridge arrives by", "Wi-Fi upload, Store", "staging into the flash image", "file import, Store, HTTP upload"],
      ["Instruction stepping", "with JTAG and GDB", "with GDB", "built-in debugger"],
      ["Runs on", "the hardware kit", "Windows, Linux, macOS", "desktop, Raspberry Pi, iOS, Android, TV"],
    ], "Use the board when you want the truth about time, and PRG32-QT when you want the truth about a register. Why an ESP32-C3 in QEMU? Espressif maintains a mature emulator with graphics for that chip; it executes the same RISC-V instructions, and the cartridge does not notice.", { widths: [2.2, 3, 3.4, 3.6], caption: "The cartridge file is the same in every column." }),
    T("PRG32-QT: the console on your laptop", [
      "An application for Windows, macOS, Linux, Raspberry Pi, phones, tablets and televisions",
      "It contains an interpreter of RV32IMAC: it executes your cartridge instruction by instruction, and offers it the same functions as the firmware",
      ["Three speeds, in Settings", ["Accurate: timed like the ESP32-C6, the default", "Optimal: 30 frames per second", "Unlimited: as fast as your laptop goes"]],
      "A Store browser, to download and run published cartridges",
      "A debugger: assembly, registers, memory, breakpoints, one instruction at a time",
    ], "github.com/riscv-prg32/PRG32-QT. Accurate charges each instruction and each call a cost in cycles of a 160 MHz clock: not a cycle-exact model of the chip, but close enough to see when a frame is late.", { img: "prg32qt_player.png", cap: "PRG32-QT playing a cartridge", wide: true }),
    G("The controls, on a keyboard", ["On the kit", "In PRG32-QT", "In QEMU"], [
      ["Joystick", "arrow keys, or W A S D", "the same, typed in the terminal"],
      ["Button A", "Z or J", "Z or J"],
      ["Button B", "X or K", "X or K"],
      ["Start / Select", "Enter or Space", "Enter or Space"],
      ["Leave the game", "Escape: back to Setup", "close QEMU"],
    ], "A USB or Bluetooth game controller is recognised by PRG32-QT when it is plugged in. QEMU reads the keyboard from the terminal that launched it, not from the window with the picture: the classic surprise.", { widths: [3.4, 4.6, 5.0] }),

    H("Step 1: install PRG32-QT", "Five minutes. No compiler, no account."),
    G("Download the installer for your system", ["Your system", "File to download", "Kind"], [
      ["Windows 10 or 11", "PRG32-QT-0.4.1-Windows-X64-Setup.exe", "installer"],
      ["macOS, Apple Silicon (M1 and later)", "PRG32-QT-0.4.1-macOS-ARM64.dmg", "disk image"],
      ["macOS, Intel", "PRG32-QT-0.4.1-macOS-Intel-X64.dmg", "disk image"],
      ["Linux, 64-bit PC", "PRG32-QT-0.4.1-Linux-X64.deb", "Debian package"],
      ["Raspberry Pi OS, 64-bit", "PRG32-QT-0.4.1-Raspberry-Pi-OS-ARM64.deb", "Debian package"],
    ], "From github.com/riscv-prg32/PRG32-QT, Releases, the latest one. 0.4.1 is the version of October 2026: the file names follow this pattern with the current number. The file SHA256SUMS-platforms.txt lists the checksums. Android and Android TV packages are on the same page.", { widths: [4.4, 6.4, 2.4], mono: [1], caption: "github.com/riscv-prg32/PRG32-QT, then Releases. Take the latest version." }),
    S("PRG32-QT on Windows", [
      ["Download", "The file ending in Windows-X64-Setup.exe, from the Releases page"],
      ["Run it", "If Windows shows a blue SmartScreen warning: More info, then Run anyway"],
      ["Install", "Accept the proposed folder: the installer brings everything the program needs"],
      ["Start", "PRG32, from the Start menu. If the firewall asks, allow it on private networks"],
    ], "The installer contains the Qt libraries and the compiler runtime: nothing else has to be installed. The firewall question appears because PRG32-QT listens on port 8080 for cartridges sent by the tools: step 3 uses it."),
    S("PRG32-QT on macOS", [
      ["Which Mac?", "Apple menu, About This Mac: Chip Apple M... means ARM64; Processor Intel means X64"],
      ["Install", "Open the .dmg and drag PRG32 onto the Applications folder"],
      ["First start", "Right-click PRG32 and choose Open; or System Settings, Privacy and Security, Open Anyway"],
      ["Allow", "Accept incoming connections and local-network access when macOS asks"],
    ], "The first-start step is needed if macOS says that the developer cannot be verified: the application is distributed outside the App Store. The two permissions are for the device interface on port 8080 and its announcement on the local network."),
    K("PRG32-QT on Linux", `# Debian 13, Ubuntu 25.04 and later, or another system with Qt 6.5 or newer
cd ~/Downloads
sudo apt install ./PRG32-QT-0.4.1-Linux-X64.deb
PRG32 &

# On older systems (Ubuntu 24.04 has Qt 6.4: too old): build from source
sudo apt install git cmake ninja-build g++ qt6-base-dev qt6-declarative-dev \\
    qt6-multimedia-dev qt6-websockets-dev
git clone https://github.com/riscv-prg32/PRG32-QT
cd PRG32-QT
./scripts/build-linux.sh`, [
      "apt install with ./ installs the file and what it needs",
      "The program is /usr/bin/PRG32",
      "It needs Qt 6.5 or newer: check your distribution",
      "Building from source needs a recent Qt as well",
    ], "The package depends on the Qt 6 QML, Multimedia and WebSockets packages of the distribution. Where the system Qt is older than 6.5, install Qt with the online installer of qt.io and build with it. On Raspberry Pi OS use the ARM64 package, or scripts/build-raspbian.sh.", "sh", { wide: true }),
    X("Run it: your first cartridge, from the Store", [
      "Start PRG32-QT: the Setup screen appears, the same that the firmware shows on the kit",
      "Choose Browse Store: the catalogue of the Cartridge Store is downloaded",
      "Pick a game, download it, and choose Run Cartridge",
      "Play it with the arrow keys, Z and X. Escape brings you back to Setup",
      "Open Settings: look at the three performance profiles and at the layout choices",
    ], "A game from the Store runs on your laptop. This is level 1: from now on you can run any cartridge, and look inside it.",
      "The default Store is store.prg32.uniparthenope.it. If the list stays empty the laptop is not reaching the Internet, or a proxy is in the way: Settings shows the Store address."),
    I("What you should see", [["menu_main.png", "The Setup menu"], ["prg32qt_store.png", "Browse Store"], ["prg32qt_settings.png", "Settings"]],
      "Screens from the PRG32 and PRG32-QT documentation (macOS).", "The same three screens on every system. If you are here, step 1 is done."),

    H("Step 2: install the toolchain", "ESP-IDF, the PRG32 repository, and a doctor."),
    T("One idea behind every installation", [
      "The compiler for the ESP32 family comes with ESP-IDF, the development kit of Espressif",
      "PRG32 needs ESP-IDF 5.4 or newer, installed for two chips: esp32c6, the kit, and esp32c3, the emulator",
      "ESP-IDF is not active by itself: every new terminal must switch it on before the tools work",
      "Then one command does everything: python3 -m prg32",
      "Almost every installation problem is ESP-IDF not being active in the terminal you are typing in",
    ], "On Windows activating means opening the ESP-IDF PowerShell; on macOS and Linux, running export.sh. The symptom is always the same: idf.py, or riscv32-esp-elf-gcc, not found.", { box: "idf.py: command not found\n\nESP-IDF is not active in this terminal. Activate it and try again.", head: "The message you will meet" }),
    K("The toolchain on Windows", `# 1. Install Git for Windows (git-scm.com) and Python 3 (python.org)
# 2. Run the ESP-IDF Tools Installer (dl.espressif.com/dl/esp-idf):
#      - choose an ESP-IDF release 5.4 or newer
#      - select the targets esp32c3 and esp32c6
#      - optional: tick the QEMU RISC-V emulator
# 3. Open the shortcut "ESP-IDF PowerShell" that the installer created
# 4. In that window:

cd $HOME\\Documents
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
pip install pyaudio zeroconf
python -m prg32 doctor`, [
      "Use the ESP-IDF PowerShell, never a plain terminal",
      "On Windows the command is python, not python3",
      "pip installs into the ESP-IDF environment: that is intended",
      "doctor checks the installation: see the next slides",
    ], "From the README of PRG32. An alternative for those who prefer an editor: Visual Studio Code with the Espressif ESP-IDF extension, which installs the same toolchain. Avoid folders with spaces or accented letters in their path: old build tools do not like them.", "sh", { wide: true }),
    K("The toolchain on macOS", `# 1. Homebrew (brew.sh), then the prerequisites
brew install git cmake ninja dfu-util ccache libusb python curl zip portaudio

# 2. ESP-IDF 5.4 for the two chips (a large download)
cd $HOME
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32c3,esp32c6
. ./export.sh
pip install pyaudio zeroconf

# 3. PRG32
cd $HOME
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
python3 -m prg32 doctor`, [
      "Homebrew first: it provides git, cmake, python",
      "install.sh downloads the compilers: be patient",
      "The dot before export.sh matters: it changes this terminal",
      "Works on Apple Silicon and on Intel",
    ], "From the README of PRG32. git may first ask to install the Xcode command line tools: accept. The recursive clone and install.sh fetch a few gigabytes.", "sh", { wide: true }),
    K("The toolchain on Linux (Debian, Ubuntu)", `# 1. Prerequisites
sudo apt update
sudo apt install -y git wget flex bison gperf python3 python3-venv python3-pip \\
    python3-zeroconf cmake ninja-build ccache libffi-dev libssl-dev dfu-util \\
    libusb-1.0-0 curl zip portaudio19-dev

# 2. ESP-IDF 5.4 for the two chips (a large download)
cd $HOME
git clone -b v5.4 --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32c3,esp32c6
. ./export.sh
pip install pyaudio zeroconf

# 3. PRG32
cd $HOME
git clone https://github.com/riscv-prg32/PRG32
cd PRG32
python3 -m prg32 doctor`, [
      "One long apt line: copy it whole",
      "Steps 2 and 3 are the same as on macOS",
      "Other distributions: the same packages, other names",
      "For the kit only: sudo usermod -aG dialout $USER",
    ], "From the README of PRG32. The dialout group gives access to the serial port of the board: log out and in again after the command. It is not needed for PRG32-QT or QEMU.", "sh", { wide: true }),
    K("Every new terminal: switch ESP-IDF on", `# macOS and Linux: in every new terminal, before anything else
. $HOME/esp-idf/export.sh
cd $HOME/PRG32

# save typing: add these two lines to ~/.zshrc or ~/.bashrc
alias get_idf=". $HOME/esp-idf/export.sh"
alias prg="python3 -m prg32"

# then, in a new terminal
get_idf
prg doctor

# Windows: open "ESP-IDF PowerShell" from the Start menu, then
cd $HOME\\Documents\\PRG32`, [
      "export.sh acts on the terminal it runs in, and only that one",
      "A new window is a new terminal: activate again",
      "The aliases are a convenience, not a requirement",
      "Run the prg32 commands from the PRG32 folder",
    ], "The single most common mistake of the first weeks. Make the students close the terminal, open a new one and run doctor without activating: they must see the error once, here, and not during a tutorial.", "sh", { wide: true }),
    K("The doctor: is everything in place?", `$ python3 -m prg32 doctor
[OK] idf.py found
[OK] riscv32-esp-elf-gcc found
[OK] partitions file found: .../PRG32/profiles/partitions_prg32.csv
[OK] partition cart0 parsed (offset=0x210000, size=131072)
...

# and when ESP-IDF is not active in this terminal:
[ERROR] idf.py missing (you must source ESP-IDF export.sh)`, [
      "idf.py: ESP-IDF is active",
      "riscv32-esp-elf-gcc: the RISC-V compiler is reachable",
      "partitions: the PRG32 folder is complete",
      "Any ERROR line says what to do: read it",
    ], "Messages of the doctor of October 2026. The four cartridge slots, cart0 to cart3, are regions of the flash memory of the board: 131072 bytes each. If doctor passes, level 2 is done.", "sh", { wide: true }),

    H("Step 3: your first build", "One cartridge, from source to the debugger."),
    K("Build a cartridge from the examples", `# in the PRG32 folder, ESP-IDF active
python3 -m prg32 cartridge build examples/games/pong/c/game.c \\
    --portable --entry-prefix pong_c --name pong --out pong.prg32

[OK] built pong.prg32 name=pong load=0x40800000
[INFO] code=3004 mem=3028 audio=0

# what did we build?
python3 -m prg32 cartridge summary pong.prg32`, [
      "cartridge build: source in, .prg32 out",
      "--entry-prefix: the name before _init, _update, _draw",
      "--portable: runs on every host, not on one firmware only",
      "A whole Pong: three thousand bytes",
    ], "Pong in C from the examples of the repository: it proves that the compiler works without typing a program. In Lecture 02 the source is yours, in assembly, and the command is the same. On Windows write python and put the command on one line.", "sh", { wide: true }),
    K("Send it to PRG32-QT", `# PRG32-QT must be running on this computer

# 1. is it listening?
python3 -m prg32 runtime --url http://localhost:8080

# 2. upload the cartridge to slot cart0 and start it
python3 -m prg32 esp32c6 upload-and-run pong.prg32 \\
    --url http://localhost:8080 --slot cart0

{"loaded":false,"ok":true,"slot":"cart0","stored":true}
{"ok":true,"slot":"cart0"}
[OK] Finished upload and run on ESP32C6`, [
      "PRG32-QT answers on port 8080, like a board",
      "runtime prints its state: a quick connection test",
      "upload-and-run stores the cartridge and starts it",
      "The command says esp32c6: for the tool, PRG32-QT is a board",
    ], "Run for these slides on macOS. If localhost does not answer, read the address on the Setup screen of PRG32-QT and use it. Without the tools: in PRG32-QT import the file pong.prg32 and choose Run Cartridge. The same command with --url http://192.168.4.1 sends the game to a real board.", "sh", { wide: true }),
    O("Look inside: the debugger", [
      "In PRG32-QT open Settings and enable Run cartridges in RISC-V debug mode",
      "Run the cartridge again: the game is on the left, the machine on the right",
      "Press the pause button: the game freezes, and one instruction is highlighted in the listing",
      "Press the step button a few times: the highlight moves, and some registers change value",
      "Press Update, then Draw: the listing jumps to those two functions of the cartridge",
      "Press the play button: the game goes on. Lower the speed to 0.1x and watch it in slow motion",
    ], "A first look only: Lecture 02 explains what the registers are. The point today is that the debugger opens and responds. Debug mode stays on until you switch it off. Pause, resume and step are the three transport buttons of the debugger, drawn as on a video player: two bars, a triangle, a triangle with a bar. The slides and the tutorials call them Pause, Resume and Step."),
    I("The machine, open", [["prg32qt_debugger_details.png", "Assembly with the current instruction, the 32 registers, memory, and the counters of the frame"]],
      "From the documentation of PRG32-QT.", "If you see this with your own cartridge, you are ready for the rest of the course."),

    H("Optional: QEMU and the kit", "The real firmware, on your laptop or on the board."),
    K("Level 3: the QEMU emulator", `# libraries for the window of the emulator
brew install libgcrypt glib pixman sdl2 libslirp                      # macOS
sudo apt install -y libgcrypt20 libglib2.0-0 libpixman-1-0 \\
    libsdl2-2.0-0 libslirp0                                           # Linux

# the emulator itself (Windows: tick it in the ESP-IDF installer)
python $IDF_PATH/tools/idf_tools.py install qemu-riscv32
. $IDF_PATH/export.sh

# build the firmware for QEMU, stage a cartridge, run
python3 -m prg32 qemu build
python3 -m prg32 qemu upload pong.prg32
python3 -m prg32 qemu run`, [
      "QEMU emulates a whole chip and runs the real firmware",
      "qemu build compiles the firmware: several minutes",
      "upload stages the cartridge: close QEMU first",
      "QEMU opens on Setup: Run Cartridge, cart0. Type in the terminal",
    ], "From the README and docs/usage/qemu.md of PRG32. Not run for these slides. The first build downloads components and compiles the whole firmware. If upload fails, run QEMU once so that the flash image exists, close it, and upload again. Since October 2026 the firmware starts on the Setup menu by default, on QEMU and on the board: choose Run Cartridge, then the slot. The keys go to the terminal that launched QEMU, not to the window with the picture.", "sh", { wide: true }),
    K("Level 4: the kit", `# connect the board with a USB cable; ESP-IDF active, in the PRG32 folder
python3 -m prg32 esp32c6 build-and-flash

# the board starts and creates a Wi-Fi network
#     name: PRG32     password: prg32game     address: 192.168.4.1
# join it with your laptop, then
python3 -m prg32 esp32c6 upload-and-run pong.prg32 \\
    --url http://192.168.4.1 --slot cart0

# or let the board join the Wi-Fi of the classroom
python3 -m prg32 wifi set --ssid "NAME" --password "PASSWORD" --mode sta`, [
      "build-and-flash writes the firmware: once per board. It starts on Setup",
      "After that, games arrive over Wi-Fi: no more cables",
      "The same upload command as for PRG32-QT, another address",
      "Linux: your user must be in the group dialout",
    ], "From the documentation of PRG32. Not run for these slides. If the serial port is not found pass it explicitly: COMx on Windows, /dev/ttyACM0 on Linux, /dev/cu.usbmodem... on macOS. A black screen after flashing usually means that the QEMU firmware was flashed instead of the board's, or that the display is wired to other pins than those of the firmware: since October 2026 the defaults are GPIO8 for DC and GPIO9 for RST (they were GPIO1 and GPIO0), and idf.py menuconfig changes them.", "sh", { wide: true }),

    H("When something does not work", "Symptoms, causes, remedies."),
    G("Troubleshooting", ["You see", "It means", "Do this"], [
      ["idf.py: command not found", "ESP-IDF is not active in this terminal", "run export.sh, or open the ESP-IDF PowerShell"],
      ["riscv32-esp-elf-gcc missing", "the compilers were not installed, or not activated", "./install.sh esp32c3,esp32c6, then export.sh"],
      ["No module named prg32", "you are not in the PRG32 folder", "cd to the folder that you cloned"],
      ["upload: connection refused", "PRG32-QT is not running, or a firewall blocks port 8080", "start it; allow it; use the address on its Setup screen"],
      ["macOS will not open PRG32", "the application is from outside the App Store", "right-click, Open; or Privacy and Security, Open Anyway"],
      ["Linux: PRG32 does not start", "the Qt of the system is older than 6.5", "a newer distribution, or build from source"],
      ["QEMU ignores the keys", "the keyboard goes to the terminal", "click the terminal that launched QEMU"],
    ], "The first row covers most of the cases. docs/usage/troubleshooting.md of the PRG32 repository has the complete list. When asking for help, paste the command and the whole message: never a photograph of the screen.", { widths: [3.6, 4.6, 5.0], fs: 15 }),
    G("Ready for Lecture 02?", ["", "Check", "How"], [
      ["1", "PRG32-QT starts and runs a game from the Store", "step 1"],
      ["2", "In a new terminal, after activating ESP-IDF, doctor shows only OK", "step 2"],
      ["3", "cartridge build produces pong.prg32", "step 3"],
      ["4", "upload-and-run starts it in PRG32-QT", "step 3"],
      ["5", "In debug mode, pause and step work", "step 3"],
    ], "Five ticks and the workshop is ready. Anyone who is stuck comes to office hours, or to the laboratory, before Lecture 02: with the laptop.", { widths: [0.8, 9.6, 2.6] }),

    Q("In a new terminal, python3 -m prg32 doctor says: idf.py missing. What is the most likely cause?", ["ESP-IDF must be installed again", "ESP-IDF is not active in this terminal", "PRG32-QT is not running", "the board is not connected"], 1, "Activation lasts as long as the terminal: run export.sh, or open the ESP-IDF PowerShell."),
    Q("Which host lets you run and debug a cartridge without installing a compiler?", ["the ESP32-C6 board", "QEMU", "PRG32-QT", "none of them"], 2, "PRG32-QT interprets the cartridge and has a built-in debugger; a compiler is needed only to build cartridges."),
    Q("Why does the same pong.prg32 run on the board, on QEMU and on PRG32-QT?", ["it is recompiled at each start", "it contains three programs", "it calls the runtime through the same table of functions on every host", "PRG32-QT translates it to C"], 2, "A portable cartridge depends only on the ABI, the table of functions of the runtime, which every host provides."),
    X("Before the next lecture", [
      "Finish the five checks of the Ready slide on your own laptop",
      "Download three cartridges from the Store, and find in each the first instruction of update with the debugger",
      "Build one of the other examples in examples/games, and run it",
      "Close everything, restart the computer, and get back to a running cartridge without these slides",
      "Optional: install QEMU and run the same cartridge there",
    ], "Your workshop survives a restart, and you can open it without help.",
      "The fourth task is the real test: it shows who has understood the activation of ESP-IDF."),
    G("Glossary: English and Italian", ["English", "Italiano", "English", "Italiano"], [
      ["toolchain", "catena di strumenti di sviluppo", "firmware", "firmware"],
      ["cartridge", "cartuccia", "runtime", "ambiente di esecuzione"],
      ["emulator", "emulatore", "interpreter", "interprete"],
      ["to build", "compilare (costruire)", "to flash", "scrivere nella memoria flash"],
      ["host", "macchina ospite", "breakpoint", "punto di interruzione"],
    ], null, { widths: [3, 4.2, 2.6, 4.2] }),
    T("Summary and reading", [
      "PRG32 is a runtime, a cartridge format, a tool and a Store; a cartridge runs unchanged on the board, on QEMU and on PRG32-QT",
      "PRG32-QT is enough to play and to debug; ESP-IDF and the PRG32 repository are needed to build",
      "ESP-IDF must be activated in every new terminal: remember this and most problems disappear",
      "You have built a cartridge, sent it to PRG32-QT and stopped it in the debugger: the loop of the whole course",
      ["Reading", ["README and docs/usage of github.com/riscv-prg32/PRG32", "README and docs of github.com/riscv-prg32/PRG32-QT", "Playing with RISC-V: the chapters on setup and on PRG32-QT"]],
    ], "Next: Lecture 02, the first program in RISC-V assembly, typed by the students in the workshop they have just set up."),
  ],
});
