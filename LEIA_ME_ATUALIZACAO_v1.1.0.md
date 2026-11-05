# Atualização Trevas v1.1.0 — legendas HTML, NumPad e invocação

Esta atualização é para o recurso **grimorio_trevas_teste que já está instalado**. Funciona sobre v1.0.0 ou v1.0.1. Contém somente os arquivos alterados e os pequenos arquivos de apoio; não repete o HTML ilustrado de 27 MB e não substitui seu config.lua.

## Instalar no servidor

1. Extraia o ZIP e copie o conteúdo da pasta `grimorio_trevas_teste` sobre a mesma pasta instalada, substituindo os arquivos correspondentes. **Mantenha os demais arquivos e o config.lua existentes. Não apague a pasta do recurso.**
2. No console do servidor, execute:

```text
restart grimorio_trevas_teste
```

3. No jogo, use **`/trevasteste`** para abrir o teste como antes, ou **F7** / **`/trevasinvocar`** para a nova abertura: capa fechada, animação original, introdução.

## Leitura e páginas

As pequenas legendas das sete aberturas de poderes passam a ser texto HTML, com fonte serifada incorporada, letras maiores, peso maior e quebras de linha. Uma restauração local do pergaminho remove as letras antigas dessas áreas para não haver texto duplicado. Os textos mantêm o conteúdo original. O tamanho do livro, a capa, as margens e a animação original são mantidos.

| Tecla do teclado numérico | Abertura com arte e explicação |
| --- | --- |
| NumPad 0 | Introdução |
| NumPad 1 | Corte das Trevas |
| NumPad 2 | Lua Negra |
| NumPad 3 | Passo das Sombras |
| NumPad 4 | Ruptura das Trevas |
| NumPad 5 | Fortaleza Sombria |
| NumPad 6 | Domínio das Trevas |
| NumPad 7 | Módulo de Voo |

O NumPad seleciona as páginas com o livro aberto. O mouse e as setas continuam folheando; Esc fecha a interface. As teclas do NumPad são reconhecidas com NumLock ligado ou desligado. A ação Aprender continua sendo a prévia visual; esta atualização não concede poderes no servidor.

## Voz opcional — arquivo separado

O pacote **VOZ_TREVAS_WINDOWS_v1.1.0.zip** contém o programa para o computador Windows do jogador, com instruções próprias. Ele reconhece **“magia imbuída em trevas”** e envia F7 para o jogo em primeiro plano. Isso aciona a abertura na introdução. Precisa de Python 3.10+ x64; na primeira execução baixa as dependências e o modelo português do Vosk. Depois o reconhecimento funciona localmente. A voz não vem do chat de voz do servidor.

## Ajustes opcionais

O config.lua atual é preservado. Se F7 já estiver ocupado, acrescente dentro de `TrevasTesteConfig`:

```lua
ComandoInvocar = 'trevasinvocar',
TeclaInvocar = 'F9',
```

Nesse caso, execute o programa de voz com `--tecla F9`. Para desativar a tecla de invocação, use `TeclaInvocar = false`. O comando permanece disponível. Quando `TeclaInvocar` não existe na configuração, o padrão desta atualização é F7. As demais opções de tamanho e posição são as mesmas já instaladas.

Verificações: renderização no Chromium em 1280×720 e 1920×1080, sete poderes com texto HTML, seleção pelo NumPad, NumLock desligado, animação de invocação, navegação, Aprender, Esc e reabertura. O cliente Lua foi conferido com funções Cfx simuladas. A detecção da frase foi verificada em código; o reconhecimento do microfone e o envio da tecla precisam ser testados no Windows com RedM. Não houve execução no servidor durante a preparação.
