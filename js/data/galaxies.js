// The Milky Way, the Local Group, and the large-scale universe.
// Distances from NASA; Local Group positions (in millions of light-years,
// Mly) are schematic to give a readable 3-D layout.

export const MILKY_WAY = {
  id: 'milkyway', name: 'The Milky Way', kind: 'galaxy', type: 'Barred spiral (SBbc)',
  color: 0xbfd0ff,
  desc: 'Our home galaxy — a barred spiral roughly 100,000 light-years across containing 100–400 billion stars. The Sun sits about 26,000 light-years from the centre, on the inner edge of the Orion Arm.',
  stats: {
    'Type': 'Barred spiral', 'Diameter': '~100,000 ly',
    'Stars': '100–400 billion', 'Mass': '~1.5 trillion Suns',
    'Sun’s distance from core': '26,000 ly', 'Age': '13.6 billion yrs',
  },
  facts: [
    'It takes the Sun ~230 million years to orbit the galactic centre once.',
    'A supermassive black hole, Sagittarius A*, anchors its core.',
    'The Milky Way is on a collision course with Andromeda, ~4.5 billion years out.',
  ],
  source: 'https://science.nasa.gov/universe/galaxies/',
};

// Local Group — positions in Mly relative to the Milky Way at origin.
export const LOCAL_GROUP = [
  {
    id: 'milkyway', name: 'Milky Way', kind: 'galaxy', galaxyType: 'spiral',
    color: 0xbfd0ff, pos: [0, 0, 0], diameterLy: 100000,
    desc: 'Our home galaxy and one of the two giant spirals that dominate the Local Group.',
    stats: { 'Type': 'Barred spiral', 'Diameter': '~100,000 ly', 'Note': 'You are here' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'andromeda', name: 'Andromeda (M31)', kind: 'galaxy', galaxyType: 'spiral',
    color: 0xd8c0ff, pos: [2.5, 0.3, 0.4], diameterLy: 220000,
    desc: 'The largest galaxy in the Local Group and the most distant object visible to the naked eye. Andromeda is approaching the Milky Way at 110 km/s and the two will merge in billions of years.',
    stats: {
      'Type': 'Barred spiral', 'Distance': '2.5 million ly',
      'Diameter': '~220,000 ly', 'Stars': '~1 trillion',
    },
    facts: ['You can see Andromeda with the naked eye from a dark sky — its light left 2.5 million years ago.'],
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'triangulum', name: 'Triangulum (M33)', kind: 'galaxy', galaxyType: 'spiral',
    color: 0xc0d8ff, pos: [2.7, -0.4, 0.9], diameterLy: 60000,
    desc: 'The third-largest galaxy in the Local Group — a face-on spiral and a possible satellite of Andromeda, dotted with bright star-forming regions.',
    stats: { 'Type': 'Spiral', 'Distance': '2.73 million ly', 'Diameter': '~60,000 ly' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'lmc', name: 'Large Magellanic Cloud', kind: 'galaxy', galaxyType: 'irregular',
    color: 0xcfe0ff, pos: [-0.16, -0.05, 0.04], diameterLy: 14000,
    desc: 'A satellite dwarf galaxy of the Milky Way, visible from the southern hemisphere. It hosts the Tarantula Nebula, the most active star-forming region known in the Local Group.',
    stats: { 'Type': 'Irregular dwarf', 'Distance': '160,000 ly', 'Diameter': '~14,000 ly' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'smc', name: 'Small Magellanic Cloud', kind: 'galaxy', galaxyType: 'irregular',
    color: 0xcfe0ff, pos: [-0.2, -0.06, 0.02], diameterLy: 7000,
    desc: 'A second dwarf companion of the Milky Way, a faint smudge in the southern sky and a close partner of the Large Magellanic Cloud.',
    stats: { 'Type': 'Irregular dwarf', 'Distance': '200,000 ly', 'Diameter': '~7,000 ly' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
];

// Large-scale universe structures, shown in the Observable Universe view.
export const COSMIC_STRUCTURES = [
  {
    id: 'localgroup', name: 'The Local Group', kind: 'structure', color: 0xbfd0ff,
    desc: 'Our galactic neighbourhood — a gravitationally bound collection of more than 80 galaxies spanning about 10 million light-years, dominated by the Milky Way and Andromeda.',
    stats: { 'Galaxies': '80+', 'Span': '~10 million ly', 'Note': 'You are here' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'virgo', name: 'Virgo Cluster', kind: 'structure', color: 0xd8c0ff,
    desc: 'The nearest large galaxy cluster, containing some 1,300+ galaxies. It forms the gravitational heart of the larger Virgo Supercluster, of which the Local Group is an outlying member.',
    stats: { 'Galaxies': '1,300+', 'Distance': '54 million ly', 'Span': '~15 million ly' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'laniakea', name: 'Laniakea Supercluster', kind: 'structure', color: 0xa0c0ff,
    desc: 'The immense supercluster of galaxies that the Milky Way belongs to — a flowing basin of ~100,000 galaxies spanning 520 million light-years, named from Hawaiian for “immense heaven”.',
    stats: { 'Galaxies': '~100,000', 'Span': '520 million ly' },
    source: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    id: 'cmb', name: 'Cosmic Microwave Background', kind: 'structure', color: 0xffd0a0,
    desc: 'The afterglow of the Big Bang — the oldest light in the universe, released 380,000 years after the beginning and now stretched into faint microwaves filling all of space. It marks the visible edge of the observable universe.',
    stats: { 'Age of light': '13.8 billion yrs', 'Temperature': '2.7 K', 'Released': '380,000 yrs after Big Bang' },
    source: 'https://science.nasa.gov/universe/overview/',
  },
];

export const OBSERVABLE_UNIVERSE = {
  id: 'universe', name: 'The Observable Universe', kind: 'universe',
  desc: 'Everything we can in principle see — a sphere about 93 billion light-years across, woven into a vast cosmic web of filaments and voids holding an estimated 2 trillion galaxies. Beyond its edge lies more universe whose light has not yet had time to reach us.',
  stats: {
    'Diameter': '93 billion ly', 'Age': '13.8 billion yrs',
    'Galaxies': '~2 trillion', 'Atoms': '~10⁸⁰',
    'Dark energy': '68%', 'Dark matter': '27%',
  },
  facts: [
    'Ordinary matter — stars, planets, people — is just ~5% of the universe.',
    'The cosmic web links galaxies into filaments surrounding enormous empty voids.',
    'Because looking far away means looking back in time, the edge shows the infant universe.',
  ],
  source: 'https://science.nasa.gov/universe/',
};
