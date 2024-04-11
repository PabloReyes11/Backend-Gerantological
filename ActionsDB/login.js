const connection = require('../SQL_CONECTION');

const CryptoJS = require('crypto-js');



//-----------------------------------------------------------loggin super usuario
function Autentication(req, res, Data) {
    const { Email, Password } = Data;
    //Obten el hash de Password
    const hash = CryptoJS.SHA256(Password).toString();
    //console.log(hash);
    connection.query('SELECT * FROM Users WHERE Email = ? AND Password = ?', [Email, hash], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length > 0) {
                console.log('Usuario logeado: '+results[0].Email);
                res.send(results[0]);
            } else {
                // Email does not exist in the Users table
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    });
}




//-----------------------------------------------------------loggin super usuario




module.exports = {
    Autentication
};
