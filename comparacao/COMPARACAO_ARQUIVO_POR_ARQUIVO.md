# Comparação arquivo por arquivo — Trevas

Comparei o ZIP base v1.0.0, que o usuário confirmou funcionando no jogo, com o pacote de atualização v1.2.0 sinalizado pelo Defender. Para comparar o recurso inteiro, apliquei logicamente a atualização sobre a base; arquivos ausentes do patch continuam sendo os originais.

**Resultado: três arquivos originais idênticos, três alterados e cinco adicionados. Não há entradas inesperadas no ZIP.** O programa de voz não faz parte desse pacote.

| Arquivo | Situação em v1.2.0 | Conferência |
| --- | --- | --- |
| `client.lua` | Idêntico | Mesmo cliente Lua do pacote v1.0.0; não ganhou comandos externos. |
| `config.lua` | Idêntico | Mesma configuração, preservada ao aplicar a atualização. |
| `html/GRIMORIO_TREVAS_ILUSTRADO.html` | Idêntico | Mesmo HTML de 27 MB enviado pelo usuário; não é repetido no ZIP de atualização. |
| `fxmanifest.lua` | Alterado | Versão e lista dos arquivos de apoio locais adicionados. |
| `html/index.html` | Alterado | Apenas duas novas chamadas de scripts: captions.js e binding.js. O log do Defender apontou este arquivo. |
| `html/nui.js` | Alterado | Adição do NumPad, inversão das setas e inicialização das legendas e da lombada. |
| `html/captions.js` | Adicionado | Código escrito nesta sessão para renderizar as legendas em HTML. |
| `html/binding.js` | Adicionado | Código escrito nesta sessão para separar a lombada fixa da capa giratória. |
| `html/legendas_fundo.webp` | Adicionado | Imagem de apoio gerada nesta sessão; a conversão a partir do PNG de origem reproduziu os mesmos bytes. |
| `html/trevas_texto.woff` | Adicionado | Fonte derivada de Liberation Serif Bold instalada no ambiente. Só as tabelas de nome e cabeçalho mudaram; os desenhos dos caracteres são idênticos. |
| `html/FONTE_LICENCA.txt` | Adicionado | Licença e origem da fonte. |

Também há um documento de instruções (`LEIA_ME_ATUALIZACAO.md`) no ZIP. O arquivo de configuração e o HTML ilustrado permanecem da instalação antiga.

## Arquivo indicado pelo Windows

O registro de evento 1116 enviado pelo usuário identifica `grimorio_trevas_teste/html/index.html`, dentro do ZIP v1.2.0, para a detecção **Trojan:Script/Ulthar.A!ml**. A origem registrada é Internet / Downloads e anexos. Isso identifica o arquivo sinalizado; não determina, por si só, se a classificação é correta ou um falso positivo.

A diferença inteira nesse HTML são duas linhas de inclusão de scripts. Elas foram acrescentadas nesta sessão. Nenhum arquivo inesperado ou código de origem desconhecida foi encontrado na comparação; esse resultado não substitui uma análise antivírus.

## Revisão candidata v1.2.1

Restaurei o `index.html` **byte a byte igual ao ZIP antigo**. As funções de legendas, lombada e controles foram reunidas no JavaScript existente, em texto legível, sem minificação ou ofuscação. Os dois scripts extras deixam de ser chamados pela entrada HTML. O tamanho do livro e as artes são preservados.

A revisão é uma candidata para nova validação com o Defender; não há um resultado antivírus favorável para ela neste ambiente. Não se deve liberar uma detecção, criar exclusões nem desativar a proteção para instalar o pacote.

Arquivos de conferência: `COMPARACAO.json`, `ALTERACOES.diff` e `PROVENIENCIA.json`.
