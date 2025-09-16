class MusicQuizApp {
    constructor() {
        this.pieces = [];
        this.currentQuiz = null;
        this.currentPlayer = null;
        this.progressData = this.loadProgress();
        
        // Flashcard system
        this.flashcards = [];
        this.currentFlashcardIndex = 0;
        this.isFlipping = false;
        this.flashcardSession = {
            active: false,
            correct: 0,
            incorrect: 0,
            currentCards: []
        };
        
        // Exam Simulation system
        this.examSession = {
            active: false,
            pieces: [],
            currentIndex: 0,
            startTime: null,
            timeRemaining: 30 * 60, // 30 minutes in seconds
            timer: null,
            answers: [],
            totalScore: 0,
            playCount: 0
        };
        
        // Analytics system
        this.analytics = {
            listeningFrequency: {},
            examResults: [],
            studyTime: {},
            lastStudyDate: {}
        };
        
        this.init();
    }

    async init() {
        await this.loadMusicData();
        this.loadFlashcardData();
        this.loadCharacteristicsData();
        this.loadAnalyticsData();
        this.setupEventListeners();
        this.renderStudySection();
        this.renderProgressSection();
        this.populateAssignmentFilters();
        this.setupFlashcardFilters();
        this.updateAnalyticsDashboard();
    }

    async loadMusicData() {
        // Try to load from JSON database first (after audio processing)
        try {
            const response = await fetch('music_database.json');
            if (response.ok) {
                const database = await response.json();
                this.pieces = database.pieces;
                console.log(`Loaded ${this.pieces.length} pieces from JSON database`);
                return;
            }
        } catch (error) {
            console.log('JSON database not found, loading from CSV data');
        }

        // Fallback: Load from CSV data (before audio processing)
        this.pieces = [
            { assignment: '1a', composer: 'Anonymous', title: 'Agnus Dei', genre: 'Chant', audioFile: 'audio/1a_anonymous_agnus_dei.mp3', youtubeUrl: 'https://youtu.be/6KF_dfuDOyc' },
            { assignment: '1a', composer: 'Anonymous', title: 'Haec Dies', genre: 'Chant', audioFile: 'audio/1a_anonymous_haec_dies.mp3', youtubeUrl: 'https://youtu.be/-irKRiYnP8I' },
            { assignment: '1a', composer: 'Thomas Aquinas', title: 'Pange lingua gloriosi mysterium', genre: 'Hymn', audioFile: 'audio/1a_thomas_aquinas_pange_lingua_gloriosi_mysterium.mp3', youtubeUrl: 'https://youtu.be/U-AsvDn87fo' },
            { assignment: '1a', composer: 'Hildegard of Bingen', title: 'O eterne deus', genre: 'Chant', audioFile: 'audio/1a_hildegard_of_bingen_o_eterne_deus.mp3', youtubeUrl: 'https://youtu.be/sC-OjxeW8xc' },
            { assignment: '1b', composer: 'Leonin', title: 'Viderunt Omnes', genre: 'two-part organum', audioFile: 'audio/1b_leonin_viderunt_omnes.mp3', youtubeUrl: 'https://youtu.be/_p9WQlyVPrA' },
            { assignment: '1b', composer: 'Perotinus', title: 'Viderunt Omnes', genre: 'four-part organum', audioFile: 'audio/1b_perotinus_viderunt_omnes.mp3', youtubeUrl: 'https://youtu.be/KA6oq_UYbyA' },
            { assignment: '1b', composer: 'Guillaume de Machaut', title: 'Fera pessima / O livoris feritas / Fons totius', genre: 'Motet', audioFile: 'audio/1b_guillaume_de_machaut_fera_pessima_o_livoris_feritas_fons_totius.mp3', youtubeUrl: 'https://youtu.be/vcM35785Peo' },
            { assignment: '2a', composer: 'Bernart de Ventadorn', title: 'Can vei la lauzeta mover', genre: 'Troubador Song', audioFile: 'audio/2a_bernart_de_ventadorn_can_vei_la_lauzeta_mover.mp3', youtubeUrl: 'https://youtu.be/OK2qe4g2i20' },
            { assignment: '2a', composer: 'Comtessa de Dia', title: "A chantar m'er de so qu'eu no volria", genre: 'Troubador Song', audioFile: 'audio/2a_comtessa_de_dia_a_chantar_mer_de_so_queu_no_volria.mp3', youtubeUrl: 'https://youtu.be/lsRqvTnciUA?list=OLAK5uy_nLPHa2LIVnVInxlUla7CpEOuNNOa8kNK8' },
            { assignment: '2a', composer: 'Guillaume de Machaut', title: 'Dame, de qui toute ma joie vient', genre: 'Chanson', audioFile: 'audio/2a_guillaume_de_machaut_dame_de_qui_toute_ma_joie_vient.mp3', youtubeUrl: 'https://youtu.be/u65rzEfxbqA' },
            { assignment: '2a', composer: 'Anonymous', title: 'La quinte estampie real', genre: 'Estampie', audioFile: 'audio/2a_anonymous_la_quinte_estampie_real_estampie.mp3', youtubeUrl: 'https://youtu.be/AyrggAG8aMY' },
            // New songs added from CSV
            { assignment: '2b', composer: 'Guillaume de Machaut', title: 'Sanctus', genre: 'Polyphonic Mass', audioFile: 'audio/2b_guillaume_de_machaut_sanctus.mp3', youtubeUrl: 'https://youtu.be/EVzLLtB6KRU' },
            { assignment: '2b', composer: 'Josquin de Prez', title: 'Sanctus', genre: 'Polyphonic Mass', audioFile: 'audio/2b_josquin_de_prez_sanctus.mp3', youtubeUrl: 'https://youtu.be/KhUFNWKU_W4' },
            { assignment: '2b', composer: 'Giovani Perligui da Palestrina', title: 'Sanctus', genre: 'Polyphonic Mass', audioFile: 'audio/2b_giovani_perligui_da_palestrina_sanctus.mp3', youtubeUrl: 'https://youtu.be/O3HLzfnzBL0' },
            { assignment: '3a', composer: 'Josquin de Prez', title: 'Ave Maria Virgo Serena', genre: 'Motet', audioFile: 'audio/3a_josquin_de_prez_ave_maria_virgo_serena.mp3', youtubeUrl: 'https://youtu.be/xGkb5KFwx1I' },
            { assignment: '3a', composer: 'Jacques Arcadet', title: 'Il bianco e dolce signo', genre: 'Madrigal', audioFile: 'audio/3a_jacques_arcadet_il_bianco_e_dolce_signo.mp3', youtubeUrl: 'https://youtu.be/GUH11wqPRfU' },
            { assignment: '3a', composer: 'John farmer', title: 'Fair Phyllis', genre: 'Madrigal', audioFile: 'audio/3a_john_farmer_fair_phyllis.mp3', youtubeUrl: 'https://youtu.be/D46R1Te0_VY' },
            { assignment: '3b', composer: 'Miguel Fuenllana', title: 'Paseabase el rey', genre: 'Lute Song', audioFile: 'audio/3b_miguel_fuenllana_paseabase_el_rey.mp3', youtubeUrl: 'https://youtu.be/I7F3sfyDl5U' },
            { assignment: '3b', composer: 'John Downland', title: 'Flow My Tears', genre: 'Lute Song', audioFile: 'audio/3b_john_downland_flow_my_tears.mp3', youtubeUrl: 'https://youtu.be/u3clX2CJqzs' },
            { assignment: '3b', composer: 'Tielman Susato', title: 'La Mourisque', genre: 'Ronde', audioFile: 'audio/3b_tielman_susato_la_mourisque.mp3', youtubeUrl: 'https://youtu.be/Imh7_XQRJxE' },
            { assignment: '3b', composer: 'Tielman Susato', title: 'La dona', genre: 'Pavane and Galliard', audioFile: 'audio/3b_tielman_susato_la_dona.mp3', youtubeUrl: 'https://youtu.be/Ln7ea-5dsoo' }
        ];
        
        console.log(`Loaded ${this.pieces.length} pieces from CSV data`);
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('study-btn').addEventListener('click', () => this.showSection('study'));
        document.getElementById('quiz-btn').addEventListener('click', () => this.showSection('quiz'));
        document.getElementById('exam-sim-btn').addEventListener('click', () => this.showSection('exam-sim'));
        document.getElementById('flashcards-btn').addEventListener('click', () => this.showSection('flashcards'));
        document.getElementById('analytics-btn').addEventListener('click', () => this.showSection('analytics'));
        document.getElementById('progress-btn').addEventListener('click', () => this.showSection('progress'));

        // Study section
        document.getElementById('assignment-filter').addEventListener('change', (e) => {
            this.renderStudySection(e.target.value);
        });

        // Player controls
        document.getElementById('play-again').addEventListener('click', () => this.playCurrentAudio());
        document.getElementById('close-player').addEventListener('click', () => this.closePlayer());

        // Quiz section
        document.getElementById('quiz-difficulty').addEventListener('change', (e) => this.updateDifficultyDescription(e.target.value));
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('quiz-form').addEventListener('submit', (e) => this.submitAnswer(e));
        document.getElementById('replay-btn').addEventListener('click', () => this.replayQuizAudio());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('new-quiz').addEventListener('click', () => this.resetQuiz());

        // Flashcard section
        document.getElementById('flashcard-difficulty').addEventListener('change', () => this.onFlashcardDifficultyChange());
        document.getElementById('flashcard-lecture-filter').addEventListener('change', () => this.applyFlashcardFilters());
        document.getElementById('flashcard-topic-filter').addEventListener('change', () => this.applyFlashcardFilters());
        document.getElementById('shuffle-flashcards').addEventListener('click', () => this.shuffleFlashcards());
        document.getElementById('reset-progress-btn').addEventListener('click', () => this.resetFlashcardProgress());
        document.getElementById('start-flashcards').addEventListener('click', () => this.startFlashcardSession());
        document.getElementById('flip-card').addEventListener('click', () => this.flipFlashcard());
        document.getElementById('flashcard').addEventListener('click', () => this.flipFlashcard());
        document.getElementById('correct-btn').addEventListener('click', () => this.respondToFlashcard(true));
        document.getElementById('incorrect-btn').addEventListener('click', () => this.respondToFlashcard(false));
        document.getElementById('next-card').addEventListener('click', () => this.nextFlashcard());
        document.getElementById('study-again').addEventListener('click', () => this.startFlashcardSession());
        
        // Mobile swipe gestures for flashcards
        this.setupSwipeGestures();
        
        // Exam simulation section
        document.getElementById('start-exam-sim').addEventListener('click', () => this.startExamSimulation());
        document.getElementById('replay-exam-audio').addEventListener('click', () => this.replayExamAudio());
        document.getElementById('reveal-info').addEventListener('click', () => this.revealPieceInfo());
        document.getElementById('exam-question-form').addEventListener('submit', (e) => this.submitExamAnswer(e));
        document.getElementById('next-exam-piece').addEventListener('click', () => this.nextExamPiece());
        document.getElementById('retake-exam').addEventListener('click', () => this.resetExamSimulation());
        document.getElementById('export-results').addEventListener('click', () => this.exportStudyChart());
        
        // Analytics section
        document.getElementById('generate-study-plan').addEventListener('click', () => this.generateStudyPlan());
        document.getElementById('show-reference').addEventListener('click', () => this.showReferenceModal());
        document.getElementById('export-analytics').addEventListener('click', () => this.exportAnalyticsData());
        
        // Reference modal controls
        document.getElementById('close-reference').addEventListener('click', () => this.hideReferenceModal());
        document.getElementById('print-chart').addEventListener('click', () => this.printReferenceChart());
        document.getElementById('reference-modal').addEventListener('click', (e) => {
            if (e.target.id === 'reference-modal') this.hideReferenceModal();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active from nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section and activate nav button
        document.getElementById(`${sectionName}-section`).classList.add('active');
        document.getElementById(`${sectionName}-btn`).classList.add('active');
    }

    populateAssignmentFilters() {
        const assignments = [...new Set(this.pieces.map(piece => piece.assignment))].sort();
        
        const studyFilter = document.getElementById('assignment-filter');
        const quizFilter = document.getElementById('quiz-assignment');
        
        assignments.forEach(assignment => {
            const option1 = new Option(`Assignment ${assignment}`, assignment);
            const option2 = new Option(`Assignment ${assignment}`, assignment);
            studyFilter.appendChild(option1);
            quizFilter.appendChild(option2);
        });
    }

    renderStudySection(filterAssignment = 'all') {
        const pieceList = document.getElementById('piece-list');
        const filteredPieces = filterAssignment === 'all' ? 
            this.pieces : 
            this.pieces.filter(piece => piece.assignment === filterAssignment);

        pieceList.innerHTML = filteredPieces.map(piece => `
            <div class="piece-card" onclick="app.playPiece('${piece.audioFile}', '${piece.title}', '${piece.composer}', '${piece.genre}', '${piece.assignment}', '${piece.youtubeUrl || ''}')">
                <div class="piece-title">${piece.title}</div>
                <div class="piece-composer">${piece.composer}</div>
                <div class="piece-genre">${piece.genre}</div>
                <span class="piece-assignment">Assignment ${piece.assignment}</span>
                <div class="piece-status" style="font-size: 0.7rem; color: #6c757d; margin-top: 0.5rem;">
                    ${this.checkAudioAvailable(piece.audioFile) ? '🎵 Audio Ready' : '🔗 YouTube Link'}
                </div>
            </div>
        `).join('');
    }

    checkAudioAvailable(audioFile) {
        // Check if this file exists in our processed database
        const processedFiles = [
            'audio/1a_anonymous_agnus_dei.mp3',
            'audio/1a_anonymous_haec_dies.mp3',
            'audio/1a_hildegard_of_bingen_o_eterne_deus.mp3',
            'audio/1a_thomas_aquinas_pange_lingua_gloriosi_mysterium.mp3',
            'audio/1b_guillaume_de_machaut_fera_pessima_o_livoris_feritas_fons_totius.mp3',
            'audio/1b_leonin_viderunt_omnes.mp3',
            'audio/1b_perotinus_viderunt_omnes.mp3',
            'audio/2a_anonymous_la_quinte_estampie_real_estampie.mp3',
            'audio/2a_bernart_de_ventadorn_can_vei_la_lauzeta_mover.mp3',
            'audio/2a_comtessa_de_dia_a_chantar_mer_de_so_queu_no_volria.mp3',
            'audio/2a_guillaume_de_machaut_dame_de_qui_toute_ma_joie_vient.mp3',
            'audio/2b_giovani_perligui_da_palestrina_sanctus.mp3',
            'audio/2b_guillaume_de_machaut_sanctus.mp3',
            'audio/2b_josquin_de_prez_sanctus.mp3',
            'audio/3a_jacques_arcadet_il_bianco_e_dolce_signo.mp3',
            'audio/3a_john_farmer_fair_phyllis.mp3',
            'audio/3a_josquin_de_prez_ave_maria_virgo_serena.mp3'
            // Note: 3b assignment files will use YouTube fallback until audio files are processed
        ];
        return processedFiles.includes(audioFile);
    }

    playPiece(audioFile, title, composer, genre, assignment, youtubeUrl = '') {
        const player = document.getElementById('audio-player');
        const audio = document.getElementById('audio');
        const titleEl = document.getElementById('current-title');
        const detailsEl = document.getElementById('current-details');

        this.currentPlayer = { audioFile, title, composer, genre, assignment, youtubeUrl };
        
        // Track listening frequency for analytics
        this.trackListeningActivity(audioFile, title, composer);
        
        titleEl.textContent = title;
        detailsEl.textContent = `${composer} • ${genre} • Assignment ${assignment}`;
        
        // Try to load the audio file first
        audio.src = audioFile;
        player.style.display = 'block';
        
        // Check if audio file exists and handle error
        audio.addEventListener('error', () => {
            if (youtubeUrl) {
                // Show YouTube fallback
                this.showYouTubeFallback(youtubeUrl, title);
            } else {
                this.showAudioError();
            }
        }, { once: true });
        
        // Auto-play if audio loads successfully
        this.playCurrentAudio();
    }

    playCurrentAudio() {
        const audio = document.getElementById('audio');
        if (this.currentPlayer) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            // Limit playback to first 90 seconds (1 minute 30 seconds) for test simulation
            const stopAudioAt90Seconds = () => {
                if (audio.currentTime >= 90) {
                    audio.pause();
                    audio.dispatchEvent(new Event('ended'));
                }
            };
            
            audio.addEventListener('timeupdate', stopAudioAt90Seconds);
            
            // Play twice automatically
            let playCount = 0;
            audio.addEventListener('ended', () => {
                audio.removeEventListener('timeupdate', stopAudioAt90Seconds);
                playCount++;
                if (playCount < 2) {
                    audio.currentTime = 0;
                    audio.addEventListener('timeupdate', stopAudioAt90Seconds);
                    audio.play().catch(e => console.log('Audio replay failed:', e));
                }
            }, { once: false });
        }
    }

    showYouTubeFallback(youtubeUrl, title) {
        const player = document.getElementById('audio-player');
        const audio = document.getElementById('audio');
        
        // Hide the audio element and show YouTube link
        audio.style.display = 'none';
        
        // Add YouTube link button
        const youtubeButton = document.createElement('div');
        youtubeButton.id = 'youtube-fallback';
        youtubeButton.innerHTML = `
            <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 4px; margin: 1rem 0;">
                <p style="margin-bottom: 1rem; color: #6c757d;">Audio file not available yet. Click below to listen on YouTube:</p>
                <a href="${youtubeUrl}" target="_blank" style="background: #ff0000; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px; display: inline-block;">
                    ▶️ Play on YouTube
                </a>
                <p style="margin-top: 0.5rem; font-size: 0.8rem; color: #6c757d;">Tip: Run the audio setup script to download local files</p>
            </div>
        `;
        
        // Insert before player controls
        const controls = player.querySelector('.player-controls');
        controls.parentNode.insertBefore(youtubeButton, controls);
    }
    
    showAudioError() {
        const player = document.getElementById('audio-player');
        const audio = document.getElementById('audio');
        
        audio.style.display = 'none';
        
        const errorDiv = document.createElement('div');
        errorDiv.id = 'audio-error';
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 1rem; background: #f8d7da; border-radius: 4px; margin: 1rem 0; color: #721c24;">
                <p>Audio file not available. Please run the audio setup script first.</p>
                <code>python3 setup_audio.py</code>
            </div>
        `;
        
        const controls = player.querySelector('.player-controls');
        controls.parentNode.insertBefore(errorDiv, controls);
    }

    closePlayer() {
        const player = document.getElementById('audio-player');
        const audio = document.getElementById('audio');
        
        audio.pause();
        audio.src = '';
        audio.style.display = 'block'; // Reset audio display
        
        // Remove any error/fallback messages
        const fallback = document.getElementById('youtube-fallback');
        const error = document.getElementById('audio-error');
        if (fallback) fallback.remove();
        if (error) error.remove();
        
        player.style.display = 'none';
        this.currentPlayer = null;
    }

    updateDifficultyDescription(difficulty) {
        const descriptions = {
            easy: '<strong>Easy Mode:</strong> Multiple choice questions with 4 options each. Perfect for learning and recognition practice. <em>Base points per question.</em>',
            medium: '<strong>Medium Mode:</strong> Fill in the blanks with helpful hints. Good balance of challenge and support. <em>1.5x points per question.</em>',
            hard: '<strong>Hard Mode:</strong> Free text entry with no hints. Maximum challenge for advanced students. <em>2x points per question.</em>'
        };
        
        document.getElementById('difficulty-description').innerHTML = descriptions[difficulty];
    }

    startQuiz() {
        const difficulty = document.getElementById('quiz-difficulty').value;
        const assignment = document.getElementById('quiz-assignment').value;
        const count = parseInt(document.getElementById('quiz-count').value);
        
        let availablePieces = assignment === 'all' ? 
            this.pieces : 
            this.pieces.filter(piece => piece.assignment === assignment);
        
        // Shuffle and select random pieces
        availablePieces = this.shuffleArray(availablePieces);
        const quizPieces = availablePieces.slice(0, Math.min(count, availablePieces.length));
        
        this.currentQuiz = {
            pieces: quizPieces,
            currentIndex: 0,
            score: 0,
            maxScore: 0,
            difficulty: difficulty,
            answers: []
        };
        
        document.getElementById('quiz-setup').style.display = 'none';
        document.getElementById('quiz-active').style.display = 'block';
        
        this.loadQuizQuestion();
    }

    loadQuizQuestion() {
        const quiz = this.currentQuiz;
        const piece = quiz.pieces[quiz.currentIndex];
        
        document.getElementById('question-counter').textContent = 
            `Question ${quiz.currentIndex + 1} of ${quiz.pieces.length}`;
        document.getElementById('quiz-score').textContent = 
            `Score: ${quiz.score}/${quiz.maxScore || quiz.currentIndex}`;
        
        const quizAudio = document.getElementById('quiz-audio');
        quizAudio.src = piece.audioFile;
        
        // Hide all question types
        document.getElementById('easy-questions').style.display = 'none';
        document.getElementById('medium-questions').style.display = 'none';
        document.getElementById('hard-questions').style.display = 'none';
        
        // Show appropriate question type
        const difficulty = quiz.difficulty;
        document.getElementById(`${difficulty}-questions`).style.display = 'block';
        
        // Setup questions based on difficulty
        if (difficulty === 'easy') {
            this.setupEasyQuestions(piece);
        } else if (difficulty === 'medium') {
            this.setupMediumQuestions(piece);
        } else {
            this.setupHardQuestions();
        }
        
        document.getElementById('answer-feedback').style.display = 'none';
        document.getElementById('quiz-form').style.display = 'block';
        
        // Auto-play
        this.replayQuizAudio();
    }

    setupEasyQuestions(correctPiece) {
        const allPieces = this.pieces;
        
        // Generate wrong options for each category
        const wrongTitles = allPieces.filter(p => p.title !== correctPiece.title).map(p => p.title);
        const wrongComposers = allPieces.filter(p => p.composer !== correctPiece.composer).map(p => p.composer);
        const wrongGenres = allPieces.filter(p => p.genre !== correctPiece.genre).map(p => p.genre);
        
        // Create multiple choice options (correct + 3 wrong)
        this.createMultipleChoiceQuestion('title-choices', correctPiece.title, this.shuffleArray(wrongTitles).slice(0, 3));
        this.createMultipleChoiceQuestion('composer-choices', correctPiece.composer, this.shuffleArray(wrongComposers).slice(0, 3));
        this.createMultipleChoiceQuestion('genre-choices', correctPiece.genre, this.shuffleArray(wrongGenres).slice(0, 3));
    }
    
    createMultipleChoiceQuestion(containerId, correctAnswer, wrongAnswers) {
        const container = document.getElementById(containerId);
        const allOptions = this.shuffleArray([correctAnswer, ...wrongAnswers]);
        
        container.innerHTML = allOptions.map(option => 
            `<div class="choice-option" data-value="${option}">${option}</div>`
        ).join('');
        
        // Add click handlers
        container.querySelectorAll('.choice-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selections in this group
                container.querySelectorAll('.choice-option').forEach(opt => opt.classList.remove('selected'));
                // Select this option
                option.classList.add('selected');
            });
        });
    }
    
    setupMediumQuestions(piece) {
        // Clear previous inputs
        document.getElementById('title-input-medium').value = '';
        document.getElementById('composer-input-medium').value = '';
        document.getElementById('genre-input-medium').value = '';
        
        // Create hints
        document.getElementById('title-hint').textContent = this.createHint(piece.title);
        document.getElementById('composer-hint').textContent = this.createHint(piece.composer);
        document.getElementById('genre-hint').textContent = this.createHint(piece.genre);
    }
    
    createHint(text) {
        const words = text.split(/\s+/);
        if (words.length === 1) {
            // Single word: show first and last letter
            if (text.length <= 3) return `${text.length} letters`;
            return `${text[0]}${'_'.repeat(text.length - 2)}${text[text.length - 1]}`;
        } else {
            // Multiple words: show first letter of each word + length
            return words.map(word => 
                word.length <= 3 ? word : `${word[0]}${'_'.repeat(word.length - 1)}`
            ).join(' ');
        }
    }
    
    setupHardQuestions() {
        // Clear previous inputs
        document.getElementById('title-input').value = '';
        document.getElementById('composer-input').value = '';
        document.getElementById('genre-input').value = '';
    }

    replayQuizAudio() {
        const audio = document.getElementById('quiz-audio');
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Quiz audio play failed:', e));
        
        // Limit playback to first 90 seconds (1 minute 30 seconds) for test simulation
        const stopAudioAt90Seconds = () => {
            if (audio.currentTime >= 90) {
                audio.pause();
                audio.dispatchEvent(new Event('ended'));
            }
        };
        
        audio.addEventListener('timeupdate', stopAudioAt90Seconds);
        
        // Play twice
        let playCount = 0;
        audio.addEventListener('ended', () => {
            audio.removeEventListener('timeupdate', stopAudioAt90Seconds);
            playCount++;
            if (playCount < 2) {
                audio.currentTime = 0;
                audio.addEventListener('timeupdate', stopAudioAt90Seconds);
                audio.play().catch(e => console.log('Quiz audio replay failed:', e));
            }
        }, { once: false });
    }

    submitAnswer(e) {
        e.preventDefault();
        
        const quiz = this.currentQuiz;
        const piece = quiz.pieces[quiz.currentIndex];
        const difficulty = quiz.difficulty;
        
        let userAnswers;
        let scores;
        
        // Get answers based on difficulty
        if (difficulty === 'easy') {
            userAnswers = this.getEasyAnswers();
        } else if (difficulty === 'medium') {
            userAnswers = this.getMediumAnswers();
        } else {
            userAnswers = this.getHardAnswers();
        }
        
        // Score answers based on difficulty
        if (difficulty === 'easy') {
            scores = this.scoreEasyAnswers(userAnswers, piece);
        } else if (difficulty === 'medium') {
            scores = this.scoreMediumAnswers(userAnswers, piece);
        } else {
            scores = this.scoreHardAnswers(userAnswers, piece);
        }
        
        // Calculate total score and points
        const totalScore = (scores.title + scores.composer + scores.genre) / 3;
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[difficulty];
        const points = Math.round(totalScore * difficultyMultiplier * 100) / 100;
        const isCorrect = totalScore >= (difficulty === 'easy' ? 0.9 : 0.7); // Higher threshold for easy mode
        
        if (isCorrect) quiz.score += points;
        quiz.maxScore += difficultyMultiplier;
        
        quiz.answers.push({
            piece,
            userAnswers,
            scores,
            points,
            maxPoints: difficultyMultiplier,
            correct: isCorrect,
            difficulty
        });
        
        this.showAnswerFeedback(piece, userAnswers, isCorrect, scores, points, difficultyMultiplier);
    }
    
    getEasyAnswers() {
        const titleSelected = document.querySelector('#title-choices .choice-option.selected');
        const composerSelected = document.querySelector('#composer-choices .choice-option.selected');
        const genreSelected = document.querySelector('#genre-choices .choice-option.selected');
        
        return {
            title: titleSelected ? titleSelected.dataset.value : '',
            composer: composerSelected ? composerSelected.dataset.value : '',
            genre: genreSelected ? genreSelected.dataset.value : ''
        };
    }
    
    getMediumAnswers() {
        return {
            title: document.getElementById('title-input-medium').value.trim(),
            composer: document.getElementById('composer-input-medium').value.trim(),
            genre: document.getElementById('genre-input-medium').value.trim()
        };
    }
    
    getHardAnswers() {
        return {
            title: document.getElementById('title-input').value.trim(),
            composer: document.getElementById('composer-input').value.trim(),
            genre: document.getElementById('genre-input').value.trim()
        };
    }
    
    scoreEasyAnswers(userAnswers, piece) {
        return {
            title: userAnswers.title === piece.title ? 1 : 0,
            composer: userAnswers.composer === piece.composer ? 1 : 0,
            genre: userAnswers.genre === piece.genre ? 1 : 0
        };
    }
    
    scoreMediumAnswers(userAnswers, piece) {
        return {
            title: this.scoreAnswer(userAnswers.title, piece.title),
            composer: this.scoreAnswer(userAnswers.composer, piece.composer),
            genre: this.scoreAnswer(userAnswers.genre, piece.genre)
        };
    }
    
    scoreHardAnswers(userAnswers, piece) {
        return {
            title: this.scoreAnswer(userAnswers.title, piece.title),
            composer: this.scoreAnswer(userAnswers.composer, piece.composer),
            genre: this.scoreAnswer(userAnswers.genre, piece.genre)
        };
    }

    scoreAnswer(userAnswer, correctAnswer) {
        if (!userAnswer || !correctAnswer) return 0;
        
        const user = userAnswer.toLowerCase().replace(/[.,'"]/g, '').trim();
        const correct = correctAnswer.toLowerCase().replace(/[.,'"]/g, '').trim();
        
        if (user === correct) return 1;
        if (correct.includes(user) || user.includes(correct)) return 0.8;
        
        // Basic word matching
        const userWords = user.split(/\s+/);
        const correctWords = correct.split(/\s+/);
        let matches = 0;
        
        userWords.forEach(userWord => {
            if (correctWords.some(correctWord => 
                correctWord.includes(userWord) || userWord.includes(correctWord)
            )) {
                matches++;
            }
        });
        
        return Math.min(matches / correctWords.length, 1);
    }

    showAnswerFeedback(piece, userAnswers, isCorrect, scores, points, maxPoints) {
        const feedback = document.getElementById('answer-feedback');
        feedback.className = isCorrect ? '' : 'incorrect';
        
        // For easy mode, also highlight the correct/incorrect choices
        if (this.currentQuiz.difficulty === 'easy') {
            this.highlightEasyChoices(piece, userAnswers);
        }
        
        // Update the feedback content div instead of overwriting the entire feedback area
        document.getElementById('feedback-content').innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 1.2rem; font-weight: bold; color: ${isCorrect ? '#28a745' : '#dc3545'};">
                    ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div style="font-size: 0.9rem; color: #6c757d;">
                    Points: ${points.toFixed(1)}/${maxPoints} 
                    (${this.currentQuiz.difficulty.charAt(0).toUpperCase() + this.currentQuiz.difficulty.slice(1)} Mode)
                </div>
            </div>
            <div class="feedback-row">
                <div class="feedback-item">
                    <div class="feedback-label">Title</div>
                    <div class="feedback-value ${scores.title >= 0.7 ? 'correct' : 'incorrect'}">
                        ${piece.title}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">You: ${userAnswers.title || '(blank)'}</div>
                    ${scores.title > 0 && scores.title < 1 ? `<div style="font-size: 0.7rem; color: #ffc107;">Partial credit: ${Math.round(scores.title * 100)}%</div>` : ''}
                </div>
                <div class="feedback-item">
                    <div class="feedback-label">Composer</div>
                    <div class="feedback-value ${scores.composer >= 0.7 ? 'correct' : 'incorrect'}">
                        ${piece.composer}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">You: ${userAnswers.composer || '(blank)'}</div>
                    ${scores.composer > 0 && scores.composer < 1 ? `<div style="font-size: 0.7rem; color: #ffc107;">Partial credit: ${Math.round(scores.composer * 100)}%</div>` : ''}
                </div>
                <div class="feedback-item">
                    <div class="feedback-label">Genre</div>
                    <div class="feedback-value ${scores.genre >= 0.7 ? 'correct' : 'incorrect'}">
                        ${piece.genre}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">You: ${userAnswers.genre || '(blank)'}</div>
                    ${scores.genre > 0 && scores.genre < 1 ? `<div style="font-size: 0.7rem; color: #ffc107;">Partial credit: ${Math.round(scores.genre * 100)}%</div>` : ''}
                </div>
            </div>
        `;
        
        document.getElementById('quiz-form').style.display = 'none';
        feedback.style.display = 'block';
    }
    
    highlightEasyChoices(piece, userAnswers) {
        // Highlight correct and incorrect choices for easy mode
        ['title', 'composer', 'genre'].forEach(category => {
            const container = document.getElementById(`${category}-choices`);
            const options = container.querySelectorAll('.choice-option');
            
            options.forEach(option => {
                const value = option.dataset.value;
                option.classList.remove('correct', 'incorrect');
                
                if (value === piece[category]) {
                    option.classList.add('correct');
                } else if (value === userAnswers[category] && value !== piece[category]) {
                    option.classList.add('incorrect');
                }
            });
        });
    }

    nextQuestion() {
        this.currentQuiz.currentIndex++;
        
        if (this.currentQuiz.currentIndex >= this.currentQuiz.pieces.length) {
            this.finishQuiz();
        } else {
            this.loadQuizQuestion();
        }
    }

    finishQuiz() {
        const quiz = this.currentQuiz;
        const percentage = Math.round((quiz.score / quiz.maxScore) * 100);
        
        // Save to progress
        this.progressData.quizzes.push({
            date: new Date().toISOString(),
            score: quiz.score,
            maxScore: quiz.maxScore,
            percentage: percentage,
            difficulty: quiz.difficulty,
            questionCount: quiz.pieces.length
        });
        this.saveProgress();
        
        // Show results
        document.getElementById('quiz-active').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'block';
        
        // Create difficulty badge
        const difficultyBadge = {
            easy: '<span style="background: #28a745; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">Easy</span>',
            medium: '<span style="background: #ffc107; color: black; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">Medium</span>',
            hard: '<span style="background: #dc3545; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">Hard</span>'
        }[quiz.difficulty];
        
        document.getElementById('final-score').innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: ${percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545'};">
                    ${quiz.score.toFixed(1)}/${quiz.maxScore} (${percentage}%)
                </div>
                <div style="margin-top: 0.5rem;">
                    ${difficultyBadge} • ${quiz.pieces.length} Questions
                </div>
            </div>
        `;
        
        // Show breakdown
        this.showResultsBreakdown(quiz);
        
        // Update progress display
        this.renderProgressSection();
    }
    
    showResultsBreakdown(quiz) {
        const breakdown = document.getElementById('results-breakdown');
        const correctCount = quiz.answers.filter(a => a.correct).length;
        const partialCount = quiz.answers.filter(a => !a.correct && a.points > 0).length;
        
        breakdown.innerHTML = `
            <div style="margin-top: 1.5rem; text-align: left;">
                <h3 style="margin-bottom: 1rem;">Question Breakdown:</h3>
                <div style="display: grid; gap: 0.5rem;">
                    <div style="color: #28a745;">✓ Fully Correct: ${correctCount}</div>
                    <div style="color: #ffc107;">⚪ Partial Credit: ${partialCount}</div>
                    <div style="color: #dc3545;">✗ Incorrect: ${quiz.pieces.length - correctCount - partialCount}</div>
                </div>
                
                <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
                    <strong>Difficulty Bonus:</strong> ${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)} mode 
                    (${quiz.difficulty === 'easy' ? '1x' : quiz.difficulty === 'medium' ? '1.5x' : '2x'} points)
                </div>
            </div>
        `;
    }

    resetQuiz() {
        this.currentQuiz = null;
        document.getElementById('quiz-setup').style.display = 'block';
        document.getElementById('quiz-active').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'none';
    }

    renderProgressSection() {
        const quizzes = this.progressData.quizzes;
        const totalQuizzes = quizzes.length;
        const avgScore = totalQuizzes > 0 ? 
            Math.round(quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes) : 0;
        const bestScore = totalQuizzes > 0 ? 
            Math.max(...quizzes.map(quiz => quiz.percentage)) : 0;
        
        document.getElementById('total-quizzes').textContent = totalQuizzes;
        document.getElementById('avg-score').textContent = `${avgScore}%`;
        document.getElementById('best-score').textContent = `${bestScore}%`;
        
        const historyHtml = quizzes.slice(-10).reverse().map(quiz => {
            const difficultyBadge = quiz.difficulty ? 
                `<span style="background: ${quiz.difficulty === 'easy' ? '#28a745' : quiz.difficulty === 'medium' ? '#ffc107' : '#dc3545'}; 
                color: ${quiz.difficulty === 'medium' ? 'black' : 'white'}; padding: 0.1rem 0.4rem; border-radius: 8px; 
                font-size: 0.7rem; margin-left: 0.5rem;">${quiz.difficulty}</span>` : '';
            
            // Handle both old and new score formats
            const scoreDisplay = quiz.maxScore ? 
                `${quiz.score.toFixed(1)}/${quiz.maxScore} (${quiz.percentage}%)` : 
                `${quiz.score}/${quiz.total} (${quiz.percentage}%)`;
            
            return `
                <div class="history-item">
                    <span>${new Date(quiz.date).toLocaleDateString()}${difficultyBadge}</span>
                    <span class="history-score">${scoreDisplay}</span>
                </div>
            `;
        }).join('') || '<div class="history-item">No quiz history yet</div>';
        
        document.getElementById('quiz-history').innerHTML = historyHtml;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('musicQuizProgress');
            return saved ? JSON.parse(saved) : { quizzes: [] };
        } catch (e) {
            return { quizzes: [] };
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('musicQuizProgress', JSON.stringify(this.progressData));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    // Flashcard System Methods
    loadFlashcardData() {
        if (typeof FLASHCARD_DATA !== 'undefined') {
            this.flashcards = [...FLASHCARD_DATA];
            console.log(`Loaded ${this.flashcards.length} flashcards`);
        } else {
            console.error('Flashcard data not found');
            this.flashcards = [];
        }
    }

    setupFlashcardFilters() {
        const topicFilter = document.getElementById('flashcard-topic-filter');
        const topics = [...new Set(this.flashcards.map(card => card.topic))].sort();
        
        // Clear existing options except "All Topics"
        topicFilter.innerHTML = '<option value="all">All Topics</option>';
        
        topics.forEach(topic => {
            const option = new Option(topic, topic);
            topicFilter.appendChild(option);
        });

        this.applyFlashcardFilters();
    }

    applyFlashcardFilters() {
        const lectureFilter = document.getElementById('flashcard-lecture-filter').value;
        const topicFilter = document.getElementById('flashcard-topic-filter').value;
        
        let filteredCards = this.flashcards;
        
        if (lectureFilter !== 'all') {
            filteredCards = filteredCards.filter(card => card.lecture === lectureFilter);
        }
        
        if (topicFilter !== 'all') {
            filteredCards = filteredCards.filter(card => card.topic === topicFilter);
        }
        
        this.flashcardSession.currentCards = [...filteredCards];
        
        // Update total cards display
        document.getElementById('total-cards').textContent = this.flashcardSession.currentCards.length;
        
        // Reset to first card if session not active
        if (!this.flashcardSession.active) {
            this.currentFlashcardIndex = 0;
            document.getElementById('current-card-number').textContent = '1';
        }
    }

    onFlashcardDifficultyChange() {
        // If a session is active and a card is currently displayed, update the answer
        if (this.flashcardSession.active && this.currentFlashcardIndex < this.flashcardSession.currentCards.length) {
            const card = this.flashcardSession.currentCards[this.currentFlashcardIndex];
            const difficulty = document.getElementById('flashcard-difficulty').value;
            const answerText = (difficulty === 'simple' && card.backSimple) ? card.backSimple : card.back;
            document.getElementById('flashcard-answer').textContent = answerText;
        }
    }

    shuffleFlashcards() {
        this.flashcardSession.currentCards = this.shuffleArray(this.flashcardSession.currentCards);
        this.currentFlashcardIndex = 0;
        
        if (this.flashcardSession.active) {
            this.displayCurrentFlashcard();
        }
        
        document.getElementById('current-card-number').textContent = '1';
    }

    resetFlashcardProgress() {
        this.flashcardSession = {
            active: false,
            correct: 0,
            incorrect: 0,
            currentCards: [...this.flashcardSession.currentCards]
        };
        this.currentFlashcardIndex = 0;
        
        this.updateFlashcardDisplay();
        this.resetFlashcardUI();
    }

    startFlashcardSession() {
        if (this.flashcardSession.currentCards.length === 0) {
            alert('No flashcards available. Please adjust your filters.');
            return;
        }

        this.flashcardSession.active = true;
        this.flashcardSession.correct = 0;
        this.flashcardSession.incorrect = 0;
        this.currentFlashcardIndex = 0;
        
        // Hide session complete and show flashcard
        document.getElementById('session-complete').classList.add('hidden');
        document.getElementById('flashcard-container').style.display = 'flex';
        
        // Update button visibility
        document.getElementById('start-flashcards').classList.add('hidden');
        document.getElementById('flip-card').classList.remove('hidden');
        
        this.displayCurrentFlashcard();
        this.updateFlashcardDisplay();
    }

    displayCurrentFlashcard() {
        if (this.currentFlashcardIndex >= this.flashcardSession.currentCards.length) {
            this.endFlashcardSession();
            return;
        }

        const card = this.flashcardSession.currentCards[this.currentFlashcardIndex];
        const difficulty = document.getElementById('flashcard-difficulty').value;
        
        // Reset card to front side
        document.getElementById('flashcard').classList.remove('flipped');
        
        // Update content - use appropriate answer based on difficulty
        const answerText = (difficulty === 'simple' && card.backSimple) ? card.backSimple : card.back;
        
        document.getElementById('flashcard-topic').textContent = card.topic;
        document.getElementById('flashcard-topic-back').textContent = card.topic;
        document.getElementById('flashcard-question').textContent = card.front;
        document.getElementById('flashcard-answer').textContent = answerText;
        
        // Update UI
        document.getElementById('current-card-number').textContent = this.currentFlashcardIndex + 1;
        document.getElementById('flip-card').classList.remove('hidden');
        document.getElementById('response-buttons').classList.add('hidden');
        document.getElementById('next-card').classList.add('hidden');
    }

    flipFlashcard() {
        if (!this.flashcardSession.active) return;
        
        const flashcard = document.getElementById('flashcard');
        const isFlipped = flashcard.classList.contains('flipped');
        
        // Prevent double-flip on mobile
        if (this.isFlipping) return;
        this.isFlipping = true;
        setTimeout(() => this.isFlipping = false, 100);
        
        if (!isFlipped) {
            flashcard.classList.add('flipped');
            document.getElementById('flip-card').classList.add('hidden');
            document.getElementById('response-buttons').classList.remove('hidden');
            
            // Add haptic feedback on supported devices
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    }

    respondToFlashcard(correct) {
        if (correct) {
            this.flashcardSession.correct++;
        } else {
            this.flashcardSession.incorrect++;
        }
        
        // Hide response buttons, show next button
        document.getElementById('response-buttons').classList.add('hidden');
        document.getElementById('next-card').classList.remove('hidden');
        
        this.updateFlashcardDisplay();
    }

    nextFlashcard() {
        this.currentFlashcardIndex++;
        
        if (this.currentFlashcardIndex >= this.flashcardSession.currentCards.length) {
            this.endFlashcardSession();
        } else {
            this.displayCurrentFlashcard();
        }
    }

    endFlashcardSession() {
        this.flashcardSession.active = false;
        
        // Hide flashcard container
        document.getElementById('flashcard-container').style.display = 'none';
        
        // Calculate and display results
        const total = this.flashcardSession.correct + this.flashcardSession.incorrect;
        const accuracy = total > 0 ? Math.round((this.flashcardSession.correct / total) * 100) : 0;
        
        document.getElementById('final-total').textContent = total;
        document.getElementById('final-correct').textContent = this.flashcardSession.correct;
        document.getElementById('final-incorrect').textContent = this.flashcardSession.incorrect;
        document.getElementById('final-accuracy').textContent = accuracy;
        
        // Show session complete screen
        document.getElementById('session-complete').classList.remove('hidden');
        
        // Save to progress (if you want to track flashcard sessions)
        this.progressData.flashcardSessions = this.progressData.flashcardSessions || [];
        this.progressData.flashcardSessions.push({
            date: new Date().toISOString(),
            total: total,
            correct: this.flashcardSession.correct,
            incorrect: this.flashcardSession.incorrect,
            accuracy: accuracy
        });
        this.saveProgress();
    }

    updateFlashcardDisplay() {
        document.getElementById('session-correct').textContent = this.flashcardSession.correct;
        document.getElementById('session-incorrect').textContent = this.flashcardSession.incorrect;
    }

    resetFlashcardUI() {
        // Reset all UI elements to initial state
        document.getElementById('flashcard-container').style.display = 'flex';
        document.getElementById('session-complete').classList.add('hidden');
        document.getElementById('start-flashcards').classList.remove('hidden');
        document.getElementById('flip-card').classList.add('hidden');
        document.getElementById('response-buttons').classList.add('hidden');
        document.getElementById('next-card').classList.add('hidden');
        
        // Reset flashcard content
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('flashcard-question').textContent = 'Click "Start Studying" to begin';
        document.getElementById('flashcard-answer').textContent = 'Answer will appear here';
        document.getElementById('flashcard-topic').textContent = '';
        document.getElementById('flashcard-topic-back').textContent = '';
        
        // Reset counters
        document.getElementById('current-card-number').textContent = '1';
        document.getElementById('session-correct').textContent = '0';
        document.getElementById('session-incorrect').textContent = '0';
    }

    // Mobile swipe gesture support
    setupSwipeGestures() {
        const flashcard = document.getElementById('flashcard');
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        flashcard.addEventListener('touchstart', (e) => {
            if (!this.flashcardSession.active) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            
            // Prevent scrolling during swipe
            e.preventDefault();
        }, { passive: false });

        flashcard.addEventListener('touchmove', (e) => {
            if (!this.flashcardSession.active) return;
            e.preventDefault(); // Prevent scrolling
        }, { passive: false });

        flashcard.addEventListener('touchend', (e) => {
            if (!this.flashcardSession.active || !startTime) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Check if it's a valid swipe (not too slow, not too vertical)
            const minSwipeDistance = 50;
            const maxSwipeTime = 500;
            const maxVerticalRatio = 0.5;
            
            if (deltaTime < maxSwipeTime && 
                Math.abs(deltaX) > minSwipeDistance && 
                Math.abs(deltaY) / Math.abs(deltaX) < maxVerticalRatio) {
                
                const isFlipped = flashcard.classList.contains('flipped');
                
                if (deltaX > 0) {
                    // Swipe right - mark as correct (if card is flipped)
                    if (isFlipped) {
                        this.respondToFlashcard(true);
                        // Visual feedback
                        flashcard.style.transform = 'translateX(100px)';
                        setTimeout(() => {
                            flashcard.style.transform = '';
                            setTimeout(() => this.nextFlashcard(), 500);
                        }, 200);
                    }
                } else {
                    // Swipe left - mark as incorrect (if card is flipped)
                    if (isFlipped) {
                        this.respondToFlashcard(false);
                        // Visual feedback
                        flashcard.style.transform = 'translateX(-100px)';
                        setTimeout(() => {
                            flashcard.style.transform = '';
                            setTimeout(() => this.nextFlashcard(), 500);
                        }, 200);
                    }
                }
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(30);
                }
            }
            
            // Reset for next gesture
            startTime = 0;
        });

        // Keyboard shortcuts for desktop users
        document.addEventListener('keydown', (e) => {
            if (!this.flashcardSession.active) return;
            
            const flashcard = document.getElementById('flashcard');
            const isFlipped = flashcard.classList.contains('flipped');
            
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    if (!isFlipped) {
                        this.flipFlashcard();
                    }
                    break;
                case 'ArrowRight':
                case 'y':
                case 'Y':
                    e.preventDefault();
                    if (isFlipped) {
                        this.respondToFlashcard(true);
                        setTimeout(() => this.nextFlashcard(), 500);
                    }
                    break;
                case 'ArrowLeft':
                case 'n':
                case 'N':
                    e.preventDefault();
                    if (isFlipped) {
                        this.respondToFlashcard(false);
                        setTimeout(() => this.nextFlashcard(), 500);
                    }
                    break;
                case 'Escape':
                    if (this.flashcardSession.active) {
                        this.resetFlashcardProgress();
                    }
                    break;
            }
        });
    }

    // Data loading methods
    loadCharacteristicsData() {
        if (typeof PIECE_CHARACTERISTICS !== 'undefined' && typeof MUSICAL_VOCABULARY !== 'undefined') {
            this.pieceCharacteristics = PIECE_CHARACTERISTICS;
            this.musicalVocabulary = MUSICAL_VOCABULARY;
            console.log('Loaded musical characteristics database');
        } else {
            console.error('Characteristics data not found');
            this.pieceCharacteristics = {};
            this.musicalVocabulary = {};
        }
    }

    loadAnalyticsData() {
        try {
            const saved = localStorage.getItem('musicQuizAnalytics');
            if (saved) {
                this.analytics = { ...this.analytics, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load analytics data:', e);
        }
    }

    saveAnalyticsData() {
        try {
            localStorage.setItem('musicQuizAnalytics', JSON.stringify(this.analytics));
        } catch (e) {
            console.error('Failed to save analytics data:', e);
        }
    }

    trackListeningActivity(audioFile, title, composer) {
        const key = audioFile;
        const now = new Date().toISOString();
        
        // Update listening frequency
        if (!this.analytics.listeningFrequency[key]) {
            this.analytics.listeningFrequency[key] = {
                count: 0,
                title: title,
                composer: composer,
                lastPlayed: now
            };
        }
        this.analytics.listeningFrequency[key].count++;
        this.analytics.listeningFrequency[key].lastPlayed = now;
        
        // Update last study date
        this.analytics.lastStudyDate[key] = now;
        
        this.saveAnalyticsData();
    }

    // Exam Simulation Methods
    startExamSimulation() {
        const mysteryMode = document.getElementById('mystery-mode').checked;
        const assignmentFilter = document.getElementById('exam-assignment').value;
        
        // Filter pieces based on assignment
        let availablePieces = this.pieces;
        if (assignmentFilter !== 'all') {
            const assignments = assignmentFilter.split(',');
            availablePieces = this.pieces.filter(piece => assignments.includes(piece.assignment));
        }
        
        if (availablePieces.length < 5) {
            alert('Not enough pieces available for simulation. Need at least 5 pieces.');
            return;
        }
        
        // Select 5 random pieces
        const shuffledPieces = this.shuffleArray([...availablePieces]);
        const examPieces = shuffledPieces.slice(0, 5);
        
        // Initialize exam session
        this.examSession = {
            active: true,
            pieces: examPieces,
            currentIndex: 0,
            startTime: new Date(),
            timeRemaining: 30 * 60, // 30 minutes
            mysteryMode: mysteryMode,
            answers: [],
            totalScore: 0,
            playCount: 0
        };
        
        // Show exam interface
        document.getElementById('exam-setup').style.display = 'none';
        document.getElementById('exam-active').style.display = 'block';
        
        // Start timer
        this.startExamTimer();
        
        // Load first piece
        this.loadExamPiece();
    }

    startExamTimer() {
        this.examSession.timer = setInterval(() => {
            this.examSession.timeRemaining--;
            
            if (this.examSession.timeRemaining <= 0) {
                this.endExamSimulation();
                return;
            }
            
            this.updateTimerDisplay();
        }, 1000);
        
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.examSession.timeRemaining / 60);
        const seconds = this.examSession.timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('exam-timer');
        timerElement.textContent = timeString;
        
        // Add warning colors
        timerElement.className = 'timer';
        if (this.examSession.timeRemaining <= 300) { // 5 minutes
            timerElement.classList.add('danger');
        } else if (this.examSession.timeRemaining <= 600) { // 10 minutes
            timerElement.classList.add('warning');
        }
    }

    loadExamPiece() {
        const piece = this.examSession.pieces[this.examSession.currentIndex];
        const mysteryMode = this.examSession.mysteryMode;
        
        // Update progress display
        document.getElementById('current-piece').textContent = this.examSession.currentIndex + 1;
        
        // Setup audio
        const audio = document.getElementById('exam-audio');
        audio.src = piece.audioFile;
        
        // Reset play count
        this.examSession.playCount = 0;
        document.getElementById('play-count').textContent = '0';
        
        // Show/hide piece information based on mystery mode
        if (mysteryMode) {
            document.getElementById('mystery-placeholder').style.display = 'block';
            document.getElementById('revealed-info').style.display = 'none';
            document.getElementById('mystery-number').textContent = this.examSession.currentIndex + 1;
        } else {
            document.getElementById('mystery-placeholder').style.display = 'none';
            document.getElementById('revealed-info').style.display = 'block';
            document.getElementById('exam-piece-title').textContent = piece.title;
            document.getElementById('exam-piece-details').textContent = `${piece.composer} • ${piece.genre} • Assignment ${piece.assignment}`;
        }
        
        // Clear form
        this.clearExamForm();
        
        // Hide feedback, show form
        document.getElementById('exam-feedback').style.display = 'none';
        document.getElementById('exam-question-form').style.display = 'block';
        
        // Auto-play twice
        this.playExamAudioTwice();
    }

    playExamAudioTwice() {
        const audio = document.getElementById('exam-audio');
        this.examSession.playCount = 0;
        
        // Limit playback to first 90 seconds (1 minute 30 seconds) for test simulation
        const stopAudioAt90Seconds = () => {
            if (audio.currentTime >= 90) {
                audio.pause();
                audio.dispatchEvent(new Event('ended'));
            }
        };
        
        const playNext = () => {
            if (this.examSession.playCount < 2) {
                this.examSession.playCount++;
                document.getElementById('play-count').textContent = this.examSession.playCount;
                audio.currentTime = 0;
                audio.addEventListener('timeupdate', stopAudioAt90Seconds);
                audio.play().catch(e => console.log('Exam audio play failed:', e));
            }
        };
        
        audio.addEventListener('ended', () => {
            audio.removeEventListener('timeupdate', stopAudioAt90Seconds);
            playNext();
        }, { once: false });
        playNext(); // Start first play
    }

    replayExamAudio() {
        this.playExamAudioTwice();
    }

    revealPieceInfo() {
        if (this.examSession.mysteryMode) {
            const piece = this.examSession.pieces[this.examSession.currentIndex];
            document.getElementById('mystery-placeholder').style.display = 'none';
            document.getElementById('revealed-info').style.display = 'block';
            document.getElementById('exam-piece-title').textContent = piece.title;
            document.getElementById('exam-piece-details').textContent = `${piece.composer} • ${piece.genre} • Assignment ${piece.assignment}`;
        }
    }

    clearExamForm() {
        document.getElementById('exam-composer').value = '';
        document.getElementById('exam-title').value = '';
        document.getElementById('exam-genre').value = '';
        document.getElementById('exam-characteristics').value = '';
    }

    submitExamAnswer(e) {
        e.preventDefault();
        
        const piece = this.examSession.pieces[this.examSession.currentIndex];
        const userAnswers = {
            composer: document.getElementById('exam-composer').value.trim(),
            title: document.getElementById('exam-title').value.trim(),
            genre: document.getElementById('exam-genre').value.trim(),
            characteristics: document.getElementById('exam-characteristics').value.trim()
        };
        
        // Score the answers
        const scores = this.scoreExamAnswer(userAnswers, piece);
        const totalPoints = scores.identification + scores.analysis;
        
        // Store answer
        this.examSession.answers.push({
            piece: piece,
            userAnswers: userAnswers,
            scores: scores,
            totalPoints: totalPoints
        });
        
        this.examSession.totalScore += totalPoints;
        
        // Show feedback
        this.showExamFeedback(piece, userAnswers, scores);
    }

    scoreExamAnswer(userAnswers, piece) {
        const scores = {
            identification: 0,
            analysis: 0
        };
        
        // Score identification (3 points total: 1 each for composer, title, genre)
        if (this.scoreAnswer(userAnswers.composer, piece.composer) >= 0.8) scores.identification++;
        if (this.scoreAnswer(userAnswers.title, piece.title) >= 0.8) scores.identification++;
        if (this.scoreAnswer(userAnswers.genre, piece.genre) >= 0.8) scores.identification++;
        
        // Score analysis based on characteristics (2 points total)
        const pieceKey = piece.audioFile.replace('audio/', '').replace('.mp3', '');
        const expectedCharacteristics = this.pieceCharacteristics[pieceKey];
        
        if (expectedCharacteristics && userAnswers.characteristics) {
            const analysisScore = this.scoreCharacteristicsAnalysis(userAnswers.characteristics, expectedCharacteristics);
            scores.analysis = Math.round(analysisScore * 2); // Scale to 2 points
        }
        
        return scores;
    }

    scoreCharacteristicsAnalysis(userText, expectedCharacteristics) {
        if (!userText || !expectedCharacteristics) return 0;
        
        const userWords = userText.toLowerCase().split(/\W+/);
        const keyCharacteristics = expectedCharacteristics.keyCharacteristics;
        let matches = 0;
        let totalConcepts = keyCharacteristics.length;
        
        // Check for key characteristic matches
        keyCharacteristics.forEach(characteristic => {
            const characteristicWords = characteristic.toLowerCase().split(/\W+/);
            let conceptMatch = false;
            
            characteristicWords.forEach(word => {
                if (word.length > 3 && userWords.some(userWord => 
                    userWord.includes(word) || word.includes(userWord))) {
                    conceptMatch = true;
                }
            });
            
            if (conceptMatch) matches++;
        });
        
        // Check for vocabulary usage
        Object.values(this.musicalVocabulary).forEach(category => {
            Object.keys(category).forEach(term => {
                if (userText.toLowerCase().includes(term.toLowerCase())) {
                    matches += 0.5; // Bonus for vocabulary usage
                }
            });
        });
        
        return Math.min(matches / totalConcepts, 1);
    }

    showExamFeedback(piece, userAnswers, scores) {
        document.getElementById('exam-question-form').style.display = 'none';
        document.getElementById('exam-feedback').style.display = 'block';
        
        // Update score display
        document.getElementById('id-score').textContent = scores.identification;
        document.getElementById('analysis-score').textContent = scores.analysis;
        
        // Show correct information
        document.getElementById('correct-info').innerHTML = `
            <div><strong>Composer:</strong> ${piece.composer}</div>
            <div><strong>Title:</strong> ${piece.title}</div>
            <div><strong>Genre:</strong> ${piece.genre}</div>
        `;
        
        // Show analysis feedback
        const pieceKey = piece.audioFile.replace('audio/', '').replace('.mp3', '');
        const expectedCharacteristics = this.pieceCharacteristics[pieceKey];
        
        let analysisFeedback = `<div><strong>Your analysis:</strong> ${userAnswers.characteristics || '(No analysis provided)'}</div>`;
        
        if (expectedCharacteristics) {
            analysisFeedback += `<div style="margin-top: 1rem;"><strong>Key characteristics you should identify:</strong></div>`;
            analysisFeedback += `<ul style="margin: 0.5rem 0; padding-left: 1.5rem;">`;
            expectedCharacteristics.keyCharacteristics.forEach(char => {
                analysisFeedback += `<li>${char}</li>`;
            });
            analysisFeedback += `</ul>`;
        }
        
        document.getElementById('analysis-feedback').innerHTML = analysisFeedback;
    }

    nextExamPiece() {
        this.examSession.currentIndex++;
        
        if (this.examSession.currentIndex >= this.examSession.pieces.length) {
            this.endExamSimulation();
        } else {
            this.loadExamPiece();
        }
    }

    endExamSimulation() {
        // Stop timer
        if (this.examSession.timer) {
            clearInterval(this.examSession.timer);
        }
        
        // Calculate final scores
        const totalIdScore = this.examSession.answers.reduce((sum, answer) => sum + answer.scores.identification, 0);
        const totalAnalysisScore = this.examSession.answers.reduce((sum, answer) => sum + answer.scores.analysis, 0);
        const totalScore = totalIdScore + totalAnalysisScore;
        const maxScore = 25; // 5 pieces * 5 points each
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        // Show results
        document.getElementById('exam-active').style.display = 'none';
        document.getElementById('exam-complete').style.display = 'block';
        
        document.getElementById('total-exam-score').textContent = `${totalScore}/${maxScore}`;
        document.getElementById('total-id-score').textContent = `${totalIdScore}/15`;
        document.getElementById('total-analysis-score').textContent = `${totalAnalysisScore}/10`;
        document.getElementById('exam-percentage').textContent = `${percentage}%`;
        
        // Generate study recommendations
        this.generateExamRecommendations();
        
        // Save exam result to analytics
        this.analytics.examResults.push({
            date: new Date().toISOString(),
            totalScore: totalScore,
            maxScore: maxScore,
            percentage: percentage,
            identificationScore: totalIdScore,
            analysisScore: totalAnalysisScore,
            timeUsed: 30 * 60 - this.examSession.timeRemaining,
            answers: this.examSession.answers
        });
        
        this.saveAnalyticsData();
        this.updateAnalyticsDashboard();
    }

    generateExamRecommendations() {
        const recommendations = [];
        
        // Analyze weak areas
        const weakPieces = this.examSession.answers.filter(answer => answer.totalPoints < 3);
        const weakIdentification = this.examSession.answers.filter(answer => answer.scores.identification < 2);
        const weakAnalysis = this.examSession.answers.filter(answer => answer.scores.analysis < 1);
        
        if (weakIdentification.length > 2) {
            recommendations.push('🎯 Focus on memorizing composer names and piece titles');
            recommendations.push('📚 Use flashcards for better identification practice');
        }
        
        if (weakAnalysis.length > 2) {
            recommendations.push('🔍 Study musical characteristics and vocabulary');
            recommendations.push('👂 Practice describing what you hear in technical terms');
        }
        
        if (weakPieces.length > 0) {
            recommendations.push(`📝 Review these pieces: ${weakPieces.map(w => w.piece.title).join(', ')}`);
        }
        
        document.getElementById('study-recommendations').innerHTML = recommendations.map(rec => `<div style="margin-bottom: 0.5rem;">${rec}</div>`).join('');
    }

    resetExamSimulation() {
        this.examSession = {
            active: false,
            pieces: [],
            currentIndex: 0,
            startTime: null,
            timeRemaining: 30 * 60,
            timer: null,
            answers: [],
            totalScore: 0,
            playCount: 0
        };
        
        document.getElementById('exam-setup').style.display = 'block';
        document.getElementById('exam-active').style.display = 'none';
        document.getElementById('exam-complete').style.display = 'none';
    }

    // Analytics Methods
    updateAnalyticsDashboard() {
        this.updateListeningStats();
        this.updateWeakAreas();
        this.updateQuizReadiness();
    }

    updateListeningStats() {
        const container = document.getElementById('piece-frequency');
        const frequency = this.analytics.listeningFrequency;
        
        const sortedPieces = Object.entries(frequency)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 10); // Top 10
        
        const statsHtml = sortedPieces.map(([key, data]) => `
            <div class="stat-item">
                <span>${data.title} - ${data.composer}</span>
                <span>${data.count} plays</span>
            </div>
        `).join('');
        
        container.innerHTML = statsHtml || '<div class="stat-item">No listening data yet</div>';
    }

    updateWeakAreas() {
        const container = document.getElementById('weak-pieces');
        const examResults = this.analytics.examResults;
        
        if (examResults.length === 0) {
            container.innerHTML = '<div class="weak-area-item">Take an exam simulation to see weak areas</div>';
            return;
        }
        
        // Analyze recent exam results
        const recentExam = examResults[examResults.length - 1];
        const weakAnswers = recentExam.answers.filter(answer => answer.totalPoints < 3);
        
        const weakHtml = weakAnswers.map(answer => `
            <div class="weak-area-item">
                <div>
                    <strong>${answer.piece.title}</strong><br>
                    <small>${answer.piece.composer} - ${answer.piece.genre}</small>
                </div>
                <div>${answer.totalPoints}/5 pts</div>
            </div>
        `).join('');
        
        container.innerHTML = weakHtml || '<div class="weak-area-item">No weak areas identified ✅</div>';
    }

    updateQuizReadiness() {
        const examResults = this.analytics.examResults;
        const listeningData = this.analytics.listeningFrequency;
        
        let readinessScore = 0;
        const totalPieces = this.pieces.length;
        
        // Factor 1: Listening coverage (40% weight)
        const piecesListened = Object.keys(listeningData).length;
        const coverageScore = (piecesListened / totalPieces) * 0.4;
        
        // Factor 2: Recent exam performance (40% weight)
        let examScore = 0;
        if (examResults.length > 0) {
            const recentScores = examResults.slice(-3).map(exam => exam.percentage);
            const avgScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
            examScore = (avgScore / 100) * 0.4;
        }
        
        // Factor 3: Study consistency (20% weight)
        const now = new Date();
        const recentStudy = Object.values(listeningData).filter(data => {
            const lastPlayed = new Date(data.lastPlayed);
            const daysDiff = (now - lastPlayed) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7; // Studied in last week
        }).length;
        const consistencyScore = Math.min(recentStudy / 10, 1) * 0.2;
        
        readinessScore = Math.round((coverageScore + examScore + consistencyScore) * 100);
        
        document.querySelector('.readiness-percentage').textContent = `${readinessScore}%`;
        
        // Update readiness details
        const details = document.getElementById('readiness-details');
        details.innerHTML = `
            <div>Coverage: ${Math.round(coverageScore * 250)}% (${piecesListened}/${totalPieces} pieces)</div>
            <div>Performance: ${Math.round(examScore * 250)}%</div>
            <div>Consistency: ${Math.round(consistencyScore * 500)}%</div>
        `;
    }

    generateStudyPlan() {
        const plan = [];
        const now = new Date();
        const examDate = new Date('2024-09-16'); // September 16th
        const daysUntilExam = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
        
        plan.push(`📅 Days until exam: ${daysUntilExam}`);
        plan.push('');
        plan.push('🎯 Recommended Study Schedule:');
        
        if (daysUntilExam > 7) {
            plan.push('• Daily: Listen to 3-5 pieces (30 minutes)');
            plan.push('• Every 2 days: Complete flashcard session');
            plan.push('• Weekly: Take full exam simulation');
        } else if (daysUntilExam > 3) {
            plan.push('• Daily: Take exam simulation');
            plan.push('• Daily: Review weak pieces identified');
            plan.push('• Focus on analysis vocabulary');
        } else {
            plan.push('• Daily: Quick review of all pieces');
            plan.push('• Focus on mystery mode practice');
            plan.push('• Review musical characteristics');
        }
        
        alert(plan.join('\n'));
    }

    exportStudyChart() {
        this.showReferenceModal();
    }

    showReferenceModal() {
        const modal = document.getElementById('reference-modal');
        const content = document.getElementById('reference-chart-content');
        
        // Generate and populate content
        content.innerHTML = this.generateModalReferenceChart();
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    hideReferenceModal() {
        const modal = document.getElementById('reference-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    printReferenceChart() {
        const printWindow = window.open('', '_blank');
        const chartContent = this.generatePrintReferenceChart();
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Medieval & Renaissance Music Reference Chart</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .period { page-break-before: always; margin-bottom: 30px; }
                    .piece { margin-bottom: 20px; border: 1px solid #ccc; padding: 15px; }
                    .piece-title { font-weight: bold; font-size: 1.2em; margin-bottom: 5px; }
                    .piece-info { color: #666; margin-bottom: 10px; }
                    .characteristics { background: #f5f5f5; padding: 10px; border-radius: 4px; }
                    .vocab-section { margin-top: 30px; padding: 20px; background: #e8f4f8; }
                    @media print { .period { page-break-inside: avoid; } }
                </style>
            </head>
            <body>
                <h1>Medieval & Renaissance Music Reference Chart</h1>
                <p><strong>Exam Date:</strong> September 16th, 2024</p>
                ${chartContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    generateModalReferenceChart() {
        const periods = {
            'Medieval (1a)': this.pieces.filter(p => p.assignment === '1a'),
            'Medieval Polyphony (1b)': this.pieces.filter(p => p.assignment === '1b'),
            'Secular Medieval (2a)': this.pieces.filter(p => p.assignment === '2a'),
            'Renaissance Mass (2b)': this.pieces.filter(p => p.assignment === '2b'),
            'Renaissance Vocal (3a)': this.pieces.filter(p => p.assignment === '3a')
        };
        
        let content = '';
        
        Object.entries(periods).forEach(([period, pieces]) => {
            content += `
                <div class="period-section">
                    <h3 class="period-header">${period}</h3>
                    <div class="period-pieces">
            `;
            
            pieces.forEach(piece => {
                const pieceKey = piece.audioFile.replace('audio/', '').replace('.mp3', '');
                const characteristics = this.pieceCharacteristics[pieceKey];
                
                content += `
                    <div class="reference-piece">
                        <div class="reference-piece-title">${piece.title}</div>
                        <div class="reference-piece-info">${piece.composer} • ${piece.genre}</div>
                        <div class="reference-characteristics">
                            <strong>Key Characteristics:</strong>
                            <div class="characteristics-list">
                                ${characteristics ? 
                                    characteristics.keyCharacteristics.map(char => 
                                        `<span class="characteristic-tag">${char}</span>`
                                    ).join('') : 
                                    '<span class="characteristic-tag">Not available</span>'
                                }
                            </div>
                        </div>
                    </div>
                `;
            });
            
            content += '</div></div>';
        });
        
        // Add basic musical terms section
        content += `
            <div class="vocab-section">
                <h3>🎵 Basic Musical Terms</h3>
                <div class="vocab-grid">
                    <div class="vocab-category">
                        <h4>Scale & Mode</h4>
                        <div class="vocab-term"><strong>Scale:</strong> An organized set of pitches/notes with ascending and descending order, defined by specific intervals (distances) between pitches.</div>
                        <div class="vocab-term"><strong>Mode:</strong> Musical conventions that describe how a scale is used, including the "home note" that gives a sense of resolution or arrival.</div>
                    </div>
                    <div class="vocab-category">
                        <h4>Melody & Structure</h4>
                        <div class="vocab-term"><strong>Melody:</strong> A succession of pitches and rhythms organized as an aesthetic whole, typically prominent and memorable.</div>
                        <div class="vocab-term"><strong>Phrase:</strong> Smaller melodic sections that give progression (beginning, middle, end) and end with a cadence (musical closing).</div>
                        <div class="vocab-term"><strong>Theme:</strong> An important melody with associated harmony that may dictate form and recur throughout a piece.</div>
                        <div class="vocab-term"><strong>Motive:</strong> A small melodic fragment used to create longer phrases or themes (like Beethoven's Fifth Symphony opening).</div>
                    </div>
                    <div class="vocab-category">
                        <h4>Sound & Texture</h4>
                        <div class="vocab-term"><strong>Harmony:</strong> Pitches organized into simultaneous sound (chords) that can be combined into progressions.</div>
                        <div class="vocab-term"><strong>Timbre:</strong> Tone color or characteristic sound that distinguishes voices/instruments (harsh, smooth, rich, thin, bright, etc.).</div>
                        <div class="vocab-term"><strong>Texture:</strong> Number of independent musical parts and their relationship; density of sound (thin vs. dense).</div>
                        <div class="vocab-term"><strong>Monophony:</strong> Single melodic line with no accompaniment; multiple performers can sing/play the same pitches and rhythms.</div>
                    </div>
                    <div class="vocab-category">
                        <h4>Rhythm & Time</h4>
                        <div class="vocab-term"><strong>Rhythm:</strong> Durations of sound and patterns of those durations; alternation of sound and silence.</div>
                        <div class="vocab-term"><strong>Meter:</strong> Organization of rhythm in time, grouping beats into recurring patterns (how you feel rhythms).</div>
                        <div class="vocab-term"><strong>Tempo:</strong> Speed of music or rate of meter/pulse (not speed of rhythms you hear).</div>
                        <div class="vocab-term"><strong>Dynamics:</strong> Volume of music or degree of loudness/softness.</div>
                    </div>
                    <div class="vocab-category">
                        <h4>Form & Classification</h4>
                        <div class="vocab-term"><strong>Form:</strong> Structural organization by dividing into sections based on repetition/contrast (described with capital letters: ABC).</div>
                        <div class="vocab-term"><strong>Genre:</strong> Type of piece determined by three F's: form, function, and forces (who performs). Different from pop music genre.</div>
                        <div class="vocab-term"><strong>Song:</strong> Precisely defined as piece sung by one person alone, not part of larger work. Use "piece" or specific genre for other music.</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add period-specific vocabulary section
        content += `
            <div class="vocab-section">
                <h3>🎓 Medieval & Renaissance Vocabulary</h3>
                <div class="vocab-grid">
                    ${Object.entries(this.musicalVocabulary).map(([category, terms]) => `
                        <div class="vocab-category">
                            <h4>${category.replace('_', ' ')}</h4>
                            ${Object.entries(terms).map(([term, def]) => 
                                `<div class="vocab-term"><strong>${term}:</strong> ${def}</div>`
                            ).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return content;
    }

    generatePrintReferenceChart() {
        const periods = {
            'Medieval (1a)': this.pieces.filter(p => p.assignment === '1a'),
            'Medieval Polyphony (1b)': this.pieces.filter(p => p.assignment === '1b'),
            'Secular Medieval (2a)': this.pieces.filter(p => p.assignment === '2a'),
            'Renaissance Mass (2b)': this.pieces.filter(p => p.assignment === '2b'),
            'Renaissance Vocal (3a)': this.pieces.filter(p => p.assignment === '3a')
        };
        
        let content = '';
        
        Object.entries(periods).forEach(([period, pieces]) => {
            content += `<div class="period"><h2>${period}</h2>`;
            
            pieces.forEach(piece => {
                const pieceKey = piece.audioFile.replace('audio/', '').replace('.mp3', '');
                const characteristics = this.pieceCharacteristics[pieceKey];
                
                content += `
                    <div class="piece">
                        <div class="piece-title">${piece.title}</div>
                        <div class="piece-info">${piece.composer} • ${piece.genre}</div>
                        <div class="characteristics">
                            <strong>Key Characteristics:</strong><br>
                            ${characteristics ? characteristics.keyCharacteristics.join(', ') : 'Not available'}
                        </div>
                    </div>
                `;
            });
            
            content += '</div>';
        });
        
        // Add basic musical terms section
        content += `
            <div class="vocab-section">
                <h2>Basic Musical Terms</h2>
                <div style="columns: 2;">
                    <div style="margin-bottom: 15px;">
                        <strong>Scale & Mode:</strong><br>
                        <strong>Scale:</strong> Organized set of pitches with specific intervals<br>
                        <strong>Mode:</strong> Musical conventions for using a scale, including "home note"<br>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Melody & Structure:</strong><br>
                        <strong>Melody:</strong> Succession of pitches and rhythms as aesthetic whole<br>
                        <strong>Phrase:</strong> Melodic sections with progression, ending in cadence<br>
                        <strong>Theme:</strong> Important melody with harmony that may dictate form<br>
                        <strong>Motive:</strong> Small melodic fragment for creating phrases/themes<br>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Sound & Texture:</strong><br>
                        <strong>Harmony:</strong> Simultaneous pitches (chords) in progressions<br>
                        <strong>Timbre:</strong> Characteristic sound distinguishing voices/instruments<br>
                        <strong>Texture:</strong> Number of parts and their relationship<br>
                        <strong>Monophony:</strong> Single melodic line, no accompaniment<br>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Rhythm & Time:</strong><br>
                        <strong>Rhythm:</strong> Sound durations and patterns; sound/silence alternation<br>
                        <strong>Meter:</strong> Rhythm organization grouping beats into patterns<br>
                        <strong>Tempo:</strong> Speed of music or rate of meter/pulse<br>
                        <strong>Dynamics:</strong> Volume or degree of loudness/softness<br>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Form & Classification:</strong><br>
                        <strong>Form:</strong> Structural organization using repetition/contrast (ABC)<br>
                        <strong>Genre:</strong> Type determined by form, function, and forces<br>
                        <strong>Song:</strong> Piece sung by one person alone, not part of larger work<br>
                    </div>
                </div>
            </div>
        `;

        // Add period-specific vocabulary section
        content += `
            <div class="vocab-section">
                <h2>Medieval & Renaissance Vocabulary</h2>
                <div style="columns: 2;">
                    ${Object.entries(this.musicalVocabulary).map(([category, terms]) => `
                        <div style="margin-bottom: 15px;">
                            <strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong><br>
                            ${Object.entries(terms).map(([term, def]) => `<strong>${term}:</strong> ${def}`).join('<br>')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return content;
    }

    exportAnalyticsData() {
        const data = {
            exportDate: new Date().toISOString(),
            listeningFrequency: this.analytics.listeningFrequency,
            examResults: this.analytics.examResults,
            totalPiecesStudied: Object.keys(this.analytics.listeningFrequency).length,
            totalListeningSessions: Object.values(this.analytics.listeningFrequency).reduce((sum, data) => sum + data.count, 0),
            averageExamScore: this.analytics.examResults.length > 0 ? 
                this.analytics.examResults.reduce((sum, exam) => sum + exam.percentage, 0) / this.analytics.examResults.length : 0
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `music-quiz-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MusicQuizApp();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully');
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
});