// Italian version of decks/en/14-registers-and-buses.js: same slides, same listings, text in Italian.
// Lecture 14 - Elementary machines for the architecture: word gates, registers, buses, three-state buffers, shift registers.
// Source: 13-Architettura_dei_Calcolatori-Macchine_elementari_per_architettura.pptx (translated, figures redrawn, RISC-V / PRG32 links added).
const box9 = (s, h, t, x, y, w, hh, col, fs) => s.addText(t, { isTextBox: true, shape: h.pres.ShapeType.roundRect, rectRadius: 0.06, x, y, w, h: hh, fill: { color: col }, line: { color: col, width: 0 },
  color: P.white, bold: true, fontFace: h.BODY, fontSize: fs || 15, align: "center", valign: "middle", margin: 3 });

// A row of n flip-flop cells for shift-register drawings.
function cells9(s, h, x, y, n, labels, col) {
  const w = 0.95, g = 0.35;
  for (let i = 0; i < n; i++) {
    box9(s, h, labels[i], x + i * (w + g), y, w, 0.75, col || P.teal, 15);
    if (i < n - 1) h.arrow(s, x + i * (w + g) + w + 0.03, y + 0.375, x + (i + 1) * (w + g) - 0.03, y + 0.375, P.mute, 2);
  }
  return { w, g, end: x + n * (w + g) - g };
}

Deck({
  n: "14", file: "14-Architettura_dei_Calcolatori-Registri_e_Bus",
  title: "Macchine elementari: registri e bus", short: "Registri e bus",
  sub: "Porte di parola, registri, bus, buffer a tre stati, trasferimenti seriali e paralleli",
  quote: ["Strade? Dove stiamo andando non c'è bisogno di strade.", "Dr. Emmett Brown, Ritorno al futuro, Robert Zemeckis, 1985"],
  cover: "menu_main.png",
  notes: "Spirale: il display del kit PRG32 riceve ogni pixel un bit alla volta; il riscaldamento invia un byte in serie in assembly, e la lezione costruisce le macchine che lo fanno in hardware.",
  slides: [
    O("Che cosa saprete fare alla fine", [
      "Descrivere un registro come insieme di flip-flop con un clock comune, e spiegarne il segnale di caricamento",
      "Spiegare che cos'è un bus, e confrontare i bus dedicati con un bus comune",
      "Dire perché a un bus comune servono i buffer a tre stati, e che cosa significa alta impedenza",
      "Descrivere un registro a scorrimento e le sue quattro combinazioni di ingresso e uscita seriali e paralleli",
      "Convertire un dato da parallelo a seriale e viceversa, in hardware e in assembly RISC-V",
    ]),

    H("Riscaldamento sulla macchina", "Un filo, otto bit."),
    K("Inviare un byte un bit alla volta", `# a0 = the byte to send, most significant bit first

    li   t0, 8               # eight bits to go
1:  srli t1, a0, 7           # bring bit 7 down to bit 0
    andi t1, t1, 1           # t1 = the bit to put on the wire
    ...                      # drive the data line with t1,
    ...                      # then pulse the clock line
    slli a0, a0, 1           # shift left: the next bit moves up
    addi t0, t0, -1
    bnez t0, 1b`, [
      "Il display e il chip audio del kit sono collegati da pochi fili, non da trentadue",
      "Una parola deve quindi viaggiare un bit dopo l'altro: un trasferimento seriale",
      "Il ciclo è un registro a scorrimento in software: scorrere, prendere un bit, ripetere",
      "L'ESP32-C6 ha hardware che fa esattamente questo, milioni di volte al secondo",
    ], "Scritto per questa lezione. Sul kit il display usa SPI e l'amplificatore I2S: entrambi sono bus seriali pilotati da registri a scorrimento interni al chip. Le due righe omesse scriverebbero in registri GPIO mappati in memoria (Lezione 15)."),

    H("Porte di parola e registri", "Da un bit a una parola intera."),
    T("Porte di parola", [
      "Una parola è un vettore V di n bit: V = (v0, v1, ..., v(n-1))",
      "Una porta di parola agisce insieme su tutti i bit di una parola",
      ["Con un segnale di controllo a, la porta di parola calcola a AND v(i) per ogni i", ["a = 1: la parola passa invariata; a = 0: ogni bit è forzato a 0"]],
      "Sono n porte identiche con un ingresso di controllo comune",
      "Le istruzioni bit a bit and, or, xor di RISC-V sono porte di parola larghe trentadue bit",
    ], "In inglese: word gates. Il multiplexer su parole della Lezione 11 è costruito con porte di parola.", { big: "n porte", label: "una porta per bit, un segnale di controllo per tutte: il mattone di ogni datapath" }),
    T("Il registro", [
      "Un registro è un dispositivo capace di memorizzare un gruppo di bit",
      "Nella forma più semplice: un gruppo di flip-flop e un segnale di sincronizzazione comune, un clock o un'abilitazione",
      ["Esempio: il 74273, un registro a 8 bit in un chip", ["otto flip-flop D; un clock e un clear; ingressi da D0 a D7, uscite da Q0 a Q7"]],
      "Caricare un registro: il dato ai suoi ingressi viene memorizzato quando il segnale di caricamento è attivo, di solito in sincronia con il clock",
      "In RISC-V ciascuno dei registri da x1 a x31 è fatto di trentadue flip-flop di questo tipo",
    ], "Datasheet: ti.com/lit/ds/symlink/sn74ls273.pdf. Il 7474 contiene due flip-flop D con preset e clear. Per il flip-flop si veda la Lezione 13.", { img: "chip_74273.jpg", cap: "Un 74LS273 su una scheda: otto flip-flop D con un clock comune" }),

    H("Bus", "Come viaggiano i dati tra i registri."),
    DEF("Trasferimenti di dati e bus", "Bus", "Un canale di comunicazione che permette ai componenti di un sistema elettronico di scambiarsi dati trasmettendo e ricevendo segnali: l'insieme delle linee che trasporta un dato.", [
      "Il trasferimento da un registro X a un registro Y è l'operazione fondamentale dell'architettura di un calcolatore",
      "Il nome è una contrazione del latino omnibus: per tutti",
      "Un bus di n linee trasporta in un passo una parola di n bit",
    ], "Quasi ogni istruzione della Lezione 02 è, in fondo, una sequenza di trasferimenti tra registri."),
    V("Due soluzioni tecniche",
      ["Bus dedicati", ["Un insieme di linee per ogni possibile trasferimento", "Più trasferimenti possono avvenire insieme", "Efficienti ma costosi: i fili crescono con il quadrato del numero di registri"]],
      ["Bus comune", ["Un unico percorso raccoglie molti trasferimenti potenziali", "Ogni volta si scelgono una sorgente e una destinazione", "Un trasferimento richiede due passi: da sorgente a bus, da bus a destinazione", "Economico e diffuso; meno efficiente, perché i trasferimenti non possono essere simultanei"]],
      "Esistono soluzioni intermedie: più bus, ciascuno condiviso da un gruppo di registri. I processori reali le usano."),
    T("Trasferimenti paralleli, seriali e misti", [
      "Parallelo: gli n bit della parola viaggiano insieme su n linee, in un passo",
      "Seriale: i bit viaggiano uno dopo l'altro su una sola linea, in n passi",
      "Misto: per esempio seriale sul byte: otto linee portano un byte alla volta",
      "Accedere a un bus significa leggerlo o scriverlo; i bus hanno dimensioni fisiche molto diverse",
      "Dentro un chip i bus sono paralleli; tra chip e tra macchine oggi sono quasi sempre seriali",
    ], "USB, SATA, PCI Express, HDMI ed Ethernet sono tutti seriali: ad altissima velocità è più facile tenere pulita una linea veloce che tenere al passo trentadue linee.", { img: "pcb.jpg", cap: "Piste di rame su un circuito stampato" }),
    D("Da bus a registro, e da registro a bus", (s, h) => {
      const y = h.TOP + 0.5;
      h.line(s, h.MX + 0.3, y, 6.3, y, P.amber, 6); h.tx(s, "bus A", { x: h.MX + 0.3, y: y - 0.45, w: 2, h: 0.3, fontSize: 15, bold: true, color: P.amber });
      box9(s, h, "registro R", 2.3, y + 1.3, 2.4, 0.9, P.teal, 16);
      h.arrow(s, 3.5, y + 0.05, 3.5, y + 1.27, P.mute, 2.5); h.arrow(s, 1.2, y + 1.75, 2.27, y + 1.75, P.red, 2.25); h.tx(s, "load c", { x: h.MX, y: y + 1.35, w: 1.3, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.tx(s, "Da bus a registro: il dato viene caricato in R quando è attivo il segnale di caricamento c (uno strobe, di solito in sincronia con il clock).", { x: h.MX, y: y + 2.6, w: 5.8, h: 1.2, fontSize: 15.5 });
      const x2 = 7.0;
      h.line(s, x2, y, h.W - h.MX, y, P.amber, 6); h.tx(s, "bus A", { x: x2, y: y - 0.45, w: 2, h: 0.3, fontSize: 15, bold: true, color: P.amber });
      box9(s, h, "registro R", x2 + 1.6, y + 1.9, 2.4, 0.9, P.teal, 16);
      box9(s, h, "buffer", x2 + 2.2, y + 0.75, 1.2, 0.55, P.violet, 13);
      h.arrow(s, x2 + 2.8, y + 1.87, x2 + 2.8, y + 1.33, P.mute, 2.5); h.arrow(s, x2 + 2.8, y + 0.72, x2 + 2.8, y + 0.05, P.mute, 2.5);
      h.arrow(s, x2 + 0.7, y + 1.02, x2 + 2.17, y + 1.02, P.red, 2.25); h.tx(s, "enable c", { x: x2 - 0.1, y: y + 0.62, w: 1.6, h: 0.3, fontSize: 14, bold: true, color: P.red });
      h.tx(s, "Da registro a bus: le uscite di R raggiungono il bus solo finché è attivo il segnale di abilitazione c. E quando non lo è, che cosa succede al bus?", { x: x2, y: y + 3.1, w: h.W - h.MX - x2, h: 1.2, fontSize: 15.5 });
    }, "Trasferimento dati su bus unico: caricamento di un registro (da bus a registro) e trasferimento da registro a bus."),

    H("Buffer a tre stati", "Condividere un filo senza cortocircuiti."),
    D("La porta a tre stati", (s, h) => {
      h.rows(s, [
        "Se due registri pilotassero lo stesso filo, uno con 0 e uno con 1, il risultato sarebbe un cortocircuito",
        "Un'uscita a tre stati ha una terza condizione oltre a 0 e 1: l'alta impedenza, indicata con z",
        "In alta impedenza l'uscita è elettricamente scollegata: non pilota il filo e non lo carica",
        "Decide un segnale di abilitazione a: con a = 1 la porta lavora normalmente, con a = 0 l'uscita è z",
        "È la tecnica più diffusa per collegare più registri sorgente a un bus comune",
      ], h.MX, h.TOP, 7.0, h.BOT - h.TOP);
      h.table(s, 8.2, h.TOP, [1.0, 1.0, 1.0, 1.5], ["a", "x", "y", "uscita"], [["1", "0", "0", "0"], ["1", "0", "1", "0"], ["1", "1", "0", "0"], ["1", "1", "1", "1"], ["0", "qualsiasi", "qualsiasi", "z"]],
        { fs: 16, mono: [0, 1, 2, 3], align: "center", bold0: false, rowH: 0.46, hi: { 4: P.amberSoft } });
      h.tx(s, "Un AND a tre stati con abilitazione attiva alta: con a = 1 è un normale AND; con a = 0 la sua uscita è flottante.", { x: 8.2, y: h.TOP + 3.0, w: 4.5, h: 1.2, fontSize: 14, italic: true, color: P.mute });
    }, "AND tristate; segnale di abilitazione in logica 1-attiva. Elettricamente, entrambi i transistor di uscita sono spenti."),
    T("Abilitare un bus", [
      "Una porta di parola a tre stati tra un segnale di abilitazione a e un bus X dà un bus Y",
      "Y riproduce X se a è attivo; altrimenti tutte le sue linee sono in alta impedenza: Y assume il valore neutro",
      "Si dice che Y è sostenuto da un buffer a tre stati",
      "I piedini GPIO dell'ESP32-C6 funzionano così: ogni piedino può essere un'uscita, oppure essere rilasciato e usato come ingresso",
    ], "Tristate di parola. Sul kit i piedini del joystick sono configurati come ingressi (i loro buffer di uscita in alta impedenza) e quelli del display come uscite.", { big: "0, 1, z", label: "tre stati: basso, alto e scollegato" }),
    D("Collegare i bus: l'OR di bus", (s, h) => {
      const y = h.TOP + 0.2, names = ["registro A", "registro B", "registro X"], en = ["enable α", "enable β", "enable ξ"];
      names.forEach((n, i) => {
        const x = h.MX + 0.2 + i * 2.2;
        box9(s, h, n, x, y, 1.8, 0.8, P.teal, 14); box9(s, h, "3 stati", x + 0.35, y + 1.25, 1.1, 0.5, P.violet, 12.5);
        h.arrow(s, x + 0.9, y + 0.83, x + 0.9, y + 1.22, P.mute, 2); h.arrow(s, x + 0.9, y + 1.78, x + 0.9, y + 2.55, P.mute, 2);
        h.tx(s, en[i], { x: x - 0.25, y: y + 1.85, w: 1.1, h: 0.3, fontSize: 12, bold: true, color: P.red });
      });
      h.line(s, h.MX, y + 2.6, 7.0, y + 2.6, P.amber, 6); h.tx(s, "bus comune Y", { x: 4.9, y: y + 2.7, w: 2.2, h: 0.3, fontSize: 14, bold: true, color: P.amber });
      box9(s, h, "registri\ndestinazione", 2.4, y + 3.5, 2.2, 0.9, P.steel, 14); h.arrow(s, 3.5, y + 2.65, 3.5, y + 3.47, P.mute, 2);
      h.rows(s, [
        "Più registri sorgente si collegano a un bus semplicemente unendone le uscite, ciascuna attraverso un buffer a tre stati",
        "La condizione: delle n sorgenti che confluiscono nel bus, al più una è abilitata alla volta. Un segnale attivo, gli altri n - 1 neutri",
        "Dal lato delle destinazioni ogni registro è collegato al bus, e prende il dato solo quello il cui segnale di caricamento è attivo",
        "Scegliere sorgente e destinazione è compito dei decodificatori, pilotati dall'unità di controllo",
      ], 7.5, h.TOP, h.W - h.MX - 7.5, h.BOT - h.TOP);
    }, "Collegamento di bus: OR di bus; trasferimento verso registri-destinazione. Dentro i chip moderni le lunghe linee condivise sono di solito sostituite da multiplexer, che fanno la stessa selezione senza stati di alta impedenza; tra chip i bus a tre stati restano la regola."),

    H("Registri a scorrimento", "Registri che spostano i propri bit."),
    DEF("Registri a scorrimento", "Definizione", "Una catena di celle di memoria da un bit collegate tra loro: a ogni impulso di clock ogni bit passa da una cella a quella adiacente.", [
      "Lo scorrimento può andare in un verso fisso, o in un verso scelto da una linea di controllo (registri bidirezionali)",
      "Facilitano la lettura e la scrittura di dati in un sistema: trasformano dati paralleli in seriali e viceversa",
      "Ogni cella è un flip-flop D il cui ingresso è l'uscita della cella vicina",
    ], "In inglese: shift registers. Qui i flip-flop sensibili al fronte sono essenziali: con latch trasparenti un bit attraverserebbe l'intera catena in un solo impulso di clock (Lezione 13)."),
    D("Quattro tipi di registro a scorrimento", (s, h) => {
      const L = ["F1", "F2", "...", "FN"], y = h.TOP + 0.25;
      h.tx(s, "Ingresso seriale, uscita seriale", { x: h.MX, y: y - 0.3, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      let c = cells9(s, h, h.MX + 0.8, y + 0.15, 4, L); h.arrow(s, h.MX, y + 0.52, h.MX + 0.77, y + 0.52, P.mute, 2); h.arrow(s, c.end + 0.03, y + 0.52, c.end + 0.7, y + 0.52, P.mute, 2);
      h.tx(s, "Ingresso seriale, uscita parallela", { x: 6.9, y: y - 0.3, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      c = cells9(s, h, 7.7, y + 0.15, 4, L, P.amber); h.arrow(s, 6.9, y + 0.52, 7.67, y + 0.52, P.mute, 2); for (let i = 0; i < 4; i++) h.arrow(s, 7.7 + i * 1.3 + 0.47, y + 0.93, 7.7 + i * 1.3 + 0.47, y + 1.4, P.mute, 2);
      const y2 = y + 2.35;
      h.tx(s, "Ingresso parallelo, uscita seriale", { x: h.MX, y: y2 - 0.75, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      c = cells9(s, h, h.MX + 0.8, y2 + 0.15, 4, L, P.violet); for (let i = 0; i < 4; i++) h.arrow(s, h.MX + 0.8 + i * 1.3 + 0.47, y2 - 0.35, h.MX + 0.8 + i * 1.3 + 0.47, y2 + 0.12, P.mute, 2); h.arrow(s, c.end + 0.03, y2 + 0.52, c.end + 0.7, y2 + 0.52, P.mute, 2);
      h.tx(s, "Ingresso parallelo, uscita parallela", { x: 6.9, y: y2 - 0.75, w: 6, h: 0.3, fontSize: 14, bold: true, color: P.steel });
      cells9(s, h, 7.7, y2 + 0.15, 4, L, P.green); for (let i = 0; i < 4; i++) { h.arrow(s, 7.7 + i * 1.3 + 0.47, y2 - 0.35, 7.7 + i * 1.3 + 0.47, y2 + 0.12, P.mute, 2); h.arrow(s, 7.7 + i * 1.3 + 0.47, y2 + 0.93, 7.7 + i * 1.3 + 0.47, y2 + 1.4, P.mute, 2); }
      h.tx(s, "La stessa catena di flip-flop, con un clock comune c; cambia dove i dati entrano e dove escono. Ingresso e uscita paralleli senza scorrimento sono il registro ordinario.", { x: h.MX, y: 5.95, w: h.CW, h: 0.8, fontSize: 15, valign: "middle" });
    }, "SISO, SIPO, PISO e PIPO. La linea di clock non è disegnata."),
    T("Trasferimenti tra registri", [
      ["Trasferimento seriale: l'uscita seriale di un registro a scorrimento alimenta l'ingresso seriale di un altro", ["n impulsi di clock spostano una parola di n bit; basta un filo"]],
      ["Trasferimento parallelo: le uscite parallele di un registro alimentano gli ingressi paralleli di un altro", ["un impulso di clock sposta l'intera parola; servono n fili"]],
      "Tempo contro fili: lo stesso compromesso tra bus dedicati e bus comune",
    ], "Trasferimento seriale (ingresso seriale, uscita seriale) e trasferimento parallelo (ingresso parallelo, uscita parallela).", { big: "n impulsi o n fili", label: "spostare una parola di n bit costa o tempo o rame" }),
    F("Da seriale a parallelo e ritorno", [
      "Caricamento|il dato di n bit è posto in parallelo nel registro R",
      "Uscita seriale|R è un registro a scorrimento: gli n bit escono uno dopo l'altro, in n passi successivi",
      "Viaggio|una sola linea li porta all'apparato a valle",
      "Ingresso seriale|un altro registro è caricato in serie in n passi, ricostruendo il dato bit per bit",
      "Uso|il dato ricostruito viene passato avanti in parallelo",
    ], "È l'hardware del riscaldamento. Il display del kit riceve così ogni pixel, su SPI; la tastiera della Lezione 21 invia così ogni codice di tasto.",
      "Trasformazione serie-parallelo di un dato. UART, SPI, I2C, I2S e USB poggiano tutti su una coppia di registri a scorrimento, uno per estremità."),
    D("Registri con un indirizzo: una prima memoria", (s, h) => {
      const y = h.TOP + 0.1;
      box9(s, h, "decodificatore\n2-a-4", h.MX + 1.1, y + 0.9, 1.5, 2.3, P.amber, 14);
      for (let i = 0; i < 4; i++) { box9(s, h, `registro ${i}  (3 bit)`, 3.6, y + 0.55 + i * 0.78, 3.0, 0.6, P.teal, 13.5); h.arrow(s, h.MX + 2.63, y + 0.85 + i * 0.78, 3.57, y + 0.85 + i * 0.78, P.amber, 1.75); }
      h.arrow(s, h.MX + 0.1, y + 2.05, h.MX + 1.07, y + 2.05, P.mute, 2); h.tx(s, "A1 A0", { x: h.MX, y: y + 1.65, w: 1.1, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.1, y - 0.05, 5.1, y + 0.52, P.mute, 2); h.tx(s, "I2 I1 I0", { x: 5.3, y: y - 0.05, w: 1.6, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.arrow(s, 5.1, y + 3.52, 5.1, y + 4.1, P.mute, 2); h.tx(s, "O2 O1 O0", { x: 5.3, y: y + 3.75, w: 1.6, h: 0.3, fontSize: 14, bold: true, fontFace: h.MONO });
      h.tx(s, "controllo: CS, RD, OE", { x: h.MX, y: y + 3.75, w: 3.2, h: 0.3, fontSize: 13.5, bold: true, color: P.red });
      h.rows(s, [
        "Quattro registri di tre bit: una memoria di 4 parole per 3 bit",
        "Due linee di indirizzo, A1 e A0, vanno a un decodificatore che seleziona un registro",
        "Tre ingressi dati e tre uscite dati, condivisi da tutti i registri",
        ["Tre linee di controllo", ["CS, chip select: la memoria risponde solo quando è selezionata", "RD, lettura o scrittura", "OE, output enable: uscite a tre stati, così più memorie possono condividere un bus"]],
        "Tutto ciò che contiene viene dalle Lezioni 11, 13 e da questa",
      ], 7.3, h.TOP, h.W - h.MX - 7.3, h.BOT - h.TOP);
    }, "Memoria 4 (registri) x 3 (bit): otto ingressi (I0-I2, A0-A1, CS, RD, OE) e tre uscite. La prossima lezione porta questo schema alla scala della memoria centrale."),

    H("Ritorno alla macchina", "Registri e bus sul kit."),
    G("I bus del kit PRG32", ["Collegamento", "Tipo", "Linee", "Che cosa vi viaggia"], [
      ["dentro l'ESP32-C6", "parallelo", "32 linee dati, indirizzi e controllo", "istruzioni, dati e trasferimenti tra registri"],
      ["display (ILI9341)", "seriale, SPI", "clock, dati in uscita, chip select, dato/comando", "ogni pixel di ogni frame, bit per bit"],
      ["amplificatore audio", "seriale, I2S", "clock di bit, selezione di parola, dati", "campioni audio, 22.050 al secondo"],
      ["joystick e pulsanti", "un filo per pulsante", "un piedino di ingresso ciascuno", "una rappresentazione decodificata: una linea per pulsante"],
      ["USB verso il portatile", "seriale, coppia differenziale", "due fili di dati", "il firmware e la console di debug"],
    ], "Dalla descrizione hardware del repository di PRG32 (docs/hardware). Chip select è il CS della piccola memoria della presentazione della lezione: più dispositivi possono condividere lo stesso bus seriale perché ascolta solo quello selezionato.", { widths: [2.8, 2.3, 3.6, 3.5] }),
    T("Scorrimenti in RISC-V: uno shift register in un'istruzione", [
      "slli e srli spostano tutti i bit di un registro di un dato numero di posizioni, riempiendo di zeri",
      "srai riempie con copie del bit di segno (Lezione 05)",
      "sll, srl e sra prendono la quantità da un secondo registro",
      "In hardware uno scorrimento di una quantità qualsiasi in un solo passo è fatto da un barrel shifter: strati di multiplexer, non una catena di flip-flop",
      "Lo shifter è una delle unità della ALU della Lezione 11",
    ], "A un vero registro a scorrimento servono n impulsi di clock per n posizioni; il barrel shifter della ALU è combinatorio e lo fa entro un periodo di clock.", { code: "# parallel to serial, LSB first\nandi t1, a0, 1     # take bit 0\nsrli a0, a0, 1     # next bit\n\n# serial to parallel, MSB first\nslli a1, a1, 1     # make room\nor   a1, a1, t1    # insert bit", wide: true, h: 3.4 }),

    Q("Perché a un bus comune servono i buffer a tre stati?", ["Per rendere più veloci i trasferimenti", "Perché solo la sorgente abilitata piloti le linee", "Per memorizzare il dato sul bus", "Per convertire i dati da seriali a paralleli"], 1, "Più sorgenti condividono le stesse linee; tutte tranne una devono essere elettricamente scollegate (alta impedenza), altrimenti due uscite si contenderebbero il filo."),
    Q("Quanti impulsi di clock richiede il trasferimento seriale di una parola di 32 bit?", ["1", "5", "32", "64"], 2, "Un bit per impulso: n impulsi per n bit. Un trasferimento parallelo richiede un impulso e n fili."),
    Q("Una memoria ha 10 linee di indirizzo e 8 linee di dati. Quanti bit memorizza?", ["80", "1024", "8192", "10.240"], 2, "2^10 = 1024 parole di 8 bit: 8192 bit, cioè 1 KiB."),
    X("Esercizi: prima su carta, poi su PRG32", [
      "Disegnate un registro a scorrimento a 4 bit, ingresso seriale e uscita parallela, con flip-flop D, e compilatene il contenuto su quattro impulsi di clock per l'ingresso 1, 0, 1, 1",
      "Tre registri condividono un bus comune: scrivete i segnali di abilitazione e di caricamento necessari per copiare il registro B nel registro A",
      "Completate il riscaldamento: scrivete il ciclo che riceve otto bit da una linea e ricostruisce il byte",
      "Su PRG32 mostrate un byte come otto lampade e fatelo scorrere a sinistra di una posizione ogni mezzo secondo",
      "Fate rientrare da destra il bit che esce a sinistra (una rotazione): un contatore ad anello",
    ], "Su PRG32: una configurazione di lampade che cammina verso sinistra e, nell'ultimo esercizio, gira all'infinito.",
      "Esercizio 3: slli a1, a1, 1 e poi or con il bit ricevuto, otto volte. Esercizio 5: srli t1, a0, 7; andi t1, t1, 1; slli a0, a0, 1; or a0, a0, t1; andi a0, a0, 255."),
    G("Glossario: inglese e italiano", ["Inglese", "Italiano", "Inglese", "Italiano"], [
      ["word gate", "porta di parola", "three-state (tri-state)", "a tre stati (tristate)"],
      ["register", "registro", "high impedance", "alta impedenza"],
      ["bus", "bus", "shift register", "registro a scorrimento"],
      ["dedicated / common bus", "bus dedicato / comune", "serial / parallel transfer", "trasferimento seriale / parallelo"],
      ["load, strobe", "caricamento, strobe", "chip select", "selezione del chip"],
    ], null, { widths: [3.1, 3.1, 3.3, 3.3] }),
    T("Conclusioni e letture", [
      "I registri sono una forma evoluta di memoria con un modo di funzionare elementare",
      "La lettura e la scrittura dei registri avvengono attraverso bus di tipo diverso",
      "Perché un bus comune funzioni servono circuiti a tre stati: 0, 1 e scollegato",
      "I dati si trasferiscono in serie o in parallelo; i registri a scorrimento convertono tra le due forme",
      "Un decodificatore davanti a un gruppo di registri fa una memoria: l'argomento della prossima lezione",
      ["Letture", ["Patterson, Hennessy: Struttura e progetto dei calcolatori, edizione RISC-V, appendice A", "Bucci: Architettura dei calcolatori elettronici, i capitoli su registri e bus", "Repository di PRG32: docs/hardware/hardware.md"]],
    ], "Prossima lezione: la memoria."),
  ],
});
