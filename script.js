document.addEventListener('DOMContentLoaded', () => {
    // Navigation elements
    const homeLink = document.getElementById('home-link');
    const homePage = document.getElementById('home-page');
    const practiceLink = document.getElementById('practice-link');
    const practicePage = document.getElementById('practice-page');
    const tipsLink = document.getElementById('tips-link');
    const tipsPage = document.getElementById('tips-page');
    const startTypingBtn = document.getElementById('start-typing-btn');
    
    // Typing test elements
    const textDisplay = document.querySelector('.text-content');
    const typingField = document.getElementById('typing-field');
    const timer = document.querySelector('.timer');
    const wpmValue = document.querySelector('.stat-value');
    const accuracyValue = document.querySelectorAll('.stat-value')[1];
    const charsValue = document.querySelectorAll('.stat-value')[2];
    const restartBtn = document.querySelector('.restart-btn');
    const optionBtns = document.querySelectorAll('.option-btn');
    const fontButtons = document.querySelectorAll('.font-buttons .option-btn');
    const startBtn = document.querySelector('.start-btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Time option buttons
    const timeButtons = document.querySelectorAll('.option-buttons:nth-of-type(1) .option-btn');
    // Mode option buttons
    const modeButtons = document.querySelectorAll('.option-buttons:nth-of-type(2) .option-btn');
    // Difficulty option buttons
    const difficultyButtons = document.querySelectorAll('.option-buttons:nth-of-type(3) .option-btn');
    
    // Sound effects
    const keyPressSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-keyboard-hard-key-click-1118.mp3');
    const keyErrorSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-electricity-buzz-955.mp3');
    
    let startTime;
    let timerInterval;
    let timeLimit = 15; // Default time limit in seconds
    let isTimerRunning = false;
    let testActive = false; // Flag to track if test is ready to receive input
    let totalChars = 0;
    let correctChars = 0;
    let currentPosition = 0;
    let currentCharIndex = 0;
    let currentFont = 'jetbrains-mono'; // Default font
    let currentMode = 'words'; // Default mode
    let currentDifficulty = 'medium'; // Default difficulty
    let cursorVisible = true; // Default cursor visible
    let letterHighlight = false; // Default letter highlight off
    let textArray = []; // Added missing declaration
    let currentText = ''; // Added missing declaration
    let soundEnabled = true; // Default sound enabled
    
    // Common English words for random text generation
    const commonWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
        'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ];
    
    // Generate random text based on current difficulty
    function generateRandomText(wordCount) {
        let result = [];
        let wordPool = [];
        
        // Select word pool based on difficulty
        if (currentDifficulty === 'easy') {
            // Easy - Only common, short words
            wordPool = commonWords.filter(word => word.length <= 5);
        } else if (currentDifficulty === 'medium') {
            // Medium - All common words
            wordPool = commonWords;
        } else if (currentDifficulty === 'hard') {
            // Hard - Longer and more complex words
            wordPool = [
                ...commonWords,
                'algorithm', 'complexity', 'typescript', 'javascript', 'programming',
                'development', 'interface', 'technology', 'experience', 'application',
                'architecture', 'documentation', 'implementation', 'functionality', 'performance',
                'responsive', 'optimization', 'accessibility', 'infrastructure', 'authentication'
            ];
        }
        
        // Generate text based on current mode
        if (currentMode === 'words') {
            for (let i = 0; i < wordCount; i++) {
                const randomIndex = Math.floor(Math.random() * wordPool.length);
                result.push(wordPool[randomIndex]);
            }
            return result.join(' ');
        } else if (currentMode === 'quotes') {
            const quotes = [
                "The only way to do great work is to love what you do.",
                "Life is what happens when you're busy making other plans.",
                "The future belongs to those who believe in the beauty of their dreams.",
                "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                "In the end, we will remember not the words of our enemies, but the silence of our friends."
            ];
            return quotes[Math.floor(Math.random() * quotes.length)];
        } else if (currentMode === 'code') {
            const codeSnippets = [
                "function helloWorld() {\n  console.log('Hello, World!');\n  return true;\n}",
                "const sum = (a, b) => {\n  return a + b;\n};",
                "let counter = 0;\nwhile (counter < 10) {\n  console.log(counter);\n  counter++;\n}",
                "class User {\n  constructor(name) {\n    this.name = name;\n  }\n  sayHello() {\n    return `Hello ${this.name}`;\n  }\n}"
            ];
            return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }
        
        // Default fallback
        return result.join(' ');
    }
    
    // Navigation functions
    function showHomePage() {
        homePage.style.display = 'flex';
        practicePage.style.display = 'none';
        tipsPage.style.display = 'none';
        
        homeLink.classList.add('active');
        practiceLink.classList.remove('active');
        tipsLink.classList.remove('active');
        
        // Add smooth fade-in effects when switching pages
        homePage.style.opacity = 0;
        setTimeout(() => {
            homePage.style.opacity = 1;
            homePage.style.transition = 'opacity 0.3s ease';
        }, 50);
    }
    
    function showPracticePage() {
        homePage.style.display = 'none';
        practicePage.style.display = 'block';
        tipsPage.style.display = 'none';
        
        homeLink.classList.remove('active');
        practiceLink.classList.add('active');
        tipsLink.classList.remove('active');
        
        // Add smooth fade-in effects when switching pages
        practicePage.style.opacity = 0;
        setTimeout(() => {
            practicePage.style.opacity = 1;
            practicePage.style.transition = 'opacity 0.3s ease';
        }, 50);
        
        initTypingTest();
    }
    
    function showTipsPage() {
        homePage.style.display = 'none';
        practicePage.style.display = 'none';
        tipsPage.style.display = 'block';
        
        homeLink.classList.remove('active');
        practiceLink.classList.remove('active');
        tipsLink.classList.add('active');
        
        // Add smooth fade-in effects when switching pages
        tipsPage.style.opacity = 0;
        setTimeout(() => {
            tipsPage.style.opacity = 1;
            tipsPage.style.transition = 'opacity 0.3s ease';
        }, 50);
    }
    
    // Initialize the typing test
    function initTypingTest() {
        // Reset stats
        wpmValue.textContent = '0';
        accuracyValue.textContent = '100%';
        charsValue.textContent = '0';
        totalChars = 0;
        correctChars = 0;
        currentPosition = 0;
        currentCharIndex = 0;
        
        // Reset timer
        clearInterval(timerInterval);
        isTimerRunning = false;
        testActive = false;
        timer.textContent = timeLimit;
        
        // Generate random text
        currentText = generateRandomText(50); // Generate 50 random words
        textArray = currentText.split('');
        
        // Reset typing field and update display
        typingField.value = '';
        updateTextDisplay();
        
        // Show start button
        startBtn.style.display = 'flex';
        if (document.querySelector('.enter-hint')) {
            document.querySelector('.enter-hint').style.display = 'block';
        }
    }
    
    // Update the text display showing what has been typed correctly/incorrectly
    function updateTextDisplay() {
        let html = '';
        for (let i = 0; i < textArray.length; i++) {
            if (i < currentPosition) {
                // Check if character was typed correctly
                if (i < typingField.value.length && typingField.value[i] === textArray[i]) {
                    html += `<span class="correct">${textArray[i]}</span>`;
                } else {
                    html += `<span class="error">${textArray[i]}</span>`;
                }
            } else if (i === currentPosition) {
                // Use highlight mode class if enabled
                if (letterHighlight) {
                    html += `<span class="current highlight-mode">${textArray[i]}</span>`;
                } else {
                    html += `<span class="current">${textArray[i]}</span>`;
                }
                // Add cursor after current char if cursor is visible
                if (cursorVisible) {
                    html += `<span class="typing-cursor"></span>`;
                }
            } else {
                html += textArray[i];
            }
        }
        textDisplay.innerHTML = html;
        
        // Apply the selected font to text display
        if (currentFont === 'courier-prime') {
            textDisplay.style.fontFamily = "'Courier Prime', monospace";
        } else if (currentFont === 'jetbrains-mono') {
            textDisplay.style.fontFamily = "'JetBrains Mono', monospace";
        } else if (currentFont === 'roboto-mono') {
            textDisplay.style.fontFamily = "'Roboto Mono', monospace";
        } else if (currentFont === 'source-code-pro') {
            textDisplay.style.fontFamily = "'Source Code Pro', monospace";
        } else if (currentFont === 'space-mono') {
            textDisplay.style.fontFamily = "'Space Mono', monospace";
        } else if (currentFont === 'ibm-plex-mono') {
            textDisplay.style.fontFamily = "'IBM Plex Mono', monospace";
        } else if (currentFont === 'fira-code') {
            textDisplay.style.fontFamily = "'Fira Code', monospace";
        } else if (currentFont === 'ubuntu-mono') {
            textDisplay.style.fontFamily = "'Ubuntu Mono', monospace";
        } else if (currentFont === 'inconsolata') {
            textDisplay.style.fontFamily = "'Inconsolata', monospace";
        } else if (currentFont === 'anonymous-pro') {
            textDisplay.style.fontFamily = "'Anonymous Pro', monospace";
        } else {
            // Default to JetBrains Mono
            textDisplay.style.fontFamily = "'JetBrains Mono', monospace";
        }
        
        // Scroll to make sure current character is visible
        const currentChar = textDisplay.querySelector('.current');
        if (currentChar) {
            currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Start the timer
    function startTimer() {
        if (isTimerRunning) return; // Prevent multiple starts
        
        startTime = new Date();
        isTimerRunning = true;
        testActive = true;
        
        // Hide start button once test begins
        startBtn.style.display = 'none';
        if (document.querySelector('.enter-hint')) {
            document.querySelector('.enter-hint').style.display = 'none';
        }
        
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((new Date() - startTime) / 1000);
            const timeLeft = timeLimit - elapsedTime;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                typingField.contentEditable = false;
                updateTimer(0);
                testActive = false;
                calculateFinalStats();
            } else {
                updateTimer(timeLeft);
                updateStats();
            }
        }, 1000);
    }
    
    // Update the timer display to add animations when time is running low
    function updateTimer(timeLeft) {
        timer.textContent = timeLeft;
        
        // Add animation class when time is running low (less than 5 seconds)
        if (timeLeft <= 5) {
            timer.classList.add('low-time');
        } else {
            timer.classList.remove('low-time');
        }
    }

    // Calculate the current WPM, accuracy and character count
    function updateStats() {
        const elapsedTimeInMinutes = (new Date() - startTime) / 60000;
        const wpm = Math.round(correctChars / 5 / elapsedTimeInMinutes);
        
        wpmValue.textContent = wpm;
        
        if (totalChars > 0) {
            const accuracy = Math.round((correctChars / totalChars) * 100);
            accuracyValue.textContent = `${accuracy}%`;
        }
        
        charsValue.textContent = correctChars;
    }
    
    // Calculate final stats when time is up
    function calculateFinalStats() {
        const elapsedTimeInMinutes = timeLimit / 60;
        const wpm = Math.round(correctChars / 5 / elapsedTimeInMinutes);
        
        wpmValue.textContent = wpm;
        
        if (totalChars > 0) {
            const accuracy = Math.round((correctChars / totalChars) * 100);
            accuracyValue.textContent = `${accuracy}%`;
        }
        
        charsValue.textContent = correctChars;
    }
    
    // Handle keyboard input for typing
    document.addEventListener('keydown', (e) => {
        if (!practicePage.style.display || practicePage.style.display === 'none') {
            return; // Only process typing on the practice page
        }
        
        // Start test when Enter key is pressed
        if (e.key === 'Enter' && !isTimerRunning && !testActive) {
            e.preventDefault();
            startTimer();
            return;
        }
        
        // Restart test when Shift key is pressed
        if (e.key === 'Shift' && !e.repeat) {
            e.preventDefault();
            initTypingTest();
            return;
        }
        
        // Only process typing input if test is active
        if (!testActive || currentPosition >= textArray.length) {
            return;
        }
        
        // Prevent default for typing characters to avoid browser shortcuts
        if (e.key.length === 1 || e.key === 'Backspace') {
            e.preventDefault();
        }
        
        if (e.key.length === 1) {
            const expectedChar = textArray[currentPosition];
            
            if (e.key === expectedChar) {
                currentPosition++;
                correctChars++;
                if (soundEnabled) {
                    // Play key press sound
                    keyPressSound.currentTime = 0;
                    keyPressSound.play().catch(e => console.log("Audio play failed:", e));
                }
                // Add highlight animation to WPM value when typing correctly
                wpmValue.classList.add('highlight');
                setTimeout(() => {
                    wpmValue.classList.remove('highlight');
                }, 200);
            } else {
                // Handle incorrect character - increase total chars but not correct chars
                currentPosition++;
                if (soundEnabled) {
                    // Play error sound for incorrect typing
                    keyErrorSound.currentTime = 0;
                    keyErrorSound.play().catch(e => console.log("Audio play failed:", e));
                }
                // Add highlight animation to accuracy value on error
                accuracyValue.classList.add('highlight');
                setTimeout(() => {
                    accuracyValue.classList.remove('highlight');
                }, 200);
            }
            
            totalChars++;
            
            // Update the typingField value to match what has been typed
            typingField.value = typingField.value + e.key;
            
            updateTextDisplay();
            
        } else if (e.key === 'Backspace' && currentPosition > 0) {
            // Handle backspace - allow users to delete and correct their typing
            currentPosition--;
            totalChars--;
            
            if (soundEnabled) {
                // Play key press sound for backspace
                keyPressSound.currentTime = 0;
                keyPressSound.play().catch(e => console.log("Audio play failed:", e));
            }
            
            // Also update the typingField value when backspace is pressed
            typingField.value = typingField.value.substring(0, typingField.value.length - 1);
            
            updateTextDisplay();
        }
    });

    // Event listener for restart button
    restartBtn.addEventListener('click', () => {
        initTypingTest();
    });
    
    // Event listener for start button
    startBtn.addEventListener('click', () => {
        startTimer();
    });

    // Event listeners for navigation
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHomePage();
    });

    practiceLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPracticePage();
    });
    
    tipsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showTipsPage();
    });

    startTypingBtn.addEventListener('click', () => {
        showPracticePage();
    });

    // Add theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('ri-moon-fill');
            icon.classList.add('ri-sun-fill');
        } else {
            icon.classList.remove('ri-sun-fill');
            icon.classList.add('ri-moon-fill');
        }
    });

    // Update font selection with previews
    fontButtons.forEach(button => {
        const fontName = button.dataset.font;
        
        // Apply the actual font to the button text
        if (fontName === 'courier-prime') {
            button.style.fontFamily = "'Courier Prime', monospace";
        } else if (fontName === 'jetbrains-mono') {
            button.style.fontFamily = "'JetBrains Mono', monospace";
        } else if (fontName === 'roboto-mono') {
            button.style.fontFamily = "'Roboto Mono', monospace";
        } else if (fontName === 'source-code-pro') {
            button.style.fontFamily = "'Source Code Pro', monospace";
        } else if (fontName === 'space-mono') {
            button.style.fontFamily = "'Space Mono', monospace";
        } else if (fontName === 'ibm-plex-mono') {
            button.style.fontFamily = "'IBM Plex Mono', monospace";
        } else if (fontName === 'fira-code') {
            button.style.fontFamily = "'Fira Code', monospace";
        } else if (fontName === 'ubuntu-mono') {
            button.style.fontFamily = "'Ubuntu Mono', monospace";
        } else if (fontName === 'inconsolata') {
            button.style.fontFamily = "'Inconsolata', monospace";
        } else if (fontName === 'anonymous-pro') {
            button.style.fontFamily = "'Anonymous Pro', monospace";
        }
        
        button.addEventListener('click', () => {
            fontButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFont = fontName;
            textDisplay.style.fontFamily = button.style.fontFamily;
        });
    });

    // Font dropdown functionality
    const fontDropdown = document.getElementById('font-dropdown');
    if (fontDropdown) {
        // Set the default selected option to JetBrains Mono
        fontDropdown.value = 'jetbrains-mono';
        
        fontDropdown.addEventListener('change', (e) => {
            const selectedFont = e.target.value;
            currentFont = selectedFont;
            
            // Apply the selected font
            let fontFamily = "'Courier Prime', monospace";
            if (selectedFont === 'jetbrains-mono') fontFamily = "'JetBrains Mono', monospace";
            else if (selectedFont === 'roboto-mono') fontFamily = "'Roboto Mono', monospace";
            else if (selectedFont === 'source-code-pro') fontFamily = "'Source Code Pro', monospace";
            else if (selectedFont === 'space-mono') fontFamily = "'Space Mono', monospace";
            else if (selectedFont === 'ibm-plex-mono') fontFamily = "'IBM Plex Mono', monospace";
            else if (selectedFont === 'fira-code') fontFamily = "'Fira Code', monospace";
            else if (selectedFont === 'ubuntu-mono') fontFamily = "'Ubuntu Mono', monospace";
            else if (selectedFont === 'inconsolata') fontFamily = "'Inconsolata', monospace";
            else if (selectedFont === 'anonymous-pro') fontFamily = "'Anonymous Pro', monospace";
            
            textDisplay.style.fontFamily = fontFamily;
        });
    }
    
    // Add button hover sound effects
    const buttons = document.querySelectorAll('button, .option-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Add subtle hover effect
            button.style.transition = 'all 0.2s ease';
            button.style.transform = 'translateY(-2px)';
            
            // Add subtle scale effect on hover
            button.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('click', () => {
            if (soundEnabled) {
                keyPressSound.currentTime = 0;
                keyPressSound.play().catch(e => console.log("Audio play failed:", e));
            }
            
            // Add click ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            
            const rect = button.getBoundingClientRect();
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            ripple.style.left = (event.clientX - rect.left - rect.width / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - rect.height / 2) + 'px';
            
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize on page load - show home page first
    showHomePage();
    
    // Initialize time buttons - set first one as active
    if (timeButtons.length > 0) {
        timeButtons[0].classList.add('active');
    }
    
    // Initialize mode buttons - set first one as active
    if (modeButtons.length > 0) {
        modeButtons[0].classList.add('active');
    }
    
    // Initialize difficulty buttons - set medium as active
    if (difficultyButtons.length > 1) {
        difficultyButtons[1].classList.add('active');
    }
    
    // Set initial font to JetBrains Mono
    textDisplay.style.fontFamily = "'JetBrains Mono', monospace";
    
    // Add the options panel with cursor and highlight settings to the HTML
    const optionsPanel = document.querySelector('.options-panel');
    if (optionsPanel) {
        // Add new option sections for cursor and highlight settings
        const cursorOption = document.createElement('div');
        cursorOption.className = 'option';
        cursorOption.innerHTML = `
            <label>Cursor Style</label>
            <div class="option-buttons">
                <button class="option-btn cursor-btn active" data-cursor="visible" data-highlight="off">Blinking Cursor</button>
                <button class="option-btn cursor-btn" data-cursor="hidden" data-highlight="on">Letter Highlight</button>
            </div>
        `;
        
        // Add sound toggle option
        const soundOption = document.createElement('div');
        soundOption.className = 'option';
        soundOption.innerHTML = `
            <label>Typing Sound</label>
            <div class="option-buttons">
                <button class="option-btn sound-btn active" data-sound="on">Sound On</button>
                <button class="option-btn sound-btn" data-sound="off">Sound Off</button>
            </div>
        `;
        
        optionsPanel.appendChild(cursorOption);
        optionsPanel.appendChild(soundOption);
        
        // Event listeners for cursor/highlight buttons
        const cursorButtons = document.querySelectorAll('.cursor-btn');
        cursorButtons.forEach(button => {
            button.addEventListener('click', () => {
                cursorButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                cursorVisible = button.dataset.cursor === 'visible';
                letterHighlight = button.dataset.highlight === 'on';
                updateTextDisplay();
            });
        });
        
        // Event listeners for sound toggle
        const soundButtons = document.querySelectorAll('.sound-btn');
        soundButtons.forEach(button => {
            button.addEventListener('click', () => {
                soundButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                soundEnabled = button.dataset.sound === 'on';
            });
        });
    }
    
    // Event listeners for time buttons
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Set the time limit based on button text
            const time = button.textContent.replace('s', '');
            timeLimit = parseInt(time);
            timer.textContent = timeLimit;
            
            // Restart the test with new time limit
            initTypingTest();
        });
    });
    
    // Event listeners for mode buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Set the mode based on button text
            currentMode = button.textContent.toLowerCase();
            
            // Restart the test with new mode
            initTypingTest();
        });
    });
    
    // Event listeners for difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Set the difficulty based on button text
            currentDifficulty = button.textContent.toLowerCase();
            
            // Restart the test with new difficulty
            initTypingTest();
        });
    });
    
    // Add font stylesheets dynamically
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap',
        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&display=swap'
    ];
    
    fontLinks.forEach(link => {
        const linkElem = document.createElement('link');
        linkElem.rel = 'stylesheet';
        linkElem.href = link;
        document.head.appendChild(linkElem);
    });
});