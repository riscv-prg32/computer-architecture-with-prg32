# Lezione 11: Macchine combinatorie

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Macchine combinatorie

Le lezioni precedenti vi hanno dato le porte e un metodo per combinarle. Questa è un catalogo delle macchine che i progettisti usano davvero: decodificatori, codificatori, multiplexer, comparatori, reti di parità, e infine l'unità aritmetico-logica. Per ciascuna imparate che cosa fa, come è costruita, e dove sta dentro un processore RISC-V. Il giovane Turing della citazione vuole carote e piselli ben separati: questa lezione parla di tenere le cose distinte, e di scegliere tra esse.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Distinguere una macchina combinatoria da una sequenziale. Calcolare quanti bit richiede un codice e riconoscere codici incompleti e ridondanti. Progettare un decodificatore e un codificatore, e dire che cosa fa un transcodificatore. Spiegare multiplexer e demultiplexer e costruirli con le porte. Costruire un comparatore e una rete di parità, sapendo che cosa un controllo di parità può e non può rilevare. E indicare ciascuna di queste macchine dentro il processore.

## Slide 3: Una tassonomia dei circuiti digitali

I circuiti digitali sono di due tipi. In un circuito *combinatorio* le uscite in un dato istante dipendono solo dagli ingressi in quello stesso istante: non c'è memoria né retroazione, e una tabella di verità descrive completamente il circuito. In un circuito *sequenziale* le uscite dipendono anche dalla storia passata degli ingressi: servono le nozioni di tempo e di stato. Sommatori, decodificatori e multiplexer sono combinatori; flip-flop, registri e il processore nel suo insieme sono sequenziali, e sono l'argomento della Lezione 13.

## Slide 4: Le porte reali richiedono tempo

Una porta reale non risponde all'istante: la sua uscita si assesta dopo un *ritardo di propagazione*, come ha spiegato la Lezione 10. Il ritardo di una rete è quello del suo percorso più lento da un ingresso a un'uscita, il *percorso critico*. Mentre i segnali viaggiano le uscite possono essere temporaneamente sbagliate. Quindi una macchina combinatoria è corretta solo dopo essersi assestata, e qualcosa deve dire quando guardarne le uscite. Quel qualcosa è il clock, ed è lì che cominciano le macchine sequenziali.

## Slide 5: Codici a lunghezza fissa

Un *codice* associa a ogni elemento di un insieme di N elementi una stringa di simboli, la *parola codice*. In un codice a lunghezza fissa tutte le parole hanno la stessa lunghezza m. Con un alfabeto di k simboli le parole sono k alla m, quindi m deve essere almeno il logaritmo di N, arrotondato per eccesso. In binario: quattordici voti richiedono 4 bit, e i 32 registri di RISC-V ne richiedono esattamente 5. Quando N non è una potenza di due alcune parole restano inutilizzate, e il codice è *incompleto*.

## Slide 6: Un codice incompleto: il decimale codificato in binario

Il classico codice incompleto: le cifre decimali su quattro bit. Nel BCD 8421 ogni cifra è semplicemente il suo valore in binario; nell'eccesso 3 il valore è aumentato di tre. Dieci cifre richiedono quattro bit, e quattro bit danno sedici parole, quindi sei non si usano mai: nel BCD, le parole da 1010 a 1111. Ricordate la didascalia: quando si progetta un circuito che riceve cifre BCD, quelle sei parole sono indifferenze e semplificano il circuito.

## Slide 7: Codici ridondanti

Un codice *ridondante* usa più bit del minimo, quindi solo alcune delle parole possibili sono lecite. Se arriva una parola non lecita, qualcosa l'ha alterata lungo il percorso, e l'errore è rilevato. Confrontate i due codici della tabella. Nel Codice 1 ogni parola di 2 bit è lecita: un bit alterato trasforma un elemento in un altro e nessuno se ne accorge. Il Codice 2 aggiunge un terzo bit che rende pari il numero di 1: qualunque bit singolo alterato produce una parola non lecita. La ridondanza è il prezzo pagato per rilevare gli errori.

## Slide 8: La rappresentazione decodificata

Nella rappresentazione *decodificata* ci sono tanti bit quanti elementi, ed esattamente uno vale 1: una linea per elemento. Si dice anche one-hot. È costosa in fili ma immediatamente utilizzabile, perché la linea attiva può accendere direttamente qualcosa. La regola pratica sta nell'ultima riga: si tiene l'informazione in un codice compatto dentro una parola, e la si decodifica dove una scelta va attuata.

## Slide 9: Il decodificatore

Un *decodificatore* riceve una parola codice di m bit e attiva l'unica uscita, su 2 alla m, che le corrisponde. La tabella e il circuito mostrano il decodificatore 2-a-4: ogni uscita è un mintermine dei due ingressi, realizzato con una porta AND e, dove serve, con invertitori. Un decodificatore genera quindi tutti i mintermini dei suoi ingressi. Un ingresso di *abilitazione*, quando vale 0, tiene a 0 tutte le uscite: sarà la chiave per comporre i decodificatori.

## Slide 10: Il codificatore

Il *codificatore* è la macchina inversa: riceve N linee, di cui una attiva, e ne produce il numero come parola codice di m bit. Ogni bit di uscita è l'OR delle linee di ingresso il cui numero ha un 1 in quella posizione. Se più linee possono essere attive insieme serve un *codificatore con priorità*, che dà in uscita il numero della linea attiva più importante. Lo ritroverete con le interruzioni, quando più dispositivi chiedono attenzione nello stesso momento.

## Slide 11: Transcodificatori: il display a sette segmenti

Un *transcodificatore* converte una parola di un codice nella parola corrispondente di un altro codice. L'esempio è il display a sette segmenti: l'ingresso è una cifra BCD, le uscite sono le sette linee che accendono i segmenti, chiamati da a a g. La tabella dà, per ogni cifra, i segmenti accesi: la cifra 2 accende a, b, g, e e d. Le uscite sono sette, quindi ci sono sette funzioni di quattro variabili da sintetizzare, ciascuna con sei indifferenze.

## Slide 12: Il multiplexer

Un *multiplexer* ha 2 alla n ingressi dati, n linee di selezione e un'uscita: trasferisce sull'uscita l'ingresso scelto dalle linee di selezione. La formula mostra come: ogni ingresso dati è moltiplicato per un mintermine delle linee di selezione, e i prodotti si sommano. Con due ingressi, Y = S'I0 + S I1: quando S vale 0 il primo termine lascia passare I0, quando S vale 1 il secondo lascia passare I1. Il disegno è esattamente questa formula in porte. È la macchina del riscaldamento.

## Slide 13: Il demultiplexer

Il *demultiplexer* è l'inverso: un ingresso dati, n linee di selezione e 2 alla n uscite. L'ingresso è instradato sull'uscita scelta dalle linee di selezione, e le altre uscite restano a 0. Con l'ingresso dati fisso a 1 è esattamente un decodificatore. Un multiplexer a un capo di un filo e un demultiplexer all'altro permettono a molti segnali di condividere quel filo, uno alla volta: è l'idea che sta dietro ogni linea condivisa, compresi i bus della Lezione 14.

## Slide 14: Il comparatore

Un *comparatore* riceve due parole e produce un bit, che vale 1 quando sono uguali. Due bit sono uguali quando il loro XNOR vale 1; due parole sono uguali quando lo sono tutte le loro coppie di bit, quindi il comparatore è un AND di XNOR. Il disegno lo mostra per parole di due bit. Nel processore decide i salti `beq` e `bne`: i due registri vengono confrontati, e il salto avviene o no secondo il risultato.

## Slide 15: Parità

Il codice ridondante più semplice aggiunge a ogni parola un *bit di parità*, scelto in modo che il numero totale di 1 sia, per esempio, pari. Il circuito che lo calcola è una *rete di parità*, una catena di XOR: lo XOR di tutti i bit di una parola vale 1 quando il numero di 1 è dispari, perché XOR è la somma modulo 2. La rete si usa due volte: da chi trasmette, per calcolare il bit da aggiungere, e da chi riceve, per verificare la parità di ciò che è arrivato.

## Slide 16: La ALU è un insieme di macchine e un multiplexer

La ALU riceve due parole, A e B. Al suo interno più unità lavorano insieme sugli stessi operandi: un addizionatore che fa anche le sottrazioni, una fila di porte AND, una di porte OR, una di porte XOR, uno shifter. Tutte producono un risultato. Un multiplexer lascia passare uno dei risultati, e le sue linee di selezione vengono da un decodificatore che legge l'istruzione. Non c'è memoria da nessuna parte: la ALU è un'unica grande macchina combinatoria, e il suo percorso più lento, la catena dei riporti dell'addizionatore, limita il clock del processore.

## Slide 17: Verifica la comprensione: Quanti bit richiede un codice binario a lunghezza fissa per le 26 lettere dell'alfabeto? / Un decodificatore ha 3 linee di ingresso e nessuna abilitazione. Quante uscite ha, e quante valgono 1 in ogni istante?

Usate la formula del codice a lunghezza fissa: il più piccolo m tale che 2 alla m sia almeno 26. Quattro bit danno sedici parole, che non bastano. E notate che il risultato lascia alcune parole inutilizzate.

Un decodificatore con m ingressi ha 2 alla m uscite, e la sua uscita è una rappresentazione decodificata: in ogni istante è attiva esattamente una linea.

## Slide 18: Verifica la comprensione: Di quante linee di selezione ha bisogno un multiplexer con 8 ingressi dati? / Una parola con un bit di parità pari viene ricevuta con due bit alterati. Il controllo di parità:

La relazione è l'inversa della precedente: n linee di selezione scelgono tra 2 alla n ingressi. Otto è 2 alla terza.

Contate gli 1. Un controllo di parità sa soltanto se il loro numero è pari o dispari. Alterare un bit cambia questo fatto; alterarne due lo cambia due volte, e lo riporta dov'era.

## Slide 19: Glossario: inglese e italiano

Dodici termini. *Enable*, abilitazione, è l'ingresso che accende o spegne un blocco. *Code word*, parola codice, è ciascuna stringa di un codice. Multiplexer e demultiplexer conservano il nome anche in italiano. Un *transcoder*, transcodificatore, converte tra due codici. Il *parity bit*, bit di parità, è il bit ridondante aggiunto per il controllo.

## Slide 20: Conclusioni e letture

Cinque conclusioni. Un codice scrive ogni elemento di un insieme come stringa di simboli su un alfabeto, la sua parola codice. Un codice binario a lunghezza fissa richiede il logaritmo di N bit, arrotondato per eccesso; un codice ridondante ne spende di più per rilevare gli errori. Codifica, decodifica e transcodifica sono svolte da macchine combinatorie. I multiplexer selezionano una sorgente, i demultiplexer una destinazione, comparatori e reti di parità controllano. E il processore li usa tutti. A queste macchine manca la memoria: dopo la Parte 2 di Verm1, la aggiunge la Lezione 13.
