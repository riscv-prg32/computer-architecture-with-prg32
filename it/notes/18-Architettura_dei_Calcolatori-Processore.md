# Lezione 18: Il processore

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: accumulatore, pila, registri; il modello del processore; i registri di RISC-V; la convenzione di chiamata; la pila; il processore RV32. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: interruzioni e trap (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Il processore

L'ultimo blocco del corso apre la macchina che finora ha eseguito i vostri programmi. Questa lezione presenta il processore due volte: prima come modello generale, valido per ogni processore, con unità di controllo, registri, stack e unità aritmetica; poi come RISC-V, il processore che programmate dai primi giorni. Ogni elemento astratto del modello ha già, per voi, un nome familiare. L'anello della citazione è il processore stesso: l'unico componente che comanda tutti gli altri.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Nominare i componenti di un processore. Distinguere i registri interni dai registri di macchina, e i registri generici da quelli speciali. Spiegare come funziona uno stack e come RISC-V realizza push e pop. Confrontare sullo stesso calcolo tre modelli di processore: accumulatore, stack e registri generici. Descrivere RISC-V come processore load-store a registri generici e leggere il nome RV32IMAC. E riportare ogni elemento del modello sul processore del kit.

## Slide 3: Il calcolatore e il suo processore

Un richiamo e una definizione. Un calcolatore ha tre sottosistemi, processore, memoria centrale e ingresso/uscita, collegati da bus. Il processore può eseguire soltanto un insieme fisso di istruzioni, da poche decine a poche centinaia, e il *linguaggio macchina* è l'insieme delle stringhe di bit che le codificano. Le istruzioni richiedono due tipi di cose: trasferimenti di informazione e operazioni aritmetiche o logiche. Programmi e dati stanno entrambi nella memoria centrale.

## Slide 4: Il processore: un modello di riferimento

Il modello di riferimento. L'*unità di controllo* contiene il program counter, con l'indirizzo della prossima istruzione, un registro di decodifica, con l'istruzione in esecuzione, e la rete che emette i comandi. I *registri di macchina* da R0 a Rn-1 sono quelli che usa il programmatore. L'*unità aritmetico-logica* ha due registri operando e un registro risultato. Due coppie di registri collegano il processore all'esterno: MA e MB verso la memoria, RI e RU verso ingresso e uscita. Un bus interno collega tutto.

## Slide 5: Il modello e RISC-V, fianco a fianco

Ogni elemento del modello, e che cos'è in RISC-V. Il program counter è `pc`. I registri di macchina sono da x0 a x31, con i nomi che conoscete. I registri della ALU e quelli verso la memoria esistono nell'hardware ma sono invisibili al programmatore. Due righe dicono «assente», e sono scelte volute: non ci sono registri per ingresso e uscita, perché i dispositivi sono mappati in memoria, e non c'è un registro di stato con i flag. I registri speciali sono i CSR, riservati al software privilegiato.

## Slide 6: Registri interni e registri di macchina

Due classi di registri. I registri *interni* sono necessari al funzionamento del processore ma non sono visibili al programmatore: il program counter, i registri verso la memoria, quelli della ALU. I registri *di macchina* definiscono il modello di programmazione: sono quelli nominati nelle istruzioni. Il processore tratta tre tipi di informazione, istruzioni, indirizzi e dati, e ciascuno potrebbe avere una dimensione propria. In RV32 tutti e tre sono larghi 32 bit, e questo rende la macchina molto regolare.

## Slide 7: Stato utente e stato supervisore

Un processore ha almeno due stati di funzionamento. In stato *supervisore* esegue il sistema operativo e può eseguire ogni istruzione. In stato *utente* esegue un programma qualunque e può eseguire tutto tranne le istruzioni *privilegiate*, quelle che potrebbero compromettere il sistema. RISC-V li chiama modi: il modo macchina, il più privilegiato e l'unico obbligatorio, il modo supervisore e il modo utente. Il chip del kit ha macchina e utente. Il passaggio dall'uno all'altro avviene attraverso le trap della prossima lezione.

## Slide 8: Le funzioni dei registri

Cinque funzioni dei registri. *Transito*: portare i dati tra memoria e registri. *Accumulo*: contenere operandi e risultati dell'aritmetica. *Indirizzamento*: contenere un indirizzo o una sua parte, come fanno i registri base e indice. *Puntatore allo stack*: indicare la cima di uno stack in memoria. *Flag*: singoli bit che registrano eventi come zero, segno, overflow e riporto, per condizionare le istruzioni successive. In RISC-V i registri generici svolgono le prime quattro funzioni; la quinta non esiste come registro.

## Slide 9: I trentadue registri di RISC-V

La tabella completa dei registri di RISC-V, con numeri, nomi e ruoli. Ne avete usati la maggior parte: `zero`, `ra`, `sp`, i temporanei da `t0` a `t6`, gli argomenti da `a0` ad `a7`, i registri salvati da `s0` a `s11`. Due sono nuovi: `gp` e `tp`, usati da compilatori e sistemi operativi. L'hardware tratta allo stesso modo i registri da x1 a x31; solo x0 è speciale. I ruoli vengono dalla convenzione di chiamata. Il program counter non sta nel banco.

## Slide 10: I flag: il registro di stato, e la sua assenza

Molti processori hanno un registro di stato i cui bit, i *flag*, registrano l'esito dell'ultima operazione: zero, negativo, overflow, riporto. Un'istruzione li imposta, e un salto condizionato successivo li esamina. RISC-V non ne ha. Un salto confronta due registri e salta, tutto in una sola istruzione; `slt` scrive il risultato di un confronto in un registro ordinario; riporto e overflow si calcolano quando servono, come nella Lezione 05. Meno stato nascosto significa un processore più semplice e interruzioni più semplici.

## Slide 11: Registri speciali di RISC-V: i CSR

I registri speciali di RISC-V sono i *registri di controllo e stato*, CSR: un banco separato, letto e scritto solo da codice privilegiato con istruzioni dedicate. Cinque vanno conosciuti per nome: `mstatus`, con l'abilitazione globale delle interruzioni; `mtvec`, l'indirizzo della routine che gestisce le trap; `mepc`, l'indirizzo dell'istruzione interrotta; `mcause`, la ragione della trap; e la coppia `mie` e `mip`, con un bit per sorgente di interruzione. La prossima lezione li usa tutti.

## Slide 12: Lo stack

Uno *stack* ha due operazioni: *push* memorizza un elemento in cima alla pila, *pop* toglie l'elemento in cima. Lavora sempre sulla cima, quindi non occorre dire dove: l'ultimo a entrare è il primo a uscire. Serve a mettere da parte il contenuto dei registri da liberare per un compito e a ripristinarlo dopo. Si realizza con un puntatore che indica l'ultimo elemento. I programmi accurati controllano l'overflow su un push e lo stack vuoto su un pop.

## Slide 13: Quattro architetture del processore

Quattro architetture. Con i *registri generici* il processore ha un insieme di registri intercambiabili. Con un *accumulatore*, le istruzioni aritmetiche hanno un operando implicito, un registro speciale. In una macchina a *stack* non ci sono né gli uni né l'altro, solo un puntatore allo stack, e le istruzioni lavorano sulla cima dello stack. Un'architettura *ortogonale* ha un unico banco di registri generici, alcuni dei quali fanno anche da puntatore allo stack o svolgono altri ruoli speciali. RISC-V è di quest'ultimo tipo.

## Slide 14: RISC-V: un processore load-store a registri generici

RISC-V è un processore *load-store* a registri generici. Solo load e store toccano la memoria; ogni altra istruzione lavora da registro a registro, che è più veloce. Le istruzioni hanno tre operandi, due sorgenti e una destinazione, così nessun valore viene distrutto se non lo si vuole. Ogni istruzione fa una cosa semplice e ha dimensione fissa, il che la rende facile da decodificare e da eseguire in pipeline. È questo il significato di RISC. Le sette righe del riscaldamento sono il prezzo, e la semplicità di ogni riga è il guadagno.

## Slide 15: L'architettura di un processore RV32

Lo schema a blocchi di un processore RV32, da sinistra a destra. Il PC dà l'indirizzo dell'istruzione. L'istruzione viene prelevata dalla memoria. Il decodificatore ne separa i campi e l'unità di controllo emette i comandi. Il banco dei registri fornisce gli operandi. La ALU calcola, oppure forma un indirizzo. La memoria dati viene letta o scritta da load e store. Due percorsi tornano indietro: il risultato torna nel registro indicato da `rd`, e il prossimo valore del PC è PC più 4 oppure la destinazione di un salto. Ogni istruzione che scrivete percorre questa strada.

## Slide 16: Il processore del kit PRG32

Il processore del kit, in numeri: insieme di istruzioni RV32IMAC; un core principale fino a 160 MHz con pipeline a quattro stadi, e un secondo core a basso consumo; modi macchina e utente; nessuna virgola mobile; 512 KB di SRAM, 320 KB di ROM e una flash esterna; radio e periferiche sullo stesso chip. Un calcolatore completo in pochi millimetri quadrati, per circa due euro: processore, memoria e ingresso/uscita ci sono tutti, come nel modello.

## Slide 17: Verifica la comprensione: Quale registro del modello generale non ha corrispettivo in RISC-V? / In RISC-V, quali istruzioni possono leggere o scrivere la memoria centrale?

Tornate alla tabella che affianca il modello a RISC-V e cercate le righe con «assente». Una di esse è tra le opzioni.

Ricordate il riscaldamento: quali istruzioni toccavano la memoria, e quali solo i registri? È la definizione di architettura load-store.

## Slide 18: Verifica la comprensione: Dopo addi sp, sp, -4 e sw t0, 0(sp), che cosa è successo? / In una macchina ad accumulatore, l'istruzione ADD y significa:

Seguite le due istruzioni: il puntatore scende di una parola, poi un valore viene memorizzato all'indirizzo che ora contiene. Un valore è stato aggiunto in cima allo stack.

In una macchina ad accumulatore l'accumulatore è l'operando implicito: è uno dei due addendi e riceve il risultato. L'operando scritto nell'istruzione viene soltanto letto.

## Slide 19: Glossario: inglese e italiano

Dieci termini. *Control unit* è l'unità di controllo. Un *machine register*, registro di macchina, è un registro visibile al programmatore. I *flag* si dicono anche indicatori. *Supervisor* e *user state*, stato supervisore e stato utente, sono i due livelli di privilegio. Una *privileged instruction*, istruzione privilegiata, si può eseguire solo in stato supervisore.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Il processore comanda e controlla, appoggiandosi alla memoria e all'ingresso/uscita. I registri sono locazioni di memoria, dentro o fuori dal processore. I tipi di registri e il loro uso determinano il modello: accumulatore, stack, registri generici. La ALU svolge le operazioni. E RISC-V è un processore load-store a registri generici, senza flag e senza istruzioni di I/O: pochi elementi, ciascuno semplice. La prossima lezione segue un'istruzione per tutta la sua vita.
