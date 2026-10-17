# Prove formative e griglie di valutazione (docente)

*Generato da `tools/textbook/teaching_docs.js` a partire da `tools/concepts/assessments.json`, `bridges.json` e dal registro: non modificare a mano.*

Ogni prova del corso con i concetti che verifica (id di `tools/concepts/registry.json`), dove si usa, il ragionamento atteso e un errore tipico da riconoscere. *exit*: il biglietto d'uscita; *checkpoint*: posta durante la lezione, sulla slide indicata; *check*: esercizio in più. Da non proiettare: le griglie contengono le risposte.

## Lezione 00: Introduzione al corso

### A00.1 (exit)

- **Concetti:** `course.spiral` (il metodo: prima il programma)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Prima di eseguire un programma vi si chiede di scrivere che cosa vi aspettate di vedere. Quale passo della spirale di apprendimento è questo, e che cosa imparate quando la previsione si rivela sbagliata?
- **Griglia:** Ritornare (prevedere, poi eseguire). Una previsione sbagliata mostra esattamente quale regola del proprio modello mentale è sbagliata, e la macchina lo mostra senza alcun costo. Punteggio pieno: nomina il passo e dà questa ragione; metà: nomina i quattro passi (giocare, osservare, formalizzare, ritornare) senza la ragione.
- **Errore tipico da riconoscere:** Una previsione è un tentativo che non conta: conta solo il risultato finale.

### A00.2 (exit)

- **Concetti:** `course.rules` (le regole del corso)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Vero o falso? Correggete le affermazioni false. (a) Superare la prova intercorso basta per verbalizzare il voto finale. (b) Nella prova intercorso è ammessa la calcolatrice del telefono. (c) La parte di teoria si può sostenere prima di quella di laboratorio.
- **Griglia:** (a) Falso: vanno superate entrambe le parti, teoria e pratica, e il voto si verbalizza solo in un appello di teoria. (b) Falso: nessun dispositivo e nessun aiuto di alcun tipo, IA compresa. (c) Vero: il risultato resta valido per l'anno accademico. Un punto per ogni risposta corretta con la sua correzione.
- **Errore tipico da riconoscere:** Il voto della prova intercorso è una garanzia che l'orale non può cambiare.

## Lezione 01: PRG32 e PRG32-QT: allestire la propria officina

### A01.1 (exit)

- **Concetti:** `prog.program` (programma, sorgente, codice macchina), `prg32.platform` (i componenti di PRG32)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Mettete in ordine questi quattro elementi e dite in una riga che cosa fa ciascuno: la cartuccia, il file sorgente, il runtime di un host, l'assemblatore.
- **Griglia:** File sorgente (testo scritto da una persona) -> assemblatore (lo traduce in codice macchina) -> cartuccia (un file: codice macchina, dati, intestazione) -> runtime di un host (la carica e chiama init, update, draw). Punteggio pieno: ordine corretto e ruolo corretto per ciascuno; metà: solo l'ordine.
- **Errore tipico da riconoscere:** L'assemblatore esegue il programma, oppure la cartuccia contiene il codice sorgente.

### A01.2 (exit)

- **Concetti:** `tool.terminal` (il terminale); livello: uso (il concetto si usa, non si studia)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In un nuovo terminale scrivete python3 -m prg32 doctor e leggete: idf.py: command not found. Che cosa vi dice il messaggio, e che cosa fate per prima cosa?
- **Griglia:** Il terminale non trova il programma idf.py: ESP-IDF non è attivo in questo terminale (l'attivazione dura quanto il terminale). Prima azione: attivarlo (export.sh, o la PowerShell di ESP-IDF su Windows) e rieseguire il doctor; non reinstallare.
- **Errore tipico da riconoscere:** Un messaggio d'errore significa che l'installazione è rotta e va rifatta.

## Lezione 02: Primo contatto: l'assembly RISC-V su PRG32

### CP02.1 (checkpoint)

- **Concetti:** `prg32.contract` (contratto init/update/draw), `asm.machine-model` (registri, calcolo, trasferimento, salto)
- **Dove:** slide della specifica 02:9
- **Domanda:** Un gioco gira a 30 frame al secondo per 2 secondi. Quante volte il runtime ha chiamato init, update e draw? Quale dei tre tipi di istruzione, calcolo, trasferimento o salto, può leggere la memoria?
- **Griglia:** init una volta; update 60 volte; draw 60 volte. Solo le istruzioni di trasferimento (lw, sw) accedono alla memoria; il calcolo lavora solo sui registri.
- **Errore tipico da riconoscere:** init gira a ogni frame, oppure add può prendere un valore direttamente dalla memoria.

### CP02.2 (checkpoint)

- **Concetti:** `mem.load-store` (indirizzo, valore, load, store), `skill.trace` (seguire a mano l'esecuzione)
- **Dove:** slide della specifica 02:24
- **Domanda:** first_update esegue la t0, counter; lw t1, 0(t0); addi t1, t1, 1; sw t1, 0(t0), e la barra è disegnata larga andi t1, 255 pixel. Completate, per i frame 256 e 257, che cosa lascia lw in t1, che cosa lascia addi in t1, che cosa lascia sw in counter, e la larghezza della barra.
- **Griglia:** Frame 256: 255, 256, 256, larghezza 0. Frame 257: 256, 257, 257, larghezza 1. t0 contiene per tutto il tempo l'indirizzo di counter; il valore sta in t1 tra lw e sw, e in memoria tra un frame e l'altro. La larghezza ricomincia perché 256 è 1 0000 0000: i suoi otto bit bassi sono zero. Punteggio pieno: entrambe le righe; metà: il contatore giusto e la larghezza sbagliata.
- **Errore tipico da riconoscere:** La larghezza è 256, perché si dimentica la maschera; oppure addi cambia counter in memoria prima di sw.

### A02.1 (exit)

- **Concetti:** `asm.line` (leggere una riga di assembly), `asm.pseudo` (le pseudo-istruzioni)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Leggete ad alta voce la riga  loop:  li a0, 32   # x . Nominatene etichetta, istruzione, operandi e commento. li è un'istruzione del processore? Che cosa ne fa l'assemblatore?
- **Griglia:** Etichetta loop; istruzione li; operandi a0 (destinazione) e 32; commento # x, ignorato dall'assemblatore. li è una pseudo-istruzione: l'assemblatore emette un'istruzione vera, qui addi a0, zero, 32. Punteggio pieno: quattro parti nominate e l'espansione; metà: solo le parti.
- **Errore tipico da riconoscere:** Ogni parola scritta in assembly esiste nell'hardware, oppure il commento viene eseguito.

### A02.2 (exit)

- **Concetti:** `isa.instruction-is-data` (un'istruzione è un numero)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Il debugger mostra l'istruzione addi t1, t1, 1 conservata in memoria come la parola 0x00130313. Che cos'è quella parola, e che cosa vi dice su dove abita un programma?
- **Griglia:** È il codice macchina dell'istruzione: la stessa istruzione scritta come numero a 32 bit. Un programma è conservato in memoria come numeri, come qualsiasi dato (l'idea del programma memorizzato). Nominare i campi oggi non è richiesto (Lezione 19).
- **Errore tipico da riconoscere:** La memoria contiene il testo addi t1, t1, 1, oppure le istruzioni stanno altrove rispetto alla memoria.

## Lezione 03: Storia della computazione

### A03.1 (exit)

- **Concetti:** `info.informatics` (che cos'è l'informatica)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Spiegate la frase attribuita a Dijkstra, 'L'informatica non riguarda i computer più di quanto l'astronomia riguardi i telescopi', usando la definizione di informatica data nella lezione.
- **Griglia:** L'informatica è la scienza dell'informazione e del suo trattamento automatico: che cosa si può calcolare e a quale costo, gli algoritmi, la rappresentazione. Il computer ne è lo strumento, come il telescopio per l'astronomo. Punteggio pieno: definizione più l'analogia strumento/oggetto di studio.
- **Errore tipico da riconoscere:** Informatica significa saper usare i programmi e i computer.

### A03.2 (exit)

- **Concetti:** `arch.von-neumann` (l'architettura di von Neumann)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Dove è conservato il programma di una cartuccia mentre gira, e perché questo rende una macchina di von Neumann diversa da una macchina programmata ricollegando cavi?
- **Griglia:** Nella stessa memoria dei dati (programma memorizzato). Cambiare programma significa scrivere numeri diversi in memoria, senza toccare l'hardware; una macchina a cavi va ricostruita fisicamente per ogni programma.
- **Errore tipico da riconoscere:** Il programma è costruito dentro il processore.

## Lezione 04: Rappresentare l'informazione digitale

### A04.1 (exit)

- **Concetti:** `info.analog-digital` (analogico e digitale)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Un termometro a mercurio e un display che mostra 21,5 misurano entrambi la temperatura. Quale è analogico e quale digitale? Perché la lettura digitale si può copiare mille volte senza peggiorare?
- **Griglia:** La colonna di mercurio è analogica (varia con continuità); il display è digitale (un insieme finito di simboli). Un valore digitale è una scelta tra livelli discreti: un piccolo rumore non cambia il livello letto, quindi le copie sono esatte; una copia analogica aggiunge rumore a ogni generazione.
- **Errore tipico da riconoscere:** Digitale significa elettronico, quindi il display è digitale solo perché usa l'elettricità.

### A04.2 (exit)

- **Concetti:** `data.structures` (le strutture dati)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Il pulsante Annulla di un editor cancella prima la modifica più recente, poi quella precedente. Quale delle cinque strutture dati è adatta, e perché non un array letto per indice?
- **Griglia:** Uno stack: l'ultimo entrato è il primo a uscire; ogni modifica viene inserita in cima, Annulla toglie la cima. Un array potrebbe conservare le modifiche, ma è la regola di accesso, sempre la più recente, a definire lo stack; con un array bisogna in più tenere traccia della cima. Bonus: lo stack frame della Lezione 02 è la stessa idea.
- **Errore tipico da riconoscere:** Una struttura dati è un tipo di memoria, invece di una regola per organizzare e raggiungere i dati.

### A04.3 (check)

- **Concetti:** `algo.algorithms` (gli algoritmi)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Una ricetta dice: 'mescolate finché sembra giusto, poi tenete in caldo'. Quali proprietà di un algoritmo viola? Riscrivetela in modo che le rispetti.
- **Griglia:** 'Sembra giusto' non è univoco (due esecutori giudicano diversamente) e 'tenete in caldo' non termina. Una riscrittura corretta ha passi elementari e univoci e una fine: 'mescolate per 3 minuti; tenete a 60 gradi per 10 minuti; fermatevi'.
- **Errore tipico da riconoscere:** Qualsiasi elenco di istruzioni è un algoritmo.

## Lezione 05: Rappresentazione dei numeri: gli interi

### A05.1 (exit)

- **Concetti:** `num.sign-extension` (l'estensione del segno), `num.signed-unsigned` (istruzioni con o senza segno)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In memoria c'è il byte 0xF6. Quale valore a 32 bit lascia lb in un registro, e quale lbu? Quale è giusto se il byte è una temperatura di -10 gradi?
- **Griglia:** lb estende il segno: 0xFFFFFFF6, cioè -10. lbu riempie di zeri: 0x000000F6, cioè 246. Per una temperatura di -10, lb. La scelta del caricamento dichiara che cosa significa il byte.
- **Errore tipico da riconoscere:** Allargare un numero significa sempre aggiungere zeri a sinistra.

### A05.2 (exit)

- **Concetti:** `num.twos-complement` (il complemento a due), `num.natural-overflow` (naturali e overflow)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Su 8 bit, calcolate 0111 1111 + 0000 0001. Leggete il risultato come naturale e in complemento a due. C'è trabocco in ciascuna lettura?
- **Griglia:** Risultato 1000 0000. Naturali: 127 + 1 = 128, che sta in 8 bit: nessun trabocco. Complemento a due: 127 + 1 dovrebbe dare 128, non rappresentabile; la configurazione si legge -128: trabocco (due positivi hanno dato un negativo).
- **Errore tipico da riconoscere:** Il trabocco è una proprietà dei soli bit, uguale per ogni lettura.

## Lezione 06: Rappresentazione dei numeri: i reali

### A06.1 (exit)

- **Concetti:** `isa.extensions` (il nome RV32IMAC)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Leggete RV32IMAC lettera per lettera. Uno studente scrive fmul.s in una cartuccia per il kit: che cosa succede, e perché Verm1 si muove con numeri in virgola fissa?
- **Griglia:** RV32I: insieme base intero a 32 bit; M: moltiplicazione e divisione; A: istruzioni atomiche; C: codifiche compresse a 16 bit. Manca F: fmul.s non fa parte dell'insieme di istruzioni del kit, quindi la toolchain la rifiuta per quel target (o, se forzata, è un'istruzione illegale). Le frazioni sono perciò interi con una scala concordata: la virgola fissa.
- **Errore tipico da riconoscere:** Ogni processore sa calcolare con i decimali; la virgola fissa è solo una scelta di stile.

### A06.2 (exit)

- **Concetti:** `num.fixed-point` (la virgola fissa)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In Q24.8, quale numero reale rappresenta la parola 0x00000180? Come si sommano due numeri Q24.8, e come si moltiplicano?
- **Griglia:** 0x180 = 384; 384 / 256 = 1,5. Somma: una normale somma intera, la scala è la stessa. Moltiplicazione: prodotto intero, poi scorrimento a destra di 8 per ripristinare la scala.
- **Errore tipico da riconoscere:** Il prodotto di due numeri Q24.8 è già in Q24.8.

## Lezione 07: Verm1, parte 1: una testa che attraversa il mondo

### A07.1 (exit)

- **Concetti:** `mem.sections` (.text, .rodata, .data)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Verm1 dichiara title: .asciz "VERM1" e head_x: .word 5. In quale sezione va ciascuno, e perché head_x non deve stare in .rodata?
- **Griglia:** title in .rodata (una costante: dati di sola lettura); head_x in .data (una variabile, cambiata a ogni passo). .rodata promette che i byte non cambiano mai e può stare in memoria di sola lettura: scriverci viola quella promessa, e su un host protetto la scrittura fallisce.
- **Errore tipico da riconoscere:** Le sezioni sono solo commenti per chi legge; l'assemblatore mette tutto nello stesso posto.

### A07.2 (exit)

- **Concetti:** `verm1.project` (il progetto Verm1), `num.fixed-point` (la virgola fissa)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** step_q8 cresce di SPEED_Q8 a ogni frame, e la testa si sposta di una cella ogni volta che arriva a 256. Con SPEED_Q8 = 64, quanti frame tra due passi? Con 128? Prevedete, poi eseguite.
- **Griglia:** 64: 256 / 64 = 4 frame per passo. 128: 2 frame per passo. La velocità è una frazione di cella per frame in Q24.8.
- **Errore tipico da riconoscere:** Un SPEED_Q8 più grande significa più frame tra un passo e l'altro.

## Lezione 08: Elementi di algebra di Boole

### A08.1 (exit)

- **Concetti:** `logic.circuits` (analisi e sintesi)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Analisi o sintesi? (a) Dato uno schema, trovarne la tabella di verità. (b) Dato 'la luce è accesa quando esattamente uno dei due interruttori è alzato', costruire un circuito. (c) Leggere andi t3, t0, 1 e dire che cosa finisce in t3.
- **Griglia:** (a) analisi: dalla struttura al comportamento. (b) sintesi: dal comportamento alla struttura (uno XOR). (c) analisi: il bit 0 di t0, tutti gli altri bit a 0. Un punto ciascuno, con la ragione.
- **Errore tipico da riconoscere:** Analisi e sintesi sono lo stesso compito fatto in ordine diverso.

### A08.2 (exit)

- **Concetti:** `logic.bitmask` (le maschere di bit)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Scrivete un'istruzione che pone a 1 il bit 3 di t0 lasciando invariati gli altri bit, e una che lo azzera.
- **Griglia:** Porre a 1: ori t0, t0, 8 (8 = bit 3). Azzerare: andi t0, t0, -9 (la maschera ...11110111, cioè ~8). OR con 1 pone a 1, AND con 0 azzera, e gli altri bit incontrano il valore neutro.
- **Errore tipico da riconoscere:** addi t0, t0, 8 pone a 1 il bit 3.

## Lezione 09: Elementi di algebra di Boole

### A09.1 (exit)

- **Concetti:** `logic.adder` (il sommatore)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Un sommatore completo riceve A = 1, B = 1, Cin = 1. Date S e Cout. Perché un sommatore a 32 bit ne richiede 32, concatenati?
- **Griglia:** 1 + 1 + 1 = 3 = 11 in binario: S = 1, Cout = 1. Ogni sommatore completo somma una colonna; il suo riporto in uscita è il riporto in ingresso della colonna successiva, come nella somma a mano.
- **Errore tipico da riconoscere:** Il riporto si può ignorare tranne che nell'ultima colonna.

### A09.2 (exit)

- **Concetti:** `logic.minimisation` (minimizzazione, Karnaugh)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In una mappa di Karnaugh di tre variabili A, B, C, perché si possono raggruppare le celle 000 e 010, ma non 000 e 011? Quale termine dà il primo gruppo?
- **Griglia:** 000 e 010 differiscono solo in B, che si può eliminare: A'C'. 000 e 011 differiscono in due variabili: nessun termine copre esattamente quelle due celle.
- **Errore tipico da riconoscere:** Due celle qualsiasi che contengono 1 si possono raggruppare.

## Lezione 10: Introduzione all'elettronica e all'elettronica digitale

### A10.1 (exit)

- **Concetti:** `elec.transistor` (il transistor come interruttore), `elec.cmos` (le porte CMOS)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In due frasi: come funziona da interruttore un transistor MOS, e perché un invertitore CMOS non assorbe quasi corrente quando il suo ingresso è stabile?
- **Griglia:** La tensione sul gate crea o elimina un canale conduttivo tra source e drain: chiuso o aperto. In CMOS uno dei due transistor della coppia è sempre spento, quindi a regime non c'è un percorso dall'alimentazione alla massa; la corrente scorre solo durante la commutazione.
- **Errore tipico da riconoscere:** Un transistor conserva da solo un bit.

### A10.2 (exit)

- **Concetti:** `elec.logic-levels` (dai volt ai bit)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Sul kit un ingresso legge 1 sopra 2,475 V e 0 sotto 0,825 V; un'uscita dà un 1 sopra 2,64 V. Un filo aggiunge 0,1 V di rumore verso il basso. Un 1 può essere letto male? Che cosa legge un ingresso a 1,6 V?
- **Griglia:** Margine di rumore per l'1: 2,64 - 2,475 = 0,165 V, maggiore di 0,1 V: l'1 viene ancora letto come 1. 1,6 V sta tra le due soglie: il valore è indefinito, e i segnali devono attraversare quella fascia rapidamente.
- **Errore tipico da riconoscere:** Un 1 vale esattamente 3,3 V e qualsiasi altro valore è un errore.

## Lezione 11: Macchine combinatorie

### A11.1 (exit)

- **Concetti:** `comb.machines` (le reti combinatorie)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Combinatoria o sequenziale: un sommatore; un contatore di pressioni di un pulsante; un multiplexer; il processore nel suo insieme? Enunciate la regola usata.
- **Griglia:** Sommatore e multiplexer: combinatorie. Contatore e processore: sequenziali. Regola: le uscite di una macchina combinatoria dipendono solo dagli ingressi presenti; quelle di una sequenziale anche dal passato, conservato come stato.
- **Errore tipico da riconoscere:** Un circuito è sequenziale se è complicato.

### A11.2 (exit)

- **Concetti:** `comb.alu` (l'ALU)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** L'ALU calcola insieme la somma, l'AND, l'OR, lo XOR e uno scorrimento delle stesse due parole. Come arriva in t2 solo il risultato di add t2, t0, t1, e chi lo sceglie?
- **Griglia:** Un multiplexer in uscita lascia passare un solo risultato; le sue linee di selezione vengono dal decodificatore e dall'unità di controllo, che leggono opcode e funct3 dell'istruzione. Non c'è memoria: l'ALU è combinatoria.
- **Errore tipico da riconoscere:** L'ALU calcola solo l'operazione richiesta, una alla volta.

## Lezione 12: Verm1, parte 2: la guida, il cibo e un punteggio

### A12.1 (exit)

- **Concetti:** `verm1.project` (il progetto Verm1), `logic.bitmask` (le maschere di bit)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Le direzioni sono codificate RIGHT 0, DOWN 1, LEFT 2, UP 3. Il verme va a RIGHT e il giocatore spinge LEFT. Che cosa dà xor t3, t2, t1, e che cosa ne fa il codice?
- **Griglia:** 0 XOR 2 = 2 (10 in binario): direzioni opposte differiscono solo nel bit 1. Il codice confronta t3 con 2 e ignora la richiesta: l'inversione a U è rifiutata. Lo stesso vale per DOWN e UP (1 XOR 3 = 2).
- **Errore tipico da riconoscere:** Rifiutare un'inversione a U richiede quattro confronti separati.

## Lezione 13: Macchine sequenziali

### A13.1 (exit)

- **Concetti:** `seq.clock` (il clock)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Il clock del kit va a 160 MHz. Qual è il suo periodo, e perché ogni rete combinatoria tra due registri deve stabilizzarsi entro quel tempo?
- **Griglia:** T = 1 / 160 MHz = 6,25 ns. I registri campionano gli ingressi su un fronte del clock: se le uscite della rete non si sono stabilizzate entro il fronte successivo, viene catturato un valore sbagliato. Il cammino critico limita la frequenza del clock.
- **Errore tipico da riconoscere:** Un clock più veloce rende sempre più veloce lo stesso circuito.

### A13.2 (exit)

- **Concetti:** `seq.latch-ff` (latch e flip-flop)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Qual è la differenza tra un latch D e un flip-flop D, e quale dei due permette di leggere e scrivere un registro nello stesso ciclo di clock in sicurezza?
- **Griglia:** Il latch è trasparente finché l'abilitazione è attiva: l'uscita segue l'ingresso. Il flip-flop campiona solo sul fronte del clock. Il flip-flop: il nuovo valore compare solo al fronte, quindi durante il ciclo si può leggere il vecchio.
- **Errore tipico da riconoscere:** Latch e flip-flop sono due nomi dello stesso circuito.

## Lezione 14: Macchine elementari: registri e bus

### A14.1 (exit)

- **Concetti:** `reg.bus` (bus e porte three-state)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Tre registri condividono un bus comune. Che cosa succede se due di essi lo pilotano contemporaneamente, e quale componente lo impedisce?
- **Griglia:** Due uscite si contendono la linea: una pilota 1 mentre l'altra pilota 0, il valore è indefinito e può scorrere corrente tra loro. I buffer three-state scollegano tutti i registri tranne quello abilitato dal controllo.
- **Errore tipico da riconoscere:** Il bus semplicemente somma o mette in OR i valori che riceve.

### A14.2 (exit)

- **Concetti:** `reg.shift-register` (i registri a scorrimento)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Una parola di 8 bit viene inviata in serie, un bit per impulso di clock. Quanti impulsi servono, e che cosa fa il registro a scorrimento a ciascuno?
- **Griglia:** 8 impulsi. A ogni impulso ogni bit si sposta di una posizione; un bit esce sulla linea seriale (o entra, dal lato che riceve).
- **Errore tipico da riconoscere:** Un trasferimento seriale invia tutti i bit insieme su un filo.

## Lezione 15: La memoria

### A15.1 (exit)

- **Concetti:** `mem.cpu-interface` (processore e memoria)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Elencate, in ordine, che cosa viaggia sul bus degli indirizzi, sulle linee di controllo e sul bus dei dati mentre il processore esegue lw t1, 0(t0).
- **Griglia:** L'indirizzo in t0 va in MA e sul bus degli indirizzi; si attiva il read enable; la memoria mette la parola sul bus dei dati; questa viene catturata in MB e poi scritta in t1. Il bus degli indirizzi è unidirezionale, quello dei dati bidirezionale.
- **Errore tipico da riconoscere:** Il dato viaggia sul bus degli indirizzi.

### A15.2 (exit)

- **Concetti:** `mem.mmio` (l'I/O mappato in memoria)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** RISC-V non ha istruzioni di ingresso/uscita. Come fa allora un programma ad accendere un LED o inviare un pixel a un dispositivo?
- **Griglia:** Ingresso/uscita mappato in memoria: ai registri del controllore del dispositivo sono assegnati indirizzi, e il programma li scrive con una normale sw (e li legge con lw). Su PRG32 lo fa il runtime per conto della cartuccia.
- **Errore tipico da riconoscere:** Per raggiungere un dispositivo serve un'istruzione speciale, o solo il sistema operativo.

## Lezione 16: La memoria permanente

### A16.1 (exit)

- **Concetti:** `mem.cache` (la cache)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Che cosa succede in caso di fallimento di cache? Perché un ciclo che legge un array in ordine ha pochi fallimenti?
- **Griglia:** La parola non è in cache: l'intero blocco che la contiene viene portato dalla memoria principale nella cache, e il processore attende. Leggendo in ordine si usano subito le parole vicine dello stesso blocco (località spaziale), quindi la maggior parte delle letture ha successo.
- **Errore tipico da riconoscere:** In caso di fallimento il programma si ferma con un errore.

### A16.2 (exit)

- **Concetti:** `mem.permanent` (ROM, flash, firmware)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Perché il firmware e le cartucce del kit non possono stare solo in RAM? Quale memoria li conserva, e qual è il suo limite?
- **Griglia:** La RAM è volatile: perde il contenuto senza alimentazione. Sono conservati nella memoria flash, permanente e cancellabile elettricamente; si cancella a blocchi e si consuma dopo molti cicli di scrittura.
- **Errore tipico da riconoscere:** La memoria permanente è semplicemente RAM più lenta.

## Lezione 17: Verm1, parte 3: un corpo, regole e stati

### A17.1 (exit)

- **Concetti:** `seq.fsm` (macchine a stati finiti), `verm1.project` (il progetto Verm1)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Verm1 ha tre stati: TITLE, PLAY, OVER. Disegnate le transizioni ed etichettate ciascuna con l'evento che la provoca.
- **Griglia:** TITLE -A premuto-> PLAY (nuova partita); PLAY -il verme si morde-> OVER; OVER -A premuto-> TITLE. Ogni altro evento lascia lo stato invariato.
- **Errore tipico da riconoscere:** Lo stato è ciò che è disegnato sullo schermo, non una variabile in memoria.

### A17.2 (exit)

- **Concetti:** `data.array` (gli array in memoria), `logic.bitmask` (le maschere di bit)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Il corpo è un anello di 256 elementi. head_i vale 255 e il verme fa un passo. Quanto vale il nuovo head_i, e perché Verm1 lo calcola con andi t1, t1, 255?
- **Griglia:** 255 + 1 = 256, e 256 AND 255 = 0: l'indice torna all'inizio dell'anello. Con 256 elementi, tenere gli 8 bit bassi equivale a prendere l'indice modulo 256, senza divisione.
- **Errore tipico da riconoscere:** L'indice arriva a 256 e scrive oltre la fine dell'array.

## Lezione 18: Il processore

### A18.1 (exit)

- **Concetti:** `cpu.datapath` (il processore RV32)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Seguite add t2, t0, t1 nello schema a blocchi di un processore RV32: nominate, in ordine, i blocchi che usa e che cosa fa ciascuno. Quale blocco non usa?
- **Griglia:** Il PC dà l'indirizzo; l'istruzione è prelevata dalla memoria; decodificatore e unità di controllo ne leggono i campi; il banco dei registri fornisce t0 e t1; l'ALU somma; il risultato è riscritto in t2; il PC successivo è PC + 4. La memoria dei dati non è usata (nessun caricamento o memorizzazione).
- **Errore tipico da riconoscere:** Ogni istruzione legge o scrive la memoria dei dati.

### A18.2 (exit)

- **Concetti:** `arch.stack` (la pila), `abi.calling-convention` (la convenzione di chiamata)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Una funzione comincia con addi sp, sp, -16 e sw ra, 12(sp). Dove si trova ora ra, e che cosa deve fare la funzione prima di ret?
- **Griglia:** In memoria, all'indirizzo sp + 12 nel frame appena riservato sullo stack. Prima di ret: lw ra, 12(sp) per ripristinarlo, poi addi sp, sp, 16 per rilasciare il frame, così che sp sia come l'ha lasciato il chiamante.
- **Errore tipico da riconoscere:** ret ripristina da sé sp e ra.

## Lezione 19: Istruzioni e interruzioni

### A19.1 (exit)

- **Concetti:** `isa.addressing-modes` (i modi di indirizzamento)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Nominate il modo di indirizzamento di: l'1 in addi t1, t1, 1; la parola letta da lw t1, 8(sp); la destinazione di beq t0, t1, loop; l'operando t0 di add t2, t0, t1.
- **Griglia:** Immediato; base più spiazzamento; relativo al PC; registro. Un punto ciascuno.
- **Errore tipico da riconoscere:** 8(sp) significa 8 per sp.

### A19.2 (exit)

- **Concetti:** `cpu.interrupts` (interruzioni e trap)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Arriva un'interruzione mentre il processore sta eseguendo un'istruzione. Che cosa succede a quell'istruzione, quale registro ricorda dove riprendere, e come termina il gestore?
- **Griglia:** L'istruzione corrente viene completata; l'indirizzo da cui riprendere è salvato in mepc; il controllo salta al gestore, che salva ciò che usa, serve il dispositivo e termina con mret, che torna all'indirizzo in mepc.
- **Errore tipico da riconoscere:** Un'interruzione è una chiamata scritta nel programma.

## Lezione 20: I bus e la scheda video

### A20.1 (exit)

- **Concetti:** `io.controllers` (i controllori delle periferiche)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Perché un dispositivo non è mai collegato direttamente al processore? Dite che cosa fa il suo controllore e come il processore dialoga con esso.
- **Griglia:** I dispositivi sono lenti, diversi tra loro e asincroni. Il controllore gestisce il dialogo con il dispositivo e presenta sul bus alcuni registri (dati, stato, controllo); il processore li legge e scrive come memoria (I/O mappato in memoria), e il controllore può sollevare un'interruzione quando un'operazione è completa.
- **Errore tipico da riconoscere:** Il processore pilota da sé ogni segnale del dispositivo.

### A20.2 (exit)

- **Concetti:** `io.video` (la scheda video), `io.framebuffer` (il frame buffer)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Uno schermo di 320 x 200 pixel usa 16 bit per pixel ed è ridisegnato 30 volte al secondo. Quanta memoria serve per il frame buffer, e quanti byte al secondo devono raggiungere lo schermo?
- **Griglia:** 320 x 200 x 2 byte = 128.000 byte. 128.000 x 30 = 3.840.000 byte al secondo, circa 3,8 MB/s. Entrambi crescono con risoluzione e profondità di colore: la pressione che ha plasmato le schede video.
- **Errore tipico da riconoscere:** 16 bit per pixel significa 16 byte per pixel.

## Lezione 21: Ingresso e uscita

### A21.1 (exit)

- **Concetti:** `io.printer` (le stampanti)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** In quattro passi, come trasforma una stampante laser una pagina in toner sulla carta? Perché una stampante ha un proprio processore e una propria memoria?
- **Griglia:** Il tamburo viene caricato; un raggio laser, guidato da uno specchio rotante, scarica i punti dell'immagine riga per riga; il toner aderisce secondo la distribuzione delle cariche; viene trasferito sulla carta e fissato dal calore. Servono un processore e una memoria propri per trasformare la descrizione della pagina nella trama di punti al proprio ritmo: è un piccolo computer, un controllore con firmware.
- **Errore tipico da riconoscere:** Il computer invia alla stampante i punti uno alla volta, mentre stampa.

### A21.2 (exit)

- **Concetti:** `io.polling` (polling, interruzioni, DMA), `cpu.interrupts` (interruzioni e trap)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Un gioco legge il joystick una volta per frame, a 30 frame al secondo. Un tocco dura 20 ms e cade tra due letture. Viene visto? Che cosa cambierebbe un'interruzione?
- **Griglia:** Il frame dura circa 33 ms: un tocco di 20 ms tra due letture va perso. Il polling vede solo lo stato al momento della lettura. Un'interruzione sul fronte del pulsante avviserebbe il processore quando il tocco avviene, così da registrarlo e gestirlo al frame successivo.
- **Errore tipico da riconoscere:** Il polling vede tutto ciò che accade, solo più tardi.

## Lezione 22: Verm1, parte 4: il gioco finito

### A22.1 (exit)

- **Concetti:** `num.division` (quoziente e resto), `info.text` (caratteri e stringhe)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** to_decimal riceve 205. Mostrate come remu e divu per 10 ne danno le tre cifre, e perché memorizza i byte '2', '0', '5' invece dei numeri 2, 0, 5.
- **Griglia:** 205 remu 10 = 5 (unità), 205 divu 10 = 20; 20 remu 10 = 0 (decine), 20 divu 10 = 2; 2 remu 10 = 2 (centinaia). Le cifre escono da destra. Lo schermo disegna caratteri: ogni cifra diventa il suo codice ASCII aggiungendo 48, il codice di '0': 50, 48, 53.
- **Errore tipico da riconoscere:** Un numero in un registro si può disegnare direttamente come testo.

### A22.2 (exit)

- **Concetti:** `verm1.project` (il progetto Verm1), `io.framebuffer` (il frame buffer)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Perché verm1_draw ridisegna la mappa solo quando dirty è impostato? Che cosa vedrebbe il giocatore se update si dimenticasse di impostarlo dopo un passo?
- **Griglia:** Disegnare è il lavoro più costoso di un frame; se nulla è cambiato, il frame buffer contiene già l'immagine giusta, e ridisegnare spreca tempo. Se dirty non venisse impostato, lo schermo mostrerebbe la vecchia posizione: il verme sembrerebbe fermo mentre il gioco prosegue.
- **Errore tipico da riconoscere:** Lo schermo si tiene aggiornato da sé con le variabili in memoria.

## Lezione 23: Verm1 sul Cartridge Store

### A23.1 (exit)

- **Concetti:** `prg32.cartridge-format` (la cartuccia portabile)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** cartridge summary stampa import_model: abi-table. Che cosa dice questo della cartuccia, e perché lo Store accetta solo cartucce del genere?
- **Griglia:** La cartuccia raggiunge il runtime attraverso una tabella di funzioni, non indirizzi fissi di una sola immagine del firmware. Continua quindi a funzionare dopo un aggiornamento del firmware e su ogni host: l'interfaccia è la tabella. Una cartuccia dello Store deve girare sulla macchina di ogni giocatore.
- **Errore tipico da riconoscere:** Portabile significa che la cartuccia viene ricompilata su ogni host.

### A23.2 (exit)

- **Concetti:** `store.publishing` (impacchettare e pubblicare)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Avete pubblicato la versione 1.0.0 e trovato un errore. Che cosa pubblicate ora? Dove non deve mai comparire il token dello Store?
- **Griglia:** Una nuova versione, per esempio 1.0.1: ciò che è stato pubblicato è permanente e non si sostituisce. Il token resta in una variabile d'ambiente della shell: mai nei sorgenti, in file sotto controllo di versione o in schermate; se esposto, va revocato.
- **Errore tipico da riconoscere:** Ripubblicare la 1.0.0 con la correzione sovrascrive la vecchia.

## Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

### A24.1 (exit)

- **Concetti:** `perf.equation` (l'equazione delle prestazioni)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Il ciclo che svuota la mappa di Verm1 esegue 3.840 istruzioni a circa un ciclo ciascuna con un clock a 160 MHz. Quanto dura? Nominate un modo per ridurre ciascuno dei tre fattori.
- **Griglia:** 3.840 x 1 x 6,25 ns = 24 microsecondi. Meno istruzioni: vettori, algoritmi migliori; meno cicli per istruzione: pipeline, esecuzione superscalare; un ciclo più breve: transistor più veloci. Un punto per il tempo, uno per i tre rimedi.
- **Errore tipico da riconoscere:** Solo la frequenza del clock determina quanto velocemente gira un programma.

### A24.2 (exit)

- **Concetti:** `perf.hpc` (HPC e legge di Amdahl)
- **Dove:** biglietto d'uscita, foglio o note dell'ultima slide
- **Domanda:** Un programma è parallelo all'80%. Con tutti i processori che si vuole, qual è l'accelerazione massima, e perché?
- **Griglia:** Legge di Amdahl: accelerazione = 1 / (0,2 + 0,8 / N), che tende a 1 / 0,2 = 5. Il 20% sequenziale gira su un solo processore qualunque sia N.
- **Errore tipico da riconoscere:** Con abbastanza processori qualsiasi programma diventa veloce quanto si vuole.
