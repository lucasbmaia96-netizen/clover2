# Revisão candidata Trevas v1.2.1 — entrada HTML original restaurada

O evento 1116 do Windows Defender enviado pelo usuário identifica `grimorio_trevas_teste/html/index.html`, dentro do ZIP v1.2.0, para a detecção Trojan:Script/Ulthar.A!ml.

Nesta revisão, o index.html volta a ser EXATAMENTE o arquivo do pacote v1.0.0 que funcionava. As funções das legendas, da lombada e dos controles permanecem no JavaScript existente, sem minificação ou ofuscação. O código separado usado na montagem fica disponível no diretório comparacao/fontes_v1.2.1 do repositório.

Esta é uma revisão candidata para validação pelo Defender. A comparação e os testes funcionais não equivalem a uma análise antivírus; não há resultado antivírus favorável obtido neste ambiente. Se o antivírus bloquear esta revisão, não force o download, não restaure a ameaça e não crie exclusões.

## Após a validação pelo Defender

Copie o conteúdo de grimorio_trevas_teste sobre o recurso instalado, mantendo os demais arquivos, o HTML ilustrado e seu config.lua. No console do servidor execute:

restart grimorio_trevas_teste

Abra com /trevasteste. NumPad 1 a 7 seleciona cada poder com a explicação, NumPad 0 abre a introdução, seta esquerda avança e seta direita volta. Esc fecha. A lombada fixa, o movimento da capa, as legendas e o tamanho do livro são mantidos. Não contém o programa de voz.

O arquivo original de 27 MB e a configuração não são repetidos no ZIP. A revisão funciona sobre a base v1.0.0 e as atualizações anteriores. Os dois módulos antigos de interface deixam de ser chamados pelo HTML de entrada.

Conferido no Chromium e com funções Cfx simuladas: sete páginas pixel a pixel iguais à revisão legível anterior, NumPad com e sem NumLock, setas invertidas, abertura/fechamento, Aprender e Esc. Não houve execução do Windows Defender ou de um servidor RedM nesta preparação.
