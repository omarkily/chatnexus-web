// Define types for navigation items
interface NavItem {
  label: string;
  href: string;
}

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ChatNexus",
  description: "Advanced AI chat platform for seamless conversations.",
  links: {
    github: "https://github.com/omarkily/chatnexus-web",
    twitter: "https://twitter.com/",
    discord: "https://discord.gg/",
    sponsor: "https://patreon.com/",
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/overview",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    }
  ] as NavItem[],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/overview",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Logout",
      href: "/login",
    }
  ] as NavItem[],
};
