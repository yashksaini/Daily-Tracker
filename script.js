let status = document.getElementById("status");
let dataEntered = document.getElementById("dataEntered");
// Form Fields
let subjectData = document.getElementById("subjectData");
let durationData = document.getElementById("durationData");
let dateData = document.getElementById("dateData");
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
showEntries();
async function showSubjects() {
  subjectData.innerHTML = "";
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM subject WHERE status=1 ORDER BY id DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        subjectData.innerHTML += `<option hidden value="">Select Subject</option>`;
        for (i = 0; i < len; i++) {
          subjectData.innerHTML += `<option value="${
            results.rows.item(i).id
          }">${results.rows.item(i).name}</option>`;
        }
      }
    );
  });
}

async function addData() {
  let date = dateData.value;
  let duration = durationData.value;
  let subject = subjectData.value;
  if (!dateData.value) {
    alert("Date is required");
  } else if (durationData.value < 5) {
    alert("Duration is greater than 5");
  } else if (!subjectData.value) {
    alert("Subject is required");
  } else {
    await db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO app_data (date,duration,sub_id) VALUES(?,?,?)",
        [date, duration, subject]
      );
      dateData.value = "";
      durationData.value = "";
      subjectData.value = "";
      showEntries();
    });
  }
}

async function showEntries() {
  dataEntered.innerHTML = "";
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT date,duration,name FROM app_data INNER JOIN subject WHERE app_data.sub_id = subject.id ORDER BY app_data.date DESC LIMIT 20",
      [],
      function (tx, results) {
        let len = results.rows.length;

        for (i = 0; i < len; i++) {
          let date = results.rows.item(i).date;
          let content = date.split("-");
          dataEntered.innerHTML += `<div class="card1">
        <p>${results.rows.item(i).name} - &nbsp;<b>${
            results.rows.item(i).duration
          }</b> </p>
          <h6>${content[2]} ${months[parseInt(content[1])]}, ${content[0]}</h6>
        <span><i class="far fa-clock"></i></span>
        </div>`;
        }
      }
    );
  });
}
