# Biglietti d'uscita

*Generato da `tools/textbook/teaching_docs.js` a partire da `tools/concepts/assessments.json`, `bridges.json` e dal registro: non modificare a mano.*

Un biglietto per lezione: una o due domande, da due a quattro minuti, da soli e su carta, alla fine della lezione. Non sono valutati: dicono a voi, e al docente, che cosa è chiaro e che cosa non ancora. Le risposte si discutono all'inizio della lezione successiva.

## Lezione 00: Introduzione al corso

**Risultati.** Descrivere i quattro passi della spirale di apprendimento e dire perché la previsione viene prima dell'esecuzione; enunciare le regole di valutazione: una prova intercorso, due parti d'esame da superare entrambe, nessun dispositivo e nessuna IA.

1. Prima di eseguire un programma vi si chiede di scrivere che cosa vi aspettate di vedere. Quale passo della spirale di apprendimento è questo, e che cosa imparate quando la previsione si rivela sbagliata?
2. Vero o falso? Correggete le affermazioni false. (a) Superare la prova intercorso basta per verbalizzare il voto finale. (b) Nella prova intercorso è ammessa la calcolatrice del telefono. (c) La parte di teoria si può sostenere prima di quella di laboratorio.

## Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

**Risultati.** Spiegare il percorso da un file sorgente a una cartuccia in esecuzione: sorgente, traduttore, codice macchina, cartuccia, host; eseguire una cartuccia in PRG32-QT e compilarne una dal terminale.

1. Mettete in ordine questi quattro elementi e dite in una riga che cosa fa ciascuno: la cartuccia, il file sorgente, il runtime di un host, l'assemblatore.
2. In un nuovo terminale scrivete python3 -m prg32 doctor e leggete: idf.py: command not found. Che cosa vi dice il messaggio, e che cosa fate per prima cosa?

## Lezione 02: Primo contatto: l'assembly RISC-V su PRG32

**Risultati.** Compilare ed eseguire una cartuccia, e dire quando il runtime chiama init, update e draw; leggere una riga di assembly: etichetta, istruzione, operandi, commento; distinguere un indirizzo da un valore, e tracciare che cosa lasciano la, lw, addi e sw nei registri e in memoria.

1. Leggete ad alta voce la riga  loop:  li a0, 32   # x . Nominatene etichetta, istruzione, operandi e commento. li è un'istruzione del processore? Che cosa ne fa l'assemblatore?
2. Il debugger mostra l'istruzione addi t1, t1, 1 conservata in memoria come la parola 0x00130313. Che cos'è quella parola, e che cosa vi dice su dove abita un programma?

## Lezione 03: Storia della computazione

**Risultati.** Definire l'informatica e spiegare perché non riguarda solo i computer; nominare le unità dell'architettura di von Neumann e la sua idea del programma memorizzato; dire che cosa distingue RISC da CISC e perché RISC-V è aperto.

1. Spiegate la frase attribuita a Dijkstra, 'L'informatica non riguarda i computer più di quanto l'astronomia riguardi i telescopi', usando la definizione di informatica data nella lezione.
2. Dove è conservato il programma di una cartuccia mentre gira, e perché questo rende una macchina di von Neumann diversa da una macchina programmata ricollegando cavi?

## Lezione 04: Rappresentare l'informazione digitale

**Risultati.** Distinguere l'informazione analogica da quella digitale e contare i valori che n bit possono rappresentare; codificare numeri, colori e testo in bit: notazione posizionale, esadecimale, RGB565, ASCII; nominare le strutture dati di base e le proprietà di un algoritmo.

1. Un termometro a mercurio e un display che mostra 21,5 misurano entrambi la temperatura. Quale è analogico e quale digitale? Perché la lettura digitale si può copiare mille volte senza peggiorare?
2. Il pulsante Annulla di un editor cancella prima la modifica più recente, poi quella precedente. Quale delle cinque strutture dati è adatta, e perché non un array letto per indice?

## Lezione 05: Rappresentazione dei numeri: gli interi

**Risultati.** Convertire tra basi e leggere una configurazione di n bit come naturale e in complemento a due; riconoscere il trabocco nella somma di naturali e di interi; scegliere tra istruzioni con e senza segno, comprese lb e lbu.

1. In memoria c'è il byte 0xF6. Quale valore a 32 bit lascia lb in un registro, e quale lbu? Quale è giusto se il byte è una temperatura di -10 gradi?
2. Su 8 bit, calcolate 0111 1111 + 0000 0001. Leggete il risultato come naturale e in complemento a due. C'è trabocco in ciascuna lettura?

## Lezione 06: Rappresentazione dei numeri: i reali

**Risultati.** Rappresentare un numero reale in virgola fissa e calcolarci con le istruzioni intere; decodificare un numero IEEE 754 in precisione singola; leggere il nome RV32IMAC e dire che cosa il kit sa e non sa calcolare in hardware.

1. Leggete RV32IMAC lettera per lettera. Uno studente scrive fmul.s in una cartuccia per il kit: che cosa succede, e perché Verm1 si muove con numeri in virgola fissa?
2. In Q24.8, quale numero reale rappresenta la parola 0x00000180? Come si sommano due numeri Q24.8, e come si moltiplicano?

## Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

**Risultati.** Costruire una cartuccia da un file vuoto: una griglia, un titolo e una testa che si muove; mettere costanti e variabili nella sezione giusta, .rodata o .data; controllare una velocità con un accumulatore in virgola fissa.

1. Verm1 dichiara title: .asciz "VERM1" e head_x: .word 5. In quale sezione va ciascuno, e perché head_x non deve stare in .rodata?
2. step_q8 cresce di SPEED_Q8 a ogni frame, e la testa si sposta di una cella ogni volta che arriva a 256. Con SPEED_Q8 = 64, quanti frame tra due passi? Con 128? Prevedete, poi eseguite.

## Lezione 08: Elementi di algebra di Boole

**Risultati.** Distinguere l'analisi di un circuito logico dalla sua sintesi; applicare gli assiomi e i teoremi dell'algebra di Boole, compreso De Morgan; porre a 1, azzerare e verificare bit con le maschere.

1. Analisi o sintesi? (a) Dato uno schema, trovarne la tabella di verità. (b) Dato 'la luce è accesa quando esattamente uno dei due interruttori è alzato', costruire un circuito. (c) Leggere andi t3, t0, 1 e dire che cosa finisce in t3.
2. Scrivete un'istruzione che pone a 1 il bit 3 di t0 lasciando invariati gli altri bit, e una che lo azzera.

## Lezione 09: Elementi di algebra di Boole

**Risultati.** Scrivere una funzione in forma canonica dalla sua tabella di verità; minimizzare una funzione di al più quattro variabili con una mappa di Karnaugh; costruire un sommatore completo e concatenarlo in un sommatore a n bit.

1. Un sommatore completo riceve A = 1, B = 1, Cin = 1. Date S e Cout. Perché un sommatore a 32 bit ne richiede 32, concatenati?
2. In una mappa di Karnaugh di tre variabili A, B, C, perché si possono raggruppare le celle 000 e 010, ma non 000 e 011? Quale termine dà il primo gruppo?

## Lezione 10: Introduzione all'elettronica e all'elettronica digitale

**Risultati.** Spiegare come un transistor MOS funziona da interruttore e come CMOS costruisce una porta; leggere livelli logici e margini di rumore dalle tensioni; dimensionare la resistenza di un LED e spiegare il pull-up di un pulsante.

1. In due frasi: come funziona da interruttore un transistor MOS, e perché un invertitore CMOS non assorbe quasi corrente quando il suo ingresso è stabile?
2. Sul kit un ingresso legge 1 sopra 2,475 V e 0 sotto 0,825 V; un'uscita dà un 1 sopra 2,64 V. Un filo aggiunge 0,1 V di rumore verso il basso. Un 1 può essere letto male? Che cosa legge un ingresso a 1,6 V?

## Lezione 11: Macchine combinatorie

**Risultati.** Distinguere una macchina combinatoria da una sequenziale; usare decodificatori, multiplexer, comparatori e parità; spiegare l'ALU come unità in parallelo e un multiplexer.

1. Combinatoria o sequenziale: un sommatore; un contatore di pressioni di un pulsante; un multiplexer; il processore nel suo insieme? Enunciate la regola usata.
2. L'ALU calcola insieme la somma, l'AND, l'OR, lo XOR e uno scorrimento delle stesse due parole. Come arriva in t2 solo il risultato di add t2, t0, t1, e chi lo sceglie?

## Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

**Risultati.** Leggere i pulsanti con le maschere e rifiutare un'inversione a U con un solo XOR; confrontare posizioni con XOR e OR per riconoscere il cibo; tenere e mostrare un punteggio.

1. Le direzioni sono codificate RIGHT 0, DOWN 1, LEFT 2, UP 3. Il verme va a RIGHT e il giocatore spinge LEFT. Che cosa dà xor t3, t2, t1, e che cosa ne fa il codice?

## Lezione 13: Macchine sequenziali

**Risultati.** Descrivere una macchina a stati finiti con un diagramma degli stati; spiegare il clock e perché un circuito deve stabilizzarsi entro un periodo; distinguere un latch da un flip-flop e costruire un registro.

1. Il clock del kit va a 160 MHz. Qual è il suo periodo, e perché ogni rete combinatoria tra due registri deve stabilizzarsi entro quel tempo?
2. Qual è la differenza tra un latch D e un flip-flop D, e quale dei due permette di leggere e scrivere un registro nello stesso ciclo di clock in sicurezza?

## Lezione 14: Macchine elementari: registri e bus

**Risultati.** Spiegare come i registri condividono un bus attraverso i buffer three-state; usare un registro a scorrimento per il trasferimento seriale.

1. Tre registri condividono un bus comune. Che cosa succede se due di essi lo pilotano contemporaneamente, e quale componente lo impedisce?
2. Una parola di 8 bit viene inviata in serie, un bit per impulso di clock. Quanti impulsi servono, e che cosa fa il registro a scorrimento a ciascuno?

## Lezione 15: La memoria

**Risultati.** Calcolare la capacità di una memoria dalle sue linee di indirizzo e di dato; descrivere l'interfaccia tra processore e memoria durante un caricamento; spiegare l'ingresso/uscita mappato in memoria.

1. Elencate, in ordine, che cosa viaggia sul bus degli indirizzi, sulle linee di controllo e sul bus dei dati mentre il processore esegue lw t1, 0(t0).
2. RISC-V non ha istruzioni di ingresso/uscita. Come fa allora un programma ad accendere un LED o inviare un pixel a un dispositivo?

## Lezione 16: La memoria permanente

**Risultati.** Classificare le memorie permanenti e dire dove è conservata la cartuccia; spiegare un successo e un fallimento di cache, e la località; confrontare i tempi di accesso di dischi e memorie a stato solido.

1. Che cosa succede in caso di fallimento di cache? Perché un ciclo che legge un array in ordine ha pochi fallimenti?
2. Perché il firmware e le cartucce del kit non possono stare solo in RAM? Quale memoria li conserva, e qual è il suo limite?

## Lezione 17: Verm1, parte 3: un corpo, regole e stati

**Risultati.** Realizzare il gioco come macchina a stati con tre stati; tenere il corpo in un buffer circolare e la griglia in un array di byte; riconoscere una collisione leggendo la griglia.

1. Verm1 ha tre stati: TITLE, PLAY, OVER. Disegnate le transizioni ed etichettate ciascuna con l'evento che la provoca.
2. Il corpo è un anello di 256 elementi. head_i vale 255 e il verme fa un passo. Quanto vale il nuovo head_i, e perché Verm1 lo calcola con andi t1, t1, 255?

## Lezione 18: Il processore

**Risultati.** Seguire un'istruzione attraverso i blocchi di un processore RV32; usare correttamente lo stack e la convenzione di chiamata; confrontare macchine ad accumulatore, a stack e a registri.

1. Seguite add t2, t0, t1 nello schema a blocchi di un processore RV32: nominate, in ordine, i blocchi che usa e che cosa fa ciascuno. Quale blocco non usa?
2. Una funzione comincia con addi sp, sp, -16 e sw ra, 12(sp). Dove si trova ora ra, e che cosa deve fare la funzione prima di ret?

## Lezione 19: Istruzioni e interruzioni

**Risultati.** Decodificare un'istruzione RISC-V nei suoi campi; nominare il modo di indirizzamento di ogni operando; descrivere il ciclo dell'istruzione e che cosa cambia un'interruzione.

1. Nominate il modo di indirizzamento di: l'1 in addi t1, t1, 1; la parola letta da lw t1, 8(sp); la destinazione di beq t0, t1, loop; l'operando t0 di add t2, t0, t1.
2. Arriva un'interruzione mentre il processore sta eseguendo un'istruzione. Che cosa succede a quell'istruzione, quale registro ricorda dove riprendere, e come termina il gestore?

## Lezione 20: I bus e la scheda video

**Risultati.** Spiegare perché i dispositivi stanno dietro ai controllori e come il processore dialoga con loro; calcolare la dimensione di un frame buffer e la banda di un segnale video; descrivere che cosa fanno una scheda video e una GPU.

1. Perché un dispositivo non è mai collegato direttamente al processore? Dite che cosa fa il suo controllore e come il processore dialoga con esso.
2. Uno schermo di 320 x 200 pixel usa 16 bit per pixel ed è ridisegnato 30 volte al secondo. Quanta memoria serve per il frame buffer, e quanti byte al secondo devono raggiungere lo schermo?

## Lezione 21: Ingresso e uscita

**Risultati.** Descrivere come funzionano display, tastiere e stampanti; confrontare il polling con le interruzioni per leggere un dispositivo.

1. In quattro passi, come trasforma una stampante laser una pagina in toner sulla carta? Perché una stampante ha un proprio processore e una propria memoria?
2. Un gioco legge il joystick una volta per frame, a 30 frame al secondo. Un tocco dura 20 ms e cade tra due letture. Viene visto? Che cosa cambierebbe un'interruzione?

## Lezione 22: Verm1, parte 4: il gioco finito

**Risultati.** Trasformare un numero in cifre decimali con divu e remu; disegnare solo ciò che è cambiato, con un flag dirty; completare il gioco: livelli, suono, velocità.

1. to_decimal riceve 205. Mostrate come remu e divu per 10 ne danno le tre cifre, e perché memorizza i byte '2', '0', '5' invece dei numeri 2, 0, 5.
2. Perché verm1_draw ridisegna la mappa solo quando dirty è impostato? Che cosa vedrebbe il giocatore se update si dimenticasse di impostarlo dopo un passo?

## Lezione 23: Verm1 sul Cartridge Store

**Risultati.** Compilare cartucce portabili e verificarle; impacchettare un bundle con i metadati e pubblicarlo in sicurezza.

1. cartridge summary stampa import_model: abi-table. Che cosa dice questo della cartuccia, e perché lo Store accetta solo cartucce del genere?
2. Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa pubblicate ora? Dove non deve mai comparire il token dello Store?

## Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

**Risultati.** Usare l'equazione delle prestazioni per dire dove va il tempo; spiegare esecuzione superscalare, vettori, GPU e FPGA come risposte a essa; limitare l'accelerazione parallela con la legge di Amdahl.

1. Il ciclo che svuota la mappa di Verm1 esegue 3.840 istruzioni a circa un ciclo ciascuna con un clock a 160 MHz. Quanto dura? Nominate un modo per ridurre ciascuno dei tre fattori.
2. Un programma è parallelo all'80%. Con tutti i processori che si vuole, qual è l'accelerazione massima, e perché?
