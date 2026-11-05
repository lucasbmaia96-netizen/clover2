# Trevas — correções no jogo, NumPad e setas invertidas v1.2.0

**Download v1.2.0 em revisão após bloqueio do antivírus.** Aguarde a identificação da ameaça no Histórico de proteção do Windows antes de instalar esta atualização. A revisão do código e a integridade do ZIP não confirmam um falso positivo. [Conferência do pacote e limites da análise](REVISAO_BLOQUEIO_DOWNLOAD_v1.2.0.json).

Copie a atualização sobre `grimorio_trevas_teste`, mantenha os demais arquivos e seu `config.lua`, execute `restart grimorio_trevas_teste` no console do servidor e abra com **`/trevasteste`**. Funciona sobre v1.0.0, v1.0.1 ou v1.1.0. [Instruções completas](LEIA_ME_ATUALIZACAO_v1.2.0.md).

- **← avança** uma abertura. **→ volta** uma abertura.
- **NumPad 1 a 7** seleciona cada poder junto da explicação; **NumPad 0** abre a introdução.
- Mouse mantém o folheamento por clique; Esc fecha a interface.

Mantém as legendas em HTML maiores e mais encorpadas, a fonte incorporada e o tamanho do livro. A abertura e o fechamento agora separam a lombada fixa da capa que gira na junção; o movimento das páginas permanece igual. As sete aberturas são pixel a pixel iguais à versão legível anterior. O teste de voz foi encerrado e seus comandos e atalho foram retirados do recurso atual.

![Prévia das legendas no tamanho do jogo](previas/html/voo_tamanho_jogo_1280.jpg)

[Ver a abertura e o fechamento corrigidos](previas/html/abertura_corrigida_v1.2.0.mp4) · [Ver a sequência de abertura](previas/html/sequencia_abertura_v1.2.0.jpg)

## Poderes e páginas

| NumPad | Poder | Arte e explicação |
| --- | --- | --- |
| 1 | Corte das Trevas | [Ver página](previas/html/corte.jpg) |
| 2 | Lua Negra | [Ver página](previas/html/lua.jpg) |
| 3 | Passo das Sombras | [Ver página](previas/html/passo.jpg) |
| 4 | Ruptura das Trevas | [Ver página](previas/html/ruptura.jpg) |
| 5 | Fortaleza Sombria | [Ver página](previas/html/fortaleza.jpg) |
| 6 | Domínio das Trevas | [Ver página](previas/html/dominio.jpg) |
| 7 | Módulo de Voo | [Ver página](previas/html/voo.jpg) |

Conferido no Chromium e com funções Cfx simuladas: setas, NumPad com e sem NumLock, limites, mouse, Aprender, Esc e sete comparações visuais. [Relatório](ATUALIZACAO_v1.2.0.json). A execução no servidor deve ser conferida no jogo.

## Instalação inicial

Quem ainda não tem o recurso pode instalar o [ZIP base v1.0.0](https://github.com/lucasbmaia96-netizen/clover2/raw/refs/heads/trevas-teste-redm/GRIMORIO_TREVAS_TESTE_REDM_v1.0.0.zip) e aplicar esta atualização. O nome continua `grimorio_trevas_teste`. O recurso `grimorio_oficial` permanece separado.

O HTML ilustrado original segue preservado byte a byte. As legendas e os controles são aplicados pela integração NUI. Os pacotes anteriores ficam arquivados; a revisão atual é v1.2.0.
