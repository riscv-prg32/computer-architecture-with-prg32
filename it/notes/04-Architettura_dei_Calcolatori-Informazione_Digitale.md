# Lezione 04: Rappresentare l'informazione digitale

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Rappresentare l'informazione digitale

Nella Lezione 02 avete battuto 0x07e0, 255, `.asciz` e `.word` senza sapere esattamente che cosa fossero. Questa lezione dà loro un nome. La tesi sta nel sottotitolo: dentro la macchina tutto è una configurazione di bit, che si tratti di un numero, di un colore, di una lettera o di un elenco. La lezione è ampia più che profonda: i numeri sono trattati formalmente nelle due lezioni successive; qui imparate a leggere i bit e a vedere che il loro significato è questione di accordi.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi, dal generale al particolare e ritorno. Saprete distinguere analogico e digitale, leggere un byte in binario e in esadecimale, scomporre un colore PRG32 nei suoi tre campi, dire come si memorizza il testo, e descrivere come un vettore sta in memoria e come l'assembly ne raggiunge un elemento. L'ultimo obiettivo guarda oltre la macchina: che cos'è un algoritmo, quando è deterministico, e dove si colloca il machine learning.

## Slide 3: Informazione analogica e digitale

Una grandezza *analogica* varia con continuità, come una tensione o le lancette di un orologio. Una grandezza *digitale* è una sequenza di simboli presi da un alfabeto finito, come le cifre di un display. Nella figura la curva liscia è il segnale analogico; la scalinata è la sua versione digitale, ottenuta *campionando* a istanti regolari e *quantizzando* ogni campione su uno di pochi livelli. Qualcosa si perde, e qualcosa si guadagna: un numero finito di livelli si può contare, copiare senza errori e controllare. Con due soli livelli il simbolo è il bit.

## Slide 4: Bit, byte, parola

Le unità dell'informazione, ciascuna legata a qualcosa che avete usato. Un *bit* è un pulsante. Un *nibble*, quattro bit, è una cifra esadecimale. Un *byte*, otto bit, è un carattere ASCII, ed è la ragione per cui la barra della Lezione 02 era larga al massimo 255. Una *halfword*, sedici bit, è un colore. Una *word*, o parola, trentadue bit, è un registro e un'istruzione. La regola da ricordare: n bit danno 2 alla n configurazioni. E la didascalia: che cosa significa una configurazione non è scritto nei bit.

## Slide 5: Contare in base 2 e in base 16

Sedici righe da imparare a memoria, come un tempo le tabelline. Ogni riga dà lo stesso numero in decimale, in binario su quattro bit e in esadecimale con una cifra. Le quattro colonne binarie pesano 8, 4, 2 e 1: 1011 è 8 + 2 + 1 = 11, che l'esadecimale scrive B. Dopo il 9 le cifre esadecimali proseguono con le lettere da A a F per i valori da dieci a quindici. Coprite due colonne e ricostruitele dalla terza finché non vi serve più pensarci.

## Slide 6: Notazione posizionale: che cosa significa 11011001

In un sistema posizionale una cifra vale il suo valore per il peso della sua posizione, e i pesi sono le potenze della base. La slide legge così il byte 11011001: le posizioni pesano 128, 64, 32, 16, 8, 4, 2 e 1; dove il bit è 1 il peso si somma, dove è 0 no. La somma è 128 + 64 + 16 + 8 + 1 = 217. È esattamente ciò che fate in base dieci senza accorgervene: 217 sono 2 centinaia, 1 decina e 7 unità.

## Slide 7: Perché i programmatori scrivono in esadecimale

Sedici è due alla quarta, quindi una cifra esadecimale corrisponde esattamente a quattro bit. Per convertire si taglia il numero binario in gruppi di quattro a partire da destra e si sostituisce ogni gruppo usando la tabella: 0000 0111 1110 0000 diventa 0, 7, E, 0. Non serve alcun calcolo. Per questo i programmatori usano l'esadecimale: è il binario scritto in modo compatto. Un registro sono otto cifre esadecimali invece di trentadue bit. Il prefisso `0x` annuncia che un numero è esadecimale.

## Slide 8: Un colore è un numero: RGB565

Qui si apre il verde della Lezione 02. Un colore PRG32 sono sedici bit divisi in tre campi: cinque bit di rosso, sei di verde, cinque di blu. Il formato si chiama RGB565. In 0x07E0 il campo rosso è 00000, il campo verde è 111111 e il campo blu è 00000: verde al massimo e nient'altro. Gli otto campioni mostrano altre combinazioni: il giallo è rosso più verde, il bianco è tutto. La frase in fondo è la lezione dell'intera lezione: gli stessi sedici bit potrebbero essere tutt'altro.

## Slide 9: ASCII: un carattere, un byte

L'ASCII assegna un numero a ogni carattere e lo fa stare in un byte. Tre osservazioni dalla tabella. La A maiuscola è 65 e la a minuscola è 97: differiscono di 32, cioè di un solo bit. Il carattere «0» è 48, non zero: una cifra battuta sulla tastiera non è ancora un numero. E ci sono caratteri che non si stampano: l'a capo, 10, e NUL, 0, che incontrerete nella prossima slide come fine di una stringa.

## Slide 10: Stringhe: una sequenza di caratteri in memoria

Una stringa è una sequenza di codici di carattere in byte consecutivi. Il problema è sapere dove finisce. La convenzione del C segna la fine con un byte a zero; quella del Pascal scrive prima la lunghezza. La terza riga è la vostra stringa della Lezione 02: `.asciz` memorizza gli undici caratteri di HELLO PRG32 seguiti da uno zero, dodici byte in tutto. La funzione che disegna il testo riceve solo l'indirizzo del primo byte e legge finché non trova lo zero. Se lo zero mancasse, proseguirebbe con ciò che segue in memoria.

## Slide 11: Unicode e UTF-8: ogni sistema di scrittura

L'ASCII ha 128 caratteri, sufficienti solo per l'inglese. Unicode assegna un numero, detto *code point*, a ogni carattere di ogni sistema di scrittura. UTF-8 memorizza quel numero in uno-quattro byte: i caratteri dell'ASCII conservano il loro unico byte, una lettera accentata ne prende due, il simbolo dell'euro tre, un'emoji quattro. Due conseguenze. Il testo ASCII puro è già UTF-8 valido. E la lunghezza di una stringa in byte non è più la sua lunghezza in caratteri.

## Slide 12: Ordine dei byte: little-endian

Una parola sono quattro byte, e la memoria ha un indirizzo per ogni byte: in che ordine si memorizzano i quattro byte? RISC-V è *little-endian*: il byte meno significativo va all'indirizzo più basso, quindi 0x12345678 si memorizza come 78, 56, 34, 12. L'ordine opposto, *big-endian*, è quello dei protocolli di rete. Di solito non ci si accorge di nulla, perché `lw` e `sw` sono coerenti tra loro. Ci si accorge quando si guarda la memoria byte per byte in un debugger, o si scambiano dati con una macchina diversa.

## Slide 13: Cinque modi di organizzare i dati

Cinque strutture. Un *vettore* tiene elementi dello stesso tipo uno dopo l'altro e li raggiunge per indice. Una *lista* collega ogni elemento al successivo: facile da modificare, lenta da percorrere fino a una posizione. Una *pila* restituisce per primo ciò che è stato messo per ultimo; ne avete usata una nella Lezione 02 per salvare `ra`. Un *dizionario* associa chiavi a valori. Un *albero* è una gerarchia. Il sesto riquadro è quello che conta per questo corso: nella macchina sono tutti byte in memoria, più una regola per trovare l'elemento successivo.

## Slide 14: Algoritmi e calcolabilità

Un problema è *calcolabile* se un algoritmo può risolverlo. La macchina di Turing è il modello matematico di un calcolatore con un programma; la macchina di von Neumann è l'architettura che la realizza in hardware. L'ultima riga è quella sorprendente: esistono problemi che nessun algoritmo può risolvere, e quindi che nessun calcolatore risolverà mai, per quanto veloce. L'esempio classico è decidere, per un programma qualsiasi, se si fermerà.

## Slide 15: Algoritmi deterministici e non deterministici

In un algoritmo *deterministico* lo stesso ingresso produce sempre la stessa sequenza di passi e lo stesso risultato: `first_update` somma sempre uno. Un algoritmo *non deterministico* può comportarsi in modo diverso a ogni esecuzione con lo stesso ingresso. Le ragioni comuni sono due: usa di proposito numeri casuali, come un gioco che piazza un nemico a caso, oppure dipende dai tempi di più cose che accadono insieme. Il primo tipo è utile; il secondo è una fonte frequente di bug.

## Slide 16: Machine learning

Un programma classico è una funzione scritta da una persona: y = f(x). Nel *machine learning* la funzione non viene scritta: è costruita automaticamente a partire da esempi. I modelli generativi di oggi sono questa idea su scala enorme, con miliardi di numeri appresi. Due osservazioni la collegano a questo corso. Quei numeri sono bit in memoria, moltiplicati e sommati da processori. E un modello può sbagliare con grande sicurezza: solo chi conosce i fondamenti può controllare ciò che dice.

## Slide 17: Verifica la comprensione: Quanti valori diversi può rappresentare un byte? / Il colore PRG32 0xF81F è:

Applicate la regola per cui n bit danno 2 alla n configurazioni. Un byte ha otto bit. Attenzione ai due quasi-giusti: 8 è il numero dei bit, e 255 è il più grande numero naturale che un byte può contenere, non il numero dei valori, perché conta anche lo zero.

Scrivete in binario le quattro cifre esadecimali: F è 1111, 8 è 1000, 1 è 0001, F è 1111. Poi tagliate i sedici bit in 5, 6 e 5: rosso 11111, verde 000000, blu 11111. Rosso e blu al massimo, niente verde.

## Slide 18: Verifica la comprensione: Quanti byte occupa in memoria .asciz "CIAO"? / Su RISC-V, .word 0x0000ABCD è memorizzata all'indirizzo A. Quale byte si trova all'indirizzo A?

Contate i caratteri e ricordate che cosa aggiunge la z di `.asciz`. La direttiva memorizza la stringa *terminata da zero*: un byte in più dei caratteri visibili.

RISC-V è little-endian. Scrivete la parola come quattro byte, 00 00 AB CD, dal più al meno significativo, e chiedetevi quale va all'indirizzo più basso. La trappola è 0x00, che sarebbe giusta su una macchina big-endian.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Word* è la *parola*, e su RV32 significa trentadue bit. *Sampling* e *quantisation*, campionamento e quantizzazione, sono le due operazioni della digitalizzazione. *Byte order*, o *endianness*, è l'ordine dei byte di una parola in memoria. Notate che *stack* è la *pila*, mentre *array* spesso non si traduce, oppure si rende con *vettore*.

## Slide 20: Conclusioni e letture

Cinque frasi da tenere. L'informazione digitale è una configurazione di bit più una convenzione per leggerla. Gli stessi bit possono essere un numero, un colore o due caratteri: decide il programma. L'esadecimale è il binario scritto in modo compatto, quattro bit per cifra. Il testo è fatto di numeri, e le strutture sono byte più una regola. Gli algoritmi trasformano i dati in informazione su cui fondare decisioni. La prossima lezione tratta formalmente la rappresentazione dei numeri, partendo da un segnalino che esce dal bordo sinistro dello schermo.
