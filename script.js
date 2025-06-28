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
        // ★★★ 変更点: .mp3 を .wav に変更 ★★★
        countSounds[i] = new Audio(`assets/audio/count_${i}.wav`);
    }
    // ★★★ 変更点: .mp3 を .wav に変更 ★★★
    const correctSound = new Audio('assets/audio/correct.wav');
    const popSound = new Audio('assets/audio/pop.wav');


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
    // 既に目標の数に達していたら、何もしない
    if (currentDonutCount >= targetDonutCount) {
        return; 
    }
    
    currentDonutCount++;
    
    // 1. ポップ効果音を再生する
    popSound.currentTime = 0;
    popSound.play();
    
    // 2. お皿にドーナツの絵を追加する
    const donutElement = document.createElement('div');
    donutElement.classList.add('placed-donut');
    plateArea.appendChild(donutElement);
    
    // 正解したかどうかを先に判断しておく
    const isCorrect = (currentDonutCount === targetDonutCount);

    // 3. 少し間をあけてから、カウント音声を再生する
    //    （ポップ音と重ならないようにするため）
    setTimeout(() => {
        const countSound = countSounds[currentDonutCount];
        
        // カウント音声ファイルがあれば再生
        if (countSound) {
            countSound.play();
            
            // ★★★ ここからが重要な修正部分 ★★★
            // もしこの一声で正解になった場合
            if (isCorrect) {
                // これ以上ドーナツをクリックできないようにする
                disableDonutClicks();
                
                // カウント音声の再生が「終わったら」、showCorrect関数を呼び出す
                // { once: true } は、このイベントを一度きりにするための設定です
                countSound.addEventListener('ended', showCorrect, { once: true });
            }

        } else if (isCorrect) {
            // カウント音声ファイルがないけれど正解だった場合（念のため）
            disableDonutClicks();
            setTimeout(showCorrect, 800); // 従来通りの待ち時間
        }
    }, 200); // ポップ音から0.2秒後にカウント音声を再生
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
