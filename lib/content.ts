/**
 * All site copy lives here. Everything below is sample content for the
 * Funny Face template — replace names, honours and projects with your own.
 */
export const site = {
  name: 'Funny Face',
  role: 'Creative Developer',
  email: 'hello@funnyface.studio',
  url: 'https://funnyface.studio',
  // Typed out line by line in the header's status cell.
  status: ['No rush, honestly', 'Pixels pushed with care', 'Mixing mischief and code', 'Currently rendering'],
  location: 'Coding from anywhere, mostly.',
  availability: 'Open for freelance work',
  since: ['Making', 'faces on', 'the web', 'since 2014'],
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export const social = [
  { label: 'GitHub', href: 'https://github.com', icon: 'cube' as const },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'in' as const },
];

/** About copy. Wrap link text as [label](url) to get an underlined link. */
export const about = [
  'I team up with studios and designers to build websites people remember, giving every idea a pulse and a little mischief in motion.',
  'I started out doodling faces in the margins of maths homework, taught myself HTML to put them online, drifted through Flash, PHP and far too many CMSs, shipped a pile of projects, ran a small team, co-founded [Oddly Studio](#work) and [Funny Lab](#work), picked up a few shiny pixels, and still learn something every week.',
];

/**
 * Awards grid: 4 columns, each row one third of the column width.
 * `col` / `row` are CSS grid-line ranges. Sample entries — replace with yours.
 */
export type Award =
  | { kind: 'text'; lines: [string, string]; col: string; row: string }
  | { kind: 'counter'; name: string[]; counts: string[]; col: string; row: string }
  | { kind: 'hatch'; col: string; row: string }
  | { kind: 'globe'; col: string; row: string };

export const awards: Award[] = [
  { kind: 'text', lines: ['2025 Sample Awards Winner', 'Best Home Page'], col: '1 / 5', row: '1 / 2' },
  { kind: 'counter', name: ['PIXL', 'PRIZE'], counts: ['(Gold x 12)', '(Jury x 1)'], col: '1 / 3', row: '2 / 4' },
  { kind: 'text', lines: ['Web Mag SOTM', 'Summer 2019'], col: '3 / 5', row: '2 / 3' },
  { kind: 'hatch', col: '3 / 4', row: '3 / 4' },
  { kind: 'counter', name: ['WEB'], counts: ['(Day x 4)', '(Month x 2)'], col: '4 / 5', row: '3 / 4' },
  { kind: 'text', lines: ['Arts Annual Interactive', 'Competition Winner 2020'], col: '1 / 5', row: '4 / 5' },
  { kind: 'globe', col: '1 / 2', row: '5 / 6' },
  { kind: 'counter', name: ['CRAFT'], counts: ['(Day x 9)', '(Month x 1)'], col: '2 / 4', row: '5 / 6' },
  { kind: 'hatch', col: '4 / 5', row: '5 / 6' },
  { kind: 'text', lines: ['Motion SOTM', 'October 2024'], col: '1 / 3', row: '6 / 7' },
  { kind: 'text', lines: ['Motion SOTM', 'November 2024'], col: '3 / 5', row: '6 / 7' },
  { kind: 'hatch', col: '1 / 2', row: '7 / 8' },
  { kind: 'text', lines: ['Best Front-End', 'Developer 2018'], col: '2 / 5', row: '7 / 8' },
  { kind: 'text', lines: ['Best Front-End', 'Developer 2017'], col: '1 / 4', row: '8 / 9' },
  { kind: 'hatch', col: '4 / 5', row: '8 / 9' },
];

export type ArtKind = 'rings' | 'bars' | 'wave' | 'floor' | 'face' | 'orbit' | 'hatch' | 'type';

export const projects: { title: string; role: string; year: string; art: ArtKind; url?: string }[] = [
  { title: 'Moonbeam Records', role: 'WebGL · Front-end', year: '2025', art: 'rings' },
  { title: 'Paper Tigers', role: 'Motion · Front-end', year: '2025', art: 'hatch' },
  { title: 'Plastic Weather', role: 'Creative dev', year: '2024', art: 'wave' },
  { title: 'Northwind Ferries', role: 'Front-end · CMS', year: '2024', art: 'floor' },
  { title: 'Kilo Coffee', role: 'E-commerce', year: '2023', art: 'bars' },
  { title: 'Oddly Studio', role: 'Portfolio · WebGL', year: '2023', art: 'face' },
  { title: 'Hush Hush Archive', role: 'Creative dev', year: '2022', art: 'orbit' },
  { title: 'Gleam Type Foundry', role: 'Type tester', year: '2022', art: 'type' },
];
