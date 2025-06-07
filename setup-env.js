const fs = require('fs');
const dotenv = require('dotenv');

// Carrega as variáveis do arquivo .env
const result = dotenv.config();

if (result.error) {
  console.error('⚠️ Erro ao carregar o arquivo .env:', result.error);
  process.exit(1);
}

// ADICIONADO: validação das variáveis necessárias
const requiredVars = [
  'OPENAI_API_KEY',
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID'
];

const missingVars = requiredVars.filter((name) => !process.env[name]);
if (missingVars.length > 0) {
  console.error(`⚠️ Variáveis faltando no .env: ${missingVars.join(', ')}`);
  process.exit(1);
}

console.log('✅ Chave da API OpenAI carregada com sucesso!');
console.log(`✅ Primeiros caracteres da chave: ${process.env.OPENAI_API_KEY.substring(0, 5)}...`);

// Template do arquivo environment.ts - COM ASPAS SIMPLES CORRETAS
const envFile = `// ARQUIVO DE CONFIGURAÇÃO GERADO AUTOMATICAMENTE
export const environment = {
  production: false,
  firebaseConfig: {
    // ALTERADO: valores obtidos das variáveis de ambiente
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  },
  aiChatApiUrl: 'https://api.dentistas.com.br/ai',
  openaiApiKey: '${process.env.OPENAI_API_KEY}',
  openaiApiUrl: 'https://api.openai.com/v1/chat/completions',
  openaiModel: 'gpt-4o-mini'
};
`;

// Garante que o diretório existe
if (!fs.existsSync('./src/environments')) {
  fs.mkdirSync('./src/environments', { recursive: true });
}

// Escreve o arquivo
fs.writeFileSync('./src/environments/environment.ts', envFile);

console.log('✅ Arquivo environment.ts criado com sucesso!');
// ADICIONADO: quebra de linha final garantida abaixo
