// Musical Characteristics Database for Quiz Analysis
const PIECE_CHARACTERISTICS = {
    // Medieval Period - 1a
    '1a_anonymous_agnus_dei': {
        keyCharacteristics: [
            'monophonic texture',
            'modal scales',
            'free rhythm',
            'melismatic passages',
            'sacred Latin text',
            'plainchant/Gregorian chant style',
            'no instrumental accompaniment',
            'neumatic and melismatic notation'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Free/unmeasured',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Melismatic',
        function: 'Sacred liturgical'
    },
    
    '1a_anonymous_haec_dies': {
        keyCharacteristics: [
            'monophonic texture',
            'modal scales',
            'joyful, celebratory character',
            'melismatic passages on "Alleluia"',
            'plainchant style',
            'syllabic and neumatic sections',
            'gradual chant for Easter',
            'free rhythmic flow'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Free/unmeasured',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Mixed syllabic/melismatic',
        function: 'Sacred liturgical'
    },
    
    '1a_thomas_aquinas_pange_lingua_gloriosi_mysterium': {
        keyCharacteristics: [
            'hymn structure with verses',
            'monophonic texture',
            'syllabic text setting',
            'modal melody',
            'strophic form',
            'sacred Latin text',
            'simple, memorable melody',
            'processional character'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Measured/regular',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Syllabic',
        function: 'Sacred liturgical hymn'
    },
    
    '1a_hildegard_of_bingen_o_eterne_deus': {
        keyCharacteristics: [
            'wide melodic range',
            'soaring, ecstatic vocal lines',
            'monophonic texture',
            'mystical, expressive character',
            'melismatic passages',
            'modal but with unique intervallic leaps',
            'sacred Latin text',
            'distinctive personal compositional style'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Free/expressive',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Highly melismatic',
        function: 'Sacred antiphon'
    },

    // Medieval Polyphony - 1b
    '1b_leonin_viderunt_omnes': {
        keyCharacteristics: [
            'two-part organum',
            'slow-moving tenor (chant foundation)',
            'florid upper voice (duplum)',
            'Notre Dame School style',
            'modal harmony',
            'rhythmic modes in upper voice',
            'sacred Latin text',
            'early polyphonic development'
        ],
        period: 'Medieval',
        textureType: 'Polyphonic (2-voice)',
        rhythmicStyle: 'Modal rhythm',
        harmonicLanguage: 'Modal intervals',
        vocalStyle: 'Organum style',
        function: 'Sacred gradual organum'
    },
    
    '1b_perotinus_viderunt_omnes': {
        keyCharacteristics: [
            'four-part organum',
            'complex polyphonic texture',
            'slow tenor with three active upper voices',
            'Notre Dame School culmination',
            'rhythmic complexity',
            'voice exchange techniques',
            'modal harmony with increased dissonance',
            'architectural musical structure'
        ],
        period: 'Medieval',
        textureType: 'Polyphonic (4-voice)',
        rhythmicStyle: 'Complex modal rhythm',
        harmonicLanguage: 'Modal with dissonance',
        vocalStyle: 'Complex organum',
        function: 'Sacred gradual organum'
    },
    
    '1b_guillaume_de_machaut_fera_pessima_o_livoris_feritas_fons_totius': {
        keyCharacteristics: [
            'three-part motet',
            'polytextual (three different Latin texts)',
            'Ars Nova rhythmic complexity',
            'isorhythmic technique',
            'tenor as foundation',
            'independent voice parts',
            'complex mensural notation',
            'secular/political themes in sacred form'
        ],
        period: 'Late Medieval (Ars Nova)',
        textureType: 'Polyphonic (3-voice)',
        rhythmicStyle: 'Ars Nova complex rhythm',
        harmonicLanguage: 'Modal with increased chromaticism',
        vocalStyle: 'Polytextual motet',
        function: 'Secular motet'
    },

    // Secular Medieval - 2a
    '2a_bernart_de_ventadorn_can_vei_la_lauzeta_mover': {
        keyCharacteristics: [
            'monophonic troubadour song',
            'vernacular Occitan language',
            'courtly love theme',
            'secular subject matter',
            'modal melody',
            'strophic form',
            'expressive, lyrical character',
            'possible instrumental accompaniment'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Poetic rhythm',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Syllabic with ornaments',
        function: 'Secular courtly song'
    },
    
    '2a_comtessa_de_dia_a_chantar_mer_de_so_queu_no_volria': {
        keyCharacteristics: [
            'monophonic trobairitz song',
            'vernacular Occitan language',
            'female perspective on courtly love',
            'modal melody',
            'expressive, personal character',
            'secular love poetry',
            'strophic structure',
            'rare example of female composer'
        ],
        period: 'Medieval',
        textureType: 'Monophonic',
        rhythmicStyle: 'Poetic rhythm',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Syllabic with expression',
        function: 'Secular courtly song'
    },
    
    '2a_guillaume_de_machaut_dame_de_qui_toute_ma_joie_vient': {
        keyCharacteristics: [
            'polyphonic chanson',
            'vernacular French language',
            'courtly love theme',
            'Ars Nova rhythmic sophistication',
            'balanced voice parts',
            'secular subject matter',
            'refined harmonic language',
            'fixed form (possibly ballade or rondeau)'
        ],
        period: 'Late Medieval (Ars Nova)',
        textureType: 'Polyphonic',
        rhythmicStyle: 'Ars Nova refined rhythm',
        harmonicLanguage: 'Modal with sophistication',
        vocalStyle: 'Polyphonic chanson',
        function: 'Secular courtly song'
    },
    
    '2a_anonymous_la_quinte_estampie_real_estampie': {
        keyCharacteristics: [
            'instrumental dance music',
            'repetitive sectional structure',
            'energetic, rhythmic character',
            'modal harmonies',
            'estampie dance form',
            'secular instrumental music',
            'likely performed on vielles, harps',
            'puncta (repeated sections) with different endings'
        ],
        period: 'Medieval',
        textureType: 'Instrumental',
        rhythmicStyle: 'Dance rhythm',
        harmonicLanguage: 'Modal',
        vocalStyle: 'N/A - Instrumental',
        function: 'Secular dance music'
    },

    // Renaissance Mass - 2b
    '2b_guillaume_de_machaut_sanctus': {
        keyCharacteristics: [
            'polyphonic mass setting',
            'four-voice texture',
            'Ars Nova style',
            'rhythmic complexity',
            'sacred Latin text (Sanctus)',
            'early complete mass setting',
            'modal harmony',
            'architectural structure'
        ],
        period: 'Late Medieval/Early Renaissance',
        textureType: 'Polyphonic (4-voice)',
        rhythmicStyle: 'Ars Nova complex',
        harmonicLanguage: 'Modal',
        vocalStyle: 'Polyphonic mass',
        function: 'Sacred liturgical mass'
    },
    
    '2b_josquin_de_prez_sanctus': {
        keyCharacteristics: [
            'Renaissance polyphonic mass',
            'imitative counterpoint',
            'four to five voice texture',
            'balanced voice leading',
            'harmonic clarity',
            'text-music relationship',
            'sacred Latin text',
            'High Renaissance style'
        ],
        period: 'High Renaissance',
        textureType: 'Polyphonic (4-5 voice)',
        rhythmicStyle: 'Balanced Renaissance rhythm',
        harmonicLanguage: 'Modal with triadic harmony',
        vocalStyle: 'Imitative polyphony',
        function: 'Sacred liturgical mass'
    },
    
    '2b_giovani_perligui_da_palestrina_sanctus': {
        keyCharacteristics: [
            'Late Renaissance polyphonic mass',
            'smooth, controlled counterpoint',
            'four to six voice texture',
            'conservative harmonic language',
            'clear text declamation',
            'balanced phrase structure',
            'Roman school style',
            'perfect voice leading'
        ],
        period: 'Late Renaissance',
        textureType: 'Polyphonic (4-6 voice)',
        rhythmicStyle: 'Controlled Renaissance rhythm',
        harmonicLanguage: 'Modal/tonal',
        vocalStyle: 'Smooth polyphony',
        function: 'Sacred liturgical mass'
    },

    // Renaissance Vocal - 3a
    '3a_josquin_de_prez_ave_maria_virgo_serena': {
        keyCharacteristics: [
            'Renaissance motet',
            'imitative polyphonic texture',
            'four-voice writing',
            'text painting techniques',
            'balanced phrase structure',
            'sacred Latin text',
            'harmonic sophistication',
            'masterpiece of Renaissance polyphony'
        ],
        period: 'High Renaissance',
        textureType: 'Polyphonic (4-voice)',
        rhythmicStyle: 'Flowing Renaissance rhythm',
        harmonicLanguage: 'Modal with harmonic direction',
        vocalStyle: 'Imitative motet',
        function: 'Sacred motet'
    },
    
    '3a_jacques_arcadet_il_bianco_e_dolce_signo': {
        keyCharacteristics: [
            'Renaissance madrigal',
            'vernacular Italian text',
            'four-voice polyphonic texture',
            'text expression and word painting',
            'homophonic and polyphonic sections',
            'secular love poetry',
            'harmonic sophistication',
            'expressive melodic lines'
        ],
        period: 'Renaissance',
        textureType: 'Polyphonic (4-voice)',
        rhythmicStyle: 'Flexible Renaissance rhythm',
        harmonicLanguage: 'Modal/early tonal',
        vocalStyle: 'Madrigal style',
        function: 'Secular madrigal'
    },
    
    '3a_john_farmer_fair_phyllis': {
        keyCharacteristics: [
            'English madrigal',
            'vernacular English text',
            'four to five voice texture',
            'word painting and text expression',
            'pastoral subject matter',
            'homophonic and polyphonic textures',
            'fa-la-la refrains',
            'English madrigal school style'
        ],
        period: 'Late Renaissance',
        textureType: 'Polyphonic (4-5 voice)',
        rhythmicStyle: 'English madrigal rhythm',
        harmonicLanguage: 'Modal/tonal',
        vocalStyle: 'English madrigal',
        function: 'Secular madrigal'
    }
};

// Vocabulary builder for musical characteristics
const MUSICAL_VOCABULARY = {
    texture: {
        monophonic: 'Single melodic line without accompaniment',
        polyphonic: 'Multiple independent melodic lines sounding simultaneously',
        homophonic: 'Melody with harmonic accompaniment',
        homorhythmic: 'All voices move together in the same rhythm'
    },
    
    rhythm: {
        'free rhythm': 'Unmeasured, following natural speech patterns',
        'modal rhythm': 'Medieval rhythmic patterns based on poetic meters',
        'measured rhythm': 'Regular, consistent beat patterns',
        isorhythmic: 'Repeated rhythmic pattern (talea) in medieval music'
    },
    
    harmony: {
        modal: 'Based on medieval church modes rather than major/minor keys',
        'triadic harmony': 'Based on three-note chords (triads)',
        dissonance: 'Clashing sounds that create tension',
        consonance: 'Stable, restful harmonic sounds'
    },
    
    vocal_style: {
        syllabic: 'One note per syllable of text',
        neumatic: 'Small groups of notes (2-4) per syllable',
        melismatic: 'Many notes sung on a single syllable',
        'word painting': 'Music illustrates the meaning of the text'
    },
    
    forms: {
        organum: 'Early polyphony with added voice(s) to chant',
        motet: 'Polyphonic vocal composition, often with multiple texts',
        madrigal: 'Secular Renaissance vocal music with expressive text setting',
        chanson: 'French secular song',
        estampie: 'Medieval instrumental dance form',
        'mass ordinary': 'Standard parts of the Catholic mass (Kyrie, Gloria, Credo, Sanctus, Agnus Dei)'
    },
    
    period_characteristics: {
        Medieval: 'Monophonic chant, early polyphony, modal scales, sacred focus',
        'Ars Nova': '14th century style with rhythmic complexity and secular themes',
        Renaissance: 'Balanced polyphony, text expression, harmonic clarity',
        'Notre Dame School': '12th-13th century Parisian polyphony (Léonin, Pérotin)'
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PIECE_CHARACTERISTICS, MUSICAL_VOCABULARY };
}