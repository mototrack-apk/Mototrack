# MotoTrack — React Native (Expo)

App de rastreamento para motoboys. GPS, histórico de sessões, alertas de manutenção.
Dados salvos localmente no dispositivo (AsyncStorage). Sem dependência de backend externo.

---

## Pré-requisitos (tudo gratuito)

- Conta em https://expo.dev
- Conta em https://github.com
- Node.js instalado (apenas se quiser rodar local)

---

## Como subir o projeto no GitHub (100% pelo navegador)

1. Acesse https://github.com/new e crie um repositório chamado `mototrack`
2. Clique em "uploading an existing file"
3. Arraste TODOS os arquivos desta pasta (incluindo src/)
4. Clique em "Commit changes"

---

## Como gerar o APK/AAB na nuvem (sem instalar nada)

### Opção A — GitHub Actions (automático)

Crie o arquivo `.github/workflows/build.yml` no repositório com este conteúdo:

```yaml
name: Build Android

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: npm install
      - run: eas build --platform android --profile production --non-interactive
```

Depois:
1. Gere um token em https://expo.dev/accounts/[seu-usuario]/settings/access-tokens
2. No GitHub, vá em Settings > Secrets > New secret
3. Nome: `EXPO_TOKEN`, valor: o token gerado
4. Faça qualquer commit — o build vai rodar automaticamente
5. O AAB ficará disponível em https://expo.dev na aba Builds

### Opção B — Terminal online do GitHub (Codespaces)

1. No repositório, clique em "Code" > "Codespaces" > "Create codespace"
2. No terminal que abrir, execute:
```bash
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile production
```
3. Baixe o AAB gerado pelo link que aparecerá no terminal

---

## Como publicar na Play Store

1. Acesse https://play.google.com/console
2. Crie um novo app
3. Vá em "Produção" > "Criar nova versão"
4. Faça upload do arquivo `.aab` gerado
5. Preencha as informações e publique

---

## Estrutura do projeto

```
App.js                          # Entry point
src/
  lib/
    theme.js                    # Cores e estilos globais
    storage.js                  # AsyncStorage (substitui base44)
    trackingUtils.js            # GPS, cálculos de distância
    useTracking.js              # Hook de rastreamento
    useMaintenanceAlerts.js     # Lógica de manutenção
  components/
    TrackingButton.js           # Botão animado de rastreamento
    StatCard.js                 # Card de estatísticas
    MaintenanceCard.js          # Card de manutenção
    PageHeader.js               # Cabeçalho das páginas
  pages/
    Dashboard.js                # Tela principal
    Historico.js                # Histórico de sessões
    Manutencao.js               # Status de manutenção
    Configuracoes.js            # Configurações e perfil
  navigation/
    AppNavigator.js             # Bottom tabs
```

---

## Testar no celular (sem publicar)

1. Instale o app "Expo Go" na Play Store
2. Acesse https://snack.expo.dev
3. Cole o conteúdo de App.js e os arquivos src/
4. Escaneie o QR code que aparece

---

## Personalizar

- Trocar nome do app: edite `app.json` → `"name"` e `"slug"`
- Trocar pacote Android: edite `app.json` → `android.package`
- Trocar intervalo de óleo padrão: edite `src/lib/storage.js` → `oil_change_interval_km`
- Trocar cor primária: edite `src/lib/theme.js` → `colors.primary`
