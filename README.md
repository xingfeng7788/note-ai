# Inke

Inke is a Notion-style WYSIWYG editor with AI-powered autocompletions.

See live demo: [inke-web](https://inke.app)

<img alt="Inke is a Notion-style WYSIWYG editor with AI-powered autocompletions." src="https://inke.app/desktop.png">

# Install pkg 

> Coming soon

```bash
npm install inke
```


## Setting Up Locally

To set up Inke locally, you'll need to clone the repository and set up the following environment variables:

- `OPENAI_API_KEY` – your OpenAI API key (you can get one [here](https://platform.openai.com/account/api-keys))
- `BLOB_READ_WRITE_TOKEN` – your Vercel Blob read/write token (currently [still in beta](https://vercel.com/docs/storage/vercel-blob/quickstart#quickstart), but feel free to [sign up on this form](https://vercel.fyi/blob-beta) for access)

If you've deployed this to Vercel, you can also use [`vc env pull`](https://vercel.com/docs/cli/env#exporting-development-environment-variables) to pull the environment variables from your Vercel project.

To run the app locally, you can run the following commands:

```bash
pnpm i
pnpm build
pnpm dev
```

## Tech Stack

Inke is built on the following stack:

- [Next.js](https://nextjs.org/) – framework
- [Tiptap](https://tiptap.dev/) – text editor
- [OpenAI](https://openai.com/) - AI completions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) – AI library
- [Vercel](https://vercel.com) – deployments
- [TailwindCSS](https://tailwindcss.com/) – styles

## License

[Apache-2.0](./LICENSE) © [yesmore](https://github.com/yesmore)
