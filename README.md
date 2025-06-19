# 🖼️ Emoldure sua Lembrança com Next.js + Vercel Blob

Este projeto em **Next.js** permite que o usuário:
1. Carregue uma foto.
2. Aplique uma moldura personalizada.
3. Aprove ou rejeite a imagem.
4. Faça o upload da imagem final para o **Vercel Blob Storage**.
5. Receba um **QR Code** com o link da imagem para compartilhamento e download.

---

## 🚀 Tecnologias utilizadas

- [Next.js 15.3.3](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (parcialmente)
- [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [SCSS](https://sass-lang.com/)
- [Sharp](https://sharp.pixelplumbing.com/) (para manipulação de imagem se necessário futuramente)
- [React Webcam](https://www.npmjs.com/package/react-webcam) *(dependência incluída)*

---

## 📁 Estrutura de diretórios

```
components/
  ├── capture/ 
  |    └── .tsx
  |    └── .scss 
  ├── navbar/
  |    └── .tsx
  |    └── .scss 
  └── QRCode
       └── .tsx
public/
  └── moldura/        # Imagens de molduras
.env.local            # Variáveis de ambiente para ambiente local
```

---

## 📦 Como instalar e rodar o projeto

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/photo-opp.git
cd photo-opp
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Crie o arquivo `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. **Rode o servidor de desenvolvimento:**
```bash
npm run dev
```

> O app estará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 📤 Backend de Upload (Node/Express)

Este projeto depende de um backend separado para fazer upload da imagem gerada para o [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob). Certifique-se de rodar esse servidor também.

---

## 🧪 Testando

Você pode testar o projeto localmente carregando uma imagem, selecionando uma moldura, aprovando a visualização e escaneando o QR Code com seu celular.

---

## 🔒 Segurança

⚠️ **Não exponha tokens sensíveis no repositório.** Use sempre arquivos `.env.local` para variáveis de ambiente.

---

## 📄 Licença

Este projeto está sob a licença MIT.