# Teste opcional de voz — no computador do jogador

Este programa externo reconhece **“magia imbuída em trevas”** e envia **F7** ao RedM. O recurso de teste mostra a capa fechada, executa o folheamento de abertura original e permanece na introdução. O NumPad 1 a 7 seleciona os poderes e suas explicações.

## Preparar uma vez

1. Instale a atualização do recurso no servidor e confirme primeiro que **F7** ou **`/trevasinvocar`** faz a abertura animada.
2. Neste computador Windows, tenha **Python 3.10 ou posterior, de 64 bits**, com o lançador `py` ou comando `python` disponível. A pasta `voz_trevas` fica no computador do jogador; não vai dentro dos recursos do servidor.
3. Execute **`INICIAR_VOZ_TREVAS.bat`**. Na primeira vez, ele cria um ambiente Python nessa pasta, instala Vosk e sounddevice e baixa o modelo pequeno de português do projeto Vosk, cerca de 31 MB. Essa preparação requer internet. As execuções seguintes reconhecem localmente e reutilizam o modelo.
4. Aguarde **“Escutando o microfone”**. Volte ao RedM, deixe o jogo em primeiro plano e diga a frase. O programa usa o microfone padrão e espera uma pequena pausa ao fim da fala.
5. Use **Ctrl+C** na janela do programa para encerrar.

O programa não grava nem envia o áudio. Somente uma frase reconhecida com confiança suficiente aciona a tecla, enquanto a janela do RedM/RDR2 está em primeiro plano. Há um intervalo mínimo de três segundos entre acionamentos. O reconhecimento pode variar com o microfone, ruído e pronúncia.

## Ajustes

- Trocar o microfone: execute `INICIAR_VOZ_TREVAS.bat --listar-microfones`, anote o índice de uma entrada e execute `INICIAR_VOZ_TREVAS.bat --dispositivo 2`, trocando o número.
- Se F7 já estiver ocupado no servidor, altere `TeclaInvocar` no `config.lua` do teste e execute o programa com a mesma tecla: `INICIAR_VOZ_TREVAS.bat --tecla F9`.
- Permita o acesso de aplicativos de área de trabalho ao microfone nas configurações de privacidade do Windows.
- O teste não depende do chat de voz do servidor e não exige pacote de reconhecimento de português do Windows. Usa o modelo de português do Vosk.

Dependências: [Vosk](https://github.com/alphacep/vosk-api), [modelo português](https://alphacephei.com/vosk/models) e [sounddevice](https://github.com/spatialaudio/python-sounddevice). A voz e o envio de tecla precisam ser conferidos nesse computador Windows com o RedM; não foram executados em um servidor durante a preparação do arquivo.
