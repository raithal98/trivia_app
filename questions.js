// Trivia question bank: categories (rows) x difficulty 1-5 (columns)
// Points = difficulty * 100
// Question types:
//   mcq     (level 1): single correct option -> answer: index
//   picture (level 2): single correct option with an illustration -> answer: index, image: inline SVG markup
//   multi   (levels 3-4): select ALL correct options -> answer: array of indices
//   match   (level 5): match each left item to the correct right item -> answer: array of right-indices parallel to left[]
const QUESTION_BANK = {
  "Indian Movies": [
    {
      type: "mcq",
      q: "In 'Gangubai Kathiawadi', directed by Sanjay Leela Bhansali, Alia Bhatt's character rises to become the matriarch of which real Mumbai red-light locality?",
      options: ["Sonagachi", "GB Road", "Kamathipura", "Reshampura"],
      answer: 2
    },
    {
      type: "mcq",
      q: "Fueled by a promise made to his dying mother, an orphan rises from nothing to become one of the most feared names in the underworld, his legend pieced together by those who witnessed it unfold. Which movie is this?",
      options: ["Pushpa", "Rangasthalam", "Vikram Vedha", "KGF"],
      answer: 3
    },
    {
      type: "mcq",
      q: "In 'Baahubali: The Beginning', Sivagami personally commands the Mahishmati army from atop a moving battle rig, fighting with a sword herself during the climactic war. Which invading force is she leading the defense against?",
      options: ["The Kalinga Army", "The Kalakeyas", "The Pindaris", "The Huna tribes"],
      answer: 1
    },
    {
      type: "multi",
      q: "Which of these are Telugu-original productions (not dubbed from another language)? (select all that apply)",
      options: ["Baahubali", "Pushpa", "RRR", "KGF", "Vikram"],
      answer: [0, 1, 2]
    },
    {
      type: "match",
      q: "Match the actor to their acclaimed role.",
      left: ["Kangana Ranaut", "Vidya Balan", "Deepika Padukone", "Amitabh Bachchan", "Priyanka Chopra", "Akshay Kumar"],
      right: ["Mastani", "Lakshmikant Chauhan", "Rani", "Mary Kom", "Vidya Bagchi", "Deepak Sehgal"],
      answer: [2, 4, 0, 5, 3, 1]
    }
  ],
  "Indian Mythology & Heritage": [
    {
      type: "mcq",
      q: "After her humiliation in the Kuru court, Draupadi made a fierce vow concerning Dushasana, who had dragged her by the hair. What did she vow to do?",
      options: ["Drink his blood herself", "Curse Duryodhana's thigh to shatter in battle", "Wash her hair in his blood", "Remain childless until Kurukshetra ended"],
      answer: 2
    },
    {
      type: "mcq",
      q: "This being emerged from a palace pillar at twilight to kill a tyrant king, exploiting a boon that made him unkillable by man or beast, by day or night, indoors or outdoors, and by any weapon. Which avatar of Vishnu is this?",
      options: ["Vamana", "Parshurama", "Kurma", "Narasimha"],
      answer: 3
    },
    {
      type: "picture",
      q: "This intricately carved underground stepwell in Gujarat, dedicated to Lord Vishnu, is now featured on the back of the Indian ₹100 note. What is this UNESCO World Heritage Site called?",
      imageSrc: "images/rani-ki-vav.png",
      options: ["Chand Baori", "Adalaj Stepwell", "Modhera Sun Temple", "Rani ki Vav"],
      answer: 3
    },
    {
      type: "multi",
      q: "Which of these are officially designated 'Classical Languages of India'? (select all that apply)",
      options: ["Tamil", "Sanskrit", "Hindi", "Telugu", "Kannada"],
      answer: [0, 1, 3, 4]
    },
    {
      type: "multi",
      q: "Which of these are officially UNESCO-inscribed World Heritage Sites in India? (select all that apply)",
      options: ["Hampi", "Khajuraho", "Golden Temple, Amritsar", "Taj Mahal", "Mahabalipuram"],
      answer: [0, 1, 3, 4]
    }
  ],
  "Geopolitics": [
    {
      type: "mcq",
      q: "Which international organization, headquartered in Geneva, sets global trade rules between nations?",
      options: ["United Nations", "World Trade Organization", "World Bank", "IMF"],
      answer: 1
    },
    {
      type: "mcq",
      q: "Which two countries share the world's longest international land border?",
      options: ["Russia & China", "USA & Canada", "India & China", "Brazil & Argentina"],
      answer: 1
    },
    {
      type: "multi",
      q: "Which of these countries are permanent members of the UN Security Council (with veto power)? (select all that apply)",
      options: ["United States", "China", "Germany", "India", "Russia", "United Kingdom"],
      answer: [0, 1, 4, 5]
    },
    {
      type: "multi",
      q: "Which of these countries are members of NATO? (select all that apply)",
      options: ["France", "Sweden", "Switzerland", "Austria", "Turkey", "Japan"],
      answer: [0, 1, 4]
    },
    {
      type: "match",
      q: "Match the semiconductor company to the country most associated with its chip-manufacturing dominance.",
      left: ["TSMC", "ASML", "Samsung Foundry", "SMIC"],
      right: ["Netherlands", "South Korea", "China", "Taiwan"],
      answer: [3, 0, 1, 2]
    }
  ],
  "2025 Viral Moments": [
    {
      type: "mcq",
      q: "A mispronounced French bakery item became 2025's defining Indian food meme. Which snack did people start jokingly calling 'Prashant'?",
      options: ["Macaron", "Éclair", "Croissant", "Pain au Chocolat"],
      answer: 2
    },
    {
      type: "mcq",
      q: "For years, fans of a prominent Bengaluru-based cricket franchise famously chanted 'Ee Sala Cup Namde', referring to their long wait for a maiden title. In 2024, this team finally broke the curse and lifted their first-ever trophy. Which tournament did they win?",
      options: ["Men's IPL", "Women's Premier League (WPL)", "Champions League T20", "Syed Mushtaq Ali Trophy"],
      answer: 1
    },
    {
      type: "mcq",
      q: "Narayana Murthy sparked a massive national debate on Indian corporate work culture when he suggested young professionals in India should work how many hours per week?",
      options: ["50 hours", "60 hours", "70 hours", "90 hours"],
      answer: 2
    },
    {
      type: "multi",
      q: "Which of these were major viral internet trends in 2025? (select all that apply)",
      options: ["Ghibli-style AI portraits", "Labubu collectibles", "Ice Bucket Challenge", "67 meme", "Mannequin Challenge", "AI-generated 80s trend"],
      answer: [0, 1, 3]
    },
    {
      type: "match",
      q: "Match the recent viral trend/meme to the icon or topic it was associated with.",
      left: ["\"Aura Farming\"", "\"Pehla Tu Dooja Tu\" Finger Dance", "\"FA9LA\" Track & Slow-Mo Edits", "\"Tung Tung Tung Sahur\""],
      right: ["Ajay Devgn's quirky dance steps in Son of Sardaar 2", "Akshaye Khanna's entry sequence in Dhurandhar", "Effortless confidence & cool style", "An absurd AI-generated Italian brainrot character"],
      answer: [2, 0, 1, 3]
    }
  ]
};

// Rapid Fire round: each team gets their own question set, answered within a shared time budget.
// Team sets are assigned by team index (Team 1 -> set[0], Team 2 -> set[1], etc.)
// Points earned here are added directly to the team's main scoreboard total.
const RAPID_FIRE_POINTS = 100;
const RAPID_FIRE_TEAM_TIME = 30; // seconds for all questions, per team
const RAPID_FIRE_SETS = [
  {
    questions: [
      { q: "Which company introduced Windows 95?", a: "Microsoft" },
      { q: "Who played the character Mogambo in Mr. India?", a: "Amrish Puri" },
      { q: "What does ASAP stand for?", a: "As Soon As Possible" },
      { q: "What does HTTP stand for?", a: "Hypertext Transfer Protocol" },
      { q: "Who sang the iconic song 'Chaiyya Chaiyya'?", a: "Sukhwinder Singh and Sapna Awasthi" },
      { q: "Which planet is known as the Red Planet?", a: "Mars" }
    ]
  },
  {
    questions: [
      { q: "What was the name of the coffee shop in Friends?", a: "Central Perk" },
      { q: "What does RAM stand for?", a: "Random Access Memory" },
      { q: "What is the chemical symbol for gold?", a: "Au" },
      { q: "Which actor played Raj in Dilwale Dulhania Le Jayenge?", a: "Shah Rukh Khan" },
      { q: "What is the main ingredient in hummus?", a: "Chickpeas" },
      { q: "Which Indian city is known as the Silicon Valley of India?", a: "Bengaluru" }
    ]
  },
  {
    questions: [
      { q: "What does WWW stand for?", a: "World Wide Web" },
      { q: "Which company developed the Android operating system?", a: "Google" },
      { q: "What does CEO stand for?", a: "Chief Executive Officer" },
      { q: "Which Indian state is famous for its Mysore Pak?", a: "Karnataka" },
      { q: "What is the smallest prime number?", a: "2" },
      { q: "Which Bollywood movie features the dialogue 'Mogambo khush hua'?", a: "Mr. India" }
    ]
  },
  {
    questions: [
      { q: "Which country gifted the Statue of Liberty to the USA?", a: "France" },
      { q: "What does SQL stand for?", a: "Structured Query Language" },
      { q: "How many bones are there in an adult human body?", a: "206" },
      { q: "Which programming language is known for its coffee-related name?", a: "Java" },
      { q: "Which company makes the iPhone?", a: "Apple" },
      { q: "Who is known as the father of computers?", a: "Charles Babbage" }
    ]
  }
];


