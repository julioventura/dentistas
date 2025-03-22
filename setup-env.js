const fs = require('fs');
const dotenv = require('dotenv');

// Carrega as variáveis do arquivo .env
const result = dotenv.config();

if (result.error) {
  console.error('⚠️ Erro ao carregar o arquivo .env:', result.error);
  console.log('⚠️ Usando valores padrão para environment.ts');
}

// Template do arquivo environment.ts
const envFile = `// ARQUIVO DE CONFIGURAÇÃO GERADO AUTOMATICAMENTE
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD3D1Rrl4ov9wDMkjMH7BrGwSIoYbbgSyQ",
    authDomain: "dentistas-com-br-2025.firebaseapp.com",
    projectId: "dentistas-com-br-2025", 
    storageBucket: "dentistas-com-br-2025.appspot.com",
    messagingSenderId: "62096953183", 
    appId: "1:62096953183:web:d23421cecbd0caebc2b0ea",
    measurementId: "G-657HTS1CNX"
  },
  aiChatApiUrl: 'https://api.dentistas.com.br/ai',
  openaiApiKey: '${process.env.OPENAI_API_KEY || "CHAVE_NAO_CONFIGURADA"}',
  openaiApiUrl: 'https://api.openai.com/v1/chat/completions',
  openaiModel: 'gpt-4o-mini'
};
`;

// Garante que o diretório exists
if (!fs.existsSync('./src/environments')) {
  fs.mkdirSync('./src/environments', { recursive: true });
}

// Escreve o arquivo
fs.writeFileSync('./src/environments/environment.ts', envFile);

console.log('✅ Arquivo environment.ts criado com sucesso!');