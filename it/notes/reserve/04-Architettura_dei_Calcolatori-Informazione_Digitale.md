# Lezione 04: Rappresentare l'informazione digitale

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Numeri: naturali, interi, reali

Un'anteprima delle due lezioni successive. I numeri naturali sono la configurazione posizionale stessa: con n bit, da 0 a 2 alla n meno 1. Gli interi con segno usano il *complemento a due*, argomento della Lezione 05. I numeri reali usano la virgola fissa o la virgola mobile dello standard IEEE 754, argomento della Lezione 06, in cui i bit si dividono in segno, esponente e frazione. Oggi non vi si chiede di capire i formati: solo di vedere che anche i numeri hanno bisogno di una convenzione.

## Dati, big data e data science

I *big data* sono dati che superano ciò che gli strumenti tradizionali delle basi di dati riescono a trattare, per quantità o per varietà: tabelle strutturate e testo non strutturato, posizioni, serie temporali. Gli ordini di grandezza sono petabyte e zettabyte. Estrarne conoscenza e valore richiede il calcolo parallelo, e la disciplina che se ne occupa è la *data science*. Tenete il legame con le slide precedenti: per quanto grandi, questi dati sono sempre byte con una convenzione.

## Da dove vengono i dati

Quattro fonti di dati: i sensori, che misurano il mondo fisico; le transazioni, che registrano ogni acquisto; i dati pubblici, aperti dalle istituzioni; e i social media, dove le persone lasciano preferenze e opinioni. Ogni fonte pone i propri problemi di qualità e di riservatezza. Prima di essere analizzati i dati vanno acquisiti, puliti, memorizzati e integrati: in pratica questa preparazione è la parte maggiore del lavoro.

## GPGPU: calcolo di uso generale su processori grafici

Un processore grafico, o GPU, ha migliaia di core semplici progettati per applicare la stessa operazione a molti dati insieme. La figura mostra una somma parallela: i numeri si sommano a coppie, poi le somme parziali a coppie, e così via, così che N numeri richiedono circa log2 N passi invece di N. L'hardware nato per i videogiochi è quello che oggi addestra le reti neurali. Sotto ogni core ci sono pur sempre registri, istruzioni e bit; la Lezione 24 torna sulle GPU.

## Data mining

Il *data mining* è l'insieme delle tecniche per estrarre informazione e conoscenza da grandi quantità di dati. La slide nomina tre famiglie: gli alberi di decisione, che classificano con una sequenza di domande; l'apprendimento di regole e i metodi bayesiani, che ragionano con le probabilità; e le reti neurali, che riconoscono schemi. Sono argomenti di corsi successivi. Qui basta sapere che esistono e che sono algoritmi come gli altri.

## Algoritmi deterministici e non deterministici

In un algoritmo *deterministico* lo stesso ingresso produce sempre la stessa sequenza di passi e lo stesso risultato: `first_update` somma sempre uno. Un algoritmo *non deterministico* può comportarsi in modo diverso a ogni esecuzione con lo stesso ingresso. Le ragioni comuni sono due: usa di proposito numeri casuali, come un gioco che piazza un nemico a caso, oppure dipende dai tempi di più cose che accadono insieme. Il primo tipo è utile; il secondo è una fonte frequente di bug.

## Machine learning

Un programma classico è una funzione scritta da una persona: y = f(x). Nel *machine learning* la funzione non viene scritta: è costruita automaticamente a partire da esempi. I modelli generativi di oggi sono questa idea su scala enorme, con miliardi di numeri appresi. Due osservazioni la collegano a questo corso. Quei numeri sono bit in memoria, moltiplicati e sommati da processori. E un modello può sbagliare con grande sicurezza: solo chi conosce i fondamenti può controllare ciò che dice.
