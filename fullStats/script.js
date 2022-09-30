let status = document.getElementById("status");
let dataEntered = document.getElementById("dataEntered");
let subjectData = document.getElementById("subjectData");

// For displaying data
let inMinutes = document.getElementById("inMinutes");
let average = document.getElementById("average");
let days = document.getElementById("days");

let timeValue = 0;
let dayCount = 1;

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
showSubjects();
async function showSubjects() {
  subjectData.innerHTML = "";
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM subject WHERE status=1 ORDER BY id DESC",
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

async function removeData(id) {
  await db.transaction((tx) => {
    tx.executeSql("DELETE FROM app_data WHERE id=?", [id]);
  });
  showEntries();
}
async function showEntries() {
  timeValue = 0;
  dayCount = 1;

  let subjectId = subjectData.value;
  dataEntered.innerHTML = "";
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT app_data.id,date,duration,name FROM app_data INNER JOIN subject ON app_data.sub_id = subject.id WHERE app_data.sub_id=? ORDER BY app_data.date DESC",
      [subjectId],
      function (tx, results) {
        let len = results.rows.length;
        dataEntered.innerHTML = `<div class="card1">
        <p>Total entries  &nbsp;<b><i>(${len})</i></b> </p>
          <h6>Subject Stats</h6>
        <span class="remBtn"><i class="far fa-check-circle"></i></span>
        </div>`;
        for (i = 0; i < len; i++) {
          let date = results.rows.item(i).date;
          let content = date.split("-");
          dataEntered.innerHTML += `<div class="card1">
        <p>${results.rows.item(i).name} - &nbsp;<b>${
            results.rows.item(i).duration
          }</b> </p>
          <h6>${content[2]} ${months[parseInt(content[1])]}, ${content[0]}</h6>
        <span class="remBtn" onclick="removeData(${
          results.rows.item(i).id
        })"><i class="fas fa-trash"></i></span>
        </div>`;
        }
      }
    );
  });
  // For further stats

  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT SUM(duration) as total FROM app_data WHERE sub_id=? GROUP BY sub_id",
      [subjectId],
      function (tx, results) {
        let len = results.rows.length;

        if (len < 1) {
          inMinutes.innerHTML = `Total time = 0 min &nbsp; &nbsp; <b>( 0  hr )</b>`;
        } else {
          timeValue = results.rows.item(0).total;
          inMinutes.innerHTML = `Total time = ${
            results.rows.item(0).total
          } mins  &nbsp; &nbsp; <b>( ${(
            results.rows.item(0).total / 60
          ).toFixed(2)} hr )</b>`;
        }
      }
    );
  });

  // For Days
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT DISTINCT date FROM app_data WHERE sub_id=? ",
      [subjectId],
      function (tx, results) {
        let len = results.rows.length;
        if (len > 0) {
          dayCount = len;
        }
        days.innerHTML = `Days <b> ( ${len} )</b>`;
      }
    );
  });
  setTimeout(() => {
    average.innerHTML = `Average time = ${(timeValue / dayCount).toFixed(
      1
    )} mins/day &nbsp; &nbsp; <b>( ${(timeValue / dayCount / 60).toFixed(
      2
    )} hr/day )</b>`;
  }, 1000);
}
