// const dbName = "yourTracker7";
const dbName = "dailyTracker";
const dbversion = "1.0";
const dbDescription = "Track your daily activities";
const dbSize = 5 * 1024 * 1024; // 5MB Size
let db = openDatabase(dbName, dbversion, dbDescription, dbSize);

// To create tables when no tables in the database
db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY,name unique)"
  );
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS subject (id INTEGER PRIMARY KEY ,name unique,status)"
  );
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS sub_cat (id INTEGER PRIMARY KEY,sub_id,cat_id)"
  );
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS app_data (id INTEGER PRIMARY KEY,date DATE,duration,sub_id)"
  );
});
