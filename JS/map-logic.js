// JS/map-logic.js

// 1. 初始化地圖
const southWest = L.latLng(23.280, 120.150); // 左下 (比 23.290, 120.162 再小一點)
const northEast = L.latLng(23.420, 120.300);
const bounds = L.latLngBounds(southWest, northEast);
const map = L.map('mainMap', {
    maxBounds: bounds,          // 設定邊界
    maxBoundsViscosity: 1.0,    // 1.0 代表完全卡死，使用者完全拖不動超出範圍
    minZoom: 13                 // 限制最小縮放 (避免縮太小看到隔壁鄉鎮)
}).setView([23.337, 120.245], 15);

// 2. 載入底圖 (使用 CartoDB 比較清爽，或者用 Google Maps 風格)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
}).addTo(map);

// 3. 定義圖標 (Icon)
const spotIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const storeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 4. 定義圖層群組 (方便之後篩選隱藏)
const layers = {
    spots: L.layerGroup().addTo(map),        // 景點
    store_711: L.layerGroup().addTo(map),    // 7-11
    store_hilife: L.layerGroup().addTo(map), // 萊爾富
    gas_cpc: L.layerGroup().addTo(map),          // 加油站
    food: L.layerGroup().addTo(map)          // 美食 (建議新增)
};


placesData.forEach(place => {
    
    // 1. 動態產生圖片路徑
    // padStart(2, '0') 會將 1 變成 "01", 2 變成 "02"... 以此類推，對應您的檔名
    const iconId = place.id.toString().padStart(2, '0'); 
    
    // 假設圖片放在 media/map/ 資料夾下
    const iconUrl = `./media/map/icon${iconId}.jpg`; 

    const customIcon = L.icon({
        iconUrl: iconUrl,
        
        // ★★★ 修改這裡：加大尺寸 ★★★
        iconSize: [64, 64],      // 原本是 [48, 48]，改成 64 甚至 70 都可以
        iconAnchor: [32, 32],    // 這是圖標的中心點，必須是 iconSize 的一半 (64/2 = 32)
        
        popupAnchor: [0, -32],   // Popup 彈出的位置，數值等於 iconAnchor 的 Y 值 (往上推)
        className: 'custom-spot-icon' 
    });

    // 3. 使用新的 customIcon 建立標記
    const marker = L.marker([place.lat, place.lng], { icon: customIcon });
    
    // --- 以下維持原本的 Popup 與 Tooltip 設定不變 ---
    const popupContent = `
        <div class="custom-popup">
            <img src="${place.cover}" class="popup-img">
            <div class="popup-body">
                <h6 class="fw-bold mb-1">${place.name}</h6>
                <p class="small text-muted mb-2 text-truncate">${place.desc}</p>
                <div class="d-grid gap-2">
                    <a href="introduce.html?spot=modal-spot${place.id}" target="_blank" class="btn btn-sm btn-outline-primary">
                        了解更多 ➜
                    </a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}" target="_blank" class="btn btn-sm btn-warning text-white">
                        🚗 帶我去
                    </a>
                </div>
            </div>
        </div>
    `;
    marker.bindPopup(popupContent);

    const tooltipContent = `
        <div class="text-center">
            <img src="${place.cover}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 4px;">
            <div class="fw-bold small" style="font-size:16px">${place.name}</div>
        </div>
    `;

    marker.bindTooltip(tooltipContent, {
        direction: 'top',      
        offset: [0, -30], // 因為圖標變圓形了，Tooltip 位置稍微調整      
        opacity: 1,            
        className: 'my-map-tooltip' 
    });
    
    layers.spots.addLayer(marker);
});




// 2. 擴充設施資料 (記得確認實際座標)
const amenities = [
    // 7-11
    { 
        name: "7-ELEVEN 義竹門市", 
        lat: 23.3374925, 
        lng: 120.2444728, 
        type: "store_711",
        cover: "./media/map/7-Eleven-Logo.png", // 暫用 Logo 當圖片
        desc: "24小時營業便利商店"
    },
    { 
        name: "7-ELEVEN 二竹門市", 
        lat: 23.3364845, 
        lng: 120.2424541, 
        type: "store_711",
        cover: "./media/map/7-Eleven-Logo.png",
        desc: "24小時營業便利商店"
    },
    
    // 萊爾富
    { 
        name: "萊爾富 <br>義竹賽鴿笭門市", 
        lat: 23.3384752, 
        lng: 120.248022, 
        type: "store_hilife",
        cover: "./media/map/HiLife-logo.svg.png",
        desc: "提供包裹寄送與繳費服務"
    },

    // 加油站
    { 
        name: "台灣中油 <br>義竹站(直營)", 
        lat: 23.3392249, 
        lng: 120.2493839, 
        type: "gas_cpc",
        cover: "./media/map/cpc-logo.png",
        desc: "提供 92/95/98 汽油與柴油"
    },
];

// 3. 產生標記 (依照類型分配圖標)
amenities.forEach(item => {
    let icon;
    if (item.type === 'store_711') icon = L.icon({ iconUrl: './media/map/7-Eleven-Logo.png', iconSize: [25, 25] });
    else if (item.type === 'store_hilife') icon = L.icon({ iconUrl: './media/map/HiLife-logo.svg.png', iconSize: [25, 25] });
    else if (item.type === 'gas_cpc') icon = L.icon({ iconUrl: './media/map/cpc-logo.png', iconSize: [35, 35] });
    else icon = storeIcon;

    const marker = L.marker([item.lat, item.lng], { icon: icon });
    const popupContent = `
        <div class="custom-popup">
            <div style="background-color:#fff; padding:10px; text-align:center;">
                <img src="${item.cover}" class="popup-img" style="object-fit: contain; height: 80px;">
            </div>
            <div class="popup-body">
                <h6 class="fw-bold mb-1">${item.name}</h6>
                <div class="d-grid gap-2">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}" target="_blank" class="btn btn-sm btn-warning text-white">
                        🚗 帶我去 (導航)
                    </a>
                </div>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    
    if (layers[item.type]) {
        layers[item.type].addLayer(marker);
    }
});


// --- 功能函式 ---

// 4. 一般切換 (控制單一圖層)
function toggleLayer(type) {
    // 取得對應的 Checkbox ID
    let checkboxId;
    if(type === 'store_711') checkboxId = 'toggle711';
    else if(type === 'store_hilife') checkboxId = 'toggleHilife';
    else if(type === 'gas_cpc') checkboxId = 'toggleGas';
    else if(type === 'food') checkboxId = 'toggleFood';
    
    const isChecked = document.getElementById(checkboxId).checked;

    // 執行地圖圖層開關
    if (isChecked) {
        map.addLayer(layers[type]);
    } else {
        map.removeLayer(layers[type]);
    }

    // ✨ 新增邏輯：如果是切換「便利商店」的子項目，要檢查是否影響主開關
    if (type === 'store_711' || type === 'store_hilife') {
        checkMainSwitchStatus();
    }
}

// ✨ 新增函式：檢查主開關狀態 (子 -> 父)
function checkMainSwitchStatus() {
    const is711On = document.getElementById('toggle711').checked;
    const isHilifeOn = document.getElementById('toggleHilife').checked;
    
    // 邏輯：只有當 7-11 和 萊爾富「同時」都開啟時，主開關才亮燈 (AND 邏輯)
    // 只要有其中一個沒開，主開關就會熄滅
    document.getElementById('toggleStoreMain').checked = (is711On && isHilifeOn);
}

// 5. 主開關邏輯 (連動控制)
function toggleMainStore() {
    const isChecked = document.getElementById('toggleStoreMain').checked;
    
    // 同步子開關的勾選狀態
    document.getElementById('toggle711').checked = isChecked;
    document.getElementById('toggleHilife').checked = isChecked;
    
    // 觸發圖層更新
    if (isChecked) {
        map.addLayer(layers['store_711']);
        map.addLayer(layers['store_hilife']);
    } else {
        map.removeLayer(layers['store_711']);
        map.removeLayer(layers['store_hilife']);
    }
}

// 飛到指定地點
function flyToLocation(lat, lng) {
    map.flyTo([lat, lng], 16, {
        duration: 1.5 // 動畫時間
    });
}
fetch('JS/yijhu-boundary.json')
    .then(response => response.json())
    .then(data => {
        // 設定邊界樣式
        const boundaryStyle = {
            color: '#da7727',       // 邊框顏色 (你的主色調橘色)
            weight: 4,              // 邊框粗細
            opacity: 0.8,           // 邊框透明度
            dashArray: '10, 10',    // ✨ 關鍵：虛線效果 (實線10px, 空白10px)
            fillColor: '#f8cca8ff',   // 填充顏色
            fillOpacity: 0.1        // 填充透明度 (淡淡的橘色)
        };

        // 加到地圖上
        const boundaryLayer = L.geoJSON(data, {
            style: boundaryStyle
        }).addTo(map);

        // (選用) 讓地圖自動縮放到這個邊界的範圍
        // map.fitBounds(boundaryLayer.getBounds());
    })
    .catch(error => console.error('無法載入邊界資料:', error));