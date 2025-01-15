document.addEventListener('DOMContentLoaded', function() {
    const stationsSmare = [
        "スツューフテ中央(M)", "市役所前", "スツライルペ1丁目", "スツライルペ2丁目",
        "スツライルペ3丁目", "シュンギアファベルペ1丁目", "シュンギアファベルペ2丁目",
        "シュンギアファベルペ3丁目", "サーキット東", "サーキット西", "ダウケルペ南",
        "国会議事堂前", "共和広場(M)", "ファウペルペ北", "観光地区1丁目", "観光地区2丁目",
        "観光地区3丁目", "住宅街1丁目", "住宅街2丁目", "住宅街3丁目", "学園町1丁目(KSS)",
        "学園町2丁目", "学園町3丁目", "ガメルペ"
    ];

    const stationsStsarfke = [
        "共和広場(C’)", "ファウペルペ南", "ダウケルペ北", "ツァラアクラテ3丁目", "ツァラアクラテ2丁目",
        "ツァラアクラテ1丁目", "ツァラアクラテ中央", "問屋街3丁目", "問屋街2丁目", "問屋街1丁目",
        "スツューフテ中央(C’)", "副都心1丁目", "副都心2丁目", "副都心3丁目", "グラペルペ南",
        "グラペルペ北", "スツァーフケ"
    ];

    const timePerStation = 1.13; // minutes
    const distancePerStation = 1.0; // assumed to be 1 km per station

    const stationSelects = document.querySelectorAll('.station-select');
    stationSelects.forEach(select => {
        stationsSmare.concat(stationsStsarfke).forEach(station => {
            let option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            select.appendChild(option);
        });
    });

    const viaStationSelect = document.getElementById('via-station');
    const endStationSelect = document.getElementById('end-station');
    viaStationSelect.addEventListener('change', function() {
        const specialStations = ["スツューフテ中央(M)", "スツューフテ中央(C’)", "共和広場(M)", "共和広場(C’)"];
        if (specialStations.includes(viaStationSelect.value)) {
            endStationSelect.disabled = false;
        } else {
            endStationSelect.disabled = true;
            endStationSelect.value = "";
        }
    });

    document.getElementById('calculate-btn').addEventListener('click', function() {
        const startStation = document.getElementById('start-station').value;
        const viaStation = document.getElementById('via-station').value;
        const endStation = document.getElementById('end-station').value;

        if (startStation === viaStation || (viaStation && viaStation === endStation)) {
            alert('選択した駅が同じです。');
            return;
        }

        if (!isSameLine(startStation, viaStation)) {
            alert('同じ路線の駅を選択して下さい。');
            return;
        }

        const route1 = calculateShortestRoute(startStation, viaStation);
        displayRoute(route1, 'route-output-1', "ルート情報1");

        if (viaStation) {
            let nextStartStation = getCounterpartStation(viaStation);
            if (endStation) {
                if (!isSameLine(nextStartStation, endStation)) {
                    alert('同じ路線の駅を選択して下さい。');
                    return;
                }
                const route2 = calculateShortestRoute(nextStartStation, endStation);
                displayRoute(route2, 'route-output-2', "ルート情報2");
                displayTotal(route1, route2);
            } else {
                displayTotal(route1, null);
            }
        } else {
            displayTotal(route1, null);
        }
    });

    function isSameLine(station1, station2) {
        return (stationsSmare.includes(station1) && stationsSmare.includes(station2)) ||
               (stationsStsarfke.includes(station1) && stationsStsarfke.includes(station2));
    }

    function calculateShortestRoute(start, end) {
        const smareIndexStart = stationsSmare.indexOf(start);
        const smareIndexEnd = stationsSmare.indexOf(end);
        const stsarfkeIndexStart = stationsStsarfke.indexOf(start);
        const stsarfkeIndexEnd = stationsStsarfke.indexOf(end);

        let route = [];
        let time = 0;
        let distance = 0;

        if (smareIndexStart !== -1 && smareIndexEnd !== -1) {
            const clockwiseRoute = calculateDirectRoute(stationsSmare, smareIndexStart, smareIndexEnd);
            const counterClockwiseRoute = calculateDirectRoute(stationsSmare.reverse(), stationsSmare.length - 1 - smareIndexStart, stationsSmare.length - 1 - smareIndexEnd);
            route = (counterClockwiseRoute.length <= clockwiseRoute.length) ? counterClockwiseRoute : clockwiseRoute;
        } else if (stsarfkeIndexStart !== -1 && stsarfkeIndexEnd !== -1) {
            route = (stsarfkeIndexStart < stsarfkeIndexEnd) ?
                calculateDirectRoute(stationsStsarfke, stsarfkeIndexStart, stsarfkeIndexEnd) :
                calculateDirectRoute(stationsStsarfke.reverse(), stationsStsarfke.length - 1 - stsarfkeIndexStart, stationsStsarfke.length - 1 - stsarfkeIndexEnd);
        }

        time += (route.length - 1) * timePerStation;
        distance += (route.length - 1) * distancePerStation;

        return { route, time, distance };
    }

    function calculateDirectRoute(line, startIndex, endIndex) {
        return (startIndex < endIndex) ?
            line.slice(startIndex, endIndex + 1) :
            line.slice(startIndex).concat(line.slice(0, endIndex + 1));
    }

    function getCounterpartStation(station) {
        const counterparts = {
            "スツューフテ中央(M)": "スツューフテ中央(C’)",
            "スツューフテ中央(C’)": "スツューフテ中央(M)",
            "共和広場(M)": "共和広場(C’)",
            "共和広場(C’)": "共和広場(M)"
        };
        return counterparts[station];
    }

    function displayRoute(result, outputId, title) {
        document.getElementById(outputId).innerHTML = `
            <h3>${title}</h3>
            <p>途中駅: ${result.route.join(' → ')}</p>
            <p>所要時間: ${result.time.toFixed(2)} 分</p>
            <p>距離: ${result.distance.toFixed(2)} km</p>
        `;
    }

    function displayTotal(route1, route2) {
        const totalTime = route1.time + (route2 ? route2.time : 0);
        const totalDistance = route1.distance + (route2 ? route2.distance : 0);
        document.getElementById('total-output').innerHTML = `
            <h3>合計</h3>
            <p>総所要時間: ${totalTime.toFixed(2)} 分</p>
            <p>総距離: ${totalDistance.toFixed(2)} km</p>
        `;
    }
});
