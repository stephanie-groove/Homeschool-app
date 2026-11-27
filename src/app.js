/* Reading Path app. Runs on top of src/backend.js, which provides window.claude (db, user, assets, sample) and blobSrc(). */
const TRACKS = {
  phonics: {
    tab: "Learn to read", who: "Age 4 · phonics",
    days: [
      ["Meet it", "Say the sound, show the mouth shape, trace the letter in the air and on paper."],
      ["Find it", "Hunt for things that start with the sound. Write it in a salt or sand tray."],
      ["Blend it", "Build the word list with letter tiles. Touch each letter, say the sounds, slide them together."],
      ["Read & write", "Read the words aloud. You say 3 words, they build or write them."],
      ["Play review", "Quick game with every sound learned so far, plus the heart words."]
    ],
    units: [
      ["Getting ready", [
        {t:"Rhyme time", s:[], w:["cat/hat","sun/fun","bee/tree","dog/log"], tip:"No letters yet. Read rhyming books and ask: does cat rhyme with hat? With dog? Ears first, letters later."},
        {t:"Claps and first sounds", s:[], w:["ba-na-na","rab-bit","sun","mmm-milk"], tip:"Clap the beats in names and words. Ask 'what sound does sun start with?' and stretch it: sssun."}
      ]],
      ["First sounds", [
        {t:"s, a, t", s:["s","a","t"], w:["at","sat"], h:["the","a"], tip:"Keep sounds short and crisp: /s/ not 'suh'. Clipped sounds make blending much easier."},
        {t:"p, i, n", s:["p","i","n"], w:["pat","pin","tip","nap","sip","tin","pan","sit"], tip:"First real blending week. Point to each letter, then sweep your finger underneath as you blend."},
        {t:"m, d", s:["m","d"], w:["mat","dad","man","mad","dip","mint"], h:["I","to"], tip:"If blending is hard, hold the first sound: mmmmat. Stretchy sounds like m and s are easiest to start with. b/d warning ahead: teach d as 'c then a tall line', always starting with the c."},
        {t:"g, o", s:["g","o"], w:["dog","got","pot","mom","top","dig","not"], h:["is","of"]},
        {t:"c, k", s:["c","k"], w:["cat","cot","can","kid","kit","cap"], tip:"Both say /k/. For now just teach that c and k make the same sound."},
        {t:"e, u", s:["e","u"], w:["pet","ten","net","sun","cup","mud","nut","up"], h:["and","was"]},
        {t:"r, h", s:["r","h"], w:["red","run","rat","hat","hop","hug","hen"]},
        {t:"b, f, l", s:["b","f","l"], w:["bat","bed","fan","fit","leg","lip","bug"], h:["you","for"], tip:"The bed trick for b and d: make two fists with thumbs up. Left hand is b, right hand is d, and together they make a bed. b starts with the tall line (bat), d starts with the c (dog)."},
        {t:"Review & blend", s:["a","e","i","o","u"], w:["sit","hop","bun","red","fan","dig","log","mud"], tip:"Catch-up week. Mix all the sounds. Repeat any week that felt wobbly before moving on."},
        {t:"j, v, w", s:["j","v","w"], w:["jam","jet","van","vet","web","wig","win"], h:["said","are"]},
        {t:"x, y, z, qu", s:["x","y","z","qu"], w:["box","fox","yes","yum","zip","zap","quit","quack"]},
        {t:"Short vowel check", s:["a","e","i","o","u"], w:["cat","bed","pig","hot","sun","map","net","fin"], h:["he","she"], tip:"Use word families: at, cat, hat, sat, mat. Change one letter at a time."}
      ]],
      ["Two letters, one sound", [
        {t:"sh", s:["sh"], w:["ship","shop","fish","dish","shed","wish"], tip:"Teach it as one sound. Put sh on one tile so they don't split it into s-h."},
        {t:"ch", s:["ch"], w:["chin","chop","chip","much","rich","chat"], h:["we","be"]},
        {t:"th", s:["th"], w:["thin","this","that","bath","with","them"], tip:"Two sounds: quiet th (thin, tongue out, no voice) and noisy th (this, buzzy). Hand on throat to feel it."},
        {t:"ck", s:["ck"], w:["duck","back","sock","kick","neck","pick"], h:["they","have"]},
        {t:"ng", s:["ng"], w:["sing","ring","king","long","hang","wing"]},
        {t:"wh, ph", s:["wh","ph"], w:["when","whip","which","phone"], h:["do","what"]},
        {t:"Double letters: ff, ll, ss, zz", s:["ff","ll","ss","zz"], w:["off","puff","bell","hill","kiss","mess","buzz","fizz"]},
        {t:"Digraph review", s:["sh","ch","th","ck","ng"], w:["shut","chick","moth","thick","shock","song"], h:["where","there"]}
      ]],
      ["Blends", [
        {t:"l-blends", s:["bl","cl","fl","gl","pl","sl"], w:["black","clap","flag","glad","plan","slip","flip","club"], h:["come","some"], tip:"In a blend you hear both sounds. Hold up two fingers for fl: f... l..."},
        {t:"r-blends", s:["br","cr","dr","fr","gr","tr"], w:["crab","drum","frog","grin","trip","brick","drop"]},
        {t:"s-blends", s:["st","sn","sp","sw","sk","sm"], w:["stop","snap","spin","swim","skip","smell","step"], h:["one","two"]},
        {t:"Ending blends", s:["nd","st","mp","lk","nt","ft"], w:["hand","best","jump","milk","tent","gift","lamp"]},
        {t:"Blend review", s:[], w:["stamp","frost","blend","crust","plump","twist"], tip:"Longer words now. Tap one finger per sound, then blend."}
      ]],
      ["Long vowels", [
        {t:"Open syllables", s:["o","e","i"], w:["go","no","so","me","he","we","hi"], h:["who","your"], tip:"When a vowel is at the end, it says its name. Closed (got) vs open (go)."},
        {t:"a_e", s:["a_e"], w:["cake","make","name","gate","game","lake"], tip:"The a and e team up across the consonant. The e is silent and helps a say its name."},
        {t:"i_e", s:["i_e"], w:["kite","bike","five","time","like","ride"]},
        {t:"o_e, u_e, e_e", s:["o_e","u_e","e_e"], w:["bone","home","rope","cute","tube","these"]},
        {t:"ai, ay", s:["ai","ay"], w:["rain","tail","paint","day","play","say"]},
        {t:"ee, ea", s:["ee","ea"], w:["see","tree","feet","eat","sea","read"]},
        {t:"oa, ow", s:["oa","ow"], w:["boat","goat","road","snow","grow","show"]},
        {t:"igh, y", s:["igh","y"], w:["night","light","high","my","fly","cry"]}
      ]],
      ["More vowel sounds", [
        {t:"ar, or", s:["ar","or"], w:["car","star","park","for","corn","fork"]},
        {t:"er, ir, ur", s:["er","ir","ur"], w:["her","fern","bird","girl","turn","fur"], tip:"Three spellings, one sound. Just recognise them for reading; spelling them comes much later."},
        {t:"oo (two sounds)", s:["oo"], w:["moon","zoo","food","book","look","foot"]},
        {t:"oi, oy, ou, ow", s:["oi","oy","ou","ow"], w:["coin","boy","toy","out","cloud","cow"]},
        {t:"Celebrate & review", s:[], w:["rainbow","sunset","picnic","playground"], tip:"Look back at your notes. Repeat any weeks that weren't solid. Then celebrate - this is a full year of reading!"}
      ]]
    ]
  },
  spelling: {
    tab: "Spelling", who: "Age 7 · Orton-Gillingham",
    days: [
      ["Teach the rule", "Explain the pattern. Sort the example words. Write the rule on an index card."],
      ["Sound drill + SOS", "Say the word, tap the sounds, name the letters as you write, read it back."],
      ["Dictation", "You say 8 words and 1 sentence. They write. Check and fix together."],
      ["Memory words", "Trace, say the letters, write from memory. Then a quick word sort or game."],
      ["Spelling check", "10 words. Anything missed goes on the review pile for next week."]
    ],
    units: [
      ["Closed syllables", [
        {t:"Short vowels & SOS", s:["a","e","i","o","u"], w:["cat","bed","pig","hot","sun","map","web","rug"], h:["said","was"], tip:"SOS = Simultaneous Oral Spelling. Say the word, tap each sound, say each letter as you write it, read it back. Use it every day."},
        {t:"sh, ch, th, wh", s:["sh","ch","th","wh"], w:["ship","chop","thin","when","fish","much","bath","whip"], h:["they","what"]},
        {t:"c or k?", s:["c","k"], w:["cat","cup","cot","kit","kid","keg","kin","cap"], tip:"Use k before e and i. Use c before a, o, u."},
        {t:"-ck after a short vowel", s:["ck"], w:["back","duck","sick","neck","rock","desk","milk","pink"], h:["of","want"], tip:"ck only right after a short vowel. If a consonant comes between (desk, milk), use k."},
        {t:"FLOSS rule", s:["ff","ll","ss","zz"], w:["off","hill","mess","fuzz","stiff","doll","kiss","buzz"], tip:"One-syllable word, short vowel, ends in f, l, s or z: double it. Exceptions to memorise: if, us, bus, yes, gas, has, his, is."},
        {t:"Starting blends", s:["st","fl","cr","sl","gr","sp"], w:["stop","flag","crab","slim","grin","spot","trip","plum"], h:["where","there"]},
        {t:"Ending blends", s:["nd","mp","st","ft","lt","nt"], w:["hand","lamp","best","gift","belt","tent","just","soft"]},
        {t:"-ng and -nk", s:["ang","ing","ong","ank","ink","unk"], w:["king","long","sang","bank","pink","think","trunk","sting"], h:["have","give"]},
        {t:"Two closed syllables", s:["VC/CV"], w:["sunset","catnip","hotdog","bathtub","napkin","basket","picnic","rabbit"], tip:"Find the two vowels. Split between the two consonants. Spell one syllable at a time."}
      ]],
      ["Endings", [
        {t:"Suffix -s or -es", s:["-s","-es"], w:["cats","dogs","dishes","foxes","buzzes","benches","hills","glasses"], h:["does","goes"], tip:"Add -es after s, x, z, ch, sh. You can hear the extra syllable: fox-es."},
        {t:"-ed: three sounds", s:["-ed"], w:["jumped","filled","landed","wished","yelled","melted","packed","hunted"], tip:"-ed can sound like /t/, /d/ or /ed/, but it's always spelled ed."},
        {t:"-ing, -er, -est", s:["-ing","-er","-est"], w:["jumping","fastest","colder","resting","longer","singing","softest","helper"]},
        {t:"-tch", s:["tch"], w:["catch","fetch","itch","match","patch","stitch","sketch","clutch"], h:["much","such"], tip:"After a short vowel, use tch. Exceptions: much, such, rich, which."},
        {t:"-dge", s:["dge"], w:["badge","edge","bridge","fudge","judge","ledge","hedge","ridge"], tip:"After a short vowel, /j/ at the end is dge."}
      ]],
      ["Silent e", [
        {t:"a_e, i_e", s:["a_e","i_e"], w:["cake","make","grape","bike","time","smile","shine","plane"], h:["come","some"]},
        {t:"o_e, u_e, e_e", s:["o_e","u_e","e_e"], w:["rope","home","stone","cube","mule","these","flute","globe"]},
        {t:"Soft c and g", s:["ce","ci","cy","ge","gi"], w:["city","face","rice","gem","cage","page","fancy","giant"], h:["one","once"], tip:"c and g go soft before e, i or y."},
        {t:"Doubling rule (1-1-1)", s:["1-1-1"], w:["hopping","sitting","bigger","stopped","running","sadder","clapped","swimming"], tip:"1 syllable, 1 vowel, 1 final consonant + vowel suffix: double the last letter. hop → hopping."},
        {t:"Drop the e", s:["drop e"], w:["hoping","making","baked","cuter","riding","shining","closest","hiking"], tip:"Word ends in silent e + suffix starts with a vowel: drop the e. Compare hoping and hopping."},
        {t:"2+1+1 doubling", s:["2+1+1"], w:["beginning","forgotten","admitted","upsetting","forbidden","regretted","omitted","committed"], tip:"Two syllables, the beat on the last one, ends in 1 vowel + 1 consonant, adding a vowel suffix: double. begin → beginning. But open → opening, because the beat is on the first syllable."}
      ]],
      ["Open syllables", [
        {t:"Open syllables", s:["V"], w:["me","go","hi","she","no","we","so","be"], h:["who","two"], tip:"A syllable ending in a vowel: the vowel says its name."},
        {t:"V/CV and VC/V", s:["V/CV","VC/V"], w:["robot","tiger","music","lemon","cabin","seven","pilot","wagon"], tip:"Try the open split first (ti-ger). If it doesn't sound like a word, try closed (cab-in)."},
        {t:"Wild old words", s:["ild","ind","old","ost"], w:["wild","child","kind","find","cold","gold","most","post"], h:["only","both"], tip:"These look like closed syllables, but the vowel says its name: i before ld or nd, o before ld, lt or st. Learn them as one small family."}
      ]],
      ["Vowel teams", [
        {t:"ai or ay", s:["ai","ay"], w:["rain","paint","train","day","play","stay","snail","tray"], h:["does","their"], tip:"ai in the middle, ay at the end. English words don't end in i."},
        {t:"ee or ea", s:["ee","ea"], w:["feet","green","sheep","read","beach","dream","teeth","clean"]},
        {t:"oa, ow, oe", s:["oa","ow","oe"], w:["boat","road","snow","grow","toe","coat","slow","foe"], tip:"oa in the middle, ow or oe at the end."},
        {t:"igh, y, ie", s:["igh","y","ie"], w:["night","light","my","fly","pie","tie","bright","sky"]},
        {t:"ew, ue, oo", s:["ew","ue","oo"], w:["new","grew","blue","glue","moon","spoon","book","look"], h:["could","would"]}
      ]],
      ["Bossy r", [
        {t:"ar, or, ore", s:["ar","or","ore"], w:["car","farm","fork","storm","more","store","shark","snore"]},
        {t:"er, ir, ur", s:["er","ir","ur"], w:["her","fern","bird","shirt","turn","burst","nurse","first"], h:["were","learn"], tip:"er is the most common spelling, then ur, then ir. When unsure, try er first."}
      ]],
      ["Diphthongs", [
        {t:"oi or oy", s:["oi","oy"], w:["coin","point","boil","boy","toy","enjoy","soil","royal"], tip:"oi in the middle, oy at the end."},
        {t:"ou or ow", s:["ou","ow"], w:["out","cloud","house","cow","town","brown","shout","owl"]},
        {t:"au or aw", s:["au","aw"], w:["haul","sauce","launch","saw","draw","claw","fault","yawn"], h:["because","laugh"], tip:"au in the middle, aw at the end or before n or l."}
      ]],
      ["Bigger words", [
        {t:"Consonant -le", s:["-ble","-tle","-dle","-zle"], w:["table","little","candle","puzzle","apple","bubble","jungle","purple"]},
        {t:"The six syllable types", s:["closed","open","silent e","team","r","-le"], w:["cat","go","cake","rain","car","table","napkin","robot"], tip:"Every syllable is one of six types: closed (cat), open (go), silent e (cake), vowel team (rain), bossy r (car), consonant-le (ta-ble). Sort the words by type, then split napkin and robot."},
        {t:"y as a vowel, y → i", s:["y","ies","ier"], w:["happy","sunny","cries","babies","happier","tried","funnier","flies"], tip:"Three y rules. Consonant + y, add a suffix: change y to i (cry → cries). Keep the y before -ing (crying). Vowel + y: just add (play → played)."},
        {t:"Prefixes un, re, dis, mis, pre", s:["un","re","dis","mis","pre"], w:["undo","redo","dislike","misspell","preheat","unlock","refill","mistake"], h:["people","friend"], tip:"Prefixes never change the spelling of the base word: mis + spell = misspell."},
        {t:"Suffixes -ful, -less, -ly, -ness", s:["-ful","-less","-ly","-ness"], w:["helpful","careless","sadly","kindness","hopeful","useless","quickly","darkness"]},
        {t:"Silent letters & review", s:["kn","wr","mb","gn"], w:["knot","knee","write","wrap","lamb","comb","sign","gnat"], tip:"Last week: review the rule cards and re-test your review pile. You've covered the core OG spelling rules."}
      ]]
    ]
  }
};


const SPK = `<svg viewBox="0 0 48 48" width="96" height="96" aria-hidden="true"><path d="M8 18h8l10-8v28l-10-8H8z" fill="currentColor"/><path d="M32 17c3 4 3 10 0 14M37 12c6 7 6 17 0 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

const DEFAULT_PRAYER = "Dear God, thank you for this new day. Please help me listen, try my best, and be kind. Help us learn together. Amen.";

const SONGS = {
  hello: {
    title: "Hello song",
    tune: "Sing to the tune of Frère Jacques (Are You Sleeping?)",
    lines: n => [`Good morning, ${n},`, `good morning, ${n},`, "how are you?", "how are you?", "Time to learn together,", "time to learn together,", "me and you,", "me and you."]
  },
  bye: {
    title: "Goodbye song",
    tune: "Sing to the tune of Twinkle, Twinkle, Little Star",
    lines: n => ["Class is done, we did our best,", "now it's time to play and rest.", `${n} listened, ${n} was brave,`, "every sound a step we made.", "Class is done, we did our best,", "now it's time to play and rest."]
  }
};

const BREAKS = [
  "Walk like a bear to the kitchen and get a drink of water.",
  "Stretch up tall like a tree, then curl up small like a seed. Five times.",
  "Blow out five birthday candles: big breath in, slow breath out.",
  "Jump ten times, then freeze like a statue. Can you stay still for five seconds?",
  "Eat a small snack by the window and name three things you can see outside.",
  "Wiggle each part of your body, starting at your toes and ending at your nose.",
  "Lie on the floor with a toy on your tummy. Watch it go up and down as you breathe.",
  "Crawl like a cat to the door and back, then stretch like a cat."
];

/* STEM activities. {s} = this week's sound, {w1} {w2} {w3} = words, {ws} = word list */
const STEM = {
  phonics: [
    {t:"Sink or float", kind:"Science: making predictions", prep:"1 min",
     mat:["A bowl of water","6 small things from around the house","Paper with {s} written on it"],
     steps:["Put the {s} card next to the bowl.","Child picks one object and says its first sound.","Ask: will it sink or float? Let them guess first.","Drop it in. Were they right? Sort into a sink pile and a float pile."],
     easy:"Just 3 objects. You sit, they do the dropping."},
    {t:"Flashlight letters", kind:"Science: light and shadow", prep:"0 min",
     mat:["A flashlight","A dim room"],
     steps:["Lie on the floor together and shine the flashlight on the ceiling.","Slowly draw the letter {s} with the beam. Child guesses it and says the sound.","Swap: child draws a letter, you guess.","Try drawing a whole word: {w1}."],
     easy:"You can do this lying down the whole time."},
    {t:"Sound tower", kind:"Engineering and counting", prep:"2 min",
     mat:["Blocks or cups","Sticky notes or tape and a pen"],
     steps:["Write one sound on each block: {ws}.","Say a word like {w1}. Child finds the blocks for each sound and stacks them in order.","Count the blocks. How many sounds in the word?","Which word makes the tallest tower? Will it stand up?"],
     easy:"Build just one word and knock it over together."},
    {t:"Magnet fishing", kind:"Science: magnets", prep:"3 min",
     mat:["Paper clips","A fridge magnet tied to a string or spoon","Small paper fish"],
     steps:["Write a sound on each fish and clip a paper clip to it.","Child fishes one out and says the sound.","If they say it right, they keep the fish.","Bonus: walk around and test what else the magnet sticks to."],
     easy:"Skip the fish. Put clips on letter cards on the table."},
    {t:"Ramp race words", kind:"Physics: slopes and speed", prep:"2 min",
     mat:["A book or board as a ramp","Toy cars","Sticky notes"],
     steps:["Write {w1}, {w2} and {w3} on sticky notes and stick one on each car.","Child reads the word on a car, then races it down the ramp.","Which car went the farthest? Measure with footsteps.","Make the ramp steeper. Predict: will it go farther?"],
     easy:"One car, one word, many races."},
    {t:"Bubble sounds", kind:"Science: air", prep:"0 min",
     mat:["Bubbles"],
     steps:["You blow bubbles. Before popping one, child says a sound from this week.","Call out a word, like {w1}. Child pops one bubble per sound.","Ask: why do bubbles float? What is inside them?"],
     easy:"This one is already the low-energy version."},
    {t:"Playdough letters", kind:"Engineering: shaping and building", prep:"1 min",
     mat:["Playdough or salt dough"],
     steps:["Roll long snakes together.","Bend the snakes to make the letter {s}. Say the sound while building.","Make a whole word: {w1}. Touch each letter and blend it.","Squash it and make a new word."],
     easy:"Make just the letter and squash it."},
    {t:"Nature sound hunt", kind:"Science: observing nature", prep:"0 min",
     mat:["A bag or basket","Outdoors or a window"],
     steps:["Go outside and collect 5 small things: leaves, sticks, stones.","Name each one and say its first sound.","Sort them: same first sound together.","Bonus: does it feel smooth, rough, heavy or light?"],
     easy:"Look out a window and name what you see."},
    {t:"Measuring words", kind:"Math: longer and shorter", prep:"1 min",
     mat:["Lego bricks, cubes or buttons"],
     steps:["Say {w1}. Child puts down one brick for each sound.","Do the same for {w2} and {w3}.","Line them up. Which word is longest? Which is shortest?","Count them together."],
     easy:"Use two words only."},
    {t:"Color mix reading", kind:"Science: mixing colors", prep:"2 min",
     mat:["Clear cups of water","Watercolor paint or food coloring","A spoon or dropper"],
     steps:["Each time your child reads a word, they add one drop of color.","Words: {ws}.","Before mixing two colors, ask: what color will it make?","Stir and see if they were right."],
     easy:"Two cups, two colors, three words."}
  ],
  spelling: [
    {t:"Word bridge", kind:"Engineering: strength and structure", prep:"2 min",
     mat:["Index cards or paper strips","Two books","Coins"],
     steps:["Put two books a little apart.","For each word spelled correctly ({ws}), child earns one card for the bridge.","Fold the cards to make the bridge stronger. Test it with coins.","How many coins can it hold? Can you make it hold more?"],
     easy:"Use 3 cards and a few coins."},
    {t:"Secret code", kind:"Math: number codes", prep:"0 min",
     mat:["Paper and pencil"],
     steps:["Make a code: a = 1, b = 2, c = 3 and so on.","Child writes {w1} in numbers.","You write a word from this week in code. Child cracks it.","Challenge: write a whole sentence in code."],
     easy:"Child codes, you just decode."},
    {t:"Sort like a scientist", kind:"Science: classifying", prep:"2 min",
     mat:["Word cards with this week's words"],
     steps:["Mix up the cards: {ws}.","Child sorts them into groups and invents the rule. There is no wrong rule if they can explain it.","Ask: what is the same? What is different?","Connect it back to this week's spelling rule."],
     easy:"Sort just 6 cards."},
    {t:"Program the robot", kind:"Coding: giving exact instructions", prep:"0 min",
     mat:["Paper, pencil, and you as the robot"],
     steps:["You are a robot. You only write exactly the letters you are told.","Child tells you how to spell {w1}, letter by letter.","If they skip a letter, write it wrong on purpose. Let them debug.","Swap: you program, they are the robot."],
     easy:"You stay seated and only write."},
    {t:"Speed graph", kind:"Math: data and graphs", prep:"1 min",
     mat:["Timer on your phone","Paper"],
     steps:["Time how long it takes to read the word list: {ws}.","Draw a bar for today's time.","Do it again on another day this week and add a bar.","Is the bar getting shorter? That means faster reading."],
     easy:"Just one timing and one bar."},
    {t:"Paper plane words", kind:"Physics: flight", prep:"2 min",
     mat:["Paper","Pencil"],
     steps:["Fold a paper plane. Child writes a word on each wing: {w1}, {w2}.","Spell the word out loud before each launch.","Measure how far it flies in footsteps.","Change the wing shape. Does it fly farther?"],
     easy:"One plane, many flights."},
    {t:"Syllable bricks", kind:"Engineering and patterns", prep:"1 min",
     mat:["Lego or blocks in two colors"],
     steps:["Say a word. Child builds one brick for each syllable.","Vowels on one color, consonants on another, for one-syllable words.","Split the tower where the syllables break.","Which word needs the most bricks?"],
     easy:"Clap the syllables instead of building."},
    {t:"Shaving cream spelling", kind:"Science: foam and texture", prep:"1 min",
     mat:["Shaving cream or whipped cream","A tray"],
     steps:["Spread a thin layer on the tray.","You say a word. Child writes it with a finger, saying each letter.","Wipe smooth and do the next word: {ws}.","Ask: why does foam hold its shape?"],
     easy:"Five words, then free play."},
    {t:"Rule detective", kind:"Science: testing a hypothesis", prep:"0 min",
     mat:["A favourite picture book"],
     steps:["Pick a page. Child hunts for words that follow this week's rule.","Tally each one they find.","Any words that break the rule? Those are exceptions. Write them down.","Is the rule true most of the time? That is what scientists check."],
     easy:"Hunt on one page only."}
  ]
};

function fillT(str, w){
  const ws = cleanWords(w);
  return str.replace(/\{s\}/g, (w.s && w.s[0]) || ws[0][0])
    .replace(/\{w1\}/g, ws[0]).replace(/\{w2\}/g, ws[1]||ws[0]).replace(/\{w3\}/g, ws[2]||ws[0])
    .replace(/\{ws\}/g, ws.slice(0,6).join(", "));
}
function stemFor(track, wi, day){ const p=STEM[track]; return p[(wi*2+day) % p.length]; }

const COACH_SYSTEM = `You are a warm, practical parenting coach inside a homeschool reading app. You specialise in early childhood development and pediatric psychology: co-regulation, attachment, attention spans, sensory needs, big emotions, learning frustration, and parent burnout.
How to answer:
- Kind, calm and brief: under 160 words. Plain words, no jargon.
- Start by briefly normalising what the parent is feeling.
- Give 2 or 3 concrete things to try today, including one short script the parent can say word for word.
- Favour connection before correction, short lessons, stopping before tears, and play.
- The reading lessons follow an Orton-Gillingham style: systematic and cumulative, explicit (watch me, together, your turn), multisensory, with review before anything new. When a child struggles, suggest going back to review rather than pushing ahead.
- Many parents here homeschool from a Christian faith. Value faithfulness over results: showing up gently each day matters more than finishing the plan. Encourage doing less, looping instead of catching up, and protecting the relationship.
- For a tired parent, suggest the smallest version that still counts.
- Never diagnose. If something suggests a developmental concern (speech, hearing, persistent distress, regression, signs of dyslexia, attention difficulties well beyond age norms), gently suggest talking with their pediatrician or a qualified evaluator.
- If the parent mentions harming themselves or the child, or feeling unsafe, respond with care and encourage them to contact local emergency services or a crisis line right now.
- No markdown headings. Short paragraphs or a short list are fine.`;

const COACH_QUICK = [
  ["My child cries when we start", "Crying at the start usually means the switch from play to 'work' feels big. Try a warm-up: let them choose the song or the stamp first. Keep the lesson tiny, 3 to 5 minutes. Try saying: \"You don't want to stop playing. That's hard. We'll do one little thing together, then you can go back.\" Stop while it's still going well, even if you didn't finish."],
  ["I'm exhausted today", "Tired days still count. Tap 'Tired-day class' for a 10-minute version: prayer, one song, one short lesson, goodbye song. Or simply read one picture book together on the couch and point to this week's sound. Consistency beats intensity: a short class every day helps more than a long one sometimes."],
  ["Won't sit still", "At 4, focus lasts only a few minutes at a time, and movement helps learning. Teach standing up, lying on the floor, or at the bath. Add a wiggle between steps. Try saying: \"Let's jump once for every sound.\" Short and moving is better than long and still."],
  ["Is my child behind?", "Children learn to read across a wide range of ages, and progress often comes in sudden jumps. Repeat weeks freely. If you notice trouble hearing rhymes, remembering letter sounds after many weeks, speech that's hard to understand, or a family history of reading difficulty, it's worth mentioning to your pediatrician."]
];

const ENCOURAGE = [
  "You are not behind. A small, faithful lesson today is enough.",
  "Come to me, all you who are weary and burdened, and I will give you rest. (Matthew 11:28)",
  "The goal today isn't to finish. It's to show up, gently, together.",
  "Your child won't remember a perfect schedule. They'll remember you sat beside them.",
  "Do the next thing. Just the next one.",
  "Do not be anxious about anything, but in everything, by prayer, present your requests to God. (Philippians 4:6)",
  "A tired-day class still counts. So does a story on the couch.",
  "Progress in reading comes in sudden jumps after quiet weeks. Keep going.",
  "If today goes sideways, hug first. The lesson can wait until tomorrow.",
  "Comparing makes everything heavier. This is your family's pace.",
  "Let us not become weary in doing good. (Galatians 6:9)",
  "Ten calm minutes beat an hour of tears, every time.",
  "You were given this child on purpose. You are the right teacher for them.",
  "Rest is part of the plan, not a break from it."
];

const ERR_TYPES = {
  sound: ["Wrong sound", "Mixed up a letter sound (read /e/ for /i/)", "Add a 1-minute sound card warm-up before each lesson, and check mouth shapes in a mirror."],
  rule:  ["Wrong pattern or rule", "Knew the sounds but chose the wrong spelling (cak for cake)", "Repeat that rule's week, re-read the rule card, and sort words by pattern."],
  order: ["Left out, added or swapped", "Missing or extra letters, or letters in the wrong order", "Slow down: tap one finger per sound before writing, then read back with a finger sweep."],
  bd:    ["b/d or letter flip", "Reversed b and d, or p and q", "Use the bed trick and skywriting for b and d. Practise only one of the two for a week."]
};

const PLACEMENT = {
  phonics: [
    ["Say cat and hat. Can they tell you the words rhyme, and clap the beats in banana?", "Rhyme time"],
    ["Show the letters s, a, t, p, i, n. Can they say each sound?", "s, a, t"],
    ["Say the sounds /s/ /a/ /t/ slowly. Can they blend them and say sat?", "p, i, n"],
    ["Show m, d, g, o, c, e, u, r, h, b, f, l. Do they know almost all of the sounds?", "m, d"],
    ["Can they read dog, sun, red, fin, jam and box on their own?", "Short vowel check"],
    ["Can they read ship, chin, thin, duck and sing?", "sh"],
    ["Can they read flag, crab, stop, hand and jump?", "l-blends"],
    ["Can they read cake, bike, rain, see, boat and night?", "Open syllables"]
  ],
  spelling: [
    ["Say each word. Can they write cat, pig, hot, sun and web?", "Short vowels & SOS"],
    ["Can they write ship, chop, thin and when?", "sh, ch, th, wh"],
    ["Can they write back, duck, hill, kiss and bank?", "-ck after a short vowel"],
    ["Can they write sunset, foxes, jumped, catch and badge?", "Two closed syllables"],
    ["Can they write cake, rope, city, hopping and hoping?", "a_e, i_e"],
    ["Can they write rain, feet, boat, night and blue?", "ai or ay"],
    ["Can they write car, bird, turn, coin, cow and saw?", "ar, or, ore"],
    ["Can they write table, happy, cries, unlock and helpful?", "Consonant -le"]
  ]
};

const STORIES = {
  phonics: [
    ["The cat in the hat", "A cat in a hat sat down to have fun. A bee in a tree sang a song in the sun. A dog on a log said, hop, hop, hop! And everyone laughed and could not stop."],
    ["Rabbit's banana", "Rabbit had a big banana. Ba-na-na, clap, clap, clap! The sun said, I am short. Sun, just one clap. Mmm, milk! said Rabbit, and drank it all up."],
    ["Sam sat", "Sam the cat sat on the step. The sun was warm. Sam sat and sat. At last, Sam had a nap in the sun."],
    ["Pip and the pan", "Pip had a pin and a tin pan. Pip sat by the pan. Tip, tap, tip! Then Pip had a nap, and a sip of milk."],
    ["The mad man", "Dad had a mat. Dad sat on the mat with a man. The man was mad, so Dad gave him a mint. The man was not mad any more."],
    ["The dog and the pot", "The dog dug in the mud. The dog got a pot! Mom said, not in the pot, dog! The dog sat on top of the pot and wagged its tail."],
    ["Is that my cap?", "A kid had a cat. The cat sat in a cap on a cot. The kid said, is that my cap? The cat did not care. It went to sleep."],
    ["Ten red hens", "Ten red hens ran in the sun. One hen had a cup. One hen had a nut. They all sat in the mud and had fun, and the pet dog ran up to see."],
    ["Run, hen, run", "A red hen ran up the hill. Hop, hop, hop! She had a hat on her head. Run, hen, run! said the rat. The hen gave the rat a big hug."],
    ["The big bug", "A big bug sat on a leg. Fit and fast, it flew to a fan. The fan went round and round. The bug fell on the bed and had a lip-smacking laugh."],
    ["Sit, dog, sit", "Sit, dog, sit! The dog sat on a log. A bun fell in the mud. The red fan went on. The dog dug and dug, then had a nap."],
    ["The vet's van", "A vet had a van. In the van was a jet, some jam, and a wig! The vet put on the wig and said, I win! A spider made a web on the van."],
    ["Fox in a box", "A fox sat in a box. Yes! said the fox. A duck said quack, quack and hopped in. Zip! Yum, said the fox, it is warm in here. Then the fox quit the box for a snack."],
    ["The pig's bed", "The cat had a map. The pig had a bed. The sun was hot. Ten fish swam, and one had a big fin. Look at the net!"],
    ["The fish's wish", "A fish in a dish said, I wish, I wish! I wish to swim by a ship. The ship left the shop, and the fish went splash!"],
    ["The chick and the chip", "A chick sat on a chip. Chop, chop, chop! went the cook. Much too rich, said the chick. Let's just have a chat."],
    ["Beth's bath", "This is Beth. Beth has a bath with a moth. That moth is thin! Beth and the moth sing with them all."],
    ["Duck on a rock", "A duck sat on a rock. Back and forth, the duck went quack. A sock fell on its neck. Pick it up, duck!"],
    ["The king's song", "A king had a ring. He sang a long song. Ding, dong! went the bell. A bird with one wing came to hang on the king's hat."],
    ["When the phone rang", "When the phone rang, Whip the cat ran. Which way? said Whip. The phone rang and rang, but Whip was hiding under the bed."],
    ["Buzz on the hill", "A bee went buzz on the hill. It fell off the bell. Puff, puff, the bee flew off. Mom gave me a kiss. What a mess, what a fizz!"],
    ["The chick in the shed", "A chick hid in the shed. Shut the door! said Mom. A moth flew in. Shock! The chick sang a song, and the moth sat on its thick, soft back."],
    ["The black cat's plan", "A black cat had a plan. It sat on a flag by the glass. Flip, flop, clap! The cat was glad. It ran to the club with a plant."],
    ["Frog and Crab", "A frog and a crab had a drum. Bang, bang! The frog had a big grin. They went on a trip and did not drop the drum."],
    ["Stop, snail!", "Stop! said the snail. Spin, said the bird. Skip and swim, said the fish. The snail took one step, then stopped to smell a flower."],
    ["The best dog", "A hand held a lamp in a tent. Jump! said the best dog. The dog got a gift: a cup of milk."],
    ["Frost", "The frost made the grass crisp. A plump bird hopped on a crust of bread. It did a twist and a stamp, then flew away."],
    ["Go to the sea", "Hi! said the bee. We go to the sea, he and me. No, no, said Mom, so we go home."],
    ["Jake's cake", "Jake made a cake. He ate it by the lake. A duck came to the gate and said, my name is Kate, can I have some cake too? Jake gave her a big slice."],
    ["My bike", "I like my bike. I ride it every time I can. Five kids ride with me. We smile all the way home."],
    ["The cute mule", "A cute mule went home with a bone. He put it in a tube with a rope. These are mine, he said, and smiled."],
    ["A rainy day", "It is a rainy day. A snail with a long tail wants to play. Let's paint, it says. Okay! I say."],
    ["By the sea", "I see a tree by the sea. Three bees eat a treat. My feet are wet. Can you read this to me?"],
    ["Goat in a boat", "A goat sat in a boat. It began to snow. The goat put on a coat and rowed slow, slow, slow down the river road."],
    ["My kite", "At night I see a light up high. My kite can fly in the sky. Why? I cry. My kite says, just try!"],
    ["A star in the park", "A star fell in the park. A shark? No, a dog with a fork in its mouth! It ran for the corn on the farm cart."],
    ["Her bird", "Her bird sat on a fern. It had soft fur. Turn around, bird! The girl laughed as it chirped."],
    ["At the zoo", "The moon is up. Look! A book and some food are at the zoo. A foot steps out. It is a big, soft cat."],
    ["The boy and the coin", "A boy found a coin and a toy cow. Out in a cloud of dust, the cow said moo. The boy laughed out loud."],
    ["Our big year", "On a sunny day, we went to the playground for a picnic. We saw a rainbow and a sunset. We read and read. What a year!"]
  ],
  spelling: [
    ["Pig on a rug", "A pig sat on a rug in the hot sun. A cat had a map to find a bed. The pig said, I was here first. They both napped by the web."],
    ["Lunch on the ship", "When the ship came in, a fish jumped. Chop, chop! said the cook. Much too thin, said the cat. They took a bath and had lunch."],
    ["Kit and the cat", "A kid in a red cap had a cat and a cup. The cat napped on a cot. Kit, the kid, filled the cup and sat with the cat."],
    ["Duck at the desk", "A duck sat on a rock by the desk. Back and forth went its neck. Sick of milk, the duck asked for a pink drink."],
    ["The doll on the hill", "A doll fell off the hill. What a mess! A bee went buzz and gave the doll a kiss. Stiff and sore, the doll got up and laughed."],
    ["Crab's trip", "Stop! said the crab. The flag is on my spot. A slim frog gave a grin and went on a trip with a plum."],
    ["The best gift", "Put your hand on the tent. It is soft! It is just the best gift. The lamp has a belt on it. How funny."],
    ["The king in the bank", "The king sang in the bank. Think! he said. His pink trunk was long, and a bee had a sting."],
    ["Picnic at sunset", "We had a picnic at sunset. A rabbit hopped by the basket. It ate the catnip, then took a nap on a napkin."],
    ["Foxes and dishes", "The cats sat by the dishes. The foxes ran to the benches. The dogs ran up the hills and sniffed the glasses."],
    ["Muddy day", "I jumped and landed in the mud. Mom yelled and packed a towel. The ice cream melted, and Dad wished for more."],
    ["The fastest dog", "The fastest dog was jumping. It was colder than yesterday, but the dog kept singing and resting. What a helper!"],
    ["Catch!", "Catch! said Mitch. The dog ran to fetch. It had an itch on a patch of fur. It was such a fun match."],
    ["The judge's fudge", "A badge sat on the edge of the bridge. The judge ate fudge by the hedge, high up on the ledge."],
    ["Kate's cake", "Kate rode her bike home. It was time to make a cake with grapes. She had a big smile as the sun began to shine."],
    ["The mule's flute", "A cute mule found a stone at home. He put a rope on a cube. These are fun! he said, and played his flute."],
    ["The city giant", "A giant lived in the city. He ate rice and gave a gem to a mouse in a cage. The mouse made a fancy face."],
    ["Hop and run", "The frog was hopping and the dog was running. The bigger dog stopped and clapped. Swimming is fun, said the frog, sitting in the sun."],
    ["Hoping to hike", "I was hoping to go hiking. Mom baked a pie and was making tea. Riding home, the sun was shining."],
    ["Forgotten", "At the beginning of the trip, I forgot my hat. It was forgotten at home! I admitted it to Mom. She said it was not upsetting, and we regretted nothing."],
    ["Go to the sea", "She said hi to me. We can go to the sea. No, said Dad, be home by nine. So we go home."],
    ["The tiger's cabin", "A tiger and a robot had a lemon. They sat in a cabin. The pilot played music. Seven ducks in a wagon came by."],
    ["The kind child", "A kind child found a gold ring in the cold. She did not hold it for long. Most of all, she wanted to find who lost it. Both of them smiled."],
    ["Snail on a train", "A snail rode a train to play. It began to rain, so the snail had to stay. It lay on a tray and had a nap."],
    ["Sheep at the beach", "A sheep with green feet went to the beach. It had clean teeth and a dream to read by the sea."],
    ["Goat in the snow", "A goat in a coat rowed a boat through the snow. It hurt its toe, so it rowed slow."],
    ["The night pie", "At night, a bright light lit the sky. My pie can fly! Why? It has a tie."],
    ["Glue on the moon", "The new moon grew. A blue spoon fell on my book. Look! Is that glue on the moon?"],
    ["Shark on a farm", "A shark on a farm went to the store. A storm came. More! said the shark, holding a fork. Then it started to snore."],
    ["The nurse's shirt", "The nurse wore her first new shirt. It had a bird and a fern on it. When she turned, a button burst off!"],
    ["The royal coin", "A royal boy found a coin in the soil. Point to the toy! he said. Enjoy!"],
    ["Owl in town", "An owl in a brown town began to shout. A cow came out of a cloud. Wow, said the owl, how loud this house is."],
    ["The cat's claw", "A cat with a claw sat in the sauce. It yawned and saw a launch. Draw it! said the dog. That was my fault."],
    ["A little bubble", "A little bubble sat on the table. It saw an apple, a candle, and a purple puzzle in the jungle."],
    ["Six kinds", "A cat can go to the lake in the rain. It rides in a car and sits at a table. A robot gives it a napkin. Every word is one kind of syllable. Can you sort them?"],
    ["Happy babies", "The babies cried, then tried to smile. The sky got sunny and the flies flew off. Now they are happier."],
    ["Undo and redo", "I misspelled a word, so I tried to undo my mistake and redo it. I dislike mistakes, but I learn from them. Then Mom said, preheat the oven!"],
    ["The helpful kid", "A helpful kid was careless with a cup. It broke quickly in the darkness. Hopeful, she said: kindness can fix it."],
    ["The lamb's knot", "A lamb with a comb tied a knot. It wrote a sign on a wrap. A gnat sat on its knee."]
  ]
};

/* ---------- word helpers ---------- */
const GR = ["tch","dge","igh","sh","ch","th","wh","ck","ng","ph","qu","ai","ay","ee","ea","oa","ow","oe","oo","oi","oy","ou","ar","or","er","ir","ur","ew","ue","au","aw","ie","kn","wr","mb","gn","ff","ll","ss","zz"];
function graphemes(word){
  const out=[]; let i=0;
  while(i<word.length){
    const g = GR.find(g => word.startsWith(g,i));
    if (g){ out.push(g); i+=g.length; } else { out.push(word[i]); i++; }
  }
  // silent final e in VCe
  if (out.length>=3 && out[out.length-1]==="e" && /^[aeiou]$/.test(out[out.length-3]) && !/^[aeiou]/.test(out[out.length-2])) out.silent = out.length-1;
  return out;
}
function cleanWords(w){
  let list = w.w.filter(x=>/^[a-z]+$/.test(x));
  if (!list.length) list = w.w.flatMap(x=>x.split(/[\/-]/)).filter(x=>/^[a-z]+$/.test(x));
  return list.length ? list : ["sat","pin"];
}
function pattern(w){ return (w.s||[]).map(x=>x.replace(/^-/,"").toLowerCase()); }
function marked(word, w){
  const pats = pattern(w), gs = graphemes(word);
  const split = pats.filter(p=>/^[a-z]_e$/.test(p)).map(p=>p[0]);
  return gs.map((g,i)=>{
    let on = pats.includes(g) || pats.some(p=>p.length>1 && !p.includes("_") && word.endsWith(p) && i>=gs.length-p.length);
    if (split.includes(g) && gs.silent!==undefined && i===gs.silent-2) on=true;
    if (i===gs.silent && split.length) on=true;
    return on?`<em>${g}</em>`:g;
  }).join("");
}
function tiles(word, {d=0, step=.25, hiStart=null, hiStep=1}={}){
  const gs=graphemes(word);
  return `<div class="tiles">${gs.map((g,i)=>{
    const cls = hiStart!==null ? "tl hi" : "tl pop";
    const sil = i===gs.silent ? " silent" : "";
    return `<span class="${cls}${sil}" style="--d:${(d+i*step).toFixed(2)}s;--h:${hiStart!==null?(hiStart+i*hiStep).toFixed(2):0}s">${g}</span>`;
  }).join("")}</div>`;
}
function soundsOf(word){ const gs=graphemes(word); return gs.filter((_,i)=>i!==gs.silent).map(g=>`/${g}/`).join(" "); }
function traceSvg(txt, d=0, inTray=false){
  const fs = txt.length>2 ? 70 : txt.length>1 ? 90 : 120;
  return `<svg viewBox="0 0 220 140" class="trace" style="--d:${d}s;width:${inTray?150:200}px;height:auto"><text x="110" y="${fs>100?112:100}" text-anchor="middle" font-family="Andika, sans-serif" font-size="${fs}">${esc(txt)}</text></svg>`;
}
function soFar(t, i){
  const all=[]; t.weeks.slice(0,i+1).forEach(w=>(w.s||[]).forEach(s=>{ if(!all.includes(s) && s.length<5) all.push(s); }));
  return all.slice(-8);
}
function heartsSoFar(t,i){ const h=[]; t.weeks.slice(0,i+1).forEach(w=>(w.h||[]).forEach(x=>h.push(x))); return h.slice(-4); }

/* ---------- demo scripts: each step = {cap, html, ms} ---------- */
const DEMOS = {
  phonics: [
    // Day 1 Meet it
    (w,t,i)=>{
      const ws=cleanWords(w);
      if (!w.s.length) return [
        {cap:"Sit face to face. This week is all about listening, no letters yet.", html:`<div class="row">${ws.slice(0,4).map((x,j)=>`<span class="card pop" style="--d:${j*.3}s">${x}</span>`).join("")}</div>`},
        {cap:`Say two words slowly: ${w.w[0].replace("/"," and ")}. Ask: do they sound the same at the end?`, html:`<div class="word pop">${esc(w.w[0])}</div>`},
        {cap:"Clap or tap for every beat you hear. Let your child copy you.", html:`<div class="row">${[0,1,2].map(j=>`<span class="coin pulse" style="--d:${j*.5}s">clap</span>`).join("")}</div>`},
        {cap:"Your turn: they say a word, you clap. Keep it silly and short.", html:`<div class="big pop">?</div>`}
      ];
      const s=w.s[0], ex=ws.find(x=>x.startsWith(s.replace("_e","").slice(0,s.length)))||ws[0];
      return [
        {cap:`Show the letter card and say: this is ${s.replace("_"," ")}.`, html:`<div class="big pop">${s}</div>`},
        {cap:`Say its sound, short and crisp: /${s}/. Let them watch your mouth.`, html:`<div class="big">${s}</div><div class="snd pulse" style="--d:.2s">/${s}/</div>`},
        {cap:"Skywriting: arm straight, two fingers pointing. Write the letter big in the air while saying its name and sound. Then trace it on paper.", html:traceSvg(s,.2)},
        {cap:`Hear it in a word: ${ex}.`, html:`<div class="word pop">${marked(ex,w)}</div>`},
        {cap:`Child says the sound 3 times.${w.s.length>1?` Then repeat for ${w.s.slice(1).join(", ")}.`:""}`, html:`<div class="row">${[1,2,3].map((n,j)=>`<span class="coin pop" style="--d:${.4+j*.6}s">${n}</span>`).join("")}</div>`}
      ];
    },
    // Day 2 Find it
    (w,t,i)=>{
      const ws=cleanWords(w), s=w.s[0];
      if (!s) return [
        {cap:"Play 'I spy' with sounds: I spy something that starts with /s/... sun!", html:`<div class="big pop">?</div>`},
        {cap:"Take turns. Let them pick the next thing and you guess.", html:`<div class="row">${["s","m","b"].map((x,j)=>`<span class="card flip" style="--d:${j*.4}s">${x}…</span>`).join("")}</div>`}
      ];
      return [
        {cap:`Show the letter and say the sound: /${s}/.`, html:`<div class="big pop">${s}</div>`},
        {cap:`Sound hunt! Walk around and find 3 things with the /${s}/ sound.`, html:`<div class="row">${[0,1,2].map(j=>`<span class="coin pop" style="--d:${.5+j*.7}s">✓</span>`).join("")}</div>`},
        {cap:"Pour a thin layer of salt or sand on a tray.", html:`<div class="tray pop"><svg viewBox="0 0 150 120"></svg></div>`},
        {cap:`Child traces the letter in the sand while saying /${s}/.`, html:`<div class="tray">${traceSvg(s,.2,true)}</div>`},
        {cap:"Shake the tray to erase. Do it 3 times. Praise neat starts, not perfect letters.", html:`<div class="tray fade"><svg viewBox="0 0 150 120"></svg></div>`}
      ];
    },
    // Day 3 Blend it
    (w,t,i)=>{
      const ws=cleanWords(w), a=ws[0], b=ws[1]||ws[0], n=graphemes(a).length;
      return [
        {cap:`Lay out the letter tiles for "${a}".`, html:tiles(a)},
        {cap:`Touch each tile and say its sound: ${soundsOf(a)}`, html:tiles(a,{d:0,step:0,hiStart:.4,hiStep:.8})},
        {cap:"Now slide your finger under the tiles and push the sounds together, slowly then faster.", html:`<div style="display:inline-block">${tiles(a,{step:0})}<span class="sweep" style="--d:.3s;margin-top:8px"></span></div>`},
        {cap:`Say the word: ${a}!`, html:`<div class="word pop">${a}</div>`},
        {cap:`Next word: change the tiles to "${b}" and do it again. Let your child lead.`, html:tiles(b,{d:.2})}
      ];
    },
    // Day 4 Read & write
    (w,t,i)=>{
      const ws=cleanWords(w), a=ws[2]||ws[0], b=ws[3]||ws[1]||ws[0];
      const gs=graphemes(b);
      const scr=gs.map((g,j)=>`<span class="tl settle" style="--d:${.6+j*.4}s;--x:${(j%2?1:-1)*(40+j*25)}px;--y:${j%2?-40:50}px;--r:${j%2?12:-15}deg">${g}</span>`).join("");
      return [
        {cap:`Show a word card. Child reads it: ${a}.`, html:`<div class="card pop" style="font-size:2.6rem">${a}</div>`},
        {cap:`Now you say a word out loud, clearly: ${b}.`, html:`<div class="big pulse">${SPK}</div>`},
        {cap:"Child finds the tiles and builds it, saying each sound.", html:`<div class="tiles">${scr}</div>`},
        {cap:"Check together: touch and say each sound, then read the whole word.", html:`${tiles(b,{step:0,hiStart:.2,hiStep:.6})}<div class="ok pop" style="--d:${.4+gs.length*.6}s;font-size:2rem">✓</div>`},
        {cap:"Do 3 words. Older or confident kids can write them on paper instead.", html:`<div class="paper">${[a,b,ws[0]].map((x,j)=>`<div class="ln hand fade" style="--d:${j*.6}s">${x}</div>`).join("")}</div>`}
      ];
    },
    // Day 5 Review game
    (w,t,i)=>{
      const sf=soFar(t,i), hs=heartsSoFar(t,i);
      const st=[
        {cap:"Flash card race: hold up each sound card, child says the sound as fast as they can.", html:`<div class="row">${(sf.length?sf:["s","a","t"]).map((x,j)=>`<span class="card flip" style="--d:${j*.45}s">${x}</span>`).join("")}</div>`},
        {cap:"Put any tricky ones in a small pile and do them again at the end.", html:`<div class="pile pop">tricky pile</div>`}
      ];
      if (hs.length) st.push({cap:`Heart words: we just know these by heart. ${hs.join(", ")}.`, html:`<div class="row">${hs.map((x,j)=>`<span class="card red pop" style="--d:${j*.4}s">♥ ${x}</span>`).join("")}</div>`});
      st.push({cap:"Finish on a win: let them pick a word for you to read, and get it wrong on purpose so they can correct you.", html:`<div class="big pop">★</div>`});
      return st;
    }
  ],
  spelling: [
    // Day 1 Teach the rule
    (w)=>{
      const ws=cleanWords(w);
      return [
        {cap:`Today's pattern: ${w.s.join(", ")}.`, html:`<div class="row">${w.s.map((x,j)=>`<span class="big pop" style="--d:${j*.3}s;font-size:clamp(2.6rem,12vw,4.5rem)">${x}</span>`).join("")}</div>`},
        {cap: w.tip || `Explain: these words share the ${w.t} pattern.`, html:`<div class="card pop" style="font-size:1.1rem;max-width:90%">${esc(w.tip||w.t)}</div>`},
        {cap:"Read the words together. Child points to the pattern in each one.", html:`<div class="row">${ws.slice(0,6).map((x,j)=>`<span class="word fade" style="--d:${j*.4}s;font-size:1.9rem">${marked(x,w)}</span>`).join("")}</div>`},
        {cap:"Child writes the rule on an index card in their own words. It goes in the rule box.", html:`<div class="paper"><div class="ln hand fade">${esc(w.t)}</div><div class="ln hand fade" style="--d:.6s">${ws.slice(0,2).join(", ")}</div></div>`}
      ];
    },
    // Day 2 SOS
    (w)=>{
      const ws=cleanWords(w), a=ws[0], gs=graphemes(a), letters=a.split("");
      return [
        {cap:`Say the word: ${a}. Child repeats it.`, html:`<div class="big pulse">${SPK}</div>`},
        {cap:`Child taps one finger per sound: ${soundsOf(a)}`, html:`<div class="row">${gs.filter((_,i)=>i!==gs.silent).map((g,j)=>`<span class="coin pop" style="--d:${.3+j*.7}s">${j+1}</span>`).join("")}</div>`},
        {cap:`Child says each letter name out loud as they write it: ${letters.join(", ")}.`, html:`<div class="paper"><div class="ln hand">${letters.map((c,j)=>`<span class="pop" style="--d:${.3+j*.6}s">${c}</span>`).join("")}</div></div>`},
        {cap:"Read it back, sweeping a finger under the word.", html:`<div style="display:inline-block"><div class="word hand">${a}</div><span class="sweep" style="--d:.2s"></span></div>`},
        {cap:"Repeat with 4 more words from the list. Same steps every time.", html:`<div class="row">${ws.slice(1,5).map((x,j)=>`<span class="chip pop" style="--d:${j*.3}s">${x}</span>`).join("")}</div>`}
      ];
    },
    // Day 3 Dictation
    (w)=>{
      const ws=cleanWords(w), a=ws[0], b=ws[1]||ws[0], sent=`I can spell ${a} and ${b}.`;
      return [
        {cap:"Read each word clearly, just once. Child repeats it before writing.", html:`<div class="big pulse">${SPK}</div>`},
        {cap:"Child writes each word using SOS. You stay quiet and watch.", html:`<div class="paper">${ws.slice(0,3).map((x,j)=>`<div class="ln hand fade" style="--d:${j*.8}s">${j+1}. ${x}</div>`).join("")}</div>`},
        {cap:`Then one sentence. Say: ${sent}`, html:`<div class="paper"><div class="ln hand fade" style="font-size:1.3rem">${sent}</div></div>`},
        {cap:"Check together. Child finds and fixes their own mistakes first, then you help.", html:`<div class="paper">${ws.slice(0,3).map((x,j)=>`<div class="ln hand">${j+1}. ${x} <span class="${j===1?"no":"ok"} pop" style="--d:${.4+j*.6}s">${j===1?"fix":"✓"}</span></div>`).join("")}</div>`}
      ];
    },
    // Day 4 Red words
    (w,t,i)=>{
      const r=(w.h&&w.h[0]) || heartsSoFar(t,i).slice(-1)[0] || cleanWords(w)[0];
      return [
        {cap:`Show the memory word: ${r}. Explain that part of it doesn't follow the rules, so we learn it by heart.`, html:`<div class="card red pop" style="font-size:2.8rem">${r}</div>`},
        {cap:`Trace it 3 times, saying each letter: ${r.split("").join(", ")}.`, html:traceSvg(r,.2)},
        {cap:"Cover the word. Child writes it from memory.", html:`<span class="coverbox"><span class="word">${r}</span><span class="lid" style="--d:.4s"></span></span>`},
        {cap:"Uncover and check letter by letter. Practise 3 times in total.", html:`<div class="row"><span class="word">${r}</span><span class="ok pop" style="--d:.6s;font-size:2rem">✓</span></div>`}
      ];
    },
    // Day 5 Check
    (w)=>{
      const ws=cleanWords(w);
      return [
        {cap:"Spelling check: read 10 words from this week, one at a time.", html:`<div class="big pulse">${SPK}</div>`},
        {cap:"Child writes them. No hints this time.", html:`<div class="paper">${ws.slice(0,4).map((x,j)=>`<div class="ln hand fade" style="--d:${j*.6}s">${j+1}. ${x}</div>`).join("")}</div>`},
        {cap:"Mark them together.", html:`<div class="paper">${ws.slice(0,4).map((x,j)=>`<div class="ln hand">${j+1}. ${x} <span class="${j===2?"no":"ok"} pop" style="--d:${.3+j*.5}s">${j===2?"✗":"✓"}</span></div>`).join("")}</div>`},
        {cap:"Any missed word goes in the review pile and gets practised next week.", html:`<div class="row"><span class="chip pop">${ws[2]||ws[0]}</span><span style="font-size:2rem">→</span><span class="pile pop" style="--d:.5s">review pile</span></div>`}
      ];
    }
  ]
};


const BUGS = [
  {t:"What makes an insect?", big:"Every insect has 6 legs, 3 body parts and 2 antennae.",
   words:["insect","head","thorax","abdomen","antennae","legs"],
   read:"Look closely at an ant, a bee or a ladybug and you will find the same plan. Every insect has three body parts. The head holds the eyes and the antennae, which feel and smell. The middle part is the thorax, and all six legs grow from it. The back part is the abdomen, where food is digested. Count with me: one head, one thorax, one abdomen, six legs. That's an insect!",
   lab:{t:"Build a bug", mat:["Playdough, or 3 pompoms or egg-carton cups","6 pipe cleaners or toothpicks","2 short pieces for antennae"],
     steps:["Roll three balls and press them in a row: head, thorax, abdomen.","Add all 6 legs to the middle part, the thorax. Count them out loud.","Add 2 antennae to the head.","Point and name each part. Then let your child build one all by themselves."]},
   journal:"Find a real insect today. Count its legs before you draw it.",
   song:"Tune of Head, Shoulders, Knees and Toes: Head, thorax, abdomen, abdomen. Head, thorax, abdomen, abdomen. Six legs and two antennae too, that's how you know an insect's true!",
   little:"Just count legs and body parts together. The big words will sink in by hearing them.",
   bigger:"Draw an insect and label head, thorax, abdomen and antennae.",
   safety:"Look with your eyes, then let it go where you found it."},
  {t:"Insect or not?", big:"Spiders, centipedes and roly-polies are not insects.",
   words:["spider","arachnid","eight","centipede","roly-poly","crustacean"],
   read:"Not every small crawling creature is an insect. A spider has eight legs and only two body parts, and it has no antennae, so it belongs to a group called arachnids. A centipede has a long body with many sections and a pair of legs on almost every one. And the roly-poly that curls into a ball? It is a crustacean, a cousin of crabs and shrimp! Counting legs is the best way to tell who's who.",
   lab:{t:"Sort the critters", mat:["Bug pictures, toys or the printables","2 bowls or hula hoops","Labels: Insect and Not an insect"],
     steps:["Lay out the critters face up.","Pick one and count its legs together.","Six legs goes in the Insect bowl. Any other number goes in Not an insect.","Count each pile. Which group has more?"]},
   journal:"Find a spider web. Draw it. Is anyone home?",
   little:"Focus on one question only: does it have six legs?",
   bigger:"Make a chart with columns for insect, spider and centipede: legs, body parts, antennae.",
   safety:"Look at spiders but don't touch them."},
  {t:"From egg to butterfly", big:"Butterflies change completely as they grow: egg, caterpillar, chrysalis, butterfly.",
   words:["egg","caterpillar","larva","chrysalis","pupa","butterfly"],
   read:"A butterfly begins as a tiny egg stuck to a leaf. Out crawls a hungry caterpillar that eats and eats and grows so fast it bursts out of its skin again and again. When it is big enough, it hangs very still and forms a hard case called a chrysalis. Inside, its whole body is changing. One day the chrysalis opens and out comes a butterfly, drying its wings in the sun. This big change is called metamorphosis.",
   lab:{t:"Pasta life cycle", mat:["A paper plate divided into 4","A grain of rice, spiral pasta, shell pasta, bow-tie pasta","Glue"],
     steps:["Draw a leaf in the first section and glue on the rice egg.","Glue the spiral caterpillar in the second.","Glue the shell chrysalis in the third.","Glue the bow-tie butterfly in the last. Tell the story going round the circle."]},
   journal:"Draw the four stages in a circle with arrows.",
   little:"Act it out: curl up as an egg, crawl as a caterpillar, freeze as a chrysalis, then fly!",
   bigger:"Optional: order a live caterpillar kit 2 to 3 weeks ahead and keep a daily growth log.",
   safety:"Wash hands after handling caterpillars."},
  {t:"Ants work together", big:"Ants live in big families called colonies and share the work.",
   words:["ant","colony","queen","worker","trail","nest"],
   read:"An ant never lives alone. It lives in a colony with hundreds or even thousands of sisters. The queen lays all the eggs. The workers dig tunnels, care for babies and go out to find food. When a worker finds something tasty, it leaves an invisible smell trail on the way home, and the other ants follow it. That's why you often see ants marching in a line!",
   lab:{t:"Ant picnic", mat:["A piece of paper outside near ants","3 foods: a drop of honey, a bread crumb, a piece of apple","A timer"],
     steps:["Put the three foods on the paper, a little apart.","Guess first: which food will the ants find first?","Check every 10 minutes and count the ants on each food.","Which food won? Were you right?"]},
   journal:"Draw an ant trail. Where does it start and end?",
   little:"Just count the ants at each food and point to the winner.",
   bigger:"Make a tally chart, then a bar graph of ants per food.",
   safety:"Skip red fire ants; they sting."},
  {t:"Bees and flowers", big:"Bees carry pollen from flower to flower, and that helps flowers make seeds and fruit.",
   words:["bee","pollen","nectar","flower","pollinate","hive"],
   read:"A bee visits a flower to drink sweet nectar. While it drinks, yellow pollen dust sticks to its fuzzy body. When it flies to the next flower, some of that pollen rubs off. This is called pollination, and it helps the flower make seeds. Many fruits we eat, like apples and strawberries, need bees to help them grow. Bees are tiny farmers!",
   lab:{t:"Cheesy pollination", mat:["3 paper flowers (or the Flower printable)","Cheese-puff dust or a little chalk dust","A cotton ball as the bee"],
     steps:["Sprinkle a little 'pollen' dust in the middle of each flower.","Your child is the bee. Visit flower 1 with the cotton ball.","Fly to flower 2, then flower 3.","Look: the pollen moved from flower to flower. That's pollination!"]},
   journal:"Watch a flowering plant for 5 minutes. How many visitors came?",
   little:"Buzz around the room as bees, visiting 'flowers' (pillows).",
   bigger:"Count visitors for 5 minutes at two different flowers and compare.",
   safety:"Never touch bees. Stay calm and still if one comes close."},
  {t:"Beetles and ladybugs", big:"Beetles have hard wing covers that protect the soft wings underneath.",
   words:["beetle","ladybug","shell","wing","spots","aphid"],
   read:"There are more kinds of beetles than any other animal on Earth. A beetle's back looks like a shiny shell, but it's really two hard wing covers. When a beetle wants to fly, the covers lift up and thin wings unfold from underneath. Ladybugs are beetles too. Gardeners love them because they eat tiny bugs called aphids that hurt plants.",
   lab:{t:"Ladybug spot math", mat:["Paper ladybugs (red circles with a line down the middle)","Black dot stickers or a marker","A die"],
     steps:["Roll the die and put that many spots on the left wing.","Roll again for the right wing.","Count all the spots together.","Make a whole family of ladybugs and line them up from fewest spots to most."]},
   journal:"Gently roll a log or stone. Draw any beetles you find, then roll it back.",
   little:"Count the spots on each side, then all together.",
   bigger:"Write each ladybug as an addition sentence: 3 + 4 = 7.",
   safety:"Roll logs toward you so anything underneath is on the far side."},
  {t:"Insect senses and hiding", big:"Insects smell with their antennae, see with many-lensed eyes and hide with camouflage.",
   words:["antennae","compound eye","camouflage","hide","predator","color"],
   read:"An insect smells and feels the world with its antennae. Many insects have compound eyes made of hundreds of tiny lenses, so they notice the smallest movement. Lots of insects are also great at hiding. A green grasshopper disappears in the grass, and a stick insect looks just like a twig. This is called camouflage, and it keeps them safe from hungry birds.",
   lab:{t:"Camouflage hunt", mat:["10 green and 10 bright paper 'bugs'","A patch of grass or a green blanket","A 1-minute timer"],
     steps:["While your child hides their eyes, scatter all 20 bugs.","They have 1 minute to find as many as they can.","Sort what they found: green or bright?","Which color hid better? Why?"]},
   journal:"Look for an insect that is hiding. Draw it the same color as its hiding place.",
   little:"Play it twice and swap: you hunt, they hide.",
   bigger:"Record results in a table and try a third color.",
   safety:"Stay where a grown-up can see you."},
  {t:"Build a bug hotel", big:"Insects need a home with shelter, food and water, just like us.",
   words:["habitat","shelter","log","leaves","garden","home"],
   read:"Every creature needs a habitat: a place with food, water and shelter. Many insects hide in hollow stems, under bark or between dry leaves. We can help them by building a bug hotel full of little rooms. Then we can watch who moves in. Scientists all over the world watch insects this way, patiently and gently.",
   lab:{t:"Bug hotel", mat:["A clean can, carton or plastic bottle cut open","Sticks, pinecones, bark, dry leaves, straws","String"],
     steps:["Pack the container tightly with the natural bits, open ends facing out.","Tie string around it so it holds together.","Place it in a quiet, sheltered spot outside.","Check every week and count the visitors."]},
   journal:"Start a Bug Hotel log: date, weather and who you saw.",
   little:"Let them choose and stuff the 'rooms'.",
   bigger:"Keep the log for a month and look for patterns.",
   safety:"Look but don't poke inside the hotel."}
];
const BUG_PRINTS = {0:["1OIxWNsooQHI7cxNJot_7VAFiPRvVZn1F"],1:["1RaE78Femyq09SwrqDJGO1XUo2HfG6gtJ","1Whts1z98VSPa9j6AuVbFg7VmBhORX_-3","1b28wOyKUcw9vu-TFjXHSG8UPR0xUVTnW"],4:["1hwPrtuCbNqUHrCfKE6dPOHMk3lmdsumA"]};

const DRIVE = id => `https://drive.google.com/file/d/${id}/view`;
const READ_WHEN = {burned:"Burned out", behind:"Feeling behind", emotions:"Big emotions", habits:"Building habits", healing:"Healing", teach:"Planning lessons"};

const BOOKS = [
  // Parenting & teaching
  {shelf:"parent", t:"Teaching From Rest", a:"Sarah Mackenzie", tags:["burned","behind"], id:null,
   sum:"For homeschool parents who feel anxious about doing enough. It argues that faithfulness matters more than results, and shows how to simplify the curriculum and the schedule.",
   try:"Use the Minimum day button without guilt at least once this week."},
  {shelf:"parent", t:"Orton-Gillingham Training Manual", a:"M.A. Rooney Foundation", tags:["teach"], url:"https://or.dyslexiaida.org/wp-content/uploads/sites/20/2020/06/OG-Training-Manual-2019.pdf",
   sum:"A teacher's guide to the Orton-Gillingham approach: systematic, multisensory reading and spelling instruction. The reading lessons in this app follow its order.",
   try:"Read the Error Correction section before noting mistakes in a lesson."},
  {shelf:"parent", t:"R.E.A.L. Science Odyssey: Life (sample)", a:"Pandia Press", tags:["teach"], id:"1djnMijvakDBy92v9JWcLHe4eV1JemnTO",
   sum:"A hands-on K to 2 life science course: short read-aloud lessons, labs and nature journaling. Your file is a sample covering the first units; insects, spiders and crustaceans are units 16 to 18 in the full book.",
   try:"Pair its nature-journal ideas with this week's Bug Lab."},
  {shelf:"parent", t:"26 Phrases to Calm Your Angry Child", a:"From your printables folder", tags:["emotions"], id:"1-aAFX77XF9Soc-dbxtIhY5bjBB2iAreW",
   sum:"A short list of calm, connecting phrases to use when a child is angry.",
   try:"Pick two phrases and stick them on the fridge for the next meltdown."},
  {shelf:"parent", t:"45 Stress-Free Toddler Activities", a:"From your printables folder", tags:["burned"], id:"1xf3WgqtE9TxwcnkBE2Fo-sQZwpp0ORPy",
   sum:"Low-prep activity ideas for little ones, handy for keeping a toddler busy while you teach an older child.",
   try:"Choose three for a 'quiet box' during your 7-year-old's spelling lesson."},
  {shelf:"parent", t:"Kumon Reading and Math Levels", a:"Kumon (parent guides)", tags:["teach"], ids:["16vHHNZ4pCYrG_s68h9Zm0_kG7F-UdmZn","176Gs3Nb_a3kLjHeI7sm5zWHjFc3t3FH-"],
   sum:"Overview charts of Kumon's reading and math levels, useful for seeing which workbook comes next.",
   try:"Check where each child sits before choosing a workbook in Printables."},
  // For you
  {shelf:"you", t:"Atomic Habits", a:"James Clear", tags:["habits","burned"], id:"1g85yXgoUwYJv3ben0K84dwXC6EH2288V",
   sum:"Tiny changes repeated daily add up to big results. Make good habits obvious, attractive, easy and satisfying, and focus on who you are becoming rather than goals alone.",
   try:"Stack class onto something you already do: 'After breakfast dishes, we start Morning Time.'"},
  {shelf:"you", t:"The Courage to Be Disliked", a:"Ichiro Kishimi and Fumitake Koga", tags:["behind","habits"], id:"1g659WypCm5Sj6d45oRc6klw67FVhVu2O",
   sum:"A conversation between a philosopher and a young man about Adlerian psychology: separating your tasks from other people's, letting go of the need for approval and living fully in the present.",
   try:"When you compare your homeschool to someone else's, ask: whose task is this?"},
  {shelf:"you", t:"Untamed", a:"Glennon Doyle", tags:["healing","behind"], id:"1gEyO0O_fDYHpUdJ-YTCMW8CvcoTgV79m",
   sum:"A memoir about unlearning the expectations placed on women and mothers, and learning to trust your own inner knowing.",
   try:"Write down one 'should' about homeschooling that isn't actually yours."},
  {shelf:"you", t:"Running on Empty", a:"Jonice Webb", tags:["healing","emotions"], id:"1Hcx_keKQEq9bCYr1ktskpXXbD7qBPtJQ",
   sum:"About childhood emotional neglect: what happens when feelings aren't noticed or named growing up, and how adults can learn to recognise and care for their own emotions.",
   try:"Name one of your own feelings out loud each day, the way you'd help your child name theirs."},
  {shelf:"you", t:"How to Heal Yourself When No One Else Can", a:"Amy B. Scher", tags:["healing"], id:"1fzSFuyQgWFMW1rRvYpaPm7va5EKkuNRB",
   sum:"A self-guided approach to emotional healing, with simple practices for releasing old hurts and building self-love.",
   try:"Try one short practice from it during a movement break while the kids wiggle."},
  {shelf:"you", t:"This Is How You Heal", a:"Brianna Wiest", tags:["healing","burned"], id:"1fyoQvVr_DgklLJmJaIl1Ay6V29b7pAyL",
   sum:"Reflections on rebuilding after hard seasons, and how healing happens through small, daily choices rather than one big moment.",
   try:"Read one short chapter on a tired-day afternoon instead of scrolling."},
  {shelf:"you", t:"The Strength in Our Scars", a:"Bianca Sparacino", tags:["healing"], id:"1gDT9T2VYxV5crzD_x0SxPC6Nr0lblpoo",
   sum:"Short, gentle pieces about healing, self-worth and growing through heartbreak and loss.",
   try:"Keep it by your bed for a page or two at night."}
];

const SUBJECTS = {lit:"Reading & language", math:"Math", sci:"Science & nature", art:"Art & fine motor", life:"Feelings & routines", season:"Seasonal", books:"Read-alouds", kumon:"Kumon workbooks", label:"Needs a label"};
// [id, title, subject, type, ages, prep, use]
const PRINTS = [
  ["1F4iBQ-qBeQeRAHZi4dpzJfnEn2t-Y29Q","Phonics flashcards","lit","Flashcards","3–6","Cut & laminate",{phonics:[2,21]}],
  ["1PwSNRd6u_jPzgWJDjvbNsBdEBx8y-CTR","Phonics flashcards, colored border","lit","Flashcards","3–6","Cut & laminate",{phonics:[2,21]}],
  ["1bEkdsHHCu9dTWRTohgaJQS1quvhqSMWj","CVC words with pictures","lit","Word cards","4–6","Cut & laminate",{phonics:[3,13]}],
  ["1K4crScu66hB68YHGdKCBh-mrwATOVa86","Sand letters","lit","Letter templates","3–5","Gather items",{phonics:[2,13]}],
  ["1YGpohi6SCrX36gCeWf11kL_rzZ7MoZ_K","Animal sounds flashcards","lit","Flashcards","2–4","Cut & laminate",{phonics:[0,1]}],
  ["1ayWe3MlqfFH4SJ3hiDwushcP0aynVBDn","Opposites","lit","Picture cards","3–5","Cut & laminate",null],
  ["1PZ5CWoeOxwM5_9AqpQ92urtHIFy1CmOm","Rainbow with color words","lit","Worksheet","3–6","Print & go",null],
  ["11NqG-hcvjIgyBHvIk-6bcuhLh8V4ZeyD","Speech therapy visual helpers","lit","Picture cards","2–5","Cut & laminate",null],
  ["1qoQRiU-H5SGFWKXMdPbdOBZA0KKPfO_2","Cookie numbers","math","Counting cards","3–5","Cut & laminate",null],
  ["16vnzTKhzHbnV2vNi6fPeDlMdo21g3TFb","Counting cookies","math","Counting mat","3–5","Print & go",null],
  ["1hLFirEcIRQtKAKtOfwonB0vtl2gw8f4Z","Carrots for bunny feeding","math","Counting game","3–5","Cut & laminate",null],
  ["1QZuBXDK7DjUUWDnVPsEMm9a4RTR6EiL0","Geometrical shapes","math","Shape cards","3–6","Cut & laminate",null],
  ["1m8JswiZJGYefZPXw9YqkqS4vKenllHdY","Robots shape matching","math","Matching game","3–5","Cut & laminate",null],
  ["1mfYN5vCMkP8hmwe8L--Wz1Nzue_nX96c","Popsicle stick patterns","math","Pattern cards","3–5","Gather items",null],
  ["1F9i1fL-OHeC8-OkJlIkRkqr0uFnizTHb","Clip cards","math","Clip cards","3–5","Cut & laminate",null],
  ["1e2CTYIe-ISPmHSHPLXdu6T_HBUBHb7S6","Clock","math","Clock model","5–7","Cut & assemble",null],
  ["1aSYO3kBDc8rOYqltJ-PsYXoyYn8envyt","Telling time and colors poster","math","Poster","5–7","Print & go",null],
  ["1CY-rv5jYVQKaSj251238BdOzyU1GwjoB","Days of the week and count to 10 poster","math","Poster","3–5","Print & go",null],
  ["1OIxWNsooQHI7cxNJot_7VAFiPRvVZn1F","Insect coloring pages","sci","Coloring","3–6","Print & go",{bugs:[0]}],
  ["1RaE78Femyq09SwrqDJGO1XUo2HfG6gtJ","Color spiders circle time","sci","Circle-time game","3–5","Cut & laminate",{bugs:[1]}],
  ["1Whts1z98VSPa9j6AuVbFg7VmBhORX_-3","Spider web coloring page","sci","Coloring","3–6","Print & go",{bugs:[1]}],
  ["1b28wOyKUcw9vu-TFjXHSG8UPR0xUVTnW","Centipede picture","sci","Picture card","3–7","Print & go",{bugs:[1]}],
  ["1hwPrtuCbNqUHrCfKE6dPOHMk3lmdsumA","Flower","sci","Craft template","3–6","Cut & assemble",{bugs:[4]}],
  ["1v6KFjbiTa2i_vLcAirOGTyfyVGIP4r4k","Space learning binder","sci","Binder pages","4–7","Cut & laminate",null],
  ["1yU594pzvU1w0poRBXn1PaSHrS03e6NR-","Solar system and shapes poster","sci","Poster","5–7","Print & go",null],
  ["1289jyvHT8VxEKalEvxIFUBEXWloSRRZ-","Months and weather poster","sci","Poster","3–7","Print & go",null],
  ["1HujZCdNuWy9qqdX7rOvQ9_hjymep9hRh","Large vehicles coloring pages","art","Coloring","3–5","Print & go",null],
  ["1rJPg4KvjY_xFcp9Rv32QKamKzlBAHGZX","Octopus","art","Craft template","3–5","Cut & assemble",null],
  ["1g7vw7P3rSe_GRMgU1tkVtCqeFG_vNEGp","Cupcake","art","Craft template","3–5","Cut & assemble",null],
  ["1e_bf3_V3oEgO8eXa3dVxxoFi5RL23fKT","Bunny face","art","Craft template","3–5","Cut & assemble",null],
  ["1J4da7cFYBGW_M-TJUyC_7nEVBD3yjiPG","Dress the potato","art","Cut-and-dress game","3–5","Cut & laminate",null],
  ["1tLR-1lHWKlEs8iDVFRqRJFyxBKt8e2An","Playdough cards: cars","art","Playdough mats","3–5","Cut & laminate",null],
  ["1MDGIfVPXZffJ8jgXbsVA2gQ4kELMP_q6","Busy bags: find my feet","art","Matching game","2–4","Cut & laminate",null],
  ["1bh7pWaws_nszxwKGaQfvTznbNsxAsty-","Colors","art","Color cards","2–4","Cut & laminate",null],
  ["1XRcXCwczi0b0nLOwOTbKnUjt360nkogT","Wobbel balance board cards","art","Movement cards","3–7","Print & go",{breaks:true}],
  ["1iPVsbtLWlg70f5STNZlv-1JQXzxOwp7l","Busy book (shortcut)","art","Busy book","2–4","Cut & laminate",null],
  ["1F1EQkvmPQMo9HfG4ufDDpA1VlxFs1iWx","Classroom posters set (full size)","art","Poster set","3–7","Print & go",null],
  ["13jm9ZEDXngxPl1767nME0UiGchuPkupF","Classroom posters set (compressed copy)","art","Poster set","3–7","Print & go",null],
  ["1Ejb1gZlPVpw7v1QInpWWgS9nGOEy0wqe","Calm-down choices (read, draw, hug, water)","life","Choice board","3–7","Cut & laminate",{calm:true}],
  ["1ESYR6IS7MaMKPQZQJyMeWcfHP7MvwmcD","Feelings and calming techniques","life","Poster","3–7","Print & go",{calm:true}],
  ["10w6Q1ahD4D-szYDMoibe9vv7rlxOsDUZ","Morning and bedtime jobs chart","life","Routine chart","3–7","Print & go",null],
  ["1fX3frWmcZ13bLwvgdbhX9k7xtzLtuaUM","Routine charts","life","Routine chart","3–7","Print & go",null],
  ["178oT6Y7RyuDdlsRIoNUW4fHY3_AfomLB","Grooming and handwashing cards","life","Picture cards","2–5","Cut & laminate",null],
  ["1nljhe4VACYvCow_cpiHmaGOaQa1WVuIc","Halloween mask","season","Craft template","3–6","Cut & assemble",null],
  ["1oN_l1AZp_cVQMDAl8K4g1_8ccPGv3Pbl","Halloween playdough mats","season","Playdough mats","3–5","Cut & laminate",null],
  ["1OI7n21Fbc-tIRRREuY7ApsVHzE4HQDFb","Stack of pumpkins coloring page","season","Coloring","3–6","Print & go",null],
  ["1F2fmh5NDzy93HrTi_sce_rOJjt0gmx5p","Pumpkin printable","season","Coloring","3–6","Print & go",null],
  ["1scw1Xu_aSbfEQvfP_PFb4AVefDT_tFSh","Brown Bear, What Do You See?","books","Picture book","2–5","Read on screen",null],
  ["1ceg4irTWIH8b6uWNkwE5Nn-Dlc1-vY9C","Where Is Bear?","books","Picture book","2–5","Read on screen",null],
  ["1WDw0GaQq_Y9_PpcrqzhqJoNr7TRJa_wQ","Kids' guide to coronavirus","books","Health e-book","4–7","Read on screen",null],
  ["16zeuyumc4dmzbQRIOKttJiKiwdFZPHHW","My First Book of Tracing","kumon","Workbook","2–4","Print & go",null],
  ["16jJLveYEdHAChfbr0mmfbLO3i0Hrh8Qa","My First Book of Cutting","kumon","Workbook","3–5","Print & go",null],
  ["16c4mxon7XRPzrqtBeSnz-8oFGhkpREBS","My Book of Pasting","kumon","Workbook","3–5","Print & go",null],
  ["16csR7F9KPiv3R-TNmyh-72dp4LY5XYjb","My Book of Pasting: Jigsaw Puzzles","kumon","Workbook","4–6","Print & go",null],
  ["16U0dgu_AFOS7HX7Tc7xk1e1ohaJNGRtX","My Book of Alphabet Games","kumon","Workbook","4–6","Print & go",{phonics:[2,13]}],
  ["16WEE9CITiQDYoAJ-5bWuxQ8Q3XLHBzAh","My Book of Rhyming Words","kumon","Workbook","4–6","Print & go",{phonics:[0,1]}],
  ["16v7K2u_Adl4omiDsVXG5xxhtxo44Ye_6","Rhyming Words: Long Vowels","kumon","Workbook","4–6","Print & go",{phonics:[27,34]}],
  ["16ibP8PYLt5OZEokX_qqVjCNLAWZIEyle","Grade 1 Reading","kumon","Workbook","6–7","Print & go",{spelling:[0,8]}],
  ["16WFzshABLWm2-ouJhtgQak2k7qwPgukV","My Book of Numbers 1–30","kumon","Workbook","3–5","Print & go",null],
  ["16ZNZHPZw466hKFxUIRDkeYCEEa2LQv-P","My Book of Number Games 1–70","kumon","Workbook","4–6","Print & go",null],
  ["16QhHLhpZhJhJLDlcZNhKNp2_D9Z2LmqX","My Book of Numbers 1–120","kumon","Workbook","5–7","Print & go",null],
  ["16WChXb4MaTXdTunaGaysPuMMTI1XCXPe","My Book of Number Games 1–150","kumon","Workbook","5–7","Print & go",null],
  ["169MKUjT3pGnZt01iqfpJBSpmqYYp8im4","My Book of Simple Addition","kumon","Workbook","4–6","Print & go",null],
  ["16DKY-hP-GGcakb4ABcWfD4xJRtHkt1jX","Addition","kumon","Workbook","5–7","Print & go",null],
  ["16Lf2h0EiqxMalOrcZEUOl1TVQvD6Ktg8","My Book of Simple Subtraction","kumon","Workbook","5–7","Print & go",null],
  ["16PIEw0u3d91LuqRQz3treoknPULYE7mo","My Book of Subtraction","kumon","Workbook","6–7","Print & go",null],
  ["16Y6g75wpVWvp62MsNs7lTMvKRKeuR1Yo","My Book of Easy Telling Time","kumon","Workbook","5–7","Print & go",null],
  ["1EqJqcFLTOuLrWYitKHpP87xHY2DudOk2","images (6).jpeg","label","Image","","",null],
  ["1F00IMYkZIMXqjOHMgr7IcUcI5aGPVTp0","images (4).jpeg","label","Image","","",null],
  ["1ERX_KFiIpcqx2F527V2P30ms2BYb_z8D","images (3).jpeg","label","Image","","",null],
  ["1JQl86Pw3J8y7LoaPTDOWCzKpDXWktScw","61trTija4KL.jpg","label","Image","","",null],
  ["1zLRvq_CvBj7yIDXqgA0Eb8-zZdo23SVi","616+7-w0o8L.jpg","label","Image","","",null],
  ["1qMDQwW3MJC82hR6K_W0PXbtHVLcNESKE","4c9abLxyi.gif","label","Image","","",null],
  ["1Bd3smomZN4mA6jvsXHRxdwMp-OnaBdhq","36_Location_Board.gif (maybe position words)","label","Image","","",null]
].map(([id,t,s,type,age,prep,use])=>({id,t,s,type,age,prep,use}));

Object.assign(READ_WHEN, {disc:"Discipline struggles", baby:"Baby & toddler days", monte:"Setting up Montessori", money:"Raising grateful kids"});
const SHELF_GROUPS = {home:"Homeschool & teaching", monte:"Montessori", calm:"Calm discipline & connection", brain:"Emotions & the developing brain", little:"Babies & toddlers", ref:"Reference", self:"For you"};
BOOKS.forEach(b=>{ b.g = b.shelf==="you" ? "self" : (b.t.startsWith("Orton")||b.t.startsWith("R.E.A.L")||b.t.startsWith("Teaching")||b.t.startsWith("Kumon")) ? "home" : b.t.startsWith("45")?"little":"calm"; });
const BK = (t,a,g,tags,ids,sum,tr,shelf="parent")=>({t,a,g,tags,ids:[].concat(ids),sum,try:tr,shelf});
BOOKS.push(
 BK("The Brave Learner","Julie Bogart","home",["burned","teach"],"1_zZoLsGf1MMLsjtE1Im80rP6M4QTBchO","How to bring curiosity, surprise and delight back into home learning instead of grinding through a checklist.","Add one 'surprise' to class this week: a new place, a snack, a candle at story time."),
 BK("The Call of the Wild and Free","Ainsley Arment","home",["burned","behind"],"1ZQyOQdfrUUDkxV6VG5U8OC0zT-zAI_R2","An invitation to a slower, nature-rich, wonder-filled childhood and homeschool.","Take Bug Lab outside and let it run long."),
 BK("Modern Miss Mason","Leah Boden","home",["teach"],"17Nnwy-oDlvzZjBumumwNA92vWULWJCO-","Charlotte Mason's ideas (living books, nature study, short lessons, habit) made practical for families today.","Keep lessons short and end before attention fades, just like the app's timer."),
 BK("The Opt-Out Family","Erin Loechner","home",["burned"],"1G8FNZ-qYghMvbizVXVg3Q6vFylJW98Ku","A gentle case for stepping back from screens and the pressure of the online world as a family.","Do class with phones in another room, including yours."),
 BK("How Your Child Learns Best","Judy Willis","home",["teach"],"1Ctyf7h_0SjbG7BFRw9muBKCXloRHiCsu","A neurologist and teacher's brain-friendly strategies for helping children focus, remember and enjoy learning.","Start each lesson with a quick question your child is curious about."),
 BK("The Absorbent Mind","Maria Montessori","monte",["monte"],"1IAlH2F-6ycM00Yc7Qj_XVMdGRmwIsDt2","Montessori's classic on how young children effortlessly soak up language, movement and culture from their surroundings.","Look at your learning space: is it calm, reachable and orderly?"),
 BK("From Childhood to Adolescence","Maria Montessori","monte",["monte"],"1Y2L6nzE85L2ibhOiz0i04kPksuZJcKDw","Montessori's thinking on the older child: big questions, imagination and the wider world.","Let your 7-year-old choose one big 'why' question to explore this week."),
 BK("Maria Montessori: Her Life and Work","E. M. Standing","monte",["monte"],"1YsYDPRvAYHeQstDeI11ignZAR3GrFP3x","A biography that explains the method through Montessori's life and discoveries.","Read a chapter on a slow evening for inspiration."),
 BK("Montessori: A Modern Approach","Paula Polk Lillard","monte",["monte"],"141M05yWC7cDwepNnSsmB3CC_HeUsmnyq","A clear overview of Montessori principles and why they still matter.","Pick one principle (freedom within limits) to practise this week."),
 BK("Montessori: The Science Behind the Genius","Angeline Stoll Lillard","monte",["monte","teach"],"1H9Z3-fi_g9kOBGD6G7jxJD-kzuaq01SK","Links Montessori practices to modern research on how children learn.","Notice how movement helps learning during lessons."),
 BK("The Montessori Toddler","Simone Davies","monte",["monte","baby"],["1fNBbBtAo6nZvukscHR_a2ejISOq9jZRn","1Bdpo10OFWmG4-1TnwClvMzcXQVebdVEr"],"Practical, beautiful guidance for raising a curious, responsible toddler at home.","Set up one low shelf with three activities your little one can reach alone."),
 BK("How to Raise an Amazing Child the Montessori Way","Tim Seldin","monte",["monte","baby"],"1A056tr69Dx7kT13pBhgVMRm31Iq4A6Oy","A visual, parent-friendly guide to Montessori at home from birth to six.","Try one practical-life activity: pouring, sorting or wiping a table."),
 BK("Teach Me to Do It Myself","Maja Pitamic","monte",["monte"],"1fmzWnhDKtjxsGR5KBuKHflDO7tGI7WSM","Step-by-step Montessori activities you can set up with everyday things.","Use one as the hands-on activity on a tired day."),
 BK("Montessori at Home!","John Bowman","monte",["monte","teach"],"108d9dTEoMhQw_2kXoM3irtG1KHHeFmEi","A large collection of Montessori early-learning activities for home.","Borrow a language activity to pair with this week's sounds."),
 BK("Bringing the Montessori Approach to Your Early Years Practice","Barbara Isaacs","monte",["monte"],["1GgsesTwAc1q1Cw26EP4sq6lkE6PkZN4Z","1oCuieo4N7uhobtNmkmOm5gi7NwqcWDm-","1ZK2EsiS1-1JQWZg40q2phyTUZuEbnuwa"],"A practitioner's guide to the Montessori approach in early years settings. You have three copies; the 2nd edition is the first link.","Skim the chapter on the prepared environment."),
 BK("Understanding the Montessori Approach","Barbara Isaacs","monte",["monte"],"1yYoVtWj3PfD54ptUfzdVlcmXwaGLZe54","A short introduction to Montessori theory and practice in early education.","Good first read if Montessori is new to you."),
 BK("Montessori and Early Childhood","Susan Feez","monte",["monte"],"1TnQuQDUT5fLjVQ7R_8ex1gV4JRPcrBcC","A student guide explaining Montessori's ideas and materials for the early years.","Use as a reference when choosing materials."),
 BK("Montessori for the New Millennium","Roland A. Lubienski Wentworth","monte",["monte"],"1cmaXfrAmwUhExvn6ULzcflgoJWHIOTHb","Practical guidance rooted in Montessori's original principles, for children of all ages.","Read when you want the 'why' behind the method."),
 BK("Good Inside","Becky Kennedy","calm",["disc","emotions"],"1HcvOHyZ5LA3dz3CsjZjIB3WrQCGU90-L","Kids are good inside even when behaviour is hard. Be a sturdy, connected leader, and repair after you mess up.","After a hard moment, try a repair: 'I yelled. That wasn't okay. I'm working on it.'"),
 BK("How to Talk So Kids Will Listen and Listen So Kids Will Talk","Adele Faber and Elaine Mazlish","calm",["disc","emotions"],"1C7_L7hE1Aziu18bfLuAR-4lTWs5b2SrT","Simple, tested phrases for acknowledging feelings and getting cooperation without nagging.","Describe instead of command: 'I see shoes on the stairs.'"),
 BK("No-Drama Discipline","Daniel J. Siegel and Tina Payne Bryson","calm",["disc","emotions"],"1_G5kDcg7nWyHUyxHO6vg3JvonIeVG0z8","Discipline as teaching: connect first, then redirect once the child is calm.","Connect, then correct, during the next lesson meltdown."),
 BK("Peaceful Parent, Happy Kids","Laura Markham","calm",["disc","emotions","burned"],"1qHKPo8IVhaDagBwt0XWcP4MJqtaoQ_-Q","Stop yelling by regulating yourself first, staying connected and coaching rather than controlling.","Take three breaths before responding to tears."),
 BK("No Bad Kids","Janet Lansbury","calm",["disc","baby"],["1YF57RXz4XseIQoVXbAQCh_MeT2rdSEuD","1gHDxPwLulgWJoy6pW5fAyhML4DpZX2EP"],"Calm, respectful toddler discipline without shame: confident limits and acceptance of feelings.","Hold a limit calmly, and let the feelings about it be okay."),
 BK("1-2-3 Magic","Thomas W. Phelan","calm",["disc"],"1CRHV9kworX8ZsrQ7vREN9zWwFSSom51x","A simple counting system for stopping unwanted behaviour without arguing, plus ways to encourage good behaviour.","Use few words when a limit is broken."),
 BK("Don't Make Me Count to Three (preview)","Ginger Hubbard","calm",["disc"],"1vjqyHsNJuxUz5SIrTXxkoUXaaC6a0ije","A Christian approach to discipline that focuses on a child's heart, not just behaviour. Your file is a preview.","Pair a correction with a short, gentle Bible verse."),
 BK("The Explosive Child","Ross W. Greene","calm",["disc","emotions"],"1wDV75-L6EPXm52RuWFZAnksFHUqbRjIm","Kids do well if they can. Meltdowns come from lagging skills, and you solve problems with the child, not to them.","Ask before a hard moment: 'I've noticed… What's up?'"),
 BK("Raising Human Beings","Ross W. Greene","calm",["disc"],"1j5eWcXIthfhMtwtIuAoYHUP9vFBlC0_g","Collaborative problem-solving for everyday parenting, building a partnership with your child.","Solve one recurring battle (like starting class) together."),
 BK("Parenting with Presence","Susan Stiffelman","calm",["emotions","burned"],"1uRNb5yK3Kt-kAWTBcKEx18rUF6Pur05c","Mindful practices that turn everyday parenting struggles into chances to grow.","Notice what a meltdown stirs up in you before responding."),
 BK("The 5 Love Languages of Children","Gary Chapman and Ross Campbell","calm",["emotions"],"1bYAXz3v-xYIcmRmgKlE2aafVxP4ZuyH2","Each child feels loved most through touch, words, time, gifts or acts of service.","Guess each child's love language and use it at the end of class."),
 BK("The Opposite of Spoiled","Ron Lieber","calm",["money"],"1Jpw4zBQSw_e-o3HMtjjdck6LMJ0BIGOl","Using conversations about money to raise generous, patient and grounded kids.","Add a counting-coins game to a math morning."),
 BK("The Whole-Brain Child","Daniel J. Siegel and Tina Payne Bryson","brain",["emotions"],"1lTNIx7W2WV9baP8PyXqsO00k0GboL_wa","Twelve strategies that help children's thinking brain and feeling brain work together.","Try 'name it to tame it': tell the story of a hard moment together."),
 BK("Raising a Secure Child","Kent Hoffman, Glen Cooper and Bert Powell","brain",["emotions"],"1_6EJSJvS5EvVLkAiqPkoN2LtdSGyT40B","The Circle of Security: being a secure base for exploring and a safe haven to return to.","Be the safe haven when a lesson gets too hard."),
 BK("Raising Cain","Dan Kindlon and Michael Thompson","brain",["emotions"],["1gLMSB1nuLDmFzkPKBW62qz5m_fGCzG0H","1gNdUYZ9iIcddCgmS_O2h9n2QjW6yMz7p"],"Protecting the emotional lives of boys. The second link is a short seven-points summary.","Give your son words for his feelings, not just 'mad'."),
 BK("How Children Thrive","(author not in file name)","brain",["emotions","teach"],"1oNrn_Ks-7kTp272J4qVZ9Wg7NLEF7z_1","Practical science on raising independent, resilient and happy kids.","Let your child do one thing themselves that you usually do for them."),
 BK("The Everything Parent's Guide to Emotional Intelligence in Children","Korrel Kanoy","brain",["emotions"],"1-ThSj2ZR4y_IyP4fMObZiyiCxQjnP6aM","Raising caring, resilient, emotionally strong children through everyday coaching.","Use the feelings poster in Printables at the pause screen."),
 BK("The Tapping Solution for Parents, Children and Teenagers","Nick Ortner","brain",["emotions","burned"],"1GTlPnr5wbsjzLhIYggInTCQtqVX9z4rJ","Tapping (EFT) techniques for easing stress and worry in parents and kids.","Try it yourself on a tired morning before class."),
 BK("The Wonder Weeks","Hetty van de Rijt and Frans Plooij","little",["baby"],"19bgvHUmJA0Ka6hRSnpCtEvKBJz_jyxyX","Explains predictable fussy phases in a baby's first 20 months as developmental leaps.","Fussy week? Lower expectations and keep things cosy."),
 BK("The Happiest Baby / The Happiest Toddler on the Block","Harvey Karp","little",["baby","disc"],"166e0JufuP4uA-BHM7VbjzIoyaIjn2cTu","Calming techniques for newborns and simple communication tricks for toddlers.","Try the toddler 'Fast-Food Rule': repeat their feelings before your answer."),
 BK("Handbook of Parenting, Vol. 1","Marc H. Bornstein (editor)","ref",["teach"],"1-SKzoTnIw3oNBywFHGS5W0DoqU5YYbAL","An academic reference on children and parenting research.","Dip in when you want the research behind a question."),
 BK("Why Are We Yelling?","Buster Benson","self",["emotions","habits"],"1gRPFHvmMAYlenBC_JihyweagsBH_dtzS","How to have productive disagreements instead of arguments.","Use it for co-parenting talks about the homeschool plan.","you"),
 BK("Poisonous Parenting","Shea M. Dunham, Shannon B. Dermer and Jon Carlson (editors)","self",["healing"],"1AyJOufG1v_AmZiPJloNHxkEpe9u7FEYJ","On toxic patterns between parents and their adult children, and how to recognise and heal them.","Read gently; pair it with support if it brings things up.","you")
);

const CALM_FILES = [
  {id:"1IH0VkI0Pt5ut-bl6YU3F7lqbOriCltds", t:"Self-Regulation Toolkit for Moms", who:"you", note:"Shortcut. If it won't open, the original file needs sharing too."},
  {id:"1-aAFX77XF9Soc-dbxtIhY5bjBB2iAreW", t:"26 phrases to calm your angry child", who:"you"},
  {id:"1Ejb1gZlPVpw7v1QInpWWgS9nGOEy0wqe", t:"Calm-down choices board", who:"kids"},
  {id:"1ESYR6IS7MaMKPQZQJyMeWcfHP7MvwmcD", t:"Feelings and calming techniques poster", who:"kids"},
  {id:"1WM9tgHfteqQJJ5efMIkReSxUDTwMBxkE", t:"FB_IMG_…768.jpg", who:"label"},
  {id:"1WLNonRejV5hOaG1GlH-YGfn-YOaF4duC", t:"FB_IMG_…734.jpg", who:"label"},
  {id:"1WNggDGQ9DMD84wF-MKMLBAIE8rBfV4yB", t:"FB_IMG_…129.jpg", who:"label"},
  {id:"1WJaRbBSxQYyyxbK9JLrVyuBuSjUeI5Sp", t:"FB_IMG_…376.jpg", who:"label"},
  {id:"1WIjR_SFj1dADVOQnYglWr7GTdNviY3dN", t:"FB_IMG_…172.jpg", who:"label"}
];
const BREATHS = {
  flower:{t:"Flower and candle", steps:["Smell the flower… (breathe in)","Blow out the candle… (breathe out)"]},
  bubble:{t:"Bubble breath", steps:["Breathe in slowly through your nose…","Blow a big, slow bubble… (breathe out)"]},
  star:{t:"Starfish hand", steps:["Trace up your finger… (breathe in)","Trace down your finger… (breathe out)"]},
  box:{t:"Box breathing (for you)", steps:["Breathe in… 2… 3… 4","Hold… 2… 3… 4","Breathe out… 2… 3… 4","Hold… 2… 3… 4"]}
};
const FEELINGS = [
  ["Happy","You're feeling happy! Let's notice where we feel it in our body.",["Share what made you happy","Give a big hug"]],
  ["Sad","It's okay to feel sad. I'm right here with you.",["Cuddle with a blanket","Draw how you feel"]],
  ["Angry","You're really angry. That's okay. Hitting isn't, so let's get the mad out safely.",["Squeeze a pillow hard","Stomp like a dinosaur 10 times"]],
  ["Scared","That felt scary. You're safe, and I'm here.",["Hold my hand and breathe slowly","Name 3 things you can see"]],
  ["Frustrated","This is hard, and you want to get it right. Let's take a break and try again.",["Bubble breaths, 3 times","Try the easier part first"]],
  ["Worried","Worried thoughts feel big. Let's make them smaller together.",["Tell me the worry, then 'put it in a box'","Starfish hand breathing"]],
  ["Tired","Your body needs rest. That's not a problem.",["Lie down and listen to quiet music","Have water and a snack"]],
  ["Silly","Lots of wiggly energy! Let's use it up.",["Jump 10 times, then freeze","Shake it out from toes to nose"]]
];
const MOM_RESETS = [
  ["Pause before you speak","Hand on your chest, one slow breath, then lower your voice instead of raising it."],
  ["Say it to yourself","\"This is a hard moment, not a bad child or a bad mom.\""],
  ["Step away safely","If the kids are safe, it's okay to say \"Mommy needs one minute to calm down\" and step into the next room."],
  ["Repair afterwards","\"I yelled earlier. That wasn't okay. I'm sorry, and I'm working on it.\" Repair teaches more than perfection."],
  ["Lower the bar today","Switch to a Minimum day. Morning Time and a story still count."]
];
let breathT=null;
function calmHtml(){
  const sub=state.calmSub||"kids", br=state.breath||"flower";
  const files=w=>CALM_FILES.filter(f=>f.who===w);
  const fileCard=f=>{ const lab=state.labels[f.id]; return `<div class="pcard"><a href="${DRIVE(f.id)}" target="_blank" rel="noopener"><b>${esc(lab?lab.t:f.t)}</b></a>${f.note?`<div class="tags"><span>${esc(f.note)}</span></div>`:""}${f.who==="label"&&!lab?`<div class="lab"><input type="text" placeholder="Name it" data-cname="${f.id}" aria-label="Name for ${esc(f.t)}"><span></span><button class="btn alt" data-csave="${f.id}">Save</button></div>`:""}</div>`; };
  let h=`<section class="box calmhero"><h2>Calm corner</h2><p class="muted" style="margin:0 0 10px">For big feelings, theirs and yours. Nothing here is a lesson. It's a soft place to land.</p>
    <div class="modes" role="group" aria-label="Who is this for"><button data-csub="kids" aria-pressed="${sub==="kids"}">For the kids</button><button data-csub="you" aria-pressed="${sub==="you"}">For you</button></div></section>
  <section class="box"><h2>Breathe together</h2>
    <div class="filters" style="margin:0 0 6px">${Object.entries(BREATHS).filter(([k])=>sub==="you"||k!=="box").map(([k,b])=>`<button data-breath="${k}" aria-pressed="${br===k}">${b.t}</button>`).join("")}</div>
    <div class="calm big2" id="bcirc"><span id="btxt">Tap start</span></div>
    <div style="display:flex;gap:8px"><button class="btn" style="flex:1" id="bgo">${breathT?"Stop":"Start"}</button></div></section>`;
  if (sub==="kids"){
    h+=`<section class="box"><h2>How are you feeling?</h2><p class="muted" style="margin:0 0 8px">Let your child tap a feeling. Read the words to them.</p>
      <div class="feel">${FEELINGS.map(([f],i)=>`<button data-feel="${i}" aria-pressed="${state.feel===i}">${f}</button>`).join("")}</div>
      ${state.feel!=null?`<div class="idea" style="font-size:1.1rem">${esc(FEELINGS[state.feel][1])}<ul class="mat" style="font-size:1rem">${FEELINGS[state.feel][2].map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}</section>
    <section class="box"><h2>Set up a calm corner</h2><ol class="mat"><li>A soft spot: cushion, blanket or small tent.</li><li>The calm-down choices board at their eye level.</li><li>Two or three calming things: a squishy ball, a picture book, a glitter jar.</li><li>It's a place to feel better, never a punishment.</li></ol></section>
    <section class="box"><h2>Printables for the corner</h2><div class="plist">${files("kids").map(fileCard).join("")}</div></section>`;
  } else {
    h+=`<section class="box"><h2>When you're about to lose it</h2>${MOM_RESETS.map(([a,b])=>`<div class="dayrow" style="display:block"><b>${a}</b><br><span class="muted">${esc(b)}</span></div>`).join("")}
      <button class="btn alt wide" id="calmCoach" style="margin-top:10px">Talk it through with the coach</button></section>
    <section class="box"><h2>Your calming strategies folder</h2><div class="plist">${files("you").map(fileCard).join("")}</div>
      <h3>Images to label</h3><p class="muted" style="margin:0 0 6px">I couldn't read these. Open one and give it a name.</p><div class="plist">${files("label").map(fileCard).join("")}</div></section>
    <section class="box"><h2>Books for hard days</h2><p class="muted" style="margin:0 0 8px">From your Library: calm discipline and emotions.</p>
      <div class="pchips">${BOOKS.filter(b=>b.tags.includes("emotions")||b.tags.includes("disc")).slice(0,10).map(b=>`<button class="pchip" data-book="${esc(b.t)}">${esc(b.t)}<small>${esc(b.a)}</small></button>`).join("")}</div></section>`;
  }
  return h;
}
function stopBreath(){ clearInterval(breathT); breathT=null; }
function bindCalm(){
  bindView();
  document.querySelectorAll("[data-csub]").forEach(b=>b.onclick=()=>{ stopBreath(); state.calmSub=b.dataset.csub; if(state.calmSub==="kids"&&state.breath==="box") state.breath="flower"; render(); });
  document.querySelectorAll("[data-breath]").forEach(b=>b.onclick=()=>{ stopBreath(); state.breath=b.dataset.breath; render(); });
  document.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>{ state.feel=+b.dataset.feel; render(); say(FEELINGS[state.feel][1],.9); });
  $("bgo").onclick=()=>{
    if (breathT){ stopBreath(); $("bgo").textContent="Start"; $("btxt").textContent="Tap start"; $("bcirc").classList.remove("on"); return; }
    const steps=BREATHS[state.breath||"flower"].steps; let i=0;
    const tick=()=>{ const s=steps[i%steps.length]; $("btxt").textContent=s; const c=$("bcirc"); c.classList.toggle("grow", /in|up/i.test(s) && !/Hold/.test(s)); i++; };
    $("bcirc").classList.add("on"); tick(); breathT=setInterval(()=>{ if(!$("bcirc")) return stopBreath(); tick(); },4000); $("bgo").textContent="Stop";
  };
  if ($("calmCoach")) $("calmCoach").onclick=()=>openCoach("I'm about to lose my temper with my kids and I want to stay calm. Can you help me right now?");
  document.querySelectorAll("[data-book]").forEach(b=>b.onclick=()=>{ state.view="library"; state.shelf="parent"; state.ltag=""; render(); });
  document.querySelectorAll("[data-csave]").forEach(b=>b.onclick=()=>{ const id=b.dataset.csave, t=document.querySelector(`[data-cname="${id}"]`).value.trim(); if(!t) return; state.labels[id]={t}; save(); render(); });
}

const AFFIRM = {
  faith:["God chose me to be their mother. I don't have to be perfect to be the right one.","His mercies are new this morning, and so is my patience.","I can do the next small thing, with God's help, right now.","I will not carry tomorrow's worries today. Today has enough grace for today.","My home doesn't need to be impressive to be holy.","When I feel empty, I can pour from a cup God keeps filling."],
  joy:["The world calls motherhood a burden. I get to see its beauty up close.","These are the days they'll remember as home.","Sticky hands and loud mornings are signs of a full life.","I am raising people, not finishing a checklist.","One laugh at the kitchen table counts as a good day.","Their childhood is happening right now, and I'm in it."],
  enough:["I am enough for today. My children don't need more of a mom, just more of me present.","A short lesson done gently is better than a long one done in tears.","I'm not behind. We're on our own path.","Rest is not quitting. It's part of the plan.","I can let the laundry wait. My child can't.","Comparing my homeschool to someone else's highlight reel steals my peace."],
  patience:["I am the calm my child borrows when they don't have their own.","Big feelings are not bad behavior. I can stay steady.","I can pause before I answer. One breath changes everything.","When I mess up, I repair. That's the lesson they'll remember.","My child is having a hard time, not giving me a hard time.","I lower my voice and get down to their eye level."],
  growth:["Small habits, repeated every day, are quietly changing our family.","I'm allowed to outgrow old patterns from my own childhood.","Discipline for me means doing what I said I'd do, gently.","I don't need to wait to feel ready. I can start small today.","Every hard season is teaching me something I'll need later.","I'm becoming the mom I want to be, one choice at a time."],
  rest:["I can sit down. The house will still be here.","Saying no to one more thing is saying yes to my family.","A tired mom deserves kindness, especially from herself.","Water, a walk and five quiet minutes are not luxuries.","I can ask for help without apologizing.","Tonight I will rest without earning it."]
};
const AFF_THEMES = {faith:"Faith", joy:"Joy in motherhood", enough:"You are enough", patience:"Patience", growth:"Growth", rest:"Rest"};
const DAY_REMINDERS = [
  ["Morning","Before the day starts","Read today's affirmation out loud once, then start Morning Time. Phone stays in the other room."],
  ["Midday","When energy dips","Drink a glass of water. Name one thing that went right this morning, even if it was small."],
  ["Hard moment","When you feel yourself rising","Hand on your chest, one slow breath: \"They're having a hard time, not giving me one.\""],
  ["Evening","After the kids sleep","Write one sentence: something you're grateful for, and one way you showed up today."]
];
const MOM_IMAGES = ["1iSP32Dgz3eY3QEp2JgGEqPgQdZTJRf56","1iDlutc4ufC1C3XhhW3gfhNlpC4dGj39y","1iBB4T8HcqKEDsShi6_-5mJpqPuYZMlKb","1i-QXBgb2s6Khyz5zsi5qUQIwq8G2lkjT","1iIssSua3ythadVezDCs_lWzjtJuBrGN4","1i4ooiuIj7-S5gj3HKWvJp6pgDuJVU2BQ","1iK26C-hl4lCtsbDtEht0Pb6YkpO0RgU0","1i6_IDT2evVM8Ur6J3mnT938bI0j-fo7W","1iGVSIzAEbp8d-CIGH0J9QEf7nOcNor6e","1hmoGmuJ35YQ3Xmwr98sKVW0FdT8VrupF","1iFtjInENRUB_pPsfhjyLqCZvoivWXDLt","1iSXjiIwYh0s_Xz_kbWFOUFqr_U6BFfYV","1iKvuRAeScglYrRxmSvr0Uy3IPyEkcHS2","1iK-7dGlm5HRItSS0gGTNbazoW4R5fgRz","1iAux90pnuUDbYeUX442gkPnwTjfOC3b3","1hj_2d5q7mh0azkkYwjAusr2Psnx74aCB","1i-sldFyNe8i5XSOL6HelzWbmXXxBdGuO","1hnOnnmuamJVmOk61XhE5OMO6A2u13IWy","1hm6WPsgdzrk_UG4mUweEPFOSODpp0PMn","1i9dypSiAUv-22dk1U2BjL0DL8orRLc8u","1hlMYJH85FGANlP-yStMp6nAxCh7rgMlc","1htGD3mJ2iNkENZvRzbALWECW1pNS4Ql_","1iPGez_7iVKe0Bj7ss5J4cQkSyocwzrvM","1hohmLhAcpOaPHNLA38iVPqM9I0tlRuCA","1iU50ESh0xLW1ajzQqoNZ6saPC28VoT7c","1i08f6VSZIBExha1C0-fM6-uSGsZjfeLN","1i8z3ouWGKyUyj4ucAryodIEPV_Bi0Js8","1hqfbbRzyaFxAjvbFy6ohBELDsVjkbAFD","1i6hv30rnimggxOCjw43vQrZdGJ6cRVTb","1iD-v-1zr5KZ6j_phVXBWPBlaoXrHeEO8","1iGKuF_nSQ1osLegYJPILF30te_8eOJHW","1iU00ds-82gH6cd_oDh9qp1s_xIjUoFZM","1i5ay-m_2bMDP6DqvJQWawD2svf7yD1yd","1hy17K7YRnu3C2SNYG6XWi9Rd1BuwJ9G1","1hkENykxtR3xMwkesph-3DyStggAqqXa1","1i0JTUOGEuD04VRqCBoA1keTn9j9KaDWv","1hqkSZc2jLg_plReFkzjsprrssSG0ulNx","1iB-K9dwdq-AMO0uEOh0pAPkGErJEFbAY","1hv9Dq5PV_4BAWg8ZwEr-A9iHXfr_Mauv","1hmjcHXW6WORneERE6gej_Wx8uw3KBEMD","1iLmlLfqMd3vSIFQS-EK7brk0PmsxaoLL","1hwITVHqIAXngmBxP38rpG_00tpMBz9Jo","1iPRAdL9wUBljeuyq87s9cqUe0KvUUcd4","1iA1oD7BS3hFEmzFyKHiPLARmHhIvsAAs","1iKn7-J_mIho3bnTH1hAAORVN4xi2O-5C"];
MOM_IMAGES.length = 44;
function affList(){ const th=state.affTheme||"all"; const own=(state.myAff||[]).map(t=>[t,"mine"]);
  const base=Object.entries(AFFIRM).flatMap(([k,v])=>v.map(t=>[t,k]));
  return th==="all"?[...base,...own] : th==="mine"?own : th==="fav"?[...base,...own].filter(([t])=>(state.favAff||[]).includes(t)) : base.filter(([,k])=>k===th); }
function momHtml(){
  const list=affList(), th=state.affTheme||"all";
  const day=Math.floor(Date.now()/864e5);
  const idx=list.length? ((state.affIdx==null?day:state.affIdx)%list.length+list.length)%list.length : 0;
  const cur=list[idx]; const fav=cur && (state.favAff||[]).includes(cur[0]);
  return `<section class="box momhero"><p class="muted" style="margin:0">For you, Mom</p>
    ${cur?`<p class="affirm">${esc(cur[0])}</p><p class="muted" style="margin:0 0 12px">${cur[1]==="mine"?"Written by you":AFF_THEMES[cur[1]]}</p>`:`<p class="affirm">Nothing here yet.</p>`}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn alt" id="affPrev" aria-label="Previous affirmation">Back</button><button class="btn" id="affNext" style="flex:1">Another one</button><button class="btn alt" id="affFav" aria-pressed="${!!fav}">${fav?"Saved ♥":"Save ♡"}</button><button class="btn alt" id="affSay">Read aloud</button></div>
    <div class="filters">${[["all","All"],...Object.entries(AFF_THEMES),["fav","My favorites"],["mine","Written by me"]].map(([k,l])=>`<button data-th="${k}" aria-pressed="${th===k}">${l}</button>`).join("")}</div></section>
  <section class="box"><h2>Reminders through the day</h2><p class="muted" style="margin:0 0 6px">Four tiny check-ins. Ask Claude in chat to put them on your phone at the times that suit you.</p>
    ${DAY_REMINDERS.map(([a,b,c])=>`<div class="dayrow" style="display:block"><b>${a}</b> <span class="muted">· ${b}</span><br>${esc(c)}</div>`).join("")}</section>
  <section class="box"><h2>Write your own</h2><p class="muted" style="margin:0 0 6px">The words you most need to hear, in your own voice.</p>
    <textarea id="myAff" placeholder="e.g. I'm the mom my kids need, even on the messy days."></textarea><button class="btn alt wide" id="addAff" style="margin-top:8px">Add to my affirmations</button>
    ${(state.myAff||[]).length?`<ul class="mat">${state.myAff.map((t,i)=>`<li>${esc(t)} <button class="linkbtn" data-delaff="${i}">remove</button></li>`).join("")}</ul>`:""}</section>
  <section class="box"><h2>Your saved reminders</h2><p class="muted" style="margin:0 0 8px">The ${MOM_IMAGES.length} quote images and screenshots from your folder. Open one when you need it, and give it a name so you can find it again.</p>
    <a class="btn alt" href="https://drive.google.com/drive/folders/1hjJFz7jflrXUJxwdjRSv7rcX1tvFmCgP" target="_blank" rel="noopener">Open the whole folder</a>
    <div class="imggrid">${MOM_IMAGES.map((id,i)=>{ const lab=state.labels[id]; return `<a href="${DRIVE(id)}" target="_blank" rel="noopener" class="imgtile">${lab?esc(lab.t):`Reminder ${i+1}`}</a>`; }).join("")}</div></section>`;
}
function bindMom(){
  bindView();
  const step=d=>{ const l=affList(); const day=Math.floor(Date.now()/864e5); state.affIdx=((state.affIdx==null?day:state.affIdx)+d); render(); };
  $("affNext").onclick=()=>step(1); $("affPrev").onclick=()=>step(-1);
  const l=affList(), day=Math.floor(Date.now()/864e5), i=l.length?(((state.affIdx==null?day:state.affIdx)%l.length)+l.length)%l.length:0, cur=l[i];
  $("affFav").onclick=()=>{ if(!cur) return; const f=state.favAff=state.favAff||[]; const k=f.indexOf(cur[0]); if(k<0) f.push(cur[0]); else f.splice(k,1); save(); render(); };
  $("affSay").onclick=()=>{ if(cur) say(cur[0],.85); };
  document.querySelectorAll("[data-th]").forEach(b=>b.onclick=()=>{ state.affTheme=b.dataset.th; state.affIdx=0; save(); render(); });
  $("addAff").onclick=()=>{ const t=$("myAff").value.trim(); if(!t) return; (state.myAff=state.myAff||[]).push(t.slice(0,240)); state.affTheme="mine"; state.affIdx=state.myAff.length-1; save(); render(); };
  document.querySelectorAll("[data-delaff]").forEach(b=>b.onclick=()=>{ state.myAff.splice(+b.dataset.delaff,1); save(); render(); });
}

for (const k in TRACKS) { const t=TRACKS[k]; t.weeks=[]; t.units.forEach(([u,ws])=>ws.forEach(w=>t.weeks.push({...w,unit:u}))); }
const AGES = {phonics:4, spelling:7};

let state = {tab:"phonics", mode:"full", muted:false, videos:{}, names:{phonics:"Little one", spelling:"Big kid"},
  prayer:DEFAULT_PRAYER, basket:{phonics:[], spelling:[]}, intro:true, view:"today", stories:{}, log:[], errors:[], placed:{phonics:false, spelling:false}, bugs:{cur:0,d:{},n:{}}, labels:{}, shelf:"parent", pf:"all", pq:"",
  phonics:{cur:0,d:{},n:{}}, spelling:{cur:0,d:{},n:{}}};
let saveFn=null, saveTimer=null, assets=null, sampleFn=null;
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const IC = {
  prayer:'<path d="M12 10v10M9 20h6M12 3c2 2 2 4 0 5-2-1-2-3 0-5z"/>',
  hello:'<path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
  lesson:'<path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/>',
  break:'<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l8-8"/>',
  stem:'<path d="M9 3h6M10 3v6l-5 10h14l-5-10V3"/>',
  bye:'<path d="M20 14A8 8 0 1110 4a6 6 0 0010 10z"/>',
  story:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'
};
IC.bye2 = IC.hello;
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[k]||IC.hello}</svg>`;

const STAMPS = {
  leaf:['Leaf','<path d="M10 38C10 20 22 8 40 8c0 18-12 30-30 30z" fill="#8A9A74"/><path d="M10 38L28 20" stroke="#5E6B4E" stroke-width="2"/>'],
  stone:['Stone','<ellipse cx="24" cy="28" rx="17" ry="11" fill="#A9A095"/><ellipse cx="19" cy="24" rx="5" ry="2.5" fill="#C2BBB1"/>'],
  acorn:['Acorn','<path d="M14 20h20c0 12-5 20-10 22-5-2-10-10-10-22z" fill="#B89B74"/><path d="M11 20c0-6 6-9 13-9s13 3 13 9z" fill="#7D654A"/><path d="M24 11V6" stroke="#7D654A" stroke-width="2.5" stroke-linecap="round"/>'],
  flower:['Flower','<g fill="#AFC0CA"><circle cx="24" cy="13" r="7"/><circle cx="34" cy="21" r="7"/><circle cx="30" cy="33" r="7"/><circle cx="18" cy="33" r="7"/><circle cx="14" cy="21" r="7"/></g><circle cx="24" cy="24" r="5" fill="#C9A66B"/>'],
  sun:['Sun','<circle cx="24" cy="24" r="9" fill="#D3B57E"/><g stroke="#C29E62" stroke-width="2.5" stroke-linecap="round"><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M11 37l3.5-3.5M33.5 14.5L37 11"/></g>'],
  moon:['Moon','<path d="M32 36A15 15 0 1118 9a12 12 0 0014 27z" fill="#8FA2AE"/>']
};
const stampSvg = k => `<svg viewBox="0 0 48 48" aria-hidden="true">${STAMPS[k][1]}</svg>`;

/* ---------- helpers ---------- */
const T = () => TRACKS[state.tab];
const S = () => state[state.tab];
const daysFor = i => S().d[i] || [0,0,0,0,0];
const doneCount = k => TRACKS[k].weeks.filter((_,i)=>(state[k].d[i]||[]).filter(Boolean).length===5).length;
const todayIdx = () => { const d=daysFor(S().cur); const j=d.findIndex(x=>!x); return j; };
const nm = () => state.names[state.tab] || "friend";
function agenda(){
  const L = state.tab==="phonics";
  const MT=[{k:"prayer",t:"Morning Time: prayer",m:1},{k:"hello",t:"Morning Time: hello song",m:state.mode==="full"?2:1}];
  if (state.mode==="minimum") return [...MT,{k:"story",t:"Story time",m:5},{k:"bye",t:"Goodbye song",m:2}];
  if (state.mode==="tired") return [...MT,{k:"lesson",t:"Lesson",m:5},{k:"story",t:"Story time",m:3},{k:"bye",t:"Goodbye song",m:2}];
  return [...MT,{k:"lesson",t:"Lesson",m:L?10:15},{k:"break",t:"Movement break",m:5},{k:"stem",t:"Hands-on activity",m:L?10:15},{k:"story",t:"Story time",m:5},{k:"bye",t:"Goodbye song",m:2}];
}
function say(text, rate=.9){ if(state.muted) return; try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=rate; speechSynthesis.speak(u);}catch(e){} }
function chime(){ try{ const a=new (window.AudioContext||window.webkitAudioContext)(); [523,659].forEach((f,i)=>{ const o=a.createOscillator(), g=a.createGain(); o.frequency.value=f; o.type="sine"; g.gain.setValueAtTime(.0001,a.currentTime+i*.35); g.gain.exponentialRampToValueAtTime(.2,a.currentTime+i*.35+.05); g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+i*.35+1.2); o.connect(g).connect(a.destination); o.start(a.currentTime+i*.35); o.stop(a.currentTime+i*.35+1.3); }); }catch(e){} }

/* ---------- stories ---------- */
const skey = (tab=state.tab, wi=S().cur) => `${tab}-${wi}`;
function storyFor(tab=state.tab, wi=state[tab].cur, which){
  const own=state.stories[skey(tab,wi)], b=STORIES[tab][wi]||["Story",""];
  if (which==="book" || !own) return {title:b[0], text:b[1], own:false};
  return {...own, own:true};
}
function storyHtml(st, w){
  const keys=new Set([...(w.w||[]).flatMap(x=>x.toLowerCase().split(/[\/-]/)), ...(w.h||[]).map(x=>x.toLowerCase())]);
  return esc(st.text).split(/(\s+)/).map(tok=>{
    if (/^\s+$/.test(tok)) return tok;
    const core=tok.toLowerCase().replace(/[^a-z']/g,"");
    if (!core) return tok;
    return `<span class="sw${keys.has(core)?" key":""}" data-w="${core}">${tok}</span>`;
  }).join("");
}

/* ---------- main page ---------- */
function render(){
  const t=T(), s=S(), wi=s.cur, w=t.weeks[wi], day=todayIdx(), total=t.weeks.length, done=doneCount(state.tab);
  const ag=agenda(), mins=ag.reduce((a,b)=>a+b.m,0);
  const d=daysFor(wi);
  const bask=state.basket[state.tab]||[];
  let h=`<h1>Reading Path</h1><p class="sub">One calm class a day. Short, the same every time, and always ends on a good note.</p>
  <nav class="mainnav" aria-label="Sections">${[["today","Today"],["mom","For Mom"],["calm","Calm"],["bugs","Bug Lab"],["print","Printables"],["library","Library"],["dash","Dashboard"]].map(([k,l])=>`<button data-view="${k}" aria-pressed="${(state.view||"today")===k}">${l}</button>`).join("")}</nav>`;
  if (state.view==="dash"){ $("app").innerHTML=h+dashHtml(); bindDash(); return; }
  if (typeof stopBreath==="function" && state.view!=="calm") stopBreath();
  if (state.view==="mom"){ $("app").innerHTML=h+momHtml(); bindMom(); return; }
  if (state.view==="calm"){ $("app").innerHTML=h+calmHtml(); bindCalm(); return; }
  if (state.view==="bugs"){ $("app").innerHTML=h+bugsHtml(); bindBugs(); return; }
  if (state.view==="print"){ $("app").innerHTML=h+printHtml(); bindPrint(); return; }
  if (state.view==="library"){ $("app").innerHTML=h+libHtml(); bindLib(); return; }
  h+=`<div class="tabs" role="tablist">${["phonics","spelling"].map(k=>`<button class="tab" role="tab" data-tab="${k}" aria-selected="${state.tab===k}"><b>${esc(state.names[k])}</b><span>${TRACKS[k].who}</span></button>`).join("")}</div>`;

  h+=`<section class="box">`;
  if (day<0){
    h+=`<h2>Week ${wi+1} is complete</h2><p class="muted">Lovely work. Repeat any day that felt hard, or move on when it feels easy.</p>
      <button class="btn wide" id="nextWeek" ${wi===total-1?"disabled":""}>Start week ${wi+2}</button>`;
  } else {
    h+=`<p class="muted" style="margin:0">Week ${wi+1}, day ${day+1}: ${esc(w.t)}</p>
      <h2>Today's class with ${esc(nm())}</h2>
      <p class="enc">${esc(ENCOURAGE[Math.floor(Date.now()/864e5)%ENCOURAGE.length])}</p>
      <div class="modes" role="group" aria-label="Class length">
        <button data-mode="full" aria-pressed="${state.mode==="full"}">Full class</button>
        <button data-mode="tired" aria-pressed="${state.mode==="tired"}">Tired day</button>
        <button data-mode="minimum" aria-pressed="${state.mode==="minimum"}">Minimum day</button>
      </div>
      ${state.mode==="minimum"?`<p class="muted" style="margin:0">Just Morning Time and a story. Today's lesson waits for next time, and showing up still counts.</p>`:""}
      <ul class="agenda">${ag.map(a=>`<li><span class="ico">${icon(a.k)}</span><span class="nm">${a.t}${a.k==="lesson"?`: ${t.days[day][0]}`:a.k==="stem"?`: ${stemFor(state.tab,wi,day).t}`:""}</span><span class="mn">${a.m} min</span></li>`).join("")}</ul>
      <button class="btn wide" id="startClass">Start class (${mins} min)</button>`;
  }
  h+=`<div class="weekdots" style="margin-top:14px">${[1,2,3,4,5].map((x,j)=>`<span><i class="${d[j]?"on":""}"></i>Lesson ${x}</span>`).join("")}</div>
  <p class="muted" style="margin:8px 0 0;font-size:.88rem">No weekdays to keep up with. Just do the next lesson whenever you can.</p></section>`;
  if (!state.placed[state.tab] && !Object.keys(s.d).length) h+=`<section class="box"><h2>Not sure where to start?</h2><p class="muted" style="margin:0 0 10px">A 2-minute starting check finds the right week for ${esc(nm())}, so they don't repeat what they already know.</p><button class="btn alt wide" id="openPlace">Take the starting check</button></section>`;

  if (state.intro) h+=`<section class="box start"><h2>New here? Start small.</h2><ol>
    <li>Pick one time, like right after breakfast, and keep it every day.</li>
    <li>Stop while it's still fun. Short and happy beats long and tearful.</li>
    <li>Missed a day? No catching up. Just press Start and it picks up where you left off.</li></ol>
    <button class="btn alt" id="introOk">Got it</button></section>`;

  h+=`<section class="box"><div class="coachcard"><span class="av"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h6"/></svg></span>
    <div style="flex:1"><h2 style="margin:0">Parent coach</h2><p class="muted" style="margin:0">Tears, refusing, can't focus, or you're running on empty? Ask anything.</p></div></div>
    <button class="btn alt wide" id="openCoach" style="margin-top:12px">Talk to the coach</button></section>`;

  h+=`<section class="box"><h2>${esc(nm())}'s nature basket</h2><p class="muted" style="margin:0">${esc(nm())} picks one stamp at the end of every class. ${bask.length} so far.</p>
    <div class="basket">${bask.length?bask.map(stampSvg).join(""):'<span class="muted">Empty for now. The first one comes after today\'s class.</span>'}</div></section>`;

  h+=`<section class="box"><p class="muted" style="margin:0">Week ${wi+1} of ${total}, ${esc(w.unit)}</p><h2>${esc(w.t)}</h2>
    ${w.s.length?`<div class="sounds">${w.s.map(esc).join("  ")}</div>`:""}
    <div class="chips">${w.w.map(x=>`<button data-say="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    ${w.h?`<p class="muted" style="margin:10px 0 0">${state.tab==="phonics"?"Heart words":"Memory words"}</p><div class="chips h">${w.h.map(x=>`<button data-say="${esc(x)}">${esc(x)}</button>`).join("")}</div>`:""}
    ${w.tip?`<p style="margin:12px 0 4px">${esc(w.tip)}</p>`:""}
    ${weekPrintsHtml(state.tab,wi)}
    <div class="storyline"><span class="ico">${icon("story")}</span><span style="flex:1"><small class="muted">This week's story${state.stories[skey()]?" (your own)":""}</small><br>${esc(storyFor().title)}</span><button class="btn alt" id="editStory">${state.stories[skey()]?"Edit":"Add your own"}</button></div>
    <div style="margin-top:10px">${t.days.map(([a],j)=>`<div class="dayrow"><input type="checkbox" id="d${j}" ${d[j]?"checked":""}><label for="d${j}">Day ${j+1}: ${a}<small>${stemFor(state.tab,wi,j).t}</small></label></div>`).join("")}</div>
    <label class="f" for="note">Notes for this week</label><textarea id="note" placeholder="What clicked, what to repeat…">${esc(s.n[wi]||"")}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px"><button class="btn alt" style="flex:1" id="pw" ${wi===0?"disabled":""}>Previous week</button><button class="btn alt" style="flex:1" id="nw" ${wi===total-1?"disabled":""}>Next week</button></div>
  </section>`;

  h+=`<section class="box"><details><summary>Full year plan (${done} of ${total} weeks done)</summary>`;
  let idx=0;
  for (const [u,ws] of t.units){ h+=`<h3>${esc(u)}</h3><ul class="list">`;
    for (const wk of ws){ const dd=daysFor(idx); h+=`<li><button data-week="${idx}" ${idx===wi?'aria-current="true"':""}><span class="n">Wk ${idx+1}</span><span class="t">${esc(wk.t)}</span><span class="dots">${[0,1,2,3,4].map(j=>`<i class="${dd[j]?"on":""}"></i>`).join("")}</span></button></li>`; idx++; }
    h+=`</ul>`; }
  h+=`</details></section>`;

  h+=`<section class="box"><details><summary>Settings</summary>
    <label class="f" for="n1">Younger child's name</label><input type="text" id="n1" value="${esc(state.names.phonics)}">
    <label class="f" for="n2">Older child's name</label><input type="text" id="n2" value="${esc(state.names.spelling)}">
    <button class="btn alt wide" id="replace" style="margin-top:12px">Retake the starting check for ${esc(nm())}</button>
    <label class="f" for="pr">Opening prayer</label><textarea id="pr">${esc(state.prayer)}</textarea>
  </details></section><p class="status" id="status">${saveFn?"Progress is saved to your account.":"Progress is saved on this device."}</p>`;

  $("app").innerHTML=h;
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{ state.tab=b.dataset.tab; save(); render(); });
  bindView();
  document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{ state.mode=b.dataset.mode; save(); render(); });
  document.querySelectorAll("[data-say]").forEach(b=>b.onclick=()=>say(b.dataset.say.replace("/"," and "),.8));
  document.querySelectorAll("[data-week]").forEach(b=>b.onclick=()=>{ s.cur=+b.dataset.week; save(); render(); window.scrollTo({top:0,behavior:"smooth"}); });
  t.days.forEach((_,j)=>$("d"+j).onchange=e=>{ const a=[...daysFor(wi)]; a[j]=e.target.checked?1:0; s.d[wi]=a; save(); render(); });
  $("note").oninput=e=>{ s.n[wi]=e.target.value; save(); };
  $("pw").onclick=()=>{ s.cur=wi-1; save(); render(); };
  $("nw").onclick=()=>{ s.cur=wi+1; save(); render(); };
  if ($("nextWeek")) $("nextWeek").onclick=()=>{ s.cur=wi+1; save(); render(); };
  if ($("startClass")) $("startClass").onclick=openClass;
  if ($("openPlace")) $("openPlace").onclick=openPlacement;
  if ($("introOk")) $("introOk").onclick=()=>{ state.intro=false; save(); render(); };
  $("openCoach").onclick=()=>openCoach();
  $("editStory").onclick=()=>openStoryEditor();
  $("n1").onchange=e=>{ state.names.phonics=e.target.value.trim()||"Little one"; save(); render(); };
  $("n2").onchange=e=>{ state.names.spelling=e.target.value.trim()||"Big kid"; save(); render(); };
  $("replace").onclick=openPlacement;
  $("pr").onchange=e=>{ state.prayer=e.target.value.trim()||DEFAULT_PRAYER; save(); };
}

/* ---------- class flow ---------- */
let C=null, tick=null;
function openClass(){
  const day=todayIdx(); if(day<0) return;
  C={segs:agenda(), i:0, day, wi:S().cur, stamp:null, pausing:false, breakIdx:Math.floor(Math.random()*BREAKS.length)};
  $("classSheet").classList.add("open"); document.body.classList.add("locked");
  renderSeg();
}
function closeClass(){ stopAll(); $("classSheet").classList.remove("open"); document.body.classList.remove("locked"); C=null; render(); }
function stopAll(){ clearInterval(tick); tick=null; if(P) stop(); try{speechSynthesis.cancel()}catch(e){} }
function go(i){ stopAll(); C.pausing=false; C.i=i; renderSeg(); $("cbody").scrollTop=0; document.querySelector("#classSheet .panel").scrollTop=0; }

function renderSeg(){
  const seg=C.segs[C.i], t=T(), w=t.weeks[C.wi], n=esc(nm()), last=C.i===C.segs.length-1;
  $("segs").innerHTML=C.segs.map((_,j)=>`<i class="${j<=C.i?"on":""}"></i>`).join("")+(C.i>=C.segs.length?'':'');
  $("segname").textContent = C.i<C.segs.length ? `Part ${C.i+1} of ${C.segs.length}: ${seg.t}, about ${seg.m} min` : "All done";
  let b="";
  if (C.pausing){
    b=`<h2>Let's take a pause</h2><div class="calm"><span>breathe</span></div>
      <p>Smell the flower (breathe in)… blow out the candle (breathe out). Do it together, three times.</p>
      <p class="muted">Tears are normal. Hug first, lesson later. Stopping early still counts as a class.</p>
      <p class="muted" style="margin:0 0 12px">Printables that help: ${PRINTS.filter(p=>p.use&&p.use.calm).map(p=>`<a href="${DRIVE(p.id)}" target="_blank" rel="noopener">${esc(p.t)}</a>`).join(", ")}</p>
      <div style="display:grid;gap:8px"><button class="btn" id="pzBack">We're ready, keep going</button>
      <button class="btn alt" id="pzEnd">Finish with the goodbye song</button>
      <button class="btn alt" id="pzCoach">Ask the coach what to do</button></div>`;
    $("cbody").innerHTML=b; $("cfoot").innerHTML="";
    $("pzBack").onclick=()=>{ C.pausing=false; renderSeg(); };
    $("pzEnd").onclick=()=>go(C.segs.length-1);
    $("pzCoach").onclick=()=>openCoach(`${nm()} is upset and crying during our lesson right now. What should I do?`);
    return;
  }
  if (seg.k==="prayer"){
    b=`<h2>Let's pray</h2><p class="muted">Fold hands, close eyes, and say it together.</p><p class="prayer">${esc(state.prayer)}</p><button class="btn alt" id="readP">Read it aloud</button>`;
  } else if (seg.k==="hello"||seg.k==="bye"){
    const sg=SONGS[seg.k];
    b=`<h2>${sg.title}</h2><p class="muted">${sg.tune}. Clap along, or sway together.</p><div class="lyrics">${sg.lines(nm()).map(l=>`<p>${esc(l)}</p>`).join("")}</div>`;
    if (seg.k==="bye") b+=`<h2 style="margin-top:22px">Pick a nature stamp</h2><p class="muted">${n} chooses one for the basket.</p>
      <div class="stamps">${Object.keys(STAMPS).map(k=>`<button data-stamp="${k}" aria-pressed="${C.stamp===k}">${stampSvg(k)}${STAMPS[k][0]}</button>`).join("")}</div>`;
  } else if (seg.k==="lesson"){
    const [dn, dd] = t.days[C.day];
    b=`<h2>${dn}</h2><p class="muted">${esc(dd)}</p>
      <div class="stage" id="stage"></div><div class="progress" id="pbar"></div><div class="cap" id="cap" aria-live="polite"></div>
      <div class="controls"><button id="pprev">Back</button><button id="pplay" class="play">Play</button><button id="pnext">Next</button></div>
      <div class="controls" style="margin-top:8px"><button id="pmute"></button></div>
      <details style="margin-top:12px"><summary>Read the steps</summary><ol class="steps" id="steps"></ol></details>
      <div class="mine" id="mine"></div>
      <details class="errlog" id="errlog"><summary>Note a mistake</summary>
        <p class="muted" style="margin:4px 0 8px">Mistakes are clues, not failures. Noting the kind helps the dashboard and coach suggest what to review.</p>
        <div class="errtypes">${Object.entries(ERR_TYPES).map(([k,v])=>`<button data-err="${k}" aria-pressed="false"><b>${v[0]}</b><small>${v[1]}</small></button>`).join("")}</div>
        <label class="f" for="errw">The word (optional)</label><input type="text" id="errw" placeholder="e.g. cake">
        <button class="btn alt wide" id="errsave" style="margin-top:8px" disabled>Save note</button><p class="muted" id="errmsg" style="margin:6px 0 0"></p>
      </details>`;
  } else if (seg.k==="break"){
    b=`<h2>Movement break</h2><p class="muted">Bodies need to move. ${n} gets to wiggle, you get to sit.</p>
      <div class="idea" id="idea">${BREAKS[C.breakIdx]}</div><p class="muted" style="margin:0 0 8px">More ideas: ${PRINTS.filter(p=>p.use&&p.use.breaks).map(p=>`<a href="${DRIVE(p.id)}" target="_blank" rel="noopener">${esc(p.t)}</a>`).join(", ")}</p><button class="btn alt" id="another">Another idea</button>${timerHtml(seg.m)}`;
  } else if (seg.k==="stem"){
    const a=stemFor(state.tab,C.wi,C.day);
    b=`<h2>${a.t}</h2><span class="kind">${a.kind}</span><p class="muted" style="margin:8px 0 0">Prep time: ${a.prep}</p>
      <h3>You need</h3><ul class="mat">${a.mat.map(x=>`<li>${esc(fillT(x,w))}</li>`).join("")}</ul>
      <h3>Steps</h3><ol class="mat">${a.steps.map(x=>`<li>${esc(fillT(x,w))}</li>`).join("")}</ol>
      <div class="idea" style="font-size:1rem"><b>Low on energy?</b> ${esc(a.easy)}</div>`;
  }
  else if (seg.k==="story"){
    const own=state.stories[skey(state.tab,C.wi)];
    const st=storyFor(state.tab,C.wi,C.storySrc);
    b=`<h2>Story time</h2><p class="muted">${state.tab==="phonics"?`Snuggle up. You read, ${n} reads the underlined words. Tap any word to hear it.`:`${n} reads aloud. Stuck on a word? Tap it to hear it.`}</p>
      ${own?`<div class="modes" role="group" aria-label="Which story"><button data-src="own" aria-pressed="${C.storySrc!=="book"}">Our story</button><button data-src="book" aria-pressed="${C.storySrc==="book"}">App story</button></div>`:""}
      <div class="storybox"><h3 class="stitle">${esc(st.title)}</h3>${st.photo?`<img src="${blobSrc(st.photo)}" alt="">`:""}<p class="stext" id="stext">${storyHtml(st,w)}</p></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
        <button class="btn alt" id="readS">Read it to us</button><button class="btn alt" id="addS">${own?"Edit our story":"Add your own story"}</button>
      </div>
      ${sampleFn?`<button class="btn alt wide" id="genS" style="margin-top:8px">Make a new story with this week's words</button>`:""}`;
  }
  b+=`<button class="pause" id="pz">We need a pause</button>`;
  $("cbody").innerHTML=b;
  $("cfoot").innerHTML=`<button class="btn alt" id="cb" ${C.i===0?"disabled":""}>Back</button><button class="btn" id="cn">${last?"Finish class":"Next: "+C.segs[C.i+1].t}</button>`;
  $("cb").onclick=()=>go(C.i-1);
  $("cn").onclick=()=> last ? finishClass() : go(C.i+1);
  $("pz").onclick=()=>{ stopAll(); C.pausing=true; renderSeg(); };
  if ($("readP")) $("readP").onclick=()=>say(state.prayer);
  document.querySelectorAll("[data-stamp]").forEach(x=>x.onclick=()=>{ C.stamp=x.dataset.stamp; document.querySelectorAll("[data-stamp]").forEach(y=>y.setAttribute("aria-pressed", y===x)); });
  if ($("another")) $("another").onclick=()=>{ C.breakIdx=(C.breakIdx+1)%BREAKS.length; $("idea").textContent=BREAKS[C.breakIdx]; };
  if (seg.k==="break") bindTimer(seg.m);
  if (seg.k==="lesson"){ mountLesson(); bindErr(); }
  if (seg.k==="story"){
    document.querySelectorAll(".sw").forEach(x=>x.onclick=()=>say(x.dataset.w,.8));
    document.querySelectorAll("[data-src]").forEach(x=>x.onclick=()=>{ C.storySrc=x.dataset.src; renderSeg(); });
    $("readS").onclick=()=>say(storyFor(state.tab,C.wi,C.storySrc).text,.85);
    $("addS").onclick=()=>openStoryEditor();
    if ($("genS")) $("genS").onclick=()=>openStoryEditor(true);
  }
}
function finishClass(){
  stopAll();
  const s=S();
  if (state.mode!=="minimum" && C.segs.some(x=>x.k==="lesson")){ const a=[...daysFor(C.wi)]; a[C.day]=1; s.d[C.wi]=a; }
  state.log.push({t:Date.now(), tab:state.tab, wi:C.wi, day:C.day, mode:state.mode});
  const keys=Object.keys(STAMPS), st=C.stamp||keys[Math.floor(Math.random()*keys.length)];
  (state.basket[state.tab]=state.basket[state.tab]||[]).push(st); save();
  $("segs").innerHTML=C.segs.map(()=>`<i class="on"></i>`).join("");
  $("segname").textContent="All done";
  const bask=state.basket[state.tab];
  $("cbody").innerHTML=`<h2>Class done. Well done, ${esc(nm())}!</h2><div style="text-align:center;margin:16px 0">${stampSvg(st).replace('<svg','<svg width="96" height="96"')}</div>
    <p>${bask.length} stamp${bask.length===1?"":"s"} in the basket now.</p><div class="basket">${bask.map(stampSvg).join("")}</div>
    <p class="muted">${state.mode==="minimum"?"Today's lesson is waiting for next time. You showed up, and that counts.":"See you tomorrow, same time. That's the whole secret."}</p>`;
  $("cfoot").innerHTML=`<button class="btn" id="cdone" style="flex:1">Close</button>`;
  $("cdone").onclick=closeClass;
}

function timerHtml(m){ return `<div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--edge)" stroke-width="6"/><circle id="arc" cx="50" cy="50" r="44" fill="none" stroke="var(--sage)" stroke-width="6" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="0"/></svg><b id="tleft">${m}:00</b></div>
  <div class="tline"><button class="btn" id="tgo">Start timer</button><button class="btn alt" id="tplus">+1 min</button></div>`; }
function bindTimer(m){
  let total=m*60, left=total;
  const draw=()=>{ $("tleft").textContent=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`; $("arc").setAttribute("stroke-dashoffset", (276.5*(1-left/total)).toFixed(1)); };
  $("tgo").onclick=()=>{
    if (tick){ clearInterval(tick); tick=null; $("tgo").textContent="Resume"; return; }
    $("tgo").textContent="Pause";
    tick=setInterval(()=>{ left--; draw(); if(left<=0){ clearInterval(tick); tick=null; chime(); $("tgo").textContent="Time's up"; } },1000);
  };
  $("tplus").onclick=()=>{ left+=60; total+=60; draw(); };
}

/* ---------- lesson player ---------- */
const P={steps:[],i:0,playing:false,tok:0,key:""};
function narrate(text, done){
  const tok=++P.tok;
  const plain=text.replace(/\/[^\/\s]+\//g,"").replace(/\s+/g," ").replace(/:\s*$/,"").trim();
  const est=1800+plain.length*55; let fired=false;
  const fin=()=>{ if(!fired&&tok===P.tok){ fired=true; done(); } };
  if (state.muted||!("speechSynthesis" in window)){ setTimeout(fin,est); return; }
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(plain); u.rate=.92; u.onend=()=>setTimeout(fin,900); u.onerror=()=>setTimeout(fin,est); speechSynthesis.speak(u); setTimeout(fin,est*2.2); }catch(e){ setTimeout(fin,est); }
}
function showStep(i){
  if (!$("stage")) return;
  P.i=i; const s=P.steps[i];
  $("stage").innerHTML=`${s.ph?`<span class="phase">${s.ph}</span>`:""}<div class="scene">${s.html}</div>`; $("cap").textContent=s.cap;
  $("pbar").innerHTML=P.steps.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("");
  [...$("steps").children].forEach((li,j)=>li.classList.toggle("now",j===i));
  $("pprev").disabled=i===0; $("pnext").disabled=i===P.steps.length-1;
  if (P.playing){ const start=Date.now(), min=s.ms||3200;
    narrate(s.cap,()=>{ const tok=P.tok; setTimeout(()=>{ if(!P.playing||tok!==P.tok) return; if(P.i<P.steps.length-1) showStep(P.i+1); else stop(true); }, Math.max(0,min-(Date.now()-start))); }); }
}
function play(){ P.playing=true; $("pplay").textContent="Pause"; if($("pplay").dataset.ended){ P.i=0; delete $("pplay").dataset.ended; } showStep(P.i); }
function stop(ended){ P.playing=false; P.tok++; try{speechSynthesis.cancel()}catch(e){} const b=$("pplay"); if(b){ b.textContent=ended?"Replay":"Play"; if(ended) b.dataset.ended=1; } }
function muteLabel(){ $("pmute").textContent=state.muted?"Voice off (tap to turn on)":"Voice on"; }
function mountLesson(){
  const t=T(), w=t.weeks[C.wi];
  P.steps=buildLesson(state.tab,C.day,w,t,C.wi); P.i=0; P.playing=false; P.key=`${state.tab}-${C.wi}-${C.day}`;
  $("steps").innerHTML=P.steps.map(s=>`<li>${s.ph?`<b>${s.ph}:</b> `:""}${esc(s.cap)}</li>`).join("");
  $("pplay").onclick=()=>P.playing?stop():play();
  $("pprev").onclick=()=>{ P.tok++; try{speechSynthesis.cancel()}catch(e){} showStep(Math.max(0,P.i-1)); };
  $("pnext").onclick=()=>{ P.tok++; try{speechSynthesis.cancel()}catch(e){} showStep(Math.min(P.steps.length-1,P.i+1)); };
  $("pmute").onclick=()=>{ state.muted=!state.muted; muteLabel(); save(); if(P.playing) showStep(P.i); };
  muteLabel(); renderMine(); showStep(0);
}
function renderMine(){
  const box=$("mine"); if(!box) return; const id=state.videos[P.key];
  let h=id?`<video controls playsinline src="${blobSrc(id)}"></video>`:"";
  if (assets) h+=`<label class="upl">${id?"Replace your video":"Add a real video of this lesson"}<input type="file" accept="video/*" id="vfile"></label><p class="muted" id="vmsg" style="margin:6px 0 0"></p>`;
  box.innerHTML=h;
  const f=$("vfile"); if(f) f.onchange=async()=>{ const file=f.files[0]; if(!file) return; $("vmsg").textContent="Uploading…";
    try{ const r=await assets.upload(file); state.videos[P.key]=r.id; save(); renderMine(); }
    catch(e){ $("vmsg").textContent= e.code==="quota_exceeded"?"Storage is full.":"Upload didn't work. Try a clip under 20 MB."; } };
}
$("cclose").onclick=closeClass;

/* ---------- coach ---------- */
let K=[], busy=false;
function openCoach(auto){
  $("coachSheet").classList.add("open"); document.body.classList.add("locked");
  drawChat();
  if (auto) send(auto);
}
function closeCoach(){ $("coachSheet").classList.remove("open"); if(!C) document.body.classList.remove("locked"); }
$("kclose").onclick=closeCoach;
function drawChat(){
  $("chat").innerHTML = K.length ? K.map(m=>`<div class="msg ${m.role==="user"?"me":"ai"}">${esc(m.content)}</div>`).join("")
    : `<div class="msg ai">Hi. I'm here for the hard moments: tears, refusing, wiggles, or a parent who's simply tired. What's happening with ${esc(nm())}?</div>`;
  $("quick").innerHTML = (K.length && sampleFn) ? "" : COACH_QUICK.map((q,i)=>`<button data-q="${i}">${q[0]}</button>`).join("");
  document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>send(COACH_QUICK[+b.dataset.q][0], +b.dataset.q));
  $("ask").innerHTML=`<textarea id="kq" placeholder="Type what's going on…" aria-label="Message the coach"></textarea><button class="btn" id="ksend">Send</button>`;
  $("ksend").onclick=()=>{ const v=$("kq").value.trim(); if(v) send(v); };
  const c=$("coachSheet").querySelector(".panel"); c.scrollTop=c.scrollHeight;
}
async function send(text, quickIdx){
  if (busy) return; busy=true;
  K.push({role:"user",content:text});
  if (!sampleFn){
    K.push({role:"assistant",content: quickIdx!==undefined ? COACH_QUICK[quickIdx][1] : "The live coach isn't reachable right now. Meanwhile, tap a topic below for tips that help most families."});
    busy=false; drawChat(); return;
  }
  K.push({role:"assistant",content:"Thinking…"}); drawChat();
  const bubbles=$("chat").querySelectorAll(".msg.ai"), out=bubbles[bubbles.length-1];
  const w=T().weeks[S().cur];
  const ctx=`${COACH_SYSTEM}\n\nContext: the child is ${nm()}, age ${AGES[state.tab]}, working on ${state.tab==="phonics"?"learning to read (phonics)":"Orton-Gillingham spelling"}, currently week ${S().cur+1}: ${w.t}. Classes are short daily lessons at home.${recentErrText()}`;
  const msgs=K.slice(0,-1).map((m,i)=> i===0 ? {role:"user",content:ctx+"\n\nParent: "+m.content} : m);
  try{
    const r=await sampleFn(msgs,{cache:false, onText:({text})=>{ out.textContent=text; }});
    K[K.length-1].content=r.text;
  }catch(e){
    K[K.length-1].content = e.text || (e.code==="rate_limited"?"I need a short breather. Try again in a minute.":"I couldn't answer just now. Try again in a moment.");
  }
  busy=false; drawChat();
}

/* ---------- saving ---------- */
function save(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    try{ localStorage.setItem("reading-path", JSON.stringify(state)); }catch(e){}
    if(saveFn){ try{ await saveFn(state); }catch(e){ const el=$("status"); if(el) el.textContent="Saved on this device only."; } }
  },500);
}
function merge(s){
  if(!s) return;
  for (const k of ["tab","mode","muted","prayer","intro","view"]) if (s[k]!==undefined) state[k]=s[k];
  state.stories=s.stories||state.stories; state.log=s.log||state.log; state.errors=s.errors||state.errors; state.bugs=s.bugs||state.bugs; state.favAff=s.favAff||[]; state.myAff=s.myAff||[]; if(s.affTheme) state.affTheme=s.affTheme; state.labels=s.labels||state.labels; if(s.shelf) state.shelf=s.shelf; state.placed={...state.placed,...(s.placed||{})};
  for (const k of []) if (s[k]!==undefined) state[k]=s[k];
  state.videos=s.videos||state.videos; state.names={...state.names,...(s.names||{})};
  if (Array.isArray(s.basket)) s.basket={phonics:s.basket,spelling:[]};
  state.basket={...state.basket,...(s.basket||{})};
  for (const k of ["phonics","spelling"]) if(s[k]) state[k]={cur:s[k].cur||0,d:s[k].d||{},n:s[k].n||{}};
}
try{ merge(JSON.parse(localStorage.getItem("reading-path"))); }catch(e){}
render();
(async()=>{
  try{
    if(!window.claude||!window.claude.use) return;
    claude.use("assets").then(a=>{ assets=a; if(C) renderMine(); }).catch(()=>{});
    claude.use("sample").then(s=>{ sampleFn=s; }).catch(()=>{});
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    const ref=db.doc(`data/users/${id}/progress/main`);
    const snap=await ref.get();
    if(snap.exists && snap.data().state){ merge(JSON.parse(snap.data().state)); }
    saveFn=s=>ref.set({state:JSON.stringify(s),updated:Date.now()});
    if(!C) render();
  }catch(e){}
})();

/* ---------- story editor ---------- */
let SE={photo:null};
function openStoryEditor(generate){
  const own=state.stories[skey()]||{};
  SE={photo:own.photo||null};
  $("storySheet").classList.add("open"); document.body.classList.add("locked");
  $("sbody").innerHTML=`<p class="muted" style="margin-top:0">Add a favourite book, a story you made up together, or a page from your library book. ${esc(nm())} will see it in Story time for week ${S().cur+1}.</p>
    <label class="f" for="stt">Title</label><input type="text" id="stt" value="${esc(own.title||"")}" placeholder="e.g. Our trip to the park">
    <label class="f" for="stx">Story</label><textarea id="stx" style="min-height:160px" placeholder="Type or paste the story. Short is perfect: 3 to 6 sentences.">${esc(own.text||"")}</textarea>
    ${assets?`<label class="upl" style="margin-top:10px">${SE.photo?"Change photo":"Add a photo (book page or drawing)"}<input type="file" accept="image/*" id="sph"></label><span class="muted" id="sphm"></span>`:""}
    ${sampleFn?`<button class="btn alt wide" id="sgen" style="margin-top:10px">Write one for me with this week's words</button>`:""}
    <div style="display:flex;gap:8px;margin-top:14px">${state.stories[skey()]?`<button class="btn alt" id="sdel" style="flex:1">Remove</button>`:""}<button class="btn" id="ssave" style="flex:2">Save story</button></div>`;
  $("ssave").onclick=()=>{ const t=$("stx").value.trim(); if(!t){ $("stx").focus(); return; }
    state.stories[skey()]={title:$("stt").value.trim()||"Our story", text:t, photo:SE.photo}; save(); closeStoryEditor(); };
  if ($("sdel")) $("sdel").onclick=()=>{ delete state.stories[skey()]; save(); closeStoryEditor(); };
  if ($("sph")) $("sph").onchange=async e=>{ const f=e.target.files[0]; if(!f) return; $("sphm").textContent=" Uploading…";
    try{ const r=await assets.upload(f); SE.photo=r.id; $("sphm").textContent=" Photo added."; }catch(err){ $("sphm").textContent=" Upload didn't work."; } };
  if ($("sgen")) $("sgen").onclick=genStory;
  if (generate) genStory();
}
async function genStory(){
  const w=T().weeks[S().cur], b=$("sgen"); if(!b) return;
  b.disabled=true; b.textContent="Writing…";
  const words=cleanWords(w).slice(0,8).join(", ");
  const prompt=`Write a short, gentle, original story for a ${AGES[state.tab]}-year-old named ${nm()}. Use these practice words several times: ${words}${w.h?`, and these sight words: ${w.h.join(", ")}`:""}. ${state.tab==="phonics"?"Keep the other words very simple, mostly short decodable words.":"Use simple sentences a 7-year-old can read aloud."} 4 to 6 sentences. Calm and warm, a little funny. Reply with only a title on the first line and the story below it. No markdown.`;
  try{
    const r=await sampleFn(prompt,{cache:false, onText:({text})=>{ const [t,...rest]=text.split("\n"); $("stt").value=t.trim(); $("stx").value=rest.join(" ").trim(); }});
    const [t,...rest]=r.text.trim().split("\n"); $("stt").value=t.replace(/^title:\s*/i,"").trim(); $("stx").value=rest.join(" ").trim();
    b.textContent="Write another one";
  }catch(e){ b.textContent= e.code==="rate_limited"?"Busy, try again in a minute":"Couldn't write one, try again"; }
  b.disabled=false;
}
function closeStoryEditor(){ $("storySheet").classList.remove("open"); if(!C) document.body.classList.remove("locked"); if(C) renderSeg(); else render(); }

/* ---------- dashboard ---------- */
function bindView(){ document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{ state.view=b.dataset.view; save(); render(); window.scrollTo({top:0}); }); }
function dayKey(t){ const d=new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function dashHtml(){
  const today=new Date(); today.setHours(12,0,0,0);
  const days=[...Array(14)].map((_,i)=>{ const d=new Date(today); d.setDate(d.getDate()-13+i); return d; });
  const byDay={}; state.log.forEach(l=>{ const k=dayKey(l.t); (byDay[k]=byDay[k]||new Set()).add(l.tab); });
  const last7=days.slice(-7).filter(d=>byDay[dayKey(d)]).length;
  const shown=state.log.length;
  let h=`<section class="box faith"><p class="muted" style="margin:0">Faithful, not perfect</p><p class="bigstat" style="margin:4px 0">You showed up ${shown} time${shown===1?"":"s"}</p><p style="margin:0">${shown?"Every one of those mornings mattered, the tired ones most of all.":"Your first class is the hardest one. It gets lighter from here."}</p></section>
  <section class="box"><h2>The last two weeks</h2>
    <p class="muted" style="margin:0 0 10px">${state.log.length?`Class on ${last7} of the last 7 days. ${last7>=4?"That's a real rhythm.":last7>=1?"Every class counts. Same time tomorrow?":"A fresh start is one tap away."}`:"Your class days will show up here after your first class."}</p>
    <div class="cal">${days.map(d=>{ const s=byDay[dayKey(d)]||new Set(); const isT=dayKey(d)===dayKey(today);
      return `<div class="cd${isT?" now":""}"><small>${"SMTWTFS"[d.getDay()]}</small><b>${d.getDate()}</b><span>${s.has("phonics")?'<i class="k1"></i>':""}${s.has("spelling")?'<i class="k2"></i>':""}</span></div>`; }).join("")}</div>
    <div class="legend"><span><i class="k1"></i>${esc(state.names.phonics)}</span><span><i class="k2"></i>${esc(state.names.spelling)}</span></div></section>`;
  for (const k of ["phonics","spelling"]){
    const t=TRACKS[k], s=state[k], total=t.weeks.length, wi=s.cur, w=t.weeks[wi];
    const classes=Object.values(s.d).reduce((a,d)=>a+d.filter(Boolean).length,0);
    const wk=(s.d[wi]||[]).filter(Boolean).length, weeksDone=doneCount(k);
    const tired=state.log.filter(l=>l.tab===k && l.mode==="tired").length;
    const nextDay=(s.d[wi]||[0,0,0,0,0]).findIndex(x=>!x);
    let idx=0; const units=t.units.map(([u,ws])=>{ const st=idx; idx+=ws.length; const dn=ws.filter((_,j)=>((s.d[st+j]||[]).filter(Boolean).length===5)).length; return [u,dn,ws.length,wi>=st&&wi<idx]; });
    const notes=Object.entries(s.n).filter(([,v])=>v&&v.trim()).sort((a,b)=>b[0]-a[0]).slice(0,2);
    h+=`<section class="box kid ${k}">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><h2 style="margin:0">${esc(state.names[k])}</h2><span class="muted">${t.who}</span></div>
      <p class="bigstat">Week ${wi+1} <small>of ${total}</small></p>
      <div class="bar2"><i style="width:${(wi/total*100).toFixed(1)}%"></i></div>
      <div class="stats">
        <div><b>${wk}/5</b><span>this week</span></div><div><b>${classes}</b><span>classes</span></div>
        <div><b>${(state.basket[k]||[]).length}</b><span>stamps</span></div><div><b>${tired}</b><span>tired-day</span></div></div>
      <p style="margin:12px 0 4px"><span class="muted">Up next</span><br>${nextDay<0?`Week ${wi+1} done. Ready for week ${wi+2}.`:`Day ${nextDay+1}: ${t.days[nextDay][0]}, ${esc(w.t)}`}</p>
      <h3>Units</h3><ul class="units">${units.map(([u,dn,n,cur])=>`<li class="${cur?"cur":""}"><span>${esc(u)}</span><span class="ub"><i style="width:${dn/n*100}%"></i></span><span class="muted">${dn}/${n}</span></li>`).join("")}</ul>
      ${errHtml(k)}
      ${notes.length?`<h3>Recent notes</h3>${notes.map(([i,v])=>`<p class="note"><small class="muted">Week ${+i+1}</small><br>${esc(v)}</p>`).join("")}`:""}
      <button class="btn wide" data-go="${k}" style="margin-top:12px">${nextDay<0?"Open this week":"Start today's class"}</button>
    </section>`;
  }
  h+=`<section class="box"><div class="coachcard"><span class="av"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h6"/></svg></span>
    <div style="flex:1"><h2 style="margin:0">Feeling stuck?</h2><p class="muted" style="margin:0">Ask the parent coach about pace, tears, or whether to repeat a week.</p></div></div>
    <button class="btn alt wide" id="openCoach2" style="margin-top:12px">Talk to the coach</button></section>
    <p class="status" id="status">${saveFn?"Progress is saved to your account.":"Progress is saved on this device."}</p>`;
  return h;
}
function bindDash(){
  bindView();
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{ state.tab=b.dataset.go; state.view="today"; save(); render(); if(todayIdx()>=0) openClass(); });
  $("openCoach2").onclick=()=>openCoach();
}
$("sclose").onclick=()=>{ $("storySheet").classList.remove("open"); if(!C) document.body.classList.remove("locked"); };

/* ---------- OG lesson builder: warm-up, watch me / together / your turn, hear and write ---------- */
function buildLesson(tab, day, w, t, wi){
  const core = DEMOS[tab][day](w,t,wi);
  const n=core.length;
  core.forEach((s,i)=>{ s.ph = i===0 ? "Watch me" : i>=n-1 ? "Your turn" : (i===1 && n>3 ? "Watch me" : "Together"); });
  const out=[];
  const sf=soFar(t,wi);
  if (tab==="phonics" && sf.length){
    out.push({ph:"Warm-up", cap:"Sound card warm-up: flash each card. Child says the sound, fast and crisp. Put any slow ones aside to practise.", html:`<div class="row">${sf.map((x,j)=>`<span class="card flip" style="--d:${j*.35}s">${x}</span>`).join("")}</div>`});
  }
  if (tab==="spelling"){
    const ps=[...new Set([...(w.s||[]), ...sf])].filter(x=>/^[a-z_]+$/.test(x)).slice(0,5);
    if (ps.length) out.push({ph:"Warm-up", cap:`Sound drill: you say a sound, child says the letters and writes them. Try: ${ps.map(x=>"/"+x.replace("_e","")+"/").join(" ")}`, html:`<div class="paper">${ps.slice(0,3).map((x,j)=>`<div class="ln hand fade" style="--d:${j*.7}s"><span class="snd" style="font-size:1.3rem">/${x.replace("_e","")}/</span> → ${x}</div>`).join("")}</div>`});
  }
  out.push(...core);
  if (tab==="phonics" && (w.s||[]).length && day!==4){
    const sn=w.s.slice(0,3);
    out.push({ph:"Your turn", cap:`Hear and write: you say a sound, child finds the tile or writes the letter. Try ${sn.map(x=>"/"+x.replace("_e","")+"/").join(", ")}.`, html:`<div class="big pulse">${SPK}</div><div class="tiles">${sn.map((x,j)=>`<span class="tl pop" style="--d:${.6+j*.4}s">${x}</span>`).join("")}</div>`});
  }
  return out;
}

/* ---------- mistake notes ---------- */
function bindErr(){
  let pick=null;
  document.querySelectorAll("[data-err]").forEach(b=>b.onclick=()=>{ pick=b.dataset.err; document.querySelectorAll("[data-err]").forEach(x=>x.setAttribute("aria-pressed",x===b)); $("errsave").disabled=false; });
  $("errsave").onclick=()=>{ if(!pick) return;
    state.errors.push({t:Date.now(), tab:state.tab, wi:C.wi, type:pick, word:$("errw").value.trim().slice(0,40)}); save();
    $("errmsg").textContent=`Noted: ${ERR_TYPES[pick][0].toLowerCase()}. Keep going, gently.`;
    $("errw").value=""; pick=null; $("errsave").disabled=true; document.querySelectorAll("[data-err]").forEach(x=>x.setAttribute("aria-pressed","false")); };
}
function recentErrs(k){ const since=Date.now()-14*864e5; return state.errors.filter(e=>e.tab===k && e.t>=since); }
function recentErrText(){
  const r=recentErrs(state.tab); if(!r.length) return "";
  const c={}; r.forEach(e=>c[e.type]=(c[e.type]||0)+1);
  const words=r.filter(e=>e.word).slice(-6).map(e=>e.word);
  return ` Mistakes noted in the last 2 weeks: ${Object.entries(c).map(([k,v])=>`${ERR_TYPES[k][0]} x${v}`).join(", ")}${words.length?` (words: ${words.join(", ")})`:""}.`;
}
function errHtml(k){
  const r=recentErrs(k); if(!r.length) return "";
  const c={}; r.forEach(e=>c[e.type]=(c[e.type]||0)+1);
  const top=Object.entries(c).sort((a,b)=>b[1]-a[1]);
  return `<h3>Mistakes noted, last 2 weeks</h3><ul class="units">${top.map(([t,v])=>`<li><span>${ERR_TYPES[t][0]}</span><span class="ub"><i style="width:${Math.min(100,v/r.length*100)}%"></i></span><span class="muted">${v}</span></li>`).join("")}</ul>
    <p class="note"><b>Try this:</b> ${esc(ERR_TYPES[top[0][0]][2])}</p>`;
}

/* ---------- starting check (placement) ---------- */
let PL=null;
function weekByTitle(tab,title){ const i=TRACKS[tab].weeks.findIndex(w=>w.t===title); return i<0?0:i; }
function openPlacement(){
  PL={tab:state.tab, i:0, done:false};
  $("placeSheet").classList.add("open"); document.body.classList.add("locked"); drawPlacement();
}
function closePlacement(){ $("placeSheet").classList.remove("open"); if(!C) document.body.classList.remove("locked"); render(); }
function drawPlacement(){
  const qs=PLACEMENT[PL.tab], b=$("pbody");
  if (PL.result!==undefined){
    const w=TRACKS[PL.tab].weeks[PL.result];
    b.innerHTML=`<h2>Start at week ${PL.result+1}</h2><p style="font-size:1.2rem;margin:0 0 6px"><b>${esc(w.t)}</b></p>
      <p class="muted">${PL.result===0?"Starting at the very beginning builds a strong base. The early weeks will feel easy, and that's a good thing.":"Everything before this will come back in review, so nothing is skipped for good. You can always move back a week."}</p>
      <div style="display:grid;gap:8px;margin-top:14px"><button class="btn" id="plGo">Start here</button><button class="btn alt" id="plAgain">Do the check again</button></div>`;
    $("plGo").onclick=()=>{ state[PL.tab].cur=PL.result; state.placed[PL.tab]=true; save(); closePlacement(); };
    $("plAgain").onclick=()=>{ PL={tab:PL.tab,i:0}; drawPlacement(); };
    return;
  }
  const [q]=qs[PL.i];
  b.innerHTML=`<p class="muted" style="margin:0">Question ${PL.i+1} of ${qs.length}, for ${esc(state.names[PL.tab])}</p>
    <div class="segs" style="margin:10px 0 16px">${qs.map((_,j)=>`<i class="${j<=PL.i?"on":""}"></i>`).join("")}</div>
    <p class="prayer" style="margin:0 0 18px">${esc(q)}</p>
    <p class="muted">Ask in a relaxed way, like a game. If you're unsure, choose "Not yet".</p>
    <div style="display:grid;gap:8px;margin-top:12px"><button class="btn" id="plYes">Yes, easily</button><button class="btn alt" id="plNo">Not yet</button></div>`;
  $("plYes").onclick=()=>{ if(PL.i<qs.length-1){ PL.i++; drawPlacement(); } else { PL.result=Math.min(weekByTitle(PL.tab,qs[qs.length-1][1])+(PL.tab==="phonics"?8:3), TRACKS[PL.tab].weeks.length-1); drawPlacement(); } };
  $("plNo").onclick=()=>{ PL.result=weekByTitle(PL.tab,qs[PL.i][1]); drawPlacement(); };
}
$("plclose").onclick=closePlacement;


/* ---------- shared: printables for a week ---------- */
function printsFor(track, wi){
  return PRINTS.filter(p=>p.use && p.use[track] && (track==="bugs" ? p.use.bugs.includes(wi) : wi>=p.use[track][0] && wi<=p.use[track][1]));
}
function printChip(p){ const lab=state.labels[p.id]; return `<a class="pchip" href="${DRIVE(p.id)}" target="_blank" rel="noopener">${esc(lab?lab.t:p.t)}<small>${esc(p.type)}${p.prep?", "+esc(p.prep.toLowerCase()):""}</small></a>`; }
function weekPrintsHtml(track, wi){
  const ps=printsFor(track,wi); if(!ps.length) return "";
  return `<p class="muted" style="margin:12px 0 4px">Printables for this week</p><div class="pchips">${ps.map(printChip).join("")}</div>`;
}

/* ---------- Bug Lab ---------- */
function bugsHtml(){
  const B=state.bugs, i=B.cur, w=BUGS[i], d=B.d[i]||[0,0,0];
  const done=BUGS.filter((_,j)=>(B.d[j]||[]).filter(Boolean).length===3).length;
  return `<section class="box bughero"><p class="muted" style="margin:0">Nature study for both children, once or twice a week</p>
    <h2 style="margin:4px 0 6px">Bug Lab</h2>
    <div class="bar2"><i style="width:${done/BUGS.length*100}%"></i></div><p class="muted" style="margin:6px 0 0;font-size:.88rem">${done} of ${BUGS.length} weeks explored</p></section>
  <section class="box">
    <p class="muted" style="margin:0">Week ${i+1} of ${BUGS.length}</p>
    <h2>${esc(w.t)}</h2>
    <p class="bigidea">${esc(w.big)}</p>
    <div class="chips">${w.words.map(x=>`<button data-say="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <h3>1. Read aloud together</h3><p class="readaloud">${esc(w.read)}</p>
    <button class="btn alt" id="bugRead">Read it to us</button>
    ${w.song?`<p class="note" style="margin-top:10px"><b>Song.</b> ${esc(w.song)}</p>`:""}
    <h3>2. Lab: ${esc(w.lab.t)}</h3>
    <p class="muted" style="margin:0">You need</p><ul class="mat">${w.lab.mat.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    <ol class="mat">${w.lab.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
    <div class="agegrid"><div><b>Age 4</b><br>${esc(w.little)}</div><div><b>Age 7</b><br>${esc(w.bigger)}</div></div>
    <p class="note"><b>Safety.</b> ${esc(w.safety)}</p>
    <h3>3. Nature journal</h3><p style="margin:0">${esc(w.journal)}</p>
    ${weekPrintsHtml("bugs",i)}
    <h3>This week</h3>
    ${["Read aloud","Lab","Nature journal"].map((l,j)=>`<div class="dayrow"><input type="checkbox" id="bg${j}" ${d[j]?"checked":""}><label for="bg${j}">${l}</label></div>`).join("")}
    <label class="f" for="bnote">What did you find?</label><textarea id="bnote" placeholder="Bugs spotted, questions asked…">${esc(B.n[i]||"")}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px"><button class="btn alt" style="flex:1" id="bprev" ${i===0?"disabled":""}>Previous week</button><button class="btn alt" style="flex:1" id="bnext" ${i===BUGS.length-1?"disabled":""}>Next week</button></div>
  </section>
  <section class="box"><details><summary>All Bug Lab weeks</summary><ul class="list">${BUGS.map((b,j)=>{ const dd=B.d[j]||[]; return `<li><button data-bw="${j}" ${j===i?'aria-current="true"':""}><span class="n">Wk ${j+1}</span><span class="t">${esc(b.t)}</span><span class="dots">${[0,1,2].map(k=>`<i class="${dd[k]?"on":""}"></i>`).join("")}</span></button></li>`; }).join("")}</ul></details></section>`;
}
function bindBugs(){
  bindView(); const B=state.bugs, i=B.cur;
  document.querySelectorAll("[data-say]").forEach(b=>b.onclick=()=>say(b.dataset.say,.8));
  $("bugRead").onclick=()=>say(BUGS[i].read,.88);
  [0,1,2].forEach(j=>$("bg"+j).onchange=e=>{ const a=[...(B.d[i]||[0,0,0])]; a[j]=e.target.checked?1:0; B.d[i]=a; if(e.target.checked) state.log.push({t:Date.now(),tab:"bugs",wi:i,mode:"bugs"}); save(); render(); });
  $("bnote").oninput=e=>{ B.n[i]=e.target.value; save(); };
  $("bprev").onclick=()=>{ B.cur=i-1; save(); render(); };
  $("bnext").onclick=()=>{ B.cur=i+1; save(); render(); };
  document.querySelectorAll("[data-bw]").forEach(b=>b.onclick=()=>{ B.cur=+b.dataset.bw; save(); render(); window.scrollTo({top:0}); });
}

/* ---------- Printables library ---------- */
function printHtml(){
  const q=(state.pq||"").toLowerCase(), f=state.pf||"all";
  const items=PRINTS.map(p=>({...p, ...(state.labels[p.id]?{t:state.labels[p.id].t, s:state.labels[p.id].s||p.s, labelled:true}:{})}));
  const counts={}; items.forEach(p=>counts[p.s]=(counts[p.s]||0)+1);
  const shown=items.filter(p=>(f==="all"||p.s===f) && (!q || (p.t+" "+p.type+" "+SUBJECTS[p.s]).toLowerCase().includes(q)));
  const groups=Object.keys(SUBJECTS).filter(s=>shown.some(p=>p.s===s));
  const useText=p=>{ if(!p.use) return ""; const u=p.use;
    if(u.phonics) return `${esc(state.names.phonics)}: weeks ${u.phonics[0]+1}–${u.phonics[1]+1}`;
    if(u.spelling) return `${esc(state.names.spelling)}: weeks ${u.spelling[0]+1}–${u.spelling[1]+1}`;
    if(u.bugs) return `Bug Lab week ${u.bugs.map(x=>x+1).join(", ")}`;
    if(u.calm) return "Pause screen"; if(u.breaks) return "Movement break"; return ""; };
  return `<section class="box"><h2>Printables</h2><p class="muted" style="margin:0 0 10px">${PRINTS.length} files from your printables folder, sorted and labelled. Tap one to open it in Google Drive.</p>
    <label class="f" for="pq">Search</label><input type="text" id="pq" value="${esc(state.pq||"")}" placeholder="e.g. shapes, insects, flashcards">
    <div class="filters">${[["all","All",PRINTS.length],...Object.keys(SUBJECTS).map(s=>[s,SUBJECTS[s],counts[s]||0])].filter(x=>x[2]).map(([k,l,n])=>`<button data-pf="${k}" aria-pressed="${f===k}">${l} <small>${n}</small></button>`).join("")}</div></section>
  ${groups.map(s=>`<section class="box"><h2>${SUBJECTS[s]}</h2>${s==="label"?`<p class="muted" style="margin:0 0 8px">I couldn't read these images. Open one, then give it a name and a subject so it files itself.</p>`:""}
    <div class="plist">${shown.filter(p=>p.s===s).map(p=>`<div class="pcard">
      <a href="${DRIVE(p.id)}" target="_blank" rel="noopener"><b>${esc(p.t)}</b></a>
      <div class="tags">${p.type?`<span>${esc(p.type)}</span>`:""}${p.age?`<span>Ages ${esc(p.age)}</span>`:""}${p.prep?`<span>${esc(p.prep)}</span>`:""}${useText(p)?`<span class="use">${useText(p)}</span>`:""}</div>
      ${s==="label"?`<div class="lab"><input type="text" placeholder="Name it" data-lname="${p.id}" aria-label="Name for ${esc(p.t)}"><select data-lsub="${p.id}" aria-label="Subject">${Object.entries(SUBJECTS).filter(([k])=>k!=="label").map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select><button class="btn alt" data-lsave="${p.id}">Save</button></div>`:""}
    </div>`).join("")}</div></section>`).join("") || `<section class="box"><p class="muted">Nothing matches. Try another word.</p></section>`}`;
}
function bindPrint(){
  bindView();
  const q=$("pq"); q.oninput=()=>{ state.pq=q.value; clearTimeout(q._t); q._t=setTimeout(()=>{ save(); const pos=q.selectionStart; render(); const n=$("pq"); n.focus(); n.setSelectionRange(pos,pos); },250); };
  document.querySelectorAll("[data-pf]").forEach(b=>b.onclick=()=>{ state.pf=b.dataset.pf; save(); render(); });
  document.querySelectorAll("[data-lsave]").forEach(b=>b.onclick=()=>{ const id=b.dataset.lsave; const t=document.querySelector(`[data-lname="${id}"]`).value.trim(); if(!t) return;
    state.labels[id]={t, s:document.querySelector(`[data-lsub="${id}"]`).value}; save(); render(); });
}

/* ---------- Parent library ---------- */
function libHtml(){
  const sh=state.shelf||"parent", tag=state.ltag||"";
  const list=BOOKS.filter(b=>b.shelf===sh && (!tag||b.tags.includes(tag)));
  const tags=[...new Set(BOOKS.filter(b=>b.shelf===sh).flatMap(b=>b.tags))];
  const links=b=> b.url?[["Open",b.url]] : b.ids? (b.t.startsWith("Kumon")? b.ids.map((id,j)=>[j?"Math levels":"Reading levels",DRIVE(id)]) : b.ids.map((id,j)=>[b.ids.length>1?`Copy ${j+1}`:"Open in Drive",DRIVE(id)])) : b.id?[["Open in Drive",DRIVE(b.id)]] : [];
  return `<section class="box"><h2>Library</h2><p class="muted" style="margin:0 0 10px">${BOOKS.length} books, sorted onto shelves, each with a plain-words summary and one small thing to try.</p>
    <div class="modes" role="group" aria-label="Shelf"><button data-shelf="parent" aria-pressed="${sh==="parent"}">Parenting & teaching</button><button data-shelf="you" aria-pressed="${sh==="you"}">For you</button></div>
    <p class="muted" style="margin:6px 0 4px">Read this when you're…</p>
    <div class="filters"><button data-ltag="" aria-pressed="${!tag}">Anything</button>${tags.map(t=>`<button data-ltag="${t}" aria-pressed="${tag===t}">${READ_WHEN[t]}</button>`).join("")}</div></section>
  ${Object.keys(SHELF_GROUPS).filter(g=>list.some(b=>b.g===g)).map(g=>`<h3 class="shelfh">${SHELF_GROUPS[g]} <small>${list.filter(b=>b.g===g).length}</small></h3>${list.filter(b=>b.g===g).map(b=>`<section class="box book"><div class="spine ${b.shelf}"></div><div style="flex:1;min-width:0">
    <h2 style="margin:0">${esc(b.t)}</h2><p class="muted" style="margin:0 0 8px">${esc(b.a)}</p>
    <div class="tags">${b.tags.map(t=>`<span>${READ_WHEN[t]}</span>`).join("")}</div>
    <p style="margin:8px 0">${esc(b.sum)}</p>
    <p class="note"><b>Try this:</b> ${esc(b.try)}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">${links(b).map(([l,u])=>`<a class="btn alt" href="${u}" target="_blank" rel="noopener">${l}</a>`).join("") || `<span class="muted">You uploaded this one in chat, so there's no Drive link yet.</span>`}</div>
  </div></section>`).join("")}`).join("")}`;
}
function bindLib(){
  bindView();
  document.querySelectorAll("[data-shelf]").forEach(b=>b.onclick=()=>{ state.shelf=b.dataset.shelf; state.ltag=""; save(); render(); });
  document.querySelectorAll("[data-ltag]").forEach(b=>b.onclick=()=>{ state.ltag=b.dataset.ltag; render(); });
}
/* ---------- Picture alphabet: each letter becomes a picture of its sound word (original artwork) ---------- */
const INK="#3B352E";
const ALPHA = {
 a:["apple","#C0584A",`<path d="M100 76q1-12 9-18" stroke="#6b4f2a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M108 60q16-10 26 2q-14 9-26-2z" fill="#7f9c63"/>`],
 b:["bunny","#A9978A",`<ellipse cx="64" cy="20" rx="7" ry="20" fill="#E9DDD0" stroke="#8C6C4A" stroke-width="3"/><ellipse cx="81" cy="22" rx="7" ry="20" fill="#E9DDD0" stroke="#8C6C4A" stroke-width="3" transform="rotate(14 81 22)"/><circle cx="116" cy="104" r="5" fill="${INK}"/><circle cx="128" cy="116" r="4" fill="#D98C8C"/>`],
 c:["caterpillar","#8FAA6E",`<circle cx="128" cy="82" r="11" fill="#6F9460"/><circle cx="131" cy="80" r="3" fill="#fff"/><path d="M124 72l-6-14M133 72l5-14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><g fill="#6F9460"><circle cx="72" cy="100" r="5"/><circle cx="71" cy="126" r="5"/><circle cx="84" cy="146" r="5"/><circle cx="108" cy="151" r="5"/></g>`],
 d:["duck","#D3B05A",`<circle cx="122" cy="52" r="5" fill="${INK}"/><path d="M134 54l20 4-20 8z" fill="#D9873E"/><path d="M64 140q-18 2-26-10" stroke="#5F95A3" stroke-width="5" fill="none" stroke-linecap="round"/>`],
 e:["egg","#E6DDCB",`<circle cx="100" cy="98" r="15" fill="#F0C24B"/>`,"#B8A98F"],
 f:["flag","#5F95A3",`<path d="M126 40l34 12-34 12z" fill="#C9805F"/>`],
 g:["grapes","#8A6A8F",`<path d="M74 180q-6 8-2 14" stroke="#7f9c63" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#A88BB0"><circle cx="72" cy="198" r="8"/><circle cx="86" cy="202" r="8"/><circle cx="78" cy="212" r="8"/></g>`],
 h:["house","#B88A5E",`<path d="M46 70L100 30L154 70" stroke="#C0584A" stroke-width="8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><rect x="93" y="120" width="16" height="30" rx="3" fill="#E9DDD0"/>`],
 i:["inchworm","#7F9C63",`<circle cx="95" cy="46" r="3.5" fill="#fff"/><circle cx="105" cy="46" r="3.5" fill="#fff"/><circle cx="95" cy="46" r="1.8" fill="${INK}"/><circle cx="105" cy="46" r="1.8" fill="${INK}"/><path d="M96 52q4 3 8 0" stroke="${INK}" stroke-width="2" fill="none"/>`],
 j:["jellyfish","#5F95A3",`<path d="M90 54q14-30 28 0z" fill="#A3C8D0"/><path d="M95 54q-3 8 0 14M104 54q3 8 0 14M113 54q-3 8 0 14" stroke="#A3C8D0" stroke-width="3" fill="none" stroke-linecap="round"/>`],
 k:["kite","#8C6C4A",`<path d="M158 16l15 19-15 21-15-21z" fill="#C9805F"/><path d="M158 16v40M143 35h30" stroke="#F3E6D6" stroke-width="2"/><path d="M158 56q-6 14-20 22" stroke="${INK}" stroke-width="2" fill="none" stroke-dasharray="4 4"/>`],
 l:["ladder","#8C6C4A",`<path d="M136 40v110" stroke="#8C6C4A" stroke-width="10" stroke-linecap="round"/><g stroke="#B89B74" stroke-width="6" stroke-linecap="round"><path d="M112 58h24M112 84h24M112 110h24M112 136h24"/></g>`],
 m:["mountains","#6E7F5E",`<path d="M68 82l10-8 10 8q-10-3-20 0zM114 82l10-8 10 8q-10-3-20 0z" fill="#fff"/><circle cx="172" cy="44" r="12" fill="#F0C24B"/>`],
 n:["net","#5F95A3",`<g stroke="#A3C8D0" stroke-width="2.5"><path d="M90 104h22M90 122h22M90 140h22M97 96v54M105 96v54"/></g>`],
 o:["orange","#D9873E",`<path d="M100 76q8-14 22-14q-5 13-22 14z" fill="#7f9c63"/><g fill="#B8692E" opacity=".5"><circle cx="86" cy="100" r="2"/><circle cx="114" cy="112" r="2"/><circle cx="96" cy="130" r="2"/></g>`],
 p:["pan","#6B6F73",`<path d="M98 68q-6-10 0-18M114 68q-6-10 0-18M130 68q-6-10 0-18" stroke="#B8A98F" stroke-width="3" fill="none" stroke-linecap="round"/>`],
 q:["queen","#8A6A8F",`<path d="M78 74l6-20 10 12 8-16 8 16 10-12 6 20z" fill="#D3B05A"/><circle cx="102" cy="48" r="4" fill="#C0584A"/>`],
 r:["rain","#5F95A3",`<path d="M120 62q8-14 24-9q12-7 20 5q10 2 9 12h-53z" fill="#DDE6EA"/><g fill="#A3C8D0"><path d="M140 78q-6 10 0 14q6-4 0-14z"/><path d="M156 92q-6 10 0 14q6-4 0-14z"/><path d="M146 110q-6 10 0 14q6-4 0-14z"/></g>`],
 s:["snake","#6F9460",`<circle cx="112" cy="86" r="4" fill="${INK}"/><path d="M124 86l10-2-5 6 8 2" stroke="#C0584A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`],
 t:["tree","#8C6C4A",`<g fill="#8FAA6E"><circle cx="88" cy="46" r="18"/><circle cx="110" cy="40" r="20"/><circle cx="100" cy="60" r="16"/></g><circle cx="96" cy="48" r="4" fill="#C0584A"/>`],
 u:["up","#C9805F",`<path d="M100 66V22M86 36l14-14 14 14" stroke="#5F95A3" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`],
 v:["vine","#6F9460",`<g fill="#8FAA6E"><path d="M66 104q-14-4-16 8q14 4 16-8z"/><path d="M84 132q14-6 20 4q-12 8-20-4z"/><path d="M134 104q14-4 16 8q-14 4-16-8z"/><path d="M116 132q-14-6-20 4q12 8 20-4z"/></g>`],
 w:["waves","#5F95A3",`<path d="M42 84q7-11 16-4M92 84q7-11 16-4M142 84q7-11 16-4" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`],
 x:["fox","#C9805F",`<path d="M62 82l6-22 14 14zM138 82l-6-22-14 14z" fill="#C9805F"/><circle cx="100" cy="114" r="6" fill="${INK}"/><circle cx="90" cy="102" r="3" fill="${INK}"/><circle cx="110" cy="102" r="3" fill="${INK}"/>`],
 y:["yo-yo","#8A6A8F",`<path d="M66 184v12" stroke="${INK}" stroke-width="2"/><circle cx="66" cy="206" r="11" fill="#C9805F"/><circle cx="66" cy="206" r="4" fill="#F3E6D6"/>`],
 z:["zap","#D3B05A",`<path d="M140 64l10-6-4 12 10-4M60 162l-10 6 4-12-10 4" stroke="#B8902F" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`]
};
function alphaSvg(ch, size=120){
  const e=ALPHA[ch]; if(!e) return "";
  const [w,col,deco,stroke]=e;
  return `<svg viewBox="0 -10 200 230" width="${size}" height="${size*1.15}" role="img" aria-label="${ch} for ${w}" style="overflow:visible"><text x="100" y="150" text-anchor="middle" font-family="Andika, sans-serif" font-weight="700" font-size="160" fill="${col}"${stroke?` stroke="${stroke}" stroke-width="3"`:""}>${ch}</text>${deco}</svg>`;
}

/* ---------- Picture alphabet in the app ---------- */
(function(){
  const basePrint = printHtml, baseBindPrint = bindPrint;
  printHtml = function(){
    return `<section class="box alphabox"><h2>Picture alphabet</h2><p class="muted" style="margin:0 0 10px">Each letter is drawn as something that starts with its sound, so the shape and the sound stick together. Tap a card to hear it, or print the set for the wall.</p>
      <div class="alphagrid">${Object.keys(ALPHA).map(c=>`<button class="acard" data-alpha="${c}" aria-label="${c} for ${ALPHA[c][0]}">${alphaSvg(c,92)}<span>${c} · ${ALPHA[c][0]}</span></button>`).join("")}</div>
      <button class="btn alt wide" id="alphaPrint" style="margin-top:12px">Print the cards</button></section>` + basePrint();
  };
  bindPrint = function(){
    baseBindPrint();
    document.querySelectorAll("[data-alpha]").forEach(b=>b.onclick=()=>{ const c=b.dataset.alpha; say(`${c}. ${ALPHA[c][0]}.`, .8); });
    const pb=document.getElementById("alphaPrint");
    if (pb) pb.onclick=()=>{ document.body.classList.add("print-alpha"); window.print(); setTimeout(()=>document.body.classList.remove("print-alpha"),500); };
  };
  const baseMeet = DEMOS.phonics[0];
  DEMOS.phonics[0] = function(w,t,i){
    const steps = baseMeet(w,t,i);
    const s = (w.s||[])[0];
    if (s && s.length===1 && ALPHA[s] && steps.length>1){
      const word = ALPHA[s][0];
      const where = word.startsWith(s) ? "starts" : "ends";
      steps.splice(1,0,{cap:`Picture clue: this ${s} is drawn as a ${word}. ${word[0].toUpperCase()+word.slice(1)} ${where} with the ${s} sound.`, html:`<div class="pop">${alphaSvg(s,150)}</div>`});
    }
    return steps;
  };
})();

window.render = render;
