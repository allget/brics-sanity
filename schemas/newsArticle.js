import { defineField, defineType } from "sanity"

export default defineType({
  name: "newsArticle",
  title: "News Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        {
          name: "pt",
          title: "Portuguese",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "en",
          title: "English",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    // 🔗 NOVO: Campo Slug para URLs amigáveis
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.pt", // Gera automaticamente do título em português
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-") // Espaços viram hífens
            .replace(/[àáâãäå]/g, "a")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/[òóôõö]/g, "o")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ç]/g, "c")
            .replace(/[^a-z0-9-]/g, "") // Remove caracteres especiais
            .slice(0, 96),
      },
      description: "URL amigável gerada automaticamente do título (ex: brics-anuncia-nova-moeda)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "object",
      fields: [
        {
          name: "pt",
          title: "Portuguese",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "en",
          title: "English",
          type: "text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        {
          name: "pt",
          title: "Portuguese",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "en",
          title: "English",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    // 🎥 Campo URL simples para YouTube
    defineField({
      name: "youtubeUrl",
      title: "YouTube Video URL",
      type: "url",
      description: "Cole o link completo do YouTube (ex: https://www.youtube.com/watch?v=VIDEO_ID)",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).custom((url) => {
          if (!url) return true // Campo opcional

          const isYouTube = url.includes("youtube.com/watch") || url.includes("youtu.be/")
          return isYouTube || "Por favor, insira uma URL válida do YouTube"
        }),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      options: {
        list: [
          { title: "BRICS", value: "BRICS" },
          { title: "Brazil", value: "Brasil" },
          { title: "Russia", value: "Rússia" },
          { title: "India", value: "Índia" },
          { title: "China", value: "China" },
          { title: "South Africa", value: "África do Sul" },
          { title: "Iran", value: "Irã" },
          { title: "Egypt", value: "Egito" },
          { title: "Ethiopia", value: "Etiópia" },
          { title: "UAE", value: "Emirados Árabes Unidos" },
          { title: "Saudi Arabia", value: "Arábia Saudita" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Economy", value: "Economia" },
          { title: "Technology", value: "Tecnologia" },
          { title: "Health", value: "Saúde" },
          { title: "Energy", value: "Energia" },
          { title: "Investments", value: "Investimentos" },
          { title: "Agriculture", value: "Agricultura" },
          { title: "Education", value: "Educação" },
          { title: "Environment", value: "Meio Ambiente" },
          { title: "Politics", value: "Política" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      placeholder: "e.g., 5 min",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      placeholder: "ex: Reuters BRICS, Agência Brasil, BRICS News",
      description: "Fonte da notícia (obrigatório)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      initialValue: false,
      description: "Marque para destacar este artigo na página inicial",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
      },
      initialValue: "published", // Mudei para "published" como padrão
      description: "Status de publicação do artigo",
    }),
  ],
  preview: {
    select: {
      title: "title.pt",
      subtitle: "country",
      media: "image",
      slug: "slug.current",
    },
    prepare(selection) {
      const { title, subtitle, media, slug } = selection
      return {
        title: title,
        subtitle: `${subtitle} • /${slug}`,
        media: media,
      }
    },
  },
})
