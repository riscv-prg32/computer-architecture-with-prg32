# Lezione 15: La memoria

*ARC12 Architettura dei Calcolatori, A.A. 2026/27. Note alle slide.* Una nota per ogni slide: che cosa mostra, come leggerla, che cosa portarsi via. Titoli generati, testo scritto a mano; in una presentazione del codice anche le note delle slide generate (il programma completo, le guide di prova) sono generate. `node notes.js` controlla che ogni slide abbia la sua nota.

## Slide 1: La memoria

Usate la memoria dalla seconda lezione: ogni `lw` e ogni `sw` la legge o la scrive. Questa lezione spiega che cos'è una memoria, come è organizzata, e che cosa accade davvero tra il processore e la memoria quando si esegue un load. L'immagine in copertina è il debugger di PRG32-QT, la cui vista della memoria vi farà da microscopio. La citazione da Tron è una battuta con un lato serio: una macchina con memoria può conservare uno stato, e con uno stato può fare quasi tutto.

## Slide 2: Che cosa saprete fare alla fine

Sei obiettivi. Classificare le memorie come volatili o persistenti, in linea o fuori linea, e collocarle in una gerarchia. Descrivere come SRAM e DRAM memorizzano un bit e perché hanno usi diversi. Spiegare parole, indirizzi e memoria indirizzabile al byte. Distinguere l'ordine little-endian da quello big-endian. Descrivere passo per passo come il processore legge e scrive una parola. E spiegare che cosa sono l'ingresso/uscita mappato in memoria e il DMA.

## Slide 3: Memoria

La memoria è la parte di un calcolatore dedicata a conservare i dati e le istruzioni dei programmi. La classificano due distinzioni. Le memorie *volatili* conservano l'informazione solo finché la macchina è alimentata; quelle *persistenti* la conservano a macchina spenta. *In linea* significa che i dati sono sempre accessibili; *fuori linea* significa che prima va montato un supporto, come un nastro preso da uno scaffale.

## Slide 4: La gerarchia di memoria

La gerarchia di memoria. In cima i registri, dentro il processore; poi la cache, la memoria centrale, i dischi a stato solido e magnetici, e infine nastri e supporti rimovibili. Salendo, le memorie sono più veloci e più costose per bit; scendendo, più grandi e più economiche. I livelli alti sono volatili, quelli bassi persistenti. L'ultima riga spiega perché la gerarchia esiste: nessuna tecnologia è insieme veloce, grande ed economica, quindi un calcolatore ne combina diverse.

## Slide 5: La memoria a nuclei magnetici

In una memoria a nuclei magnetici ogni bit è un anellino di ferrite, e il suo valore è il verso del campo magnetico nell'anello. È stata la memoria centrale dei calcolatori degli anni Cinquanta e Sessanta, e conservava il contenuto senza alimentazione. Le ricerche cominciarono con An Wang a Harvard nel 1949; Jay Forrester al MIT la rese pratica per il calcolatore Whirlwind. Guardate la fotografia: ogni anello è attraversato da fili, e un anello è un bit.

## Slide 6: Leggere e scrivere un nucleo

Come si legge e si scrive un nucleo. Due fili, X e Y, selezionano un anello. La lettura pone a 0 il bit selezionato: se conteneva un 1 compare un impulso sul filo di lettura, altrimenti nulla. Quindi la lettura distrugge il contenuto, e ogni lettura è seguita da una scrittura che memorizza di nuovo il dato. La scrittura pone a 1 il nucleo selezionato, a meno che un filo di inibizione non lo impedisca. Tenete l'idea della lettura distruttiva seguita da riscrittura: ritorna nella DRAM di oggi.

## Slide 7: SRAM e DRAM

I due tipi di RAM. Nella RAM *statica* ogni bit è tenuto da un circuito bistabile come quelli della Lezione 13: conserva il valore finché c'è alimentazione, è veloce, e richiede diversi transistor per bit, quindi è costosa: si usa per le cache. Nella RAM *dinamica* ogni bit è una carica in un minuscolo condensatore dietro un transistor: è densa ed economica, ma la carica si disperde, quindi il contenuto va rinfrescato periodicamente: è la memoria centrale di portatili e telefoni. Il chip del kit ha solo SRAM.

## Slide 8: Altre memorie

Altre tecnologie. La RAM ferroelettrica conserva lo stato senza alimentazione. La memoria *flash* è persistente e si cancella a blocchi: è la memoria di chiavette USB, telefoni e dischi a stato solido. Una riga riguarda direttamente il vostro kit: in un microcontrollore il programma vive nella flash e le variabili nella SRAM. Per questo le vostre cartucce hanno una sezione di costanti e una di variabili. I moduli di memoria di un PC sono passati, negli anni, da pochi megabyte a decine di gigabyte ciascuno.

## Slide 9: Parole e indirizzi

La memoria centrale è un vettore di *parole*, ciascuna una stringa di m bit che il processore legge o scrive con una sola operazione. Ogni parola ha un *indirizzo*, un numero da 0 a N meno 1 scritto su n bit, con N uguale a 2 alla n. L'indirizzo è una parola codice, e la memoria la decodifica. *Accesso casuale* significa che il tempo di accesso non dipende dalla posizione: ogni parola si raggiunge con la stessa rapidità. Trentadue bit di indirizzo danno quattro gibibyte di indirizzi.

## Slide 10: Memoria indirizzabile al byte

In una memoria *indirizzabile al byte* la più piccola unità dotata di indirizzo è il byte. Una parola di 32 bit occupa quindi quattro indirizzi consecutivi, e il suo indirizzo è quello del suo primo byte. La striscia mostra la parola del riscaldamento seguita da tre caratteri. Due conseguenze che avete già incontrato: il program counter avanza di 4 da un'istruzione alla successiva, e l'indice di un vettore di parole si moltiplica per 4. RISC-V ha load e store per ogni dimensione: byte, halfword e parole.

## Slide 11: Big-endian e little-endian

I due ordini dei byte di una parola. *Little-endian*: il byte meno significativo all'indirizzo più basso. *Big-endian*: prima il byte più significativo. La stessa parola, 0x10A3E6FF, è mostrata memorizzata nei due modi. RISC-V è little-endian, come quasi tutti i processori oggi in uso; i protocolli di rete, per ragioni storiche, inviano i dati big-endian. La differenza si nota guardando la memoria byte per byte, o quando due macchine diverse si scambiano dati binari.

## Slide 12: Parametri di una memoria

Due parametri descrivono una memoria: la *capacità*, cioè il numero di locazioni e i bit di ciascuna, e il *tempo di accesso*. I numeri del kit vanno ricordati: 512 KB di SRAM, 320 KB di ROM, e una flash esterna di alcuni megabyte. Di questi, il menu di PRG32 vi dice quanto resta ai vostri programmi: circa 98 KB di RAM e 509 KB di flash per le cartucce. È otto volte un Commodore 64, e una minuscola frazione di un portatile.

## Slide 13: L'interfaccia tra processore e memoria

L'interfaccia. Dentro il processore due registri sono rivolti alla memoria: MA, il registro degli indirizzi di memoria, e MB, il registro dei dati di memoria. Li collegano alla memoria tre gruppi di linee: il *bus indirizzi*, che va in un solo verso, dal processore alla memoria; il *bus dati*, che va nei due versi; e le linee di controllo, abilitazione alla lettura e alla scrittura, che dicono che cosa si chiede. MA e MB appartengono al modello del processore: non sono tra i registri che usate in assembly.

## Slide 14: Sincronizzare processore e memoria

Come fanno processore e memoria a mettersi d'accordo su quando il dato è pronto? Nella tecnica *asincrona* la memoria segnala con una linea quando ha finito, e il processore aspetta: più complessa, ma i due si possono progettare in modo indipendente. Nella tecnica *sincrona* un clock scandisce l'operazione, che si completa entro un ciclo la cui durata è scelta in base alla velocità della memoria: più semplice, ed è la regola dentro un singolo chip.

## Slide 15: Collegare processore, memoria e I/O

Due modi di collegare ingresso e uscita. Con un bus unico, l'*I/O mappato in memoria*, memoria e dispositivi condividono lo stesso spazio di indirizzi: un registro di un dispositivo si legge e si scrive come una locazione di memoria, senza istruzioni speciali. Con bus separati, l'*I/O isolato*, ci sono due spazi di indirizzi e istruzioni dedicate. RISC-V segue la prima via: non ha alcuna istruzione di ingresso o di uscita, solo load e store.

## Slide 16: I tre bus componenti, e il DMA

Il bus è in realtà tre bus: dati, indirizzi e controllo. Un altro meccanismo completa il quadro. Con l'*accesso diretto alla memoria*, DMA, un dispositivo scambia interi blocchi di dati direttamente con la memoria: il processore avvia il trasferimento e viene avvisato quando è finito, senza copiare da sé ogni parola. Il display del kit riceve così ogni frame, e così l'amplificatore audio.

## Slide 17: Verifica la comprensione: Una memoria ha 16 linee di indirizzo ed è indirizzabile al byte. Quanto è grande? / Su RISC-V, value: .word 0xCAFE0001 sta all'indirizzo A. Che cosa legge lbu t0, 0(t0) se t0 = A?

Sedici linee di indirizzo selezionano 2 alla 16 locazioni, e ogni locazione è un byte. Ricordate che 2 alla 10 fa 1024, un kibibyte.

Little-endian: quale byte di 0xCAFE0001 è il meno significativo? Quel byte sta all'indirizzo più basso, e `lbu` con scostamento 0 lo legge.

## Slide 18: Verifica la comprensione: Perché la DRAM va rinfrescata? / Come scrive un programma RISC-V su un dispositivo di uscita?

Ricordate come la DRAM memorizza un bit: una carica in un minuscolo condensatore. Che cosa accade a una carica lasciata a se stessa? Il rinfresco non ha nulla a che vedere con la velocità o con l'accesso casuale.

RISC-V non ha un'istruzione `out` né un trentatreesimo registro. I dispositivi hanno indirizzi, e un programma li raggiunge con le istruzioni che usa per la memoria.

## Slide 19: Glossario: inglese e italiano

Dieci termini. *Main memory* è la memoria centrale. *Access time* è il tempo di accesso. Un *magnetic core* è un nucleo di ferrite. *Refresh*, rinfresco, è la riscrittura periodica di una DRAM. *Memory-mapped I/O* è l'ingresso/uscita raggiunto attraverso indirizzi di memoria. *Address bus* e *data bus*, bus indirizzi e bus dati, sono i due gruppi principali di linee dell'interfaccia.

## Slide 20: Conclusioni e letture

Cinque conclusioni. La memoria è il componente che conserva lo stato dei dati. Tipi diversi servono a scopi diversi, perché nessuno è insieme veloce, grande ed economico. I dati si memorizzano come parole con indirizzi; RISC-V indirizza i byte e li ordina little-endian. L'accesso avviene per selezione sul bus indirizzi, trasferimento sul bus dati e linee di controllo. E in RISC-V i dispositivi si raggiungono come la memoria. La prossima lezione tratta la memoria che sopravvive quando manca l'alimentazione, e la cache.
