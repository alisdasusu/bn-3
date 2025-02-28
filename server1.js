
const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require('fs');

const { readFileSync } = require("fs");
// var path = require("path");
let cer_part = path.join(process.cwd(), 'isrgrootx1.pem');

// อนุญาตให้ทุก origin เข้าถึง API ได้
app.use(cors());

// รองรับการส่งข้อมูลแบบ form และ JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ใช้ port ที่ Vercel ให้มา หรือ default เป็น 3000 ในการพัฒนา
const port = process.env.PORT || 80;

// ใช้ไฟล์ static จากโฟลเดอร์ code
app.use(express.static(path.join(__dirname, '..', 'code')));

// เชื่อมต่อกับฐานข้อมูล
const db = mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '2eWt5cvcpQwdSAA.root',
    password: "axEa0LQSchUPr0R3",
    database: 'child',
    port : 4000,
    ssl: {
        ca: fs.readFileSync(cer_part)
    }
});



db.connect((err) => {
    if (err) {
        console.error('MYSQL connection error: ', err);
    } else {
        console.log('Connected to MYSQL');
    }
});


// เสิร์ฟไฟล์ HTML หลักที่เส้นทางหลัก
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'code', 'index.html'));
});

// API documentation ย้ายมาที่เส้นทาง /api
app.get('/api', (req, res) => {
    res.json({
        "Name": "ระบบจัดการสุขภาพเด็ก API",
        "Author": "Charoenporn Bouyam",
        "APIs": [
            // Doctor APIs
            { "api_name": "/getDoctors/", "method": "get", "description": "ดูข้อมูลหมอทั้งหมด" },
            { "api_name": "/getDoctor/:id", "method": "get", "description": "ดูข้อมูลหมอตาม ID" },
            { "api_name": "/addDoctor/", "method": "post", "description": "เพิ่มข้อมูลหมอ" },
            { "api_name": "/editDoctor/", "method": "put", "description": "แก้ไขข้อมูลหมอ" },
            { "api_name": "/deleteDoctor/", "method": "delete", "description": "ลบข้อมูลหมอ" },
            
            // Appointment APIs
            { "api_name": "/getAppointments/", "method": "get", "description": "ดูนัดหมายทั้งหมด" },
            { "api_name": "/getAppointment/:id", "method": "get", "description": "ดูนัดหมายตาม ID" },
            { "api_name": "/addAppointment/", "method": "post", "description": "เพิ่มนัดหมายใหม่" },
            { "api_name": "/editAppointment/", "method": "put", "description": "แก้ไขนัดหมาย" },
            { "api_name": "/deleteAppointment/", "method": "delete", "description": "ลบนัดหมาย" },
            
            // Children APIs
            { "api_name": "/getChildren/", "method": "get", "description": "ดูข้อมูลเด็กทั้งหมด" },
            { "api_name": "/getChild/:id", "method": "get", "description": "ดูข้อมูลเด็กตาม ID" },
            { "api_name": "/addChild/", "method": "post", "description": "เพิ่มข้อมูลเด็กใหม่" },
            { "api_name": "/editChild/", "method": "put", "description": "แก้ไขข้อมูลเด็ก" },
            { "api_name": "/deleteChild/", "method": "delete", "description": "ลบข้อมูลเด็ก" },
            
            // Growth Records APIs
            { "api_name": "/getGrowthRecords/", "method": "get", "description": "ดูข้อมูลพัฒนาการทั้งหมด" },
            { "api_name": "/getGrowthRecord/:id", "method": "get", "description": "ดูข้อมูลพัฒนาการตาม ID" },
            { "api_name": "/addGrowthRecord/", "method": "post", "description": "เพิ่มข้อมูลพัฒนาการใหม่" },
            { "api_name": "/editGrowthRecord/", "method": "put", "description": "แก้ไขข้อมูลพัฒนาการ" },
            { "api_name": "/deleteGrowthRecord/", "method": "delete", "description": "ลบข้อมูลพัฒนาการ" },
            
            // User APIs
            { "api_name": "/getUsers/", "method": "get", "description": "ดูข้อมูลผู้ใช้ทั้งหมด" },
            { "api_name": "/getUser/:id", "method": "get", "description": "ดูข้อมูลผู้ใช้ตาม ID" },
            { "api_name": "/addUser/", "method": "post", "description": "เพิ่มผู้ใช้ใหม่" },
            { "api_name": "/editUser/", "method": "put", "description": "แก้ไขข้อมูลผู้ใช้" },
            { "api_name": "/deleteUser/", "method": "delete", "description": "ลบผู้ใช้" },
            
            // Vaccination APIs
            { "api_name": "/getVaccinations/", "method": "get", "description": "ดูข้อมูลวัคซีนทั้งหมด" },
            { "api_name": "/getVaccination/:id", "method": "get", "description": "ดูข้อมูลวัคซีนตาม ID" },
            { "api_name": "/addVaccination/", "method": "post", "description": "เพิ่มประวัติวัคซีนใหม่" },
            { "api_name": "/editVaccination/", "method": "put", "description": "แก้ไขประวัติวัคซีน" },
            { "api_name": "/deleteVaccination/", "method": "delete", "description": "ลบประวัติวัคซีน" }
        ]
    });
});

// ============= APPOINTMENTS ENDPOINTS =============

// Get all appointments
app.get('/getAppointments/', (req, res) => {
    let sql = 'SELECT * FROM child.APPOINTMENTS';
    db.query(sql, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get appointment by ID
app.get('/getAppointment/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM child.APPOINTMENTS WHERE appointments_id = ?';
    db.query(sql, [id], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Add new appointment
app.post('/addAppointment', (req, res) => {
    console.log(req.body);
    let sql = 'INSERT INTO child.APPOINTMENTS(child_id, doctor_id, appointments_date, status) VALUES (?, ?, ?, ?)';
    let values = [
        req.body.child_id,
        req.body.doctor_id,
        req.body.appointments_date,
        req.body.status || 'รอยืนยัน'
    ];
    let message = "Cannot Insert";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Inserted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Update appointment
app.put('/editAppointment', (req, res) => {
    console.log(req.body);
    let sql = 'UPDATE child.APPOINTMENTS SET child_id = ?, doctor_id = ?, appointments_date = ?, status = ? WHERE appointments_id = ?';
    let values = [
        req.body.child_id,
        req.body.doctor_id,
        req.body.appointments_date,
        req.body.status,
        req.body.appointments_id
    ];
    let message = "Cannot Edit";

    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Updated"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Get appointments by child ID
app.get('/getAppointmentsByChild/:id', (req, res) => {
    let childId = req.params.id;
    let sql = 'SELECT a.*, d.name as doctor_name FROM child.APPOINTMENTS a LEFT JOIN child.DOCTORS d ON a.doctor_id = d.doctor_id WHERE a.child_id = ? ORDER BY a.appointments_date DESC';
    db.query(sql, [childId], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
}); 

// Delete appointment
app.delete('/deleteAppointment', (req, res) => {
    console.log(req.body);
    let sql = 'DELETE FROM child.APPOINTMENTS WHERE appointments_id = ?';
    let values = [req.body.appointments_id];
    console.log(values);
    let message = "Cannot Delete";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Deleted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// ============= CHILDREN ENDPOINTS =============

// Get all children
app.get('/getChildren', (req, res) => {
    let sql = 'SELECT c.*, p.name as parent_name FROM child.CHILDREN c LEFT JOIN child.PARENTS p ON c.parent_id = p.parent_id';
    db.query(sql, function(err, results, fields) {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get child by ID
app.get('/getChild/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT c.*, p.name as parent_name FROM child.CHILDREN c LEFT JOIN child.PARENTS p ON c.parent_id = p.parent_id WHERE c.child_ID = ?';
    db.query(sql, [id], function(err, results, fields) {
        if (err) {
            return res.status(500).json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Add new child
app.post('/addChild', (req, res) => {
    try {
        // ตรวจสอบการเชื่อมต่อเหมือนเดิม
        if (!db || db.state === 'disconnected') {
            throw new Error('Database connection lost');
        }
        
        const birthdate = req.body.birthday || new Date().toISOString().slice(0, 10);
        
        // Query the last child_ID and increment it by 1
        let getLastIdSql = 'SELECT MAX(child_ID) AS last_id FROM child.CHILDREN';
        
        db.query(getLastIdSql, (lastIdErr, lastIdResults) => {
            if (lastIdErr) {
                console.error('Error retrieving last child_ID:', lastIdErr);
                return res.status(500).json({ error: true, message: lastIdErr.message });
            }
            
            let lastId = lastIdResults[0].last_id || 0;
            let newChildId = lastId + 1;
            
            let sql = 'INSERT INTO child.CHILDREN(child_ID, name, birthday, gender, parent_id) VALUES (?, ?, ?, ?, ?)';
            let values = [
                newChildId,
                req.body.name,
                birthdate,
                req.body.gender,
                req.body.parent_id || null
            ];
            
            let message = "Cannot Insert";
            
            db.query(sql, values, (err, results) => {
                if (err) {
                    console.error('Error inserting child:', err);
                    return res.status(500).json({ error: true, message: err.message });
                }
                
                if (results.affectedRows > 0) { 
                    message = "Inserted"; 
                }
                
                // ถ้ามี parent_name แต่ไม่มี parent_id ให้บันทึกข้อมูลผู้ปกครอง
                if (req.body.parent_name && !req.body.parent_id) {
                    let parentSql = 'SELECT parent_id FROM child.PARENTS WHERE name = ?';
                    
                    db.query(parentSql, [req.body.parent_name], (parentErr, parentResults) => {
                        if (parentErr) {
                            console.error('Error checking parent:', parentErr);
                            return res.status(500).json({ 
                                error: false, 
                                data: results, 
                                msg: message, 
                                warning: "Child added but parent not linked" 
                            });
                        }
                        
                        if (parentResults.length > 0) {
                            // Parent exists, update child record with parent_id
                            let updateSql = 'UPDATE child.CHILDREN SET parent_id = ? WHERE child_ID = ?';
                            
                            db.query(updateSql, [parentResults[0].parent_id, newChildId], (updateErr) => {
                                if (updateErr) {
                                    console.error('Error linking child to parent:', updateErr);
                                    return res.status(500).json({ 
                                        error: false, 
                                        data: results, 
                                        msg: message, 
                                        warning: "Child added but parent link failed" 
                                    });
                                }
                                
                                return res.json({ 
                                    error: false, 
                                    data: results, 
                                    msg: message 
                                });
                            });
                        } else {
                            // Parent doesn't exist, insert new parent and update child record
                            let insertParentSql = 'INSERT INTO child.PARENTS(name) VALUES (?)';
                            
                            db.query(insertParentSql, [req.body.parent_name], (insertParentErr, insertParentResults) => {
                                if (insertParentErr) {
                                    console.error('Error inserting parent:', insertParentErr);
                                    return res.status(500).json({ 
                                        error: false, 
                                        data: results, 
                                        msg: message, 
                                        warning: "Child added but parent not linked" 
                                    });
                                }
                                
                                let updateSql = 'UPDATE child.CHILDREN SET parent_id = ? WHERE child_ID = ?';
                                
                                db.query(updateSql, [insertParentResults.insertId, newChildId], (updateErr) => {
                                    if (updateErr) {
                                        console.error('Error linking child to parent:', updateErr);
                                        return res.status(500).json({ 
                                            error: false, 
                                            data: results, 
                                            msg: message, 
                                            warning: "Child added but parent link failed" 
                                        });
                                    }
                                    
                                    return res.json({ 
                                        error: false, 
                                        data: results, 
                                        msg: message 
                                    });
                                });
                            });
                        }
                    });
                } else {
                    return res.json({ 
                        error: false, 
                        data: results, 
                        msg: message 
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error adding child:', error);
        return res.status(500).json({ error: true, message: error.message });
    }
});
// Update child
app.put('/editChild', async (req, res) => {
    try {
        console.log(req.body);
        // ปรับปรุงให้รองรับทั้ง birthdate และ birthday
        const birthdate = req.body.birthdate || req.body.birthday;

        let sql = 'UPDATE child.CHILDREN SET name = ?, birthday = ?, gender = ?, parent_id = ? WHERE child_ID = ?';
        let values = [
            req.body.name,
            birthdate,
            req.body.gender,
            req.body.parent_id,
            req.body.child_ID
        ];
        let message = "Cannot Edit";

        db.query(sql, values, function(err, results, fields) {
            if (err) {
                return res.status(500).json({ error: true, message: err.message });
            }
            if (results) { message = "Updated"; }
            res.json({ error: false, data: results, msg: message });
        });
    } catch (error) {
        console.error('Error updating child:', error);
        res.status(500).json({ error: true, message: error.message });
    }
});

// Delete child
app.delete('/deleteChild', async (req, res) => {
    try {
        console.log(req.body);
        let sql = 'DELETE FROM child.CHILDREN WHERE child_ID = ?';
        let values = [req.body.child_ID];
        console.log(values);
        let message = "Cannot Delete";
        db.query(sql, values, function(err, results, fields) {
            if (err) {
                return res.status(500).json({ error: true, message: err.message });
            }
            if (results) { message = "Deleted"; }
            res.json({ error: false, data: results, msg: message });
        });
    } catch (error) {
        console.error('Error deleting child:', error);
        res.status(500).json({ error: true, message: error.message });
    }
});

// ============= GROWTH RECORDS ENDPOINTS =============

// Get all growth records
app.get('/getGrowthRecords/', (req, res) => {
    let sql = 'SELECT * FROM child.GROWTH_RECORDS';
    db.query(sql, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get growth record by child ID
app.get('/getGrowthRecordsByChild/:id', (req, res) => {
    let childId = req.params.id;
    let sql = 'SELECT * FROM child.GROWTH_RECORDS WHERE child_id = ? ORDER BY assessment_date DESC';
    db.query(sql, [childId], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Add new growth record
app.post('/addGrowthRecord', (req, res) => {
    console.log(req.body);
    let sql = 'INSERT INTO child.GROWTH_RECORDS(child_id, weight, height, note, assessment_date) VALUES (?, ?, ?, ?, ?)';
    let values = [
        req.body.child_id,
        req.body.weight,
        req.body.height,
        req.body.note || null,
        req.body.assessment_date || new Date().toISOString().slice(0, 10)
    ];
    let message = "Cannot Insert";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Inserted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Update growth record
app.put('/editGrowthRecord', (req, res) => {
    console.log(req.body);
    let sql = 'UPDATE child.GROWTH_RECORDS SET child_id = ?, weight = ?, height = ?, note = ?, assessment_date = ? WHERE record_id = ?';
    let values = [
        req.body.child_id,
        req.body.weight,
        req.body.height,
        req.body.note || null,
        req.body.assessment_date,
        req.body.record_id
    ];
    let message = "Cannot Edit";

    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Updated"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Delete growth record
app.delete('/deleteGrowthRecord', (req, res) => {
    console.log(req.body);
    let sql = 'DELETE FROM child.GROWTH_RECORDS WHERE record_id = ?';
    let values = [req.body.record_id];
    console.log(values);
    let message = "Cannot Delete";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Deleted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// ============= USER ENDPOINTS =============

// Get all users
app.get('/getUsers/', (req, res) => {
    let sql = 'SELECT * FROM child.USERS';
    db.query(sql, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get user by ID
app.get('/getUser/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM child.USERS WHERE user_ID = ?';
    db.query(sql, [id], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Add new user
app.post('/addUser', (req, res) => {
    console.log(req.body);
    let sql = 'INSERT INTO child.USERS(name, gmail, password, phone, role) VALUES (?, ?, ?, ?, ?)';
    let values = [
        req.body.name,
        req.body.gmail,
        req.body.password,
        req.body.phone,
        req.body.role || 'parent'
    ];
    let message = "Cannot Insert";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Inserted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Update user
app.put('/editUser', (req, res) => {
    console.log(req.body);
    let sql = 'UPDATE child.USERS SET name = ?, gmail = ?, phone = ?, role = ? WHERE user_ID = ?';
    let values = [
        req.body.name,
        req.body.gmail,
        req.body.phone,
        req.body.role,
        req.body.user_ID
    ];
    
    // If password is provided, update it as well
    if (req.body.password) {
        sql = 'UPDATE child.USERS SET name = ?, gmail = ?, password = ?, phone = ?, role = ? WHERE user_ID = ?';
        values = [
            req.body.name,
            req.body.gmail,
            req.body.password,
            req.body.phone,
            req.body.role,
            req.body.user_ID
        ];
    }
    
    let message = "Cannot Edit";

    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Updated"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Delete user
app.delete('/deleteUser', (req, res) => {
    console.log(req.body);
    let sql = 'DELETE FROM child.USERS WHERE user_ID = ?';
    let values = [req.body.user_ID];
    console.log(values);
    let message = "Cannot Delete";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Deleted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// ============= VACCINATIONS ENDPOINTS =============

// Get all vaccinations
app.get('/getVaccinations/', (req, res) => {
    let sql = 'SELECT * FROM child.VACCINATIONS';
    db.query(sql, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get vaccination by ID
app.get('/getVaccination/:id', (req, res) => {
    let id = req.params.id;
    let sql = 'SELECT * FROM child.VACCINATIONS WHERE vaccination_id = ?';
    db.query(sql, [id], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Get vaccinations by child ID
app.get('/getVaccinationsByChild/:id', (req, res) => {
    let childId = req.params.id;
    let sql = 'SELECT * FROM child.VACCINATIONS WHERE child_id = ? ORDER BY vaccination_date DESC';
    db.query(sql, [childId], function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        res.json(results);
    });
});

// Add new vaccination
app.post('/addVaccination', (req, res) => {
    console.log(req.body);
    let sql = 'INSERT INTO child.VACCINATIONS(child_id, vaccine_name, vaccination_date) VALUES (?, ?, ?)';
    let values = [
        req.body.child_id,
        req.body.vaccine_name,
        req.body.vaccination_date || new Date().toISOString().slice(0, 10)
    ];
    let message = "Cannot Insert";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Inserted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Update vaccination
app.put('/editVaccination', (req, res) => {
    console.log(req.body);
    let sql = 'UPDATE child.VACCINATIONS SET child_id = ?, vaccine_name = ?, vaccination_date = ? WHERE vaccination_id = ?';
    let values = [
        req.body.child_id,
        req.body.vaccine_name,
        req.body.vaccination_date,
        req.body.vaccination_id
    ];
    let message = "Cannot Edit";

    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Updated"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// Delete vaccination
app.delete('/deleteVaccination', (req, res) => {
    console.log(req.body);
    let sql = 'DELETE FROM child.VACCINATIONS WHERE vaccination_id = ?';
    let values = [req.body.vaccination_id];
    console.log(values);
    let message = "Cannot Delete";
    db.query(sql, values, function(err, results, fields) {
        if (err) {
            return res.json({ error: true, message: err.message });
        }
        if (results) { message = "Deleted"; }
        res.json({ error: false, data: results, msg: message });
    });
});

// เริ่มเซิร์ฟเวอร์
// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
    console.log(`เข้าใช้งานได้ที่ http://localhost:3000`);
});
// จัดการ 404 errors สำหรับเส้นทางที่ไม่มี
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "ไม่พบเส้นทางที่ร้องขอ"
    });
});

// จัดการ global errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;