// 模擬義竹景點資料 (實務上可以從 API 抓)
const placesData = [
    { id: 1, name: "翁岳生祖居", img: "./media/intro/id-01.JPG", desc: "明治時期的閩南古厝，如何孕育出台灣五任大法官？走進「存德堂」，除了珍貴的法學手稿與老照片，更藏著一段跨越世紀的動人故事...", addr: "義竹鄉六桂村" },
    { id: 2, name: "馨滿義竹--義竹舊車站", img: "./media/intro/id-02.JPG", desc: "回到日本時代的義竹，火車鳴笛聲中總夾雜著淡淡糖香。這裡曾是「糖業王國」的樞紐，更藏著一段蔗農子弟獨有的搭車記憶。想知道這條鐵道背後的故事...", addr: "義竹鄉台19線旁" },
    { id: 3, name: "翁清江古厝", img: "./media/intro/id-03.JPG", desc: "義竹鄉間竟藏著荷蘭人設計的豪宅？融合閩日西三種風格，門楣上的神祕盾牌更暗藏玄機。一窺前中研院院長翁啟惠祖居的真實風貌...", addr: "八掌溪沿岸" },
    { id: 4, name: "東後寮教會", img: "./media/intro/id-04.JPG", desc: "義竹路旁的紅磚秘境，竟是南台灣罕見的「巴西力卡式」老教堂！1927年的絕美拱窗與精湛英格蘭砌法，邀你走入這份百年的神聖寧靜...", addr: "義竹鄉六桂村245號" },
    { id: 5, name: "東榮村火車頭公園", img: "./media/intro/id-05.JPG", desc: "東後寮的鐵道旁，時間彷彿走得特別慢。昔日的五分車與不老的水牛，守候著被封存的糖業記憶。不需要趕車，只需漫步舊鐵軌，聆聽這段凝結的歲月...", addr: "義竹鄉六桂村" },
    { id: 6, name: "中正堂彩繪", img: "./media/intro/id-06.JPG", desc: "巨大的英文字母上，竟藏著無數張珍貴老照片？這座結合歷史與現代的裝置藝術，訴說著義竹人的集體回憶。來這裡用鏡頭閱讀故事，發現更多隱藏驚喜...", addr: "義竹鄉埤前村" },
    { id: 7, name: "義竹修緣禪寺", img: "./media/intro/id-07.JPG", desc: "義竹田間竟藏著一座氣勢磅礡的皇宮級建築！「修緣」二字源自濟公俗名，這裡不只鐘鼓樓巍峨聳立，更充滿「笑看人生」的自在氛圍。想領悟這份獨特的豁達...", addr: "義竹鄉後鎮村" },
    { id: 8, name: "義竹慈化寺", img: "./media/intro/id-08.JPG", desc: "義竹鄉半數人口都姓翁，守護這個顯赫世家的竟是這尊「祖佛」！從康熙年間的私家神壇變身宏偉仿宋宮殿，慈化寺藏著一段跨海而來的開墾傳奇...", addr: "義竹鄉竿子寮" }
];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderSourceList();
    updateSelectedCount();
});

// 1. 渲染右側選擇列表
function renderSourceList() {
    const list = document.getElementById('sourceList');
    list.innerHTML = ""; // 清空

    placesData.forEach(place => {
        const item = document.createElement('div');
        item.className = "place-card";
        item.onclick = (e) => toggleCard(place.id, e);
        item.innerHTML = `
            <div class="form-check">
                <input class="form-check-input place-checkbox" type="checkbox" value="${place.id}" id="check-${place.id}" onchange="updateSelectedCount()">
            </div>
            <img src="${place.img}" class="place-img" alt="${place.name}">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">${place.name}</h6>
            </div>
            <button class="btn btn-sm btn-outline-info rounded-pill" onclick="event.stopPropagation();showInfo(${place.id})">了解更多</button>
        `;
        list.appendChild(item);
    });
}
function toggleCard(id, event) {
    // 找到該卡片對應的 checkbox
    const checkbox = document.getElementById(`check-${id}`);
    
    // 判斷點擊的目標是不是 checkbox 本身
    // 如果使用者直接點那個方框，瀏覽器會自動切換，我們只要更新數字就好
    // 如果使用者點的是卡片背景或文字，我們要手動幫他切換 checkbox
    
    if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked; // 手動切換
    }

    // 更新計數器 (不管是手動切換還是點方框，都要更新)
    updateSelectedCount();
}

// 2. 更新已選擇數量 & 防呆
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.place-checkbox:checked');
    const count = checkboxes.length;
    document.getElementById('selectedCount').innerText = count;
    
    const input = document.getElementById('drawCount');
    // 設定最大值不能超過勾選數
    input.max = count > 0 ? count : 1;
    // 如果目前輸入超過勾選數，自動調降
    if (parseInt(input.value) > count && count > 0) {
        input.value = count;
    }
}

// 3. 全選 / 取消全選
function selectAll(isChecked) {
    const checkboxes = document.querySelectorAll('.place-checkbox');
    checkboxes.forEach(cb => cb.checked = isChecked);
    updateSelectedCount();
}

// 4. Modal 顯示詳情
function showInfo(id) {
    const place = placesData.find(p => p.id === id);
    if (!place) return;

    document.getElementById('modalTitle').innerText = place.name;
    document.getElementById('modalImg').src = place.img;
    document.getElementById('modalDesc').innerText = place.desc;
    // document.getElementById('modalAddr').innerText = place.addr;

    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    modal.show();
}

// 5. 開始抽籤 (核心邏輯)
function startRaffle() {
    const checkedBoxes = document.querySelectorAll('.place-checkbox:checked');
    const drawNum = parseInt(document.getElementById('drawCount').value);

    // 防呆
    if (checkedBoxes.length === 0) {
        alert("請至少勾選一個地點！");
        return;
    }
    if (drawNum > checkedBoxes.length) {
        alert("抽選數量不能大於勾選數量！");
        return;
    }

    // 取得所有被勾選的資料
    const selectedPlaces = [];
    checkedBoxes.forEach(cb => {
        const id = parseInt(cb.value);
        selectedPlaces.push(placesData.find(p => p.id === id));
    });

    // 洗牌演算法 (Fisher-Yates Shuffle)
    for (let i = selectedPlaces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedPlaces[i], selectedPlaces[j]] = [selectedPlaces[j], selectedPlaces[i]];
    }

    // 取出前 N 個
    const results = selectedPlaces.slice(0, drawNum);

    // 渲染結果到左側
    renderResults(results);
}

// 6. 渲染結果並加入拖放功能
function renderResults(results) {
    const resultList = document.getElementById('resultList');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('resultCount');

    // 隱藏空狀態
    emptyState.style.display = "none";
    countBadge.innerText = results.length;
    
    // 清空現有列表 (除了 emptyState)
    resultList.innerHTML = "";
    resultList.appendChild(emptyState);

    results.forEach((place, index) => {
        const card = document.createElement('div');
        card.className = "place-card result-card";
        card.draggable = true; // 開啟拖曳
        card.dataset.id = place.id; // 存 ID 方便之後抓順序
        card.dataset.name = place.name; // 存名稱給 Google Maps 用

        card.innerHTML = `
            <span class="fs-4 me-3 handle">≡</span>
            <img src="${place.img}" class="place-img" style="margin-left:0;">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold place-name">${place.name}</h6>
            </div>
            <button class="btn btn-sm text-danger fs-2 border-0 bg-transparent" onclick="removeResult(this)" title="移除此地點">
                &times;
            </button>
        `;
        
        // 加入拖曳事件
        addDragEvents(card);
        resultList.appendChild(card);
    });

    updateFlags(); // 更新起點終點標記
}

// 7. 拖曳事件處理 (Drag and Drop API)
function addDragEvents(card) {
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        updateFlags(); // 拖曳結束後重新標記旗幟
    });
}

// 監聽容器的拖曳行為
const resultContainer = document.getElementById('resultList');
resultContainer.addEventListener('dragover', e => {
    e.preventDefault(); // 允許放置
    const afterElement = getDragAfterElement(resultContainer, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        resultContainer.appendChild(draggable);
    } else {
        resultContainer.insertBefore(draggable, afterElement);
    }
});

// 計算拖曳位置的輔助函式
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.result-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 8. 更新起點與終點標記
function updateFlags() {
    const cards = document.querySelectorAll('.result-card');
    cards.forEach(c => {
        c.querySelector('.place-name').classList.remove('flag-start', 'flag-end');
    });

    if (cards.length > 0) {
        cards[0].querySelector('.place-name').classList.add('flag-start');
    }
    if (cards.length === 1) {
        // ★ 只有一個時：變成「目的地」
        cards[0].querySelector('.place-name').classList.add('flag-dest');
    }else if (cards.length > 1) {
        cards[cards.length - 1].querySelector('.place-name').classList.add('flag-end');
    }
}

// 9. 產生 Google Maps 連結
function generateRoute() {
    const cards = document.querySelectorAll('.result-card');
    if (cards.length === 0) {
        alert("請先抽籤產生景點！");
        return;
    }

    const places = [...cards].map(c => c.dataset.name);
    
    // Google Maps URL 格式:
    // https://www.google.com/maps/dir/?api=1&origin=起點&destination=終點&waypoints=中間點1|中間點2
    
    const origin = encodeURIComponent(places[0]); // 起點
    const destination = encodeURIComponent(places[places.length - 1]); // 終點
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

    // 如果有中間點
    if (places.length > 2) {
        const waypoints = places.slice(1, -1).map(p => encodeURIComponent(p)).join('|');
        url += `&waypoints=${waypoints}`;
    }

    // 在新分頁開啟
    window.open(url, '_blank');
}

// 10. 刪除單一結果的函式
function removeResult(btn) {
    // 1. 找到這顆按鈕所在的卡片，並把它移除
    const card = btn.closest('.result-card');
    card.remove();

    // 2. 重新計算目前剩下的卡片數量
    const remainingCards = document.querySelectorAll('.result-card');
    document.getElementById('resultCount').innerText = remainingCards.length;

    // 3. 如果刪光了 (剩餘數量為 0)，就把「空狀態」顯示回來
    if (remainingCards.length === 0) {
        document.getElementById('emptyState').style.display = "block";
    }

    // 4. 因為順序變了 (或起點終點被刪了)，要重新更新旗幟
    updateFlags();
}