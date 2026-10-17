# Lezione 00: Introduzione al corso

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

Stato di apprendimento di questa lezione. DA COMPRENDERE OGGI: il metodo: prima il programma; le regole del corso. DA UTILIZZARE OGGI: il programma completo, gli strumenti di PRG32 (si usa, non si studia, in questo corso). DA COMPRENDERE PIÙ AVANTI: i componenti di PRG32 (Lezione 01); RISC e un ISA aperto (Lezione 03); il progetto Verm1 (Lezione 07). Una slide senza etichetta è contesto: una storia, un esempio, una domanda, un esercizio.

Percorso. I risultati di oggi: (1) descrivere i quattro passi della spirale di apprendimento e dire perché la previsione viene prima dell'esecuzione; (2) enunciare le regole di valutazione: una prova intercorso, due parti d'esame da superare entrambe, nessun dispositivo e nessuna IA. Si appoggia su: niente: è la prima lezione. Prossimo passo: Lezione 01, PRG32 e PRG32-QT: allestire la propria officina.

Il filo della lezione: Il corso segue un solo metodo: giocare, osservare, formalizzare, ritornare. Ogni argomento comincerà come qualcosa visto su PRG32 e finirà come una regola che permette di prevederlo. Prossimo passo: installare il laboratorio.

## Slide 1: Introduzione al corso

Questa prima lezione non insegna nessun argomento tecnico. Spiega come funziona il corso: il suo metodo, la macchina su cui si prova ogni idea, il progetto che attraversa il semestre, e le regole dell'esame. Il corso non presuppone alcuna esperienza: la maggior parte degli studenti in aula non ha mai scritto un *programma*, un elenco di *istruzioni*, ordini piccoli ed esatti, che un computer esegue una dopo l'altra. Il materiale è scritto per loro. Ogni parola tecnica è spiegata la prima volta che compare, in queste note o sulla slide. L'epigrafe da *Matrix* esprime l'idea del corso: un computer è un sistema, e un sistema di cui si possono aprire, nominare e capire le parti smette di essere un mistero. Il sottotitolo, *prima programmare, poi formalizzare*, è il metodo dell'intero corso; le slide che seguono ne sono le conseguenze.

## Slide 2: Oggi

La lezione ha cinque parti: le persone e le ore, l'approccio, la macchina, il progetto e le regole. L'ordine è voluto. Le regole hanno senso solo quando si sa che cosa chiede il corso, e ciò che chiede discende dal suo metodo: per questo il metodo viene per primo. Una parola della slide può essere nuova. Un *debugger* è uno strumento che permette di osservare un programma mentre gira, di fermarlo e di guardare dentro la macchina; il corso ne usa uno ogni settimana. Chi vuole sapere dell'esame lo trova nell'ultima parte.

## Slide 3: Il corso in breve

Il corso vale 12 crediti ECTS, cioè 96 ore, divise in parti uguali tra lezioni (Prof. Montella) e laboratorio (Prof.ssa Staffa): due docenti, un corso, un solo voto finale. Non ci sono prerequisiti, e lo si intende alla lettera. Non si presuppone né esperienza di programmazione né conoscenza di come è fatto un computer; tutto ciò che serve si impara qui, a partire dalle parole stesse. Ciò che serve è la curiosità di capire come funziona davvero un computer, e un lavoro regolare: un po' ogni settimana rende molto più che tanto alla fine. Orario di ricevimento e codice di Teams vanno annotati subito; una domanda fatta nelle prime settimane è quella che costa meno risolvere.

## Slide 4: Prima si programma. Poi si formalizza.

Il metodo in una frase. Il *processore* è la parte del computer che lavora: esegue *istruzioni*, ordini piccoli ed esatti come "somma questi due numeri". L'*assembly* è un modo di scrivere quelle istruzioni come brevi parole, un'istruzione per riga, invece che come numeri. *Prima programmare* significa che dalla prima settimana gli studenti scrivono assembly RISC-V, e un processore vero lo esegue. *Poi formalizzare* significa che la teoria, cioè definizioni, regole e metodi, arriva dopo, come risposta a qualcosa che lo studente ha già visto accadere. La ragione è semplice: una spiegazione resta molto meglio quando risponde a una domanda che ci si è già posti. Della teoria non si toglie nulla, e tutta è oggetto d'esame. Arriva soltanto per seconda.

## Slide 5: La spirale dell'apprendimento, ripetuta per ogni argomento

Ogni argomento percorre gli stessi quattro passi. *Giocare*: si scrivono poche istruzioni e si eseguono. *Osservare*: la macchina fa qualcosa che non ci si aspettava del tutto. Per esempio, un contatore che scende sotto zero mostra 0xFFFFFFFF invece di -1. (Un numero che comincia con `0x` è scritto in *esadecimale*, base sedici; la Lezione 02 mostra come leggerlo.) Oppure un *bit*, una singola cifra *binaria* che vale 0 o 1, accende una lampada sullo schermo. *Formalizzare*: la lezione dà la regola che lo spiega; qui il *complemento a due*, il modo in cui i computer rappresentano i numeri negativi, studiato nella Lezione 05. *Ritornare*: si torna alla macchina e si prevede il risultato prima di eseguire. Il quarto passo è la prova della comprensione. Una previsione giusta mostra che la regola è stata capita; una sbagliata è smentita subito dalla macchina, senza alcun costo. Una *cartuccia*, nominata nella slide, è un programma finito racchiuso in un unico file, come le cartucce delle vecchie console.

## Slide 6: Gli obiettivi del corso

Sono gli obiettivi scritti nel programma ufficiale, e discendono l'uno dall'altro. Prima le idee di base su come sono organizzati i computer. Poi i *linguaggi a basso livello*: il *linguaggio macchina*, i numeri che il processore legge davvero, e l'*assembly*, le stesse istruzioni scritte come parole. Poi la matematica con cui si costruisce un processore: l'*algebra di Boole*, l'algebra del vero e del falso, e l'aritmetica *binaria*, che conta con le sole cifre 0 e 1. Con esse si progettano le *reti logiche*, circuiti che calcolano una risposta dai loro ingressi (*combinatorie*) o che in più ricordano (*sequenziali*). Poi la struttura del processore, della *memoria*, dove si conservano programmi e dati, e dell'ingresso e uscita. Infine il codice assembly, in cui tutti questi livelli si vedono insieme. L'immagine è Pong su PRG32: qualche centinaio di istruzioni, che alla fine del corso gli studenti sapranno leggere una per una.

## Slide 7: PRG32: una console rétro da programmare in assembly

PRG32 è una piccola console di gioco che si programma in assembly o in C, un altro linguaggio di programmazione. Alcune parole della slide vanno spiegate. *Open source* significa che il suo *codice sorgente*, il testo del programma come lo scrivono le persone, è pubblico: chiunque può leggerlo, usarlo e migliorarlo. Il *firmware* è il programma che la console esegue dal momento in cui viene accesa; il *runtime* è la parte di esso che resta sulla macchina ed esegue il gioco dello studente. Il *codice macchina* è il programma nella forma numerica che il processore legge; RV32IMAC nomina l'*insieme di istruzioni*, l'elenco delle istruzioni che questo particolare processore capisce. *Interpretato da un simulatore* vorrebbe dire che un altro programma, un *interprete*, imita il processore; sulla scheda di PRG32, invece, il codice gira direttamente sul chip. (PRG32-QT, nella slide successiva, lo interpreta: è così che un portatile può eseguirlo, e la Lezione 01 confronta i due casi.) Il gioco si scrive come tre *funzioni*, pezzi di programma con un nome: `init` gira una volta, mentre `update` e `draw` girano una volta per *frame*, cioè per ogni immagine mostrata sullo schermo. Un gioco finito è una *cartuccia*, un piccolo file che termina in `.prg32`. Lo schermo misura 320 per 200 *pixel*, i punti colorati che compongono un'immagine: abbastanza pochi da poter ragionare su ciascuno.

## Slide 8: PRG32-QT: il debugger del corso

PRG32-QT è PRG32 come applicazione sul proprio portatile. Esegue le stesse cartucce, senza la scheda e senza *compilatore*, il programma che traduce il codice sorgente in codice macchina (per l'assembly il traduttore si chiama assemblatore). È un *emulatore*, più precisamente un interprete: un programma che imita via software il processore della console, un'istruzione alla volta. La sua modalità debug apre la macchina. Il programma si può mettere in pausa e riprendere, o far avanzare un'istruzione alla volta. Un *breakpoint* è un segno su un'istruzione che ferma il programma quando ci arriva. Un *registro* è una delle 32 piccole celle di memorizzazione dentro il processore, ciascuna con un numero a 32 bit; il processore calcola solo sui registri. La *memoria* è una fila molto più grande di celle, ciascuna con un *byte*, otto bit, e ciascuna con un numero, il suo *indirizzo*. PRG32-QT mostra i registri e 128 byte di memoria a qualsiasi indirizzo, e può rallentare un gioco fino a un centesimo della sua velocità. L'ultima riga della slide è la prova pratica di comprensione usata in tutto il corso: saper dire che cosa conterrà ogni registro prima di premere Step.

## Slide 9: Perché RISC-V?

Quattro ragioni spiegano la scelta di RISC-V. È *aperto*: l'insieme di istruzioni è uno standard pubblico, e chiunque può costruire un processore RISC-V senza pagare una licenza. È *piccolo*: circa quaranta istruzioni di base e trentadue registri, abbastanza pochi da impararli tutti in un semestre. È *reale*: le istruzioni della slide, `addi`, `lw`, `sw`, `beqz`, sono eseguite da miliardi di dispositivi commerciali, quindi nulla di ciò che si impara qui è un giocattolo. Ed è *strategico*: progetti europei costruiscono su di esso i propri processori. Per un principiante conta soprattutto la seconda ragione: alla fine del corso gli studenti conosceranno l'intero insieme di istruzioni di base, non una selezione.

## Slide 10: La mappa: ogni argomento si incontra due volte

Questa tabella è l'intero corso in una pagina. La colonna di sinistra elenca la teoria; quella di destra dice dove ogni argomento si incontra per la prima volta sulla macchina, come qualcosa che si vede accadere. Molte parole della colonna di sinistra sono nuove, ed è previsto: ciascuna è il titolo di una lezione, e la tabella mostra soltanto dove arriverà. Due esempi. Il complemento a due, il modo in cui si conservano i numeri negativi, compare la prima volta come una posizione che si sposta a sinistra oltre lo zero. Le reti sequenziali, circuiti che ricordano, compaiono la prima volta come un contatore che conserva il suo valore da un frame all'altro. Lo *stack*, più in basso, è una zona di memoria in cui una funzione tiene i suoi valori temporanei (Lezione 18). Conviene riguardare la tabella all'inizio di ogni blocco, ed è un'ottima lista di controllo per il ripasso.

## Slide 11: Verm1: il vostro gioco, da un file vuoto

Il progetto del corso è Verm1, che si legge "vermone": un omaggio a Snake, in cui un verme si muove su una griglia, mangia, cresce e non deve mordersi. Le regole stanno in una frase, eppure scriverlo usa quasi ogni argomento del corso: i numeri per le posizioni, la logica per i comandi, la memoria per il corpo, le funzioni e la divisione per il punteggio. Gli studenti scrivono ogni riga da sé. Non c'è un motore di gioco, solo poche chiamate di PRG32, funzioni già pronte che disegnano un rettangolo, leggono i pulsanti o suonano una nota. Il gioco finito porta il nome del suo autore.

## Slide 12: Quattro parti e una pubblicazione

Il progetto cresce in quattro parti e una pubblicazione; ogni parte arriva subito dopo le lezioni che usa. La Parte 1 (Lezione 07) usa i numeri: una griglia e una testa che si muove. La Parte 2 (Lezione 12) usa la logica: la guida, il cibo e un punteggio. La Parte 3 (Lezione 17) usa lo stato e la memoria: un corpo che cresce, le collisioni e tre schermate. La Parte 4 (Lezione 22) usa l'organizzazione della macchina: cifre sullo schermo, livelli e disegno veloce. La Lezione 23 pubblica il gioco sul Cartridge Store. La colonna di destra nomina le tecniche; parole come *array*, una fila di valori dello stesso tipo conservati uno dopo l'altro in memoria, sono spiegate nella lezione che le usa. La didascalia dice la regola più importante: ogni parte si chiude con un gioco che gira.

## Slide 13: Il corso a blocchi

Il calendario del corso, a blocchi. Dopo le tre lezioni iniziali vengono quattro blocchi di quattro lezioni ciascuno. *Informazione*: che cosa significa un bit, e come si scrivono i numeri con i bit. *Logica*: come si combinano i bit. *Stato e memoria*: come si conservano i bit. *La macchina*: il processore e i suoi dispositivi. Ogni blocco si chiude con una parte di Verm1; la Lezione 23 pubblica il gioco e la Lezione 24 guarda a macchine più veloci. Gran parte dei titoli della slide, dal bus alle interruzioni alle FPGA, nomina cose non ancora incontrate: ciascuna è spiegata nella sua lezione, e oggi non serve capire nulla di tutto ciò. I numeri delle lezioni di questa slide sono usati ovunque nel materiale, quindi un riferimento come "Lezione 13" si ritrova sempre qui.

## Slide 14: Orario: da settembre a dicembre 2026

Il corso si riunisce quattro volte a settimana da settembre a dicembre, sempre in Aula 1: lunedì pomeriggio e mercoledì mattina con il Prof. Montella, martedì e venerdì mattina con la Prof.ssa Staffa. Lezioni e laboratorio non si alternano secondo uno schema fisso. Un calendario interno, condiviso con la classe, dà la distribuzione reale settimana per settimana; è quel calendario, non questa tabella da sola, a dire che cosa preparare per un dato giorno.

## Slide 15: Una sola prova intercorso

C'è una sola prova intercorso: dieci domande a risposta multipla e due esercizi, su carta, in circa 45 minuti. Servono un documento d'identità e una penna, e bisogna conoscere il proprio indirizzo e-mail istituzionale e il proprio numero di matricola. La prova ha due scopi: misura i progressi di ogni studente, e dice ai docenti come sta andando il corso. La preparazione è già dentro le lezioni, ciascuna delle quali si chiude con domande proprio di questo tipo. Rispondere settimana per settimana richiede pochi minuti; lasciarle tutte alla sera prima non funziona.

## Slide 16: Niente tecnologia. Niente GPT.

La regola per la prova intercorso e per l'esame finale è breve: nessun dispositivo e nessun aiuto di alcun tipo, umano o artificiale. Ciò include ChatGPT, gli altri grandi modelli linguistici, e ogni altra forma di intelligenza artificiale generativa. Copiare annulla subito la prova. La regola non è ostilità verso la tecnologia, che il corso usa ogni giorno; discende da ciò a cui serve una prova. Una prova misura ciò che il candidato sa. Una risposta prodotta da qualcun altro, o da qualcos'altro, non misura nulla e non aiuta nessuno, men che meno il candidato.

## Slide 17: Valutazione

L'esame ha due parti, ed entrambe vanno superate. La parte di teoria è un esame orale su tutto il programma, in cui alcune risposte richiedono un disegno o un calcolo alla lavagna. La parte pratica è l'esame di laboratorio con la Prof.ssa Staffa. Ciascuna vale metà, e il voto finale è la loro media. L'orale può anche abbassare il voto della prova intercorso: la prova intercorso è un risultato vero, non una garanzia. Come la prova intercorso entri nel voto di teoria è spiegato in aula.

## Slide 18: Appelli e verbalizzazione

Il voto finale si verbalizza solo quando entrambe le parti sono superate, e solo durante un appello di teoria; l'esame di laboratorio di solito lo precede di circa una settimana. Entrambi vanno prenotati su Esse3, il sistema online dell'ateneo. Le due domande più frequenti hanno la stessa risposta: la parte di teoria si può sostenere prima di quella pratica, e il suo risultato resta valido per l'anno accademico, ma nulla si verbalizza finché entrambe non sono superate. Conviene pianificare insieme i due esami.

## Slide 19: Materiale didattico

Il materiale viene da quattro fonti. Le slide sono in una cartella condivisa di Google Drive e sono pubblicate di tanto in tanto sul portale di e-learning. PRG32 e il suo libro, *Playing with RISC-V*, sono gratuiti e open source su GitHub, un sito che ospita il codice sorgente di molti progetti. I libri di riferimento sono Patterson e Hennessy, *Computer Organization and Design*, edizione RISC-V, e Tanenbaum e Austin, *Structured Computer Organization*; entrambi esistono in italiano. La documentazione ufficiale di RISC-V è su riscv.org. Il primo giorno non serve comprare nulla: le slide e il materiale di PRG32 bastano finché non comincia la teoria, e a quel punto conviene scegliere un libro.

## Slide 20: Primo contatto: chi siete?

Sei gruppi di domande aprono la conversazione: hardware, software, cultura, concetti, RISC-V e gli studenti stessi. Non ci sono risposte giuste e nulla viene valutato. Lo scopo è capire da dove parte la classe. Chi non ha mai montato un computer né letto una riga di assembly è la maggioranza, ed è esattamente dove il corso se lo aspetta: si parte da zero. Chi l'ha fatto troverà occasioni per aiutare i vicini, che è a sua volta uno dei modi migliori di imparare. *Hardware* indica le parti fisiche di un computer; *software* i programmi che vi girano.
