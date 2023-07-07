const Random_Sentence_Url_Api = "https://api.quotable.io/random";
const Type_Display = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const typeSound = new Audio("./audio/audio_typing-sound.mp3");
const wrongSound = new Audio("./audio/audio_wrong.mp3");
const correctSound = new Audio("./audio/audio_correct.mp3");

// inputTextの入力値を判定する
typeInput.addEventListener("input", () => {

  const sentenceArray = Type_Display.querySelectorAll("span");
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
      typeSound.volume = 1;
      typeSound.play();
      typeSound.currentTime = 0;
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      wrongSound.volume = 0.9;
      wrongSound.play();
      typeSound.currentTime = 0;
      correct = false;
      typeInput.value = reValue;
    }

    //復元用の文字列を形成
    reValue += arrayValue[index]
  })

  //次のテキストを表示する
  if (correct == true){
    typeSound.volume = 1;
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
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
  Type_Display.innerText = "";

  // 文章を1文字ずつ分解して、spanタグを生成する
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    Type_Display.appendChild(characterSpan);
  });

  // リセットする
  typeInput.value = "";
  StartTimer();
};

//タイマーのカウントを開始する
let startTime;
let originTime = 30;
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date();
  console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime();
    if (timer.innerHTML <= 0) TimeUp();
  }, 1000);
}

// 経過時間を取得する
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
};

//タイムアップ時の処理を行う
function TimeUp() {
  RenderNextSentence();
};

//タイピングゲームを開始する
RenderNextSentence();
