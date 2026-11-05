# Trevas — legendas HTML e navegação NumPad v1.1.0

**[Baixar somente a atualização do recurso — ZIP](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/ATUALIZACAO_TREVAS_LETRAS_HTML_NUMPAD_v1.1.0.zip)**

Para quem já está com `grimorio_trevas_teste` funcionando: extraia a pasta do ZIP sobre o mesmo recurso, mantenha os arquivos existentes e execute `restart grimorio_trevas_teste` no console do servidor. O pacote não substitui `config.lua` nem repete o HTML original. [Instruções completas](LEIA_ME_ATUALIZACAO_v1.1.0.md).

As legendas das sete aberturas de poderes passam a ser texto HTML maior e mais encorpado, com fonte incorporada. O tamanho do livro, a capa, a moldura e o folheamento são mantidos. A introdução e o encerramento permanecem idênticos à referência; fora das regiões de legenda, a comparação de pixels com o original passou.

- `/trevasteste`: abre o teste como antes.
- **F7** ou **`/trevasinvocar`**: mostra a capa fechada e usa a animação original para abrir na introdução.
- **NumPad 1 a 7**: seleciona o poder e a explicação juntos, com o livro aberto.
- **NumPad 0**: introdução. **Esc**: fecha a interface.

![Prévia das legendas HTML no tamanho do teste em 1280×720](previas/html/voo_tamanho_jogo_1280.jpg)

## Teste opcional de voz no Windows

**[Baixar o programa de voz — ZIP](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/VOZ_TREVAS_WINDOWS_v1.1.0.zip)** · [Instruções de voz](voz_trevas/LEIA_ME_VOZ.md)

No computador do jogador, o programa reconhece **“magia imbuída em trevas”** e envia F7 para o RedM em primeiro plano. Isso inicia a abertura animada na introdução. Requer **Python 3.10+ x64**. Na primeira execução instala as dependências e baixa o modelo português do Vosk; depois reconhece localmente, sem gravar ou enviar o áudio. Esta pasta não é instalada no servidor.

A interface e o cliente foram conferidos no navegador e com funções Cfx simuladas. O reconhecimento do microfone e o envio da tecla precisam ser testados no Windows com RedM; não foram executados neste ambiente Linux. [Relatório](ATUALIZACAO_v1.1.0.json).

## Sete aberturas e teclas

| Teclado numérico | Poder | Prévia com arte e explicação |
| --- | --- | --- |
| 1 | Corte das Trevas | [Ver página](previas/html/corte.jpg) |
| 2 | Lua Negra | [Ver página](previas/html/lua.jpg) |
| 3 | Passo das Sombras | [Ver página](previas/html/passo.jpg) |
| 4 | Ruptura das Trevas | [Ver página](previas/html/ruptura.jpg) |
| 5 | Fortaleza Sombria | [Ver página](previas/html/fortaleza.jpg) |
| 6 | Domínio das Trevas | [Ver página](previas/html/dominio.jpg) |
| 7 | Módulo de Voo | [Ver página](previas/html/voo.jpg) |

## Instalação inicial

Quem ainda não instalou o recurso pode usar o [ZIP base v1.0.0](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/GRIMORIO_TREVAS_TESTE_REDM_v1.0.0.zip) e depois aplicar a atualização acima. O nome do recurso continua `grimorio_trevas_teste`; o recurso `grimorio_oficial` permanece separado.

O HTML ilustrado enviado pelo usuário continua preservado byte a byte. As novas legendas e os controles são aplicados pela integração do teste. Aprender continua sendo a demonstração visual do HTML; não concede poderes no servidor.

O ZIP antigo de nitidez v1.0.1 permanece arquivado e foi substituído por esta revisão de legendas em HTML.
