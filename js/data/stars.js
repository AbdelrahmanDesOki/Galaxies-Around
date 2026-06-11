// Nearby stars — the solar neighbourhood within ~26 light-years.
// Distances in light-years; galactic XYZ positions (light-years) are
// approximate, derived from RA/Dec/parallax for a recognisable layout.
// Reference: NASA, RECONS, ESA Gaia.

// color is an approximate RGB for the star's spectral class.
export const NEARBY_STARS = [
  {
    id: 'sol', name: 'The Sun', spectral: 'G2V', color: 0xfff2cc,
    distanceLy: 0, pos: [0, 0, 0], magnitude: -26.7,
    desc: 'Our home star, the reference point for the solar neighbourhood. Every other star here is shown relative to the Sun.',
    stats: { 'Type': 'G2V dwarf', 'Distance': '0 ly', 'Note': 'You are here' },
    source: 'https://science.nasa.gov/sun/',
  },
  {
    id: 'proxima', name: 'Proxima Centauri', spectral: 'M5.5V', color: 0xff8855,
    distanceLy: 4.24, pos: [-1.6, -1.2, 3.8], magnitude: 11.13,
    desc: 'The closest known star to the Sun — a faint red dwarf in the Alpha Centauri system. It hosts Proxima b, a roughly Earth-mass planet in the habitable zone.',
    stats: {
      'Type': 'Red dwarf (M5.5V)', 'Distance': '4.24 ly',
      'Constellation': 'Centaurus', 'Planets': 'At least 2',
    },
    facts: [
      'Even as our nearest stellar neighbour, it is far too dim to see with the naked eye.',
      'A spacecraft at today’s speeds would take ~75,000 years to reach it.',
    ],
    source: 'https://science.nasa.gov/exoplanet-catalog/proxima-centauri-b/',
  },
  {
    id: 'alphacen', name: 'Alpha Centauri A & B', spectral: 'G2V + K1V', color: 0xfff0c0,
    distanceLy: 4.37, pos: [-1.7, -1.3, 3.9], magnitude: -0.27,
    desc: 'A bright binary Sun-like pair and the third-brightest star in the night sky. Together with Proxima they form the closest stellar system to the Solar System.',
    stats: {
      'Type': 'Binary (G2V + K1V)', 'Distance': '4.37 ly',
      'Constellation': 'Centaurus', 'Magnitude': '−0.27 (combined)',
    },
    facts: ['Alpha Centauri A is almost a twin of our own Sun.'],
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'barnard', name: "Barnard's Star", spectral: 'M4V', color: 0xff7744,
    distanceLy: 5.96, pos: [-0.1, 5.1, -3.0], magnitude: 9.5,
    desc: 'A low-mass red dwarf famous for having the largest proper motion of any known star — it visibly creeps across the sky over a human lifetime.',
    stats: { 'Type': 'Red dwarf (M4V)', 'Distance': '5.96 ly', 'Constellation': 'Ophiuchus' },
    facts: ['It moves across the sky by about a Moon-width every 180 years.'],
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'wolf359', name: 'Wolf 359', spectral: 'M6V', color: 0xff6b3a,
    distanceLy: 7.86, pos: [4.0, 4.3, -4.6], magnitude: 13.5,
    desc: 'One of the faintest and lowest-mass red dwarfs known, in the constellation Leo. It is a flare star prone to sudden brightness spikes.',
    stats: { 'Type': 'Red dwarf (M6V)', 'Distance': '7.86 ly', 'Constellation': 'Leo' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'lalande', name: 'Lalande 21185', spectral: 'M2V', color: 0xff8a55,
    distanceLy: 8.31, pos: [-6.4, 5.3, 0.5], magnitude: 7.5,
    desc: 'A red dwarf in Ursa Major and one of the brightest red dwarfs in our skies, though still invisible without a telescope. It hosts at least two known planets.',
    stats: { 'Type': 'Red dwarf (M2V)', 'Distance': '8.31 ly', 'Constellation': 'Ursa Major' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'sirius', name: 'Sirius', spectral: 'A1V', color: 0xcfe4ff,
    distanceLy: 8.6, pos: [-1.6, -7.7, -3.3], magnitude: -1.46,
    desc: 'The brightest star in Earth’s night sky, in Canis Major. Sirius is a hot blue-white star with a white-dwarf companion, Sirius B.',
    stats: {
      'Type': 'Binary (A1V + DA)', 'Distance': '8.6 ly',
      'Constellation': 'Canis Major', 'Magnitude': '−1.46',
    },
    facts: ['Its name comes from the Greek for “scorching”.'],
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'rosscassi', name: 'Ross 154', spectral: 'M3.5V', color: 0xff7a48,
    distanceLy: 9.7, pos: [1.9, 8.8, -3.8], magnitude: 10.4,
    desc: 'A flare-prone red dwarf in Sagittarius, relatively young and magnetically active.',
    stats: { 'Type': 'Red dwarf (M3.5V)', 'Distance': '9.7 ly', 'Constellation': 'Sagittarius' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'epseri', name: 'Epsilon Eridani', spectral: 'K2V', color: 0xffd9a0,
    distanceLy: 10.5, pos: [-7.2, -7.0, -1.7], magnitude: 3.73,
    desc: 'A young, Sun-like orange dwarf with a dusty debris disk — a nearby system that resembles an early Solar System and is a frequent target in the search for planets.',
    stats: { 'Type': 'Orange dwarf (K2V)', 'Distance': '10.5 ly', 'Constellation': 'Eridanus' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'procyon', name: 'Procyon', spectral: 'F5IV', color: 0xfff4e0,
    distanceLy: 11.46, pos: [-4.8, -10.3, 1.1], magnitude: 0.34,
    desc: 'The eighth-brightest star in the night sky, in Canis Minor. Like Sirius, it is a bright star paired with a faint white-dwarf companion.',
    stats: { 'Type': 'Subgiant (F5IV)', 'Distance': '11.46 ly', 'Constellation': 'Canis Minor' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'tauceti', name: 'Tau Ceti', spectral: 'G8V', color: 0xfff0cc,
    distanceLy: 11.9, pos: [-10.3, -5.8, -1.8], magnitude: 3.5,
    desc: 'The nearest single Sun-like star, in Cetus. It is a stable, metal-poor star with a debris disk and several candidate planets.',
    stats: { 'Type': 'Yellow dwarf (G8V)', 'Distance': '11.9 ly', 'Constellation': 'Cetus' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
  {
    id: 'vega', name: 'Vega', spectral: 'A0V', color: 0xcfe0ff,
    distanceLy: 25.0, pos: [4.5, 24.0, 5.6], magnitude: 0.03,
    desc: 'A brilliant blue-white star in Lyra and one of the most studied stars after the Sun. Vega was the northern pole star ~12,000 years ago and will be again.',
    stats: { 'Type': 'White dwarf-class (A0V)', 'Distance': '25 ly', 'Constellation': 'Lyra' },
    facts: ['Vega defined the original zero-point of the magnitude scale.'],
    source: 'https://science.nasa.gov/universe/stars/',
  },
];

// Famous deep-sky landmarks placed within the Milky Way view (distances in ly).
export const GALACTIC_LANDMARKS = [
  {
    id: 'sgrastar', name: 'Sagittarius A*', kind: 'blackhole', color: 0xffaa33,
    distanceLy: 26000, desc: 'The supermassive black hole at the centre of the Milky Way, with a mass of about 4.3 million Suns. It was directly imaged by the Event Horizon Telescope in 2022.',
    stats: { 'Type': 'Supermassive black hole', 'Mass': '4.3 million Suns', 'Distance': '26,000 ly' },
    source: 'https://science.nasa.gov/universe/black-holes/',
  },
  {
    id: 'orionneb', name: 'Orion Nebula (M42)', kind: 'nebula', color: 0xff77aa,
    distanceLy: 1344, desc: 'A vast stellar nursery in the sword of Orion where thousands of new stars are being born — the closest large region of massive star formation to Earth.',
    stats: { 'Type': 'Emission nebula', 'Distance': '1,344 ly', 'Width': '~24 ly' },
    source: 'https://science.nasa.gov/mission/hubble/',
  },
  {
    id: 'pleiades', name: 'Pleiades (M45)', kind: 'cluster', color: 0xaaccff,
    distanceLy: 444, desc: 'The Seven Sisters — a young open cluster of hot blue stars wrapped in wispy reflection nebulosity, visible to the naked eye in Taurus.',
    stats: { 'Type': 'Open star cluster', 'Distance': '444 ly', 'Stars': '~1,000' },
    source: 'https://science.nasa.gov/universe/star-clusters/',
  },
  {
    id: 'betelgeuse', name: 'Betelgeuse', kind: 'star', color: 0xff5533,
    distanceLy: 642, desc: 'A red supergiant in Orion so large it would swallow the orbit of Jupiter. It is nearing the end of its life and will one day explode as a supernova.',
    stats: { 'Type': 'Red supergiant (M1-2)', 'Distance': '642 ly', 'Radius': '~700× the Sun' },
    source: 'https://science.nasa.gov/universe/stars/',
  },
];
