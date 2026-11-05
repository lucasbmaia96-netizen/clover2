# Trevas v1.2.2 — lombada sólida e NumPad 8

Atualização pequena para o recurso grimorio_trevas_teste com a revisão v1.2.1 já instalada.

## Aplicar

Copie a pasta grimorio_trevas_teste deste ZIP sobre a mesma pasta no servidor, substituindo os dois arquivos correspondentes. Mantenha os demais arquivos e seu config.lua.

No console do servidor, execute:

restart grimorio_trevas_teste

No jogo, abra com /trevasteste.

## Ajustes

- Retirada a animação de opacidade da lombada. Ela fica fixa e completamente opaca durante todo o giro da capa; só é recolhida quando a capa terminou de abrir e a abertura está plana. No fechamento, a lombada também permanece sólida atrás da parte interna da capa, sem fade.
- NumPad 8 abre a última abertura, com a espada desenhada, com NumLock ligado ou desligado. Também funciona ao selecionar diretamente a partir da capa fechada.
- NumPad 1 a 7 continuam selecionando os poderes; NumPad 0 abre a introdução.
- Seta esquerda avança, seta direita volta; mouse e Esc continuam iguais.

O pacote contém somente html/nui.js, fxmanifest.lua e estas instruções. O HTML de entrada restaurado na revisão v1.2.1, as artes, as legendas, o tamanho e a posição do livro são preservados.

Conferência no Chromium e com funções Cfx simuladas: pixels expostos da lombada comparados durante a abertura, opacidade integral até 99,99% do giro, fechamento, NumPad 8 com e sem NumLock e a partir da capa, sete poderes e página final comparados pixel a pixel. Não houve execução de um servidor RedM nesta preparação. Não há novo resultado de antivírus obtido neste ambiente; mantenha a proteção normal do computador.
