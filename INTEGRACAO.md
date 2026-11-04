# Integração das páginas

Esta entrega parte do recurso original restaurado em `main`. Acrescenta 63 PNGs e cadastra as sete duplas de poderes de cada livro. Mantém todos os 126 PNGs já existentes, incluindo capas, aberturas, encerramentos e os seis livros até Cura.

`app.js`, `style.css`, `index.html`, os controles Lua, a comunicação com o servidor, os tempos de animação e as funções de geometria física das folhas permanecem originais. Os seis montadores de Antimagia, Vento, Noelle, Fogo do Leão, Espadas e Luz Solar também permanecem originais.

Trevas, Árvore do Mundo e Rei Mago receberam somente suporte às coordenadas de recorte das novas fontes. Trevas e Árvore do Mundo usam uma pequena sobreposição de amostragem nas novas texturas para evitar frestas entre os triângulos, sem modificar os vértices das folhas. As imagens originais continuam com sua amostragem anterior.

As legendas de Noelle e Fogo do Leão foram acomodadas nas próprias artes para respeitar os fechos existentes, sem deslocar ferragens, dobrar palavras ou criar uma faixa lateral. Os arquivos mantêm a resolução de 1536 × 1024. Os recortes do catálogo selecionam o papel; capa e ferragens são desenhadas separadamente pela receita original.

`fxmanifest.lua` declara explicitamente as novas texturas. `power_config.lua` altera somente os índices das páginas de Tempo e Avanço Sombrio, para que os mesmos atalhos continuem apontando para os mesmos poderes depois de separar as duplas. Não acrescenta poderes, comandos ou regras de desbloqueio.

## Conferência

- 63 páginas de poderes renderizadas, sete por livro.
- Capa, abertura, encerramento e três poses de abertura comparados pixel a pixel com o recurso original nos nove livros.
- Exterior fixo comparado em todas as 63 páginas, excluindo somente o papel e sua antisserrilha de dois pixels.
- 432 poses intermediárias de folheamento, nos dois sentidos.
- Navegação pela interface real: abertura, todas as páginas, retorno à capa e limites de avanço/retorno.
- Tamanho e posição comparados com o mesmo livro original em 1280 × 720, 1920 × 1080 e 2560 × 1440.
- Sintaxe JavaScript e Lua, declaração das texturas e carregamento sem arquivos ausentes.

Os relatórios estão em `verificacao/`. `PAGINAS_ATUALIZADAS.json` identifica os PNGs instalados e seus hashes. As prévias são capturas do renderizador do recurso. O teste dentro do servidor RedM fica para esta instalação de avaliação.
