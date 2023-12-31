const Random_Sentence_Url_Api = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const startButton = document.getElementById("starButton");
const typeSound = new Audio("./audio/audio_typing-sound.mp3");
const wrongSound = new Audio("./audio/audio_wrong.mp3");
const correctSound = new Audio("./audio/audio_correct.mp3");

// 入力キーの制御
typeInput.addEventListener("keydown", function(event) {
  const eventKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace"];
  if (eventKeys.includes(event.key)) {
    event.preventDefault();
  }
})

// inputTextの入力値を判定する
typeInput.addEventListener("input", () => {

  const sentenceArray = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");
  let reValue = "";
  let correct = true;

  sentenceArray.forEach((characterSpan, index) => {
    if ((arrayValue[index] == null)) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if(characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      typeSound.play();
      typeSound.currentTime = 0;
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      wrongSound.play();
      wrongSound.currentTime = 0;
      typeInput.value = reValue;
      correct = false;
    }

    //復元用の文字列を作成
    reValue += arrayValue[index]
  })

  //ゲームにクリアした場合、ゲームを終了する
  if (correct == true){
    clearInterval(timerInterval);
    correctSound.play();
    correctSound.currentTime = 0;
    timer.innerText = "クリア !!";
    typeInput.readOnly = true;
    startButton.focus();
    startButton.innerText = "もう一度挑戦する";
  }

});

// ランダムな文字を取得する
function GetRandomSentence() {
  return fetch(Random_Sentence_Url_Api)
  .then((response) => response.json())
  .then((data) => data.content);
}

//（非同期処理）ランダムな文字列を取得して、画面に表示する
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  typeDisplay.innerText = "";

  // 文章を1文字ずつ分解して、spanタグを生成する
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplay.appendChild(characterSpan);
  });

  // リセットする
  typeInput.value = "";
  StartTimer();
};

//タイマーのカウントを開始する
let startTime;
let originTime = 30;
let timerInterval;
function StartTimer() {
  timer.innerText = "残り" + originTime + "秒";
  startTime = new Date();
  timerInterval = setInterval(() => {
    nowTime = originTime - getTimerTime()
    timer.innerText = "残り" + nowTime + "秒";
    if (nowTime <= 0) TimeUp();
  }, 1000);
}

// 経過時間を取得する
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
};

//タイムアップ時の処理を行う
function TimeUp() {
  clearInterval(timerInterval);
  timer.innerText = "Game Over !!";
  typeInput.readOnly = true;
  startButton.focus();
  startButton.innerText = "もう一度挑戦する";
};

//タイピングゲームを開始する
startButton.addEventListener("click", () =>{
  clearInterval(timerInterval);
  typeInput.readOnly = false;
  typeInput.focus();
  startButton.innerText = "リスタートする";
  RenderNextSentence();
})