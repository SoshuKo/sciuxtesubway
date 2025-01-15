document.addEventListener('DOMContentLoaded', function() {
    const stationsSmare = [
        "スツューフテ中央", "市役所前", "スツライルペ1丁目", "スツライルペ2丁目",
        "スツライルペ3丁目", "シュンギアファベルペ1丁目", "シュンギアファベルペ2丁目",
        "シュンギアファベルペ3丁目", "サーキット東", "サーキット西", "ダウケルペ南",
        "国会議事堂前", "共和広場", "ファウペルペ北", "観光地区1丁目", "観光地区2丁目",
        "観光地区3丁目", "住宅街1丁目", "住宅街2丁目", "住宅街3丁目", "学園町1丁目(KSS)",
        "学園町2丁目", "学園町3丁目", "ガメルペ", "スツューフテ中央"
    ];

    const stationsStsarfke = [
        "共和広場", "ファウペルペ南", "ダウケルペ北", "ツァラアクラテ3丁目", "ツァラアクラテ2丁目",
        "ツァラアクラテ1丁目", "ツァラアクラテ中央", "問屋街3丁目", "問屋街2丁目", "問屋街1丁目",
        "スツューフテ中央", "副都心1丁目", "副都心2丁目", "副都心3丁目", "グラペルペ南",
        "グラペルペ北", "スツァーフケ"
    ];

    const routeColors = {
        "スマレ線": "red",
        "スツァーフケ線": "green"
    };

    const timePerStation = 1.13; // minutes
    const transferTime = 3; // minutes
    const distancePerStation = 1.0; // assumed to be 1 km per station

    // Populate station select options
    const stationSelects = document.querySelectorAll('.station-select');
    stationSelects.forEach(select => {
        stationsSmare.concat(stationsStsarfke).forEach(station => {
            let option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            select.appendChild(option);
        });
    });

    // Calculate route
    document.getElementById('calculate-btn').addEventListener('click', function() {
        const startStation = document.getElementById('start-station').value;
        const endStation = document.getElementById('end-station').value;

        if (startStation === endStation) {
            alert('乗車駅と降車駅が同じです。');
            return;
        }

        const result = calculateShortestRoute(startStation, endStation);
        displayRoute(result);
    });

    function calculateShortestRoute(start, end) {
        const smareIndexStart = stationsSmare.indexOf(start);
        const smareIndexEnd = stationsSmare.indexOf(end);
        const stsarfkeIndexStart = stationsStsarfke.indexOf(start);
        const stsarfkeIndexEnd = stationsStsarfke.indexOf(end);

        let route = [];
        let time = 0;
        let distance = 0;
        let transfer = false;

        if (smareIndexStart !== -1 && smareIndexEnd !== -1) {
            route = calculateDirectRoute(stationsSmare, smareIndexStart, smareIndexEnd);
        } else if (stsarfkeIndexStart !== -1 && stsarfkeIndexEnd !== -1) {
            route = calculateDirectRoute(stationsStsarfke, stsarfkeIndexStart, stsarfkeIndexEnd);
        } else {
            // Handle transfer scenario: prioritize the Smare and Stsarfke line connection through the central station
            const smareToStsarfke = calculateDirectRoute(stationsSmare, smareIndexStart, stationsSmare.indexOf("スツューフテ中央"));
            const stsarfkeToSmare = calculateDirectRoute(stationsStsarfke, stsarfkeIndexStart, stationsStsarfke.indexOf("スツューフテ中央"));

            if (smareToStsarfke.length + stsarfkeToSmare.length < 30) {
                route = smareToStsarfke.concat("乗り換え").concat(stsarfkeToSmare);
                time += transferTime;
                transfer = true;
            }
        }

        // Apply time and distance calculations
        time += route.length * timePerStation;
        distance += route.length * distancePerStation;

        return { route, time, distance, transfer };
    }

    function calculateDirectRoute(line, startIndex, endIndex) {
        if (startIndex < endIndex) {
            return line.slice(startIndex, endIndex + 1);
        } else {
            return line.slice(startIndex).concat(line.slice(0, endIndex + 1));
        }
    }

    function displayRoute(result) {
        let routeText = result.route.join(' → ');
        
        if (result.transfer) {
            // Split route to show transfer station
            const splitIndex = result.route.indexOf("乗り換え");
            const firstPart = result.route.slice(0, splitIndex);
            const secondPart = result.route.slice(splitIndex + 1);
            routeText = `${firstPart.join(' → ')} → 【乗り換え】 → ${secondPart.join(' → ')}`;
        }

        document.getElementById('route-output').innerHTML = `
            <h3>ルート情報</h3>
            <p>途中駅: ${routeText}</p>
            <p>所要時間: ${result.time.toFixed(2)} 分</p>
            <p>距離: ${result.distance.toFixed(2)} km</p>
        `;
    }
});

