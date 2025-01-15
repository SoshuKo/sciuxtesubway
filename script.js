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
        route = calculateShortestCircularRoute(stationsSmare, smareIndexStart, smareIndexEnd);
      } else if (stsarfkeIndexStart !== -1 && stsarfkeIndexEnd !== -1) {
        route = calculateShortestCircularRoute(stationsStsarfke, stsarfkeIndexStart, stsarfkeIndexEnd);
      } else {
        // 共和広場⇄スツューフテ中央間は、原則としてスツァーフケ線を利用
        if ((start === "共和広場" && end === "スツューフテ中央") || (start === "スツューフテ中央" && end === "共和広場")) {
          route = calculateDirectRoute(stationsStsarfke, stsarfkeIndexStart, stsarfkeIndexEnd);
        } else {
          // その他の場合は、最短経路を計算
          const smareToStsarfke = calculateDirectRoute(stationsSmare, smareIndexStart, stationsSmare.indexOf("スツューフテ中央"));
          const stsarfkeToSmare = calculateDirectRoute(stationsStsarfke, stsarfkeIndexStart, stationsStsarfke.indexOf("スツューフテ中央"));
          if (smareToStsarfke.length + stsarfkeToSmare.length < 30) {
            route = smareToStsarfke.concat("乗り換え").concat(stsarfkeToSmare);
            time += transferTime;
            transfer = true;
          }
        }
      }

        time += route.length * timePerStation;
        distance += route.length * distancePerStation;

        return { route, time, distance, transfer };
    }

function calculateShortestCircularRoute(line, startIndex, endIndex) {
  const clockwise = line.slice(startIndex).concat(line.slice(0, endIndex + 1));
  const counterclockwise = line.slice(endIndex).concat(line.slice(0, startIndex + 1));
  return clockwise.length < counterclockwise.length ? clockwise : counterclockwise;
}

function displayRoute(result) {
  let routeString = "";
  for (let i = 0; i < result.route.length; i++) {
    if (result.route[i] === "乗り換え") {
      routeString += ` → ${result.route[i]} → `;
    } else {
      routeString += ` ${result.route[i]} → `;
    }
  }
  routeString = routeString.slice(0, -3); // 末尾の " → " を削除

  document.getElementById('route-output').innerHTML = `
    <h3>ルート情報</h3>
    <p>途中駅: ${routeString}</p>
    <p>所要時間: ${result.time.toFixed(2)} 分</p>
    <p>距離: ${result.distance.toFixed(2)} km</p>
  `;
}
});
