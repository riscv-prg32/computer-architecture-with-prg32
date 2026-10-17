# Lezione 13: Macchine sequenziali

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: macchine a stati finiti; il clock; latch e flip-flop; i registri come flip-flop. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) descrivere una macchina a stati finiti con un diagramma degli stati; (2) spiegare il clock e perché un circuito deve stabilizzarsi entro un periodo; (3) distinguere un latch da un flip-flop e costruire un registro. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 14, Macchine elementari: registri e bus.

Il filo della lezione: Un registro è fatto di flip-flop che campionano su un fronte del clock: è così che il contatore della Lezione 02 sopravviveva da un frame all'altro, in hardware. Prossimo passo: come i registri si scambiano i dati.

## Slide 1: Macchine sequenziali

Si apre il terzo blocco del corso: stato e memoria. Le macchine della Lezione 11 non avevano memoria: ingressi identici producevano sempre uscite identiche. Un calcolatore, però, ricorda: un contatore persiste da un frame al successivo, e un gioco sa se sta mostrando il titolo o il campo di gioco. Questa lezione introduce tempo e stato, il modello che descrive ogni circuito dotato di memoria, e gli elementi elementari di memorizzazione, latch e flip-flop, con cui si costruiscono i registri del processore. È il cardine concettuale tra logica e architettura.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Spiegare perché un circuito sequenziale richiede i concetti di tempo e di stato. Definire una macchina a stati finiti e distinguere i modelli di Mealy e di Moore. Descrivere una macchina con una tabella degli stati e con un diagramma degli stati, e passare dall'uno all'altro. Spiegare come un latch SR memorizza un bit e perché una combinazione di ingresso è vietata. Distinguere i latch dai flip-flop, l'attivazione a livello da quella sul fronte. E riconoscere registri, contatori e program counter come macchine sequenziali.

## Slide 3: Il clock

Il *clock* è un segnale che alterna regolarmente tra 0 e 1. Il disegno ne indica le caratteristiche: il periodo T, i tempi alto e basso, il fronte di salita, dove passa da 0 a 1, e il fronte di discesa. La frequenza è il numero di periodi al secondo, 1/T. I circuiti sincroni cambiano stato su uno dei due fronti. Per il kit, 160 MHz corrispondono a un periodo di 6,25 nanosecondi, e ogni rete combinatoria del chip deve assestarsi entro quell'intervallo: il cammino critico della Lezione 11 pone così un limite superiore alla frequenza di clock.

## Slide 4: Il concetto di stato

Lo *stato* è un riassunto dell'intera storia passata degli ingressi: ciò che il circuito deve sapere del passato per comportarsi correttamente da qui in avanti. È contenuto nelle variabili di stato. Una funzione di transizione calcola lo stato successivo dallo stato presente e dagli ingressi presenti, e lo stato si aggiorna una volta per ciclo di clock, come la formula a destra dice in forma compatta. La nozione di stato è un'astrazione potente: una storia illimitata è sostituita da una quantità finita di informazione. Memorizzarla richiede elementi con due condizioni stabili, latch e flip-flop.

## Slide 5: L'automa a stati finiti

La definizione formale. Una macchina sequenziale è specificata da cinque componenti: un alfabeto di ingresso I e un alfabeto di uscita U, entrambi insiemi finiti di simboli; un insieme finito di stati S; una funzione di stato successivo, che assegna uno stato successivo a ogni coppia di stato e ingresso; e una funzione di uscita. Il riscaldamento istanzia la definizione: l'ingresso è "A premuto o no", gli stati sono TITLE, PLAY e OVER, la funzione di stato successivo è il codice di `game_update`, e l'uscita è lo schermo.

## Slide 6: Macchine di Mealy e macchine di Moore

Ci sono due modi di definire l'uscita. In una macchina di *Mealy* l'uscita dipende sia dallo stato sia dall'ingresso; si scrive sulle transizioni e può rispondere a un ingresso nello stesso ciclo. In una macchina di *Moore* l'uscita dipende solo dallo stato; si scrive dentro gli stati e cambia solo quando cambia lo stato. Il gioco del riscaldamento è una macchina di Moore, perché ogni stato ha la sua schermata. I due modelli hanno la stessa potenza espressiva, anche se il numero di stati richiesti può differire.

## Slide 7: Architettura generale di una macchina sequenziale

L'architettura generale di ogni macchina sequenziale. Una rete combinatoria calcola lo stato successivo e le uscite dagli ingressi e dallo stato presente; un registro di flip-flop contiene lo stato presente; a ogni fronte di clock lo stato successivo diventa lo stato presente. L'anello dalla rete al registro e ritorno è ciò che rende possibile la memoria, e il registro è ciò che disciplina l'anello: i valori circolano una volta per ciclo, mai più in fretta. Ogni macchina della Lezione 11 appartiene al blocco superiore. Questo schema, con il contenuto adatto, descrive il processore stesso.

## Slide 8: Tabella e diagramma degli stati: una macchina di Mealy

Due descrizioni equivalenti di una macchina, illustrate da un esempio di Mealy a quattro stati. Nella *tabella degli stati* ogni riga è uno stato presente e ogni colonna un simbolo di ingresso; ogni cella dà lo stato successivo e, dopo la barra, l'uscita. Nel *diagramma degli stati* ogni stato è un nodo e ogni transizione una freccia etichettata ingresso/uscita. Il passaggio tra le due va esercitato: si prende la riga di s0 e se ne individuano le due frecce nel disegno.

## Slide 9: Il latch SR

Il *latch SR* consiste di due porte NOR, ciascuna con l'uscita collegata a un ingresso dell'altra. S, per set, porta Q a 1; R, per reset, porta Q a 0. Con entrambi a 0 il latch conserva il suo ultimo valore: ricorda quale ingresso è stato 1 più di recente. La tabella riassume i quattro casi, l'ultimo dei quali è vietato. A causa della retroazione, Q dipende da sé stesso: in un circuito con un anello un segnale va inteso come una forma d'onda nel tempo, non come un singolo valore.

## Slide 10: Il latch SR nel tempo

Il latch osservato nel tempo. S sale a 1, e dopo il ritardo delle porte Q diventa 1. S torna poi a 0 e nulla cambia: la retroazione tiene Q a 1. Questo tratto piatto è la memoria. Più tardi R sale a 1, Q torna a 0, e vi resta quando R torna a 0. I quattro istanti segnati vanno seguiti con il circuito della slide precedente sotto gli occhi, determinando l'uscita di ogni porta in ogni istante.

## Slide 11: Perché S = R = 1 non è ammesso

Con S e R entrambi a 1, entrambe le porte NOR danno 0, quindi Q e il suo complemento non sono più complementari. Peggio ancora, se i due ingressi tornano poi a 0 contemporaneamente, le porte entrano in competizione, e lo stato finale dipende da quale è più veloce. L'esito è imprevedibile, e il latch può persino oscillare, una condizione nota in forma generale come metastabilità. Un progettista che usa un latch SR deve garantire che S e R non valgano mai 1 insieme. Gli elementi JK e D sono stati ideati per eliminare questo rischio alla radice.

## Slide 12: Latch sincroni: si aggiunge un clock

In un circuito asincrono le uscite possono cambiare ogni volta che cambia un ingresso; in uno sincrono è il clock a decidere quando. Per rendere sincrono il latch SR, S e R passano per due porte AND insieme al clock. Quando il clock vale 0 entrambe le porte danno 0 e il latch non può cambiare; quando il clock vale 1 si comporta come il latch semplice. Il clock decide così quando gli ingressi vengono ascoltati.

## Slide 13: I latch JK e D

Due perfezionamenti del latch. Nel latch *JK* le uscite sono riportate alle porte di ingresso, così che set e reset interni non possano mai valere 1 insieme; la combinazione J = K = 1, invece di essere vietata, inverte l'uscita, il che si chiama commutazione. Il latch *D* ha un solo ingresso: D pilota il set e la sua negazione il reset, quindi l'uscita segue semplicemente D finché il clock è attivo. D sta per delay, o data.

## Slide 14: Il flip-flop master-slave

Il flip-flop *master-slave* consiste di due latch in serie, abilitati da livelli opposti del clock. Quando il clock vale 0 il master è trasparente e segue l'ingresso, mentre lo slave è opaco. Quando il clock sale a 1 il master si chiude, trattenendo il suo contenuto, e lo slave si apre e lo presenta. I due non sono mai trasparenti contemporaneamente, quindi l'ingresso non può mai propagarsi direttamente all'uscita. L'effetto è che l'uscita cambia solo sul fronte di salita: il flip-flop è *attivato sul fronte*.

## Slide 15: Latch o flip-flop? Guardate l'uscita

La differenza resa visibile sulle forme d'onda. Il clock e l'ingresso D sono identici per entrambi gli elementi. L'uscita del latch segue D per tutta la fase alta del clock, e può quindi cambiare a metà di una fase. L'uscita del flip-flop cambia solo sui fronti di salita, assumendo il valore che D ha in quell'istante; brevi impulsi di D tra due fronti vengono ignorati. L'uscita del flip-flop è stabile per un intero periodo, che è esattamente la proprietà richiesta a un registro di stato.

## Slide 16: Un registro è una fila di flip-flop

Un *registro* è una fila di flip-flop che condividono un clock, un flip-flop per bit. Con un segnale di abilitazione al caricamento accetta un nuovo valore solo su richiesta e altrimenti conserva quello vecchio. RISC-V ha trentadue registri di trentadue bit, quindi 1.024 flip-flop. Le due macchine della Lezione 11 trovano ora il loro posto: il decoder pilotato dal campo `rd` attiva il caricamento di un solo registro, e i multiplexer selezionano quali registri si leggono. Il banco dei registri è così una sintesi del combinatorio e del sequenziale.

## Slide 17: Verifica la comprensione: In una macchina di Moore l'uscita dipende: / Un latch SR fatto di porte NOR ha Q = 1. S e R valgono entrambi 0. Che cosa accade?

Per la prima domanda si ricorda dove si scrive l'uscita in ciascun tipo di diagramma. In una macchina di Moore sta dentro i nodi: appartiene allo stato, e l'ingresso non vi entra.

Per la seconda si consulta la tabella del latch SR cercando la riga con entrambi gli ingressi a 0. È la riga della memoria: la retroazione conserva il valore memorizzato, qualunque esso sia.

## Slide 18: Verifica la comprensione: Che cosa distingue un flip-flop D da un latch D? / Quanti flip-flop servono per una macchina a stati finiti con 10 stati?

Per la prima domanda: entrambi gli elementi memorizzano un bit ed entrambi hanno un clock. La differenza sta in quando rispondono: il latch per tutto il livello attivo, il flip-flop solo nell'istante di un fronte.

Per la seconda, una macchina con N stati richiede abbastanza variabili di stato da dare a ogni stato un codice distinto: il più piccolo k tale che 2^k sia almeno N. È la formula dei codici a lunghezza fissa della Lezione 11.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Feedback* è *retroazione*. Il *rising* e il *falling edge* sono il *fronte di salita* e il *fronte di discesa*. *Level-triggered* ed *edge-triggered* specificano quando un elemento di memoria risponde. *Stato presente* e *stato successivo* sono i due valori ai due lati di un fronte di clock. *Latch* e *flip-flop* non si traducono; il termine generale italiano è *bistabile*.

## Slide 20: Conclusioni e letture

Cinque conclusioni. I circuiti digitali sono combinatori o sequenziali, e per i secondi tempo e stato sono essenziali. Una macchina sequenziale realizza un automa a stati finiti, di tipo Mealy o Moore. Latch e flip-flop sono le memorie elementari, e la retroazione è ciò che permette a un circuito di ricordare. Il clock decide quando: i latch rispondono durante un livello, i flip-flop su un fronte. Registri, contatori, il program counter e il processore stesso sono macchine sequenziali costruite attorno a reti combinatorie. La prossima lezione assembla i registri nelle macchine elementari del percorso dei dati.
