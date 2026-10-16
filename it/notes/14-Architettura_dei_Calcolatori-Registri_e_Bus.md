# Lezione 14: Macchine elementari: registri e bus

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i registri a scorrimento; i registri come flip-flop; bus e porte three-state. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: l'I/O mappato in memoria (Lezione 15); memorie e indirizzi (Lezione 15). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Macchine elementari: registri e bus

La lezione precedente ha costruito un registro con i flip-flop. Questa si chiede come i registri comunicano: come una parola passa dall'uno all'altro, lungo quali fili, e che cosa accade quando molti registri condividono gli stessi fili. Le risposte sono il bus, il buffer three-state e il registro a scorrimento, le macchine elementari di ogni percorso dei dati. La battuta di Doc Brown in copertina è ironica in questo contesto: i dati hanno eccome bisogno di strade, e un bus è esattamente questo. Il riscaldamento parte da un fatto sul kit: il suo display riceve ogni pixel un bit alla volta.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Descrivere un registro come un insieme di flip-flop con un clock comune e un segnale di caricamento. Spiegare che cos'è un bus e confrontare i bus dedicati con un bus comune. Dire perché un bus comune richiede buffer three-state e che cosa significa alta impedenza. Descrivere un registro a scorrimento e le sue quattro combinazioni di ingresso e uscita seriali e parallele. E convertire un dato dalla forma parallela a quella seriale e ritorno, sia in hardware sia in assembly.

## Slide 3: Porte di parola

Una *parola* è un vettore di n bit. Una *porta di parola* consiste di n porte identiche che condividono un ingresso di controllo: con il controllo a 1 la parola passa invariata, con il controllo a 0 ogni bit è forzato a 0. È la generalizzazione naturale di una porta da un bit a una parola. Le istruzioni bit a bit di RISC-V sono porte di parola larghe trentadue bit, e il multiplexer di parole della Lezione 11 è costruito con esse.

## Slide 4: Il registro

Un *registro* memorizza un gruppo di bit; nella sua forma più semplice è un gruppo di flip-flop con un clock comune. Il classico esempio su un solo chip è il 74273, con otto flip-flop D, un clock e un ingresso di azzeramento. *Caricare* un registro significa memorizzare il dato presente ai suoi ingressi, il che avviene quando il segnale di caricamento è attivo, di norma in sincronia con il clock. Ciascuno dei registri RISC-V da x1 a x31 consiste di trentadue flip-flop di questo tipo.

## Slide 5: Trasferimenti di dati e bus

Un *bus* è l'insieme delle linee che porta un dato tra i componenti di un sistema; la parola deriva dal latino *omnibus*, "per tutti". Un bus di n linee porta una parola di n bit in un passo. Il trasferimento da un registro X a un registro Y è l'azione elementare di cui tutte le altre sono composte: quasi ogni istruzione scritta finora è, a livello hardware, una breve sequenza di trasferimenti tra registri, una descrizione nota come livello dei trasferimenti tra registri.

## Slide 6: Due soluzioni tecniche

Due modi di interconnettere i registri. Con *bus dedicati* ogni trasferimento possibile ha le sue linee: più trasferimenti possono avvenire contemporaneamente, ma i collegamenti crescono con il quadrato del numero di registri. Con un *bus comune* un solo percorso serve ogni trasferimento: di volta in volta si scelgono una sorgente e una destinazione, e un trasferimento richiede due passi, dalla sorgente al bus e dal bus alla destinazione. È economico e diffuso, al prezzo di eseguire un trasferimento alla volta. La scelta è un compromesso archetipico tra costo e parallelismo.

## Slide 7: Trasferimenti paralleli, seriali e misti

Un trasferimento può essere *parallelo*, con gli n bit che viaggiano insieme su n linee in un passo; *seriale*, con i bit che viaggiano in sequenza su una linea in n passi; o misto, per esempio un byte alla volta. L'ultima riga registra una tendenza significativa: dentro un chip i bus sono paralleli, mentre tra chip e tra macchine oggi sono quasi sempre seriali, perché ad altissima velocità è più facile tenere pulita una linea che mantenere sincronizzate trentadue linee.

## Slide 8: Da bus a registro, e da registro a bus

Le due metà di un trasferimento su bus comune. A sinistra, dal bus a un registro: il dato sul bus viene caricato in R quando il segnale di caricamento è attivo. A destra, da un registro al bus: le uscite di R raggiungono il bus attraverso un buffer, e solo mentre il segnale di abilitazione è attivo. La domanda in fondo introduce la sezione successiva: quando l'abilitazione non è attiva, che cosa deve essere l'uscita del buffer per non disturbare il bus?

## Slide 9: La porta a tre stati

Un'uscita *three-state* ha una terza condizione oltre a 0 e 1: l'*alta impedenza*, scritta z, in cui l'uscita è elettricamente scollegata dal filo. Un ingresso di abilitazione decide: quando vale 1 la porta funziona normalmente, quando vale 0 l'uscita è z. La tabella lo mostra per un AND con abilitazione: quattro righe di un AND ordinario, e un'ultima riga in cui l'uscita fluttua indipendentemente dagli ingressi. Elettricamente, entrambi i transistor dello stadio di uscita sono spenti.

## Slide 10: Abilitare un bus

Applicata a un'intera parola, una porta three-state lascia passare un bus o lo scollega: quando è abilitata, il bus di uscita riproduce quello di ingresso; altrimenti tutte le sue linee sono in alta impedenza. I piedini del chip del kit funzionano così: ciascuno si può configurare come uscita, che pilota il suo filo, oppure rilasciare e usare come ingresso. I piedini del joystick sono ingressi; quelli del display sono uscite.

## Slide 11: Collegare i bus: l'OR di bus

Lo schema completo di un bus comune. Ogni registro sorgente raggiunge il bus attraverso un buffer three-state con la sua abilitazione. La regola è rigorosa: al più un'abilitazione può essere attiva in ogni momento, così che esattamente una sorgente piloti il bus mentre tutte le altre sono scollegate; due sorgenti attive si contenderebbero il filo. Dal lato ricevente ogni registro destinazione è collegato al bus, e solo quello con il segnale di caricamento attivo cattura il dato. Scegliere sorgente e destinazione è compito di decoder pilotati dall'unità di controllo, che la Lezione 18 descrive.

## Slide 12: Registri a scorrimento

Un *registro a scorrimento* è una catena di celle da un bit in cui, a ogni impulso di clock, ogni bit si sposta nella cella adiacente. Ogni cella è un flip-flop D il cui ingresso è l'uscita della vicina. Il comportamento sul fronte del flip-flop è essenziale: con latch trasparenti un bit attraverserebbe di corsa l'intera catena durante un solo impulso di clock. Lo scorrimento può avvenire in una direzione fissa oppure in una direzione scelta da una linea di controllo.

## Slide 13: Quattro tipi di registro a scorrimento

La stessa catena di flip-flop dà quattro macchine, secondo dove i dati entrano ed escono. Ingresso seriale, uscita seriale: una linea di ritardo. Ingresso seriale, uscita parallela: raccoglie i bit che arrivano uno alla volta e presenta la parola completa. Ingresso parallelo, uscita seriale: accetta una parola e la emette bit per bit. Ingresso parallelo, uscita parallela, senza scorrimento, è il registro ordinario. La seconda e la terza sono i due capi di ogni collegamento seriale.

## Slide 14: Trasferimenti tra registri

Due modi di spostare una parola tra registri. In un trasferimento seriale l'uscita seriale di un registro a scorrimento alimenta l'ingresso seriale di un altro: n impulsi di clock, un filo. In un trasferimento parallelo le uscite di un registro alimentano gli ingressi di un altro: un impulso di clock, n fili. La frase a destra enuncia il compromesso dell'intera lezione: spostare una parola di n bit costa o tempo o rame.

## Slide 15: Da seriale a parallelo e ritorno

Un collegamento seriale completo in cinque passi: il dato viene caricato in parallelo in un registro a scorrimento; viene fatto uscire, un bit per passo; i bit viaggiano su una sola linea; all'altro capo un secondo registro a scorrimento li raccoglie, uno per passo; e la parola ricostruita viene consegnata in parallelo. È la controparte hardware del riscaldamento, e il modo in cui il display del kit riceve ogni pixel. Ogni standard seriale, dalla storica porta seriale all'USB, poggia su una coppia di registri a scorrimento.

## Slide 16: Registri con un indirizzo: una prima memoria

Quattro registri da tre bit e un decoder costituiscono una piccola memoria. Due linee di indirizzo selezionano, attraverso il decoder, uno dei quattro registri; tre linee portano i dati in ingresso e tre in uscita. Tre linee di controllo completano il progetto: il *chip select*, così che la memoria risponda solo quando è selezionata; una linea di lettura/scrittura; e l'*output enable*, che controlla uscite three-state così che più memorie possano condividere un bus. Nulla qui è nuovo, solo decoder, registri e buffer three-state; la prossima lezione porta la stessa struttura alla scala della memoria centrale.

## Slide 17: Verifica la comprensione: Perché a un bus comune servono i buffer a tre stati? / Quanti impulsi di clock richiede il trasferimento seriale di una parola di 32 bit?

Per la prima domanda si immaginano due uscite collegate allo stesso filo, una a 0 e l'altra a 1. Un buffer three-state non riguarda né la velocità, né la memorizzazione, né la conversione: scollega le sorgenti che non sono state selezionate.

Per la seconda: un bit per impulso di clock. L'alternativa, un trasferimento parallelo, richiederebbe un impulso e trentadue fili.

## Slide 18: Verifica la comprensione: Una memoria ha 10 linee di indirizzo e 8 linee di dati. Quanti bit memorizza?

Dieci linee di indirizzo selezionano una parola tra 2^10, e ogni parola ha 8 bit; i due numeri si moltiplicano. La prima opzione moltiplica i numeri di linee invece di elevare due alla potenza delle linee di indirizzo, un errore frequente.

## Slide 19: Glossario: inglese e italiano

Dieci termini. *Three-state*, o tri-state, è *a tre stati*; *high impedance* è *alta impedenza*. Uno *shift register* è un *registro a scorrimento*. *Load* e *strobe* indicano il segnale che fa catturare a un registro il suo ingresso. Il *chip select* è la linea che indica quale dispositivo su un bus condiviso deve rispondere.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Un registro è una forma di memoria con un modo di funzionamento elementare. I registri si leggono e si scrivono attraverso i bus. Un bus comune richiede circuiti a tre stati: 0, 1 e scollegato. I dati viaggiano in serie o in parallelo, e i registri a scorrimento convertono tra le due forme. E un decoder posto davanti a un gruppo di registri costituisce una memoria, che è l'argomento della prossima lezione.
