# Grimórios — edição de leitura e selamentos

15 livros, 99 aberturas internas e 198 indicadores de selamento, um em cada folha. As artes PNG recebidas foram preservadas. As páginas usam uma diagramação comum baseada na referência até Cura: ilustração principal, título e descrição à esquerda, três etapas à direita. Tempo mantém as duas magias por abertura existentes na arte, com títulos, descrições e instruções separados.

Os textos são elementos reais do navegador, com contraste alto, alinhamento horizontal e tamanho maior. Não dependem das letras gravadas nas imagens. Descrições e etapas foram transcritas e resumidas para leitura; este trabalho não altera os efeitos dos poderes no servidor. Os recortes têm proporção preservada e coordenadas editáveis por página. A largura do livro foi ampliada para melhorar a leitura; a posição permanece no canto inferior direito.

## Testar e editar no computador

1. Extraia o ZIP completo.
2. Com Python 3 instalado, execute `ABRIR_EDITOR.bat` no Windows ou `python3 ABRIR_EDITOR.py` no Linux/macOS. O navegador abre o editor local. Mantenha o terminal aberto.
3. Escolha o grimório e a abertura. Edite títulos, descrição, etapas, cores e recortes. Abra “Recortes da arte” para ajustar X, Y, largura e altura sobre o canvas de 1536 × 1024. A prévia é imediata.
4. Clique em **Baixar edição para o jogo**. Guarde o arquivo `edicao.js`; substitua `grimorio_oficial/html/edicao.js` por ele e reinicie o recurso.

O editor salva localmente quando o navegador permite, mas só a exportação guarda uma cópia portátil. A prévia do navegador também permite selecionar todos os livros e ampliar a leitura. Sem Python, a prévia em `html/index.html` pode ser aberta diretamente em navegadores que permitem arquivos locais; para o editor, use o servidor local acima.

## Instalar no RedM

Com o recurso parado, faça backup da instalação atual e substitua a pasta `grimorio_oficial` pela entregue aqui. Não instale duas cópias. No console do servidor:

```
refresh
ensure grimorio_oficial
setmagia ID agua
```

Substitua ID pelo jogador conectado. Os temas são: `agua`, `fogo`, `gelo`, `raio`, `espacial`, `cura`, `trevas`, `arvore_mundo`, `tempo`, `antimagia`, `vento`, `noelle`, `fogo_leao`, `espadas` e `luz_solar`.

F6 abre/oculta. Os controles de navegação do recurso continuam disponíveis. O comando `grimorio_leitura` alterna a ampliação da leitura no jogo. Os controles do editor e a barra de prévia não aparecem no RedM. O recurso continua sem capturar o foco do jogador.

## Selamento

SELADO é um botão desabilitado e discreto em cada folha interna, inclusive abertura e encerramento. Nesta entrega é uma indicação visual para o bloqueio futuro; não faz desbloqueios, não envia requisições de compra e não substitui a validação de poderes existente no servidor.

## Arquivos principais

- `html/edicao.js`: todos os textos, cores e recortes, organizados por grimório e ID da página.
- `html/edicao-view.js` e `html/edicao.css`: diagramação comum, tipografia e selamentos.
- `html/editor.html` e `html/editor.js`: editor local e importação/exportação.
- `html/app.js`: ligação com a interface existente; a camada de leitura aparece com a página assentada e é ocultada durante a virada original.
- `fxmanifest.lua`: inclui os novos arquivos na interface NUI.
- `client.lua`: acrescenta o comando de ampliação.

As capas e os IDs/ordem das páginas foram mantidos. Não foram inventadas páginas de novos poderes para preencher os livros menores. O pacote de instalação omite as cópias redundantes de artes aprovadas e o recurso aninhado que existiam no arquivo recebido; todas as artes usadas pelo recurso estão em `html/assets`.

## Validação e limites

A validação local cobre carregamento das 99 aberturas, presença dos dois selamentos por abertura, ausência de texto excedendo suas caixas, navegação e edição/exportação no Chromium. Também há verificações em 1280×720, 1366×768, 1920×1080 e 2560×1440. A arte original define o detalhe máximo das ilustrações; a nitidez do texto novo é independente dessa resolução.

Não houve execução do RedM neste ambiente. O teste de foco, HUD, tamanho final na resolução utilizada e funcionamento dos poderes deve ser feito no servidor. Os selamentos ainda são visuais. Não foram alterados `server.lua`, `power_config.lua`, `power_rules.lua`, `power_client.lua` nem `power_server.lua`.
