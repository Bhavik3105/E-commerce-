export const pageSections = [
  {
    id: 'home',
    label: 'Home page',
    blurb: 'Products marked for the homepage. Each collection row shows up to 4.',
  },
  {
    id: 'shop',
    label: 'Shop All',
    blurb: 'Every visible product. A product here also belongs to one collection page.',
  },
] as const;

export function isPageSection(value: string): boolean {
  return pageSections.some((section) => section.id === value);
}
