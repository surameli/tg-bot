import pool from "../database/db.js";

/**
 * Save tutor basic information
 */
export const createTutor = async (data) => {
    console.log("Running INSERT...");
    // const {
    //     telegram_id,
    //     telegram_username,
    //     full_name,
    //     gender,
    //     phone,
    //     email,
    //     password
    // } = tutorData;

    const sql = `
        INSERT INTO tutors (
            telegram_id,
            telegram_username,
            full_name,
            gender,
            phone,
            email,
            password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        data.telegram_id,
        data.telegram_username,
        data.full_name,
        data.gender,
        data.phone,
        data.email,
        data.password
    ]);

    return result.insertId;
};
 console.log("after INSERT...");
 
export const getTutorByTelegramId = async (telegram_id) => {
    const sql = `
        SELECT * FROM tutors WHERE telegram_id = ?
    `;
    const [rows] = await pool.query(sql, [telegram_id]);
    return rows[0];
}

export const getTutorByEmail = async (email) => {
    const sql = `
        SELECT * FROM tutors WHERE email = ?
    `;
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
}   

