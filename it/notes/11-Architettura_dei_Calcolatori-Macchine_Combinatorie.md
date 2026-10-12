# Lezione 11: Macchine combinatorie

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine combinatorie

Le lezioni precedenti vi hanno dato le porte e un metodo per combinarle. Questa è un catalogo delle macchine che i progettisti usano davvero: decodificatori, codificatori, multiplexer, comparatori, reti di parità, e infine l'unità aritmetico-logica. Per ciascuna imparate che cosa fa, come è costruita, e dove sta dentro un processore RISC-V. Il giovane Turing della citazione vuole carote e piselli ben separati: questa lezione parla di tenere le cose distinte, e di scegliere tra esse.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Distinguere una macchina combinatoria da una sequenziale. Calcolare quanti bit richiede un codice e riconoscere codici incompleti e ridondanti. Progettare un decodificatore e un codificatore, e comporre decodificatori piccoli in decodificatori più grandi. Spiegare multiplexer e demultiplexer e costruirli con le porte. Costruire un comparatore e una rete di parità, sapendo che cosa un controllo di parità può e non può rilevare. E indicare ciascuna di queste macchine dentro il processore.

## Slide 3: Riscaldamento sulla macchina

Il riscaldamento è un pezzo di assembly che sceglie un colore tra quattro. Mentre lo leggete, chiedetevi se il risultato dipende da qualcosa accaduto prima.

## Slide 4: Scegliere uno di quattro colori

`a0` contiene un numero da 0 a 3. Le quattro istruzioni sono l'accesso al vettore della Lezione 04: si carica l'indirizzo della tabella, si moltiplica il selettore per 4, si somma, e si carica la parola selezionata. Lo stesso selettore dà sempre lo stesso colore, e nulla viene ricordato da un uso al successivo. Questo comportamento, uscite che dipendono solo dagli ingressi presenti, definisce le macchine di oggi. In hardware questa in particolare è un *multiplexer*: quattro ingressi dati, due bit di selezione, un'uscita.

## Slide 5: Macchine combinatorie

Prima la definizione e il metodo: che cos'è una macchina combinatoria, come la si progetta, e un avvertimento sul tempo.

## Slide 6: Una tassonomia dei circuiti digitali

I circuiti digitali sono di due tipi. In un circuito *combinatorio* le uscite in un dato istante dipendono solo dagli ingressi in quello stesso istante: non c'è memoria né retroazione, e una tabella di verità descrive completamente il circuito. In un circuito *sequenziale* le uscite dipendono anche dalla storia passata degli ingressi: servono le nozioni di tempo e di stato. Sommatori, decodificatori e multiplexer sono combinatori; flip-flop, registri e il processore nel suo insieme sono sequenziali, e sono l'argomento della Lezione 13.

## Slide 7: Progettare una macchina combinatoria

Il progetto di una macchina combinatoria in quattro passi: una specifica a parole; una tabella di verità, con le indifferenze; una minimizzazione, un'uscita alla volta; e una rete di porte o di blocchi standard. È il metodo della Lezione 09. Oltre i quattro o cinque ingressi nessuno disegna più mappe: i progettisti assemblano blocchi già pronti, ed è per questo che la lezione ne è un catalogo. L'analisi procede nel verso opposto, dallo schema alla tabella.

## Slide 8: Le porte reali richiedono tempo

Una porta reale non risponde all'istante: la sua uscita si assesta dopo un *ritardo di propagazione*, come ha spiegato la Lezione 10. Il ritardo di una rete è quello del suo percorso più lento da un ingresso a un'uscita, il *percorso critico*. Mentre i segnali viaggiano le uscite possono essere temporaneamente sbagliate. Quindi una macchina combinatoria è corretta solo dopo essersi assestata, e qualcosa deve dire quando guardarne le uscite. Quel qualcosa è il clock, ed è lì che cominciano le macchine sequenziali.

## Slide 9: Codici

Molte delle macchine di questa lezione trattano codici: li traducono, li selezionano, li controllano. Prima delle macchine bisogna quindi dire con precisione che cos'è l'informazione e che cos'è un codice.

## Slide 10: Il concetto di informazione

Sei parole per parlare di informazione. L'*attributo* è il significato: il voto di un esame. Il *tipo* è l'insieme dei valori possibili: i voti da 18 a 30, e il 30 e lode. Il *valore* è l'elemento effettivamente assunto: 30. La *cardinalità* è il numero di elementi del tipo, qui 14. Poi due distinzioni: lo stesso valore si può scrivere in molti modi, ed è il problema della codifica; e i tipi possono essere semplici o strutturati. Notate che «30 e lode» non è un numero: è un quattordicesimo elemento.

## Slide 11: Alfabeti e stringhe

Un *alfabeto* è un insieme finito e non vuoto di simboli: quello binario ne ha due, quello decimale dieci. Una *stringa*, o parola, è una sequenza finita di simboli di un alfabeto, e la sua lunghezza è il numero dei suoi simboli. La stringa di lunghezza zero è la stringa vuota. L'insieme di tutte le stringhe su un alfabeto S si indica con S asterisco. Una sequenza infinita non è una stringa. Queste definizioni sono la base della teoria dei codici, e più avanti dei linguaggi formali.

## Slide 12: Codici a lunghezza fissa

Un *codice* associa a ogni elemento di un insieme di N elementi una stringa di simboli, la *parola codice*. In un codice a lunghezza fissa tutte le parole hanno la stessa lunghezza m. Con un alfabeto di k simboli le parole sono k alla m, quindi m deve essere almeno il logaritmo di N, arrotondato per eccesso. In binario: quattordici voti richiedono 4 bit, e i 32 registri di RISC-V ne richiedono esattamente 5. Quando N non è una potenza di due alcune parole restano inutilizzate, e il codice è *incompleto*.

## Slide 13: Un codice incompleto: il decimale codificato in binario

Il classico codice incompleto: le cifre decimali su quattro bit. Nel BCD 8421 ogni cifra è semplicemente il suo valore in binario; nell'eccesso 3 il valore è aumentato di tre. Dieci cifre richiedono quattro bit, e quattro bit danno sedici parole, quindi sei non si usano mai: nel BCD, le parole da 1010 a 1111. Ricordate la didascalia: quando si progetta un circuito che riceve cifre BCD, quelle sei parole sono indifferenze e semplificano il circuito.

## Slide 14: Codici ridondanti

Un codice *ridondante* usa più bit del minimo, quindi solo alcune delle parole possibili sono lecite. Se arriva una parola non lecita, qualcosa l'ha alterata lungo il percorso, e l'errore è rilevato. Confrontate i due codici della tabella. Nel Codice 1 ogni parola di 2 bit è lecita: un bit alterato trasforma un elemento in un altro e nessuno se ne accorge. Il Codice 2 aggiunge un terzo bit che rende pari il numero di 1: qualunque bit singolo alterato produce una parola non lecita. La ridondanza è il prezzo pagato per rilevare gli errori.

## Slide 15: Codici a lunghezza variabile

In un codice *a lunghezza variabile* agli elementi frequenti vanno parole corte e a quelli rari parole lunghe, con risparmio di spazio e di tempo. Chi legge deve comunque sapere dove finisce ogni parola, e lo garantisce la *proprietà del prefisso*: nessuna parola è l'inizio di un'altra. Avete già incontrato due codici di questo tipo: UTF-8, con uno-quattro byte per carattere, e le istruzioni del kit, lunghe 16 o 32 bit. I due bit più bassi di un'istruzione dicono quale: 11 significa 32 bit.

## Slide 16: Decodificatori e codificatori

La prima famiglia di macchine traduce tra un codice compatto e un insieme di linee separate, una per ogni elemento.

## Slide 17: La rappresentazione decodificata

Nella rappresentazione *decodificata* ci sono tanti bit quanti elementi, ed esattamente uno vale 1: una linea per elemento. Si dice anche one-hot. È costosa in fili ma immediatamente utilizzabile, perché la linea attiva può accendere direttamente qualcosa. La regola pratica sta nell'ultima riga: si tiene l'informazione in un codice compatto dentro una parola, e la si decodifica dove una scelta va attuata.

## Slide 18: Il decodificatore

Un *decodificatore* riceve una parola codice di m bit e attiva l'unica uscita, su 2 alla m, che le corrisponde. La tabella e il circuito mostrano il decodificatore 2-a-4: ogni uscita è un mintermine dei due ingressi, realizzato con una porta AND e, dove serve, con invertitori. Un decodificatore genera quindi tutti i mintermini dei suoi ingressi. Un ingresso di *abilitazione*, quando vale 0, tiene a 0 tutte le uscite: sarà la chiave per comporre i decodificatori.

## Slide 19: Comporre decodificatori: da 2-a-4 a 4-a-16

I decodificatori grandi si costruiscono con quelli piccoli. Per selezionare una linea su sedici a partire da quattro bit, un primo decodificatore 2-a-4 guarda i due bit alti e abilita uno di altri quattro decodificatori; tutti e quattro ricevono i due bit bassi, e solo quello abilitato attiva una delle sue linee. Cinque piccoli decodificatori fanno il lavoro. È la composizione modulare, ed è la strategia generale del progetto digitale: risolvere un problema grande con copie della soluzione di uno piccolo.

## Slide 20: Nel processore: quale registro viene scritto?

Un decodificatore al lavoro nel processore. L'istruzione `addi t1, t1, 1` contiene un campo di 5 bit, `rd`, con il numero del registro di destinazione: 00110, cioè 6, il registro `t1`. Un decodificatore 5-a-32 trasforma quei cinque bit in trentadue linee di abilitazione alla scrittura, di cui è attiva solo la sesta: solo quel registro riceve il risultato. La stessa istruzione contiene altri due numeri di registro, che selezionano i registri da leggere.

## Slide 21: Il codificatore

Il *codificatore* è la macchina inversa: riceve N linee, di cui una attiva, e ne produce il numero come parola codice di m bit. Ogni bit di uscita è l'OR delle linee di ingresso il cui numero ha un 1 in quella posizione. Se più linee possono essere attive insieme serve un *codificatore con priorità*, che dà in uscita il numero della linea attiva più importante. Lo ritroverete con le interruzioni, quando più dispositivi chiedono attenzione nello stesso momento.

## Slide 22: Transcodificatori: il display a sette segmenti

Un *transcodificatore* converte una parola di un codice nella parola corrispondente di un altro codice. L'esempio è il display a sette segmenti: l'ingresso è una cifra BCD, le uscite sono le sette linee che accendono i segmenti, chiamati da a a g. La tabella dà, per ogni cifra, i segmenti accesi: la cifra 2 accende a, b, g, e e d. Le uscite sono sette, quindi ci sono sette funzioni di quattro variabili da sintetizzare, ciascuna con sei indifferenze.

## Slide 23: Sintesi del segmento a

La sintesi del segmento a con il metodo della Lezione 09. Il segmento è spento solo per le cifre 1 e 4. Le sei parole BCD non usate sono segnate con x. Usando le celle x come 1, quattro grandi gruppi coprono la mappa: le due righe in basso danno A, le due colonne a destra danno C, il quadrato centrale dà BD, e i quattro angoli danno B'D'. Il risultato è a = A + C + BD + B'D'. Senza le indifferenze i gruppi sarebbero più piccoli e l'espressione più lunga. Provate voi il segmento g.

## Slide 24: Multiplexer e demultiplexer

La seconda famiglia seleziona: un multiplexer sceglie una sorgente tra molte, un demultiplexer una destinazione tra molte.

## Slide 25: Il multiplexer

Un *multiplexer* ha 2 alla n ingressi dati, n linee di selezione e un'uscita: trasferisce sull'uscita l'ingresso scelto dalle linee di selezione. La formula mostra come: ogni ingresso dati è moltiplicato per un mintermine delle linee di selezione, e i prodotti si sommano. Con due ingressi, Y = S'I0 + S I1: quando S vale 0 il primo termine lascia passare I0, quando S vale 1 il secondo lascia passare I1. Il disegno è esattamente questa formula in porte. È la macchina del riscaldamento.

## Slide 26: Il demultiplexer

Il *demultiplexer* è l'inverso: un ingresso dati, n linee di selezione e 2 alla n uscite. L'ingresso è instradato sull'uscita scelta dalle linee di selezione, e le altre uscite restano a 0. Con l'ingresso dati fisso a 1 è esattamente un decodificatore. Un multiplexer a un capo di un filo e un demultiplexer all'altro permettono a molti segnali di condividere quel filo, uno alla volta: è l'idea che sta dietro ogni linea condivisa, compresi i bus della Lezione 14.

## Slide 27: Nel processore: registro o costante?

Un multiplexer al lavoro nel processore. `add t2, t0, t1` somma due registri; `addi t2, t0, 5` somma un registro e una costante presa dall'istruzione. Entrambe usano lo stesso addizionatore. Un multiplexer davanti al secondo ingresso della ALU sceglie tra il valore di un registro e la costante: la sua linea di selezione vale 0 per `add` e 1 per `addi`. È un multiplexer su parole intere: trentadue multiplexer a un bit con una linea di selezione comune. Anche leggere un registro è un multiplexer.

## Slide 28: Confrontare e controllare

La terza famiglia controlla: due parole sono uguali? Una parola è arrivata così come è stata inviata?

## Slide 29: Il comparatore

Un *comparatore* riceve due parole e produce un bit, che vale 1 quando sono uguali. Due bit sono uguali quando il loro XNOR vale 1; due parole sono uguali quando lo sono tutte le loro coppie di bit, quindi il comparatore è un AND di XNOR. Il disegno lo mostra per parole di due bit. Nel processore decide i salti `beq` e `bne`: i due registri vengono confrontati, e il salto avviene o no secondo il risultato.

## Slide 30: Parità

Il codice ridondante più semplice aggiunge a ogni parola un *bit di parità*, scelto in modo che il numero totale di 1 sia, per esempio, pari. Il circuito che lo calcola è una *rete di parità*, una catena di XOR: lo XOR di tutti i bit di una parola vale 1 quando il numero di 1 è dispari, perché XOR è la somma modulo 2. La rete si usa due volte: da chi trasmette, per calcolare il bit da aggiungere, e da chi riceve, per verificare la parità di ciò che è arrivato.

## Slide 31: Trasmissione con controllo di parità

Lo schema completo di una trasmissione con controllo di parità. La sorgente produce una parola; una prima rete di parità calcola il bit di parità e lo accoda; la parola viaggia su un canale dove può essere alterata; una seconda rete verifica la parità e alza un segnale di errore se non torna. La didascalia enuncia con precisione i limiti: un solo bit di parità rileva un numero dispari qualsiasi di bit alterati, non sa dire quale bit è sbagliato, e gli sfugge un numero pari di errori.

## Slide 32: Una rete di parità in sette istruzioni

Una rete di parità in software, per un byte. Ogni coppia di istruzioni scorre il valore a destra e lo combina con se stesso tramite XOR: il primo ripiegamento porta otto bit su quattro, il secondo quattro su due, il terzo due su uno. L'ultima istruzione tiene solo il bit più basso, che è la parità. In hardware gli stessi tre livelli sono un albero di sette porte XOR. Tracciatela a mano con 0x53, che ha quattro 1, e con 0x13, che ne ha tre.

## Slide 33: L'unità aritmetico-logica

L'ultima macchina contiene tutte le altre. L'unità aritmetico-logica è la parte del processore che calcola, ed è costruita interamente con i blocchi di questa lezione.

## Slide 34: La ALU è un insieme di macchine e un multiplexer

La ALU riceve due parole, A e B. Al suo interno più unità lavorano insieme sugli stessi operandi: un addizionatore che fa anche le sottrazioni, una fila di porte AND, una di porte OR, una di porte XOR, uno shifter. Tutte producono un risultato. Un multiplexer lascia passare uno dei risultati, e le sue linee di selezione vengono da un decodificatore che legge l'istruzione. Non c'è memoria da nessuna parte: la ALU è un'unica grande macchina combinatoria, e il suo percorso più lento, la catena dei riporti dell'addizionatore, limita il clock del processore.

## Slide 35: Le istruzioni RISC-V e la ALU

Come un'istruzione sceglie l'operazione. Il campo di 3 bit `funct3` dell'istruzione è un codice compatto: 000 per somma o differenza, 001 per lo scorrimento a sinistra, 100 per XOR, 110 per OR, 111 per AND. Un piccolo decodificatore lo trasforma nelle linee di selezione del multiplexer della ALU. Dove due istruzioni condividono un valore, come `add` e `sub`, le distingue un altro bit altrove nell'istruzione. Un codice, un decodificatore, un multiplexer: l'intera lezione in una tabella.

## Slide 36: Verifica la comprensione: Quanti bit richiede un codice binario a lunghezza fissa per le 26 lettere dell'alfabeto?

Usate la formula del codice a lunghezza fissa: il più piccolo m tale che 2 alla m sia almeno 26. Quattro bit danno sedici parole, che non bastano. E notate che il risultato lascia alcune parole inutilizzate.

## Slide 37: Verifica la comprensione: Un decodificatore ha 3 linee di ingresso e nessuna abilitazione. Quante uscite ha, e quante valgono 1 in ogni istante?

Un decodificatore con m ingressi ha 2 alla m uscite, e la sua uscita è una rappresentazione decodificata: in ogni istante è attiva esattamente una linea.

## Slide 38: Verifica la comprensione: Di quante linee di selezione ha bisogno un multiplexer con 8 ingressi dati?

La relazione è l'inversa della precedente: n linee di selezione scelgono tra 2 alla n ingressi. Otto è 2 alla terza.

## Slide 39: Verifica la comprensione: Una parola con un bit di parità pari viene ricevuta con due bit alterati. Il controllo di parità:

Contate gli 1. Un controllo di parità sa soltanto se il loro numero è pari o dispari. Alterare un bit cambia questo fatto; alterarne due lo cambia due volte, e lo riporta dov'era.

## Slide 40: Esercizi: prima su carta, poi su PRG32

Cinque esercizi. Sintetizzate il segmento g con una mappa, usando le indifferenze. Costruite un decodificatore 3-a-8 con due decodificatori 2-a-4 con abilitazione e un invertitore. Realizzate una funzione con un solo multiplexer mettendo la sua tabella di verità sugli ingressi dati, e riconoscete la funzione. Scrivete un comparatore in assembly con le sole `xor` e `sltiu`. E disegnate su PRG32 una cifra a sette segmenti: una tabella di dieci byte, uno per cifra, e sette rettangoli accesi esaminandone i bit: un transcodificatore in software.

## Slide 41: Glossario: inglese e italiano

Dodici termini. *Enable*, abilitazione, è l'ingresso che accende o spegne un blocco. *Code word*, parola codice, è ciascuna stringa di un codice. Multiplexer e demultiplexer conservano il nome anche in italiano. Un *transcoder*, transcodificatore, converte tra due codici. Il *parity bit*, bit di parità, è il bit ridondante aggiunto per il controllo.

## Slide 42: Conclusioni e letture

Cinque conclusioni. L'informazione è un attributo, un tipo e un valore, e un codice scrive il valore come stringa. Un codice binario a lunghezza fissa richiede il logaritmo di N bit, arrotondato per eccesso; un codice ridondante ne spende di più per rilevare gli errori. Codifica, decodifica e transcodifica sono svolte da macchine combinatorie. I multiplexer selezionano una sorgente, i demultiplexer una destinazione, comparatori e reti di parità controllano. E il processore li usa tutti. A queste macchine manca la memoria: dopo la Parte 2 di Verm1, la aggiunge la Lezione 13.
