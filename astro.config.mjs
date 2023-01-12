import { defineConfig } from 'astro/config';
import codeExtra from 'remark-code-extra';
import rehypeShiki from 'rehype-shiki';

export default defineConfig({
  markdown: {
    syntaxHighlight: false,
    extendDefaultPlugins: true,
    remarkPlugins: [
      [
        codeExtra,
        {
          transform: (node) =>
            node.lang
              ? {
                  transform: (node) => {
                    // Add classes to enable adding language badge to corner of code block (Shiki strips the class from the code tag)
                    node.data.hProperties.className.push(`codeblock codeblock--${node.lang}`);
                  },
                }
              : {
                  transform: (node) => {
                    node.data.hProperties.className.push(`codeblock`);
                  },
                },
        },
      ],
    ],
    rehypePlugins: [[rehypeShiki, { theme: 'one-dark-pro' }]],
    // TODO: Astro native shiki not working with codeExtra - replaced with rehypeShiki - get Astro native Shiki to work
    // shikiConfig: {
    //   theme: 'one-dark-pro',
    //   langs: [],
    //   wrap: true,
    // },
  },
  vite: {
    // Added for https://github.com/natemoo-re/astro-icon
    ssr: {
      external: ['svgo'],
    },
  },
  server: {
    host: true,
  },
});
