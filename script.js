document.addEventListener('DOMContentLoaded', () => {

    // --- ゲーム設定 ---
    const CHARACTERS = [
        { name: 'ねこさん', img: 'assets/images/cat.png' },
        { name: 'うさぎさん', img: 'assets/images/rabbit.png' },
        { name: 'とりさん', img: 'assets/images/bird.png' }
    ];
    // ★★★ 変更点: 上限を 9 に変更 ★★★
    const MAX_DONUTS = 9;

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
    let isBgmPlaying = false; 
    
    // --- 音声ファイル ---
    const bgm = new Audio('assets/audio/simajiro.mp3');
    bgm.loop = true; 
    bgm.volume = 0.3; 

    const countSounds = {};
    for (let i = 1; i <= MAX_DONUTS; i++) {
        countSounds[i] = new Audio(`assets/audio/count_${i}.wav`);
    }
    const correctSound = new Audio('assets/audio/correct.wav');

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
    function handleDonutClick() {
        if (!isBgmPlaying) {
            bgm.play();
            isBgmPlaying = true;
        }

        if (currentDonutCount >= targetDonutCount) {
            return;
        }
        
        currentDonutCount++;
        
        const donutElement = document.createElement('div');
        donutElement.classList.add('placed-donut');
        plateArea.appendChild(donutElement);

        const isCorrect = (currentDonutCount === targetDonutCount);

        const countSound = countSounds[currentDonutCount];
        
        if (countSound) {
            countSound.play();
            
            if (isCorrect) {
                disableDonutClicks();
                countSound.addEventListener('ended', showCorrect, { once: true });
            }
        } else if (isCorrect) {
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
