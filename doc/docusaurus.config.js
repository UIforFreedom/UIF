// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'UIF',
  tagline: 'User Interface for Freedom',
  favicon: 'img/favicon.ico',

  plugins: [
    [
      "@gracefullight/docusaurus-plugin-microsoft-clarity",
      {projectId: "prdk0ozld7"},
    ],
  ],

  // Set the production url of your site here
  url: 'https://ui4freedom.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/UIF_help/',


  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'UIF', // Usually your GitHub org/user name.
  projectName: 'UIF', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/UIforFreedom/UIF/doc/doc',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/UIforFreedom/UIF/doc/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-JW92CMCVJ9',
          anonymizeIP: false,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'UIF',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [{
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left'
        },
        {
          href: 'https://github.com/UIforFreedom/UIF',
          label: 'GitHub',
          position: 'right',
        },
        ],
      },
      footer: {
        style: 'dark',
        links: [{
          title: 'Docs',
          items: [{
            label: 'Tutorial',
            to: '/docs/quic/intro',
          },],
        },
        {
          title: 'Community',
          items: [{
            label: 'GitHub Discussions',
            href: 'https://github.com/UIforFreedom/UIF/discussions',
          }],
        },
        {
          title: 'More',
          items: [{
            label: 'Blog',
            to: '/blog',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/UIforFreedom/UIF',
          },
          ],
        },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} UIF Community. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
