import { defineConfig } from 'vitepress'
import { generateMultiSidebar } from './utils/generateSidebar'
import { sidebarConfigs } from './config/sidebar.config'

// Generate dynamic sidebars based on configuration
const dynamicSidebar = generateMultiSidebar(sidebarConfigs);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Create: Mobile Packages Wiki",
  description: "Make your Create Packages Mobile",

  cleanUrls: true,
  lastUpdated: true,

  head: [["link", { rel: "icon", href: "/robo_bee.png" }]],

  themeConfig: {
    logo: {
      src: "robo_bee.png",
      width: 24,
      height: 24,
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: dynamicSidebar,

    search: {
      provider: "local"
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/timplay33/Create-Mobile-Packages",
      },
      { icon: "discord", link: "https://discord.gg/uk5Fm2tnAT" },
    ],

    editLink: {
      pattern: "https://github.com/timplay33/Wiki-Create-Mobile-Packages/edit/main/:path",
      text: "Edit this page on GitHub",
    },
  },

  srcExclude: ["**/README.md"],

  sitemap: {
    hostname: "https://wiki.cmp.theidler.de",
  },
});
