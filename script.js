document.addEventListener('DOMContentLoaded', () => {

    // --- ゲーム設定 ---
    const CHARACTERS = [
        { name: 'ねこさん', img: 'assets/images/cat.png' },
        { name: 'うさぎさん', img: 'assets/images/rabbit.png' },
        { name: 'とりさん', img: 'assets/images/bird.png' }
    ];
    const MAX_DONUTS = 5;

    // --- DOM要素の取得 ---
    const characterImg = document.getElementById('character-img');
    const messageText = document.getElementById('message-text');
    const plateArea = document.getElementById('plate-area');
    const donutStockArea = document.getElementById('donut-stock-area');
    const correctModal = document.getElementById('correct-modal');
    
    // --- ゲームの状態管理 ---
    let currentCharacterIndex = 0;
    let targetDonutCount = 0;
    let currentDonutCount = 0;
    let isBgmPlaying = false; // BGMが再生中かどうかのフラグ
    
    // --- 音声ファイル ---
    // ★★★ 変更点: BGMを追加 ★★★
    const bgm = new Audio('assets/audio/simajiro.mp3');
    bgm.loop = true; // BGMをループ再生する
    bgm.volume = 0.3; // BGMの音量を少し下げる（0.0 ~ 1.0）

    const countSounds = {};
    for (let i = 1; i <= MAX_DONUTS; i++) {
        countSounds[i] = new Audio(`assets/audio/count_${i}.wav`);
    }
    const correctSound = new Audio('assets/audio/correct.wav');
    // ★★★ 変更点: popSoundの定義を削除 ★★★
    // const popSound = new Audio('assets/audio/pop.wav');

    // --- ゲームの初期化・問題設定 ---
    function setupQuestion() {
        currentDonutCount = 0;
        plateArea.innerHTML = '';
        
        currentCharacterIndex = Math.floor(Math.random() * CHARACTERS.length);
        targetDonutCount = Math.floor(Math.random() * MAX_DONUTS) + 1;
        
        const character = CHARACTERS[currentCharacterIndex];
        characterImg.src = character.img;
        characterImg.alt = character.name;
        messageText.textContent = `${character.name}に ドーナツを ${targetDonutCount}こ あげよう！`;
        
        enableDonutClicks();
    }
    
    // --- ドーナツをクリックしたときの処理 ---
    // ★★★ この関数全体を大幅に修正 ★★★
    function handleDonutClick() {
        // --- BGMの再生開始 ---
        // 最初のクリックで一度だけBGMを再生開始する
        if (!isBgmPlaying) {
            bgm.play();
            isBgmPlaying = true;
        }

        if (currentDonutCount >= targetDonutCount) {
            return;
        }
        
        currentDonutCount++;
        
        // お皿にドーナツを追加
        const donutElement = document.createElement('div');
        donutElement.classList.add('placed-donut');
        plateArea.appendChild(donutElement);

        const isCorrect = (currentDonutCount === targetDonutCount);

        // --- カウント音声を直接再生 ---
        const countSound = countSounds[currentDonutCount];
        
        if (countSound) {
            countSound.play();
            
            if (isCorrect) {
                disableDonutClicks();
                // カウント音声の再生が終わったら、正解処理を呼び出す
                countSound.addEventListener('ended', showCorrect, { once: true });
            }
        } else if (isCorrect) {
            // カウント音声がないけれど正解の場合
            disableDonutClicks();
            setTimeout(showCorrect, 800);
        }
    }
    
    // --- 正解処理 ---
    function showCorrect() {
        correctSound.play();
        correctModal.classList.remove('hidden');
        correctModal.classList.add('show');
        
        setTimeout(() => {
            correctModal.classList.remove('show');
            correctModal.classList.add('hidden');
            setupQuestion();
        }, 2000);
    }
    
    function enableDonutClicks() {
        donutStockArea.style.opacity = '1';
        donutStockArea.style.pointerEvents = 'auto';
    }
    
    function disableDonutClicks() {
        donutStockArea.style.opacity = '0.5';
        donutStockArea.style.pointerEvents = 'none';
    }

    const donuts = document.querySelectorAll('.donut');
    donuts.forEach(donut => {
        donut.addEventListener('click', handleDonutClick);
    });

    setupQuestion();
});
