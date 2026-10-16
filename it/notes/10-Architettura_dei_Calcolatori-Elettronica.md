# Lezione 10: Introduzione all'elettronica e all'elettronica digitale

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli ingressi con pull-up; tensione, corrente, legge di Ohm; il transistor come interruttore; dai volt ai bit; le porte CMOS. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: il clock (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Introduzione all'elettronica e all'elettronica digitale

Finora una porta è stata un simbolo e una tabella di verità. Questa lezione le dà un corpo. Segue un bit, quello di un pulsante del kit, dal dito che lo preme al registro che il vostro programma legge, e strada facendo spiega che cos'è un volt, che cosa fa un transistor, e come due transistor fanno un NOT. Non si presuppongono conoscenze di fisica. La citazione di Clarke è la sensazione da dissipare: un chip sembra magia solo finché non si vede di che cosa è fatto.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Usare le quattro grandezze elettriche e la legge di Ohm su un circuito semplice. Dimensionare la resistenza di un LED e calcolare un partitore di tensione. Spiegare che cos'è un transistor e come un transistor MOS funziona da interruttore. Dire come una tensione diventa un valore logico, e che cos'è un margine di rumore. Disegnare in CMOS invertitore, NAND e NOR e contarne i transistor. E spiegare le resistenze di pull-up, gli ingressi flottanti e perché commutare una porta richiede tempo ed energia.

## Slide 3: Quattro grandezze

Quattro grandezze, con l'analogia dell'acqua nei tubi. La *tensione* è la pressione che spinge; si misura in volt e sempre tra due punti. La *corrente* è la portata, in ampere. La *resistenza* è ciò che ostacola il flusso, in ohm. La *potenza* è il lavoro compiuto ogni secondo, in watt. L'ultima colonna lega ciascuna al kit: 3,3 V di alimentazione, circa 10 mA in un LED acceso, 45 kΩ dentro ogni piedino di ingresso. Ricordate la didascalia: dicendo che un piedino «sta a 3,3 V» si intende rispetto a massa, il riferimento comune.

## Slide 4: La legge di Ohm, e la resistenza di un LED

La legge di Ohm: la tensione ai capi di un resistore è uguale alla sua resistenza per la corrente che lo attraversa. Un circuito è un anello chiuso, e il disegno mostra il più semplice tra quelli utili: un'alimentazione, un resistore e un LED. Il LED tiene per sé circa 2 V; alla resistenza vanno i restanti 1,3 V, e così fissa la corrente. Per 10 mA servono 1,3 diviso 0,010, cioè 130 Ω, e il valore commerciale più vicino è 150 Ω. Senza la resistenza la corrente sarebbe di gran lunga troppa e il LED brucerebbe.

## Slide 5: Serie, parallelo e partitore di tensione

Due modi di collegare i resistori. In *serie* la stessa corrente attraversa entrambi e le resistenze si sommano. In *parallelo* la stessa tensione è ai capi di entrambi e la resistenza totale è minore di ciascuna. Due resistori in serie formano un *partitore di tensione*: l'uscita, presa tra i due, è l'alimentazione moltiplicata per R2 diviso R1 più R2. Con resistori uguali è metà dell'alimentazione; se R2 è molto più piccola, l'uscita è vicina a massa. Tenete a mente il partitore: spiega il pulsante alla fine della lezione.

## Slide 6: Il condensatore: perché i segnali richiedono tempo

Un condensatore immagazzina carica come un serbatoio l'acqua, e la sua tensione non può cambiare all'istante: va riempito o svuotato attraverso una resistenza. Il tempo necessario è dell'ordine di R per C. Per un piedino di ingresso del kit, 45 kΩ per 2 pF fanno 90 nanosecondi. Ogni filo e ogni ingresso di transistor è un piccolo condensatore, e da qui nasce il ritardo di una porta. Un condensatore carico o scarico è anche un modo di memorizzare un bit: lo ritroverete nella lezione sulla memoria.

## Slide 7: Conduttori, isolanti, semiconduttori

I conduttori lasciano scorrere la carica; gli isolanti no. I semiconduttori stanno in mezzo, e la loro conduzione si può controllare. Il controllo si ottiene con il *drogaggio*: l'aggiunta di pochi atomi di un altro elemento. Nel silicio di tipo n ci sono elettroni in più, portatori negativi; nel silicio di tipo p ci sono elettroni mancanti, le lacune, che si comportano da portatori positivi. Dove una regione p incontra una regione n c'è una *giunzione*. Un chip è una fetta di silicio con miliardi di regioni di questo tipo, collegate da strati di metallo.

## Slide 8: Il transistor: un interruttore senza parti mobili

La storia dell'interruttore senza parti mobili, in sei date. Il transistor del 1947 sostituisce la valvola termoionica. Il circuito integrato del 1958 mette più transistor su un solo pezzo di semiconduttore. Il transistor MOS del 1960 è piccolo, semplice da costruire e non richiede quasi corrente di controllo. Il CMOS, nel 1963, combina due tipi complementari così che si assorba potenza solo commutando. Nel 1971 un intero processore sta su un chip con 2300 transistor; oggi un chip ne contiene decine di miliardi.

## Slide 9: Il transistor MOS come interruttore

Un transistor MOS ha tre terminali: il *gate* controlla se la corrente può passare tra gli altri due, *source* e *drain*. I tipi sono due, e la tabella dice tutto: un nMOS conduce quando il suo gate è alto; un pMOS conduce quando il suo gate è basso. Sono complementari: ciò che chiude l'uno apre l'altro. Il gate è isolato, quindi non assorbe praticamente corrente. Un altro fatto servirà tra poco: un nMOS collega bene a massa, un pMOS collega bene all'alimentazione.

## Slide 10: Livelli logici: quando una tensione è un 1?

Un circuito digitale non usa tensioni esatte: usa due intervalli. La figura li mostra per il kit. Un'uscita garantisce livelli puliti: sopra 2,64 V per un 1, sotto 0,33 V per uno 0. Un ingresso è più tollerante: legge 1 sopra 2,475 V e 0 sotto 0,825 V. La differenza tra ciò che un'uscita garantisce e ciò che un ingresso richiede è il *margine di rumore*: un disturbo più piccolo non può cambiare il bit. Tra le due soglie di ingresso il valore è indefinito, e i segnali devono attraversare quella fascia in fretta.

## Slide 11: Perché digitale?

Perché rinunciare alla ricchezza dei segnali analogici? In un circuito analogico l'informazione è il valore esatto, quindi ogni stadio aggiunge un po' di rumore, e il rumore si accumula: ogni copia è peggiore della precedente. In un circuito digitale conta solo l'intervallo, e ogni porta produce un livello fresco e pulito: il rumore non si accumula, le copie sono perfette, e gli errori si possono perfino rilevare e correggere. I circuiti analogici restano indispensabili ai bordi di un sistema, dove tocca il mondo: sensori, radio, suono.

## Slide 12: L'invertitore CMOS: una porta NOT con due transistor

La prima porta. Un pMOS collega l'uscita all'alimentazione, un nMOS la collega a massa, ed entrambi i gate sono pilotati dallo stesso ingresso. Con l'ingresso a 0 conduce il pMOS e l'uscita vale 1; con l'ingresso a 1 conduce l'nMOS e l'uscita vale 0. È un NOT. In ogni istante conduce esattamente uno dei due transistor, quindi a ingresso fermo non scorre corrente dall'alimentazione a massa: ecco perché a riposo il CMOS non consuma quasi nulla.

## Slide 13: NAND e NOR in CMOS

Due ingressi, quattro transistor. Nel NAND i due nMOS sono in serie: l'uscita raggiunge massa solo se A e B valgono entrambi 1. I due pMOS sono in parallelo: l'uscita raggiunge l'alimentazione se uno dei due ingressi vale 0. Serie è AND, parallelo è OR. Il NOR è il duale: serie e parallelo si scambiano, esattamente come le leggi di De Morgan scambiano AND e OR. Verificate voi entrambi i disegni per le quattro combinazioni degli ingressi, segnando quali transistor conducono.

## Slide 14: Quanto costano le porte, in transistor

Il costo dei circuiti in transistor. Un NOT costa 2, un NAND o un NOR 4, un AND o un OR 6, perché sono un NAND o un NOR seguito da un invertitore. Questo rovescia l'intuizione dell'algebra: in CMOS vengono prima le porte invertenti, e un AND costa più di un NAND. Un sommatore completo richiede circa 28 transistor, una cella di memoria 6, un flip-flop circa 20. Ora lo scopo della minimizzazione è concreto: meno letterali significano meno transistor, meno area, meno energia e meno tempo.

## Slide 15: Commutare costa tempo ed energia

L'uscita di una porta pilota gli ingressi di altre porte, che sono piccoli condensatori. Per cambiare livello deve caricarli o scaricarli attraverso la resistenza dei propri transistor, e questo richiede tempo: il *ritardo di propagazione*. Richiede anche energia, a ogni cambio di livello. La potenza spesa nel commutare è circa C per V al quadrato per f: la capacità, il quadrato della tensione di alimentazione, e la frequenza. Abbassare la tensione è ciò che fa risparmiare di più, ed è per questo che i chip sono passati da 5 V a circa 1 V all'interno. La velocità si paga in calore.

## Slide 16: Pull-up: un ingresso mai lasciato flottante

Un ingresso collegato a nulla è *flottante*: raccoglie rumore e legge 0 o 1 a caso. Il rimedio è una resistenza di *pull-up* che lega il piedino a 3,3 V. A pulsante rilasciato non scorre corrente, e il piedino legge un 1 pulito. A pulsante premuto l'interruttore collega il piedino a massa: 0 V, uno 0 pulito, e nella resistenza scorre una corrente trascurabile di 73 microampere. È un partitore di tensione il cui resistore inferiore è o infinito o zero. Il firmware poi inverte il bit, così nel vostro programma premuto vale 1.

## Slide 17: Verifica la comprensione: Un LED fa cadere 2 V e deve portare 5 mA da un piedino a 3,3 V. Quale resistenza serve? / In un invertitore CMOS con l'ingresso a 0:

Applicate la legge di Ohm alla resistenza, non all'intero circuito. La resistenza vede l'alimentazione meno ciò che tiene il LED: 3,3 meno 2. Dividete quella tensione per la corrente, in ampere: 5 mA sono 0,005 A.

Con l'ingresso a 0, quale dei due transistor ha il gate al livello che lo fa condurre? Un pMOS conduce con il gate basso, ed è quello collegato all'alimentazione. I due non conducono mai insieme, e l'uscita non resta mai scollegata.

## Slide 18: Verifica la comprensione: Quanti transistor richiede un AND a due ingressi in CMOS statico? / Perché l'ingresso del pulsante del kit ha bisogno di una resistenza di pull-up?

In CMOS un AND non si costruisce direttamente: è un NAND seguito da un invertitore. Sommate i transistor dei due.

Pensate al pulsante rilasciato: il piedino non è collegato a nulla. Che cosa leggerebbe? Il pull-up non ha nulla a che vedere con il LED, con la velocità o con la protezione: dà all'ingresso un livello definito quando l'interruttore è aperto.

## Slide 19: Glossario: inglese e italiano

Quattordici termini. Notate due falsi amici: *voltage* è la tensione, e *ground* è la massa. *Capacitor* è il condensatore. *Gate*, *source* e *drain* non si traducono. *Noise margin* è il margine di rumore, e *floating input* è l'ingresso flottante.

## Slide 20: Conclusioni e letture

Cinque conclusioni. La tensione spinge, la corrente scorre, la resistenza ostacola, e la legge di Ohm copre quasi tutto ciò che serve a un progettista digitale. Un transistor MOS è un interruttore comandato da una tensione, in due tipi complementari. Un bit è un intervallo di tensioni, reso affidabile dai margini di rumore e dalla rigenerazione dei livelli. Le porte CMOS sono coppie di reti di interruttori, e quelle invertenti sono le più economiche. Commutare costa tempo ed energia. La prossima lezione costruisce macchine con queste porte.
