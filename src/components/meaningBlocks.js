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

export const endings = [{
  "name": "circular ending",
  "explain": "The story circles back to the beginning. Sometimes an author will end with the same idea or similar/exact words as the beginning of the story."
}, {
  "name": "cliffhanger ending",
  "explain": "The story ends by leaving the reader hanging or wanting more. Writers use this strategy to tease readers or excite them into reading more (the next chapter or the next book in a series)."
}, {
  "name": "dialogue ending",
  "explain": "The story ends with an important conversation or quote. By ending with a quote, the writer captivates the audience by making the characters more realistic and revealing their personalities."
}, {
  "name": "funny thought/humor ending",
  "explain": "The story ends with a funny thought or something that makes the reader laugh. This helps to make the ending more memorable to the reader."
}, {
  "name": "image ending",
  "explain": "The story ends with an important scene that the writer shows the reader through vivid details. By showing and not telling, the writer touches the reader's emotions and conveys a mood."
}, {
  "name": "lesson or moral ending",
  "explain": "The main character in the story grows, changes, or learns something at the end of the story."
}, {
  "name": "question ending",
  "explain": "The story ends with a question to keep the reader thinking. The question usually involves the reader, and writers use this strategy to make their writing memorable."
}, {
  "name": "reflection ending",
  "explain": "The narrator of the story steps back and reflects on what just happened. He or she often looks back on an experience and determines the importance of that experience, what was learned, etc."
}, {
  "name": "surprise ending",
  "explain": "The story takes you where you didn't expect it to go. Sometimes this ending is called a twist ending (plot twist) because the story takes an exciting turn."
}, {
  "name": "warm fuzzy/capturing emotion ending",
  "explain": "The story ends leaving you feeling emotional or good inside. A good writer tugs at the heart strings to make the reader feel something."
}];

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
