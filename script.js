// 駅リスト（スマレ線、スツァーフケ線）
const smareLineStations = [
    "スツューフテ中央", "市役所前", "スツライルペ1丁目", "スツライルペ2丁目", "スツライルペ3丁目", 
    "シュンギアファベルペ1丁目", "シュンギアファベルペ2丁目", "シュンギアファベルペ3丁目", "サーキット東", 
    "サーキット西", "ダウケルペ南", "国会議事堂前", "共和広場", "ファウペルペ北", "観光地区1丁目", 
    "観光地区2丁目", "観光地区3丁目", "住宅街1丁目", "住宅街2丁目", "住宅街3丁目", "学園町1丁目(KSS)", 
    "学園町2丁目", "学園町3丁目", "ガメルペ"
];

const tsarfkeLineStations = [
    "共和広場", "ファウペルペ南", "ダウケルペ北", "ツァラアクラテ3丁目", "ツァラアクラテ2丁目", 
    "ツァラアクラテ1丁目", "ツァラアクラテ中央", "問屋街3丁目", "問屋街2丁目", "問屋街1丁目", 
    "スツューフテ中央", "副都心1丁目", "副都心2丁目", "副都心3丁目", "グラペルペ南", "グラペルペ北", "スツァーフケ"
];

// 駅間所要時間（全駅間1.13分）
const travelTime = 1.13; // 分

// 最短経路の選択と乗り換え処理
function calculateRoute(start, end) {
    // スツァーフケ線を優先するため、スツューフテ中央 ⇄ 共和広場のルートを優先
    if ((start === "共和広場" && end === "スツューフテ中央") || (start === "スツューフテ中央" && end === "共和広場")) {
        return calculateTsarfkeLineRoute(start, end);
    }

    // 環状線（スマレ線）で最短経路を選ぶ
    let route = findShortestRouteOnSmareLine(start, end);
    
    // 結果を出力
    displayRoute(route);
}

// スツァーフケ線を使用した経路計算
function calculateTsarfkeLineRoute(start, end) {
    let route = [];
    let time = 0;
    let distance = 0;

    let startIndex = tsarfkeLineStations.indexOf(start);
    let endIndex = tsarfkeLineStations.indexOf(end);

    // 共和広場⇄スツューフテ中央
    if (startIndex !== -1 && endIndex !== -1) {
        let path = tsarfkeLineStations.slice(startIndex, endIndex + 1);
        path.forEach((station, index) => {
            if (index < path.length - 1) {
                time += travelTime;
                distance += 1;
            }
        });
        route = path;
    }

    // 乗り換えの表記
    route.push("【乗り換え】");

    // 出力
    return { route: route, time: time, distance: distance };
}

// 環状線（スマレ線）の最短経路計算
function findShortestRouteOnSmareLine(start, end) {
    let route = [];
    let time = 0;
    let distance = 0;

    // 左回り、右回り両方の経路を比較
    const clockwiseRoute = findRouteOnSmareLine(start, end, true);
    const counterClockwiseRoute = findRouteOnSmareLine(start, end, false);

    // 最短経路を選択
    if (clockwiseRoute.time < counterClockwiseRoute.time) {
        route = clockwiseRoute.route;
        time = clockwiseRoute.time;
        distance = clockwiseRoute.distance;
    } else {
        route = counterClockwiseRoute.route;
        time = counterClockwiseRoute.time;
        distance = counterClockwiseRoute.distance;
    }

    return { route: route, time: time, distance: distance };
}

// スマレ線でのルート検索（左回り・右回りの選択）
function findRouteOnSmareLine(start, end, clockwise) {
    let startIndex = smareLineStations.indexOf(start);
    let endIndex = smareLineStations.indexOf(end);

    let route = [];
    let time = 0;
    let distance = 0;

    if (startIndex !== -1 && endIndex !== -1) {
        // 左回り
        if (clockwise) {
            if (startIndex <= endIndex) {
                route = smareLineStations.slice(startIndex, endIndex + 1);
                time = (endIndex - startIndex) * travelTime;
                distance = endIndex - startIndex;
            } else {
                route = smareLineStations.slice(startIndex).concat(smareLineStations.slice(0, endIndex + 1));
                time = (smareLineStations.length - startIndex + endIndex) * travelTime;
                distance = smareLineStations.length - startIndex + endIndex;
            }
        }
        // 右回り
        else {
            if (startIndex >= endIndex) {
                route = smareLineStations.slice(endIndex, startIndex + 1).reverse();
                time = (startIndex - endIndex) * travelTime;
                distance = startIndex - endIndex;
            } else {
                route = smareLineStations.slice(endIndex).concat(smareLineStations.slice(0, startIndex + 1)).reverse();
                time = (smareLineStations.length - endIndex + startIndex) * travelTime;
                distance = smareLineStations.length - endIndex + startIndex;
            }
        }
    }

    return { route: route, time: time, distance: distance };
}

// 結果の表示
function displayRoute(routeData) {
    const outputDiv = document.getElementById('route-output');
    const { route, time, distance } = routeData;

    let outputHTML = `<h3>経路</h3><p>出発駅: ${route[0]} → 降車駅: ${route[route.length - 1]}</p>`;
    outputHTML += `<p>所要時間: ${time.toFixed(2)} 分</p>`;
    outputHTML += `<p>距離: ${distance} 駅</p>`;
    outputHTML += `<p>途中駅: ${route.join(' → ')}</p>`;

    outputDiv.innerHTML = outputHTML;
}

// ボタンのクリックイベント処理
document.getElementById('calculate-btn').addEventListener('click', function() {
    const startStation = document.getElementById('start-station').value;
    const endStation = document.getElementById('end-station').value;

    if (startStation && endStation) {
        calculateRoute(startStation, endStation);
    } else {
        alert("乗車駅と降車駅を選択してください");
    }
});
