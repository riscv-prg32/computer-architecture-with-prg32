# Lezione 24: Oltre un solo core: RISC-V superscalare, HPC, GPU e FPGA

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Due pipeline affiancate

Due pipeline affiancate. Leggete la tabella per righe: ogni riga è un'istruzione, ogni colonna un ciclo. Le istruzioni entrano a coppie: `i1` e `i2` vengono prelevate insieme, poi `i3` e `i4`, poi `i5` e `i6`. Sei istruzioni terminano in sette cicli; a una pipeline singola ne servirebbero dieci. È il caso ideale, in cui le istruzioni non dipendono l'una dall'altra.

## RISC-V diventa superscalare

Processori RISC-V di questo tipo esistono. La prima riga è il core del vostro kit: in ordine, un'istruzione per ciclo. Gli altri sono core fuori ordine: BOOM di Berkeley e XiangShan dell'Accademia Cinese delle Scienze, entrambi open source; il C910, il P550, Veyron, di aziende. Poiché l'insieme di istruzioni è aperto, chiunque può costruire un core simile, e alcuni sono pubblicati come codice sorgente che potreste leggere.

## La tassonomia di Flynn

La tassonomia di Flynn classifica le macchine con due domande: un flusso di istruzioni o molti, un flusso di dati o molti. SISD è il kit: un core, un dato alla volta. SIMD è un'istruzione applicata a molti dati insieme: le istruzioni vettoriali e, grosso modo, le GPU. MISD è rara. MIMD sono molti processori ciascuno con i propri dati: chip multicore, cluster, supercalcolatori.

## Ordini di grandezza

Ordini di grandezza. Il kit non ha alcuna unità in virgola mobile. Un portatile esegue circa cento miliardi di operazioni al secondo. Leonardo, a Bologna, circa duecentoquaranta milioni di miliardi. Frontier, El Capitan e JUPITER superano il miliardo di miliardi, dieci alla diciotto: è l'*exascale*. Sette ordini di grandezza separano un portatile da queste macchine, e sono stati ottenuti con il parallelismo, non con clock più veloci.

## La legge di Amdahl in numeri

La legge in numeri. Leggete la seconda riga: un programma parallelo al 90% va 5,3 volte più veloce con dieci processori, 9,2 con cento, 9,9 con mille, e mai più di 10. Ora confrontate le righe: solo quando la frazione parallela si avvicina a 1 molti processori ripagano. Calcolate voi una cella, per esempio p = 0,9 e n = 100.

## RISC-V e il supercalcolo europeo

RISC-V e il supercalcolo europeo. Le macchine più grandi di oggi usano processori x86 o Arm con GPU. L'Europa sta progettando processori e acceleratori propri su RISC-V, con la European Processor Initiative e con DARE, il progetto nominato nella prima lezione. Monte Cimone, a Bologna, è un cluster completo costruito su processori RISC-V. Un insieme di istruzioni aperto permette a un continente di costruire ciò che altrimenti dovrebbe comprare. La pagina mostrata è quella delle strutture di calcolo del Dipartimento.

## Come un programma usa una GPU

Come un programma usa una GPU, in quattro passi. Il programma sulla CPU, l'*host*, prepara i suoi array nella memoria centrale. I dati vengono copiati nella memoria della GPU, e questo costa tempo. Una piccola funzione, il *kernel*, viene lanciata in migliaia di thread, uno per elemento. I risultati vengono copiati indietro. La GPU è un dispositivo come quelli della Lezione 21: il processore le invia dati e comandi.

## Quando ripaga una GPU?

Quando ripaga una GPU? Quando la stessa operazione si applica a moltissimi dati in modo indipendente: immagini, matrici, le griglie di una simulazione, reti neurali. Quando i dati possono restare sulla GPU per molti passi invece di viaggiare ogni volta. Non quando il lavoro è una catena di decisioni, ciascuna dipendente dalla precedente. E vale di nuovo Amdahl: ciò che resta sulla CPU fissa il limite.

## Dalla descrizione al circuito

Dalla descrizione al circuito in cinque tappe. Descrivere, in Verilog o VHDL. Simulare, osservando forme d'onda come quelle della Lezione 13. Sintetizzare: la descrizione diventa tabelle e flip-flop. Piazzare e instradare: ogni elemento riceve una posizione sul chip e si tracciano i collegamenti. Configurare: si carica il bitstream. Ogni tentativo richiede da minuti a ore: più lento che compilare una cartuccia, molto più veloce che fabbricare un chip.

## Anche un processore è un circuito

Anche un processore è un circuito. Un core RISC-V è una descrizione in un linguaggio hardware, e si può caricare su una FPGA: questi *soft core* sono liberi da leggere e da usare. Un core della classe di quello del vostro kit entra in una FPGA piccola. Accanto potete mettere un circuito vostro, per l'operazione che il vostro programma ripete di più. Qui si chiude il cerchio del corso: dalle porte a un processore, e ritorno.
