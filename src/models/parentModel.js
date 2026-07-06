import pool from "../database/db.js";

/**
 * Save parent information
 */
export const createParent = async (parentData) => {

    const {
        telegram_id,
        telegram_username,
        full_name,
        phone,
        email,
        city,
        sub_city
    } = parentData;

    const sql = `
        INSERT INTO parents (
            telegram_id,
            telegram_username,
            full_name,
            phone,
            email,
            city,
            sub_city
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        telegram_id,
        telegram_username,
        full_name,
        phone,
        email,
        city,
        sub_city
    ]);

    return result.insertId;
};

export const getParentByTelegramId = async (telegramId) => {

    const [rows] = await pool.query(
        "SELECT * FROM parents WHERE telegram_id = ?",
        [telegramId]
    );

    return rows[0];
};

export const getParentByEmail = async (email) => {

    const [rows] = await pool.query(
        "SELECT * FROM parents WHERE email = ?",
        [email]
    );

    return rows[0];
};