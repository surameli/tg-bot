import pool from "../database/db.js";

/**
 * Save one tutor document
 */
export const createTutorDocument = async (data) => {

    // const {
    //     tutor_id,
    //     document_type,
    //     telegram_file_id,
    //     file_name
    // } = documentData;

    const sql = `
        INSERT INTO tutor_documents (
            tutor_id,
            document_type,
            telegram_file_id,
            file_name
        )
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        data.tutor_id,
        data.document_type,
        data.telegram_file_id,
        data.file_name
    ]);

    return result.insertId;
};

export const getTutorDocuments = async (tutorId) => {

    const sql = `
        SELECT *
        FROM tutor_documents
        WHERE tutor_id = ?
    `;

    const [rows] = await pool.query(sql, [tutorId]);

    return rows;
};

export const deleteTutorDocument = async (documentId) => {

    const sql = `
        DELETE FROM tutor_documents
        WHERE id = ?
    `;

    await pool.query(sql, [documentId]);
};