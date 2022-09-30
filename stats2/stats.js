const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let eachBar = document.getElementsByClassName("eachBar");
let barContent = document.getElementsByClassName("barContent");
let dateShow = document.getElementsByClassName("dateShow");
let durations = [];

// Display Stats
let totalTime = document.getElementById("totalTime");
let averageTime = document.getElementById("averageTime");

// Getting the last 7 Days dates
const dates = [...Array(7)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  let month = parseInt(d.getMonth() + 1);
  let date = d.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  return d.getFullYear() + "-" + month + "-" + date;
});

let subjectData = document.getElementById("subjectData");
showSubjects();
async function showSubjects() {
  subjectData.innerHTML = "";
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM category ORDER BY id DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        for (i = 0; i < len; i++) {
          subjectData.innerHTML += `<option value="${
            results.rows.item(i).id
          }">${results.rows.item(i).name}</option>`;
        }
      }
    );
  });
}

async function getSubjectGraph() {
  durations.length = 0;
  let catId = document.getElementById("subjectData").value;
  for (let i = 0; i < 7; i++) {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT SUM(duration) as total FROM app_data WHERE date=? AND sub_id IN (SELECT sub_id FROM sub_cat WHERE cat_id=?) GROUP BY date",
        [dates[i], catId],
        function (tx, results) {
          let len = results.rows.length;
          if (len > 0) {
            durations.push(results.rows.item(0).total);
          } else {
            durations.push(0);
          }
        }
      );
    });
  }
  setTimeout(() => {
    showGraph();
  }, 1000);
}

async function showGraph() {
  let timeCount = 0;
  for (let i = 0; i < durations.length; i++) {
    timeCount += durations[i];
  }
  //  Displaying Total Time
  totalTime.innerHTML = `Total time = ${timeCount} mins  &nbsp; &nbsp; <b>( ${(
    timeCount / 60
  ).toFixed(2)} hr )</b>`;

  //  Displaying Average Time
  averageTime.innerHTML = `Average time = ${(timeCount / 7).toFixed(
    1
  )} mins/day &nbsp; &nbsp; <b>( ${(timeCount / 420).toFixed(2)} hr/day )</b>`;
  let maxValue = Math.max(...durations);
  if (maxValue === 0) {
    maxValue = 1;
  }
  let factor = 240 / maxValue;
  durations.reverse();
  dates.reverse();
  for (let i = 0; i < 7; i++) {
    barContent[i].innerHTML = durations[i];
    eachBar[i].style.height = durations[i] * factor + "px";
    eachBar[i].style.transition = "all 0.5s";
    let content = dates[i].split("-");
    dateShow[i].innerHTML = `${content[2]} ${months[parseInt(content[1])]}, ${
      content[0]
    }`;
  }
}
