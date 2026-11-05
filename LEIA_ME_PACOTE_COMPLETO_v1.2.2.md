# Grimório das Trevas — pacote completo atualizado v1.2.2

Recurso: grimorio_trevas_teste
Comando no jogo: /trevasteste

Este ZIP contém o recurso inteiro atualizado: configuração, cliente, manifest, HTML ilustrado com todas as artes, interface, fonte, imagem de apoio e licença. Não é necessário instalar os pacotes anteriores ou aplicar patches.

## Instalação no servidor

1. Extraia a pasta grimorio_trevas_teste para a pasta de recursos do servidor. Se já existe, substitua os arquivos dessa pasta; se você personalizou config.lua, preserve suas configurações.
2. Para a primeira instalação, adicione ao server.cfg:

ensure grimorio_trevas_teste

Se o recurso já está instalado, após substituir os arquivos execute no console:

restart grimorio_trevas_teste

3. No jogo, abra com /trevasteste. Clique na capa ou use seta esquerda para abrir.

## Controles

- NumPad 0: introdução.
- NumPad 1 a 7: poderes e suas explicações.
- NumPad 8: última página, com a espada desenhada.
- Seta esquerda: avança. Seta direita: volta.
- Mouse: folheamento por clique.
- Esc: fecha a interface.

NumPad funciona com NumLock ligado ou desligado. A lombada fica fixa e opaca durante todo o giro da capa, sendo recolhida somente após a abertura completa. Não há mais animação de transparência da lombada. Mantém as legendas em HTML, a fonte incorporada e o tamanho do livro. Não inclui o programa de voz.

É o recurso separado grimorio_trevas_teste; não substitua grimorio_oficial. A ação Aprender continua sendo a demonstração visual, sem conceder poderes do servidor.

## Conferência

Todos os arquivos do recurso neste ZIP são idênticos aos já publicados na revisão v1.2.2. A estrutura do pacote e todas as referências do manifest foram conferidas. Os testes anteriores da mesma revisão usam Chromium e funções Cfx simuladas, incluindo opacidade integral da lombada, oito atalhos, setas e comparações de páginas. A preparação não executou um servidor RedM ou um antivírus Windows; mantenha a proteção normal durante o download.
