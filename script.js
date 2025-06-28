document.addEventListener('DOMContentLoaded', () => {

    // --- ゲーム設定 ---
    const CHARACTERS = [
        { name: 'ねこさん', img: 'assets/images/cat.png' },
        { name: 'うさぎさん', img: 'assets/images/rabbit.png' },
        { name: 'とりさん', img: 'assets/images/bird.png' }
    ];
    const MAX_DONUTS = 5; // 問題で出るドーナツの最大数

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
    
    // --- 音声ファイル（事前に読み込んでおくとスムーズ）---
    const countSounds = {};
    for (let i = 1; i <= MAX_DONUTS; i++) {
        countSounds[i] = new Audio(`assets/audio/count_${i}.mp3`);
    }
    const correctSound = new Audio('assets/audio/correct.mp3');
    const popSound = new Audio('assets/audio/pop.mp3');


    // --- ゲームの初期化・問題設定 ---
    function setupQuestion() {
        // カウントとお皿をリセット
        currentDonutCount = 0;
        plateArea.innerHTML = '';
        
        // 問題をランダムに設定
        currentCharacterIndex = Math.floor(Math.random() * CHARACTERS.length);
        targetDonutCount = Math.floor(Math.random() * MAX_DONUTS) + 1; // 1からMAX_DONUTSまでの数
        
        // 画面に表示
        const character = CHARACTERS[currentCharacterIndex];
        characterImg.src = character.img;
        characterImg.alt = character.name;
        messageText.textContent = `${character.name}に ドーナツを ${targetDonutCount}こ あげよう！`;
        
        // ドーナツのクリックイベントを有効にする
        enableDonutClicks();
    }
    
    // --- ドーナツをクリックしたときの処理 ---
    function handleDonutClick() {
        if (currentDonutCount >= targetDonutCount) {
            return; // 必要な数を超えていたら何もしない
        }
        
        currentDonutCount++;
        
        // ポップ音を再生
        popSound.currentTime = 0;
        popSound.play();
        
        // カウントアップ音声を再生
        if (countSounds[currentDonutCount]) {
            setTimeout(() => {
                countSounds[currentDonutCount].play();
            }, 100); // ポップ音と少しずらす
        }
        
        // お皿にドーナツを追加
        const donutElement = document.createElement('div');
        donutElement.classList.add('placed-donut');
        plateArea.appendChild(donutElement);
        
        // 正解かどうかチェック
        if (currentDonutCount === targetDonutCount) {
            // これ以上クリックできないようにする
            disableDonutClicks();
            
            // 少し待ってから正解処理へ
            setTimeout(showCorrect, 800);
        }
    }
    
    // --- 正解処理 ---
    function showCorrect() {
        // 正解音とモーダル表示
        correctSound.play();
        correctModal.classList.remove('hidden');
        correctModal.classList.add('show');
        
        // 2秒後に次の問題へ
        setTimeout(() => {
            correctModal.classList.remove('show');
            correctModal.classList.add('hidden');
            setupQuestion();
        }, 2000);
    }
    
    // ドーナツのクリックを有効/無効にする関数
    function enableDonutClicks() {
        donutStockArea.style.opacity = '1';
        donutStockArea.style.pointerEvents = 'auto';
    }
    
    function disableDonutClicks() {
        donutStockArea.style.opacity = '0.5';
        donutStockArea.style.pointerEvents = 'none';
    }

    // --- イベントリスナーの設定 ---
    const donuts = document.querySelectorAll('.donut');
    donuts.forEach(donut => {
        donut.addEventListener('click', handleDonutClick);
    });

    // --- ゲーム開始 ---
    setupQuestion();
});