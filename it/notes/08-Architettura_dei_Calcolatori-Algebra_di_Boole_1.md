# Lezione 08: Elementi di algebra di Boole

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: le maschere di bit; l'architettura di von Neumann; analisi e sintesi; l'algebra di Boole; le porte logiche. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: minimizzazione, Karnaugh (Lezione 09). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) distinguere l'analisi di un circuito logico dalla sua sintesi; (2) applicare gli assiomi e i teoremi dell'algebra di Boole, compreso De Morgan; (3) porre a 1, azzerare e verificare bit con le maschere. Si appoggia su: l'architettura di von Neumann (Lezione 03). Prossimo passo: Lezione 09, Elementi di algebra di Boole.

Il filo della lezione: andi t3, t0, 1 è una fila di 32 porte AND: l'algebra di Boole descrive sia l'istruzione sia il circuito. Prossimo passo: da una tabella di verità al circuito più piccolo.

## Slide 1: Elementi di algebra di Boole

Si apre il secondo blocco del corso: la logica. Stabilito che cosa significano i bit, il corso si chiede come si combinano. L'algebra di Boole è in realtà in uso fin dalle prime settimane, ogni volta che un pulsante è stato verificato con `andi`; questa lezione dà un nome a quell'operazione e costruisce l'algebra attorno a essa. Il Bianconiglio in copertina, sempre di fretta, è un emblema appropriato: anche il processore realizza ogni cosa attraverso minuscoli passi logici, miliardi al secondo.

## Slide 2: Che cosa saprete fare alla fine

Cinque risultati di apprendimento. Descrivere un calcolatore come tre sottosistemi collegati da un bus. Distinguere i due problemi fondamentali del progetto logico, analisi e sintesi. Scrivere le tavole di verità di sei porte e riconoscerne i simboli. Applicare le proprietà dell'algebra, leggi di De Morgan comprese, per semplificare un'espressione. E, tornando alla macchina, usare le istruzioni bit a bit di RISC-V per verificare, porre a uno, azzerare e invertire singoli bit di un registro.

## Slide 3: Il calcolatore elettronico: tre sottosistemi e un bus

Un calcolatore comprende tre sottosistemi: il processore, che esegue le istruzioni; la memoria centrale, che contiene istruzioni e dati; e il sottosistema di ingresso/uscita, che collega la macchina al mondo. Comunicano attraverso un *bus*, un insieme di linee condivise diviso in linee di indirizzo, linee di dato e linee di controllo. È il modello di von Neumann della Lezione 03 espresso in termini contemporanei. Tutto ciò che viaggia sul bus è una configurazione di bit. Sull'ESP32-C6 i tre sottosistemi risiedono su un solo chip.

## Slide 4: Il processore

Il processore è la sede della capacità di calcolo. Esegue istruzioni, comandi espliciti di due tipi: quelli che governano il trasferimento dell'informazione, dentro il calcolatore e tra esso e i suoi dispositivi, e quelli che specificano operazioni aritmetiche e logiche. La memoria contiene sia i dati sia la sequenza delle istruzioni, e una sequenza di istruzioni memorizzata è un *programma*. Il processore svolge un'unica attività all'infinito: preleva un'istruzione, la esegue e ricomincia. La Lezione 19 esamina questo ciclo nel dettaglio.

## Slide 5: Che tipo di sistema è un calcolatore elettronico?

Quattro attributi caratterizzano un calcolatore elettronico. *Numerico*, o digitale: ogni informazione è rappresentata come stringa di bit. *Automatico*: una volta avviato, procede senza intervento. *A programma memorizzato*: il programma risiede in memoria e si può sostituire, quindi la stessa macchina svolge compiti diversi. *Elettronico*: è costruito con circuiti che memorizzano ed elaborano bit. Ogni attributo esclude qualcosa: un abaco è numerico ma non automatico; un carillon meccanico è automatico ma il suo programma è fisso.

## Slide 6: Circuiti logici

I circuiti che memorizzano ed elaborano i bit si chiamano circuiti di commutazione, o *circuiti logici*; interconnessi formano una rete di commutazione, e il loro progetto si chiama progetto logico. Descriverne il comportamento richiede un'algebra, che svolge per i circuiti il ruolo che l'algebra ordinaria svolge per le grandezze: una notazione in cui si può calcolare invece di enumerare ogni caso. I valori sono due, 0 e 1, che corrispondono fisicamente a due livelli di tensione o a due stati di un interruttore, una corrispondenza che la Lezione 10 rende precisa.

## Slide 7: Due problemi, una sola algebra

Due problemi, affrontati con una sola algebra. *Analisi*: data la struttura di un circuito, come è fatto, determinarne il comportamento, che cosa calcola. Leggere `andi t3, t0, 1` e dire che cosa conterrà `t3` è analisi. La *sintesi* procede nella direzione opposta: da un comportamento specificato a una struttura che lo realizza, per esempio dalla tavola di una somma a un sommatore. L'analisi ha una risposta unica; la sintesi in generale ne ha molte, e scegliere la meno costosa tra esse è il problema della minimizzazione trattato nella Lezione 09.

## Slide 8: Algebra di Boole

Nell'algebra di Boole una variabile assume due soli valori, 0 e 1, e ci sono tre operazioni fondamentali. AND, il prodotto logico, scritto con un punto o per giustapposizione. OR, la somma logica, scritta con il segno più. NOT, il complemento, scritto qui con un apice, x', per comodità di battitura. La notazione non deve trarre in inganno: il segno più non indica una somma aritmetica, come mostra subito la tavola di verità dell'OR.

## Slide 9: Le tre operazioni fondamentali

Ogni riquadro presenta un'operazione in tre forme: il simbolo della porta, la notazione algebrica e la *tavola di verità*, che elenca l'uscita per ogni combinazione degli ingressi. AND dà 1 solo quando entrambi gli ingressi sono 1. OR dà 0 solo quando entrambi gli ingressi sono 0, quindi 1 OR 1 vale 1, non 2. NOT ha un solo ingresso e lo inverte. Le tre forme vanno imparate: dorso piatto e fronte arrotondata per AND, dorso curvo e fronte appuntita per OR, un triangolo con un cerchietto per NOT.

## Slide 10: Altre tre porte che incontrerete ovunque

Altre tre porte. XOR, l'OR esclusivo, dà 1 quando i suoi ingressi differiscono; è il bit di somma di un'addizione a un bit, come mostra il riscaldamento della Lezione 09. NAND e NOR sono AND e OR seguiti da una negazione, e il cerchietto all'uscita di un simbolo indica sempre NOT. NAND dà 0 solo quando entrambi gli ingressi sono 1; NOR dà 1 solo quando entrambi sono 0. La loro importanza pratica sta nel fatto che sono le porte più economiche da costruire con i transistor, come dimostra la Lezione 10.

## Slide 11: Proprietà dell'algebra di Boole (1)

Le prime quattro proprietà, ciascuna enunciata in una forma per AND e in una per OR. Commutatività e associatività valgono come nell'algebra ordinaria, e la seconda permette di estendere AND e OR a un numero qualsiasi di operandi. L'*idempotenza* è nuova: x AND x è x, e x OR x è x; ripetere una variabile non aggiunge nulla. L'*assorbimento* è la più utile per semplificare: x OR (x AND y) è uguale a x, perché quando x è 1 il risultato è 1 qualunque sia y, e quando x è 0 entrambi i termini sono 0.

## Slide 12: Proprietà dell'algebra di Boole (2)

Altre cinque proprietà. La prima legge distributiva è quella familiare. La seconda, x + yz = (x + y)(x + z), non ha corrispondente nell'algebra ordinaria: qui anche l'OR si distribuisce sull'AND. Poi le costanti: 1 è l'elemento neutro dell'AND e 0 quello dell'OR; 0 annulla un AND e 1 satura un OR. Le leggi del complemento affermano che una variabile combinata con la sua negazione dà 0 con l'AND e 1 con l'OR. L'involuzione: la doppia negazione restituisce la variabile. Due di queste proprietà, l'elemento neutro e l'elemento nullo, sono esattamente ciò che fa funzionare una maschera di bit.

## Slide 13: Le leggi di De Morgan

Le leggi di De Morgan collegano le tre operazioni: il complemento di un prodotto è la somma dei complementi, e il complemento di una somma è il prodotto dei complementi. La tabella dimostra la prima per *induzione completa*: poiché ogni variabile assume due soli valori, una legge si può stabilire verificando in modo esaustivo ogni riga, e le due colonne evidenziate coincidono. In termini di porte, un NAND è un OR con ingressi negati. Queste leggi si useranno di continuo, sulla carta e nei programmi.

## Slide 14: Dualità e precedenza

Due principi generali. La *dualità*: ogni identità resta valida scambiando AND e OR insieme a 0 e 1; è per questo che le proprietà comparivano a coppie, e dimezza il lavoro di dimostrarle. La *precedenza*: si applica prima NOT, poi AND, poi OR, così come l'elevamento a potenza precede la moltiplicazione e la moltiplicazione precede la somma; le parentesi cambiano l'ordine. E una definizione da conservare: due espressioni sono equivalenti quando hanno la stessa tavola di verità.

## Slide 15: Semplificare con l'algebra

L'algebra al lavoro. L'espressione xy + xy' richiede due porte AND, una porta OR e un invertitore. Raccogliendo x con la legge distributiva si ottiene x(y + y'); la legge del complemento riduce la parentesi a 1; la legge dell'elemento neutro lascia x. Quattro porte sono diventate un filo. Ogni riga della derivazione nomina la legge che la giustifica, e questa disciplina va adottata: in una semplificazione ogni passo deve essere attribuibile a una legge. La didascalia mostra una seconda semplificazione che tornerà nella Lezione 09.

## Slide 16: Verifica la comprensione: Per quali ingressi x NAND y vale 0? / Per De Morgan, (a . b')' è uguale a:

Per la prima domanda, NAND è AND seguito da NOT. Partendo dall'AND si individua l'unica riga della sua tavola con uscita 1; è l'unica riga in cui NAND dà 0.

Per la seconda si applica la prima legge di De Morgan al prodotto di a e b': il complemento diventa la somma dei complementi, a' più il complemento di b'. L'involuzione semplifica poi il secondo termine.

## Slide 17: Verifica la comprensione: t0 = 0x0000005A. Che cosa c'è in t1 dopo andi t1, t0, 0x0F? / Quale istruzione porta a 1 il bit 5 di t0 e lascia invariati tutti gli altri bit?

Per la prima domanda, 0x5A si scrive in binario, 0101 1010, e la maschera 0x0F come 0000 1111. L'AND conserva i bit dove la maschera ha un 1, i quattro bassi, e azzera gli altri.

Per la seconda, le quattro istruzioni si confrontano con la tabella delle operazioni con maschera. AND con 0x20 azzererebbe ogni altro bit; XOR invertirebbe il bit, portando un 1 a 0; una somma aritmetica funzionerebbe solo se il bit fosse 0, e altrimenti propagherebbe un riporto. Solo OR pone a uno il bit lasciando invariati tutti gli altri.

## Slide 18: Glossario: inglese e italiano

Dodici termini. La *tavola di verità* definisce una funzione enumerandone in modo esaustivo i casi. *Prodotto logico* e *somma logica* sono AND e OR. *To set*, *to clear* e *to toggle* un bit significano porlo a 1, porlo a 0 e invertirlo; l'italiano non ha verbi singoli per questi e usa brevi locuzioni.

## Slide 19: Conclusioni e letture

Quattro conclusioni. L'architettura di von Neumann descrive una macchina reale in forma semplificata. L'algebra di Boole descrive le funzioni logiche che i circuiti elettronici realizzano. Tre operazioni, una manciata di proprietà e le leggi di De Morgan bastano per trasformare qualsiasi espressione. E un'istruzione bit a bit è l'algebra applicata in parallelo a trentadue bit, con la maschera come leggi dell'elemento neutro e dell'elemento nullo al lavoro. La prossima lezione passa dagli operatori alle funzioni: forme canoniche e minimizzazione.
