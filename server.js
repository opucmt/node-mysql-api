const express = require('express');
const app = express();
const connection = require('./config/db_connection');
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// create product

app.post('/product', (req, res) => {
    let { name, price, image } = req.body;

    let sql = `INSERT INTO product (name, price, image) VALUES ("${name}", "${price}", "${image}")`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.log(err);
        }
        
        res.json({
            success: true,
            insertId: result.insertId
        });
    });
})


// read products

app.get('/products', (req, res) => {
    connection.query("SELECT * FROM product", function (err, result, fields) {
        if (err) {
            return console.log(err);
        }
        
        res.json(result);
    });
})




// delete products

app.delete('/product/:id', (req, res) => {
    let sql = `DELETE FROM product WHERE id = '${req.params.id}'`;
    connection.query(sql, function (err, result) {
        if (err) {
            return console.log(err);
        }
      
      if(result.affectedRows) {
        res.json({
            success: true
        });
      }
    });
})




app.listen(4000, () => {
    console.log('server is running');
})