// Lecture 24 - Beyond one core: superscalar RISC-V, HPC, GPU and FPGA accelerators.  New deck, outlook.
// The RISC-V listings are regions of tests/vector_qemu.S, run on QEMU with the vector extension at VLEN 128 to 1024.
const fs23 = require("fs"), path23 = require("path");
const R23 = (() => {
  const out = {}; let name = null;
  for (const l of fs23.readFileSync(path23.join(__dirname, "..", "..", "tests", "vector_qemu.S"), "utf8").split("\n")) {
    const m = l.match(/^#@ (.+)$/);
    if (m) name = m[1] === "end" ? null : (out[m[1]] = [], m[1]); else if (name) out[name].push(l);
  }
  return (k) => out[k].join("\n");
})();

Deck({
  n: "24", file: "24-Computer_Architecture-Superscalar_HPC_GPU_FPGA",
  title: "Beyond One Core: Superscalar RISC-V, HPC, GPUs and FPGAs", short: "Beyond one core",
  sub: "The same instructions, on machines that execute many of them at once",
  quote: ["If you were plowing a field, which would you rather use: two strong oxen or 1024 chickens?", "attributed to Seymour Cray"],
  cover: "cluster_1.jpg",
  notes: "Closing lecture and outlook, new in 2026/27: it has no Italian source. It starts from one loop of Verm1 and follows it onto four kinds of machine. It prepares the visit to the supercomputing systems of the Department. Not part of the midterm test. The RISC-V vector listings are tested on QEMU (tools/tests/vector_qemu.S); the CUDA and Verilog fragments are standard textbook forms that were not compiled for these slides. Figures for supercomputers are rounded and date from the TOP500 lists of 2022 to 2025: check the current list before class.",
  slides: [
    O("What you will be able to do by the end", [
      "Write the performance equation and say which factor each technique attacks",
      "Explain how a superscalar, out-of-order processor executes several instructions per cycle, and name RISC-V cores that do",
      "Read a loop written with the RISC-V vector extension",
      "Describe a supercomputer, compute a speed-up with Amdahl's law, and say why energy is the limit",
      "Say what a GPU and an FPGA are good at, and what each costs the programmer",
    ]),

    H("Warm-up on the machine", "One loop of Verm1, and the question of how fast it could go."),
    K("The loop that empties the map", R23("scalar"), [
      "From new_game of Verm1: 960 bytes set to zero",
      "Four instructions per byte: 3 840 instructions in all",
      "One byte at a time, one instruction at a time",
      "How many ways are there to make this faster?",
    ], "The processor cycle of Lecture 19. At best one instruction per clock cycle, and 160 million cycles per second on the kit: about 24 microseconds. Nobody needs this loop to be faster; it is small enough to follow onto every machine of today.", "asm", { wide: true }),
    T("Time = instructions x cycles per instruction x clock period", [
      "The time a program takes is the product of three numbers",
      ["Each can be attacked", ["fewer instructions: better algorithms, richer instructions, vectors", "fewer cycles per instruction: pipelines, superscalar execution", "a shorter cycle: faster transistors, deeper pipelines"]],
      "And when one processor is not enough: more processors working together",
      "Every machine of this lecture is a different answer to the same equation",
    ], "The performance equation of Patterson and Hennessy. For the loop of the previous slide on the kit: 3 840 instructions, about 1 cycle each, 6.25 nanoseconds per cycle.", { big: "T = N x CPI x t", label: "N instructions, CPI cycles per instruction, t seconds per cycle" }),
    T("Why not simply a faster clock?", [
      "For thirty years each new generation of transistors was smaller, faster and no hotter per square millimetre",
      "Around 2005 that stopped: smaller transistors still arrive, but a faster clock means more heat than a chip can shed",
      "Clock frequencies have stayed at a few gigahertz ever since",
      "The extra transistors went elsewhere: wider processors, more cores, vector units, accelerators",
      "Performance now comes from doing many things at once: from parallelism",
    ], "Moore's law (more transistors) went on; Dennard scaling (constant power density) ended. The 160 MHz of the kit is slow by choice: it costs milliwatts.", { big: "~2005", label: "the end of the free lunch: clocks stop at a few gigahertz, cores multiply" }),

    H("Superscalar processors", "More than one instruction per clock cycle."),
    G("From one at a time to many at once", ["Processor", "How it works", "Instructions per cycle", "Example"], [
      ["Multi-cycle", "one instruction completes before the next begins", "less than 1", "the machine of Lecture 18"],
      ["Pipelined", "several instructions in flight, each in a different stage", "at most 1", "the ESP32-C6 of the kit: four stages"],
      ["Superscalar, in order", "two or more pipelines side by side", "up to 2 or more", "small application cores"],
      ["Superscalar, out of order", "instructions run as soon as their operands are ready", "up to 4, 6, 8 ...", "laptops, phones, servers"],
    ], "Lecture 19 introduced the pipeline and named superscalar processors in one line: this section opens that line. Width is the number of instructions the processor can start in one cycle.", { widths: [2.9, 5.3, 2.5, 3.4] }),
    G("Two pipelines side by side", ["", "Cycle 1", "2", "3", "4", "5", "6", "7"], [
      ["i1", "IF", "ID", "EX", "MEM", "WB", "", ""],
      ["i2", "IF", "ID", "EX", "MEM", "WB", "", ""],
      ["i3", "", "IF", "ID", "EX", "MEM", "WB", ""],
      ["i4", "", "IF", "ID", "EX", "MEM", "WB", ""],
      ["i5", "", "", "IF", "ID", "EX", "MEM", "WB"],
      ["i6", "", "", "IF", "ID", "EX", "MEM", "WB"],
    ], "A two-wide processor with the five classic stages: six instructions complete in seven cycles; a single pipeline needs ten, and a processor without pipeline thirty. This is the ideal case: the next slide says why it is rare.", { widths: [1.2, 1.8, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6], mono: [1, 2, 3, 4, 5, 6, 7], caption: "Six instructions in seven cycles, if nothing gets in the way." }),
    K("What gets in the way: dependences", `    add  t0, t1, t2        # i1
    add  t3, t0, t4        # i2 needs the t0 of i1: it must wait
    lw   t5, 0(t6)         # i3 is independent: it could go now
    beqz t3, skip          # i4: which way? known only after i2
    addi t5, t5, 1         # i5: executed, or not?
skip:`, [
      "i2 cannot run beside i1: it uses its result",
      "i3 depends on nobody: why should it wait?",
      "After a branch the processor does not know what comes next",
      "Real code is full of such chains: width alone is not enough",
    ], "Data dependences, control dependences. An in-order superscalar stalls at i2 and everything behind it waits. The remedy is to let i3 overtake.", "asm", { wide: true }),
    S("Out-of-order execution", [
      ["Fetch and decode, in order", "Several instructions per cycle enter a window of tens or hundreds of instructions"],
      ["Rename", "Each result gets a fresh physical register, so that two uses of the name t0 no longer collide"],
      ["Execute when ready", "An instruction starts as soon as its operands exist, whatever its position in the program"],
      ["Commit, in order", "Results become official in program order: seen from outside, nothing ever overtook"],
    ], "The algorithm is Tomasulo's, designed for the floating-point unit of the IBM System/360 Model 91 in 1967; the reorder buffer that commits in order came in the 1980s. The programmer's model, the one you learned, is preserved exactly: this is the contract of the instruction set."),
    K("Register renaming: thirty-two names, many registers", `# as written                 # as executed, after renaming
    lw   t0, 0(a0)                lw   p41, 0(a0)
    addi t0, t0, 1                addi p42, p41, 1
    sw   t0, 0(a0)                sw   p42, 0(a0)
    lw   t0, 4(a0)                lw   p43, 4(a0)      # a new t0
    addi t0, t0, 1                addi p44, p43, 1
    sw   t0, 4(a0)                sw   p44, 4(a0)`, [
      "The second half reuses the name t0, not its value",
      "Renamed, the two halves share nothing",
      "They can run at the same time, on different registers",
      "The 32 registers you know are names; the chip has many more",
    ], "A false dependence: the same name for two unrelated values. p41 to p44 are invented numbers of physical registers. A big core has a few hundred of them.", "asm", { wide: true }),
    T("Guessing the future: branch prediction", [
      "A wide processor meets a branch every few instructions: it cannot wait to know the outcome",
      "It predicts the direction from the history of that branch, and goes on executing along the guess",
      "A right guess costs nothing; a wrong one throws away the speculative work and starts again",
      "The loop of the warm-up branches back 959 times and falls through once: easy to predict",
      "Modern predictors are right far more than nine times out of ten",
    ], "Speculative execution has a dark side: in 2018 the Spectre and Meltdown attacks showed that work thrown away can still leave traces in the cache that reveal secrets. Performance tricks are also security questions.", { big: "959 : 1", label: "bnez t1, 1b is taken 959 times and not taken once: a predictor learns it in the first turns" }),
    G("RISC-V goes superscalar", ["Core", "From", "Kind"], [
      ["HP core of the ESP32-C6", "Espressif", "in order, four stages, one instruction per cycle: your kit"],
      ["BOOM", "University of California, Berkeley", "out of order, open source, for research and teaching"],
      ["XiangShan", "Chinese Academy of Sciences", "out of order, open source, high performance"],
      ["XuanTie C910", "T-Head (Alibaba)", "out of order, three-wide; released as open source"],
      ["Performance P550", "SiFive", "out of order, three-wide, thirteen stages; sold as a design"],
      ["Veyron", "Ventana Micro Systems", "out of order, for data centres"],
    ], "BOOM is the Berkeley Out-of-Order Machine. Because the instruction set is open, anyone may build such a core, and several are published as source code that a student can read: this has no precedent among commercial architectures. The list ages quickly: update it.", { widths: [3.4, 4.2, 6.4] }),
    DEF("One architecture, many microarchitectures", "Architecture and microarchitecture", "The architecture is the contract: instructions, registers, what each instruction does. The microarchitecture is one way to honour it: stages, width, predictors, caches.", [
      "The add you wrote for a 160 MHz microcontroller is the add of a server core",
      "Verm1 would run unchanged on any of the cores of the previous slide, given a screen",
      "This is why an instruction set learned once is knowledge that lasts",
    ], "The distinction that organises the whole course: Lectures 02 to 22 taught the architecture; the kit is one small microarchitecture."),

    H("Vectors: one instruction, many data", "The RISC-V vector extension."),
    G("Flynn's taxonomy", ["Class", "Instructions", "Data", "Example"], [
      ["SISD", "one stream", "one stream", "the kit: one core, one datum at a time"],
      ["SIMD", "one stream", "many at once", "vector instructions; a GPU, to a first approximation"],
      ["MISD", "many", "one stream", "rare: redundant systems that vote"],
      ["MIMD", "many", "many", "multicore processors, clusters, supercomputers"],
    ], "Michael Flynn, 1966. Crude, and still the first vocabulary of parallel computing.", { widths: [1.6, 2.6, 2.6, 7.2] }),
    K("The same loop, with vectors", R23("vector"), [
      "v0 is a vector register: many bytes wide",
      "vsetvli asks: how many of the bytes left fit? The answer is in t2",
      "vse8.v stores t2 bytes with one instruction",
      "With 128-bit registers: 16 bytes per turn, 60 turns instead of 960",
    ], "The V extension, ratified in 2021. Not on the kit: the ESP32-C6 is RV32IMAC. The code never says how wide the registers are: it is vector-length agnostic, and the same binary uses 128, 256 or 1024 bits. Tested on QEMU at 128, 256, 512 and 1024 bits by tools/tests/vector_qemu.S.", "asm", { wide: true }),
    K("A sum, lane by lane", R23("sum"), [
      "vle32.v loads several words at once",
      "vadd.vv adds register to register, lane by lane",
      "At the end vredsum adds the lanes together",
      "Sixteen numbers, 1 to 16: the result is 136",
    ], "The parallel sum of Lectures 04 and 20, in RISC-V. tu, tail undisturbed, keeps the partial sums of the lanes that the last turn does not use. Tested on QEMU together with the previous listing.", "asm", { wide: true }),

    H("High-performance computing", "Thousands of processors on one problem."),
    T("What is a supercomputer?", [
      "Not one enormous processor: thousands of ordinary computers, the nodes, working on the same problem",
      ["Each node has", ["one or two processors with tens of cores", "often several GPUs", "a great deal of memory"]],
      "A very fast network joins the nodes, and a parallel file system serves them all",
      "Speed is measured in floating-point operations per second, FLOPS, on a standard problem: a huge system of linear equations",
      "The TOP500 list has ranked the fastest machines twice a year since 1993",
    ], "The benchmark is HPL, High-Performance Linpack. The picture is the teaching cluster shown in Lecture 03: the same structure, in small.", { img: "cluster_1.jpg", cap: "A small cluster: nodes, GPUs, a fast network" }),
    G("Orders of magnitude", ["Machine", "Where", "Floating-point operations per second"], [
      ["ESP32-C6", "your kit", "no floating-point unit: fixed point, as in Verm1"],
      ["A laptop", "your bag", "about a hundred billion: 10^11"],
      ["Leonardo (2022)", "CINECA, Bologna", "about 240 million billion: 2.4 x 10^17"],
      ["Frontier (2022)", "Oak Ridge, USA", "over 10^18: the first exascale machine"],
      ["El Capitan (2024)", "Livermore, USA", "about 1.7 x 10^18"],
      ["JUPITER (2025)", "Jülich, Germany", "about 10^18: the first European exascale machine"],
    ], "Rounded HPL figures from the TOP500 lists; the laptop figure is an order of magnitude. Exa is 10^18. Seven orders of magnitude separate a laptop from an exascale machine: about fifty years of Moore's law, bought with parallelism instead.", { widths: [3.2, 3.6, 7.2] }),
    DEF("Amdahl's law", "Speed-up with n processors", "S = 1 / ((1 - p) + p / n), where p is the fraction of the work that can be done in parallel.", [
      "The serial fraction, 1 - p, does not shrink however many processors you add",
      "With p = 0.9 the speed-up can never exceed 10, even with a million processors",
      "Before buying processors, measure p",
    ], "Gene Amdahl, 1967. The same law holds for any improvement that applies to only a part of the work: a faster GPU does not help the part that runs on the CPU."),
    G("Amdahl's law in numbers", ["Parallel fraction p", "n = 10", "n = 100", "n = 1000", "n unlimited"], [
      ["0.50", "1.8", "2.0", "2.0", "2"],
      ["0.90", "5.3", "9.2", "9.9", "10"],
      ["0.99", "9.2", "50", "91", "100"],
      ["0.999", "9.9", "91", "500", "1000"],
    ], "Ask the students to compute one cell: p = 0.9, n = 100 gives 1 / (0.1 + 0.009) = 9.17. Gustafson's answer, 1988: with more processors people solve bigger problems, and in a bigger problem the parallel part usually grows faster than the serial one.", { widths: [3.4, 2.4, 2.4, 2.4, 2.8], caption: "Speed-up. A thousand processors on a program that is 90% parallel: less than ten times faster." }),
    V("Two ways to share the work",
      ["Shared memory", ["Several cores of one node see the same memory", "The program runs as threads that read and write the same variables", "Easy to start: OpenMP adds one line above a loop", "The danger: two threads writing the same variable"]],
      ["Distributed memory", ["Each node has its own memory; nothing is shared", "The program runs as processes that send each other messages", "MPI, the Message Passing Interface, is the standard", "It scales to a million cores, and the programmer pays for it"]],
      "Real applications use both: MPI between the nodes, threads and GPUs inside each node. The weather and marine models of the Department work this way."),
    T("The limit is energy", [
      "An exascale machine draws about twenty megawatts: the consumption of a small town",
      "The electricity of its lifetime costs as much as the machine",
      "So the figure that matters is operations per watt, and it has its own ranking: the Green500",
      "GPUs and other accelerators lead it: specialised hardware does more with each joule",
      "The same reason puts a small RISC-V core in your kit: milliwatts",
    ], "Frontier reached its exaflop at about 21 megawatts. Energy efficiency is the thread that ties a microcontroller to a supercomputer.", { big: "~20 MW", label: "for 10^18 operations per second: about 50 billion operations per joule" }),
    T("RISC-V and European supercomputing", [
      "Today's largest machines use x86 or Arm processors with GPU accelerators",
      "Europe designs its own processors and accelerators on RISC-V: the European Processor Initiative, and DARE, the project named in the first lecture",
      "Monte Cimone, at the University of Bologna with CINECA, 2022: a complete HPC cluster built on RISC-V processors",
      "The Barcelona Supercomputing Center designs and fabricates RISC-V cores of its own",
      "An open instruction set lets a continent build what it would otherwise have to buy",
    ], "DARE: Digital Autonomy with RISC-V in Europe. The Department's Research Computing Facilities are at rcf.uniparthenope.it: after the lecture, the visit.", { img: "rcf_page.png", cap: "Research Computing Facilities of the Department" }),

    H("GPU accelerators", "Thousands of small cores for work that repeats."),
    V("Two ways to spend transistors",
      ["A CPU", ["A few large cores: tens", "Each one out of order, with predictors and big caches", "Built to finish one task as soon as possible", "At ease with branches and irregular data"]],
      ["A GPU", ["Thousands of small, simple cores", "All executing the same code on different data", "Built to finish a million tasks per second", "At ease with regular arrays: pixels, matrices, grids"]],
      "Lecture 20 told the story from the video card to GPGPU. Cray's oxen and chickens: the answer depends on the field. The GPU is not faster at any single thing; it does more things at once."),
    S("How a program uses a GPU", [
      ["Prepare", "The program on the CPU, the host, builds its arrays in main memory"],
      ["Copy in", "The data travel to the memory of the GPU: a real cost, in time"],
      ["Launch", "One small function, the kernel, runs in thousands of threads, one per element of the data"],
      ["Copy out", "The results travel back, and the host goes on"],
    ], "The GPU is a device, like those of Lecture 21: the CPU sends it data and commands through a driver. Programming models: CUDA, OpenCL, SYCL, and directives such as OpenACC and OpenMP offload."),
    K("The map of Verm1, one thread per cell", `// the kernel: this function runs once in every thread
__global__ void clear(unsigned char *grid, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // who am I?
    if (i < n)
        grid[i] = 0;                                 // my cell, and only mine
}

// on the host: 4 blocks of 256 threads cover the 960 cells
clear<<<(960 + 255) / 256, 256>>>(grid, 960);`, [
      "There is no loop: there are 960 threads",
      "Each thread computes its own index and does one store",
      "Threads come in blocks; the last ones find nothing to do",
      "For 960 bytes the copies cost far more than the work",
    ], "CUDA C, in its usual textbook form; not compiled for these slides. The point of the last callout is serious: a GPU pays off when the data are large and the work per element is real. Ask: for which size of map would it be worth it?", "c", { wide: true }),
    T("When does a GPU pay off?", [
      "When the same operation applies to very many data, independently: images, matrices, grids of a simulation, neural networks",
      "When the data can stay on the GPU for many steps, instead of travelling at every one",
      "Not when the work is a chain of decisions, each depending on the one before",
      "Amdahl again: what stays on the CPU sets the limit",
      "The training of today's neural networks is, almost entirely, matrix arithmetic on GPUs",
    ], "A weather simulation updates every cell of a three-dimensional grid from its neighbours, millions of times: the same shape as the map of Verm1, a little larger.", { img: "gpgpu_sum.png", cap: "A parallel sum: log2 N steps instead of N", wide: true }),

    H("FPGA accelerators", "Hardware that you can rewrite."),
    T("A chip that becomes the circuit you describe", [
      "FPGA: field-programmable gate array",
      ["Inside: a sea of small programmable blocks", ["look-up tables, each able to be any function of a few inputs", "flip-flops, one beside each table", "wires and switches that can join any block to any other"]],
      "A configuration file, the bitstream, sets every table and every switch",
      "Load another bitstream and the same chip is another circuit",
      "First sold in 1985; today from a few euros to boards for data centres",
    ], "The Xilinx XC2064, 1985. An FPGA does not execute a program: it becomes a circuit. Nothing is fetched or decoded; all the gates work at the same time.", { img: "pcb.jpg", cap: "Programmable logic sits on boards like any other chip" }),
    G("A look-up table is a truth table in memory", ["a", "b", "stored for AND", "stored for XOR", "stored for NOT a"], [
      ["0", "0", "0", "0", "1"],
      ["0", "1", "0", "1", "1"],
      ["1", "0", "0", "1", "0"],
      ["1", "1", "1", "0", "0"],
    ], "Lecture 08 said that a truth table defines a function; Lecture 11 that a ROM addressed by the inputs implements any function. A LUT is that ROM, with four to six inputs, sixteen to sixty-four bits. The flip-flop next to it is that of Lecture 13. An FPGA is this course, repeated a hundred thousand times on one chip.", { widths: [1.4, 1.4, 3.4, 3.4, 3.4], mono: [0, 1, 2, 3, 4], caption: "The inputs are the address; four stored bits choose the function. Changing the bits changes the gate." }),
    K("The U-turn rule of Verm1, as hardware", `// Lecture 12: opposite directions differ in bit 1 only
module uturn (
    input  wire [1:0] dir,      // direction of the last step
    input  wire [1:0] want,     // direction asked by the player
    output wire       refuse    // 1 = this would be a U-turn
);
    assign refuse = (dir ^ want) == 2'b10;
endmodule`, [
      "Verilog: a language that describes circuits, not steps",
      "assign is a wire, always true: there is no before and after",
      "Two XOR gates and an AND with one inverted input",
      "On the kit this rule took three instructions and three cycles",
    ], "A hardware description language: Verilog, or VHDL. Not synthesised for these slides. The xor, li, beq of Part 2 become gates that answer in a fraction of a nanosecond, continuously. Ask the students to draw the circuit: refuse = (d1 xor w1) and not (d0 xor w0).", "v", { wide: true }),
    F("From description to circuit", ["Describe|Verilog or VHDL; or C, with high-level synthesis", "Simulate|waveforms, as in Lecture 13", "Synthesise|the description becomes tables and flip-flops", "Place and route|each one gets a place on the chip", "Configure|the bitstream is loaded"],
      "Minutes to hours for each attempt: slower than building a cartridge, far faster than making a chip.", "The same flow, with a factory at the end instead of a bitstream, produces an ASIC: a chip made for one purpose. FPGAs are where chips are tried before they are made."),
    T("A processor is a circuit too", [
      "A RISC-V core is a description in a hardware language: it can be loaded on an FPGA",
      "Such soft cores are free to read and use: PicoRV32, VexRiscv, NEORV32, Rocket",
      "A core of the class of your kit's fits in a small, cheap FPGA",
      "And beside it you can put a circuit of your own, for the one operation your program repeats most: a custom accelerator",
      "RISC-V reserves room in its encoding for custom instructions, to reach such circuits",
    ], "This closes the circle of the course: the gates of Lecture 08 build the adder of Lecture 09, the registers of Lecture 14, the processor of Lecture 18, and that processor is a file you can read. Networks, signal processing, finance and the first stages of AI inference use FPGAs where latency and energy matter.", { box: "From gates to a processor, and back: you now know every layer in between.", head: "The circle closes" }),
    G("Four ways to compute", ["", "CPU", "GPU", "FPGA", "ASIC"], [
      ["What it is", "a few complex cores", "thousands of simple cores", "a circuit you configure", "a circuit made for one job"],
      ["Programmed in", "any language", "kernels: CUDA, OpenCL, SYCL", "Verilog, VHDL, HLS", "the same, then a factory"],
      ["Strong at", "everything, moderately", "regular data in bulk", "streams, low latency", "one thing, perfectly"],
      ["Work per joule", "low", "high", "high", "highest"],
      ["Effort to use", "low", "medium", "high", "very high"],
      ["Change of mind", "recompile", "recompile", "a new bitstream", "a new chip"],
    ], "Generality is paid in energy; efficiency is paid in effort. A modern system on a chip has all four: your phone holds CPU cores, a GPU, and fixed circuits for video and radio.", { widths: [2.4, 2.6, 3.1, 2.8, 3.1] }),

    H("Back to the machine", "One loop, five machines."),
    G("Emptying the map of Verm1: 960 cells", ["Machine", "How", "Steps in time"], [
      ["The kit: ESP32-C6", "one byte per turn, one instruction per cycle", "3 840 cycles"],
      ["Out-of-order RISC-V core", "the same binary; several instructions per cycle, the branch predicted", "a fraction of those cycles"],
      ["RISC-V with vectors, 128 bits", "16 bytes per turn", "60 turns"],
      ["GPU", "960 threads, one per cell", "one launch, plus two copies"],
      ["FPGA", "960 flip-flops with a common reset", "one clock cycle"],
    ], "The work is the same; what changes is how much of it happens at the same time. And the costs: the first row needs a two-euro chip and four lines of assembly; the last needs a hardware design. The engineer's question is never which is fastest, but which is enough.", { widths: [3.6, 6.8, 3.6], caption: "The first three rows are the same instruction set. The first and the third were run for these slides." }),

    Q("A program is 80% parallel. What is the largest speed-up that any number of processors can give?", ["4", "5", "8", "80"], 1, "With n unlimited, S = 1 / (1 - p) = 1 / 0.2 = 5."),
    Q("What does register renaming remove?", ["branches", "the need for a stack", "false dependences between uses of the same register name", "cache misses"], 2, "Two unrelated values that share a name get different physical registers and can be computed at the same time."),
    Q("With 256-bit vector registers, how many turns does the vector loop need for the 960 bytes?", ["4", "30", "60", "960"], 1, "256 bits are 32 bytes per turn: 960 / 32 = 30. The code does not change."),
    Q("A two-input look-up table stores, for inputs 00, 01, 10, 11, the bits 0, 1, 1, 1. Which gate is it?", ["AND", "OR", "XOR", "NAND"], 1, "The output is 1 whenever at least one input is 1: OR."),
    X("Exercises: paper first, then the machine", [
      "Fill in the Amdahl table for p = 0.95 and n = 10, 100, 1000",
      "Draw the pipeline diagram of a three-wide processor for nine independent instructions with five stages",
      "Rename the registers of the step-wrap code of Verm1, Part 2: which instructions could run in the same cycle?",
      "Write the truth table stored in a four-input look-up table for refuse = (dir xor want) == 2",
      "Build tools/tests/vector_qemu.S and run it on QEMU with vlen=128 and vlen=512: why does the same binary work?",
    ], "Amdahl, p = 0.95: 6.9, 16.8, 19.6. Nine instructions, three-wide: seven cycles. The look-up table has four ones out of sixteen entries.",
      "QEMU: qemu-system-riscv32 -machine virt -cpu rv32,v=true,vlen=128; the build command is in tools/tests/README.md. The four ones of the table: (dir, want) = (0,2), (1,3), (2,0), (3,1)."),
    G("Glossary", ["English", "Italian", "English", "Italian"], [
      ["superscalar", "superscalare", "out-of-order execution", "esecuzione fuori ordine"],
      ["register renaming", "ridenominazione dei registri", "branch prediction", "predizione dei salti"],
      ["speed-up", "accelerazione (speed-up)", "node", "nodo"],
      ["shared memory", "memoria condivisa", "message passing", "scambio di messaggi"],
      ["accelerator", "acceleratore", "kernel (GPU)", "kernel"],
      ["look-up table", "tabella di look-up", "bitstream", "bitstream"],
      ["hardware description language", "linguaggio di descrizione dell'hardware", "soft core", "soft core"],
    ], null, { widths: [3.4, 3.8, 3.2, 3.6] }),
    T("Conclusions and reading", [
      "One equation, three factors: every fast machine attacks one of them, or multiplies processors",
      "Superscalar, out-of-order cores keep the contract of the instruction set and execute many instructions at once",
      "Vectors, GPUs and clusters exploit data that can be processed independently; Amdahl's law says how far that goes",
      "FPGAs turn a description into a circuit: the logic of this course, at scale",
      ["Reading", ["Patterson, Hennessy: Computer Organization and Design, RISC-V Edition, chapters 4 and 6", "Hennessy, Patterson: Computer Architecture, A Quantitative Approach", "top500.org; the RISC-V vector specification at riscv.org"]],
    ], "The course ends here: from a bit to a supercomputer, with one instruction set. Next: the visit to the Department's computing systems, and the presentation of the students' games.", { img: "book_patterson.jpg", cap: "Patterson, Hennessy: RISC-V edition" }),
  ],
});
