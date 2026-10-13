# Lezione 08: Elementi di algebra di Boole

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: Elementi di algebra di Boole

Comincia il secondo blocco del corso: la logica. Dopo aver imparato che cosa significano i bit, imparate come si combinano. In realtà usate l'algebra di Boole fin dai primi giorni, ogni volta che avete esaminato un pulsante con `andi`; questa lezione dà un nome a quell'operazione e le costruisce attorno l'algebra. Il Bianconiglio in copertina va sempre di fretta: anche il processore fa tutto a minuscoli passi logici, miliardi al secondo.

## Slide 2: Che cosa saprete fare alla fine

Cinque obiettivi. Descrivere un calcolatore come tre sottosistemi collegati da un bus. Distinguere i due problemi del progetto logico, analisi e sintesi. Scrivere le tabelle di verità e riconoscere i simboli di sei porte. Applicare le proprietà dell'algebra, leggi di De Morgan comprese, per semplificare un'espressione. E, di ritorno sulla macchina, usare le istruzioni bit a bit di RISC-V per esaminare, porre a 1, azzerare e invertire singoli bit di un registro.

## Slide 3: Il calcolatore elettronico: tre sottosistemi e un bus

Un calcolatore ha tre sottosistemi: il processore, che esegue le istruzioni; la memoria centrale, che contiene istruzioni e dati; e l'ingresso/uscita, che collega la macchina al mondo. Sono uniti da un *bus*, un insieme di fili condivisi diviso in linee degli indirizzi, linee dei dati e linee di controllo. È il modello di von Neumann della Lezione 03 in termini odierni. Tutto ciò che viaggia sul bus è una configurazione di bit. Sull'ESP32-C6 tutto questo sta dentro un solo chip.

## Slide 4: Il processore

Nel processore risiede la capacità di elaborazione. Esegue istruzioni, che sono comandi espliciti di due tipi: quelli che governano il trasferimento dell'informazione, dentro il calcolatore e da e verso i dispositivi, e quelli che specificano operazioni aritmetiche e logiche. La memoria contiene i dati e la sequenza delle istruzioni, e una sequenza di istruzioni memorizzata è un *programma*. Il processore fa una cosa sola, all'infinito: preleva un'istruzione, la esegue, e ripete.

## Slide 5: Che tipo di sistema è un calcolatore elettronico?

Quattro aggettivi definiscono un calcolatore elettronico. *Numerico*, o digitale: tutta l'informazione è fatta di stringhe di bit. *Automatico*: una volta avviato procede da solo. *A programma memorizzato*: il programma sta in memoria e si può sostituire, quindi la stessa macchina fa lavori diversi. *Elettronico*: è costruito con circuiti che memorizzano ed elaborano bit. Ogni aggettivo esclude qualcosa: un abaco è numerico ma non automatico; un carillon meccanico è automatico ma il suo programma è fisso.

## Slide 6: Circuiti logici

I circuiti che memorizzano ed elaborano i bit si chiamano circuiti di commutazione, o *circuiti logici*; collegati tra loro formano una rete di commutazione, e progettarne una è il progetto logico. Per descrivere ciò che fanno questi circuiti si usa un'algebra. Svolge per i circuiti il ruolo che l'algebra ordinaria svolge per le grandezze: una notazione in cui si può calcolare invece di provare ogni caso. I valori sono due, 0 e 1: due livelli di tensione, due stati di un interruttore.

## Slide 7: Due problemi, una sola algebra

Due problemi, e una sola algebra per entrambi. *Analisi*: è data la struttura di un circuito, come è fatto, e se ne deve trovare il comportamento, che cosa fa. Leggere `andi t3, t0, 1` e dire che cosa finisce in `t3` è analisi. La *sintesi* va nell'altro verso: da un comportamento desiderato a una struttura che lo realizza, per esempio dalla tabella di una somma a un addizionatore. La sintesi ha di solito molte soluzioni; scegliere la più economica è l'argomento della prossima lezione.

## Slide 8: Algebra di Boole

Nell'algebra di Boole una variabile può assumere solo due valori, 0 e 1, e le operazioni di base sono tre. AND, il prodotto logico, scritto con un punto o semplicemente accostando le variabili. OR, la somma logica, scritta con il segno più. NOT, il complemento, scritto qui con un apice, come in x', per poterlo battere a tastiera. Non fatevi ingannare dai simboli: il più non è una somma aritmetica, come vedrete subito nella tabella di verità di OR.

## Slide 9: Le tre operazioni fondamentali

Ogni riquadro mostra un'operazione in tre modi: il simbolo della porta, la notazione e la *tabella di verità*, che elenca l'uscita per ogni combinazione degli ingressi. AND dà 1 solo quando entrambi gli ingressi valgono 1. OR dà 0 solo quando entrambi valgono 0, quindi 1 OR 1 fa 1, non 2. NOT ha un solo ingresso e lo inverte. Imparate le tre forme: dorso piatto e fronte tonda per AND, dorso curvo e fronte a punta per OR, un triangolo con un cerchietto per NOT.

## Slide 10: Altre tre porte che incontrerete ovunque

Altre tre porte. XOR, l'or esclusivo, dà 1 quando i due ingressi sono diversi: è il bit di somma di un'addizione a un bit. NAND e NOR sono AND e OR seguiti da una negazione: il cerchietto sull'uscita di un simbolo significa sempre NOT. NAND dà 0 solo quando entrambi gli ingressi valgono 1; NOR dà 1 solo quando entrambi valgono 0. In pratica contano perché sono le porte più economiche da costruire con i transistor, come mostrerà la Lezione 10.

## Slide 11: Proprietà dell'algebra di Boole (1)

Le prime quattro proprietà, ciascuna in due forme, una per AND e una per OR. Commutativa e associativa sono come nell'algebra ordinaria; grazie alla seconda, AND e OR si estendono a un numero qualsiasi di operandi. L'*idempotenza* è nuova: x AND x è x, e x OR x è x; ripetere una variabile non aggiunge nulla. L'*assorbimento* è la più utile per semplificare: x OR (x AND y) è semplicemente x, perché quando x vale 1 il risultato è 1 qualunque sia y, e quando x vale 0 entrambi i termini valgono 0.

## Slide 12: Proprietà dell'algebra di Boole (2)

Altre cinque proprietà. La prima legge distributiva è quella consueta. La seconda, x + yz = (x + y)(x + z), non ha equivalente nell'algebra ordinaria: qui anche OR si distribuisce rispetto ad AND. Poi le costanti: 1 è l'elemento neutro per AND e 0 per OR; 0 annulla un AND e 1 satura un OR. Le leggi del complemento dicono che una variabile e la sua negazione danno 0 con AND e 1 con OR. Involuzione: negare due volte restituisce la variabile. Due di queste, elemento neutro ed elemento nullo, spiegano come funziona una maschera.

## Slide 13: Le leggi di De Morgan

Le leggi di De Morgan collegano le tre operazioni: il complemento di un prodotto è la somma dei complementi, e il complemento di una somma è il prodotto dei complementi. La tabella dimostra la prima per *induzione perfetta*: poiché le variabili hanno solo due valori, una legge si verifica controllando ogni riga. Le due colonne evidenziate sono identiche. In termini di porte: un NAND è un OR con gli ingressi negati. Userete queste leggi di continuo, su carta e nei programmi.

## Slide 14: Dualità e precedenza

Due regole generali. *Dualità*: ogni identità resta vera scambiando AND con OR e 0 con 1; per questo le proprietà venivano a coppie, e dimostrarle costa la metà. *Precedenza*: prima si applica NOT, poi AND, poi OR, come le potenze vengono prima dei prodotti e i prodotti prima delle somme; le parentesi cambiano l'ordine. E una definizione da ricordare: due espressioni sono equivalenti quando hanno la stessa tabella di verità.

## Slide 15: Semplificare con l'algebra

L'algebra al lavoro. L'espressione xy + xy' richiede due porte AND, una OR e un invertitore. Raccogliendo x con la legge distributiva si ottiene x(y + y'); la legge del complemento trasforma la parentesi in 1; l'elemento neutro lascia x. Tre porte sono diventate un pezzo di filo. Ogni riga della tabella nomina la legge che la giustifica: quando semplificate, siate sempre in grado di dire quale legge state applicando. La didascalia mostra una seconda semplificazione che servirà ancora.

## Slide 16: Verifica la comprensione: Per quali ingressi x NAND y vale 0? / Per De Morgan, (a . b')' è uguale a:

NAND è AND seguito da NOT. Partite da AND: per quale unica riga della sua tabella l'uscita vale 1? Quella è la sola riga in cui NAND vale 0.

Applicate la prima legge di De Morgan al prodotto di a e b': il complemento diventa la somma dei complementi, a' più il complemento di b'. Poi usate l'involuzione sul secondo termine.

## Slide 17: Verifica la comprensione: t0 = 0x0000005A. Che cosa c'è in t1 dopo andi t1, t0, 0x0F? / Quale istruzione porta a 1 il bit 5 di t0 e lascia invariati tutti gli altri bit?

Scrivete in binario 0x5A, 0101 1010, e la maschera 0x0F, 0000 1111. L'AND conserva i bit dove la maschera ha 1, i quattro bassi, e azzera gli altri.

Confrontate le quattro istruzioni con la tabella della maschera. AND con 0x20 azzererebbe tutti gli altri bit. XOR invertirebbe il bit, trasformando un 1 in uno 0. Una somma aritmetica funzionerebbe solo se il bit fosse 0, e altrimenti produrrebbe un riporto. Solo OR pone il bit a 1 e lascia invariato il resto.

## Slide 18: Glossario: inglese e italiano

Dodici termini. *Truth table*, tabella di verità, è la tabella che definisce una funzione elencando tutti i casi. *Logical product* e *logical sum*, prodotto e somma logica, sono AND e OR. *To set*, *to clear* e *to toggle* un bit significano porlo a 1, azzerarlo e invertirlo; l'italiano non ha verbi singoli e usa brevi locuzioni.

## Slide 19: Conclusioni e letture

Quattro conclusioni. L'architettura di von Neumann descrive in forma semplificata una macchina reale. L'algebra di Boole descrive funzioni logiche che i circuiti elettronici possono realizzare. Tre operazioni, poche proprietà e le leggi di De Morgan bastano a trasformare qualunque espressione. E un'istruzione bit a bit è l'algebra applicata a trentadue bit insieme, con la maschera come legge dell'elemento neutro al lavoro. La prossima lezione passa dagli operatori alle funzioni: forme canoniche e minimizzazione.
