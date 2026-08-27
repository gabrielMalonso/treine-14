# Segurança e antifraude

## Modelo de confiança

O navegador não é confiável.

Ele pode informar:

- duração manipulada;
- ID repetido;
- chamadas automatizadas;
- conteúdo adulterado no `localStorage`.

Por isso, no modo conectado:

- pontuação é calculada no Convex;
- `createdAt` vem do servidor;
- o usuário vem do token validado;
- duplicatas são bloqueadas por índice;
- durações fora do intervalo são rejeitadas;
- submissões em rajada sofrem cooldown.

## O que o MVP não resolve

`performance.now()` ainda é medido no cliente. Um atacante dedicado pode modificar o bundle ou chamar a mutation diretamente com uma duração dentro do limite.

Não use o ranking atual para distribuir prêmio financeiro ou benefício relevante.

## Evolução recomendada

1. mutation `startAttempt` gera nonce aleatório, expiração e timestamp do servidor;
2. cliente envia esse nonce ao concluir;
3. `finishAttempt` valida uso único e janela de tempo;
4. servidor combina tempo decorrido do desafio com telemetria mínima;
5. rate limit por usuário, IP/provedor e janela;
6. sinalização de padrões improváveis;
7. moderação/remoção administrativa;
8. aggregate index para ranking em escala.

## Migração anônima

Não importar totais do `localStorage`.

Uma migração futura deve aceitar apenas tentativas criadas após desafios assinados ou tratá-las como histórico sem pontos competitivos.
