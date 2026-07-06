import pool from "../database/db.js";

/**
 * Save tutor professional information
 */
export const createTutorProfessional = async (data) => {
    // const {
    //     tutor_id,
    //     subject,
    //     grade,
    //     experience,
    //     education,
    //     city,
    //     sub_city,
    //     available_days,
    //     available_time
    // } = professionalData;

    const sql = `
        INSERT INTO tutor_professional (
            tutor_id,
            city,
            sub_city,
            subject,
            grade,
            experience,
            education,
            available_days,
            available_time,
            expected_payment
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        data.tutor_id,
        data.city,
        data.sub_city,
        data.subjects,
        data.grade_levels,
        data.experience,
        data.education,
        data.available_days,
        data.available_time,
        data.expected_payment,
    ]);
       
        
   

    return result.insertId;
};

export const getTutorProfessionalByTutorId = async (tutor_id) => {
    const sql = `
        SELECT * FROM tutor_professional WHERE tutor_id = ? 
    `;
    const [rows] = await pool.query(sql, [tutor_id]);
    return rows[0];
}

export const updateTutorProfessional = async (tutor_id, professionalData) => {
    const {
        subject,
        grade,
        experience,
        education,  
        city,
        sub_city,
        available_days,
        available_time
    } = professionalData;

    const sql = `
        UPDATE tutor_professional
        SET subject = ?, grade = ?, experience = ?, education = ?, city = ?, sub_city = ?, available_days = ?, available_time = ?
        WHERE tutor_id = ?
    `;

    const [result] = await pool.query(sql, [
        subject,
        grade,
        experience,
        education,
        city,
        sub_city,
        available_days,
        available_time,
        tutor_id
    ]);

    return result.affectedRows;
};
  export const deleteTutorProfessional = async (tutor_id) => {
    const sql = `
        DELETE FROM tutor_professional WHERE tutor_id = ?   

    `;
    const [result] = await pool.query(sql, [tutor_id]);
    return result.affectedRows;
}

