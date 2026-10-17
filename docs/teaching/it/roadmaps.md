# Percorsi delle lezioni

*Generato da `tools/textbook/teaching_docs.js` a partire da `tools/concepts/assessments.json`, `bridges.json` e dal registro: non modificare a mano.*

Per ogni lezione: su che cosa si appoggia, i risultati di oggi, lo stato di apprendimento dei suoi concetti, i ponti che richiamano ciò che era stato rinviato, il prossimo passo e il filo della lezione. Lo stesso testo apre le note di ogni presentazione e il capitolo del libro.

## Lezione 00: Introduzione al corso

Percorso. I risultati di oggi: (1) descrivere i quattro passi della spirale di apprendimento e dire perché la previsione viene prima dell'esecuzione; (2) enunciare le regole di valutazione: una prova intercorso, due parti d'esame da superare entrambe, nessun dispositivo e nessuna IA. Si appoggia su: niente: è la prima lezione. Prossimo passo: Lezione 01, PRG32 e PRG32-QT: allestire la propria officina.

Il filo della lezione: Il corso segue un solo metodo: giocare, osservare, formalizzare, ritornare. Ogni argomento comincerà come qualcosa visto su PRG32 e finirà come una regola che permette di prevederlo. Prossimo passo: installare il laboratorio.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il metodo: prima il programma; le regole del corso. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: i componenti di PRG32 (Lezione 01); RISC e un ISA aperto (Lezione 03); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

Percorso. I risultati di oggi: (1) spiegare il percorso da un file sorgente a una cartuccia in esecuzione: sorgente, traduttore, codice macchina, cartuccia, host; (2) eseguire una cartuccia in PRG32-QT e compilarne una dal terminale. Si appoggia su: la Lezione 00, e Partire da zero per chi non ha mai programmato. Prossimo passo: Lezione 02, Primo contatto: l'assembly RISC-V su PRG32.

Il filo della lezione: Ora possedete l'intero ciclo: scrivere un sorgente, tradurlo, inviare la cartuccia a un host, fermarla nel debugger. Prossimo passo: scrivere il sorgente da voi.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: programma, sorgente, codice macchina; i componenti di PRG32. DA UTILIZZARE OGGI: il terminale, gli strumenti di PRG32, il debugger di PRG32-QT, il programma completo (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: contratto init/update/draw (Lezione 02); i registri (Lezione 02). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 02: Primo contatto: l'assembly RISC-V su PRG32

Percorso. I risultati di oggi: (1) compilare ed eseguire una cartuccia, e dire quando il runtime chiama init, update e draw; (2) leggere una riga di assembly: etichetta, istruzione, operandi, commento; (3) distinguere un indirizzo da un valore, e tracciare che cosa lasciano la, lw, addi e sw nei registri e in memoria. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 03, Storia della computazione.

Il filo della lezione: Un programma è fatto di poche funzioni che il runtime chiama; ogni riga è un'istruzione; i valori stanno nei registri mentre si calcola e in memoria tra un frame e l'altro. Tutto il resto che avete usato oggi ha una sua lezione. Prossimo passo: da dove vengono queste idee.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: registri, calcolo, trasferimento, salto; i registri; funzioni, chiamata e ritorno; contratto init/update/draw; leggere una riga di assembly; gli argomenti in a0 ... a7; perché si salva ra; indirizzo, valore, load, store; le istruzioni di base; le pseudo-istruzioni; un'istruzione è un numero; seguire a mano l'esecuzione. DA UTILIZZARE OGGI: l'esadecimale (Lezione 04); bit, byte, parola (Lezione 04); la convenzione di chiamata (Lezione 18); le maschere di bit (Lezione 08) e, usati senza essere studiati nel corso, le direttive dell'assemblatore, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT, il programma completo. DA COMPRENDERE PIÙ AVANTI: la pila (Lezione 18); i modi di indirizzamento (Lezione 19); formati delle istruzioni (Lezione 19); il complemento a due (Lezione 05); la virgola fissa (Lezione 06); l'algebra di Boole (Lezione 08); il sommatore (Lezione 09); dai volt ai bit (Lezione 10); latch e flip-flop (Lezione 13); il ciclo del processore (Lezione 19); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 03: Storia della computazione

Percorso. I risultati di oggi: (1) definire l'informatica e spiegare perché non riguarda solo i computer; (2) nominare le unità dell'architettura di von Neumann e la sua idea del programma memorizzato; (3) dire che cosa distingue RISC da CISC e perché RISC-V è aperto. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 04, Rappresentare l'informazione digitale.

Il filo della lezione: La macchina che avete programmato nella Lezione 02 è una macchina di von Neumann: programma e dati in un'unica memoria. RISC-V è l'ultimo passo di un lungo dibattito su quanto debbano essere semplici le istruzioni. Prossimo passo: come qualsiasi cosa diventa bit.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: che cos'è l'informatica; l'architettura di von Neumann; RISC e un ISA aperto. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'algebra di Boole (Lezione 08). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 04: Rappresentare l'informazione digitale

Percorso. I risultati di oggi: (1) distinguere l'informazione analogica da quella digitale e contare i valori che n bit possono rappresentare; (2) codificare numeri, colori e testo in bit: notazione posizionale, esadecimale, RGB565, ASCII; (3) nominare le strutture dati di base e le proprietà di un algoritmo. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 05, Rappresentazione dei numeri: gli interi.

Ponte. Nella Lezione 02 l'istruzione addi t1, t1, 1 è comparsa in memoria come la parola 0x00130313. Oggi gli stessi 32 bit si possono leggere come numero, colore, quattro lettere o istruzione: decide il codice. La Lezione 19 legge l'istruzione campo per campo. Richiamo: Nominate due cose diverse che una parola di 32 bit può significare, e che cosa decide quale significato vale.

Il filo della lezione: I bit da soli non significano nulla: un codice dà loro un significato, e gli stessi 32 bit possono essere un numero, un colore, quattro lettere o un'istruzione. Prossimo passo: i codici degli interi, e che cosa succede quando i bit finiscono.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: analogico e digitale; bit, byte, parola; l'esadecimale; la notazione posizionale; un colore è un numero; caratteri e stringhe; l'ordine little-endian; le strutture dati; gli array in memoria; gli algoritmi. DA UTILIZZARE OGGI: shift come moltiplicazione (Lezione 05) e, usati senza essere studiati nel corso, il programma completo, gli strumenti di PRG32. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 05: Rappresentazione dei numeri: gli interi

Percorso. I risultati di oggi: (1) convertire tra basi e leggere una configurazione di n bit come naturale e in complemento a due; (2) riconoscere il trabocco nella somma di naturali e di interi; (3) scegliere tra istruzioni con e senza segno, comprese lb e lbu. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 06, Rappresentazione dei numeri: i reali.

Il filo della lezione: Lo 0xFFFFFFFF di un contatore sceso sotto zero è -1 in complemento a due: i bit non sono cambiati, è cambiata la lettura. Prossimo passo: le frazioni su un chip senza unità in virgola mobile.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il complemento a due; i cambi di base; naturali e overflow; shift come moltiplicazione; segno e modulo; istruzioni con o senza segno; l'estensione del segno. DA UTILIZZARE OGGI: le chiamate del runtime PRG32, il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 06: Rappresentazione dei numeri: i reali

Percorso. I risultati di oggi: (1) rappresentare un numero reale in virgola fissa e calcolarci con le istruzioni intere; (2) decodificare un numero IEEE 754 in precisione singola; (3) leggere il nome RV32IMAC e dire che cosa il kit sa e non sa calcolare in hardware. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 07, Verm1, parte 1: una testa che attraversa il mondo.

Il filo della lezione: Senza l'estensione F, le frazioni sono interi con una scala concordata: Verm1 muoverà la testa di frazioni di cella proprio così. Prossimo passo: la prima parte del progetto.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: la virgola fissa; complemento a uno ed eccesso k; la virgola mobile IEEE 754; il nome RV32IMAC. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

Percorso. I risultati di oggi: (1) costruire una cartuccia da un file vuoto: una griglia, un titolo e una testa che si muove; (2) mettere costanti e variabili nella sezione giusta, .rodata o .data; (3) controllare una velocità con un accumulatore in virgola fissa. Si appoggia su: contratto init/update/draw (Lezione 02); un colore è un numero (Lezione 04); gli array in memoria (Lezione 04); indirizzo, valore, load, store (Lezione 02); perché si salva ra (Lezione 02). Prossimo passo: Lezione 08, Elementi di algebra di Boole.

Ponte. Nella Lezione 02 il passo 2 salvava ra sullo stack prima delle sue chiamate, e lw t1, 0(t0) leggeva una parola all'indirizzo in t0. Oggi verm1_draw salva ra e verm1_update no, e ogni variabile di Verm1 si legge con la e lw. La Lezione 18 spiega lo stack e la convenzione di chiamata; la Lezione 19 nomina i modi di indirizzamento. Richiamo: Perché verm1_draw salva ra mentre verm1_update no?

Il filo della lezione: I numeri sono diventati posizioni, colori e una velocità: l'intero blocco sull'informazione, in un gioco che gira. Prossimo passo: la logica che permetterà al giocatore di guidarlo.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il progetto Verm1; contratto init/update/draw; un colore è un numero; gli array in memoria; .text, .rodata, .data; indirizzo, valore, load, store; perché si salva ra; shift come moltiplicazione; la virgola fissa; le pseudo-istruzioni; l'ordine little-endian. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: formati delle istruzioni (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 08: Elementi di algebra di Boole

Percorso. I risultati di oggi: (1) distinguere l'analisi di un circuito logico dalla sua sintesi; (2) applicare gli assiomi e i teoremi dell'algebra di Boole, compreso De Morgan; (3) porre a 1, azzerare e verificare bit con le maschere. Si appoggia su: l'architettura di von Neumann (Lezione 03). Prossimo passo: Lezione 09, Elementi di algebra di Boole.

Il filo della lezione: andi t3, t0, 1 è una fila di 32 porte AND: l'algebra di Boole descrive sia l'istruzione sia il circuito. Prossimo passo: da una tabella di verità al circuito più piccolo.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; l'architettura di von Neumann; analisi e sintesi; l'algebra di Boole; le porte logiche. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: minimizzazione, Karnaugh (Lezione 09). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 09: Elementi di algebra di Boole

Percorso. I risultati di oggi: (1) scrivere una funzione in forma canonica dalla sua tabella di verità; (2) minimizzare una funzione di al più quattro variabili con una mappa di Karnaugh; (3) costruire un sommatore completo e concatenarlo in un sommatore a n bit. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 10, Introduzione all'elettronica e all'elettronica digitale.

Il filo della lezione: La add della Lezione 02 è ora un circuito che sapreste disegnare: 32 sommatori completi e un riporto che si propaga. Prossimo passo: l'elettronica che fa una porta.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il sommatore; le funzioni booleane; le forme canoniche; minimizzazione, Karnaugh. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 10: Introduzione all'elettronica e all'elettronica digitale

Percorso. I risultati di oggi: (1) spiegare come un transistor MOS funziona da interruttore e come CMOS costruisce una porta; (2) leggere livelli logici e margini di rumore dalle tensioni; (3) dimensionare la resistenza di un LED e spiegare il pull-up di un pulsante. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 11, Macchine combinatorie.

Ponte. Nella Lezione 02 il contatore sopravviveva da un frame all'altro in memoria, non in un registro. Oggi una cella di memoria costa circa 6 transistor e un flip-flop circa 20: ricordare un bit è un circuito. La Lezione 13 mostra come latch e flip-flop conservano un bit. Richiamo: Dove abitava il contatore della Lezione 02 tra due frame, e perché non in t1?

Il filo della lezione: Un bit è una tensione dentro un intervallo garantito, e una porta è qualche interruttore: il pulsante del kit è ora un circuito che capite. Prossimo passo: le macchine costruite con le porte.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli ingressi con pull-up; tensione, corrente, legge di Ohm; il transistor come interruttore; dai volt ai bit; le porte CMOS. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: il clock (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 11: Macchine combinatorie

Percorso. I risultati di oggi: (1) distinguere una macchina combinatoria da una sequenziale; (2) usare decodificatori, multiplexer, comparatori e parità; (3) spiegare l'ALU come unità in parallelo e un multiplexer. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 12, Verm1, parte 2: la guida, il cibo e un punteggio.

Ponte. Nella Lezione 02 un'istruzione era un numero a 32 bit, e il processore in qualche modo sapeva che cosa farne. Oggi un decodificatore legge un campo di quel numero, funct3, e pilota il multiplexer che sceglie il risultato dell'ALU. La Lezione 19 descrive tutti i campi e il ciclo di prelievo, decodifica, esecuzione. Richiamo: Quale parte della parola di un'istruzione dice all'ALU di sommare invece di calcolare un AND?

Il filo della lezione: L'ALU che ha eseguito ogni add finora è una grande macchina combinatoria: molti risultati calcolati insieme, uno scelto. Prossimo passo: questi circuiti al lavoro nella seconda parte di Verm1.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i multiplexer; le reti combinatorie; i codici; decoder ed encoder; comparatori e parità; l'ALU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: macchine a stati finiti (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

Percorso. I risultati di oggi: (1) leggere i pulsanti con le maschere e rifiutare un'inversione a U con un solo XOR; (2) confrontare posizioni con XOR e OR per riconoscere il cibo; (3) tenere e mostrare un punteggio. Si appoggia su: le maschere di bit (Lezione 08); i codici (Lezione 11); gli array in memoria (Lezione 04); gli ingressi con pull-up (Lezione 10); l'algebra di Boole (Lezione 08). Prossimo passo: Lezione 13, Macchine sequenziali.

Ponte. Nella Lezione 07 una funzione che ne chiama un'altra salvava ra in un frame di 16 byte. Oggi le funzioni di Verm1 si chiamano più in profondità: ciascuna salva ra una volta, all'ingresso, e lo ripristina prima di ret. La Lezione 18 enuncia le regole: quali registri una chiamata può cambiare e quali deve conservare. Richiamo: Una funzione chiama altre due funzioni. Quante volte deve salvare ra, e dove?

Il filo della lezione: Ogni regola del gioco è diventata qualche istruzione logica: una maschera, uno XOR, un confronto. Prossimo passo: i circuiti che ricordano, e gli stati di un gioco.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; i codici; gli array in memoria; gli ingressi con pull-up; l'algebra di Boole; la virgola fissa; i multiplexer; istruzioni con o senza segno; comparatori e parità; gli argomenti in a0 ... a7. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, le chiamate del runtime PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 13: Macchine sequenziali

Percorso. I risultati di oggi: (1) descrivere una macchina a stati finiti con un diagramma degli stati; (2) spiegare il clock e perché un circuito deve stabilizzarsi entro un periodo; (3) distinguere un latch da un flip-flop e costruire un registro. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 14, Macchine elementari: registri e bus.

Il filo della lezione: Un registro è fatto di flip-flop che campionano su un fronte del clock: è così che il contatore della Lezione 02 sopravviveva da un frame all'altro, in hardware. Prossimo passo: come i registri si scambiano i dati.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: macchine a stati finiti; il clock; latch e flip-flop; i registri come flip-flop. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 14: Macchine elementari: registri e bus

Percorso. I risultati di oggi: (1) spiegare come i registri condividono un bus attraverso i buffer three-state; (2) usare un registro a scorrimento per il trasferimento seriale. Si appoggia su: i registri come flip-flop (Lezione 13). Prossimo passo: Lezione 15, La memoria.

Il filo della lezione: Un bus è una strada che un solo registro alla volta può pilotare, e un registro a scorrimento trasforma una parola in una sequenza di bit: il display del kit riceve così i suoi pixel. Prossimo passo: la memoria.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i registri a scorrimento; i registri come flip-flop; bus e porte three-state. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'I/O mappato in memoria (Lezione 15); memorie e indirizzi (Lezione 15). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 15: La memoria

Percorso. I risultati di oggi: (1) calcolare la capacità di una memoria dalle sue linee di indirizzo e di dato; (2) descrivere l'interfaccia tra processore e memoria durante un caricamento; (3) spiegare l'ingresso/uscita mappato in memoria. Si appoggia su: l'ordine little-endian (Lezione 04). Prossimo passo: Lezione 16, La memoria permanente.

Ponte. Dalla Lezione 02, lw t1, 0(t0) legge una parola a un indirizzo calcolato da t0. Oggi quell'indirizzo è quello messo sul bus degli indirizzi, registro più costante. La Lezione 19 lo chiama base più spiazzamento e lo confronta con gli altri modi di indirizzamento. Richiamo: In lw t1, 8(t0), quale indirizzo va sul bus degli indirizzi?

Il filo della lezione: Ogni lw e sw del corso è un breve dialogo sul bus degli indirizzi, sul bus dei dati e su due linee di controllo; un dispositivo risponde sullo stesso bus. Prossimo passo: la memoria che sopravvive senza alimentazione, e le cache.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: memorie e indirizzi; l'ordine little-endian; processore e memoria; l'I/O mappato in memoria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 16: La memoria permanente

Percorso. I risultati di oggi: (1) classificare le memorie permanenti e dire dove è conservata la cartuccia; (2) spiegare un successo e un fallimento di cache, e la località; (3) confrontare i tempi di accesso di dischi e memorie a stato solido. Si appoggia su: l'architettura di von Neumann (Lezione 03). Prossimo passo: Lezione 17, Verm1, parte 3: un corpo, regole e stati.

Il filo della lezione: La memoria è una gerarchia: piccola e veloce vicino al processore, grande e lenta lontano, e la località fa funzionare il trucco. Prossimo passo: la terza parte di Verm1, che ha bisogno di memoria per un corpo intero.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: ROM, flash, firmware; l'architettura di von Neumann; la cache; la memoria secondaria. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 17: Verm1, parte 3: un corpo, regole e stati

Percorso. I risultati di oggi: (1) realizzare il gioco come macchina a stati con tre stati; (2) tenere il corpo in un buffer circolare e la griglia in un array di byte; (3) riconoscere una collisione leggendo la griglia. Si appoggia su: gli array in memoria (Lezione 04); macchine a stati finiti (Lezione 13); .text, .rodata, .data (Lezione 07); latch e flip-flop (Lezione 13); la virgola fissa (Lezione 06). Prossimo passo: Lezione 18, Il processore.

Il filo della lezione: Il gioco ha ora una memoria e degli stati: le macchine sequenziali della Lezione 13, scritte in software. Prossimo passo: il processore che esegue tutto questo.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli array in memoria; macchine a stati finiti; .text, .rodata, .data; latch e flip-flop; la virgola fissa. DA UTILIZZARE OGGI: la convenzione di chiamata (Lezione 18) e, usati senza essere studiati nel corso, gli strumenti di PRG32, il debugger di PRG32-QT. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 18: Il processore

Percorso. I risultati di oggi: (1) seguire un'istruzione attraverso i blocchi di un processore RV32; (2) usare correttamente lo stack e la convenzione di chiamata; (3) confrontare macchine ad accumulatore, a stack e a registri. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 19, Istruzioni e interruzioni.

Il filo della lezione: Il ra salvato nella Lezione 02 è ora spiegato: lo stack e la convenzione di chiamata sono regole che permettono a funzioni scritte da persone diverse di chiamarsi. Prossimo passo: come un'istruzione è codificata ed eseguita, e come il processore viene interrotto.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: accumulatore, pila, registri; il modello del processore; i registri di RISC-V; la convenzione di chiamata; la pila; il processore RV32. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: interruzioni e trap (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 19: Istruzioni e interruzioni

Percorso. I risultati di oggi: (1) decodificare un'istruzione RISC-V nei suoi campi; (2) nominare il modo di indirizzamento di ogni operando; (3) descrivere il ciclo dell'istruzione e che cosa cambia un'interruzione. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 20, I bus e la scheda video.

Il filo della lezione: Il numero 0x00130313 della Lezione 02 si legge ora campo per campo, e il processore che lo preleva può essere interrotto e ripreso. Prossimo passo: i dispositivi che il processore serve.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: formati delle istruzioni; i modi di indirizzamento; il ciclo del processore; interruzioni e trap. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 20: I bus e la scheda video

Percorso. I risultati di oggi: (1) spiegare perché i dispositivi stanno dietro ai controllori e come il processore dialoga con loro; (2) calcolare la dimensione di un frame buffer e la banda di un segnale video; (3) descrivere che cosa fanno una scheda video e una GPU. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 21, Ingresso e uscita.

Il filo della lezione: Ogni rettangolo disegnato dalla Lezione 02 è finito in un frame buffer che un controllore invia allo schermo molte volte al secondo. Prossimo passo: gli altri dispositivi: display, tastiere, stampanti.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il frame buffer; i controllori delle periferiche; bus e banda; la scheda video; GPU e GPGPU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 21: Ingresso e uscita

Percorso. I risultati di oggi: (1) descrivere come funzionano display, tastiere e stampanti; (2) confrontare il polling con le interruzioni per leggere un dispositivo. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 22, Verm1, parte 4: il gioco finito.

Il filo della lezione: Leggere il joystick una volta per frame è polling: semplice, e cieco tra due letture. Prossimo passo: il gioco finito.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: polling, interruzioni, DMA; display CRT e LCD; tastiera e mouse; le stampanti. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 22: Verm1, parte 4: il gioco finito

Percorso. I risultati di oggi: (1) trasformare un numero in cifre decimali con divu e remu; (2) disegnare solo ciò che è cambiato, con un flag dirty; (3) completare il gioco: livelli, suono, velocità. Si appoggia su: caratteri e stringhe (Lezione 04); la virgola fissa (Lezione 06); la convenzione di chiamata (Lezione 18); gli array in memoria (Lezione 04); macchine a stati finiti (Lezione 13). Prossimo passo: Lezione 23, Verm1 sul Cartridge Store.

Il filo della lezione: Verm1 è finito: ogni argomento del corso vi ha una riga. Prossimo passo: dargli un nome, un'icona e un posto sullo Store.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: quoziente e resto; caratteri e stringhe; la virgola fissa; la convenzione di chiamata; gli array in memoria; macchine a stati finiti; il frame buffer; il ciclo del processore. DA UTILIZZARE OGGI: gli strumenti di PRG32, il debugger di PRG32-QT (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 23: Verm1 sul Cartridge Store

Percorso. I risultati di oggi: (1) compilare cartucce portabili e verificarle; (2) impacchettare un bundle con i metadati e pubblicarlo in sicurezza. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 24, Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA.

Il filo della lezione: Un gioco è finito quando qualcun altro può eseguirlo: una cartuccia portabile, metadati onesti, un bundle provato su un altro computer e un token tenuto segreto. Prossimo passo: macchine più veloci di un solo core.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: impacchettare e pubblicare; la cartuccia portabile. DA UTILIZZARE OGGI: gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

Percorso. I risultati di oggi: (1) usare l'equazione delle prestazioni per dire dove va il tempo; (2) spiegare esecuzione superscalare, vettori, GPU e FPGA come risposte a essa; (3) limitare l'accelerazione parallela con la legge di Amdahl. Si appoggia su: solo ciò che ha preparato la Lezione 01. È l'ultima lezione del corso.

Il filo della lezione: Il ciclo che svuota la mappa di Verm1 si può rendere più veloce in cinque modi, e ciascuno è una macchina a sé. La domanda dell'ingegnere non è quale macchina sia la più veloce, ma quale sia sufficiente.

**Stato di apprendimento.** Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: l'equazione delle prestazioni; i processori superscalari; le istruzioni vettoriali; HPC e legge di Amdahl; acceleratori GPU e FPGA. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.
