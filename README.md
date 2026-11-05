# Grimórios — receita original e artes completas para aprovação

A alteração anterior de tamanho e diagramação foi revertida. O recurso volta à receita original recebida: tamanho, posição, recortes, folheamento e carregamento originais. As artes PNG permanecem intactas.

## Teste no RedM — HTML ilustrado enviado pelo usuário

**Prévia da lombada central para avaliação:** [ver animação](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/previas/lombada_central/ABERTURA_LOMBADA_CENTRAL.mp4) · [baixar HTML folheável](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/previas/lombada_central/PREVIA_LOMBADA_CENTRAL_01.zip). A lombada se acomoda no centro e permanece visível depois de abrir. A prévia é separada para revisar o movimento; os arquivos do recurso v1.2.2 continuam iguais.

**[Baixar o Grimório das Trevas COMPLETO atualizado v1.2.2 — ZIP](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/GRIMORIO_TREVAS_COMPLETO_v1.2.2.zip)**

Pacote completo do recurso `grimorio_trevas_teste`, com todos os arquivos e artes: dispensa os pacotes anteriores e os patches. Inclui lombada sólida durante o giro, NumPad 8 na página da espada, demais teclas e legendas em HTML. Extraia a pasta para os recursos, use `ensure grimorio_trevas_teste` na primeira instalação ou `restart grimorio_trevas_teste` ao atualizar, e abra com `/trevasteste`. Preserve seu config.lua se tiver configurações próprias. [Instruções](https://github.com/lucasbmaia96-netizen/clover2/blob/trevas-teste-redm/LEIA_ME_PACOTE_COMPLETO_v1.2.2.md).

**[Atualização v1.2.2 — lombada sólida e NumPad 8, ZIP pequeno](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/ATUALIZACAO_TREVAS_LOMBADA_NUMPAD8_v1.2.2.zip)**

Retira o fade da lombada: ela fica fixa e opaca durante todo o giro e só é recolhida após a abertura completa. NumPad 8 abre a última página da espada; NumPad 1 a 7, NumPad 0 e setas invertidas são mantidos. Para quem está na v1.2.1, copie a atualização sobre `grimorio_trevas_teste`, mantenha os demais arquivos e execute `restart grimorio_trevas_teste`. [Prévia da abertura e do fechamento](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/previas/html/lombada_solida_numpad8_v1.2.2.mp4).

**[Comparação arquivo por arquivo dos pacotes Trevas](https://github.com/lucasbmaia96-netizen/clover2/blob/trevas-teste-redm/comparacao/COMPARACAO_ARQUIVO_POR_ARQUIVO.md)**

O evento do Defender apontou `grimorio_trevas_teste/html/index.html` no ZIP v1.2.0. A comparação encontrou três arquivos idênticos, três alterados e cinco adicionados, todos previstos. Na revisão candidata v1.2.1, a entrada HTML foi restaurada byte a byte igual ao pacote antigo; legendas, lombada, NumPad e setas invertidas foram mantidos no JavaScript existente.

[Revisão candidata v1.2.1 para validação pelo Defender](https://github.com/lucasbmaia96-netizen/clover2/blob/trevas-teste-redm/CORRECAO_ENTRADA_TREVAS_v1.2.1_PARA_VALIDACAO.zip) · [Conferência e limites da análise](https://github.com/lucasbmaia96-netizen/clover2/blob/trevas-teste-redm/REVISAO_ENTRADA_v1.2.1.json). Não há resultado antivírus favorável confirmado; se houver bloqueio, não force o download nem desative a proteção. O pacote v1.2.0 permanece em revisão.

**[Baixar grimorio_trevas_teste v1.0.0 — ZIP](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/GRIMORIO_TREVAS_TESTE_REDM_v1.0.0.zip)**

Recurso independente com o arquivo `GRIMORIO_TREVAS_ILUSTRADO.html` preservado integralmente. Copie a pasta `grimorio_trevas_teste` para os recursos, adicione `ensure grimorio_trevas_teste` ao `server.cfg` e use `/trevasteste` no jogo. Esc fecha a interface. O comando, o cursor, o tamanho e a posição têm configuração própria em `config.lua`.

Não substitui o recurso `grimorio_oficial`. [Instruções e conferência](https://github.com/lucasbmaia96-netizen/clover2/tree/trevas-teste-redm). Testes feitos no navegador e com funções Cfx simuladas; avaliação no servidor RedM pendente.

## Teste atual — somente Trevas em HTML

**[Baixar o HTML folheável do Trevas — ZIP](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-html/TREVAS_HTML_PARA_TESTE.zip)**

Extraia e abra `TREVAS_FOLHEAVEL.html` no navegador. O arquivo já inclui todas as imagens: abertura, sete poderes e encerramento. As folhas estão separadas da capa e as ferragens foram reduzidas para respeitar as margens. O botão Tamanho do jogo permite comparar a apresentação com a interface original.

Este protótipo está separado na área [trevas-html](https://github.com/lucasbmaia96-netizen/clover2/tree/trevas-html), para acertar somente o Trevas antes dos demais grimórios. Ele não altera o recurso instalado.

## Pacote para testar as novas páginas no grimório

**[Baixar o recurso completo com as 63 páginas aplicadas à receita original](https://github.com/lucasbmaia96-netizen/clover2/archive/refs/heads/grimorio-para-teste.zip)**

Sete poderes em cada um dos nove livros restantes, com as capas, a abertura, o encerramento, o tamanho e o movimento originais. Os seis grimórios até Cura continuam iguais. Extraia o ZIP e instale a pasta `grimorio_oficial` nele contida.

[Ver as 63 páginas já montadas em PDF](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/grimorio-para-teste/PREVIA_63_PAGINAS_NO_GRIMORIO.pdf) · [Ver as prévias e a conferência do pacote](https://github.com/lucasbmaia96-netizen/clover2/tree/grimorio-para-teste)

O pacote foi conferido no navegador e está separado na área `grimorio-para-teste` para avaliação no servidor RedM. Esta área `main` mantém o recurso original restaurado.

## Baixar a correção

**[Baixar correção da receita original](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/main/downloads/CORRECAO_RECEITA_ORIGINAL.zip)**

Pare o recurso, extraia a correção sobre a instalação e reinicie `grimorio_oficial`. A correção substitui os arquivos alterados pelos originais. Não é necessário baixar todas as imagens novamente.

**[Baixar o recurso completo restaurado](https://github.com/lucasbmaia96-netizen/clover2/archive/refs/heads/main.zip)**

## Artes completas dos nove grimórios restantes

**63 páginas internas de poderes, sete para cada livro, em PNG de 1536 × 1024.**

Revisão atual: as 42 páginas de Trevas, Árvore do Mundo, Tempo (Rei Mago), Noelle, Fogo do Leão e Luz Solar foram refeitas para retirar o excedente direito e nivelar o acabamento. As demais 21 páginas permanecem iguais. [Ver as 42 páginas corrigidas em PDF](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/artes-completas/CORRECAO_42_PAGINAS_ACABAMENTO.pdf).

Trevas, Árvore do Mundo, Tempo, Antimagia, Vento, Águas (Noelle), Fogo do Leão, Espadas e Luz Solar. Cada conjunto também inclui a capa, a abertura e o encerramento originais, copiados sem alteração.

- **[Baixar todas as artes em ZIP](https://github.com/lucasbmaia96-netizen/clover2/archive/refs/heads/artes-completas.zip)**
- [Ver o atlas das 63 páginas em PDF](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/artes-completas/ATLAS_63_PAGINAS_DE_PODER.pdf)
- [Ver os nove conjuntos e as imagens individuais](https://github.com/lucasbmaia96-netizen/clover2/tree/artes-completas)

Para revisar offline, extraia o ZIP das artes e abra `index.html`. Os PNGs completos estão nas nove pastas de `artes/`; os JPGs são prévias das mesmas imagens. Cada página nova contém uma demonstração, três etapas ilustradas e a marca discreta SELADO. A capa e a abertura próprias de cada livro orientaram seus contornos e bordas.

As artes ficam na área `artes-completas`, separadas do recurso nesta área `main`. São propostas para aprovação, incluindo os novos títulos e textos; ainda não foram instaladas no jogo. Os seis livros até Cura permanecem originais. A primeira proposta isolada de Trevas foi substituída por esta entrega completa.
