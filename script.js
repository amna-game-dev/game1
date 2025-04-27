let currentTeam = 1;
let team1Score = 0;
let team2Score = 0;
let questions = [];
let timer;
let timeLeft = 60;

function startGame() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('gamePage').style.display = 'block';
}


// Fetch questions
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        generateBoard();
    });

function generateBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < questions.length; i++) {
        const button = document.createElement('button');
        button.innerText = i + 1;
        button.onclick = () => openQuestion(i);
        board.appendChild(button);
    }
}

function openQuestion(index) {
    clearInterval(timer);
    timeLeft = 60;
    document.getElementById('board').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';

    const q = questions[index];
    document.getElementById('questionCategory').innerText = q.category + " (" + q.points + " pts)";
    document.getElementById('questionText').innerText = q.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => selectAnswer(option, q.answer, q.points, index);
        optionsDiv.appendChild(btn);
    });

    startTimer(index);
}

function selectAnswer(selected, correctAnswer, points, index) {
    if (selected === correctAnswer) {
        if (currentTeam === 1) team1Score += points;
        else team2Score += points;
    }
    updateScoreboard();
    markQuestionAnswered(index);
    switchTeam();
}

function startTimer(index) {
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            markQuestionAnswered(index);
            switchTeam();
        }
    }, 1000);
}

function markQuestionAnswered(index) {
    const buttons = document.querySelectorAll('#board button');
    buttons[index].disabled = true;
    goBack();
}

function switchTeam() {
    currentTeam = currentTeam === 1 ? 2 : 1;
    document.getElementById('turnBanner').innerText = `Team ${currentTeam}'s Turn`;
}

function updateScoreboard() {
    document.getElementById('team1').innerText = `Team 1: ${team1Score}`;
    document.getElementById('team2').innerText = `Team 2: ${team2Score}`;
}

function goBack() {
    clearInterval(timer);
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
}
