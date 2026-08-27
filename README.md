```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Sem configurar qualquer credencial, o projeto inicia em **modo demo**, com `localStorage`, usuário local e ranking mockado.

# Treine o 14

Experiência web gamificada de velocidade e precisão inspirada na interação física de um equipamento de votação, mas com identidade própria.

> **Simulação não oficial. Nenhum voto real é registrado.**

Não há enquete, comparação entre candidatos, intenção de voto nem resultado eleitoral. A aplicação registra **treinos**, **tentativas**, **pontos**, **sequências** e **ranking**.

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # typecheck + build de produção
npm run test         # testes Vitest
npm run lint         # ESLint
npm run typecheck    # TypeScript estrito do frontend
npm run typecheck:convex # TypeScript estrito do backend
npm run format       # Prettier
npm run check        # lint + typecheck + testes + build
```

Requisito recomendado: **Node.js 20.19 ou superior**.

## Rodando apenas localmente

Não crie `.env.local`.

A aplicação detecta a ausência das variáveis conectadas e usa:

- `localStorage` para progresso, configurações e as 100 tentativas mais recentes;
- ranking mockado;
- perfil “Você”;
- sons gerados pela Web Audio API;
- todas as rotas e a mecânica completas.

Para limpar o progresso durante testes, apague a chave `treine-o-14:player:v1` no armazenamento do navegador.

## Fluxo implementado

1. Acesse `/play`.
2. Pressione `1`; o cronômetro começa usando `performance.now()`.
3. Pressione `4`; os dados de Renan Santos / MISSÃO aparecem.
4. Pressione `CONFIRMA`.
5. Veja tempo, pontos, sequência, melhor tempo e total de treinos.
6. Pressione `TREINAR NOVAMENTE` para reiniciar instantaneamente.

Também funciona com teclado físico:

- `0–9`: números;
- `Backspace`, `Delete` ou `Escape`: CORRIGE;
- `Enter`: CONFIRMA, quando o foco não está em outro controle.

## Rotas

| Rota             | Conteúdo                                 |
| ---------------- | ---------------------------------------- |
| `/`              | landing direta com prévia do equipamento |
| `/play`          | experiência principal                    |
| `/ranking`       | ranking mockado ou conectado             |
| `/profile`       | perfil, estatísticas e histórico         |
| `/auth/callback` | retorno do AuthKit                       |
| qualquer outra   | 404 amigável                             |

## Ativando Convex

1. Crie uma conta/projeto no Convex.
2. Na raiz do projeto, execute:

```bash
npx convex dev
```

3. O Convex criará ou atualizará `VITE_CONVEX_URL` em `.env.local`.
4. Mantenha o terminal do Convex ativo durante o desenvolvimento.

O backend contém:

- `users`: identidade, pontuação agregada, tentativas, melhor tempo e sequências;
- `attempts`: duração, pontuação calculada no servidor e ID idempotente;
- ranking ordenado pelo índice `by_score`;
- consultas de perfil e histórico recente;
- consulta paginada para histórico;
- limite de ranking exato até 1.000 jogadores no MVP.

O navegador envia apenas `durationMs` e `clientAttemptId`. O servidor valida a duração, aplica cooldown, rejeita IDs inválidos, evita duplicatas e calcula a pontuação novamente.

## Configurando WorkOS AuthKit e Google

Crie `.env.local` copiando `.env.example`:

```bash
cp .env.example .env.local
```

Preencha:

```dotenv
VITE_CONVEX_URL=https://SEU-DEPLOYMENT.convex.cloud
VITE_WORKOS_CLIENT_ID=client_...
VITE_WORKOS_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_WORKOS_API_HOSTNAME=
```

No painel do WorkOS:

1. crie/configure um projeto AuthKit;
2. habilite Google como método principal;
3. adicione `http://localhost:5173/auth/callback` às URLs de redirecionamento;
4. copie o **Client ID público** para `VITE_WORKOS_CLIENT_ID`;
5. para produção, adicione também `https://seu-dominio.com/auth/callback`.

No ambiente do deployment Convex, configure:

```bash
npx convex env set WORKOS_CLIENT_ID "client_..."
npx convex env set WORKOS_AUTHKIT_ISSUER "https://issuer-exato-do-seu-token"
```

`WORKOS_AUTHKIT_ISSUER` deve ser exatamente o valor `iss` do access token emitido pelo seu projeto WorkOS. Não use uma URL presumida. O arquivo `convex/auth.config.ts` usa esse issuer como `domain` e o Client ID como `applicationID`.

Depois reinicie:

```bash
npx convex dev
npm run dev
```

### Detecção de modo

O frontend só entra em modo conectado quando as três variáveis existem ao mesmo tempo:

- `VITE_CONVEX_URL`;
- `VITE_WORKOS_CLIENT_ID`;
- `VITE_WORKOS_REDIRECT_URI`.

Configuração incompleta cai deliberadamente no modo demo, em vez de exibir uma tela quebrada.

Nenhum segredo deve usar o prefixo `VITE_`. Client secret, API key e configurações privadas pertencem ao WorkOS/Convex, nunca ao bundle do navegador.

## Jogador anônimo → conta Google

O MVP **não importa pontos históricos anônimos automaticamente**. Isso seria vulnerável, porque dados do `localStorage` podem ser alterados manualmente.

Estratégia implementada:

- o usuário joga sem login;
- ao entrar, as novas tentativas são enviadas ao Convex;
- as tentativas locais continuam disponíveis no dispositivo;
- o servidor aceita apenas tentativas novas, idempotentes e recalcula os pontos.

Evolução recomendada: emitir desafios curtos assinados pelo servidor antes de cada rodada e permitir uma janela limitada de migração apenas para tentativas acompanhadas desses desafios.

## Pontuação

Toda a fórmula está centralizada em:

```text
shared/scoring.ts
```

Cliente e servidor usam o mesmo módulo. Para alterar a fórmula, edite `calculateScore(...)` e ajuste os testes.

A fórmula atual usa:

- 100 pontos base;
- até 100 pontos de velocidade, com retorno decrescente;
- 2 pontos por item da sequência;
- bônus de sequência limitado a 25;
- duração limitada entre 350 ms e 15 s apenas para o cálculo.

Tempos medidos continuam armazenados sem arredondamento artificial.

## Como trocar a foto

Substitua:

```text
src/assets/candidate-placeholder.svg
```

ou altere `imageUrl` em:

```text
src/config/candidate.ts
```

Prefira imagem vertical leve, aproximadamente `5:6`, em WebP/JPEG otimizado. O placeholder atual é propositalmente abstrato e não busca nenhuma imagem externa.

## Como alterar os dados exibidos

Edite apenas:

```text
src/config/candidate.ts
```

Exemplo:

```ts
export const candidate = {
  number: "14",
  name: "Renan Santos",
  party: "MISSÃO",
  imageUrl: candidatePlaceholder
} as const;
```

## Estrutura

```text
.
├── convex/
│   ├── _generated/          # criado automaticamente por `convex dev`
│   ├── lib/                 # tipos, auth, ranking, presenters e scoring
│   ├── attempts.ts
│   ├── auth.config.ts
│   ├── leaderboard.ts
│   ├── schema.ts
│   └── users.ts
├── docs/
│   ├── ARCHITECTURE.md
│   └── SECURITY.md
├── public/
│   ├── _redirects
│   └── favicon.svg
├── shared/
│   ├── game.ts
│   └── scoring.ts
├── src/
│   ├── app/
│   │   ├── providers/
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   └── router.tsx
│   ├── assets/
│   ├── components/
│   │   ├── game/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── machine/
│   │   ├── profile/
│   │   ├── ranking/
│   │   └── ui/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── mocks/
│   ├── pages/
│   ├── repositories/
│   │   ├── convex/
│   │   └── local/
│   ├── services/
│   ├── test/
│   ├── types/
│   ├── index.css
│   └── main.tsx
├── .env.example
├── eslint.config.js
├── package.json
├── vercel.json
└── vite.config.ts
```

## Arquitetura de dados

```text
Componentes React
        │
        ▼
GameDataContext / useGame
        │
        ├── LocalGameRepository ── localStorage + ranking mock
        │
        └── ConnectedDataProvider ── Convex mutations/queries
                                          │
                                          ▼
                               validação + score servidor
```

Os componentes não acessam `localStorage` diretamente. A máquina de estados é pura e testável em `src/services/game/gameMachine.ts`.

## Responsividade e acessibilidade

- prioridade para celular landscape, tablet e desktop;
- portrait continua funcional e mostra uma dica de rotação;
- `100dvh` e safe areas de iPhone;
- botões nativos, foco visível e labels;
- targets grandes e `touch-action: manipulation`;
- suporte a `prefers-reduced-motion`;
- sem bloqueio de zoom de acessibilidade;
- feedback tátil visual de aproximadamente 2–4 px;
- áudio opcional persistido localmente.

## Limitações honestas do cronômetro e antifraude

O tempo nasce no navegador com `performance.now()`, portanto um cliente modificado pode mentir. O MVP reduz abuso, mas não prova presença humana.

Proteções atuais no Convex:

- score nunca é aceito do cliente;
- duração mínima/máxima;
- cooldown entre submissões;
- ID de tentativa validado;
- idempotência por usuário + ID;
- timestamp criado no servidor;
- histórico consultado com paginação;
- ranking ordenado no backend.

Para uma competição com prêmio, adicione desafio assinado por rodada, telemetria de sequência de teclas, limites por janela e revisão de anomalias.

## Deploy

### Vercel

1. importe o repositório;
2. build command: `npm run build`;
3. output directory: `dist`;
4. configure as variáveis `VITE_*`;
5. o `vercel.json` já redireciona rotas SPA para `index.html`.

### Cloudflare Pages

1. build command: `npm run build`;
2. output directory: `dist`;
3. configure as variáveis `VITE_*`;
4. `public/_redirects` já contém `/* /index.html 200`.

Depois, cadastre a URL de callback de produção no WorkOS.

## Revisão antes de publicar

```bash
npm run check
```

Confirme também:

- foto e autorização de uso;
- URLs de callback do WorkOS;
- issuer do token no Convex;
- textos legais/campanha aplicáveis ao seu contexto;
- comportamento em Safari iOS landscape;
- limites antifraude adequados ao volume real.
