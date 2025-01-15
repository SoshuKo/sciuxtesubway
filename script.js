const startStations = [
    "スツューフテ中央", "市役所前", "スツライルペ1丁目", "スツライルペ2丁目", "スツライルペ3丁目",
    "シュンギアファベルペ1丁目", "シュンギアファベルペ2丁目", "シュンギアファベルペ3丁目", "サーキット東", "サーキット西",
    "ダウケルペ南", "国会議事堂前", "共和広場", "ファウペルペ北", "観光地区1丁目", "観光地区2丁目", "観光地区3丁目",
    "住宅街1丁目", "住宅街2丁目", "住宅街3丁目", "学園町1丁目(KSS)", "学園町2丁目", "学園町3丁目", "ガメルペ"
];
const endStations = [
    "スツューフテ中央", "副都心1丁目", "副都心2丁目", "副都心3丁目", "グラペルペ南", "グラペルペ北", "スツァーフケ"
];

const smaleLineStations = [
    "スツューフテ中央", "市役所前", "スツライルペ1丁目", "スツライルペ2丁目", "スツライルペ3丁目",
    "シュンギアファベルペ1丁目", "シュンギアファベルペ2丁目", "シュンギアファベルペ3丁目", "サーキット東", "サーキット西",
    "ダウケルペ南", "国会議事堂前", "共和広場", "ファウペルペ北", "観光地区1丁目", "観光地区2丁目", "観光地区3丁目",
    "住宅街1丁目", "住宅街2丁目", "住宅街3丁目", "学園町1丁目(KSS)", "学園町2丁目", "学園町3丁目", "ガメルペ"
];

const tsarfeLineStations = [
    "共和広場", "ファウペルペ南", "ダウケルペ北", "ツァラアクラテ3丁目", "ツァラアクラテ2丁目", "ツァラアクラテ1丁目",
    "ツァラアクラテ中央", "問屋街3丁目", "問屋街2丁目", "問屋街1丁目", "スツューフテ中央", "副都心1丁目", "副都心2丁目",
    "副都心3丁目", "グラペルペ南", "グラペルペ北", "スツァーフケ"
];

// ダミーの現在時刻（10:00固定）
const currentTime = "10:00";

// ルート計算関数
function calculateRoute(start, end) {
    const routeInfo = {
        stations: [],
        time: 0,
        distance: 0,
    };

    let transferRequired = false;

    // 共和広場⇄スツューフテ中央の場合、スツァーフケ線優先
    if (start === "共和広場" && end === "スツューフテ中央") {
        routeInfo.stations = ["共和広場", "【乗り換え】", "スツューフテ中央"];
        routeInfo.time = 5; // 乗り換え時間（3分） + 2分（スツァーフケ線）
        routeInfo.distance = 2;
        transferRequired = true;
    } else if (end === "共和広場" && start === "スツューフテ中央") {
        routeInfo.stations = ["スツューフテ中央", "【乗り換え】", "共和広場"];
        routeInfo.time = 5;
        routeInfo.distance = 2;
        transferRequired = true;
    } else {
        // 環状線の最短経路を計算（左回り、右回り両方考慮）
        let clockwiseRoute = findClockwiseRoute(start, end);
        let counterClockwiseRoute = findCounterClockwiseRoute(start, end);

        // より短い経路を選択
        if (clockwiseRoute.time <= counterClockwiseRoute.time) {
            routeInfo.stations = clockwiseRoute.stations;
            routeInfo.time = clockwiseRoute.time;
            routeInfo.distance = clockwiseRoute.distance;
        } else {
            routeInfo.stations = counterClockwiseRoute.stations;
            routeInfo.time = counterClockwiseRoute.time;
            routeInfo.distance = counterClockwiseRoute.distance;
        }
    }

    return routeInfo;
}

// 左回り経路の計算
function findClockwiseRoute(start, end) {
    const startIdx = smaleLineStations.indexOf(start);
    const endIdx = smaleLineStations.indexOf(end);
    let route = smaleLineStations.slice(startIdx, endIdx + 1);
    let time = (endIdx - startIdx) * 1.13 + (endIdx > startIdx ? 0 : 1.13);
    let distance = time; // 仮で所要時間と距離を同一に設定

    return { stations: route, time: time, distance: distance };
}

// 右回り経路の計算
function findCounterClockwiseRoute(start, end) {
    const startIdx = smaleLineStations.indexOf(start);
    const endIdx = smaleLineStations.indexOf(end);
    let route = smaleLineStations.slice(endIdx, startIdx + 1).reverse();
    let time = (startIdx - endIdx) * 1.13 + (startIdx < endIdx ? 0 : 1.13);
    let distance = time; // 仮で所要時間と距離を同一に設定

    return { stations: route, time: time, distance: distance };
}

// 結果表示関数
function displayRouteInfo(routeInfo) {
    const routeOutput = document.getElementById("route-output");
    const routeText = `
        <h3>最短経路</h3>
        <p><strong>経路:</strong> ${routeInfo.stations.join(" → ")}</p>
        <p><strong>所要時間:</strong> ${routeInfo.time.toFixed(2)} 分</p>
        <p><strong>距離:</strong> ${routeInfo.distance.toFixed(2)} km</p>
    `;
    routeOutput.innerHTML = routeText;
}

// イベントリスナー設定
document.getElementById("calculate-btn").addEventListener("click", () => {
    const start = document.getElementById("start-station").value;
    const end = document.getElementById("end-station").value;

    if (start && end) {
        const routeInfo = calculateRoute(start, end);
        displayRouteInfo(routeInfo);
    } else {
        alert("乗車駅と降車駅を選択してください");
    }
});

// 駅情報のプルダウンに追加
const startSelect = document.getElementById("start-station");
const endSelect = document.getElementById("end-station");

startStations.forEach(station => {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    startSelect.appendChild(option);
});

endStations.forEach(station => {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    endSelect.appendChild(option);
});
