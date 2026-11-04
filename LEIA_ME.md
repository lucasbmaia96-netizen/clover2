# Trevas ilustrado — recurso separado para teste

Nome do recurso: **`grimorio_trevas_teste`**  
Comando padrão: **`/trevasteste`**

## Instalação

1. Copie a pasta `grimorio_trevas_teste` para a pasta de recursos do servidor.
2. Acrescente ao `server.cfg`:

```cfg
ensure grimorio_trevas_teste
```

3. Entre no servidor e use `/trevasteste`.

Não substitua a pasta `grimorio_oficial`. Este teste é um recurso independente, sem dependências de framework e sem alterações no grimório já instalado.

## Uso

- `/trevasteste` abre ou oculta a interface de teste.
- Clique na capa para abrir o livro. Use o mouse nas folhas ou as setas do teclado para folhear.
- **Esc** sai da interface e libera o cursor.
- A ação Aprender mantém a demonstração visual do HTML recebido; não concede poderes do servidor.

## Configuração própria

Edite `grimorio_trevas_teste/config.lua` e reinicie somente esse recurso.

| Opção | Padrão | Efeito |
| --- | --- | --- |
| `Comando` | `trevasteste` | Comando exclusivo do teste. |
| `Tecla` | `false` | Nenhuma tecla registrada; pode configurar `F7`, por exemplo. |
| `Cursor` | `true` | Permite clicar na capa e nas páginas. |
| `ReabrirNaCapa` | `true` | Começa na capa ao reabrir a interface. |
| `TamanhoDoJogo` | `true` | Usa o modo Tamanho do jogo que já existe no HTML. |
| `MostrarControles` | `false` | `true` exibe também o cabeçalho e os botões de conferência do HTML. |
| `LarguraVw` | `35.0` | Limite de largura em porcentagem da tela. |
| `LimiteVh` | `54.0` | Segundo limite de largura, calculado pela altura da tela, como no HTML original. |
| `DireitaVw` | `0.0` | Distância da borda direita. |
| `InferiorVh` | `0.5` | Distância da borda inferior. |

## Referência preservada

`html/GRIMORIO_TREVAS_ILUSTRADO.html` é uma cópia byte a byte do arquivo enviado pelo usuário. Artes, máscaras, geometria e folheamento ficam no próprio arquivo original. A integração ao RedM usa um contêiner separado, fundo transparente e comunicação NUI para abrir/fechar e aplicar as opções de apresentação.

As verificações usam navegador e funções Cfx simuladas. A execução no servidor RedM deve ser conferida com esta instalação de teste.
