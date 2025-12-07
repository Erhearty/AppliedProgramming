// mongo_setup.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/student_db";

async function runMongoDBSetup() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("1. Успішне підключення до MongoDB Server.");

        const db = client.db("student_db");
        console.log(`2. База даних '${db.databaseName}' обрана.`);

        await createAndInsertData(db, "group");


        await findAllStudents(db);
        await findFrontendStudents(db);

        await updateSingleGroup(db);
        await updateStudentsAge(db);

        await deleteOneStudent(db);
        await dropCoursesCollection(db);

    } catch (error) {
        console.error("Помилка:", error.message);
    } finally {
        await client.close();
        console.log("--- З'єднання закрито. Роботу завершено. ---");
    }
}

async function createAndInsertData(db, collectionName) {
    try {
        await db.createCollection(collectionName);
        console.log(`3. Колекція '${collectionName}' створена.`);
    } catch (e) {
        if (e.code === 48) {
            console.log(`Колекція '${collectionName}' вже існує.`);
        } else throw e;
    }

    await insertInitialData(db, collectionName);
}

async function insertInitialData(db, collectionName) {
    const groupsCollection = db.collection(collectionName);

    const document = {
        name: "WEB-21",
        curator: "Mr. Smith",
        students_count: 28
    };

    const result = await groupsCollection.insertOne(document);
    console.log(`4. Документ вставлено. ID: ${result.insertedId}`);

    await insertMultipleData(db);
}

async function insertMultipleData(db) {
    const studentsCollection = db.collection("students");

    const students = [
        { name: "Олена", specialty: "Frontend", group: "WEB-21" },
        { name: "Микола", specialty: "Backend", group: "WEB-21" },
        { name: "Ірина", specialty: "QA", group: "QA-22" }
    ];

    const result = await studentsCollection.insertMany(students);
    console.log(`5. Вставлено ${result.insertedCount} нових студентів.`);
}


//READ
async function findAllStudents(db) {
    console.log("\nЗавдання 1.1: Усі студенти:");

    const students = await db.collection("students").find({}).toArray();
    console.log(students);
}

async function findFrontendStudents(db) {
    console.log("\nЗавдання 1.2: Студенти Frontend:");

    const result = await db.collection("students")
        .find({ specialty: "Frontend" })
        .toArray();

    console.log(result);
}


//UPDATE
async function updateSingleGroup(db) {
    console.log("\nЗавдання 2.1: Оновлення групи WEB-21");

    const result = await db.collection("group").updateOne(
        { name: "WEB-21" },
        { $set: { curator: "Dr. Black" } }
    );

    console.log(`Оновлено документів: ${result.modifiedCount}`);
}

async function updateStudentsAge(db) {
    console.log("\n Завдання 2.2: Оновлення віку студентів");

    const result = await db.collection("students").updateMany(
        {},
        { $set: { age: 20 } }
    );

    console.log(`Оновлено ${result.modifiedCount} студентів.`);
}


//DELETE
async function deleteOneStudent(db) {
    console.log("\nЗавдання 3.1: Видалення студентки Ірини");

    const result = await db.collection("students").deleteOne({ name: "Ірина" });

    console.log(`Видалено документів: ${result.deletedCount}`);
}

async function dropCoursesCollection(db) {
    console.log("\nЗавдання 3.2: Видалення колекції 'courses'");

    try {
        await db.collection("courses").drop();
        console.log("Колекцію 'courses' видалено.");
    } catch (e) {
        console.log("Колекції 'courses' не існує — пропускаємо.");
    }
}



runMongoDBSetup();
