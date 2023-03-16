
const db = require('../db');

function Controller(tableName) {
    this.create = async function(req, res) {
        const keys = Object.keys(req.body);
        const vals = Object.values(req.body);

        const valstring = keys.map( (val, i) => '$' + (i+1) ).join(',');
        const query = `INSERT INTO ${tableName} (${keys}) values (${valstring}) RETURNING *`;

        try {
            const newEntity = await db.query(query, vals);
            res.send(newEntity.rows[0]);
        } catch (err) {
            console.log(err);
        }

        res.send();
    }
    
    this.getAll = async function(req, res) {
        const qs = `SELECT movie.movie_id, movie_name, STRING_AGG(genre_name, ', ') as genres
                    FROM ${tableName}
                    LEFT JOIN genre
                    ON movie.movie_id = genre.movie_id
                    GROUP BY movie.movie_id;`

        const entities = await db.query(qs);
        res.send(entities.rows);
    }
    
    this.getBy = (id_name) => async function(req, res) {
        const id = req.params['id'];
        const qs = `SELECT movie.movie_id, movie_name, STRING_AGG(genre_name, ', ') as genres
                    FROM ${tableName}
                    LEFT JOIN genre
                    ON movie.movie_id = genre.movie_id
                    WHERE movie.${id_name} = $1
                    GROUP BY movie.movie_id;`
        
        const entities = await db.query(qs, [id]);
        res.send(entities.rows[0]);
    }
    
    this.updateBy = (id_name) => async function(req, res) {
        const id = req.params['id'];

        const keys = Object.keys(req.body);
        const vals = Object.values(req.body);

        const valstring = keys.map( (key, i) => `"${key}" = $${i+1}` ).join(', ');

        let qs = `UPDATE ${tableName} SET ${valstring} WHERE "${id_name}" = $${keys.length + 1} RETURNING *`;

        try {
            vals.push(id);
            const entity = await db.query(qs, vals);
            res.send(entity.rows[0]);
        } catch (err) {
            console.log(err);
        }

        res.send();
    }
    
    this.deleteBy = (id_name) => async function(req, res) {
        const id = req.params['id'];
        let qs = `DELETE from ${tableName} WHERE "${id_name}" = $1`;

        try {
            await db.query(qs, [id]);
        } catch (err) {
            console.log(err);
        }

        res.send();
    }
}

module.exports = new Controller('movie');