# Grimório das Trevas completo v1.3.0 — abertura do HTML enviado

Este pacote usa o arquivo GRIMORIO_TREVAS_ABERTURA_SEM_SOBREPOSICAO.html fornecido pelo usuário. Seu conteúdo foi copiado byte a byte, sem alterar CSS, JavaScript, imagens, recortes, tempos ou lógica da lombada.

Dentro do recurso, ele conserva apenas o nome interno GRIMORIO_TREVAS_ILUSTRADO.html, para manter o carregamento existente. O SHA-256 do conteúdo é o mesmo do arquivo enviado: bc44dfa0ac6168cfe9dd144d19de57fa7f3f2778944a4aab453e5995c937cfc1.

A intervenção anterior que criava e animava outra lombada foi retirada da integração. Agora a abertura e o fechamento usam a lógica nativa do HTML enviado, incluindo spine-recess, spine-retreat, clip-path e duração de 1120 ms (120 ms no modo de movimento reduzido).

## Instalação

O ZIP contém o recurso inteiro. Extraia a pasta grimorio_trevas_teste nos recursos do servidor, substituindo a versão anterior. Se personalizou config.lua, preserve suas opções. Não é necessário aplicar os pacotes ou patches anteriores.

No server.cfg ou no console do servidor, use:

ensure grimorio_trevas_teste

No jogo, abra com /trevasteste.

## Controles mantidos

- NumPad 0: introdução.
- NumPad 1 a 7: poderes e explicações.
- NumPad 8: última página, com a espada.
- Seta esquerda: avança. Seta direita: volta.
- Mouse: folheamento por clique. Esc: fecha a interface e libera o cursor.

O NumPad funciona com NumLock ligado ou desligado. As legendas em HTML maiores e legíveis foram mantidas. O tamanho e a posição usam as mesmas opções da configuração já aprovada. A ação Aprender continua sendo uma demonstração visual. Este recurso permanece separado de grimorio_oficial e não inclui o teste de voz.

## Conferência

O HTML recebido e o arquivo interno foram comparados por SHA-256 e são idênticos. Na conferência no Chromium, 19 quadros de abertura/fechamento da integração e do HTML recebido foram iguais pixel a pixel no mesmo modo Tamanho do jogo, incluindo tempos e transições. As sete aberturas de poderes continuam iguais à versão com texto legível. Foram conferidos NumPad 0 a 8, NumLock desligado, setas invertidas, mouse, Aprender, Esc e callbacks simulados da NUI.

Não houve execução de um servidor RedM ou de um antivírus Windows nesta preparação. Mantenha a proteção normal do computador ao baixar e aplicar o pacote.
