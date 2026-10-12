# Lezione 10: Introduzione all'elettronica e all'elettronica digitale

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Introduzione all'elettronica e all'elettronica digitale

Finora una porta è stata un simbolo e una tabella di verità. Questa lezione le dà un corpo. Segue un bit, quello di un pulsante del kit, dal dito che lo preme al registro che il vostro programma legge, e strada facendo spiega che cos'è un volt, che cosa fa un transistor, e come due transistor fanno un NOT. Non si presuppongono conoscenze di fisica. La citazione di Clarke è la sensazione da dissipare: un chip sembra magia solo finché non si vede di che cosa è fatto.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Usare le quattro grandezze elettriche e la legge di Ohm su un circuito semplice. Dimensionare la resistenza di un LED e calcolare un partitore di tensione. Spiegare che cos'è un transistor e come un transistor MOS funziona da interruttore. Dire come una tensione diventa un valore logico, e che cos'è un margine di rumore. Disegnare in CMOS invertitore, NAND e NOR e contarne i transistor. E spiegare le resistenze di pull-up, gli ingressi flottanti e perché commutare una porta richiede tempo ed energia.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento è il test di un pulsante che conoscete a memoria, con un'informazione nuova nei commenti: che cos'è, fisicamente, il pulsante sul kit. Leggete con attenzione i commenti: contengono un'apparente contraddizione.

## Slide 4: Un pulsante, un bit

Nel vostro programma un pulsante premuto è un 1. Sulla scheda il pulsante LEFT è un interruttore tra un piedino del chip, GPIO18, e la massa. Quando è premuto il piedino sta a 0 volt; quando è rilasciato sta a 3,3 volt. Quindi premuto significa 0 volt, eppure il programma legge 1. Le quattro note trasformano questo fatto nelle domande della lezione: che cos'è un volt, perché il piedino rilasciato sta a 3,3 V, e chi decide che 0 V è un bit? L'ultima sezione risponde.

## Slide 5: L'elettricità in quattro grandezze

La prima parte è il minimo di elettricità che serve a un informatico: quattro grandezze, una legge, due modi di collegare i componenti, e il componente che spiega perché nulla è istantaneo.

## Slide 6: Quattro grandezze

Quattro grandezze, con l'analogia dell'acqua nei tubi. La *tensione* è la pressione che spinge; si misura in volt e sempre tra due punti. La *corrente* è la portata, in ampere. La *resistenza* è ciò che ostacola il flusso, in ohm. La *potenza* è il lavoro compiuto ogni secondo, in watt. L'ultima colonna lega ciascuna al kit: 3,3 V di alimentazione, circa 10 mA in un LED acceso, 45 kΩ dentro ogni piedino di ingresso. Ricordate la didascalia: dicendo che un piedino «sta a 3,3 V» si intende rispetto a massa, il riferimento comune.

## Slide 7: La legge di Ohm, e la resistenza di un LED

La legge di Ohm: la tensione ai capi di un resistore è uguale alla sua resistenza per la corrente che lo attraversa. Un circuito è un anello chiuso, e il disegno mostra il più semplice tra quelli utili: un'alimentazione, un resistore e un LED. Il LED tiene per sé circa 2 V; alla resistenza vanno i restanti 1,3 V, e così fissa la corrente. Per 10 mA servono 1,3 diviso 0,010, cioè 130 Ω, e il valore commerciale più vicino è 150 Ω. Senza la resistenza la corrente sarebbe di gran lunga troppa e il LED brucerebbe.

## Slide 8: Serie, parallelo e partitore di tensione

Due modi di collegare i resistori. In *serie* la stessa corrente attraversa entrambi e le resistenze si sommano. In *parallelo* la stessa tensione è ai capi di entrambi e la resistenza totale è minore di ciascuna. Due resistori in serie formano un *partitore di tensione*: l'uscita, presa tra i due, è l'alimentazione moltiplicata per R2 diviso R1 più R2. Con resistori uguali è metà dell'alimentazione; se R2 è molto più piccola, l'uscita è vicina a massa. Tenete a mente il partitore: spiega il pulsante alla fine della lezione.

## Slide 9: Potenza ed energia

La potenza è tensione per corrente, e in un resistore diventa calore. L'energia è potenza moltiplicata per tempo. Per il LED della slide precedente il circuito assorbe 29 mW, di cui 11 mW sono calore nella resistenza. Sono numeri minuscoli, ma l'ultima riga spiega perché contano: ogni transistor che commuta dissipa un po' di energia, e un processore ne ha miliardi. Il calore, non il numero di transistor, è il limite dei chip di oggi.

## Slide 10: Il condensatore: perché i segnali richiedono tempo

Un condensatore immagazzina carica come un serbatoio l'acqua, e la sua tensione non può cambiare all'istante: va riempito o svuotato attraverso una resistenza. Il tempo necessario è dell'ordine di R per C. Per un piedino di ingresso del kit, 45 kΩ per 2 pF fanno 90 nanosecondi. Ogni filo e ogni ingresso di transistor è un piccolo condensatore, e da qui nasce il ritardo di una porta. Un condensatore carico o scarico è anche un modo di memorizzare un bit: lo ritroverete nella lezione sulla memoria.

## Slide 11: Semiconduttori

La seconda parte riguarda il materiale. A un interruttore serve qualcosa che conduca o non conduca a comando, e il silicio è il materiale che lo rende possibile.

## Slide 12: Conduttori, isolanti, semiconduttori

I conduttori lasciano scorrere la carica; gli isolanti no. I semiconduttori stanno in mezzo, e la loro conduzione si può controllare. Il controllo si ottiene con il *drogaggio*: l'aggiunta di pochi atomi di un altro elemento. Nel silicio di tipo n ci sono elettroni in più, portatori negativi; nel silicio di tipo p ci sono elettroni mancanti, le lacune, che si comportano da portatori positivi. Dove una regione p incontra una regione n c'è una *giunzione*. Un chip è una fetta di silicio con miliardi di regioni di questo tipo, collegate da strati di metallo.

## Slide 13: Il diodo e il LED

Una giunzione fa un *diodo*, una valvola a senso unico: conduce in una direzione, quando la tensione supera una soglia di circa 0,7 V, e blocca nell'altra. Un diodo a emissione di luce, un LED, emette luce quando conduce; il colore dipende dal materiale, e così la soglia, ed è per questo che il LED della slide precedente teneva circa 2 V. In un calcolatore i LED servono da spie, da retroilluminazione dei display e nei collegamenti ottici.

## Slide 14: Il transistor: un interruttore senza parti mobili

La storia dell'interruttore senza parti mobili, in sei date. Il transistor del 1947 sostituisce la valvola termoionica. Il circuito integrato del 1958 mette più transistor su un solo pezzo di semiconduttore. Il transistor MOS del 1960 è piccolo, semplice da costruire e non richiede quasi corrente di controllo. Il CMOS, nel 1963, combina due tipi complementari così che si assorba potenza solo commutando. Nel 1971 un intero processore sta su un chip con 2300 transistor; oggi un chip ne contiene decine di miliardi.

## Slide 15: Il transistor MOS come interruttore

Un transistor MOS ha tre terminali: il *gate* controlla se la corrente può passare tra gli altri due, *source* e *drain*. I tipi sono due, e la tabella dice tutto: un nMOS conduce quando il suo gate è alto; un pMOS conduce quando il suo gate è basso. Sono complementari: ciò che chiude l'uno apre l'altro. Il gate è isolato, quindi non assorbe praticamente corrente. Un altro fatto servirà tra poco: un nMOS collega bene a massa, un pMOS collega bene all'alimentazione.

## Slide 16: Dai volt ai bit

Ora l'elettronica diventa digitale. Quattro domande: quando una tensione è un 1, perché lavorare con due soli livelli, come i transistor formano le porte, e quanto costano le porte.

## Slide 17: Livelli logici: quando una tensione è un 1?

Un circuito digitale non usa tensioni esatte: usa due intervalli. La figura li mostra per il kit. Un'uscita garantisce livelli puliti: sopra 2,64 V per un 1, sotto 0,33 V per uno 0. Un ingresso è più tollerante: legge 1 sopra 2,475 V e 0 sotto 0,825 V. La differenza tra ciò che un'uscita garantisce e ciò che un ingresso richiede è il *margine di rumore*: un disturbo più piccolo non può cambiare il bit. Tra le due soglie di ingresso il valore è indefinito, e i segnali devono attraversare quella fascia in fretta.

## Slide 18: Perché digitale?

Perché rinunciare alla ricchezza dei segnali analogici? In un circuito analogico l'informazione è il valore esatto, quindi ogni stadio aggiunge un po' di rumore, e il rumore si accumula: ogni copia è peggiore della precedente. In un circuito digitale conta solo l'intervallo, e ogni porta produce un livello fresco e pulito: il rumore non si accumula, le copie sono perfette, e gli errori si possono perfino rilevare e correggere. I circuiti analogici restano indispensabili ai bordi di un sistema, dove tocca il mondo: sensori, radio, suono.

## Slide 19: L'invertitore CMOS: una porta NOT con due transistor

La prima porta. Un pMOS collega l'uscita all'alimentazione, un nMOS la collega a massa, ed entrambi i gate sono pilotati dallo stesso ingresso. Con l'ingresso a 0 conduce il pMOS e l'uscita vale 1; con l'ingresso a 1 conduce l'nMOS e l'uscita vale 0. È un NOT. In ogni istante conduce esattamente uno dei due transistor, quindi a ingresso fermo non scorre corrente dall'alimentazione a massa: ecco perché a riposo il CMOS non consuma quasi nulla.

## Slide 20: NAND e NOR in CMOS

Due ingressi, quattro transistor. Nel NAND i due nMOS sono in serie: l'uscita raggiunge massa solo se A e B valgono entrambi 1. I due pMOS sono in parallelo: l'uscita raggiunge l'alimentazione se uno dei due ingressi vale 0. Serie è AND, parallelo è OR. Il NOR è il duale: serie e parallelo si scambiano, esattamente come le leggi di De Morgan scambiano AND e OR. Verificate voi entrambi i disegni per le quattro combinazioni degli ingressi, segnando quali transistor conducono.

## Slide 21: Quanto costano le porte, in transistor

Il costo dei circuiti in transistor. Un NOT costa 2, un NAND o un NOR 4, un AND o un OR 6, perché sono un NAND o un NOR seguito da un invertitore. Questo rovescia l'intuizione dell'algebra: in CMOS vengono prima le porte invertenti, e un AND costa più di un NAND. Un sommatore completo richiede circa 28 transistor, una cella di memoria 6, un flip-flop circa 20. Ora lo scopo della minimizzazione è concreto: meno letterali significano meno transistor, meno area, meno energia e meno tempo.

## Slide 22: Commutare costa tempo ed energia

L'uscita di una porta pilota gli ingressi di altre porte, che sono piccoli condensatori. Per cambiare livello deve caricarli o scaricarli attraverso la resistenza dei propri transistor, e questo richiede tempo: il *ritardo di propagazione*. Richiede anche energia, a ogni cambio di livello. La potenza spesa nel commutare è circa C per V al quadrato per f: la capacità, il quadrato della tensione di alimentazione, e la frequenza. Abbassare la tensione è ciò che fa risparmiare di più, ed è per questo che i chip sono passati da 5 V a circa 1 V all'interno. La velocità si paga in calore.

## Slide 23: Scale di integrazione

Il numero di transistor che stanno su un chip è cresciuto attraverso cinque scale. Integrazione a piccola scala: poche porte per chip, come quattro NAND in un contenitore. Media scala: centinaia di transistor, un decodificatore o un registro. Grande scala: migliaia, i primi microprocessori. Scala molto grande: centinaia di migliaia e oltre. Oggi, decine di miliardi: un *sistema su chip* come l'ESP32-C6 del kit, che in pochi millimetri contiene processore, memoria, radio e periferiche.

## Slide 24: Ritorno alla macchina

Tutto è pronto per spiegare, passo per passo, il pulsante del riscaldamento, e per guardare il kit come circuito elettrico.

## Slide 25: Pull-up: un ingresso mai lasciato flottante

Un ingresso collegato a nulla è *flottante*: raccoglie rumore e legge 0 o 1 a caso. Il rimedio è una resistenza di *pull-up* che lega il piedino a 3,3 V. A pulsante rilasciato non scorre corrente, e il piedino legge un 1 pulito. A pulsante premuto l'interruttore collega il piedino a massa: 0 V, uno 0 pulito, e nella resistenza scorre una corrente trascurabile di 73 microampere. È un partitore di tensione il cui resistore inferiore è o infinito o zero. Il firmware poi inverte il bit, così nel vostro programma premuto vale 1.

## Slide 26: Dal dito al bit

L'intero viaggio in sette passi. Il dito chiude l'interruttore; il piedino scende a 0 V in meno di un microsecondo; il buffer di ingresso vede una tensione sotto la sua soglia, uno 0 logico; il livello è catturato in un flip-flop; il firmware lo legge con un'istruzione di load, lo inverte e lo impacchetta con gli altri; il vostro programma lo esamina con `andi`. La colonna di destra dice dove è spiegato ogni passo: tre in questa lezione, gli altri in lezioni già seguite o da seguire. Tra un dito e un bit ci sono sette strati.

## Slide 27: Il kit come circuito

Il kit visto come circuito. Una breadboard ha fori collegati a file sul retro, così i componenti si connettono senza saldature. Due lunghe linee portano l'alimentazione, 3,3 V e massa, e una linea separata porta i 5 V per gli amplificatori audio. Ogni parte condivide la stessa massa: senza un riferimento comune le tensioni di due parti non significherebbero nulla l'una per l'altra. I pulsanti vanno da un piedino a massa; display e amplificatori ricevono segnali digitali. Mai collegare direttamente a massa un piedino pilotato alto.

## Slide 28: Verifica la comprensione: Un LED fa cadere 2 V e deve portare 5 mA da un piedino a 3,3 V. Quale resistenza serve?

Applicate la legge di Ohm alla resistenza, non all'intero circuito. La resistenza vede l'alimentazione meno ciò che tiene il LED: 3,3 meno 2. Dividete quella tensione per la corrente, in ampere: 5 mA sono 0,005 A.

## Slide 29: Verifica la comprensione: In un invertitore CMOS con l'ingresso a 0:

Con l'ingresso a 0, quale dei due transistor ha il gate al livello che lo fa condurre? Un pMOS conduce con il gate basso, ed è quello collegato all'alimentazione. I due non conducono mai insieme, e l'uscita non resta mai scollegata.

## Slide 30: Verifica la comprensione: Quanti transistor richiede un AND a due ingressi in CMOS statico?

In CMOS un AND non si costruisce direttamente: è un NAND seguito da un invertitore. Sommate i transistor dei due.

## Slide 31: Verifica la comprensione: Perché l'ingresso del pulsante del kit ha bisogno di una resistenza di pull-up?

Pensate al pulsante rilasciato: il piedino non è collegato a nulla. Che cosa leggerebbe? Il pull-up non ha nulla a che vedere con il LED, con la velocità o con la protezione: dà all'ingresso un livello definito quando l'interruttore è aperto.

## Slide 32: Esercizi: prima su carta, poi sul kit

Cinque esercizi. Dimensionate la resistenza di un LED blu e calcolate la potenza che dissipa. Calcolate l'uscita di un partitore e dite come la leggerebbe un ingresso del kit: confrontatela con le due soglie. Disegnate un NAND a tre ingressi e contate i transistor. Verificate il NOR sul disegno. E sul kit, con la cartuccia delle lampade in esecuzione, collegate a massa con un filo il piedino di un pulsante: spiegate ciò che vedete, e che cosa accadrebbe senza il pull-up.

## Slide 33: Glossario: inglese e italiano

Quattordici termini. Notate due falsi amici: *voltage* è la tensione, e *ground* è la massa. *Capacitor* è il condensatore. *Gate*, *source* e *drain* non si traducono. *Noise margin* è il margine di rumore, e *floating input* è l'ingresso flottante.

## Slide 34: Conclusioni e letture

Cinque conclusioni. La tensione spinge, la corrente scorre, la resistenza ostacola, e la legge di Ohm copre quasi tutto ciò che serve a un progettista digitale. Un transistor MOS è un interruttore comandato da una tensione, in due tipi complementari. Un bit è un intervallo di tensioni, reso affidabile dai margini di rumore e dalla rigenerazione dei livelli. Le porte CMOS sono coppie di reti di interruttori, e quelle invertenti sono le più economiche. Commutare costa tempo ed energia. La prossima lezione costruisce macchine con queste porte.
