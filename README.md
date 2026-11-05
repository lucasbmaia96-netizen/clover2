# Trevas — comparação do pacote e revisão da entrada HTML

**[Comparação arquivo por arquivo](comparacao/COMPARACAO_ARQUIVO_POR_ARQUIVO.md)** · [Diferenças exatas](comparacao/ALTERACOES.diff) · [Proveniência da imagem e da fonte](comparacao/PROVENIENCIA.json)

O pacote v1.2.0 foi sinalizado pelo Windows Defender. O registro de evento 1116 identifica `grimorio_trevas_teste/html/index.html`. A comparação com o pacote antigo encontrou três arquivos idênticos, três alterados e cinco adicionados; não há arquivos inesperados. As únicas mudanças no index.html eram duas chamadas de scripts, acrescentadas nesta sessão.

## Revisão candidata v1.2.1

**[Abrir o ZIP da revisão para validação no GitHub](https://github.com/lucasbmaia96-netizen/clover2/blob/trevas-teste-redm/CORRECAO_ENTRADA_TREVAS_v1.2.1_PARA_VALIDACAO.zip)** · [Instruções](LEIA_ME_ENTRADA_v1.2.1.md) · [Conferência](REVISAO_ENTRADA_v1.2.1.json)

Restaurei o index.html byte a byte igual ao ZIP antigo. As funções de legendas, lombada e teclado passam a ser carregadas pelo JavaScript existente, em texto legível, sem ofuscação. O código separado usado na montagem está em [comparacao/fontes_v1.2.1](comparacao/fontes_v1.2.1).

**A revisão precisa de validação pelo Defender.** Os testes de funcionamento e a revisão do código não confirmam um falso positivo. Se o antivírus bloquear, não force o download nem desative a proteção. O ZIP v1.2.0 continua em revisão.

## Funcionalidade preservada

- `/trevasteste` abre o grimório.
- NumPad 1 a 7 seleciona o poder junto da explicação; NumPad 0 abre a introdução.
- Seta esquerda avança; seta direita volta. Esc fecha.
- Lombada fixa, capa girando na junção, legendas HTML maiores e o mesmo tamanho do livro.

As sete aberturas foram comparadas pixel a pixel e permanecem iguais à versão legível anterior. O NumPad, as setas, o mouse, Aprender, Esc e a abertura/fechamento passaram na conferência com Chromium e funções Cfx simuladas. Não foi executado o Defender neste ambiente, nem um servidor RedM.

![Prévia da versão legível mantida](previas/html/voo_tamanho_jogo_1280.jpg)

O HTML ilustrado original e o config.lua são preservados e não são repetidos no ZIP. O recurso continua `grimorio_trevas_teste` e permanece separado de `grimorio_oficial`. Os pacotes antigos continuam arquivados para comparação.
