const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const checkLogin = require('../middlewares/checkLogin');

const ToDo = new mongoose.model('ToDo', todoSchema);

/* 
get all the todos
and used callback function
*/

router.get('/', checkLogin, (req, res) => {
  /*   
  ToDo.find({},(err,data)=>{
        if (err) {
            res.status(500).json({
              error: 'There was a server side error!',
            });
          } else {
            res.status(200).json({
                result:data,
              message: 'ToDos get succesfully',
            });
          }
    }) 
    
    */

  ToDo.find({})
    .select({
      _id: 0,
      date: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          error: 'There was a server side error!',
        });
      } else {
        res.status(200).json({
          result: data,
          message: 'ToDos get succesfully',
        });
      }
    });

  /*   try {
    const data = await ToDo.find({});
    res.status(200).json({
      result: data,
      message: 'Todo Was Update successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' });
  } */
});

/* 
get a todo by id
used async function
*/
router.get('/:id', async (req, res) => {
  try {
    const data = await ToDo.find({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: 'Todo Was Update successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' });
  }
});

/* 
post todo
used callbacked function
*/
router.post('/', (req, res) => {
  const newToDo = new ToDo(req.body);
  newToDo.save((err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        message: 'ToDo was inserted succesfully',
      });
    }
  });
});

/* 
post multiple todo
and used callback function
*/
router.post('/all', (req, res) => {
  ToDo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error!',
      });
    } else {
      res.status(200).json({
        message: 'ToDos were inserted succesfully',
      });
    }
  });
});

/* 
put todo
and used async await function
*/
router.put('/:id', async (req, res) => {
  try {
    await ToDo.updateOne(
      { _id: req.params.id },
      { $set: { status: 'inactive' } }
    );
    res.status(200).json({ message: 'Todo Was Update successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' });
  }
});

/* delete todo 
and used async await function
*/
router.delete('/:id', async (req, res) => {
  try {
    const data = await ToDo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: 'Todo Was deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: 'There was a Server Side Error!' });
  }
});

module.exports = router;
