/* บันทึกเป็นไฟล์ชื่อ app.js */
let currentIndex = 0;
let userAnswers = new Array(50).fill(null); // เก็บคำตอบ (50 ข้อ)
let timeLeft = 60 * 60; // 60 นาที
let timerInterval;

function init() {
    renderQuestion();
    startTimer();
}

// ระบบนับเวลา
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        document.getElementById("timer").innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("หมดเวลาทำข้อสอบแล้วครับ!");
            finishExam();
        }
    }, 1000);
}

// แสดงโจทย์
function renderQuestion() {
    // ดึงข้อมูลจาก questions.js
    const q = questions[currentIndex]; 
    document.getElementById("progress").innerText = "ข้อที่: " + (currentIndex + 1) + " / 50";
document.getElementById("category-label").innerText = `หมวดหมู่: ${q.category || "คำศัพท์และหลักภาษาไทย"}`;
    document.getElementById("question-text").innerText = q.question;
    
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.classList.add("option-btn");
        
        // ตรวจสอบว่าเคยเลือกข้อนี้ไว้หรือยัง
        if (userAnswers[currentIndex] === idx) {
            btn.classList.add("selected");
        }

        btn.onclick = () => {
            userAnswers[currentIndex] = idx;
            renderQuestion(); // รีเฟรชหน้าจอเพื่อแสดงสีปุ่มที่เลือก
        };
        container.appendChild(btn);
    });

    // คุมปุ่มนำทาง
    document.getElementById("prev-btn").disabled = (currentIndex === 0);
    document.getElementById("next-btn").innerText = (currentIndex === 49) ? "ส่งข้อสอบ" : "ข้อถัดไป ➔";
}

function goPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

function goNext() {
    if (currentIndex < 49) {
        currentIndex++;
        renderQuestion();
    } else {
        if (confirm("คุณตรวจสอบคำตอบครบ 50 ข้อแล้วใช่ไหมครับ?")) {
            finishExam();
        }
    }
}

// สรุปผลสอบ
function finishExam() {
    clearInterval(timerInterval);
    let finalScore = 0;
    
    userAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].answerIndex) {
            finalScore++;
        }
    });

    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("result-box").style.display = "block";
    document.getElementById("final-score").innerText = `${finalScore} / 50`;
    
    let evaluation = "";
    if (finalScore >= 45) evaluation = "ยอดเยี่ยมที่สุด! เตรียมตัวเป็นว่าที่ข้าราชการได้เลยครับ";
    else if (finalScore >= 30) evaluation = "เก่งมากครับ ผ่านเกณฑ์พื้นฐานแล้ว ฝึกเพิ่มอีกนิดนะครับ";
    else evaluation = "สู้ๆ ครับ กลับมาทบทวนข้อที่ผิดบ่อยๆ นะครับ!";
    
    document.getElementById("evaluation-text").innerText = evaluation;
}

window.onload = init;
