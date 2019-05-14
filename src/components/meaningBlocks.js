export const patterns = {
  Fidelity: 'A set of ( items || concepts ) and how they exist in a single context',
  Magnitude: 'One ( item || concept ) and how it exists in a set of contexts'
};

export const affectLevels = [
  {
    name: 'Autonomy',
    descrip: 'The self or immediate friends and family'
  }, {
    name: 'Community',
    descrip: 'The wider community, town, country'
  }, {
    name: 'Divinity',
    descrip: 'Humanity, morality, fundamental logic, basic truths'
  }
];

export const humors = [
  {
    name: 'Positive Repetition',
    type: 'Fidelity',
    descrip: 'A catch phrase or common pattern of speech'
  }, {
    name: 'Division',
    type: 'Fidelity',
    descrip: 'Comparing the parts of an item or concept'
  }, {
    name: 'Completion',
    type: 'Fidelity',
    descrip: 'Adding missing items or concepts to complete a context'
  }, {
    name: 'Translation',
    type: 'Fidelity',
    descrip: 'Unifying the perception of many items / concepts'
  }, {
    name: 'Opposition',
    type: 'Magnitude',
    descrip: 'One item or concept in contrasting contexts'
  }, {
    name: 'Application',
    type: 'Magnitude',
    descrip: 'Using an item or concept in unexpected ways'
  }, {
    name: 'Qualifiation',
    type: 'Magnitude',
    descrip: 'Adding information specify the contexts of an item or concept'
  }, {
    name: 'Scale',
    type: 'Magnitude',
    descrip: 'Repetition of an item or concept at different levels'
  }
];
export const arcs = [
  {
    name: 'Rise',
    orientations: [false, false, false]
  }, {
    name: 'Fall',
    orientations: [true, true, true]
  }, {
    name: 'Rebound',
    orientations: [true, true, false]
  }, {
    name: 'Icarus',
    orientations: [false, false, true]
  }, {
    name: 'Cinderella',
    orientations: [false, true, false]
  }, {
    name: 'Oedipus',
    orientations: [true, false, true]
  }
];

export const conflicts = [
  {
    title: 'Hero vs. Fate / God',
    explain: 'Hero fights against their destiny.',
  },   {
    title: 'Hero vs. Self',
    explain: 'Hero fights against their own prejudices, doubts, or flaws.',
  },   {
    title: 'Hero vs. Antagonist',
    explain: 'Hero fights an enemy or enemies.',
  },   {
    title: 'Hero vs. Society',
    explain: 'Hero fights against institutions, laws, traditions, corruption.',
  },   {
    title: 'Hero vs. Nature',
    explain: 'Hero fights for life in the wilderness.',
  },   {
    title: 'Hero vs. Supernatural (Unknown)',
    explain: 'Hero fights against otherworldy forces.',
  },   {
    title: 'Hero vs. Technology (Systems)',
    explain: 'Hero fights against corrupted tools and systems.',
  }
];

export const importAll = function(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
  });

  Object.keys(images).forEach((src) => {
    let img = new Image();
    img.src = images[src];
  })

  return images;
};
