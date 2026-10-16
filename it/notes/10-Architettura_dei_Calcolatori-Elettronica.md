# Lezione 10: Introduzione all'elettronica e all'elettronica digitale

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: gli ingressi con pull-up; tensione, corrente, legge di Ohm; il transistor come interruttore; dai volt ai bit; le porte CMOS. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: il clock (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Introduzione all'elettronica e all'elettronica digitale

Finora una porta è stata un simbolo e una tavola di verità; questa lezione le dà un corpo fisico. Segue un solo bit, quello di un pulsante del kit, dal dito che lo preme al registro che il programma legge, spiegando lungo il percorso che cos'è un volt, che cosa fa un transistor e come due transistor formano una porta NOT. Non si presuppone alcuna conoscenza di fisica. La citazione di Arthur C. Clarke nomina l'impressione che la lezione si propone di dissipare: un chip sembra magia solo finché non si vede di che cosa è fatto.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Applicare le quattro grandezze elettriche e la legge di Ohm a un circuito semplice. Dimensionare la resistenza di un LED e calcolare un partitore di tensione. Spiegare che cos'è un transistor e come un transistor MOS funziona da interruttore. Dire come una tensione diventa un valore logico, e che cos'è un margine di rumore. Disegnare l'invertitore, il NAND e il NOR CMOS e contarne i transistor. E spiegare le resistenze di pull-up, gli ingressi flottanti, e perché la commutazione di una porta costa tempo ed energia.

## Slide 3: Quattro grandezze

Quattro grandezze, introdotte con l'analogia dell'acqua nei tubi. La *tensione* è la pressione che spinge il flusso; si misura in volt ed è sempre definita tra due punti. La *corrente* è il flusso, in ampere. La *resistenza* è l'opposizione al flusso, in ohm. La *potenza* è il lavoro compiuto al secondo, in watt. L'ultima colonna lega ciascuna al kit: un'alimentazione di 3,3 V, circa 10 mA in un LED acceso, 45 kΩ dentro ogni piedino di ingresso. La didascalia fissa una convenzione: dire che un piedino "è a 3,3 V" significa 3,3 V rispetto alla massa, il riferimento comune.

## Slide 4: La legge di Ohm, e la resistenza di un LED

La legge di Ohm: la tensione ai capi di una resistenza è uguale alla resistenza moltiplicata per la corrente che la attraversa. Un circuito è un anello chiuso, e il disegno mostra il più semplice di quelli utili: un'alimentazione, una resistenza e un LED. Il LED trattiene ai suoi capi circa 2 V; la resistenza prende gli 1,3 V restanti e determina così la corrente. Per 10 mA la resistenza deve valere 1,3 / 0,010 = 130 Ω, e il valore standard più vicino è 150 Ω, che sbaglia nel senso di una corrente minore. Senza resistenza la corrente sarebbe limitata solo dall'alimentazione e il LED si distruggerebbe.

## Slide 5: Serie, parallelo e partitore di tensione

Due modi di combinare le resistenze. In *serie* la stessa corrente attraversa entrambe e le resistenze si sommano. In *parallelo* la stessa tensione è applicata a entrambe e la resistenza complessiva è minore di ciascuna. Due resistenze in serie formano un *partitore di tensione*: l'uscita, presa nel loro punto di unione, è uguale all'alimentazione moltiplicata per R2/(R1 + R2). Con resistenze uguali è metà dell'alimentazione; se R2 è molto minore di R1, l'uscita si avvicina alla massa. Il partitore va tenuto a mente, perché spiega il circuito del pulsante alla fine della lezione.

## Slide 6: Il condensatore: perché i segnali richiedono tempo

Un condensatore immagazzina carica come un serbatoio immagazzina acqua, e la sua tensione non può cambiare istantaneamente: deve essere caricato o scaricato attraverso una resistenza. Il tempo necessario è dell'ordine di R per C, la costante di tempo; dopo una costante di tempo la tensione ha percorso circa il 63% della sua escursione. Per un piedino di ingresso del kit, 45 kΩ per 2 pF danno 90 nanosecondi. Ogni filo e ogni ingresso di transistor si comporta come un piccolo condensatore, ed è questa l'origine fisica del ritardo delle porte. Un condensatore carico o scarico è anche un modo per memorizzare un bit, come mostra la cella DRAM della Lezione 15.

## Slide 7: Conduttori, isolanti, semiconduttori

I conduttori permettono il flusso della carica; gli isolanti lo impediscono. I semiconduttori stanno tra i due, e la loro conducibilità si può controllare. Il controllo si ottiene con il *drogaggio*: l'introduzione di un piccolo numero di atomi di un altro elemento. Nel silicio di tipo n c'è un eccesso di elettroni, che fanno da portatori negativi; nel silicio di tipo p c'è un difetto di elettroni, detti lacune, che si comportano come portatori positivi. Dove una regione p incontra una regione n si forma una *giunzione*. Un chip è una fetta di silicio con miliardi di tali regioni, interconnesse da strati di metallo.

## Slide 8: Il transistor: un interruttore senza parti mobili

La storia dell'interruttore senza parti in movimento, in sei date. Il transistor del 1947 sostituisce la valvola termoionica. Il circuito integrato del 1958 colloca più transistor su un solo pezzo di semiconduttore. Il transistor MOS del 1960 è piccolo, semplice da fabbricare e non richiede quasi corrente di comando. Il CMOS, nel 1963, combina due tipi complementari così che la potenza si consumi sostanzialmente solo durante la commutazione. Nel 1971 un processore completo sta su un chip con 2.300 transistor; un chip contemporaneo ne contiene decine di miliardi.

## Slide 9: Il transistor MOS come interruttore

Un transistor MOS ha tre terminali: il *gate* controlla se la corrente può passare tra gli altri due, il *source* e il *drain*. Esistono due tipi, e la tabella contiene tutto ciò che serve: un nMOS conduce quando il suo gate è alto, un pMOS quando il suo gate è basso. Sono complementari, perché la tensione che chiude l'uno apre l'altro. Il gate è isolato e non assorbe praticamente corrente. Servirà tra poco un fatto ulteriore: un nMOS è efficace nel collegare un nodo alla massa, un pMOS nel collegarlo all'alimentazione.

## Slide 10: Livelli logici: quando una tensione è un 1?

Un circuito digitale non usa tensioni esatte ma due intervalli, mostrati nella figura per il kit. Un'uscita garantisce livelli puliti: sopra 2,64 V per un 1, sotto 0,33 V per uno 0. Un ingresso è più tollerante: legge 1 sopra 2,475 V e 0 sotto 0,825 V. La differenza tra ciò che un'uscita garantisce e ciò che un ingresso richiede è il *margine di rumore*: un disturbo minore del margine non può alterare il bit. Tra le due soglie di ingresso il valore logico non è definito, e i segnali devono attraversare quella fascia rapidamente.

## Slide 11: Perché digitale?

Perché rinunciare alla ricchezza dei segnali analogici? In un circuito analogico il valore esatto è l'informazione, quindi ogni stadio aggiunge un po' di rumore e il rumore si accumula: ogni copia è peggiore della precedente. In un circuito digitale conta solo l'intervallo, e ogni porta rigenera un livello nuovo e pulito: il rumore non si accumula, le copie sono perfette, e gli errori si possono persino rilevare e correggere, come mostra la Lezione 11 con la parità. I circuiti analogici restano indispensabili ai confini di un sistema, dove esso incontra il mondo fisico: sensori, radio, suono.

## Slide 12: L'invertitore CMOS: una porta NOT con due transistor

La prima porta. Un pMOS collega l'uscita all'alimentazione, un nMOS la collega alla massa, ed entrambi i gate sono pilotati dallo stesso ingresso. Con l'ingresso a 0 il pMOS conduce e l'uscita vale 1; con l'ingresso a 1 conduce l'nMOS e l'uscita vale 0. Il circuito è un NOT. Con un ingresso stabile conduce esattamente uno dei due transistor, quindi a riposo non scorre corrente dall'alimentazione alla massa: è per questo che il CMOS consuma una potenza statica quasi nulla, e la ragione della sua adozione universale.

## Slide 13: NAND e NOR in CMOS

Due ingressi, quattro transistor. Nel NAND i due nMOS sono in serie: l'uscita è collegata alla massa solo se A e B valgono entrambi 1. I due pMOS sono in parallelo: l'uscita è collegata all'alimentazione se uno qualsiasi degli ingressi vale 0. La serie realizza l'AND, il parallelo l'OR. Il NOR è il circuito duale, con serie e parallelo scambiati, esattamente come le leggi di De Morgan scambiano AND e OR. Entrambi i disegni vanno verificati per le quattro combinazioni degli ingressi, segnando in ciascun caso quali transistor conducono.

## Slide 14: Quanto costano le porte, in transistor

Il costo dei circuiti misurato in transistor. Un NOT costa 2, un NAND o un NOR 4, un AND o un OR 6, perché ciascuno è un NAND o un NOR seguito da un invertitore. Questo rovescia l'intuizione suggerita dall'algebra: in CMOS le porte invertenti sono quelle primitive, e un AND costa più di un NAND. Un sommatore completo richiede circa 28 transistor, una cella di memoria 6, un flip-flop, l'elemento di memoria da un bit della Lezione 13, circa 20. Lo scopo della minimizzazione diventa ora concreto: meno letterali significano meno transistor, e quindi meno area, meno energia e meno ritardo.

## Slide 15: Commutare costa tempo ed energia

L'uscita di una porta pilota gli ingressi di altre porte, che sono piccoli condensatori. Per cambiare livello deve caricarli o scaricarli attraverso la resistenza dei propri transistor, il che richiede tempo, il *ritardo di propagazione*, ed energia, a ogni transizione. La potenza dinamica è approssimativamente C per V^2 per f: capacità, quadrato della tensione di alimentazione e frequenza di commutazione. Ridurre la tensione dà il risparmio maggiore, ed è per questo che le tensioni di alimentazione interne sono scese da 5 V a circa 1 V. La velocità si paga in calore. Il ritardo di propagazione ricompare nella Lezione 11 come cammino critico e nella Lezione 13 come ragione del clock.

## Slide 16: Pull-up: un ingresso mai lasciato flottante

Un ingresso collegato a nulla è *flottante*: raccoglie rumore e legge 0 o 1 in modo imprevedibile. Il rimedio è una resistenza di *pull-up* che lega il piedino a 3,3 V. Con il pulsante rilasciato non scorre corrente, e il piedino legge un 1 pulito. Con il pulsante premuto l'interruttore collega il piedino alla massa: 0 V, uno 0 pulito, mentre nella resistenza scorre una corrente trascurabile di 73 microampere. Il circuito è un partitore di tensione la cui resistenza inferiore è o infinita o nulla. Il firmware poi inverte il bit, così che nel programma "premuto" si legge 1. Il riscaldamento è così spiegato per intero.

## Slide 17: Verifica la comprensione: Un LED fa cadere 2 V e deve portare 5 mA da un piedino a 3,3 V. Quale resistenza serve? / In un invertitore CMOS con l'ingresso a 0:

Per la prima domanda la legge di Ohm si applica alla sola resistenza, non all'intero circuito. La resistenza vede l'alimentazione meno ciò che il LED trattiene, 3,3 - 2 V, e quella tensione si divide per la corrente espressa in ampere: 5 mA è 0,005 A.

Per la seconda ci si chiede quale dei due transistor ha il gate al livello che lo fa condurre quando l'ingresso vale 0. Un pMOS conduce con il gate basso, ed è quello collegato all'alimentazione. I due transistor non conducono mai insieme, e l'uscita non resta mai scollegata.

## Slide 18: Verifica la comprensione: Quanti transistor richiede un AND a due ingressi in CMOS statico? / Perché l'ingresso del pulsante del kit ha bisogno di una resistenza di pull-up?

Per la prima domanda: in CMOS un AND non si costruisce direttamente ma come un NAND seguito da un invertitore, quindi si sommano i transistor dei due.

Per la seconda si considera il pulsante rilasciato: il piedino è allora collegato a nulla. Che cosa leggerebbe? Il pull-up non ha a che fare con il LED, con la velocità o con la protezione: dà all'ingresso un livello definito quando l'interruttore è aperto.

## Slide 19: Glossario: inglese e italiano

Quattordici termini. Due falsi amici meritano attenzione: *voltage* in italiano è *tensione*, e *ground* è *massa*. Un *capacitor* è un *condensatore*. *Gate*, *source* e *drain* non si traducono. Il *noise margin* è il *margine di rumore*, e un *floating input* è un *ingresso flottante*.

## Slide 20: Conclusioni e letture

Cinque conclusioni. La tensione spinge, la corrente scorre, la resistenza si oppone, e la legge di Ohm copre gran parte di ciò che serve a un progettista digitale. Un transistor MOS è un interruttore comandato in tensione, disponibile in due tipi complementari. Un bit è un intervallo di tensioni, reso affidabile dai margini di rumore e dalla rigenerazione dei livelli a ogni porta. Le porte CMOS sono coppie di reti di interruttori complementari, e le porte invertenti sono le più economiche. La commutazione costa tempo ed energia. La prossima lezione costruisce con queste porte delle macchine funzionali.
