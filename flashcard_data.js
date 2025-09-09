// Flashcard data structure for Medieval & Renaissance Music
const FLASHCARD_DATA = [
    // Lecture 1a - Medieval Music Fundamentals
    {
        id: 1,
        lecture: "1a",
        topic: "Musical Terminology",
        front: "What is the definition of 'timbre'?",
        back: "The quality or color of a sound that distinguishes it from other sounds of the same pitch and volume. It's what makes a violin sound different from a trumpet playing the same note.",
        backSimple: "The unique 'color' or quality of a sound. It's why a guitar sounds different from a piano even when playing the same note."
    },
    {
        id: 2,
        lecture: "1a",
        topic: "Musical Terminology",
        front: "Define 'pitch' in musical terms",
        back: "The highness or lowness of a sound, determined by the frequency of sound waves. Higher frequency = higher pitch.",
        backSimple: "How high or low a sound is. Like the difference between a bird's tweet (high pitch) and a dog's bark (low pitch)."
    },
    {
        id: 3,
        lecture: "1a",
        topic: "Musical Terminology",
        front: "What is 'rhythm'?",
        back: "The pattern of long and short sounds and silences in music, creating the time element of music.",
        backSimple: "The beat pattern in music. Like clapping along to your favorite song - that's rhythm!"
    },
    {
        id: 4,
        lecture: "1a",
        topic: "Musical Terminology",
        front: "Define 'melody'",
        back: "A sequence of musical tones that form the main tune or voice in a piece of music.",
        backSimple: "The main tune of a song - the part you hum or sing along to."
    },
    {
        id: 5,
        lecture: "1a",
        topic: "Musical Terminology",
        front: "What is 'harmony'?",
        back: "The combination of different musical notes played or sung simultaneously to create chords and chord progressions.",
        backSimple: "When multiple notes are played together to make chords, like playing several piano keys at once."
    },
    {
        id: 6,
        lecture: "1a",
        topic: "Medieval Chant",
        front: "What are the main characteristics of Gregorian chant?",
        back: "Monophonic (single melodic line), no harmony, free rhythm, Latin text, sacred purpose, modal scales, no instrumental accompaniment.",
        backSimple: "Ancient church singing with just one melody line (no harmony), sung in Latin without instruments. Sounds very peaceful and flowing."
    },
    {
        id: 7,
        lecture: "1a",
        topic: "Medieval Chant",
        front: "What does 'monophonic' mean in medieval music?",
        back: "Music consisting of a single melodic line without harmony or accompaniment. All voices sing the same melody in unison.",
        backSimple: "Just one melody line - everyone sings the same tune together, like singing 'Happy Birthday' with friends."
    },
    {
        id: 8,
        lecture: "1a",
        topic: "Medieval Chant",
        front: "What are church modes?",
        back: "Medieval scale systems used before major and minor keys. Each mode has a different pattern of whole and half steps, creating unique musical characters.",
        backSimple: "Old-fashioned musical scales used in medieval times. Each one had its own special sound and feeling, different from modern major and minor scales."
    },
    {
        id: 9,
        lecture: "1a",
        topic: "Medieval Chant",
        front: "What is the significance of the 'Agnus Dei'?",
        back: "Part of the Ordinary of the Mass meaning 'Lamb of God.' It's sung near the end of the Communion section and has a distinctive triple structure (sung three times).",
        backSimple: "A church song meaning 'Lamb of God' that's sung three times during Catholic Mass. It's one of the standard parts of the church service."
    },
    {
        id: 10,
        lecture: "1a",
        topic: "Medieval Composers",
        front: "Who was Hildegard of Bingen?",
        back: "12th-century German Benedictine abbess, mystic, and composer. One of the few known medieval female composers, known for her visionary writings and distinctive musical compositions.",
        backSimple: "A famous nun and composer from medieval Germany (1100s). She's one of the few women composers we know about from that time period."
    },
    {
        id: 11,
        lecture: "1a",
        topic: "Medieval Composers",
        front: "What is distinctive about Hildegard's musical style?",
        back: "Wide melodic ranges, soaring lines that often exceed typical chant ranges, mystical and expressive character, often reflecting her religious visions.",
        backSimple: "Her songs have very high and low notes (like a rollercoaster of sound) and feel very emotional and spiritual."
    },
    {
        id: 12,
        lecture: "1a",
        topic: "Medieval Music Theory",
        front: "What is musical notation and why was it important?",
        back: "A system of symbols to represent musical sounds in writing. It was revolutionary because it allowed music to be preserved, transmitted, and standardized across different locations and time periods.",
        backSimple: "A way to write down music using symbols (like sheet music today). Before this, people could only remember songs in their heads!"
    },

    // Lecture 1b - Medieval Polyphony
    {
        id: 13,
        lecture: "1b",
        topic: "Polyphony",
        front: "What is polyphony?",
        back: "Music with multiple independent melodic lines sounding simultaneously, as opposed to monophonic (single line) music.",
        backSimple: "Music where several different melodies are sung or played at the same time, like a choir where different people sing different tunes."
    },
    {
        id: 14,
        lecture: "1b",
        topic: "Polyphony",
        front: "What is organum?",
        back: "The earliest form of medieval polyphony, where one or more voices are added to an existing chant melody. The added voices move in parallel or contrary motion to the original chant.",
        backSimple: "Early church music where they took an old chant melody and added extra voices singing along with it in harmony."
    },
    {
        id: 15,
        lecture: "1b",
        topic: "Notre Dame School",
        front: "What was the Notre Dame School?",
        back: "A group of composers centered at Notre Dame Cathedral in Paris (c. 1150-1250) who developed sophisticated polyphonic music, particularly organum.",
        backSimple: "A group of church musicians in Paris who created fancy multi-part church music at the famous Notre Dame Cathedral."
    },
    {
        id: 16,
        lecture: "1b",
        topic: "Notre Dame School",
        front: "Who was Léonin?",
        back: "A composer at Notre Dame Cathedral (c. 1150-1201), credited with creating the first great collection of two-part organum for the church year.",
        backSimple: "An important church musician at Notre Dame who wrote lots of two-part harmony music for church services."
    },
    {
        id: 17,
        lecture: "1b",
        topic: "Notre Dame School",
        front: "Who was Pérotin?",
        back: "A composer at Notre Dame (c. 1200), successor to Léonin, famous for creating three- and four-part organum, representing the height of medieval polyphonic complexity.",
        backSimple: "A church musician who came after Léonin and made even more complex music with 3 or 4 different parts singing together."
    },
    {
        id: 18,
        lecture: "1b",
        topic: "Notre Dame School",
        front: "What is 'Viderunt Omnes' and why is it significant?",
        back: "A famous gradual chant that both Léonin and Pérotin set in organum. It shows the evolution from two-part (Léonin) to four-part (Pérotin) polyphony, demonstrating increasing complexity in medieval music.",
        backSimple: "A church song that both Léonin and Pérotin arranged - first with 2 parts, then with 4 parts, showing how church music got more complex over time."
    },
    {
        id: 19,
        lecture: "1b",
        topic: "Medieval Forms",
        front: "What is a motet?",
        back: "A polyphonic vocal composition that developed in the 13th century, featuring multiple text layers often in different languages, built on a foundation of a pre-existing chant melody.",
        backSimple: "A type of church song where different people sing different words (sometimes even in different languages) at the same time over a basic melody."
    },
    {
        id: 20,
        lecture: "1b",
        topic: "Medieval Forms",
        front: "How is a motet structured?",
        back: "Built on a tenor (foundational voice from chant), with upper voices (duplum, triplum) having different texts, often in different languages. Each voice maintains rhythmic independence.",
        backSimple: "Has a basic melody at the bottom (tenor), with 2-3 other parts singing different words on top, each doing their own rhythm."
    },
    {
        id: 21,
        lecture: "1b",
        topic: "Ars Nova",
        front: "What was the Ars Nova period?",
        back: "A musical movement in 14th-century France characterized by new rhythmic flexibility, more complex notation, and increased secular music composition.",
        backSimple: "A time in the 1300s when French music became more complex and interesting, with better ways to write down rhythms."
    },
    {
        id: 22,
        lecture: "1b",
        topic: "Ars Nova",
        front: "Who was Guillaume de Machaut?",
        back: "The most important composer of the Ars Nova period (c. 1300-1377), known for both sacred and secular works, and for writing the first complete polyphonic setting of the Mass Ordinary.",
        backSimple: "The most famous composer of the 1300s who wrote both church music and love songs. He was the first to write a complete multi-part Mass."
    },
    {
        id: 23,
        lecture: "1b",
        topic: "Guillaume de Machaut",
        front: "What is Machaut's 'Fera pessima / O livoris feritas / Fons totius'?",
        back: "A complex three-part motet by Machaut featuring three different Latin texts sung simultaneously, demonstrating the sophisticated polytextual technique of Ars Nova motets.",
        backSimple: "A complicated church song where three different people sing three completely different sets of words at the same time."
    },

    // Lecture 2a - Secular Music
    {
        id: 24,
        lecture: "2a",
        topic: "Secular Music",
        front: "What is secular music?",
        back: "Non-religious music, often dealing with themes of love, nature, courtly life, and worldly concerns, as opposed to sacred music used in religious contexts.",
        backSimple: "Music that's not for church - songs about love, everyday life, and fun topics instead of religious themes."
    },
    {
        id: 25,
        lecture: "2a",
        topic: "Troubadours",
        front: "Who were the troubadours?",
        back: "Poet-musicians of 12th-13th century southern France who composed and performed secular songs, typically about courtly love, chivalry, and aristocratic values.",
        backSimple: "Medieval French singer-songwriters who wrote and sang love songs for nobles and knights."
    },
    {
        id: 26,
        lecture: "2a",
        topic: "Troubadours",
        front: "What language did troubadours use?",
        back: "Occitan (Old Provençal), the language of southern France, which was considered more refined and suitable for poetry than northern French dialects.",
        backSimple: "Occitan - an old form of French from southern France that sounded more elegant and poetic."
    },
    {
        id: 27,
        lecture: "2a",
        topic: "Troubadours",
        front: "Who was Bernart de Ventadorn?",
        back: "One of the most famous troubadours (c. 1130-1200), known for his emotionally expressive love songs and his influence on courtly love poetry and music.",
        backSimple: "A very famous medieval love song writer who wrote beautiful, emotional songs about romance."
    },
    {
        id: 28,
        lecture: "2a",
        topic: "Troubadours",
        front: "What is 'Can vei la lauzeta mover' about?",
        back: "Bernart de Ventadorn's famous song about seeing a lark move joyfully in the sky, which makes the speaker reflect on his own unrequited love and emotional suffering.",
        backSimple: "A love song about seeing a happy bird flying, which makes the singer sad because his love doesn't love him back."
    },
    {
        id: 29,
        lecture: "2a",
        topic: "Troubadours",
        front: "Who was the Comtessa de Dia?",
        back: "A female troubadour (trobairitz) of the late 12th century, one of the few women whose secular songs survive from the medieval period.",
        backSimple: "A medieval woman who wrote love songs - very rare for that time period when most composers were men."
    },
    {
        id: 30,
        lecture: "2a",
        topic: "Troubadours",
        front: "What is the significance of 'A chantar m'er de so qu'eu no volria'?",
        back: "The Comtessa de Dia's song about singing of something she would rather not - her betrayal in love. It's significant as one of the rare surviving works by a medieval woman composer.",
        backSimple: "A song by a medieval woman about having to sing about her broken heart. Important because we have so few songs by women from that time."
    },
    {
        id: 31,
        lecture: "2a",
        topic: "Courtly Love",
        front: "What is courtly love?",
        back: "A medieval literary and cultural concept featuring idealized, often unrequited love between a knight and a noble lady, emphasizing honor, nobility, and refined emotion.",
        backSimple: "A medieval idea of perfect, polite love - usually a knight loving a lady from afar in a very respectful, noble way."
    },
    {
        id: 32,
        lecture: "2a",
        topic: "Guillaume de Machaut",
        front: "What is Machaut's 'Dame, de qui toute ma joie vient'?",
        back: "A chanson (secular song) by Guillaume de Machaut expressing devotion to a lady who is the source of all the speaker's joy, exemplifying courtly love themes in music.",
        backSimple: "A love song where the singer says a lady is the source of all his happiness - typical courtly love style."
    },
    {
        id: 33,
        lecture: "2a",
        topic: "Instrumental Music",
        front: "What is an estampie?",
        back: "A medieval instrumental dance form, typically performed on instruments like vielles or harps, characterized by repeated sections and energetic rhythms.",
        backSimple: "A lively medieval dance song played on instruments like harps or fiddles, with catchy repeated sections."
    },
    {
        id: 34,
        lecture: "2a",
        topic: "Instrumental Music",
        front: "What is 'La quinte estampie real'?",
        back: "The fifth royal estampie - an anonymous medieval instrumental dance piece that exemplifies the estampie form with its distinctive repeated sections and dance-like character.",
        backSimple: "A medieval dance song played on instruments - the fifth one in a collection of 'royal' dance pieces."
    },
    {
        id: 35,
        lecture: "2a",
        topic: "Medieval Instruments",
        front: "What instruments were common in medieval secular music?",
        back: "Vielle (medieval fiddle), harp, lute, recorder, drums, and various other wind and string instruments, often used to accompany singing or for instrumental dance music.",
        backSimple: "Medieval fiddle, harp, lute (like a guitar), flute-like instruments, and drums - used for dance music and accompanying songs."
    },

    // Additional synthesis questions
    {
        id: 36,
        lecture: "1a-1b",
        topic: "Music Evolution",
        front: "How did medieval music evolve from monophony to polyphony?",
        back: "Started with single-line Gregorian chant, then added parallel voices (organum), developed into independent voice parts (Notre Dame School), and culminated in complex multi-textual compositions (motets).",
        backSimple: "Church music started simple (one melody), then they added harmony parts, and eventually created complex songs with multiple different melodies at once."
    },
    {
        id: 37,
        lecture: "1b-2a",
        topic: "Sacred vs Secular",
        front: "What are the key differences between sacred and secular medieval music?",
        back: "Sacred: Latin text, religious themes, modal, often polyphonic (later period). Secular: vernacular languages, worldly themes (love, nature), monophonic melodies, instrumental accompaniment.",
        backSimple: "Church music: Latin words, religious topics, complex harmonies. Non-church music: regular language, love songs, simpler melodies with instruments."
    },
    {
        id: 38,
        lecture: "1a-2a",
        topic: "Women in Medieval Music",
        front: "What role did women play in medieval music?",
        back: "Limited but significant roles: Hildegard of Bingen as composer-mystic in religious contexts, trobairitz like Comtessa de Dia in secular courtly settings, though most women's musical contributions went unrecorded.",
        backSimple: "Women rarely got to compose music back then, but a few like Hildegard (church music) and Comtessa de Dia (love songs) became famous."
    },
    {
        id: 39,
        lecture: "1b-2a",
        topic: "Guillaume de Machaut",
        front: "Why is Guillaume de Machaut considered a pivotal figure in medieval music?",
        back: "He bridged sacred and secular traditions, mastered both motet and chanson forms, wrote the first complete polyphonic Mass setting, and epitomized the sophisticated Ars Nova style.",
        backSimple: "He was amazing at both church music and love songs, wrote the first complete multi-part Mass, and represented the best of 14th-century musical style."
    },
    {
        id: 40,
        lecture: "1a-2a",
        topic: "Medieval Music Context",
        front: "How did the social and cultural context influence medieval music?",
        back: "Church dominated intellectual life (sacred music focus), courtly culture promoted secular love songs, limited literacy meant oral tradition, social hierarchy reflected in musical complexity and accessibility.",
        backSimple: "The church controlled most music (religious songs), nobles liked love songs, most people couldn't read so they learned by hearing, and fancy music was for rich people."
    }
];

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FLASHCARD_DATA;
}