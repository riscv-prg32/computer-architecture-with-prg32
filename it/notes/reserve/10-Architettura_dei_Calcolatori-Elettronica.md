# Lezione 10: Introduzione all'elettronica e all'elettronica digitale

*Note delle slide della specifica che non sono in nessuna delle due presentazioni (decks/plan.js, drop): il loro contenuto è nel libro di testo.*

## Potenza ed energia

La potenza è tensione per corrente, e in un resistore diventa calore. L'energia è potenza moltiplicata per tempo. Per il LED della slide precedente il circuito assorbe 29 mW, di cui 11 mW sono calore nella resistenza. Sono numeri minuscoli, ma l'ultima riga spiega perché contano: ogni transistor che commuta dissipa un po' di energia, e un processore ne ha miliardi. Il calore, non il numero di transistor, è il limite dei chip di oggi.

## Il diodo e il LED

Una giunzione fa un *diodo*, una valvola a senso unico: conduce in una direzione, quando la tensione supera una soglia di circa 0,7 V, e blocca nell'altra. Un diodo a emissione di luce, un LED, emette luce quando conduce; il colore dipende dal materiale, e così la soglia, ed è per questo che il LED della slide precedente teneva circa 2 V. In un calcolatore i LED servono da spie, da retroilluminazione dei display e nei collegamenti ottici.

## Scale di integrazione

Il numero di transistor che stanno su un chip è cresciuto attraverso cinque scale. Integrazione a piccola scala: poche porte per chip, come quattro NAND in un contenitore. Media scala: centinaia di transistor, un decodificatore o un registro. Grande scala: migliaia, i primi microprocessori. Scala molto grande: centinaia di migliaia e oltre. Oggi, decine di miliardi: un *sistema su chip* come l'ESP32-C6 del kit, che in pochi millimetri contiene processore, memoria, radio e periferiche.
