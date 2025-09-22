// Commutr - Interactive Prototype JavaScript

// Global state
let currentScreen = 'loading-screen';
let selectedCommute = null;
let selectedMood = null;
let selectedTopics = [];
let selectedContent = null;
let currentLessonSection = 0;
let lessonTimer = null;
let isPaused = false;
let userProfile = null;
let selectedPath = null;
let currentQuizQuestion = 0;
let quizScore = 0;

// Dynamic lesson pool with varied content
const lessonPool = [
  {
    id: 'ai-leadership',
    title: 'Leading Through AI Transformation',
    type: 'Executive Brief',
    duration: 8,
    difficulty: 'Advanced',
    creator: 'Sarah Chen, McKinsey',
    summary: 'Strategic insights for executives navigating AI adoption in finance',
    moods: ['focused', 'reflective'],
    topics: ['AI & Leadership', 'Executive Skills'],
    sections: [
      {
        title: "The Leadership Paradox",
        content: "While AI automates routine tasks, it amplifies the need for uniquely human leadership skills. Executives must balance technological adoption with human-centered decision making.",
        takeaway: "Focus on developing emotional intelligence and strategic thinking as AI handles operational complexity."
      },
      {
        title: "Strategic Implementation",
        content: "Successful AI transformation requires a phased approach. Start with pilot programs in non-critical areas to build confidence and learn before scaling to core business functions.",
        takeaway: "Begin with low-risk, high-impact AI implementations to demonstrate value and build organizational buy-in."
      }
    ],
    quiz: [
      {
        question: "What is the key leadership challenge with AI adoption?",
        options: ["Technical complexity", "Balancing automation with human skills", "Cost management", "Timeline pressure"],
        correct: 1
      },
      {
        question: "What's the recommended approach for AI implementation?",
        options: ["Full deployment immediately", "Phased pilot programs", "Wait for competitors", "Outsource completely"],
        correct: 1
      }
    ]
  },
  {
    id: 'fintech-trends',
    title: 'Q4 Fintech Market Pulse',
    type: 'Market Analysis',
    duration: 12,
    difficulty: 'Intermediate',
    creator: 'Bloomberg Intelligence',
    summary: 'Key market movements and emerging opportunities in fintech',
    moods: ['curious', 'focused'],
    topics: ['Fintech Trends', 'Market Analysis'],
    sections: [
      {
        title: "Digital Banking Evolution",
        content: "Traditional banks are accelerating digital transformation, with 73% increasing tech budgets. Neo-banks face profitability pressure as interest rates rise.",
        takeaway: "Focus on sustainable unit economics over rapid growth in current market conditions."
      }
    ],
    quiz: [
      {
        question: "What percentage of traditional banks increased tech budgets?",
        options: ["63%", "73%", "83%", "93%"],
        correct: 1
      }
    ]
  },
  {
    id: 'negotiation-tactics',
    title: 'Executive Negotiation Mastery',
    type: 'Skill Builder',
    duration: 15,
    difficulty: 'Advanced',
    creator: 'Harvard Business Review',
    summary: 'Advanced techniques for high-stakes business negotiations',
    moods: ['focused', 'energetic'],
    topics: ['Executive Skills', 'Team Management'],
    sections: [
      {
        title: "Anchoring Strategies",
        content: "The first number mentioned in a negotiation disproportionately influences the final outcome. Strategic anchoring can shift negotiations by 20-30%.",
        takeaway: "Always prepare multiple anchor points and lead with ambitious but justifiable positions."
      }
    ],
    quiz: [
      {
        question: "How much can strategic anchoring influence negotiations?",
        options: ["10-15%", "20-30%", "40-50%", "60-70%"],
        correct: 1
      }
    ]
  }
];

// Badge system
const badges = [
  { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', requirement: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day learning streak', icon: '💎', requirement: 30 },
  { id: 'topics_5', name: 'Curious Mind', description: 'Explored 5 different topics', icon: '🧠', requirement: 5 },
  { id: 'advanced_3', name: 'Expert Level', description: 'Completed 3 advanced lessons', icon: '🎯', requirement: 3 }
];

// User persistence and profile management
function loadUserProfile() {
  const saved = localStorage.getItem('commutr_profile');
  if (saved) {
    userProfile = JSON.parse(saved);
    updateWelcomeStats();
  } else {
    userProfile = {
      name: 'Quinn',
      streak: 47,
      topicsMastered: 12,
      lessonsCompleted: 156,
      badges: ['streak_7', 'streak_30', 'topics_5'],
      preferredDifficulty: 'Advanced',
      isPremium: true,
      totalMinutesLearned: 1240,
      reflections: []
    };
    saveUserProfile();
  }
}

function saveUserProfile() {
  localStorage.setItem('commutr_profile', JSON.stringify(userProfile));
}

function updateWelcomeStats() {
  if (userProfile) {
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = userProfile.streak;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = userProfile.topicsMastered;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = userProfile.lessonsCompleted;
  }
}

// Dynamic content recommendation engine
function getRecommendedLessons(commuteDuration, mood, topics, path = 'focus') {
  let availableLessons = lessonPool.filter(lesson => {
    const durationMatch = lesson.duration <= commuteDuration + 2;
    const moodMatch = lesson.moods.includes(mood);
    const topicMatch = path === 'explore' || lesson.topics.some(topic => topics.includes(topic));
    return durationMatch && (moodMatch || path === 'explore') && topicMatch;
  });

  if (userProfile.preferredDifficulty) {
    const preferredLessons = availableLessons.filter(l => l.difficulty === userProfile.preferredDifficulty);
    const otherLessons = availableLessons.filter(l => l.difficulty !== userProfile.preferredDifficulty);
    availableLessons = [...preferredLessons, ...otherLessons];
  }

  if (path === 'explore') {
    const surpriseLessons = lessonPool.filter(lesson => 
      lesson.duration <= commuteDuration + 2 && 
      !lesson.topics.some(topic => topics.includes(topic))
    );
    availableLessons = [...availableLessons, ...surpriseLessons.slice(0, 1)];
  }

  return shuffleArray(availableLessons).slice(0, 3);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadUserProfile();
  simulateAIProcessing();
  
  setTimeout(() => {
    showScreen('welcome-screen');
  }, 2000);
});

// Screen navigation
function showScreen(screenId) {
  const currentScreenEl = document.querySelector('.screen.active');
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
  }
  
  setTimeout(() => {
    const newScreen = document.getElementById(screenId);
    newScreen.classList.add('active');
    currentScreen = screenId;
    
    // Handle screen-specific initialization
    if (screenId === 'content-screen') {
      const contentGrid = document.querySelector('.content-grid');
      if (contentGrid && contentGrid.children.length === 0) {
        generateContentRecommendations();
      }
    } else if (screenId === 'path-screen') {
      // Set the correct difficulty button as active
      if (userProfile && userProfile.preferredDifficulty) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.level === userProfile.preferredDifficulty) {
            btn.classList.add('active');
          }
        });
      }
    }
  }, 150);
}

// Start commute flow
function startCommute() {
  showScreen('commute-screen');
}

// Commute selection
function selectCommute(duration, type) {
  document.querySelectorAll('.commute-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.commute-card').classList.add('selected');
  selectedCommute = { duration, type };
  
  setTimeout(() => {
    showScreen('mood-screen');
  }, 800);
}

// Mood selection
function selectMood(mood) {
  document.querySelectorAll('.mood-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.mood-card').classList.add('selected');
  selectedMood = mood;
  updateMoodContinueButton();
}

// Topic selection
function toggleTopic(topicElement) {
  topicElement.classList.toggle('selected');
  
  const topicText = topicElement.textContent;
  if (selectedTopics.includes(topicText)) {
    selectedTopics = selectedTopics.filter(topic => topic !== topicText);
  } else {
    selectedTopics.push(topicText);
  }
  
  updateMoodContinueButton();
}

// Update mood continue button state
function updateMoodContinueButton() {
  const continueBtn = document.getElementById('mood-continue-btn');
  if (selectedMood && selectedTopics.length > 0) {
    continueBtn.disabled = false;
  } else {
    continueBtn.disabled = true;
  }
}

// Path selection
function selectPath(path) {
  document.querySelectorAll('.path-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.path-card').classList.add('selected');
  selectedPath = path;
  
  setTimeout(() => {
    generateContentRecommendations();
    showScreen('content-screen');
  }, 800);
}

// Difficulty selection
function setDifficulty(level) {
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  userProfile.preferredDifficulty = level;
  saveUserProfile();
}

// Generate content recommendations
function generateContentRecommendations() {
  const contentGrid = document.querySelector('.content-grid');
  const loadingShimmer = document.getElementById('content-loading');
  
  // Show loading shimmer
  if (loadingShimmer) {
    loadingShimmer.style.display = 'block';
  }
  contentGrid.style.display = 'none';
  
  setTimeout(() => {
    // Use defaults if not set
    const commuteDuration = selectedCommute ? selectedCommute.duration : 15;
    const mood = selectedMood || 'focused';
    const topics = selectedTopics.length > 0 ? selectedTopics : ['AI & Leadership'];
    const path = selectedPath || 'focus';
    
    const recommendations = getRecommendedLessons(commuteDuration, mood, topics, path);
    
    contentGrid.innerHTML = '';
    
    recommendations.forEach((lesson, index) => {
      const card = createContentCard(lesson, index === 0);
      contentGrid.appendChild(card);
    });
    
    // Hide loading and show content
    if (loadingShimmer) {
      loadingShimmer.style.display = 'none';
    }
    contentGrid.style.display = 'flex';
    
  }, 1500);
}

// Create content card
function createContentCard(lesson, isFeatured = false) {
  const card = document.createElement('div');
  card.className = `content-card ${isFeatured ? 'featured' : ''}`;
  card.onclick = () => selectContent(card, lesson);
  
  card.innerHTML = `
    <div class="content-header">
      <span class="content-type">${lesson.type}</span>
      <span class="duration">${lesson.duration} min</span>
    </div>
    <h3>${lesson.title}</h3>
    <p>${lesson.summary}</p>
    <div class="content-meta">
      <span class="difficulty">${lesson.difficulty}</span>
      <span class="creator">by ${lesson.creator}</span>
    </div>
    ${isFeatured ? '<div class="recommended-badge">🎯 Perfect Match</div>' : ''}
  `;
  
  return card;
}

// Content selection
function selectContent(contentElement, lessonData) {
  document.querySelectorAll('.content-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  contentElement.classList.add('selected');
  selectedContent = lessonData;
  
  const continueBtn = document.getElementById('content-continue-btn');
  continueBtn.disabled = false;
}

// Start learning
function startLearning() {
  showScreen('learning-screen');
  initializeLearning();
}

// Initialize learning interface
function initializeLearning() {
  currentLessonSection = 0;
  updateLessonContent();
  startLessonTimer();
}

// Update lesson content
function updateLessonContent() {
  if (!selectedContent || !selectedContent.sections) return;
  
  const section = selectedContent.sections[currentLessonSection];
  
  document.getElementById('lesson-title').textContent = selectedContent.title;
  document.querySelector('#lesson-section h3').textContent = section.title;
  document.querySelector('#lesson-section p').textContent = section.content;
  document.querySelector('.insight-highlight').innerHTML = `💡 <strong>Takeaway:</strong> ${section.takeaway}`;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  prevBtn.disabled = currentLessonSection === 0;
  nextBtn.textContent = currentLessonSection === selectedContent.sections.length - 1 ? 'Complete' : 'Continue';
  
  const progress = ((currentLessonSection + 1) / selectedContent.sections.length) * 100;
  document.getElementById('lesson-progress-fill').style.width = progress + '%';
}

// Lesson navigation
function nextSection() {
  if (currentLessonSection < selectedContent.sections.length - 1) {
    currentLessonSection++;
    updateLessonContent();
  } else {
    if (lessonTimer) {
      clearInterval(lessonTimer);
    }
    startQuiz();
  }
}

function previousSection() {
  if (currentLessonSection > 0) {
    currentLessonSection--;
    updateLessonContent();
  }
}

// Lesson timer
function startLessonTimer() {
  let timeRemaining = selectedContent.duration * 60;
  
  lessonTimer = setInterval(() => {
    if (!isPaused) {
      timeRemaining--;
      
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      document.getElementById('time-remaining').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
      
      if (timeRemaining <= 0) {
        clearInterval(lessonTimer);
        startQuiz();
      }
    }
  }, 1000);
}

// Pause/resume functionality
function togglePause() {
  isPaused = !isPaused;
  const pauseBtn = document.getElementById('pause-btn');
  pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
}

// Minimize learning
function minimizeLearning() {
  showToast('Minimize feature would allow background learning while using other apps.');
}

// Quiz functionality
function startQuiz() {
  if (!selectedContent || !selectedContent.quiz) {
    showScreen('reflection-screen');
    return;
  }
  
  currentQuizQuestion = 0;
  quizScore = 0;
  showScreen('quiz-screen');
  loadQuizQuestion();
}

function loadQuizQuestion() {
  const quiz = selectedContent.quiz;
  const question = quiz[currentQuizQuestion];
  
  document.getElementById('quiz-question-text').textContent = question.question;
  document.getElementById('quiz-question-number').textContent = currentQuizQuestion + 1;
  document.getElementById('quiz-total-questions').textContent = quiz.length;
  
  const optionsContainer = document.getElementById('quiz-options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'quiz-option';
    optionElement.textContent = option;
    optionElement.onclick = () => selectQuizOption(optionElement, index, question.correct);
    optionsContainer.appendChild(optionElement);
  });
  
  document.getElementById('quiz-next-btn').disabled = true;
  document.getElementById('quiz-feedback').style.display = 'none';
}

function selectQuizOption(optionElement, selectedIndex, correctIndex) {
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.classList.remove('selected', 'correct', 'incorrect');
  });
  
  optionElement.classList.add('selected');
  
  const isCorrect = selectedIndex === correctIndex;
  if (isCorrect) {
    optionElement.classList.add('correct');
    quizScore++;
  } else {
    optionElement.classList.add('incorrect');
    document.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
  }
  
  const feedback = document.getElementById('quiz-feedback');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackText = document.getElementById('feedback-text');
  
  feedbackIcon.textContent = isCorrect ? '✅' : '❌';
  feedbackText.textContent = isCorrect ? 'Correct! Great job.' : 'Not quite right. The correct answer is highlighted.';
  feedback.style.display = 'block';
  
  document.getElementById('quiz-next-btn').disabled = false;
}

function nextQuizQuestion() {
  currentQuizQuestion++;
  if (currentQuizQuestion < selectedContent.quiz.length) {
    loadQuizQuestion();
  } else {
    showScreen('reflection-screen');
  }
}

function skipQuiz() {
  showScreen('reflection-screen');
}

// Reflection functionality
function saveReflection() {
  const reflectionText = document.getElementById('reflection-text').value;
  if (reflectionText.trim()) {
    userProfile.reflections = userProfile.reflections || [];
    userProfile.reflections.push({
      lesson: selectedContent.title,
      reflection: reflectionText,
      date: new Date().toISOString()
    });
    saveUserProfile();
  }
  completeLearning();
}

function skipReflection() {
  completeLearning();
}

// Enhanced completion
function completeLearning() {
  userProfile.lessonsCompleted++;
  userProfile.totalMinutesLearned += selectedContent.duration;
  userProfile.streak++;
  
  const newBadges = checkForNewBadges();
  updateCompletionScreen(newBadges);
  
  saveUserProfile();
  showScreen('completion-screen');
}

function checkForNewBadges() {
  const newBadges = [];
  badges.forEach(badge => {
    if (!userProfile.badges.includes(badge.id)) {
      let earned = false;
      
      switch(badge.id) {
        case 'streak_7':
          earned = userProfile.streak >= 7;
          break;
        case 'streak_30':
          earned = userProfile.streak >= 30;
          break;
        case 'topics_5':
          earned = userProfile.topicsMastered >= 5;
          break;
        case 'advanced_3':
          earned = userProfile.lessonsCompleted >= 3;
          break;
      }
      
      if (earned) {
        userProfile.badges.push(badge.id);
        newBadges.push(badge);
      }
    }
  });
  
  return newBadges;
}

function updateCompletionScreen(newBadges) {
  document.getElementById('completion-minutes').textContent = selectedContent.duration;
  document.getElementById('completion-insights').textContent = selectedContent.sections.length;
  document.getElementById('completion-streak').textContent = userProfile.streak;
  
  if (userProfile.isPremium) {
    document.getElementById('total-time').textContent = (userProfile.totalMinutesLearned / 60).toFixed(1);
    document.getElementById('skills-advanced').textContent = userProfile.topicsMastered;
  }
  
  if (newBadges.length > 0) {
    const badgeEarned = document.getElementById('badge-earned');
    badgeEarned.style.display = 'block';
    badgeEarned.querySelector('.badge-icon').textContent = newBadges[0].icon;
    badgeEarned.querySelector('.badge-text').textContent = `${newBadges[0].name} Earned!`;
  }
  
  const takeawaysList = document.getElementById('takeaways-list');
  takeawaysList.innerHTML = '';
  selectedContent.sections.forEach(section => {
    const li = document.createElement('li');
    li.textContent = section.takeaway;
    takeawaysList.appendChild(li);
  });
}

// Enhanced sharing
function shareInsights() {
  const insights = selectedContent.sections.map(section => `• ${section.takeaway}`).join('\n');
  const shareText = `Day ${userProfile.streak} on Commutr — learned ${selectedContent.title.toLowerCase()}.\n\nKey insights:\n${insights}\n\n#microlearning #commute`;
  
  if (navigator.share) {
    navigator.share({
      title: 'My Commutr Learning Insights',
      text: shareText
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('Insights copied to clipboard!');
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function planNextCommute() {
  selectedCommute = null;
  selectedMood = null;
  selectedTopics = [];
  selectedContent = null;
  selectedPath = null;
  currentLessonSection = 0;
  
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  document.getElementById('mood-continue-btn').disabled = true;
  document.getElementById('content-continue-btn').disabled = true;
  
  showScreen('welcome-screen');
}

// Simulate realistic loading states
function simulateAIProcessing() {
  const messages = [
    "Analyzing your preferences...",
    "Curating personalized content...",
    "Optimizing for your commute duration...",
    "Preparing your learning journey..."
  ];
  
  let messageIndex = 0;
  const loadingText = document.querySelector('.loading-container p');
  
  const messageInterval = setInterval(() => {
    if (messageIndex < messages.length) {
      loadingText.textContent = messages[messageIndex];
      messageIndex++;
    } else {
      clearInterval(messageInterval);
    }
  }, 500);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
          const topicCloud = document.querySelector('.topic-cloud');
          const newTopic = document.createElement('span');
          newTopic.className = 'topic-tag selected';
          newTopic.textContent = searchTerm;
          newTopic.onclick = () => toggleTopic(newTopic);
          topicCloud.appendChild(newTopic);
          
          selectedTopics.push(searchTerm);
          updateMoodContinueButton();
          
          e.target.value = '';
        }
      }
    });
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (currentScreen === 'learning-screen') {
    switch(e.key) {
      case 'ArrowLeft':
        if (!document.getElementById('prev-btn').disabled) {
          previousSection();
        }
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSection();
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
    }
  }
});

// Add click feedback to interactive elements
document.addEventListener('click', function(e) {
  if (e.target.matches('button, .card, .btn-primary, .btn-secondary')) {
    e.target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 150);
  }
});
