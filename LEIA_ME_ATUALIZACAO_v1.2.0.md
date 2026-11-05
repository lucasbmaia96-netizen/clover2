# Trevas v1.2.0 — correções, NumPad e setas invertidas

## Aplicar no recurso já instalado

1. Copie o conteúdo da pasta `grimorio_trevas_teste` deste ZIP sobre o mesmo recurso no servidor, substituindo os arquivos correspondentes. Mantenha os demais arquivos e seu config.lua; não apague a pasta existente.
2. No console do servidor, execute `restart grimorio_trevas_teste`.
3. No jogo, abra com `/trevasteste`.

A atualização funciona sobre v1.0.0, v1.0.1 e v1.1.0. Inclui as legendas em HTML e seus arquivos de apoio para quem ainda não aplicou essa correção. Não precisa baixar novamente o HTML ilustrado de 27 MB.

## Controles

- NumPad 1 a 7: seleciona o poder e sua explicação na mesma abertura.
- NumPad 0: introdução.
- Seta esquerda (←): avança uma abertura; na capa, abre o livro.
- Seta direita (→): volta uma abertura; na introdução, fecha a capa.
- Mouse: mantém o folheamento original por clique.
- Esc: fecha a interface e libera o cursor.

O NumPad funciona com NumLock ligado ou desligado, incluindo as teclas 4 e 6 que podem emitir eventos de seta. As sete aberturas são: Corte das Trevas, Lua Negra, Passo das Sombras, Ruptura das Trevas, Fortaleza Sombria, Domínio das Trevas e Módulo de Voo.

## Correções mantidas

Mantém as legendas em HTML com a fonte incorporada. As sete aberturas são visualmente idênticas à versão legível v1.1.0. Tamanho do livro, recortes, capa, bordas e animação de folheamento continuam iguais.

O teste de voz foi encerrado. Esta versão não registra o comando de invocação nem o atalho F7 do teste de voz. As antigas opções ComandoInvocar e TeclaInvocar, se ainda existirem no config.lua, são ignoradas. O comando e o atalho próprios do recurso que você configurou em Comando e Tecla continuam disponíveis.

Conferência: navegador Chromium e funções Cfx simuladas, com setas invertidas, abertura/fechamento da capa, limites, NumPad 0 a 7, NumLock desligado, mouse, Aprender e Esc. As sete aberturas foram comparadas pixel a pixel com a versão legível anterior. A execução desta atualização no servidor deve ser conferida no jogo.
