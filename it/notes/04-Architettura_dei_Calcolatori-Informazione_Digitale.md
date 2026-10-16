# Lezione 04: Rappresentare l'informazione digitale

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: analogico e digitale; bit, byte, parola; l'esadecimale; la notazione posizionale; un colore è un numero; caratteri e stringhe; l'ordine little-endian; le strutture dati; gli array in memoria; gli algoritmi. DA UTILIZZARE OGGI: shift come moltiplicazione (Lezione 05) e, usati senza essere studiati nel corso, il programma completo, gli strumenti di PRG32. DA COMPRENDERE PIÙ AVANTI: niente. Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

## Slide 1: Rappresentare l'informazione digitale

Nella Lezione 02 lo studente ha scritto 0x07e0, 255, `.asciz` e `.word` senza sapere con precisione che cosa denotassero. Questa lezione li nomina. La sua tesi è enunciata nel sottotitolo: tutto ciò che sta dentro la macchina è una configurazione di bit, che sia un numero, un colore, una lettera o un elenco, e il significato di una configurazione è fissato da una convenzione, non dai bit stessi. La lezione privilegia l'ampiezza sulla profondità: la rappresentazione dei numeri si tratta formalmente nelle due lezioni successive, mentre qui lo scopo è imparare a leggere i bit e a riconoscere che l'interpretazione è un accordo.

## Slide 2: Che cosa saprete fare alla fine

Sei risultati di apprendimento, dal generale al particolare e ritorno. Lo studente saprà distinguere l'informazione analogica da quella digitale, leggere un byte in binario e in esadecimale, decodificare un colore PRG32 nei suoi tre campi, spiegare come si memorizza il testo, e descrivere come un array è disposto in memoria e come l'assembly ne raggiunge un elemento. L'ultimo risultato guarda oltre la macchina: che cos'è un algoritmo, quando è deterministico, e dove si colloca l'apprendimento automatico tra gli algoritmi.

## Slide 3: Informazione analogica e digitale

Una grandezza *analogica* varia con continuità, come una tensione o le lancette di un orologio. Una grandezza *digitale* è una sequenza di simboli tratti da un alfabeto finito, come le cifre di un display. Nella figura la curva continua è il segnale analogico e la scalinata è la sua controparte digitale, ottenuta *campionando* a istanti regolari e *quantizzando* ogni campione a uno di un numero finito di livelli. Nel processo qualcosa si perde, e si guadagna qualcosa di essenziale: un insieme finito di livelli si può contare, copiare senza errori e verificare. Con due soli livelli il simbolo è il bit, e la Lezione 10 mostrerà perché si preferiscono due livelli.

## Slide 4: Bit, byte, parola

Le unità dell'informazione, ciascuna legata a un oggetto già incontrato. Un *bit* è un pulsante. Un *nibble*, quattro bit, è una cifra esadecimale. Un *byte*, otto bit, è un carattere ASCII, ed è la ragione per cui la barra della Lezione 02 non superava mai i 255 pixel. Una *halfword*, sedici bit, è un colore PRG32. Una *word*, trentadue bit, è un registro e un'istruzione. La regola che governa tutto è che n bit danno 2^n configurazioni distinte. La didascalia aggiunge il principio della lezione: che cosa significhi una configurazione non è scritto nei bit.

## Slide 5: Contare in base 2 e in base 16

Sedici righe da imparare a memoria, come un tempo le tabelline. Ogni riga dà lo stesso numero in decimale, in binario a quattro bit e come singola cifra esadecimale. Le quattro posizioni binarie pesano 8, 4, 2 e 1, quindi 1011 vale 8 + 2 + 1 = 11, che l'esadecimale scrive B; dopo il 9 le cifre esadecimali proseguono con le lettere da A a F per i valori da dieci a quindici. Qui conta la scioltezza più della comprensione, perché la comprensione è semplice: l'esercizio consigliato è coprire due colonne e ricostruirle dalla terza, finché non serve più pensarci.

## Slide 6: Notazione posizionale: che cosa significa 11011001

In un sistema posizionale ogni cifra contribuisce con il suo valore moltiplicato per il peso della sua posizione, e i pesi sono potenze successive della base. La slide legge così il byte 11011001: le posizioni pesano 128, 64, 32, 16, 8, 4, 2 e 1, e il peso si somma dove il bit vale 1. La somma è 128 + 64 + 16 + 8 + 1 = 217. È esattamente il procedimento applicato inconsapevolmente in base dieci, dove 217 indica due centinaia, una decina e sette unità. La Lezione 05 enuncia la formula generale e gli algoritmi di conversione.

## Slide 7: Perché i programmatori scrivono in esadecimale

Poiché sedici è due alla quarta, ogni cifra esadecimale corrisponde esattamente a quattro bit. La conversione non richiede quindi alcuna aritmetica: il numero binario si divide in gruppi di quattro bit a partire da destra, e ogni gruppo si sostituisce con la sua cifra della tabella, così che 0000 0111 1110 0000 diventa 0, 7, E, 0. È per questo che i programmatori scrivono in esadecimale: è il binario in forma compatta, con un registro che occupa otto cifre esadecimali invece di trentadue bit. Il prefisso `0x` indica che un numero è esadecimale.

## Slide 8: Un colore è un numero: RGB565

Qui si apre il verde della Lezione 02. Un colore PRG32 è una grandezza a sedici bit divisa in tre campi: cinque bit di rosso, sei di verde, cinque di blu, un formato noto come RGB565. In 0x07E0 il campo rosso è 00000, quello verde 111111 e quello blu 00000: verde massimo e nient'altro. Il bit in più dato al verde riflette la maggiore sensibilità della visione umana a quella componente. I campioni mostrano altre combinazioni: il giallo è rosso più verde, il bianco è ogni campo al massimo. La frase in fondo ribadisce la lezione: gli stessi sedici bit potrebbero significare tutt'altro.

## Slide 9: ASCII: un carattere, un byte

L'ASCII assegna un numero a ogni carattere e lo fa stare in un byte. Dalla tabella seguono tre osservazioni. La A maiuscola è 65 e la a minuscola 97: differiscono di 32, cioè di un solo bit, il che fa del passaggio tra maiuscole e minuscole un'operazione bit a bit. Il carattere "0" è 48, non zero: una cifra digitata su una tastiera è un codice, non ancora un numero, una distinzione che la Lezione 22 sfrutta quando converte un punteggio in testo. E alcuni caratteri non si stampano: il ritorno a capo, 10, e NUL, 0, che la prossima slide usa come terminatore di una stringa.

## Slide 10: Stringhe: una sequenza di caratteri in memoria

Una stringa è una sequenza di codici di carattere memorizzati in byte consecutivi, e la questione di progetto è come se ne segni la fine. La convenzione del C mette un byte zero in fondo; quella del Pascal memorizza prima la lunghezza. La terza riga è la stringa della Lezione 02: `.asciz` memorizza gli undici caratteri di HELLO PRG32 seguiti da uno zero, dodici byte in tutto. La funzione che disegna il testo riceve solo l'indirizzo del primo byte e legge finché non incontra lo zero. Se il terminatore mancasse, proseguirebbe in ciò che si trova dopo in memoria, un errore con una lunga storia nella sicurezza informatica.

## Slide 11: Unicode e UTF-8: ogni sistema di scrittura

L'ASCII definisce 128 caratteri, sufficienti per il solo inglese. Unicode assegna un numero, il *code point*, a ogni carattere di ogni sistema di scrittura. UTF-8 codifica quel numero in uno-quattro byte: i caratteri ASCII conservano il loro singolo byte, una lettera accentata ne prende due, il simbolo dell'euro tre, un'emoji quattro. Ne seguono due conseguenze. Un testo puramente ASCII è già UTF-8 valido, il che spiega l'adozione universale della codifica. E la lunghezza di una stringa in byte non coincide più con la sua lunghezza in caratteri.

## Slide 12: Ordine dei byte: little-endian

Una parola occupa quattro byte e la memoria assegna un indirizzo a ogni byte, quindi va specificato l'ordine in cui i byte sono memorizzati. RISC-V è *little-endian*: il byte meno significativo occupa l'indirizzo più basso, quindi 0x12345678 si memorizza come 78, 56, 34, 12. La convenzione opposta, *big-endian*, è usata dai protocolli di rete. Nell'uso ordinario l'ordine è invisibile, perché `lw` e `sw` sono coerenti tra loro; diventa visibile quando si ispeziona la memoria byte per byte in un debugger, o quando si scambiano dati con una macchina di convenzione diversa. La Lezione 15 torna sulla questione e la trasforma in un esperimento.

## Slide 13: Cinque modi di organizzare i dati

Cinque modi di organizzare i dati. Un *array* memorizza elementi dello stesso tipo in posizioni contigue e li raggiunge per indice. Una *lista* collega ogni elemento al successivo: economica da modificare, lenta da accedere per posizione. Una *pila* restituisce per primo l'elemento inserito per ultimo, e la si è già usata nella Lezione 02 per salvare `ra`. Un *dizionario* associa chiavi a valori. Un *albero* organizza gli elementi in gerarchia. La sesta scheda enuncia il punto più rilevante per questo corso: dentro la macchina ognuna di queste strutture è un insieme di byte in memoria insieme a una regola per trovare l'elemento successivo.

## Slide 14: Algoritmi e calcolabilità

Un problema è *calcolabile* se qualche algoritmo lo risolve. La macchina di Turing è il modello matematico di un calcolatore programmato; la macchina di von Neumann è l'architettura che lo realizza in hardware. L'ultima riga è quella sorprendente: esistono problemi che nessun algoritmo può risolvere, e quindi che nessun calcolatore risolverà mai, per quanto veloce. L'esempio classico è il problema della terminazione, decidere per un programma arbitrario se terminerà, che Turing dimostrò indecidibile nel 1936.

## Slide 15: Algoritmi deterministici e non deterministici

Un algoritmo *deterministico*, a parità di ingresso, esegue sempre la stessa sequenza di passi e produce lo stesso risultato: `first_update` aggiunge sempre uno. Un algoritmo *non deterministico* può comportarsi diversamente in esecuzioni diverse con lo stesso ingresso. Due cause sono comuni. L'algoritmo può usare deliberatamente numeri casuali, come fa un gioco che piazza un nemico a caso; oppure il suo comportamento può dipendere dalla tempistica relativa di eventi concorrenti. Il primo tipo è una scelta di progetto di grande utilità, come mostrano i test probabilistici di primalità; il secondo è una fonte frequente di errori difficili da riprodurre.

## Slide 16: Machine learning

Un programma classico è una funzione scritta da una persona: y = f(x). Nell'*apprendimento automatico* la funzione non è scritta ma costruita automaticamente a partire da esempi. I modelli generativi contemporanei applicano questa idea su scala enorme, con miliardi di parametri appresi. Due osservazioni collegano l'argomento a questo corso. Quei parametri sono bit in memoria, moltiplicati e sommati da processori del tipo qui studiato. E un modello può sbagliare con grande sicurezza: solo chi comprende i fondamenti è in grado di verificare ciò che afferma.

## Slide 17: Verifica la comprensione: Quanti valori diversi può rappresentare un byte? / Il colore PRG32 0xF81F è:

La prima domanda applica la regola per cui n bit danno 2^n configurazioni a un byte di otto bit. Due quasi-risposte meritano attenzione: 8 è il numero dei bit, e 255 è il più grande numero naturale che un byte può contenere, non il numero dei valori, perché va contato anche lo zero.

Per la seconda, le quattro cifre esadecimali si scrivono in binario, F come 1111, 8 come 1000, 1 come 0001, F come 1111, e i sedici bit si dividono in 5, 6 e 5: rosso 11111, verde 000000, blu 11111. Rosso e blu sono al massimo e il verde è assente.

## Slide 18: Verifica la comprensione: Quanti byte occupa in memoria .asciz "CIAO"? / Su RISC-V, .word 0x0000ABCD è memorizzata all'indirizzo A. Quale byte si trova all'indirizzo A?

Per la prima domanda si contano i caratteri e si ricorda il significato della z di `.asciz`: la direttiva memorizza la stringa terminata da zero, aggiungendo un byte ai caratteri visibili.

Per la seconda, RISC-V è little-endian. La parola si scrive come quattro byte, 00 00 AB CD, dal più al meno significativo, e la domanda è quale di essi occupi l'indirizzo più basso. Il distrattore è 0x00, che sarebbe corretto su una macchina big-endian.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Word* è *parola* in italiano, e su RV32 indica trentadue bit. *Campionamento* e *quantizzazione* sono le due operazioni della digitalizzazione. L'*ordine dei byte*, o *endianness*, è l'ordine in cui sono memorizzati i byte di una parola. La *pila* traduce lo *stack*, mentre *array* spesso resta in inglese o si rende con *vettore*.

## Slide 20: Conclusioni e letture

Cinque proposizioni riassumono la lezione. L'informazione digitale è una configurazione di bit insieme a una convenzione per leggerla. Gli stessi bit possono essere un numero, un colore o due caratteri, e il programma decide quale. L'esadecimale è il binario in forma compatta, quattro bit per cifra. Il testo consiste di numeri, e le strutture dati di byte più una regola. Gli algoritmi trasformano i dati in informazione su cui fondare decisioni. La prossima lezione tratta formalmente la rappresentazione dei numeri, a partire da un segnalino che esce dal bordo sinistro dello schermo.
