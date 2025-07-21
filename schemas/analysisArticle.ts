import { defineField, defineType } from "sanity"

export default defineType({
  name: "analysisArticle",
  title: "Analysis Article",
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
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.pt",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[àáâãäå]/g, "a")
            .replace(/[èéêë]/g, "e")
            .replace(/[ìíîï]/g, "i")
            .replace(/[òóôõö]/g, "o")
            .replace(/[ùúûü]/g, "u")
            .replace(/[ç]/g, "c")
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 96),
      },
      description: "URL amigável para a análise",
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
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Imagem pequena para a seção de análises",
    }),
    defineField({
      name: "author",
      title: "Author/Analyst",
      type: "string",
      placeholder: "ex: Dr. João Silva, Analista Econômico",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "analysisType",
      title: "Analysis Type",
      type: "string",
      options: {
        list: [
          { title: "Economic Analysis", value: "Análise Econômica" },
          { title: "Geopolitical Analysis", value: "Análise Geopolítica" },
          { title: "Technology Analysis", value: "Análise Tecnológica" },
          { title: "Market Analysis", value: "Análise de Mercado" },
          { title: "Strategic Analysis", value: "Análise Estratégica" },
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
      placeholder: "e.g., 8 min",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Tags para categorizar a análise (ex: economia, geopolítica, comércio)",
    }),
    defineField({
      name: "featured",
      title: "Featured Analysis",
      type: "boolean",
      initialValue: false,
      description: "Destacar esta análise na seção principal",
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
      initialValue: "published",
    }),
  ],
  preview: {
    select: {
      title: "title.pt",
      subtitle: "analysisType",
      media: "thumbnail",
      author: "author",
    },
    prepare(selection) {
      const { title, subtitle, media, author } = selection
      return {
        title: title,
        subtitle: `${subtitle} • ${author}`,
        media: media,
      }
    },
  },
})
