const subjectName = document.getElementById("subject");
const dataEntered = document.getElementById("dataEntered");

let updateModal = document.getElementById("updateModal");
let updateName = document.getElementById("updateName");
let statusValue = document.getElementsByName("status");
let currentId = 0;

const addSubject = () => {
  let subName = subjectName.value;
  if (subName.length < 1) {
    alert("Please enter a category name!");
  } else if (subName.length > 30) {
    alert("Category Name is too large!");
  } else {
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO category (name) VALUES(?)", [subName]);
    });
    showData();
    subjectName.value = "";
  }
};
showData();

const update = (a, b) => {
  updateName.value = a;
  currentId = b;
  changeModal();
};

const changeModal = () => {
  updateModal.classList.toggle("hide");
};

async function updateData() {
  if (updateName.value.length > 1 && updateName.value.length < 45) {
    await db.transaction((tx) => {
      tx.executeSql("UPDATE category SET name=? WHERE id=?", [
        updateName.value,
        currentId,
      ]);
    });
    changeModal();
    showData();
  }
}
async function showData() {
  dataEntered.innerHTML = "";

  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM category ORDER BY id DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        document.getElementById(
          "status"
        ).innerHTML = `Total Categories - ${len}`;
        for (i = 0; i < len; i++) {
          dataEntered.innerHTML += `<div class="card ">
        <p onclick="showSubCat('${results.rows.item(i).id}','${
            results.rows.item(i).name
          }')">${results.rows.item(i).name}</p>
        <span onclick="update('${results.rows.item(i).name}','${
            results.rows.item(i).id
          }')"><i class="fas fa-ellipsis-v"></i></span>
        </div>`;
        }
      }
    );
  });
}

let subCatModal = document.getElementById("subCatModal");
let addedSubjects = document.getElementById("addedSubjects");
let leftSubjects = document.getElementById("leftSubjects");
let categoryName = document.getElementById("categoryName");
let subCatId = 0;

function changeModal1() {
  subCatModal.classList.toggle("hide");
}
// Adding subject to category
async function addSubToCat(a, b) {
  db.transaction((tx) => {
    tx.executeSql("INSERT INTO sub_cat (sub_id,cat_id) VALUES(?,?)", [b, a]);
  });
  displayAddedSubject();
  displayLeftSubjects();
}

async function remSubToCat(subId, catId) {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM sub_cat WHERE sub_id=? AND cat_id=?", [
      subId,
      catId,
    ]);
  });
  displayAddedSubject();
  displayLeftSubjects();
}
async function showSubCat(catId, catName) {
  categoryName.innerHTML = catName;
  subCatId = catId;
  changeModal1();
  displayAddedSubject();
  displayLeftSubjects();
}
async function displayAddedSubject() {
  addedSubjects.innerHTML = "";
  await db.transaction((tx) => {
    // Subjects in the Category
    tx.executeSql(
      "SELECT * FROM subject WHERE id IN (SELECT sub_id FROM sub_cat WHERE cat_id = ?)",
      [subCatId],
      function (tx, results) {
        let len = results.rows.length;
        for (i = 0; i < len; i++) {
          addedSubjects.innerHTML += `<div class="tag">
        <p>${results.rows.item(i).name}</p>
        <span onclick="remSubToCat('${
          results.rows.item(i).id
        }','${subCatId}')"><i class="fas fa-times"></i></span>
        </div>`;
        }
        if (len === 0) {
          addedSubjects.innerHTML = `<div class="tag">
        <p>No subjects added</p>
        <span><i class="fas fa-skull"></i></span>
        </div>`;
        }
      }
    );
  });
}

async function displayLeftSubjects() {
  leftSubjects.innerHTML = "";
  await db.transaction((tx) => {
    // Subjects not in the category
    tx.executeSql(
      "SELECT * FROM subject WHERE id NOT IN (SELECT sub_id FROM sub_cat WHERE cat_id = ?)",
      [subCatId],
      function (tx, results) {
        let len = results.rows.length;
        for (i = 0; i < len; i++) {
          leftSubjects.innerHTML += `<div class="tag">
        <p>${results.rows.item(i).name}</p>
        <span onclick="addSubToCat('${subCatId}','${
            results.rows.item(i).id
          }')"><i class="fas fa-plus"></i></span>
        </div>`;
        }
        if (len === 0) {
          leftSubjects.innerHTML = `<div class="tag">
        <p>No subjects left</p>
        <span><i class="fas fa-skull"></i></span>
        </div>`;
        }
      }
    );
  });
}
