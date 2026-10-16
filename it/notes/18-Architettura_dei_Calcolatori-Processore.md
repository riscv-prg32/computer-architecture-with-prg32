# Lezione 18: Il processore

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: accumulatore, pila, registri; il modello del processore; i registri di RISC-V; la convenzione di chiamata; la pila; il processore RV32. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: interruzioni e trap (Lezione 19). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Il processore

L'ultimo blocco del corso apre la macchina che ha eseguito ogni programma scritto finora. Questa lezione presenta il processore due volte: prima come modello generale di riferimento, valido per qualsiasi processore, con la sua unità di controllo, i registri, lo stack e l'unità aritmetica; poi come RISC-V, il processore programmato dalle prime settimane. Ogni elemento astratto del modello ha già, per lo studente, un nome familiare, e il metodo della lezione è rendere esplicita quella corrispondenza. L'anello della citazione è il processore stesso: l'unico componente che comanda tutti gli altri.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Nominare i componenti di un processore. Distinguere i registri interni dai registri di macchina, e i registri di uso generale da quelli speciali. Spiegare come funziona uno stack e come RISC-V realizza push e pop. Confrontare tre modelli di processore, ad accumulatore, a stack e a registri generali, sullo stesso calcolo. Descrivere RISC-V come architettura load-store a registri generali e leggere il nome RV32IMAC. E far corrispondere ogni elemento del modello al processore del kit.

## Slide 3: Il calcolatore e il suo processore

Un richiamo e una definizione. Un calcolatore comprende tre sottosistemi, processore, memoria centrale e ingresso/uscita, collegati da bus. Il processore può eseguire solo un insieme fisso di istruzioni, da qualche decina a qualche centinaio, e il *linguaggio macchina* è l'insieme delle stringhe di bit che le codificano. Le istruzioni richiedono due tipi di azione: trasferimenti di informazione, e operazioni aritmetiche o logiche. Programmi e dati risiedono entrambi nella memoria centrale, come prescrive il modello di von Neumann della Lezione 03.

## Slide 4: Il processore: un modello di riferimento

Il modello di riferimento. L'*unità di controllo* contiene il program counter, che tiene l'indirizzo della prossima istruzione; un registro di decodifica, che tiene l'istruzione in esecuzione; e la rete che emette i segnali di controllo. I *registri di macchina* da R0 a Rn-1 sono quelli usati dal programmatore. L'*unità aritmetico-logica* ha due registri operando e un registro risultato. Due coppie di registri collegano il processore al mondo esterno: MA e MB verso la memoria, RI e RU verso ingresso e uscita. Un bus interno li collega tutti, alla maniera del bus comune della Lezione 14.

## Slide 5: Il modello e RISC-V, fianco a fianco

Ogni elemento del modello, e la sua controparte in RISC-V. Il program counter è `pc`. I registri di macchina sono da x0 a x31, con i loro nomi familiari. I registri della ALU e quelli dell'interfaccia di memoria esistono nell'hardware ma sono invisibili al programmatore. Due righe dicono "assente", ed entrambe sono scelte di progetto deliberate: non ci sono registri per ingresso e uscita, perché i dispositivi sono mappati in memoria, e non c'è un registro di stato con i flag. I registri speciali sono i CSR, riservati al software privilegiato e trattati nella Lezione 19.

## Slide 6: Registri interni e registri di macchina

Due classi di registri. I registri *interni* sono necessari al funzionamento del processore ma invisibili al programmatore: il program counter, i registri dell'interfaccia di memoria, quelli della ALU. I registri *di macchina* definiscono il modello di programmazione, essendo quelli nominati nelle istruzioni. Il processore tratta tre tipi di informazione, istruzioni, indirizzi e dati, ciascuno dei quali potrebbe in linea di principio avere la sua larghezza. In RV32 tutti e tre sono larghi 32 bit, il che conferisce alla macchina una spiccata regolarità.

## Slide 7: Stato utente e stato supervisore

Un processore ha almeno due stati di funzionamento. Nello stato *supervisore* esegue il sistema operativo e può eseguire ogni istruzione. Nello stato *utente* esegue un programma ordinario e può eseguire tutto tranne le istruzioni *privilegiate*, quelle il cui uso improprio potrebbe compromettere il sistema. RISC-V chiama questi stati modi: il modo macchina, il più privilegiato e l'unico obbligatorio, il modo supervisore e il modo utente. Il chip del kit implementa i modi macchina e utente. Il passaggio dall'uno all'altro avviene attraverso le trap della prossima lezione.

## Slide 8: Le funzioni dei registri

Cinque funzioni dei registri. *Transito*: portare dati tra memoria e registri. *Accumulazione*: contenere operandi e risultati dell'aritmetica. *Indirizzamento*: contenere un indirizzo o parte di esso, come fanno i registri base e indice. *Puntatore allo stack*: indicare la cima di uno stack in memoria. *Flag*: singoli bit che registrano eventi come zero, segno, overflow e riporto, che condizionano le istruzioni successive. In RISC-V i registri generali svolgono le prime quattro funzioni; la quinta non esiste affatto come registro.

## Slide 9: I trentadue registri di RISC-V

La tabella completa dei registri RISC-V, con numeri, nomi e ruoli. La maggior parte è in uso da settimane: `zero`, `ra`, `sp`, i temporanei da `t0` a `t6`, gli argomenti da `a0` ad `a7`, i registri salvati da `s0` a `s11`; `gp` e `tp` sono nuovi, usati da compilatori e sistemi operativi. L'hardware tratta in modo identico i registri da x1 a x31 e solo x0 è speciale; i ruoli derivano dalla convenzione di chiamata, incontrata nella Lezione 02 e qui enunciata come regola. Una chiamata può sovrascrivere `ra` e i registri `t` e `a`, che sono *salvati dal chiamante*: un chiamante che ne ha ancora bisogno li salva prima della chiamata. Una chiamata deve restituire invariati i registri `s` e `sp`, che sono *salvati dal chiamato*: una funzione che ne usa uno lo salva nel suo frame e lo ripristina prima di `ret`. Il program counter non fa parte del banco dei registri.

## Slide 10: I flag: il registro di stato, e la sua assenza

Molti processori hanno un registro di stato i cui bit, i *flag*, registrano l'esito dell'ultima operazione: zero, negativo, overflow, riporto. Un'istruzione li imposta e un successivo salto condizionato li verifica. RISC-V non ne ha. Un salto confronta due registri e salta, in una sola istruzione; `slt` scrive il risultato di un confronto in un registro ordinario; riporto e overflow si calcolano quando servono, come nella Lezione 05. Meno stato nascosto significa un processore più semplice, una pipeline più semplice e una gestione delle interruzioni più semplice, perché non c'è stato implicito da salvare.

## Slide 11: Registri speciali di RISC-V: i CSR

I registri speciali di RISC-V sono i *registri di controllo e di stato*, CSR: un banco separato, letto e scritto solo da codice privilegiato con istruzioni dedicate. Cinque meritano di essere conosciuti per nome: `mstatus`, che contiene l'abilitazione globale delle interruzioni; `mtvec`, l'indirizzo della routine di gestione delle trap; `mepc`, l'indirizzo dell'istruzione interrotta; `mcause`, la causa della trap; e la coppia `mie` e `mip`, con un bit per sorgente di interruzione. La prossima lezione li usa tutti.

## Slide 12: Lo stack

Uno *stack* supporta due operazioni: *push* pone un elemento in cima, *pop* rimuove l'elemento più in alto. Opera sempre in cima, quindi non serve specificare alcuna posizione: l'ultimo entrato è il primo a uscire. Serve a mettere da parte il contenuto dei registri che vanno liberati per un compito e a ripristinarlo poi, nelle chiamate di sottoprogramma come nelle interruzioni. Si realizza con un puntatore che indica l'ultimo elemento memorizzato. I programmi accurati verificano il trabocco su un push e lo stack vuoto su un pop. Lo stack frame della Lezione 02 si vede ora nella sua forma generale.

## Slide 13: Quattro architetture del processore

Quattro architetture di processore. Con *registri generali* il processore ha un insieme di registri intercambiabili. Con un *accumulatore*, le istruzioni aritmetiche hanno un operando implicito, un registro speciale. In una macchina *a stack* non c'è né l'uno né l'altro, solo un puntatore allo stack, e le istruzioni operano sulla cima dello stack. Un'architettura *ortogonale* ha un solo banco di registri generali, alcuni dei quali possono fungere anche da puntatore allo stack o avere altri ruoli speciali. RISC-V appartiene a quest'ultima classe.

## Slide 14: RISC-V: un processore load-store a registri generici

RISC-V è un processore *load-store* a registri generali. Solo i caricamenti e le memorizzazioni accedono alla memoria; ogni altra istruzione opera da registro a registro, il che è più veloce. Le istruzioni hanno tre operandi, due sorgenti e una destinazione, così che nessun valore venga distrutto se non lo sceglie il programmatore. Ogni istruzione esegue un'operazione semplice e ha dimensione fissa, il che la rende facile da decodificare e da eseguire in una pipeline. È questo il significato di RISC. Le sette righe del riscaldamento sono il prezzo del progetto, e la semplicità di ciascuna riga è il suo guadagno.

## Slide 15: L'architettura di un processore RV32

Lo schema a blocchi di un processore RV32, letto da sinistra a destra. Il PC fornisce l'indirizzo dell'istruzione, che viene prelevata dalla memoria. Il decodificatore ne separa i campi e l'unità di controllo emette i segnali corrispondenti. Il banco dei registri fornisce gli operandi. La ALU calcola un risultato o forma un indirizzo. La memoria dati viene letta o scritta da caricamenti e memorizzazioni. Due percorsi tornano indietro: il risultato torna al registro nominato da `rd`, e il PC successivo è PC + 4 oppure la destinazione del salto. Ogni istruzione scritta nel corso percorre questa strada, e le macchine delle Lezioni 11, 13 e 14 si possono tutte collocare su di essa.

## Slide 16: Il processore del kit PRG32

Il processore del kit, in cifre: insieme di istruzioni RV32IMAC; un core principale fino a 160 MHz con una pipeline a quattro stadi, e un secondo core a basso consumo; modi macchina e utente; nessuna virgola mobile; 512 KB di SRAM, 320 KB di ROM e una flash esterna; radio e periferiche sullo stesso chip. Un calcolatore completo in pochi millimetri quadrati, al costo di circa due euro, in cui processore, memoria e ingresso/uscita sono tutti presenti esattamente come nel modello.

## Slide 17: Verifica la comprensione: Quale registro del modello generale non ha corrispettivo in RISC-V? / In RISC-V, quali istruzioni possono leggere o scrivere la memoria centrale?

Per la prima domanda si torna alla tabella che affianca il modello a RISC-V e si cercano le righe marcate "assente"; una di esse è tra le opzioni.

Per la seconda si ricorda il riscaldamento: quali istruzioni accedevano alla memoria, e quali solo ai registri? La risposta è la definizione di un'architettura load-store.

## Slide 18: Verifica la comprensione: Dopo addi sp, sp, -4 e sw t0, 0(sp), che cosa è successo? / In una macchina ad accumulatore, l'istruzione ADD y significa:

Per la prima domanda si seguono le due istruzioni una dopo l'altra: il puntatore scende di una parola, e poi un valore viene memorizzato all'indirizzo che ora contiene. Un valore è stato posto sullo stack.

Per la seconda: in una macchina ad accumulatore l'accumulatore è l'operando implicito, fa da uno dei due addendi e riceve il risultato, mentre l'operando scritto nell'istruzione viene solo letto.

## Slide 19: Glossario: inglese e italiano

Dieci termini. La *control unit* è l'*unità di controllo*. Un *registro di macchina* è uno visibile al programmatore. I *flag* si chiamano in italiano anche *indicatori*. Lo stato *supervisore* e lo stato *utente* sono i due livelli di privilegio. Un'*istruzione privilegiata* si può eseguire solo nello stato supervisore.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Il processore comanda e controlla, appoggiandosi alla memoria e all'ingresso/uscita. I registri sono locazioni di memorizzazione, interne o visibili al programmatore. I tipi di registri e il loro uso determinano il modello di processore: ad accumulatore, a stack o a registri generali. La ALU esegue le operazioni. E RISC-V è un processore load-store a registri generali, senza flag e senza istruzioni di I/O: pochi elementi, ciascuno semplice. La prossima lezione segue un'istruzione per l'intera sua vita.
