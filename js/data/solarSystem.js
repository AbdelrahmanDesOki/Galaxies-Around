// Solar System data — values from NASA / JPL planetary fact sheets.
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/
// Sizes and orbital distances are stored in real units; the renderer
// compresses them for visibility (a true-scale solar system is mostly void).

export const SUN = {
  id: 'sun',
  name: 'The Sun',
  kind: 'star',
  type: 'G2V Yellow Dwarf',
  color: 0xffd27a,
  radiusKm: 695700,
  desc: 'The Sun is the star at the heart of our Solar System — a 4.6-billion-year-old sphere of hot plasma that holds 99.86% of the system’s mass. Its core fuses 600 million tonnes of hydrogen into helium every second.',
  stats: {
    'Diameter': '1,391,400 km',
    'Mass': '1.989 × 10³⁰ kg',
    'Surface temp': '5,500 °C',
    'Core temp': '15 million °C',
    'Age': '4.6 billion yrs',
    'Composition': '73% H, 25% He',
  },
  facts: [
    'Light from the Sun takes about 8 minutes 20 seconds to reach Earth.',
    'Over 1.3 million Earths could fit inside it.',
    'It travels around the Milky Way once every ~230 million years.',
  ],
  source: 'https://science.nasa.gov/sun/',
};

// distanceAU = semi-major axis. dayLengthHr negative = retrograde rotation.
export const PLANETS = [
  {
    id: 'mercury', name: 'Mercury', kind: 'planet', color: 0x9c8a7a,
    radiusKm: 2439.7, distanceAU: 0.387, orbitDays: 88.0, dayLengthHr: 1407.6,
    moons: 0, axialTilt: 0.034,
    type: 'Terrestrial planet',
    desc: 'The smallest planet and the closest to the Sun. Mercury has a battered, crater-pocked surface like our Moon and swings through the most extreme temperature range of any planet.',
    stats: {
      'Diameter': '4,879 km', 'Mass': '3.30 × 10²³ kg',
      'Distance from Sun': '57.9 million km', 'Year': '88 Earth days',
      'Day': '1,408 hours', 'Mean temp': '167 °C', 'Moons': '0',
    },
    facts: [
      'A day on Mercury (sunrise to sunrise) lasts 176 Earth days.',
      'Temperatures swing from 430 °C in sunlight to −180 °C at night.',
      'Despite being closest to the Sun, it is not the hottest planet — Venus is.',
    ],
    source: 'https://science.nasa.gov/mercury/',
  },
  {
    id: 'venus', name: 'Venus', kind: 'planet', color: 0xe8c884,
    radiusKm: 6051.8, distanceAU: 0.723, orbitDays: 224.7, dayLengthHr: -5832.5,
    moons: 0, axialTilt: 177.4,
    type: 'Terrestrial planet',
    desc: 'Earth’s scorching twin. A runaway greenhouse effect under a thick carbon-dioxide atmosphere makes Venus the hottest planet in the Solar System, with surface pressure 90 times Earth’s.',
    stats: {
      'Diameter': '12,104 km', 'Mass': '4.87 × 10²⁴ kg',
      'Distance from Sun': '108.2 million km', 'Year': '225 Earth days',
      'Day': '5,833 hours', 'Mean temp': '464 °C', 'Moons': '0',
    },
    facts: [
      'Venus spins backwards — the Sun rises in the west and sets in the east.',
      'Its day is longer than its year.',
      'Surface pressure equals being 900 m underwater on Earth.',
    ],
    source: 'https://science.nasa.gov/venus/',
  },
  {
    id: 'earth', name: 'Earth', kind: 'planet', color: 0x4f93d6,
    radiusKm: 6371.0, distanceAU: 1.0, orbitDays: 365.25, dayLengthHr: 23.93,
    moons: 1, axialTilt: 23.44, hasSurface: true,
    type: 'Terrestrial planet',
    desc: 'Our home world — the only place in the universe known to harbour life. Liquid water covers 71% of its surface, and a protective magnetic field and atmosphere shield it from solar radiation.',
    stats: {
      'Diameter': '12,756 km', 'Mass': '5.97 × 10²⁴ kg',
      'Distance from Sun': '149.6 million km', 'Year': '365.25 days',
      'Day': '23.93 hours', 'Mean temp': '15 °C', 'Moons': '1',
    },
    facts: [
      'Earth is the densest planet in the Solar System.',
      'It is the only planet not named after a Greek or Roman deity.',
      'The 149.6-million-km Sun–Earth distance defines 1 Astronomical Unit (AU).',
    ],
    source: 'https://science.nasa.gov/earth/',
  },
  {
    id: 'mars', name: 'Mars', kind: 'planet', color: 0xc1502e,
    radiusKm: 3389.5, distanceAU: 1.524, orbitDays: 687.0, dayLengthHr: 24.62,
    moons: 2, axialTilt: 25.19, hasSurface: true,
    type: 'Terrestrial planet',
    desc: 'The Red Planet, rusted by iron-oxide dust. Mars hosts the tallest volcano (Olympus Mons) and the largest canyon (Valles Marineris) in the Solar System, and once had rivers and lakes.',
    stats: {
      'Diameter': '6,792 km', 'Mass': '6.42 × 10²³ kg',
      'Distance from Sun': '227.9 million km', 'Year': '687 Earth days',
      'Day': '24.6 hours', 'Mean temp': '−65 °C', 'Moons': '2',
    },
    facts: [
      'Olympus Mons is ~22 km tall — nearly three times the height of Everest.',
      'Mars has seasons like Earth thanks to a similar axial tilt.',
      'Its two moons, Phobos and Deimos, are likely captured asteroids.',
    ],
    source: 'https://science.nasa.gov/mars/',
  },
  {
    id: 'jupiter', name: 'Jupiter', kind: 'planet', color: 0xd8a47f,
    radiusKm: 69911, distanceAU: 5.204, orbitDays: 4331, dayLengthHr: 9.93,
    moons: 95, axialTilt: 3.13, banded: true,
    type: 'Gas giant',
    desc: 'The king of planets — more massive than all the others combined. Jupiter is a colossal ball of hydrogen and helium wrapped in storm bands, including the Great Red Spot, a storm wider than Earth.',
    stats: {
      'Diameter': '142,984 km', 'Mass': '1.898 × 10²⁷ kg',
      'Distance from Sun': '778.5 million km', 'Year': '11.9 Earth years',
      'Day': '9.9 hours', 'Mean temp': '−110 °C', 'Moons': '95',
    },
    facts: [
      'The Great Red Spot has raged for at least 350 years.',
      'Jupiter has the shortest day of any planet — under 10 hours.',
      'Its four largest moons were spotted by Galileo in 1610.',
    ],
    source: 'https://science.nasa.gov/jupiter/',
  },
  {
    id: 'saturn', name: 'Saturn', kind: 'planet', color: 0xe3c98f,
    radiusKm: 58232, distanceAU: 9.583, orbitDays: 10747, dayLengthHr: 10.66,
    moons: 146, axialTilt: 26.73, banded: true, rings: true,
    type: 'Gas giant',
    desc: 'The jewel of the Solar System, encircled by a dazzling system of icy rings spanning up to 282,000 km yet often only ~10 m thick. Saturn is the least dense planet — it would float in water.',
    stats: {
      'Diameter': '120,536 km', 'Mass': '5.68 × 10²⁶ kg',
      'Distance from Sun': '1.43 billion km', 'Year': '29.4 Earth years',
      'Day': '10.7 hours', 'Mean temp': '−140 °C', 'Moons': '146',
    },
    facts: [
      'Saturn’s rings are made of billions of chunks of ice and rock.',
      'It has the most confirmed moons of any planet.',
      'Its moon Titan has a thick atmosphere and liquid-methane lakes.',
    ],
    source: 'https://science.nasa.gov/saturn/',
  },
  {
    id: 'uranus', name: 'Uranus', kind: 'planet', color: 0x9fe0e3,
    radiusKm: 25362, distanceAU: 19.191, orbitDays: 30589, dayLengthHr: -17.24,
    moons: 28, axialTilt: 97.77, rings: true,
    type: 'Ice giant',
    desc: 'An ice giant tipped completely on its side, so it rolls around the Sun like a barrel. Methane in its atmosphere gives Uranus its pale cyan hue, and it is the coldest planet in the Solar System.',
    stats: {
      'Diameter': '51,118 km', 'Mass': '8.68 × 10²⁵ kg',
      'Distance from Sun': '2.87 billion km', 'Year': '84 Earth years',
      'Day': '17.2 hours', 'Min temp': '−224 °C', 'Moons': '28',
    },
    facts: [
      'Uranus rotates on its side with a 98° axial tilt.',
      'Each pole spends 42 years in sunlight, then 42 in darkness.',
      'It was the first planet discovered with a telescope, in 1781.',
    ],
    source: 'https://science.nasa.gov/uranus/',
  },
  {
    id: 'neptune', name: 'Neptune', kind: 'planet', color: 0x466fe0,
    radiusKm: 24622, distanceAU: 30.07, orbitDays: 59800, dayLengthHr: 16.11,
    moons: 16, axialTilt: 28.32, rings: true,
    type: 'Ice giant',
    desc: 'The most distant major planet — a deep-blue ice giant whipped by the fastest winds in the Solar System, reaching 2,100 km/h. Neptune was found through mathematics before it was ever seen.',
    stats: {
      'Diameter': '49,528 km', 'Mass': '1.02 × 10²⁶ kg',
      'Distance from Sun': '4.50 billion km', 'Year': '165 Earth years',
      'Day': '16.1 hours', 'Mean temp': '−200 °C', 'Moons': '16',
    },
    facts: [
      'Neptune’s winds reach supersonic speeds of ~2,100 km/h.',
      'It has completed only one orbit since its discovery in 1846.',
      'Its position was predicted by math before it was observed.',
    ],
    source: 'https://science.nasa.gov/neptune/',
  },
];

// Earth's Moon — shown when you land at / orbit Earth.
export const MOON = {
  id: 'moon', name: 'The Moon', kind: 'moon', color: 0xb9b9b9,
  radiusKm: 1737.4, distanceFromEarthKm: 384400, orbitDays: 27.3,
  type: 'Natural satellite',
  desc: 'Earth’s only natural satellite and the only world beyond Earth humans have walked on. The Moon stabilises our planet’s tilt and drives the ocean tides.',
  stats: {
    'Diameter': '3,475 km', 'Mass': '7.35 × 10²² kg',
    'Distance from Earth': '384,400 km', 'Orbit': '27.3 days',
    'Mean temp': '−20 °C', 'Gravity': '1/6 of Earth',
  },
  facts: [
    'The Moon is slowly drifting ~3.8 cm farther from Earth each year.',
    'The same side always faces Earth — it is tidally locked.',
    'Twelve people have walked on its surface (1969–1972).',
  ],
  source: 'https://science.nasa.gov/moon/',
};
