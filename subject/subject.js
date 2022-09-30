const subjectName = document.getElementById("subject");
const dataEntered = document.getElementById("dataEntered");

let updateModal = document.getElementById("updateModal");
let updateName = document.getElementById("updateName");
let statusValue = document.getElementsByName("status");
let currentId = 0;

const addSubject = () => {
  let subName = subjectName.value;
  if (subName.length < 1) {
    alert("Please enter a subject name!");
  } else if (subName.length > 44) {
    alert("Subject Name is too large!");
  } else {
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO subject (name,status) VALUES(?,1)", [subName]);
    });
    showData();
    subjectName.value = "";
  }
};
showData();

const update = (a, b, c) => {
  updateName.value = a;
  statusValue[b - 1].checked = true;
  currentId = c;
  changeModal();
};

const changeModal = () => {
  updateModal.classList.toggle("hide");
};

async function updateData() {
  let statusData = 1;
  if (statusValue[1].checked) {
    statusData = 2;
  }

  if (updateName.value.length > 1 && updateName.value.length < 45) {
    await db.transaction((tx) => {
      tx.executeSql("UPDATE subject SET name=?,status=? WHERE id=?", [
        updateName.value,
        statusData,
        currentId,
      ]);
    });
    changeModal();
    showData();
  }
}
async function showData() {
  dataEntered.innerHTML = "";
  let countSubjects = 0;

  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM subject WHERE status=1 ORDER BY id DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        countSubjects += results.rows.length;
        for (i = 0; i < len; i++) {
          dataEntered.innerHTML += `<div class="card ">
        <p>${results.rows.item(i).name}</p>
        <span onclick="update('${results.rows.item(i).name}','${
            results.rows.item(i).status
          }','${
            results.rows.item(i).id
          }')"><i class="fas fa-ellipsis-v"></i></span>
        </div>`;
        }
      }
    );
    tx.executeSql(
      "SELECT * FROM subject WHERE status=2 ORDER BY id DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        countSubjects += results.rows.length;
        document.getElementById(
          "status"
        ).innerHTML = `Total Subjects - ${countSubjects}`;

        for (i = 0; i < len; i++) {
          dataEntered.innerHTML += `<div class="card activeCard">
        <p>${results.rows.item(i).name}</p>
        <span onclick="update('${results.rows.item(i).name}','${
            results.rows.item(i).status
          }','${
            results.rows.item(i).id
          }')"><i class="fas fa-ellipsis-v"></i></span>
        </div>`;
        }
      }
    );
  });
}
