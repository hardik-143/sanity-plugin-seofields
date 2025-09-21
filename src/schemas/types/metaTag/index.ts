import { defineType } from "sanity";

export default defineType({
    name: "metaTag",
    title: "Meta Tag",
    type: "object",
    fields: [
        {
            name: "metaAttributes",
            title: "Meta Attributes",
            type: "array",
            of: [{ type: "metaAttribute" }],
            description: "Add custom meta attributes to the head of the document for additional SEO and social media integration.",
        },
    ],
})