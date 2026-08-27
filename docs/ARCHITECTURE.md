# Arquitetura

## Objetivo

Manter a experiência jogável sem serviços externos e permitir conexão posterior sem reescrever a interface.

## Camadas

```text
UI
└── hooks e contexto de dados
    ├── máquina de estados pura
    ├── repositório local
    └── adaptador conectado
        ├── WorkOS AuthKit
        └── Convex
```

### Máquina de estados

Estados:

- `idle`;
- `typing`;
- `candidate`;
- `completed`.

Eventos:

- `DIGIT`;
- `CORRECT`;
- `COMPLETE`;
- `NEW_ATTEMPT`.

O cronômetro não depende do ciclo de renderização. `performance.now()` é capturado na primeira tecla e novamente na confirmação. O componente visual atualiza apenas sua própria exibição.

### Persistência local

`LocalGameRepository` é a única classe que conhece `localStorage`.

A estrutura persistida contém:

- identidade local;
- estatísticas agregadas;
- até 100 tentativas recentes;
- configuração de som;
- versão do formato.

Dados inválidos voltam ao estado padrão sem derrubar a aplicação.

### Modo conectado

`ConnectedDataProvider` compõe a experiência local com Convex:

1. registra localmente para resposta imediata;
2. envia duração e ID em segundo plano quando autenticado;
3. marca a tentativa como sincronizada após sucesso;
4. mantém fallback local em falha de rede.

Perfil e ranking usam queries reativas do Convex quando disponíveis.

### Divisão de bundle

A integração WorkOS/Convex é carregada com `React.lazy` somente quando a configuração conectada está completa. O modo demo não carrega esse chunk durante o início da aplicação.

## Backend

### `users`

Guarda estatísticas agregadas para leitura rápida e índice por pontuação.

### `attempts`

Guarda o evento mínimo auditável, com índice idempotente e índice cronológico por jogador.

### Ranking

A lista principal usa o índice `by_score` e não ordena milhares de jogadores no navegador. A posição individual é exata até 1.000 jogadores no MVP e retorna `1000+` acima disso.

Para escala maior, adote um componente de aggregate/rank ou uma projeção materializada.
