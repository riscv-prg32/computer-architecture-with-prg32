# Lezione 18: Il processore

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Il processore

L'ultimo blocco del corso apre la macchina che finora ha eseguito i vostri programmi. Questa lezione presenta il processore due volte: prima come modello generale, valido per ogni processore, con unità di controllo, registri, stack e unità aritmetica; poi come RISC-V, il processore che programmate dai primi giorni. Ogni elemento astratto del modello ha già, per voi, un nome familiare. L'anello della citazione è il processore stesso: l'unico componente che comanda tutti gli altri.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Nominare i componenti di un processore. Distinguere i registri interni dai registri di macchina, e i registri generici da quelli speciali. Spiegare come funziona uno stack e come RISC-V realizza push e pop. Confrontare sullo stesso calcolo tre modelli di processore: accumulatore, stack e registri generici. Descrivere RISC-V come processore load-store a registri generici e leggere il nome RV32IMAC. E riportare ogni elemento del modello sul processore del kit.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento prende una riga di un linguaggio di alto livello, la somma di due variabili, e la scrive in RISC-V. Contate le istruzioni, e notate quali toccano la memoria.

## Slide 4: z = x + y

Per calcolare z = x + y il programma carica x in un registro, carica y in un altro, somma i due registri in un terzo, e memorizza il risultato in z. Sette righe per una somma. La memoria è toccata solo da `lw` e `sw`; l'aritmetica avviene solo tra registri. Altri processori fanno lo stesso lavoro con tre istruzioni, o con una. Perché RISC-V è fatto così? Per rispondere servono un modello di che cos'è un processore, e poi un confronto tra modi diversi di costruirne uno.

## Slide 5: Il processore

Prima l'anatomia: di che cosa è fatto un processore, in generale, e che cosa corrisponde a ciascuna parte in RISC-V.

## Slide 6: Il calcolatore e il suo processore

Un richiamo e una definizione. Un calcolatore ha tre sottosistemi, processore, memoria centrale e ingresso/uscita, collegati da bus. Il processore può eseguire soltanto un insieme fisso di istruzioni, da poche decine a poche centinaia, e il *linguaggio macchina* è l'insieme delle stringhe di bit che le codificano. Le istruzioni richiedono due tipi di cose: trasferimenti di informazione e operazioni aritmetiche o logiche. Programmi e dati stanno entrambi nella memoria centrale.

## Slide 7: Il processore: un modello di riferimento

Il modello di riferimento. L'*unità di controllo* contiene il program counter, con l'indirizzo della prossima istruzione, un registro di decodifica, con l'istruzione in esecuzione, e la rete che emette i comandi. I *registri di macchina* da R0 a Rn-1 sono quelli che usa il programmatore. L'*unità aritmetico-logica* ha due registri operando e un registro risultato. Due coppie di registri collegano il processore all'esterno: MA e MB verso la memoria, RI e RU verso ingresso e uscita. Un bus interno collega tutto.

## Slide 8: Il modello e RISC-V, fianco a fianco

Ogni elemento del modello, e che cos'è in RISC-V. Il program counter è `pc`. I registri di macchina sono da x0 a x31, con i nomi che conoscete. I registri della ALU e quelli verso la memoria esistono nell'hardware ma sono invisibili al programmatore. Due righe dicono «assente», e sono scelte volute: non ci sono registri per ingresso e uscita, perché i dispositivi sono mappati in memoria, e non c'è un registro di stato con i flag. I registri speciali sono i CSR, riservati al software privilegiato.

## Slide 9: Registri interni e registri di macchina

Due classi di registri. I registri *interni* sono necessari al funzionamento del processore ma non sono visibili al programmatore: il program counter, i registri verso la memoria, quelli della ALU. I registri *di macchina* definiscono il modello di programmazione: sono quelli nominati nelle istruzioni. Il processore tratta tre tipi di informazione, istruzioni, indirizzi e dati, e ciascuno potrebbe avere una dimensione propria. In RV32 tutti e tre sono larghi 32 bit, e questo rende la macchina molto regolare.

## Slide 10: In che cosa i processori reali differiscono dal modello

I processori reali differiscono dal modello in vari modi: più o meno registri generici, registri che in realtà sono locazioni di memoria, una sezione di ingresso/uscita che manca ed è delegata ad altri chip, un'unità aritmetica semplice estesa da chip dedicati. La colonna di destra dice come RISC-V sul kit risolve ciascun punto: trentadue registri in un banco, nessuna sezione di I/O, estensioni facoltative al posto di chip aggiuntivi. L'estensione M aggiunge moltiplicazione e divisione; l'estensione in virgola mobile sul kit non c'è.

## Slide 11: Parole o byte: la lunghezza delle parole di macchina

Quanto è lunga una parola di macchina? Nei processori *a parola* tutte le istruzioni hanno la stessa lunghezza, dimensionata sull'informazione più lunga: le istruzioni RISC-V sono tutte di 32 bit, o di 16 nella forma compressa. Nei processori *a carattere* la lunghezza varia a multipli di un byte: le istruzioni x86 vanno da 1 a 15 byte. Una lunghezza fissa spreca un po' di spazio ma rende semplice la decodifica, e questo conta per la velocità.

## Slide 12: Stato utente e stato supervisore

Un processore ha almeno due stati di funzionamento. In stato *supervisore* esegue il sistema operativo e può eseguire ogni istruzione. In stato *utente* esegue un programma qualunque e può eseguire tutto tranne le istruzioni *privilegiate*, quelle che potrebbero compromettere il sistema. RISC-V li chiama modi: il modo macchina, il più privilegiato e l'unico obbligatorio, il modo supervisore e il modo utente. Il chip del kit ha macchina e utente. Il passaggio dall'uno all'altro avviene attraverso le trap della prossima lezione.

## Slide 13: I registri

I registri meritano uno sguardo più da vicino: come sono organizzati, a che cosa servono, quali ha RISC-V, e che cosa sostituisce i flag che RISC-V non ha.

## Slide 14: Tipi di registri

I registri possono essere specializzati o generici. I registri specializzati richiedono istruzioni diverse per la stessa operazione su banchi diversi; quelli generici danno più flessibilità. Si possono organizzare come una piccola memoria indirizzabile, un banco in cui si seleziona il registro numero i, oppure come registri separati con un proprio nome. RISC-V sceglie un unico banco di trentadue registri, ciascuno selezionato da cinque bit dentro l'istruzione. I nomi `t0`, `a0`, `sp` sono soltanto convenzioni.

## Slide 15: Le funzioni dei registri

Cinque funzioni dei registri. *Transito*: portare i dati tra memoria e registri. *Accumulo*: contenere operandi e risultati dell'aritmetica. *Indirizzamento*: contenere un indirizzo o una sua parte, come fanno i registri base e indice. *Puntatore allo stack*: indicare la cima di uno stack in memoria. *Flag*: singoli bit che registrano eventi come zero, segno, overflow e riporto, per condizionare le istruzioni successive. In RISC-V i registri generici svolgono le prime quattro funzioni; la quinta non esiste come registro.

## Slide 16: I trentadue registri di RISC-V

La tabella completa dei registri di RISC-V, con numeri, nomi e ruoli. Ne avete usati la maggior parte: `zero`, `ra`, `sp`, i temporanei da `t0` a `t6`, gli argomenti da `a0` ad `a7`, i registri salvati da `s0` a `s11`. Due sono nuovi: `gp` e `tp`, usati da compilatori e sistemi operativi. L'hardware tratta allo stesso modo i registri da x1 a x31; solo x0 è speciale. I ruoli vengono dalla convenzione di chiamata. Il program counter non sta nel banco.

## Slide 17: I flag: il registro di stato, e la sua assenza

Molti processori hanno un registro di stato i cui bit, i *flag*, registrano l'esito dell'ultima operazione: zero, negativo, overflow, riporto. Un'istruzione li imposta, e un salto condizionato successivo li esamina. RISC-V non ne ha. Un salto confronta due registri e salta, tutto in una sola istruzione; `slt` scrive il risultato di un confronto in un registro ordinario; riporto e overflow si calcolano quando servono, come nella Lezione 05. Meno stato nascosto significa un processore più semplice e interruzioni più semplici.

## Slide 18: Registri speciali di RISC-V: i CSR

I registri speciali di RISC-V sono i *registri di controllo e stato*, CSR: un banco separato, letto e scritto solo da codice privilegiato con istruzioni dedicate. Cinque vanno conosciuti per nome: `mstatus`, con l'abilitazione globale delle interruzioni; `mtvec`, l'indirizzo della routine che gestisce le trap; `mepc`, l'indirizzo dell'istruzione interrotta; `mcause`, la ragione della trap; e la coppia `mie` e `mip`, con un bit per sorgente di interruzione. La prossima lezione li usa tutti.

## Slide 19: Lo stack

Lo stack è la struttura dati che rende possibili sottoprogrammi e interruzioni. Lo usate dalla Lezione 02; qui viene definito e confrontato tra processori.

## Slide 20: Lo stack

Uno *stack* ha due operazioni: *push* memorizza un elemento in cima alla pila, *pop* toglie l'elemento in cima. Lavora sempre sulla cima, quindi non occorre dire dove: l'ultimo a entrare è il primo a uscire. Serve a mettere da parte il contenuto dei registri da liberare per un compito e a ripristinarlo dopo. Si realizza con un puntatore che indica l'ultimo elemento. I programmi accurati controllano l'overflow su un push e lo stack vuoto su un pop.

## Slide 21: Push e pop in RISC-V

In RISC-V il puntatore allo stack `sp` contiene l'indirizzo dell'ultima locazione occupata, e lo stack cresce verso gli indirizzi bassi. Un push sono due istruzioni: si sottrae 4 da `sp`, poi si memorizza sulla nuova cima. Un pop è il contrario: si carica dalla cima, poi si somma 4. La tabella confronta tre processori: a RISC-V servono due istruzioni, al 68000 un'istruzione con un modo di indirizzamento speciale, a x86 un'istruzione dedicata. In pratica una funzione RISC-V alloca il suo intero frame in una volta, come fate dalla Lezione 02.

## Slide 22: Modelli di processore

Dove vivono gli operandi di un'operazione? La risposta distingue le grandi famiglie di processori, e spiega le sette righe del riscaldamento.

## Slide 23: Quattro architetture del processore

Quattro architetture. Con i *registri generici* il processore ha un insieme di registri intercambiabili. Con un *accumulatore*, le istruzioni aritmetiche hanno un operando implicito, un registro speciale. In una macchina a *stack* non ci sono né gli uni né l'altro, solo un puntatore allo stack, e le istruzioni lavorano sulla cima dello stack. Un'architettura *ortogonale* ha un unico banco di registri generici, alcuni dei quali fanno anche da puntatore allo stack o svolgono altri ruoli speciali. RISC-V è di quest'ultimo tipo.

## Slide 24: z = x + y in quattro processori

La somma del riscaldamento in quattro macchine. La macchina ad accumulatore: carica x, somma y, memorizza z. La macchina a stack: push di x, push di y, somma, pop in z. Una macchina a registri con operandi in memoria: sposta x in un registro, vi somma y, sposta il registro in z. RISC-V: due load, una somma tra registri, uno store. Gli accessi alla memoria sono tre in tutti i casi. Cambia il numero di istruzioni e quanto fa ciascuna: in RISC-V ognuna fa una cosa sola.

## Slide 25: RISC-V: un processore load-store a registri generici

RISC-V è un processore *load-store* a registri generici. Solo load e store toccano la memoria; ogni altra istruzione lavora da registro a registro, che è più veloce. Le istruzioni hanno tre operandi, due sorgenti e una destinazione, così nessun valore viene distrutto se non lo si vuole. Ogni istruzione fa una cosa semplice e ha dimensione fissa, il che la rende facile da decodificare e da eseguire in pipeline. È questo il significato di RISC. Le sette righe del riscaldamento sono il prezzo, e la semplicità di ogni riga è il guadagno.

## Slide 26: La ALU e il quadro d'insieme

L'ultima parte mette insieme i pezzi: l'unità aritmetica vista dal processore, lo schema a blocchi di un processore RV32, e i numeri del chip del kit.

## Slide 27: L'unità aritmetico-logica

La ALU svolge le operazioni aritmetiche e logiche tra operandi: è la macchina combinatoria della Lezione 11, con due ingressi e un'uscita. Nelle architetture semplici sta interamente dentro il processore; in quelle complesse le operazioni più sofisticate sono delegate a unità separate. In RISC-V queste unità sono le estensioni: M per moltiplicazione e divisione, F e D per la virgola mobile.

## Slide 28: L'architettura di un processore RV32

Lo schema a blocchi di un processore RV32, da sinistra a destra. Il PC dà l'indirizzo dell'istruzione. L'istruzione viene prelevata dalla memoria. Il decodificatore ne separa i campi e l'unità di controllo emette i comandi. Il banco dei registri fornisce gli operandi. La ALU calcola, oppure forma un indirizzo. La memoria dati viene letta o scritta da load e store. Due percorsi tornano indietro: il risultato torna nel registro indicato da `rd`, e il prossimo valore del PC è PC più 4 oppure la destinazione di un salto. Ogni istruzione che scrivete percorre questa strada.

## Slide 29: Il processore del kit PRG32

Il processore del kit, in numeri: insieme di istruzioni RV32IMAC; un core principale fino a 160 MHz con pipeline a quattro stadi, e un secondo core a basso consumo; modi macchina e utente; nessuna virgola mobile; 512 KB di SRAM, 320 KB di ROM e una flash esterna; radio e periferiche sullo stesso chip. Un calcolatore completo in pochi millimetri quadrati, per circa due euro: processore, memoria e ingresso/uscita ci sono tutti, come nel modello.

## Slide 30: Verifica la comprensione: Quale registro del modello generale non ha corrispettivo in RISC-V?

Tornate alla tabella che affianca il modello a RISC-V e cercate le righe con «assente». Una di esse è tra le opzioni.

## Slide 31: Verifica la comprensione: In RISC-V, quali istruzioni possono leggere o scrivere la memoria centrale?

Ricordate il riscaldamento: quali istruzioni toccavano la memoria, e quali solo i registri? È la definizione di architettura load-store.

## Slide 32: Verifica la comprensione: Dopo addi sp, sp, -4 e sw t0, 0(sp), che cosa è successo?

Seguite le due istruzioni: il puntatore scende di una parola, poi un valore viene memorizzato all'indirizzo che ora contiene. Un valore è stato aggiunto in cima allo stack.

## Slide 33: Verifica la comprensione: In una macchina ad accumulatore, l'istruzione ADD y significa:

In una macchina ad accumulatore l'accumulatore è l'operando implicito: è uno dei due addendi e riceve il risultato. L'operando scritto nell'istruzione viene soltanto letto.

## Slide 34: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Scrivete l'espressione z = (a + b) - (c + d) per una macchina ad accumulatore, una a stack e RISC-V, contando istruzioni e accessi alla memoria. Scrivete push e pop di due registri tenendo `sp` multiplo di 16. Classificate per funzione i registri del vostro ultimo programma. Eseguite passo-passo in PRG32-QT una chiamata e il suo ritorno, osservando `pc`, `ra` e `sp`. E cercate il processore del vostro telefono o portatile.

## Slide 35: Glossario: inglese e italiano

Dieci termini. *Control unit* è l'unità di controllo. Un *machine register*, registro di macchina, è un registro visibile al programmatore. I *flag* si dicono anche indicatori. *Supervisor* e *user state*, stato supervisore e stato utente, sono i due livelli di privilegio. Una *privileged instruction*, istruzione privilegiata, si può eseguire solo in stato supervisore.

## Slide 36: Conclusioni e letture

Cinque conclusioni. Il processore comanda e controlla, appoggiandosi alla memoria e all'ingresso/uscita. I registri sono locazioni di memoria, dentro o fuori dal processore. I tipi di registri e il loro uso determinano il modello: accumulatore, stack, registri generici. La ALU svolge le operazioni. E RISC-V è un processore load-store a registri generici, senza flag e senza istruzioni di I/O: pochi elementi, ciascuno semplice. La prossima lezione segue un'istruzione per tutta la sua vita.
