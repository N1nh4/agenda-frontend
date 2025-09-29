FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./

# instalar dependências
RUN npm install

# copiar todo o projeto
COPY . .

# limpar caches antigos antes do build
RUN rm -rf .next node_modules
RUN npm install

# build
RUN npm run build

# imagem final mais leve
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]

