# Lezione 11: Macchine combinatorie

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: i multiplexer; le reti combinatorie; i codici; decoder ed encoder; comparatori e parità; l'ALU. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: macchine a stati finiti (Lezione 13). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) distinguere una macchina combinatoria da una sequenziale; (2) usare decodificatori, multiplexer, comparatori e parità; (3) spiegare l'ALU come unità in parallelo e un multiplexer. Si appoggia su: solo ciò che ha preparato la Lezione 01. Prossimo passo: Lezione 12, Verm1, parte 2: la guida, il cibo e un punteggio.

Ponte. Nella Lezione 02 un'istruzione era un numero a 32 bit, e il processore in qualche modo sapeva che cosa farne. Oggi un decodificatore legge un campo di quel numero, funct3, e pilota il multiplexer che sceglie il risultato dell'ALU. La Lezione 19 descrive tutti i campi e il ciclo di prelievo, decodifica, esecuzione. Richiamo: Quale parte della parola di un'istruzione dice all'ALU di sommare invece di calcolare un AND?

Il filo della lezione: L'ALU che ha eseguito ogni add finora è una grande macchina combinatoria: molti risultati calcolati insieme, uno scelto. Prossimo passo: questi circuiti al lavoro nella seconda parte di Verm1.

## Slide 1: Macchine combinatorie

Le lezioni precedenti hanno fornito le porte e un metodo per combinarle. Questa è un catalogo delle macchine combinatorie standard con cui i progettisti costruiscono davvero i sistemi: decoder, encoder, multiplexer, comparatori, reti di parità, e infine l'unità aritmetico-logica. Per ciascuna la lezione stabilisce che cosa calcola, come si costruisce e dove si trova dentro un processore RISC-V. Il giovane Turing della citazione pretende che carote e piselli restino separati; anche questa lezione parla di tenere distinti i segnali e di scegliere tra di essi.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento. Distinguere una macchina combinatoria da una sequenziale. Calcolare il numero di bit che un codice richiede, e riconoscere codici incompleti e ridondanti. Progettare un decoder e un encoder, e spiegare che cosa fa un transcodificatore. Spiegare multiplexer e demultiplexer e costruirli con le porte. Costruire un comparatore e una rete di parità, con chiaro che cosa un controllo di parità può e non può rilevare. E collocare ciascuna di queste macchine dentro il processore.

## Slide 3: Una tassonomia dei circuiti digitali

I circuiti digitali si dividono in due classi. In un circuito *combinatorio* le uscite in un dato istante dipendono solo dagli ingressi in quello stesso istante: non c'è né memoria né retroazione, e una tavola di verità descrive completamente il circuito. In un circuito *sequenziale* le uscite dipendono anche dalla storia degli ingressi, quindi servono le nozioni di tempo e di stato. Sommatori, decoder e multiplexer sono combinatori; flip-flop, registri e il processore nel suo insieme sono sequenziali, e sono l'argomento della Lezione 13.

## Slide 4: Le porte reali richiedono tempo

Una porta fisica non risponde istantaneamente: la sua uscita si assesta dopo un *ritardo di propagazione*, la cui origine è stata spiegata nella Lezione 10. Il ritardo di una rete è quello del suo cammino più lento da un ingresso a un'uscita, il *cammino critico*. Mentre i segnali si propagano, le uscite possono essere temporaneamente errate. Una macchina combinatoria è quindi corretta solo dopo essersi assestata, e qualche meccanismo deve indicare quando le sue uscite si possono campionare. Quel meccanismo è il clock, e con esso comincia lo studio delle macchine sequenziali.

## Slide 5: Codici a lunghezza fissa

Un *codice* associa a ogni elemento di un insieme di N elementi una stringa di simboli, la sua *parola di codice*. In un codice a lunghezza fissa ogni parola ha la stessa lunghezza m. Con un alfabeto di k simboli ci sono k^m parole, quindi m deve essere almeno il logaritmo in base k di N, arrotondato per eccesso. In binario quattordici elementi richiedono 4 bit, e i 32 registri di RISC-V ne richiedono esattamente 5, ed è per questo che ogni campo registro di un'istruzione è largo cinque bit. Quando N non è una potenza di due alcune parole restano inutilizzate, e il codice è *incompleto*.

## Slide 6: Un codice incompleto: il decimale codificato in binario

Il classico codice incompleto: le cifre decimali su quattro bit. Nel BCD 8421 ogni cifra è semplicemente il suo valore in binario; nell'eccesso 3 il valore è aumentato di tre. Dieci cifre richiedono quattro bit, e quattro bit danno sedici parole, quindi sei non si usano mai: nel BCD, le parole da 1010 a 1111. La didascalia ne trae la conseguenza di progetto: in un circuito che riceve cifre BCD quelle sei parole sono condizioni di indifferenza, e sfruttarle semplifica il circuito.

## Slide 7: Codici ridondanti

Un codice *ridondante* usa più bit del minimo, così che solo alcune delle parole possibili siano lecite. L'arrivo di una parola non lecita rivela che qualcosa l'ha alterata in transito, e l'errore viene rilevato. I due codici della tabella lo mostrano. Nel Codice 1 ogni parola di 2 bit è lecita, quindi un bit alterato trasforma un elemento in un altro e l'errore passa inosservato. Il Codice 2 aggiunge un terzo bit che rende pari il numero di 1, quindi ogni singolo bit alterato produce una parola non lecita. La ridondanza è il prezzo della rilevazione degli errori.

## Slide 8: La rappresentazione decodificata

Nella rappresentazione *decodificata* ci sono tanti bit quanti elementi, ed esattamente uno di essi vale 1: una linea per elemento, uno schema detto anche one-hot. È costosa in fili ma immediatamente utilizzabile, perché la linea attiva può abilitare direttamente l'azione corrispondente. Il principio di progetto è enunciato nell'ultima riga: l'informazione si tiene in un codice compatto dentro una parola, e la si decodifica solo nel punto in cui una scelta deve tradursi in azione. La parola dei pulsanti della Lezione 08 è un esempio della forma decodificata.

## Slide 9: Il decodificatore

Un *decoder* riceve una parola di codice di m bit e attiva l'unica uscita, tra 2^m, che le corrisponde. La tabella e il circuito mostrano il decoder da 2 a 4: ogni uscita è un mintermine dei due ingressi, costruito con una porta AND e invertitori dove servono. Un decoder genera quindi tutti i mintermini dei suoi ingressi, e con una porta OR può perciò realizzare qualsiasi loro funzione. Un ingresso di *enable*, quando vale 0, tiene a 0 tutte le uscite; è la chiave per comporre piccoli decoder in decoder più grandi.

## Slide 10: Il codificatore

L'*encoder* è la macchina inversa: riceve N linee, di cui una attiva, e produce l'indice della linea attiva come parola di codice di m bit. Ogni bit di uscita è l'OR delle linee di ingresso il cui indice ha 1 in quella posizione. Se più linee possono essere attive contemporaneamente serve un *encoder a priorità*, che produce l'indice della linea attiva più importante. Il problema che risolve, scegliere tra richieste simultanee, ricompare nella Lezione 19, dove le interruzioni sono ordinate per priorità.

## Slide 11: Transcodificatori: il display a sette segmenti

Un *transcodificatore* converte una parola di un codice nella parola corrispondente di un altro. L'esempio è il display a sette segmenti: l'ingresso è una cifra BCD, e le uscite sono le sette linee, da a a g, che accendono i segmenti. La tabella dà, per ogni cifra, i segmenti accesi: la cifra 2 accende a, b, g, e e d. Ci sono sette uscite, quindi sette funzioni di quattro variabili da sintetizzare, ciascuna con sei condizioni di indifferenza che le mappe di Karnaugh della Lezione 09 possono sfruttare.

## Slide 12: Il multiplexer

Un *multiplexer* ha 2^n ingressi di dato, n linee di selezione e un'uscita: instrada verso l'uscita l'ingresso designato dalle linee di selezione. La formula mostra come: ogni ingresso di dato è moltiplicato per un mintermine delle linee di selezione, e i prodotti si sommano. Con due ingressi, Y = S'I0 + S I1: quando S vale 0 il primo termine lascia passare I0, quando S vale 1 il secondo lascia passare I1. Il disegno realizza direttamente questa formula in porte. È la macchina che il riscaldamento ha realizzato in software.

## Slide 13: Il demultiplexer

Il *demultiplexer* è l'inverso: un ingresso di dato, n linee di selezione e 2^n uscite. L'ingresso viene instradato all'uscita designata dalle linee di selezione, mentre le altre uscite restano a 0. Con l'ingresso di dato fisso a 1, un demultiplexer è esattamente un decoder. Un multiplexer a un capo di un filo e un demultiplexer all'altro permettono a molti segnali di condividere quel filo, uno alla volta: il principio alla base di ogni linea condivisa, compresi i bus della Lezione 14.

## Slide 14: Il comparatore

Un *comparatore* riceve due parole e produce un solo bit, 1 quando sono uguali. Due bit sono uguali quando il loro XNOR vale 1; due parole sono uguali quando tutte le coppie di bit corrispondenti sono uguali, quindi il comparatore è un AND di XNOR. Il disegno mostra il caso a due bit. Nel processore il comparatore decide i salti `beq` e `bne`: i due registri vengono confrontati, e il salto si esegue o no a seconda del risultato.

## Slide 15: Parità

Il codice ridondante più semplice aggiunge a ogni parola un *bit di parità*, scelto così che il numero totale di 1 sia, per esempio, pari. Il circuito che lo calcola è una *rete di parità*, un albero di porte XOR: lo XOR di tutti i bit di una parola vale 1 quando il numero di 1 è dispari, perché lo XOR è la somma modulo 2. La stessa rete si usa due volte: dal mittente, per calcolare il bit da aggiungere, e dal destinatario, per verificare la parità di ciò che è arrivato.

## Slide 16: La ALU è un insieme di macchine e un multiplexer

La ALU riceve due parole, A e B. Al suo interno più unità operano contemporaneamente sugli stessi operandi: un sommatore che sottrae anche, una fila di porte AND, una fila di porte OR, una fila di porte XOR, un circuito di scorrimento. Ciascuna produce un risultato, e un multiplexer ne passa uno all'uscita, con le linee di selezione pilotate da un decoder che legge l'istruzione. Non c'è memoria da nessuna parte: la ALU è una grande macchina combinatoria, e il suo cammino più lento, la catena dei riporti del sommatore, limita la frequenza di clock del processore. Il catalogo della lezione converge così nel cuore del percorso dei dati.

## Slide 17: Verifica la comprensione: Quanti bit richiede un codice binario a lunghezza fissa per le 26 lettere dell'alfabeto? / Un decodificatore ha 3 linee di ingresso e nessuna abilitazione. Quante uscite ha, e quante valgono 1 in ogni istante?

Per la prima domanda vale la formula della lunghezza fissa: il più piccolo m tale che 2^m sia almeno 26. Quattro bit danno sedici parole, che non bastano; il risultato lascia anche alcune parole inutilizzate, rendendo il codice incompleto.

Per la seconda, un decoder con m ingressi ha 2^m uscite, e la sua uscita è in rappresentazione decodificata: è attiva esattamente una linea alla volta.

## Slide 18: Verifica la comprensione: Di quante linee di selezione ha bisogno un multiplexer con 8 ingressi dati? / Una parola con un bit di parità pari viene ricevuta con due bit alterati. Il controllo di parità:

Per la prima domanda la relazione è l'inversa della precedente: n linee di selezione scelgono tra 2^n ingressi, e otto è 2^3.

Per la seconda si contano gli 1. Un controllo di parità sa solo se il loro numero è pari o dispari. Alterare un bit cambia la parità; alterarne due la cambia due volte, ripristinandola. Il controllo rileva quindi ogni errore su un singolo bit e nessun errore su due bit.

## Slide 19: Glossario: inglese e italiano

Dodici termini. L'*enable* è l'ingresso che attiva o disattiva un blocco. Una *parola di codice* è ogni stringa di un codice. *Multiplexer* e *demultiplexer* conservano il loro nome in italiano. Un *transcodificatore* converte tra due codici. Il *bit di parità* è il bit ridondante aggiunto per il controllo.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Un codice scrive ogni elemento di un insieme come stringa di simboli, la sua parola di codice. Un codice binario a lunghezza fissa richiede log2 N bit arrotondato per eccesso, e un codice ridondante spende bit in più per rilevare errori. Codifica, decodifica e transcodifica sono svolte da macchine combinatorie. I multiplexer scelgono una sorgente, i demultiplexer una destinazione, mentre comparatori e reti di parità verificano. Il processore le impiega tutte. A queste macchine manca la memoria: dopo la Parte 2 di Verm1, la Lezione 13 la fornisce.
