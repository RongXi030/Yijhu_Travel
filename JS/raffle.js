// 模擬義竹景點資料 (實務上可以從 API 抓)
const placesData = [
    { id: 1, name: "義竹車站", img: "https://picsum.photos/100?random=1", desc: "充滿歷史懷舊氣息的車站，見證了糖鐵的興衰。", addr: "義竹鄉六桂村" },
    { id: 2, name: "玉米田迷宮", img: "https://picsum.photos/100?random=2", desc: "全台最大的玉米迷宮，每年冬季限定開放，適合親子同樂。", addr: "義竹鄉台19線旁" },
    { id: 3, name: "八掌溪堤防", img: "https://picsum.photos/100?random=3", desc: "黃花風鈴木盛開時的絕美景點，散步騎車都很舒服。", addr: "八掌溪沿岸" },
    { id: 4, name: "修緣禪寺", img: "https://picsum.photos/100?random=4", desc: "供奉濟公活佛，建築莊嚴宏偉，是當地信仰中心。", addr: "義竹鄉六桂村245號" },
    { id: 5, name: "翁清江古厝", img: "https://picsum.photos/100?random=5", desc: "義竹著名的古蹟，融合了日式與閩式的建築風格。", addr: "義竹鄉六桂村" },
    { id: 6, name: "埤前村公園", img: "https://picsum.photos/100?random=6", desc: "在地人的休閒好去處，有豐富的綠色植栽。", addr: "義竹鄉埤前村" },
    { id: 7, name: "泥土溝文化", img: "https://picsum.photos/100?random=7", desc: "體驗傳統農村生活的文化園區。", addr: "義竹鄉後鎮村" },
    { id: 8, name: "竿子寮", img: "https://picsum.photos/100?random=8", desc: "具有在地特色的傳統聚落。", addr: "義竹鄉竿子寮" }
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
        item.innerHTML = `
            <div class="form-check">
                <input class="form-check-input place-checkbox" type="checkbox" value="${place.id}" id="check-${place.id}" onchange="updateSelectedCount()">
            </div>
            <img src="${place.img}" class="place-img" alt="${place.name}">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">${place.name}</h6>
            </div>
            <button class="btn btn-sm btn-outline-info rounded-pill" onclick="showInfo(${place.id})">了解更多</button>
        `;
        list.appendChild(item);
    });
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
    document.getElementById('modalAddr').innerText = place.addr;

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
            <span class="fs-4 me-3 handle">≡</span> <img src="${place.img}" class="place-img" style="margin-left:0;">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold place-name">${place.name}</h6>
            </div>
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
    if (cards.length > 1) {
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