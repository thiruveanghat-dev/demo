const questions = [
  {
    category: "General knowledge",
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1
  },
  {
    category: "Science",
    question: "What is the largest organ in the human body?",
    answers: ["Heart", "Liver", "Skin", "Lungs"],
    correct: 2
  },
  {
    category: "Geography",
    question: "Which country has the largest population in the world?",
    answers: ["India", "United States", "Indonesia", "China"],
    correct: 0
  },
  {
    category: "Literature",
    question: "Who wrote the play 'Romeo and Juliet'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1
  },
  {
    category: "Technology",
    question: "What does HTML stand for?",
    answers: [
      "High Text Machine Language",
      "HyperText Markup Language",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language"
    ],
    correct: 1
  }
];

let currentQuestion = 0;
let selectedAnswers = Array(questions.length).fill(null);
let secondsLeft = 60;
let timerId;

const quizCard = document.querySelector("#quizCard");
const questionTitle = document.querySelector("#questionTitle");
const questionCount = document.querySelector("#questionCount");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector("#progressBar");
const answersContainer = document.querySelector("#answers");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");
const timerText = document.querySelector("#timerText");
const timer = document.querySelector(".timer");
const categoryLabel = document.querySelector(".eyebrow");

function startTimer() {
  clearInterval(timerId);
  secondsLeft = 60;
  updateTimer();
  timerId = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();
    if (secondsLeft <= 0) {
      clearInterval(timerId);
      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion();
      } else {
        showResults();
      }
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  timer.classList.toggle("warning", secondsLeft <= 10);
}

function renderQuestion() {
  const item = questions[currentQuestion];
  categoryLabel.textContent = item.category;
  questionTitle.textContent = item.question;
  questionCount.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressPercent.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;

  answersContainer.innerHTML = "";
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    if (selectedAnswers[currentQuestion] === index) button.classList.add("selected");
    button.innerHTML = `
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span class="answer-text">${answer}</span>
    `;
    button.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(button);
  });

  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = selectedAnswers[currentQuestion] === null;
  nextButton.querySelector("span").textContent =
    currentQuestion === questions.length - 1 ? "Finish quiz" : "Next question";
  startTimer();
}

function selectAnswer(index) {
  selectedAnswers[currentQuestion] = index;
  document.querySelectorAll(".answer").forEach((button, buttonIndex) => {
    button.classList.toggle("selected", buttonIndex === index);
  });
  nextButton.disabled = false;
}

prevButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (selectedAnswers[currentQuestion] === null) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  clearInterval(timerId);
  const score = selectedAnswers.reduce((total, answer, index) =>
    total + (answer === questions[index].correct ? 1 : 0), 0);

  quizCard.innerHTML = `
    <div class="result-view">
      <div class="result-inner">
        <div class="result-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5 10.7 15l5-6"/></svg>
        </div>
        <p class="eyebrow">Quiz complete</p>
        <div class="score">${score}<span> / ${questions.length}</span></div>
        <h1>${score >= 4 ? "Excellent work!" : score >= 3 ? "Great effort!" : "Keep learning!"}</h1>
        <p>${score >= 4 ? "You know your stuff. Ready for another round?" : "Review the topics and try again to improve your score."}</p>
        <button class="primary-button" id="restartButton" type="button">Try again</button>
      </div>
    </div>
  `;
  document.querySelector("#restartButton").addEventListener("click", restartQuiz);
}

function restartQuiz() {
  currentQuestion = 0;
  selectedAnswers = Array(questions.length).fill(null);
  location.reload();
}

renderQuestion();
