# Arquivos públicos (`public/`)

Este diretório contém arquivos estáticos servidos diretamente pela aplicação Next.js. Os arquivos não precisam de importação: use o caminho a partir da raiz do site. Por exemplo, `public/images/hero-person.jpg` fica disponível em `/images/hero-person.jpg`.

## Estrutura

```text
public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
├── window.svg
└── images/
    ├── about-founder.jpg
    ├── feature-person.jpg
    ├── hero-founder.jpg
    ├── hero-founder.png
    └── hero-person.jpg
```

## Imagens da aplicação

| Arquivo | Uso / observações |
| --- | --- |
| `images/hero-person.jpg` | Retrato usado no destaque da página inicial e nos cartões de contato. |
| `images/hero-founder.jpg` | Mesmo conteúdo binário de `hero-person.jpg` no estado atual do repositório; nome alternativo. |
| `images/feature-person.jpg` | Mesmo conteúdo binário de `about-founder.jpg` no estado atual do repositório; usado na seção “Sobre”. |
| `images/about-founder.jpg` | Mesmo conteúdo binário de `feature-person.jpg` no estado atual do repositório; nome alternativo. |
| `images/hero-founder.png` | Variante PNG do retrato; manter quando houver referências específicas a esse formato. |

As equivalências acima são baseadas nos identificadores Git dos arquivos no momento desta documentação. Antes de remover ou substituir qualquer imagem, pesquise suas referências no código e confirme se os arquivos continuam idênticos.

## SVGs

Os arquivos `file.svg`, `globe.svg`, `next.svg`, `vercel.svg` e `window.svg` são recursos vetoriais genéricos presentes na raiz pública. Verifique se algum componente ainda os utiliza antes de removê-los.

## Como referenciar

### Em componentes Next.js

```tsx
import Image from "next/image";

<Image
  src="/images/hero-person.jpg"
  alt="Descrição acessível da imagem"
  width={640}
  height={800}
/>
```

Para imagens com dimensões responsivas definidas pelo contêiner, pode-se usar `fill` dentro de um elemento pai com `position: relative` e dimensões definidas.

### Em HTML ou CSS

```html
<img src="/images/hero-person.jpg" alt="Descrição acessível da imagem" />
```

```css
background-image: url("/images/hero-person.jpg");
```

## Boas práticas

- Use caminhos começando por `/`; não inclua `public` na URL.
- Dê nomes descritivos aos arquivos e mantenha a extensão correspondente ao formato real.
- Otimize imagens para a web antes de adicioná-las, especialmente fotografias grandes.
- Forneça texto alternativo significativo em imagens informativas; use `alt=""` para imagens puramente decorativas.
- Antes de renomear, substituir ou excluir um arquivo, procure referências no código para evitar imagens quebradas.
- Não coloque segredos, dados privados ou arquivos que não devam ser acessíveis publicamente neste diretório.
