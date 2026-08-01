const crafts = {
  rabbit: {
    name: "うさぎ",
    emoji: "🐰",
    image: "rabbit.jpg",
    pdf: "rabbit.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "かみこっぷを さかさまに おく",
      "みみと かおを きる",
      "みみと かおを はる",
      "できあがり！"
    ],
    play: [
      "🥕 にんじんを さがそう！",
      "➡️ みぎに ぴょん！",
      "⬅️ ひだりに ぴょん！",
      "🙌 たかく あげよう！",
      "🐰 ぴょんぴょん うごかそう！",
      "🎉 にんじんぱーてぃー だいせいこう！"
    ]
  },
  frog: {
    name: "かえる",
    emoji: "🐸",
    image: "frog.jpg",
    pdf: "frog.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "みどりの かみを はる",
      "め・くち・てあしを きる",
      "かみこっぷに はる",
      "できあがり！"
    ],
    play: [
      "☔ あめの おさんぽに しゅっぱつ！",
      "➡️ みぎの みずたまりへ ぴょん！",
      "⬅️ ひだりの みずたまりへ ぴょん！",
      "⬆️ したから うえへ じゃんぷ！",
      "🌈 にじを さがして ゆらゆら！",
      "🎉 おいけに とうちゃく！"
    ]
  },
  lion: {
    name: "らいおん",
    emoji: "🦁",
    image: "lion.jpg",
    pdf: "lion.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "きいろの かみを はる",
      "たてがみと かおを きる",
      "かみこっぷに はる",
      "できあがり！"
    ],
    play: [
      "👑 おうさまの ぼうけんに しゅっぱつ！",
      "🚶 ゆっくり あるこう！",
      "➡️ みぎの いわを よけよう！",
      "⬅️ ひだりの いわを よけよう！",
      "🙌 らいおんを たかく あげよう！",
      "🎉 おうかんを げっと！"
    ]
  },
  penguin: {
    name: "ぺんぎん",
    emoji: "🐧",
    image: "penguin.jpg",
    pdf: "penguin.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "くろい かみを はる",
      "おなか・くちばし・つばさを きる",
      "かみこっぷに はる",
      "できあがり！"
    ],
    play: [
      "❄️ こおりの すべりだいへ いこう！",
      "➡️ みぎに よちよち！",
      "⬅️ ひだりに よちよち！",
      "🧊 ゆっくり すべろう！",
      "🔄 くるっと まわろう！",
      "🎉 ゆきの だんす だいせいこう！"
    ]
  },
  rocket: {
    name: "ろけっと",
    emoji: "🚀",
    image: "rocket.jpg",
    pdf: "rocket.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "あおい かみを はる",
      "まど・つばさ・ほのおを きる",
      "かみこっぷに はる",
      "できあがり！"
    ],
    play: [
      "🚀 ろけっとを したに かまえよう！",
      "3️⃣ 3！",
      "2️⃣ 2！",
      "1️⃣ 1！",
      "🙌 たかく あげて はっしゃ！",
      "⭐ みぎと ひだりの ほしを あつめよう！",
      "🌍 ちきゅうに とうちゃく！"
    ]
  },
  flower: {
    name: "おはな",
    emoji: "🌸",
    image: "flower.jpg",
    pdf: "flower.pdf",
    audio: "very_soft_bgm.wav",
    steps: [
      "みどりの かみを はる",
      "はなびら・まんなか・はっぱを きる",
      "かみこっぷに はる",
      "できあがり！"
    ],
    play: [
      "🌱 つぼみを ちいさく しよう！",
      "💧 おみずを あげよう！",
      "☀️ ゆっくり うえへ のびよう！",
      "➡️ みぎの かぜに ゆらゆら！",
      "⬅️ ひだりの かぜに ゆらゆら！",
      "🌸 おおきく おはなが ひらいたよ！"
    ]
  }
};

let selected = "rabbit";
let stream = null;
let guideTimer = null;
let faceMesh = null;
let faceLoopRunning = false;
let lastFaceSend = 0;
let currentMusicMode = "";

const $ = id => document.getElementById(id);

function craftRoot() {
  return $("craftGrid") || $("craftButtons");
}

function renderCraftButtons() {
  const root = craftRoot();
  if (!root) {
    console.error("こうさく選択エリアが見つかりません。");
    return;
  }

  root.innerHTML = "";

  Object.entries(crafts).forEach(([key, craft]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "craft" + (key === selected ? " selected" : "");
    button.innerHTML = `<span>${craft.emoji}</span>${craft.name}`;

    button.addEventListener("click", () => {
      selected = key;
      renderCraftButtons();
      renderCraft();
    });

    root.appendChild(button);
  });
}

function renderCraft() {
  const craft = crafts[selected];

  if ($("craftTitle")) {
    $("craftTitle").textContent = `${craft.emoji} ${craft.name}の つくりかた`;
  }

  if ($("finishedPhoto")) {
    $("finishedPhoto").src = craft.image;
    $("finishedPhoto").alt = `${craft.name}の できあがりしゃしん`;
  }

  if ($("steps")) {
    $("steps").innerHTML = craft.steps.map(step => `<li>${step}</li>`).join("");
  }

  if ($("pdfLink")) {
    $("pdfLink").href = craft.pdf;
    $("pdfLink").setAttribute("download", craft.pdf);
  }

  if ($("cameraTitle")) {
    $("cameraTitle").textContent = `${craft.emoji} ${craft.name}を もってね`;
  }

  stopOrgelMelody();

  const audio = $("bgm");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

function updateMusicLabel(text) {
  if ($("musicState")) {
    $("musicState").textContent = text;
  }
}


// ============================================================
// ひょうじょうで きりかわる オルゴールふうメロディ
// 6しゅるい × 3パターン = 18パターン
// そとのBGMファイルは ひつようありません。
// ============================================================

const NOTE_FREQUENCIES = {
  "ド": 261.63,
  "レ": 293.66,
  "ミ": 329.63,
  "ファ": 349.23,
  "ソ": 392.00,
  "ラ": 440.00,
  "シ": 493.88,
  "ド↑": 523.25,
  "休": 0
};

const ORGEL_MELODIES = {
  rabbit: {
    bright: { bpm: 82, notes: ["ド","ミ","ソ","ミ","ド","ミ","ソ","ラ","ソ","ミ","レ","ド","ミ","ソ","ド↑","休"] },
    calm:   { bpm: 70, notes: ["ド","休","ミ","休","ソ","休","ミ","休","レ","休","ド","休","ド","休","休","休"] },
    wonder: { bpm: 76, notes: ["ド","レ","ミ","ソ","ラ","ソ","ミ","レ","ド","ミ","ソ","ド↑","ソ","休","ド","休"] }
  },
  frog: {
    bright: { bpm: 80, notes: ["ド","レ","ミ","ソ","ミ","レ","ド","レ","ミ","ソ","ミ","レ","ド","休","ド","休"] },
    calm:   { bpm: 68, notes: ["ド","休","レ","休","ミ","休","レ","休","ド","休","ド","休","休","休","休","休"] },
    wonder: { bpm: 74, notes: ["ド","ミ","ソ","ミ","レ","ファ","ミ","レ","ド","レ","ミ","ド","ソ","休","ド","休"] }
  },
  lion: {
    bright: { bpm: 78, notes: ["ド","ソ","ド↑","ミ","ソ","ミ","レ","ド","ソ","ラ","ソ","ミ","ド","休","ド","休"] },
    calm:   { bpm: 66, notes: ["ド","休","ソ","休","ミ","休","ド","休","ド","休","休","休","休","休","休","休"] },
    wonder: { bpm: 72, notes: ["ド","ミ","ソ","ラ","ソ","ミ","レ","ド","ミ","ソ","ド↑","休","ド","休","休","休"] }
  },
  penguin: {
    bright: { bpm: 76, notes: ["ミ","ソ","ラ","ソ","ミ","レ","ド","レ","ミ","ソ","ミ","休","ド","休","ド","休"] },
    calm:   { bpm: 64, notes: ["ミ","休","ソ","休","ミ","休","ド","休","ド","休","休","休","休","休","休","休"] },
    wonder: { bpm: 70, notes: ["ミ","ソ","ド↑","ソ","ミ","レ","ド","ミ","ソ","ド↑","ソ","休","ド","休","休","休"] }
  },
  rocket: {
    bright: { bpm: 84, notes: ["ド","レ","ミ","ソ","ラ","ソ","ミ","ド↑","ソ","ド↑","ソ","ミ","レ","休","ド","休"] },
    calm:   { bpm: 72, notes: ["ド","休","ミ","休","ソ","休","ド↑","休","ソ","休","ミ","休","ド","休","休","休"] },
    wonder: { bpm: 80, notes: ["ド","ミ","ソ","ド↑","ソ","ミ","レ","ド","ミ","ソ","ド↑","ソ","ミ","休","ド","休"] }
  },
  flower: {
    bright: { bpm: 74, notes: ["ド","ミ","ソ","ラ","ソ","ミ","レ","ミ","ド","ミ","ソ","休","ド","休","ド","休"] },
    calm:   { bpm: 62, notes: ["ド","休","ミ","休","ソ","休","ド","休","ド","休","休","休","休","休","休","休"] },
    wonder: { bpm: 68, notes: ["ド","レ","ミ","ソ","ミ","レ","ド","ミ","ソ","ド↑","ソ","休","ド","休","休","休"] }
  }
};

let musicContext = null;
let musicMaster = null;
let musicTimer = null;
let musicStep = 0;
let activeExpression = "calm";
let activeMelodyKey = "";

function ensureMusicContext() {
  if (!musicContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    musicContext = new AudioContextClass();

    musicMaster = musicContext.createGain();
    musicMaster.gain.value = 0.22;

    const lowPass = musicContext.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.value = 1600;
    lowPass.Q.value = 0.4;

    musicMaster.connect(lowPass);
    lowPass.connect(musicContext.destination);
  }

  if (musicContext.state === "suspended") {
    musicContext.resume().catch(() => {});
  }

  return true;
}

function playMusicBoxNote(noteName, durationSeconds) {
  if (!musicContext || !musicMaster) return;

  const frequency = NOTE_FREQUENCIES[noteName] || 0;
  if (!frequency) return;

  const now = musicContext.currentTime;
  const oscillator = musicContext.createOscillator();
  const gain = musicContext.createGain();

  // かどのない、やわらかいオルゴール風
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + Math.max(0.35, durationSeconds * 0.82)
  );

  oscillator.connect(gain);
  gain.connect(musicMaster);

  oscillator.start(now);
  oscillator.stop(now + Math.max(0.45, durationSeconds));
}

function musicLabel(expression) {
  if (expression === "bright") return "🎵 あかるい オルゴール";
  if (expression === "wonder") return "🎵 わくわく オルゴール";
  return "🎵 ゆっくり オルゴール";
}

function startOrgelMelody(expression = "calm", restart = false) {
  if (!ensureMusicContext()) {
    updateMusicLabel("🔊 この ぶらうざでは おとを つかえません");
    return;
  }

  const craftKey = ORGEL_MELODIES[selected] ? selected : "rabbit";
  const expressionKey = ORGEL_MELODIES[craftKey][expression]
    ? expression
    : "calm";
  const melody = ORGEL_MELODIES[craftKey][expressionKey];
  const melodyKey = `${craftKey}-${expressionKey}`;

  activeExpression = expressionKey;
  updateMusicLabel(musicLabel(expressionKey));

  // 表情が変わっても、急に最初へ戻さず次の音から自然に切替
  if (restart || activeMelodyKey !== melodyKey) {
    activeMelodyKey = melodyKey;
    if (restart) musicStep = 0;
  }

  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }

  const beatSeconds = 60 / melody.bpm;

  const tick = () => {
    const latestCraft = ORGEL_MELODIES[selected] ? selected : "rabbit";
    const latestExpression =
      ORGEL_MELODIES[latestCraft][activeExpression]
        ? activeExpression
        : "calm";
    const current = ORGEL_MELODIES[latestCraft][latestExpression];

    const note = current.notes[musicStep % current.notes.length];
    playMusicBoxNote(note, 60 / current.bpm);

    musicStep += 1;
    musicTimer = setTimeout(tick, (60 / current.bpm) * 1000);
  };

  tick();
}

function stopOrgelMelody() {
  if (musicTimer) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
  activeMelodyKey = "";
}

function setMusicMode(mode) {
  const expression =
    mode === "bright" ? "bright" :
    mode === "wonder" ? "wonder" :
    "calm";

  if (currentMusicMode === expression && musicTimer) return;

  currentMusicMode = expression;
  startOrgelMelody(expression, false);
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function handleFaceResults(results) {
  const landmarks =
    results &&
    results.multiFaceLandmarks &&
    results.multiFaceLandmarks[0];

  // かおが見つからないときは、ゆっくりした曲をつづけます。
  if (!landmarks) {
    setMusicMode("calm");
    return;
  }

  const faceWidth = pointDistance(landmarks[234], landmarks[454]) || 1;
  const mouthWidth = pointDistance(landmarks[61], landmarks[291]) / faceWidth;
  const mouthOpen = pointDistance(landmarks[13], landmarks[14]) / faceWidth;
  const cornerY = (landmarks[61].y + landmarks[291].y) / 2;
  const mouthCenterY = (landmarks[13].y + landmarks[14].y) / 2;
  const smileLift = mouthCenterY - cornerY;

  // 口を大きく開ける形 → わくわく曲
  if (mouthOpen > 0.050) {
    setMusicMode("wonder");
  // 口角が上がる形 → あかるい曲
  } else if (mouthWidth > 0.35 && smileLift > 0.003) {
    setMusicMode("bright");
  // そのほか → ゆっくり曲
  } else {
    setMusicMode("calm");
  }
}

async function setupFaceMesh() {
  if (faceMesh || typeof FaceMesh === "undefined") return;

  faceMesh = new FaceMesh({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(handleFaceResults);
  await faceMesh.initialize();
}

async function faceLoop(timestamp) {
  if (!faceLoopRunning) return;

  const video = $("video");

  if (
    faceMesh &&
    video &&
    video.readyState >= 2 &&
    timestamp - lastFaceSend > 180
  ) {
    lastFaceSend = timestamp;

    try {
      await faceMesh.send({ image: video });
    } catch (error) {
      console.warn("表情認識を一時的にスキップしました。", error);
    }
  }

  requestAnimationFrame(faceLoop);
}

function startGuide() {
  const sequence = crafts[selected].play;
  let index = 0;

  if ($("guide")) {
    $("guide").textContent = sequence[0];
  }

  clearInterval(guideTimer);

  const interval = selected === "rocket" ? 4200 : 5200;

  guideTimer = setInterval(() => {
    index += 1;

    if (index < sequence.length) {
      if ($("guide")) {
        $("guide").textContent = sequence[index];
      }
    } else {
      clearInterval(guideTimer);

      if ($("guide")) {
        $("guide").textContent = "📸 しゃしんを とって のこそう！";
      }
    }
  }, interval);
}

async function playBgmFromUserAction() {
  if (!ensureMusicContext()) {
    updateMusicLabel("🔊 この ぶらうざでは おとを つかえません");
    return false;
  }

  try {
    await musicContext.resume();
  } catch (error) {
    console.warn("おとの じゅんびに しっぱいしました。", error);
  }

  currentMusicMode = "";
  musicStep = 0;

  if (musicContext.state !== "running") {
    try {
      await musicContext.resume();
    } catch (error) {
      console.warn("おとを はじめられませんでした。", error);
    }
  }

  setMusicMode("calm");

  // ブラウザによって最初の音が消えることがあるため、
  // ごく短く待ってからもう一度再生状態を確認します。
  await new Promise(resolve => setTimeout(resolve, 80));

  if (!musicTimer) {
    startOrgelMelody("calm", true);
  }

  return musicContext.state === "running";
}

async function openCameraAndPlay() {
  if ($("cameraPanel")) {
    $("cameraPanel").classList.add("open");
    $("cameraPanel").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // 「つぎへ」を押した直後に再生します。
  // カメラ許可を待つ前なので、ブラウザの自動再生制限にかかりにくくなります。
  await playBgmFromUserAction();
  startGuide();

  const video = $("video");
  if (!video || !navigator.mediaDevices) return;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    try {
      await setupFaceMesh();

      if (faceMesh) {
        faceLoopRunning = true;
        requestAnimationFrame(faceLoop);
      }
    } catch (error) {
      updateMusicLabel("🎵 やさしい おんがく");
    }
  } catch (error) {
    if ($("guide")) {
      $("guide").textContent =
        "かめらを つかえません。おんがくだけでも あそべるよ！";
    }
  }
}

function closeCamera() {
  clearInterval(guideTimer);
  faceLoopRunning = false;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  stream = null;

  if ($("video")) {
    $("video").srcObject = null;
  }

  stopOrgelMelody();

  const audio = $("bgm");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  if ($("cameraPanel")) {
    $("cameraPanel").classList.remove("open");
  }

  if ($("nextBtn")) {
    $("nextBtn").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCraftButtons();
  renderCraft();

  if ($("nextBtn")) {
    $("nextBtn").addEventListener("click", openCameraAndPlay);
  }

  if ($("replayBtn")) {
    $("replayBtn").addEventListener("click", async () => {
      stopOrgelMelody();
      musicStep = 0;
      await playBgmFromUserAction();
      startGuide();
    });
  }

  if ($("closeBtn")) {
    $("closeBtn").addEventListener("click", closeCamera);
  }
});
