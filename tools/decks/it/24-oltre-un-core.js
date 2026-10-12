// Italian version of decks/en/24-beyond-one-core.js: same slides, same listings, text in Italian.
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
  n: "24", file: "24-Architettura_dei_Calcolatori-Superscalari_HPC_GPU_FPGA",
  title: "Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA", short: "Oltre un solo core",
  sub: "Le stesse istruzioni, su macchine che ne eseguono molte insieme",
  quote: ["Se doveste arare un campo, che cosa usereste: due buoi robusti o 1024 polli?", "attribuita a Seymour Cray"],
  cover: "cluster_1.jpg",
  notes: "Lezione conclusiva e di prospettiva, nuova nel 2026/27: non ha una presentazione italiana di origine. Parte da un ciclo di Verm1 e lo segue su quattro tipi di macchina. Prepara la visita ai sistemi di supercalcolo del Dipartimento. Non fa parte della prova intercorso. I listati vettoriali RISC-V sono provati su QEMU (tools/tests/vector_qemu.S); i frammenti CUDA e Verilog sono forme standard da manuale, non compilate per queste slide. Le cifre sui supercalcolatori sono arrotondate e risalgono alle liste TOP500 dal 2022 al 2025: controllate la lista corrente prima della lezione.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Scrivere l'equazione delle prestazioni e dire quale fattore attacca ciascuna tecnica",
      "Spiegare come un processore superscalare fuori ordine esegue più istruzioni per ciclo, e nominare core RISC-V che lo fanno",
      "Leggere un ciclo scritto con l'estensione vettoriale di RISC-V",
      "Descrivere un supercalcolatore, calcolare uno speed-up con la legge di Amdahl, e dire perché il limite è l'energia",
      "Dire in che cosa sono forti una GPU e una FPGA, e quanto costa ciascuna al programmatore",
    ]),

    H("Riscaldamento sulla macchina", "Un ciclo di Verm1, e la domanda su quanto potrebbe andare veloce."),
    K("Il ciclo che svuota la mappa", R23("scalar"), [
      "Da new_game di Verm1: 960 byte messi a zero",
      "Quattro istruzioni per byte: 3 840 istruzioni in tutto",
      "Un byte alla volta, un'istruzione alla volta",
      "In quanti modi lo si può rendere più veloce?",
    ], "Il ciclo del processore della Lezione 19. Nel caso migliore un'istruzione per ciclo di clock, e 160 milioni di cicli al secondo sul kit: circa 24 microsecondi. Nessuno ha bisogno che questo ciclo sia più veloce; è abbastanza piccolo da poterlo seguire su ogni macchina di oggi.", "asm", { wide: true }),
    T("Tempo = istruzioni x cicli per istruzione x periodo di clock", [
      "Il tempo impiegato da un programma è il prodotto di tre numeri",
      ["Ciascuno si può attaccare", ["meno istruzioni: algoritmi migliori, istruzioni più ricche, vettori", "meno cicli per istruzione: pipeline, esecuzione superscalare", "un ciclo più corto: transistor più veloci, pipeline più profonde"]],
      "E quando un processore non basta: più processori che lavorano insieme",
      "Ogni macchina di questa lezione è una risposta diversa alla stessa equazione",
    ], "L'equazione delle prestazioni di Patterson e Hennessy. Per il ciclo della slide precedente sul kit: 3 840 istruzioni, circa 1 ciclo ciascuna, 6,25 nanosecondi per ciclo.", { big: "T = N x CPI x t", label: "N istruzioni, CPI cicli per istruzione, t secondi per ciclo" }),
    T("Perché non semplicemente un clock più veloce?", [
      "Per trent'anni ogni nuova generazione di transistor è stata più piccola, più veloce e non più calda per millimetro quadrato",
      "Intorno al 2005 questo è finito: i transistor più piccoli arrivano ancora, ma un clock più veloce significa più calore di quanto un chip possa smaltire",
      "Da allora le frequenze di clock sono rimaste a pochi gigahertz",
      "I transistor in più sono andati altrove: processori più larghi, più core, unità vettoriali, acceleratori",
      "Oggi le prestazioni vengono dal fare molte cose insieme: dal parallelismo",
    ], "La legge di Moore (più transistor) è proseguita; la scalatura di Dennard (densità di potenza costante) è finita. I 160 MHz del kit sono lenti per scelta: costano milliwatt.", { big: "~2005", label: "la fine del pasto gratis: i clock si fermano a pochi gigahertz, i core si moltiplicano" }),

    H("Processori superscalari", "Più di un'istruzione per ciclo di clock."),
    G("Da una alla volta a molte insieme", ["Processore", "Come funziona", "Istruzioni per ciclo", "Esempio"], [
      ["Multiciclo", "un'istruzione termina prima che cominci la successiva", "meno di 1", "la macchina della Lezione 18"],
      ["Con pipeline", "più istruzioni in volo, ciascuna in uno stadio diverso", "al massimo 1", "l'ESP32-C6 del kit: quattro stadi"],
      ["Superscalare, in ordine", "due o più pipeline affiancate", "fino a 2 o più", "piccoli core applicativi"],
      ["Superscalare, fuori ordine", "le istruzioni partono appena i loro operandi sono pronti", "fino a 4, 6, 8 ...", "portatili, telefoni, server"],
    ], "La Lezione 19 ha introdotto la pipeline e nominato i processori superscalari in una riga: questa sezione apre quella riga. La larghezza è il numero di istruzioni che il processore può avviare in un ciclo.", { widths: [2.9, 5.3, 2.5, 3.4] }),
    G("Due pipeline affiancate", ["", "Ciclo 1", "2", "3", "4", "5", "6", "7"], [
      ["i1", "IF", "ID", "EX", "MEM", "WB", "", ""],
      ["i2", "IF", "ID", "EX", "MEM", "WB", "", ""],
      ["i3", "", "IF", "ID", "EX", "MEM", "WB", ""],
      ["i4", "", "IF", "ID", "EX", "MEM", "WB", ""],
      ["i5", "", "", "IF", "ID", "EX", "MEM", "WB"],
      ["i6", "", "", "IF", "ID", "EX", "MEM", "WB"],
    ], "Un processore di larghezza due con i cinque stadi classici: sei istruzioni terminano in sette cicli; a una pipeline singola ne servono dieci, e a un processore senza pipeline trenta. È il caso ideale: la prossima slide dice perché è raro.", { widths: [1.2, 1.8, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6], mono: [1, 2, 3, 4, 5, 6, 7], caption: "Sei istruzioni in sette cicli, se nulla si mette di mezzo." }),
    K("Che cosa si mette di mezzo: le dipendenze", `    add  t0, t1, t2        # i1
    add  t3, t0, t4        # i2 needs the t0 of i1: it must wait
    lw   t5, 0(t6)         # i3 is independent: it could go now
    beqz t3, skip          # i4: which way? known only after i2
    addi t5, t5, 1         # i5: executed, or not?
skip:`, [
      "i2 non può correre accanto a i1: ne usa il risultato",
      "i3 non dipende da nessuno: perché dovrebbe aspettare?",
      "Dopo un salto il processore non sa che cosa viene dopo",
      "Il codice vero è pieno di catene così: la larghezza da sola non basta",
    ], "Dipendenze sui dati, dipendenze sul controllo. Un superscalare in ordine si blocca a i2 e tutto ciò che sta dietro aspetta. Il rimedio è lasciare che i3 sorpassi.", "asm", { wide: true }),
    S("Esecuzione fuori ordine", [
      ["Prelievo e decodifica, in ordine", "Più istruzioni per ciclo entrano in una finestra di decine o centinaia di istruzioni"],
      ["Ridenominazione", "Ogni risultato riceve un registro fisico nuovo, così due usi del nome t0 non si scontrano più"],
      ["Esecuzione appena pronta", "Un'istruzione parte appena esistono i suoi operandi, qualunque sia la sua posizione nel programma"],
      ["Commit, in ordine", "I risultati diventano ufficiali nell'ordine del programma: visto da fuori, nessuno ha mai sorpassato"],
    ], "L'algoritmo è quello di Tomasulo, progettato nel 1967 per l'unità in virgola mobile dell'IBM System/360 Model 91; il reorder buffer che fa il commit in ordine è arrivato negli anni Ottanta. Il modello del programmatore, quello che avete imparato, è conservato esattamente: è il contratto dell'insieme di istruzioni."),
    K("Ridenominazione dei registri: trentadue nomi, molti registri", `# as written                 # as executed, after renaming
    lw   t0, 0(a0)                lw   p41, 0(a0)
    addi t0, t0, 1                addi p42, p41, 1
    sw   t0, 0(a0)                sw   p42, 0(a0)
    lw   t0, 4(a0)                lw   p43, 4(a0)      # a new t0
    addi t0, t0, 1                addi p44, p43, 1
    sw   t0, 4(a0)                sw   p44, 4(a0)`, [
      "La seconda metà riusa il nome t0, non il suo valore",
      "Rinominate, le due metà non condividono nulla",
      "Possono correre insieme, su registri diversi",
      "I 32 registri che conoscete sono nomi; il chip ne ha molti di più",
    ], "Una falsa dipendenza: lo stesso nome per due valori che non c'entrano l'uno con l'altro. Da p41 a p44 sono numeri inventati di registri fisici. Un core grande ne ha qualche centinaio.", "asm", { wide: true }),
    T("Indovinare il futuro: la predizione dei salti", [
      "Un processore largo incontra un salto ogni poche istruzioni: non può aspettare di conoscerne l'esito",
      "Predice la direzione dalla storia di quel salto, e prosegue l'esecuzione lungo l'ipotesi",
      "Un'ipotesi giusta non costa nulla; una sbagliata butta via il lavoro speculativo e ricomincia",
      "Il ciclo del riscaldamento salta all'indietro 959 volte e prosegue una volta: facile da predire",
      "I predittori moderni hanno ragione ben più di nove volte su dieci",
    ], "L'esecuzione speculativa ha un lato oscuro: nel 2018 gli attacchi Spectre e Meltdown hanno mostrato che il lavoro buttato via può lasciare comunque nella cache tracce che rivelano segreti. I trucchi per le prestazioni sono anche questioni di sicurezza.", { big: "959 : 1", label: "bnez t1, 1b è preso 959 volte e non preso una: un predittore lo impara nei primi giri" }),
    G("RISC-V diventa superscalare", ["Core", "Da", "Tipo"], [
      ["Core HP dell'ESP32-C6", "Espressif", "in ordine, quattro stadi, un'istruzione per ciclo: il vostro kit"],
      ["BOOM", "Università della California, Berkeley", "fuori ordine, open source, per ricerca e didattica"],
      ["XiangShan", "Accademia Cinese delle Scienze", "fuori ordine, open source, alte prestazioni"],
      ["XuanTie C910", "T-Head (Alibaba)", "fuori ordine, larghezza tre; rilasciato come open source"],
      ["Performance P550", "SiFive", "fuori ordine, larghezza tre, tredici stadi; venduto come progetto"],
      ["Veyron", "Ventana Micro Systems", "fuori ordine, per i data center"],
    ], "BOOM è la Berkeley Out-of-Order Machine. Poiché l'insieme di istruzioni è aperto, chiunque può costruire un core simile, e parecchi sono pubblicati come codice sorgente che uno studente può leggere: non ha precedenti tra le architetture commerciali. L'elenco invecchia in fretta: aggiornatelo.", { widths: [3.4, 4.2, 6.4] }),
    DEF("Un'architettura, molte microarchitetture", "Architettura e microarchitettura", "L'architettura è il contratto: istruzioni, registri, che cosa fa ogni istruzione. La microarchitettura è un modo di rispettarlo: stadi, larghezza, predittori, cache.", [
      "La add che avete scritto per un microcontrollore a 160 MHz è la add di un core da server",
      "Verm1 girerebbe senza modifiche su uno qualunque dei core della slide precedente, dato uno schermo",
      "Per questo un insieme di istruzioni imparato una volta è una conoscenza che dura",
    ], "La distinzione che organizza l'intero corso: le Lezioni dalla 02 alla 22 hanno insegnato l'architettura; il kit è una piccola microarchitettura."),

    H("Vettori: un'istruzione, molti dati", "L'estensione vettoriale di RISC-V."),
    G("La tassonomia di Flynn", ["Classe", "Istruzioni", "Dati", "Esempio"], [
      ["SISD", "un flusso", "un flusso", "il kit: un core, un dato alla volta"],
      ["SIMD", "un flusso", "molti insieme", "istruzioni vettoriali; una GPU, in prima approssimazione"],
      ["MISD", "molti", "un flusso", "rara: sistemi ridondanti che votano"],
      ["MIMD", "molti", "molti", "processori multicore, cluster, supercalcolatori"],
    ], "Michael Flynn, 1966. Rozza, ed è ancora il primo vocabolario del calcolo parallelo.", { widths: [1.6, 2.6, 2.6, 7.2] }),
    K("Lo stesso ciclo, con i vettori", R23("vector"), [
      "v0 è un registro vettoriale: largo molti byte",
      "vsetvli chiede: quanti dei byte rimasti ci stanno? La risposta è in t2",
      "vse8.v memorizza t2 byte con una sola istruzione",
      "Con registri a 128 bit: 16 byte per giro, 60 giri invece di 960",
    ], "L'estensione V, ratificata nel 2021. Sul kit non c'è: l'ESP32-C6 è RV32IMAC. Il codice non dice mai quanto sono larghi i registri: è indipendente dalla lunghezza del vettore (vector-length agnostic), e lo stesso binario usa 128, 256 o 1024 bit. Provato su QEMU a 128, 256, 512 e 1024 bit da tools/tests/vector_qemu.S.", "asm", { wide: true }),
    K("Una somma, corsia per corsia", R23("sum"), [
      "vle32.v carica più parole insieme",
      "vadd.vv somma registro a registro, corsia per corsia",
      "Alla fine vredsum somma tra loro le corsie",
      "Sedici numeri, da 1 a 16: il risultato è 136",
    ], "La somma parallela delle Lezioni 04 e 20, in RISC-V. tu, tail undisturbed, conserva le somme parziali delle corsie che l'ultimo giro non usa. Provato su QEMU insieme al listato precedente.", "asm", { wide: true }),

    H("Calcolo ad alte prestazioni", "Migliaia di processori su un solo problema."),
    T("Che cos'è un supercalcolatore?", [
      "Non un unico processore enorme: migliaia di calcolatori normali, i nodi, che lavorano allo stesso problema",
      ["Ogni nodo ha", ["uno o due processori con decine di core", "spesso più GPU", "moltissima memoria"]],
      "Una rete molto veloce unisce i nodi, e un file system parallelo li serve tutti",
      "La velocità si misura in operazioni in virgola mobile al secondo, FLOPS, su un problema standard: un enorme sistema di equazioni lineari",
      "La lista TOP500 classifica le macchine più veloci due volte l'anno dal 1993",
    ], "Il benchmark è HPL, High-Performance Linpack. La foto è il cluster didattico mostrato nella Lezione 03: la stessa struttura, in piccolo.", { img: "cluster_1.jpg", cap: "Un piccolo cluster: nodi, GPU, una rete veloce" }),
    G("Ordini di grandezza", ["Macchina", "Dove", "Operazioni in virgola mobile al secondo"], [
      ["ESP32-C6", "il vostro kit", "nessuna unità in virgola mobile: virgola fissa, come in Verm1"],
      ["Un portatile", "il vostro zaino", "circa cento miliardi: 10^11"],
      ["Leonardo (2022)", "CINECA, Bologna", "circa 240 milioni di miliardi: 2,4 x 10^17"],
      ["Frontier (2022)", "Oak Ridge, USA", "oltre 10^18: la prima macchina exascale"],
      ["El Capitan (2024)", "Livermore, USA", "circa 1,7 x 10^18"],
      ["JUPITER (2025)", "Jülich, Germania", "circa 10^18: la prima macchina exascale europea"],
    ], "Cifre HPL arrotondate dalle liste TOP500; la cifra del portatile è un ordine di grandezza. Exa è 10^18. Sette ordini di grandezza separano un portatile da una macchina exascale: circa cinquant'anni di legge di Moore, comprati invece con il parallelismo.", { widths: [3.2, 3.6, 7.2] }),
    DEF("La legge di Amdahl", "Speed-up con n processori", "S = 1 / ((1 - p) + p / n), dove p è la frazione del lavoro che si può svolgere in parallelo.", [
      "La frazione seriale, 1 - p, non si riduce per quanti processori si aggiungano",
      "Con p = 0,9 lo speed-up non può mai superare 10, nemmeno con un milione di processori",
      "Prima di comprare processori, misurate p",
    ], "Gene Amdahl, 1967. La stessa legge vale per ogni miglioramento che si applica solo a una parte del lavoro: una GPU più veloce non aiuta la parte che gira sulla CPU."),
    G("La legge di Amdahl in numeri", ["Frazione parallela p", "n = 10", "n = 100", "n = 1000", "n illimitato"], [
      ["0,50", "1,8", "2,0", "2,0", "2"],
      ["0,90", "5,3", "9,2", "9,9", "10"],
      ["0,99", "9,2", "50", "91", "100"],
      ["0,999", "9,9", "91", "500", "1000"],
    ], "Chiedete agli studenti di calcolare una cella: p = 0,9, n = 100 dà 1 / (0,1 + 0,009) = 9,17. La risposta di Gustafson, 1988: con più processori si risolvono problemi più grandi, e in un problema più grande la parte parallela di solito cresce più in fretta di quella seriale.", { widths: [3.4, 2.4, 2.4, 2.4, 2.8], caption: "Speed-up. Mille processori su un programma parallelo al 90%: meno di dieci volte più veloce." }),
    V("Due modi di dividere il lavoro",
      ["Memoria condivisa", ["Più core di un nodo vedono la stessa memoria", "Il programma gira come thread che leggono e scrivono le stesse variabili", "Facile cominciare: OpenMP aggiunge una riga sopra un ciclo", "Il pericolo: due thread che scrivono la stessa variabile"]],
      ["Memoria distribuita", ["Ogni nodo ha la propria memoria; nulla è condiviso", "Il programma gira come processi che si scambiano messaggi", "MPI, Message Passing Interface, è lo standard", "Scala fino a un milione di core, e lo paga il programmatore"]],
      "Le applicazioni reali usano entrambi: MPI tra i nodi, thread e GPU dentro ogni nodo. I modelli meteorologici e marini del Dipartimento funzionano così."),
    T("Il limite è l'energia", [
      "Una macchina exascale assorbe circa venti megawatt: il consumo di una piccola città",
      "L'elettricità della sua vita utile costa quanto la macchina",
      "Quindi la cifra che conta sono le operazioni per watt, e ha una classifica sua: la Green500",
      "La guidano GPU e altri acceleratori: l'hardware specializzato fa di più con ogni joule",
      "Per la stessa ragione nel vostro kit c'è un piccolo core RISC-V: milliwatt",
    ], "Frontier ha raggiunto il suo exaflop a circa 21 megawatt. L'efficienza energetica è il filo che lega un microcontrollore a un supercalcolatore.", { big: "~20 MW", label: "per 10^18 operazioni al secondo: circa 50 miliardi di operazioni per joule" }),
    T("RISC-V e il supercalcolo europeo", [
      "Le macchine più grandi di oggi usano processori x86 o Arm con acceleratori GPU",
      "L'Europa progetta processori e acceleratori propri su RISC-V: la European Processor Initiative, e DARE, il progetto nominato nella prima lezione",
      "Monte Cimone, all'Università di Bologna con CINECA, 2022: un cluster HPC completo costruito su processori RISC-V",
      "Il Barcelona Supercomputing Center progetta e fabbrica core RISC-V propri",
      "Un insieme di istruzioni aperto permette a un continente di costruire ciò che altrimenti dovrebbe comprare",
    ], "DARE: Digital Autonomy with RISC-V in Europe. Le Research Computing Facilities del Dipartimento sono su rcf.uniparthenope.it: dopo la lezione, la visita.", { img: "rcf_page.png", cap: "Le Research Computing Facilities del Dipartimento" }),

    H("Acceleratori GPU", "Migliaia di piccoli core per un lavoro che si ripete."),
    V("Due modi di spendere i transistor",
      ["Una CPU", ["Pochi core grandi: decine", "Ciascuno fuori ordine, con predittori e grandi cache", "Costruita per finire un compito il prima possibile", "A suo agio con salti e dati irregolari"]],
      ["Una GPU", ["Migliaia di core piccoli e semplici", "Tutti eseguono lo stesso codice su dati diversi", "Costruita per finire un milione di compiti al secondo", "A suo agio con array regolari: pixel, matrici, griglie"]],
      "La Lezione 20 ha raccontato la storia dalla scheda video al GPGPU. I buoi e i polli di Cray: la risposta dipende dal campo. La GPU non è più veloce in nessuna singola cosa; fa più cose insieme."),
    S("Come un programma usa una GPU", [
      ["Preparare", "Il programma sulla CPU, l'host, costruisce i suoi array nella memoria centrale"],
      ["Copiare dentro", "I dati viaggiano verso la memoria della GPU: un costo reale, in tempo"],
      ["Lanciare", "Una piccola funzione, il kernel, gira in migliaia di thread, uno per elemento dei dati"],
      ["Copiare fuori", "I risultati tornano indietro, e l'host prosegue"],
    ], "La GPU è un dispositivo, come quelli della Lezione 21: la CPU le invia dati e comandi tramite un driver. Modelli di programmazione: CUDA, OpenCL, SYCL, e direttive come OpenACC e OpenMP offload."),
    K("La mappa di Verm1, un thread per cella", `// the kernel: this function runs once in every thread
__global__ void clear(unsigned char *grid, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // who am I?
    if (i < n)
        grid[i] = 0;                                 // my cell, and only mine
}

// on the host: 4 blocks of 256 threads cover the 960 cells
clear<<<(960 + 255) / 256, 256>>>(grid, 960);`, [
      "Non c'è un ciclo: ci sono 960 thread",
      "Ogni thread calcola il proprio indice e fa uno store",
      "I thread vanno a blocchi; gli ultimi non trovano nulla da fare",
      "Per 960 byte le copie costano molto più del lavoro",
    ], "CUDA C, nella sua forma abituale da manuale; non compilato per queste slide. L'ultima osservazione è seria: una GPU ripaga quando i dati sono grandi e il lavoro per elemento è reale. Chiedete: per quale dimensione della mappa ne varrebbe la pena?", "c", { wide: true }),
    T("Quando ripaga una GPU?", [
      "Quando la stessa operazione si applica a moltissimi dati, in modo indipendente: immagini, matrici, griglie di una simulazione, reti neurali",
      "Quando i dati possono restare sulla GPU per molti passi, invece di viaggiare a ognuno",
      "Non quando il lavoro è una catena di decisioni, ciascuna dipendente dalla precedente",
      "Di nuovo Amdahl: ciò che resta sulla CPU fissa il limite",
      "L'addestramento delle reti neurali di oggi è, quasi per intero, aritmetica matriciale su GPU",
    ], "Una simulazione meteorologica aggiorna ogni cella di una griglia tridimensionale a partire dalle vicine, milioni di volte: la stessa forma della mappa di Verm1, un po' più grande.", { img: "gpgpu_sum.png", cap: "Una somma parallela: log2 N passi invece di N", wide: true }),

    H("Acceleratori FPGA", "Hardware che si può riscrivere."),
    T("Un chip che diventa il circuito che descrivete", [
      "FPGA: field-programmable gate array",
      ["Dentro: un mare di piccoli blocchi programmabili", ["tabelle di look-up, ciascuna capace di essere qualunque funzione di pochi ingressi", "flip-flop, uno accanto a ogni tabella", "fili e interruttori che possono collegare ogni blocco a ogni altro"]],
      "Un file di configurazione, il bitstream, imposta ogni tabella e ogni interruttore",
      "Caricate un altro bitstream e lo stesso chip è un altro circuito",
      "In vendita dal 1985; oggi da pochi euro fino alle schede per i data center",
    ], "Lo Xilinx XC2064, 1985. Una FPGA non esegue un programma: diventa un circuito. Nulla viene prelevato o decodificato; tutte le porte lavorano nello stesso momento.", { img: "pcb.jpg", cap: "La logica programmabile sta sulle schede come ogni altro chip" }),
    G("Una tabella di look-up è una tabella di verità in memoria", ["a", "b", "memorizzato per AND", "memorizzato per XOR", "memorizzato per NOT a"], [
      ["0", "0", "0", "0", "1"],
      ["0", "1", "0", "1", "1"],
      ["1", "0", "0", "1", "0"],
      ["1", "1", "1", "0", "0"],
    ], "La Lezione 08 ha detto che una tabella di verità definisce una funzione; la Lezione 11 che una ROM indirizzata dagli ingressi realizza qualunque funzione. Una LUT è quella ROM, con quattro-sei ingressi, da sedici a sessantaquattro bit. Il flip-flop accanto è quello della Lezione 13. Una FPGA è questo corso, ripetuto centomila volte su un chip.", { widths: [1.4, 1.4, 3.4, 3.4, 3.4], mono: [0, 1, 2, 3, 4], caption: "Gli ingressi sono l'indirizzo; quattro bit memorizzati scelgono la funzione. Cambiare i bit cambia la porta." }),
    K("La regola dell'inversione a U di Verm1, in hardware", `// Lecture 12: opposite directions differ in bit 1 only
module uturn (
    input  wire [1:0] dir,      // direction of the last step
    input  wire [1:0] want,     // direction asked by the player
    output wire       refuse    // 1 = this would be a U-turn
);
    assign refuse = (dir ^ want) == 2'b10;
endmodule`, [
      "Verilog: un linguaggio che descrive circuiti, non passi",
      "assign è un filo, sempre vero: non c'è un prima e un dopo",
      "Due porte XOR e una AND con un ingresso negato",
      "Sul kit questa regola costava tre istruzioni e tre cicli",
    ], "Un linguaggio di descrizione dell'hardware: Verilog, o VHDL. Non sintetizzato per queste slide. Le xor, li, beq della Parte 2 diventano porte che rispondono in una frazione di nanosecondo, in continuazione. Chiedete agli studenti di disegnare il circuito: refuse = (d1 xor w1) and not (d0 xor w0).", "v", { wide: true }),
    F("Dalla descrizione al circuito", ["Descrivere|Verilog o VHDL; oppure C, con la sintesi ad alto livello", "Simulare|forme d'onda, come nella Lezione 13", "Sintetizzare|la descrizione diventa tabelle e flip-flop", "Piazzare e instradare|ognuno riceve un posto sul chip", "Configurare|si carica il bitstream"],
      "Da minuti a ore per ogni tentativo: più lento che compilare una cartuccia, molto più veloce che fabbricare un chip.", "Lo stesso percorso, con una fabbrica alla fine al posto di un bitstream, produce un ASIC: un chip fatto per un solo scopo. Le FPGA sono il luogo in cui i chip si provano prima di fabbricarli."),
    T("Anche un processore è un circuito", [
      "Un core RISC-V è una descrizione in un linguaggio hardware: lo si può caricare su una FPGA",
      "Questi soft core sono liberi da leggere e usare: PicoRV32, VexRiscv, NEORV32, Rocket",
      "Un core della classe di quello del vostro kit entra in una FPGA piccola ed economica",
      "E accanto potete metterci un circuito vostro, per l'operazione che il vostro programma ripete di più: un acceleratore su misura",
      "RISC-V riserva spazio nella sua codifica per istruzioni personalizzate, per raggiungere tali circuiti",
    ], "Qui si chiude il cerchio del corso: le porte della Lezione 08 costruiscono il sommatore della Lezione 09, i registri della Lezione 14, il processore della Lezione 18, e quel processore è un file che potete leggere. Reti, elaborazione dei segnali, finanza e i primi stadi dell'inferenza per l'IA usano le FPGA dove contano latenza ed energia.", { box: "Dalle porte a un processore, e ritorno: ora conoscete ogni livello intermedio.", head: "Il cerchio si chiude" }),
    G("Quattro modi di calcolare", ["", "CPU", "GPU", "FPGA", "ASIC"], [
      ["Che cos'è", "pochi core complessi", "migliaia di core semplici", "un circuito che si configura", "un circuito fatto per un solo compito"],
      ["Si programma in", "qualunque linguaggio", "kernel: CUDA, OpenCL, SYCL", "Verilog, VHDL, HLS", "lo stesso, poi una fabbrica"],
      ["Forte in", "tutto, con moderazione", "dati regolari in massa", "flussi, bassa latenza", "una cosa, alla perfezione"],
      ["Lavoro per joule", "basso", "alto", "alto", "il più alto"],
      ["Fatica d'uso", "bassa", "media", "alta", "molto alta"],
      ["Per cambiare idea", "si ricompila", "si ricompila", "un nuovo bitstream", "un nuovo chip"],
    ], "La generalità si paga in energia; l'efficienza si paga in fatica. Un moderno system on a chip li ha tutti e quattro: il vostro telefono contiene core CPU, una GPU, e circuiti fissi per video e radio.", { widths: [2.4, 2.6, 3.1, 2.8, 3.1] }),

    H("Ritorno alla macchina", "Un ciclo, cinque macchine."),
    G("Svuotare la mappa di Verm1: 960 celle", ["Macchina", "Come", "Passi nel tempo"], [
      ["Il kit: ESP32-C6", "un byte per giro, un'istruzione per ciclo", "3 840 cicli"],
      ["Core RISC-V fuori ordine", "lo stesso binario; più istruzioni per ciclo, il salto predetto", "una frazione di quei cicli"],
      ["RISC-V con i vettori, 128 bit", "16 byte per giro", "60 giri"],
      ["GPU", "960 thread, uno per cella", "un lancio, più due copie"],
      ["FPGA", "960 flip-flop con un reset comune", "un ciclo di clock"],
    ], "Il lavoro è lo stesso; cambia quanta parte ne avviene nello stesso momento. E i costi: alla prima riga servono un chip da due euro e quattro righe di assembly; all'ultima serve un progetto hardware. La domanda dell'ingegnere non è mai quale sia la più veloce, ma quale basti.", { widths: [3.6, 6.8, 3.6], caption: "Le prime tre righe sono lo stesso insieme di istruzioni. La prima e la terza sono state eseguite per queste slide." }),

    Q("Un programma è parallelo all'80%. Qual è il massimo speed-up che un numero qualunque di processori può dare?", ["4", "5", "8", "80"], 1, "Con n illimitato, S = 1 / (1 - p) = 1 / 0,2 = 5."),
    Q("Che cosa elimina la ridenominazione dei registri?", ["i salti", "il bisogno di uno stack", "le false dipendenze tra usi dello stesso nome di registro", "i cache miss"], 2, "Due valori indipendenti che condividono un nome ricevono registri fisici diversi e si possono calcolare nello stesso momento."),
    Q("Con registri vettoriali a 256 bit, quanti giri servono al ciclo vettoriale per i 960 byte?", ["4", "30", "60", "960"], 1, "256 bit sono 32 byte per giro: 960 / 32 = 30. Il codice non cambia."),
    Q("Una tabella di look-up a due ingressi memorizza, per gli ingressi 00, 01, 10, 11, i bit 0, 1, 1, 1. Quale porta è?", ["AND", "OR", "XOR", "NAND"], 1, "L'uscita vale 1 ogni volta che almeno un ingresso vale 1: OR."),
    X("Esercizi: prima su carta, poi sulla macchina", [
      "Compilate la tabella di Amdahl per p = 0,95 e n = 10, 100, 1000",
      "Disegnate il diagramma della pipeline di un processore di larghezza tre per nove istruzioni indipendenti con cinque stadi",
      "Rinominate i registri del codice step-wrap di Verm1, Parte 2: quali istruzioni potrebbero correre nello stesso ciclo?",
      "Scrivete la tabella di verità memorizzata in una tabella di look-up a quattro ingressi per refuse = (dir xor want) == 2",
      "Compilate tools/tests/vector_qemu.S ed eseguitelo su QEMU con vlen=128 e vlen=512: perché funziona lo stesso binario?",
    ], "Amdahl, p = 0,95: 6,9; 16,8; 19,6. Nove istruzioni, larghezza tre: sette cicli. La tabella di look-up ha quattro uni su sedici voci.",
      "QEMU: qemu-system-riscv32 -machine virt -cpu rv32,v=true,vlen=128; il comando di compilazione è in tools/tests/README.md. I quattro uni della tabella: (dir, want) = (0,2), (1,3), (2,0), (3,1)."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["superscalar", "superscalare", "out-of-order execution", "esecuzione fuori ordine"],
      ["register renaming", "ridenominazione dei registri", "branch prediction", "predizione dei salti"],
      ["speed-up", "accelerazione (speed-up)", "node", "nodo"],
      ["shared memory", "memoria condivisa", "message passing", "scambio di messaggi"],
      ["accelerator", "acceleratore", "kernel (GPU)", "kernel"],
      ["look-up table", "tabella di look-up", "bitstream", "bitstream"],
      ["hardware description language", "linguaggio di descrizione dell'hardware", "soft core", "soft core"],
    ], null, { widths: [3.4, 3.8, 3.2, 3.6] }),
    T("Conclusioni e letture", [
      "Un'equazione, tre fattori: ogni macchina veloce ne attacca uno, oppure moltiplica i processori",
      "I core superscalari fuori ordine rispettano il contratto dell'insieme di istruzioni ed eseguono molte istruzioni insieme",
      "Vettori, GPU e cluster sfruttano i dati che si possono elaborare in modo indipendente; la legge di Amdahl dice fin dove si arriva",
      "Le FPGA trasformano una descrizione in un circuito: la logica di questo corso, su grande scala",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, capitoli 4 e 6", "Hennessy, Patterson: Computer Architecture, A Quantitative Approach", "top500.org; la specifica vettoriale di RISC-V su riscv.org"]],
    ], "Il corso finisce qui: da un bit a un supercalcolatore, con un solo insieme di istruzioni. Poi: la visita ai sistemi di calcolo del Dipartimento, e la presentazione dei giochi degli studenti.", { img: "book_patterson.jpg", cap: "Patterson, Hennessy: edizione RISC-V" }),
  ],
});
