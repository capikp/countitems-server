var connection = require('./connection');
var ObjectID = require('mongodb').ObjectID;

function MethodsDB() {
    
    // Select all items
    this.selectAllItems = function(response) {

        connection.getDbConnection(function(er, cn) { 
           var db = cn.db('count-itemsdb'); 
            db.collection('items').find({}).toArray(function(err,docs){
                if(err){
                    response.send(err);
                } else {
                    response.send(JSON.stringify(docs));
                }
                
            })
        })
    }

    // Select item
    this.selectItem = function(_id, response) {
        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');

            db.collection('items').find({_id: ObjectID(_id)}).toArray(function(err, doc){
                if(err){
                    response.send ({ status: 'Error select item' });
                } else {
                    response.send(JSON.stringify(doc));
                    console.log(JSON.stringify(doc));
                }
            });
        });
    }

    // Add new item
    this.addItem = function(data, response){
        
        // Add image by default
        var image = '/images/img/blue.png';
        var dataComplete = { name: data.name, count: data.count, image_url: image };


        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb'); 
            db.collection('items').save(dataComplete, function(err, docs){
                if(err){
                    response.send ({ status: 'Error add item' });
                } else {
                    response.send({ status: 'Ok add item' }); 
                }
            })
        })
    }

    
    // Update item
    this.updateItem = function(_id, data, response) {

        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');

            db.collection('items').findOneAndUpdate({_id: ObjectID(_id)}, {
                $set: {
                    name: data.name,
                    count: data.count
                }
            }, {
                sort: {_id: -1},
                upsert: true
            }, function(err, docs){
                if(err){
                    response.send ({ status: 'Error update data' });
                } else {
                    response.send ({ status: 'Ok update data' });
                }
            })
        })
    }

    // Increase item in 1
    this.increaseItem = function(data, response) {

        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');

            db.collection('items').findOne({_id: ObjectID(data._id)}, function(err, doc){
                if(err){
                    response.send ({ status: 'Error increase item' });
                } else {         
                    var countIncrease = ++doc.count;
                    db.collection('items').findOneAndUpdate({_id: ObjectID(doc._id)}, {
                        $set: {
                            count: countIncrease
                        }
                    }, {
                        sort: {_id: -1}
                    }, function(err, docs){
                        if(err){
                            response.send ({ status: 'Error increase item' });
                        } else {
                            response.send ({ status: 'Ok increase item' });
                        }
                    });
                }
            });


        });
    }

    // Decrease item in 1
    this.decreaseItem = function(data, response) {

        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');

            db.collection('items').findOne({_id: ObjectID(data._id)}, function(err, doc){
                if(err){
                    response.send ({ status: 'Error decrease item' });
                } else {

                    var countDecrease = --doc.count;

                    db.collection('items').findOneAndUpdate({_id: ObjectID(doc._id)}, {
                        $set: {
                            count: countDecrease
                        }
                    }, {
                        sort: {_id: -1}
                    }, function(err, docs){
                        if(err){
                            response.send ({ status: 'Error decrease item' });
                        } else {
                            response.send ({ status: 'Ok decrease item' });
                        }
                    });
                }
            });


        });
    }

    // Delete item
    this.deleteItem = function(_id, response) {

        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');
            db.collection('items').findOneAndDelete({_id: ObjectID(_id)}, function(err, docs){
                if(err){
                    response.send ({ status: 'Error delete item' });
                } else {
                    response.send ({ status: 'Ok delete item' });
                }
            })
        })
    }

    // Upload File (Image)
    this.uploadImage = function(_id, data, response){

        var url_image = '/images/uploads/';
        var image_url =  url_image + data.filename;
    
        connection.getDbConnection(function(er,cn){
            var db = cn.db('count-itemsdb');

            db.collection('items').findOneAndUpdate({_id: ObjectID(_id)}, {
                $set: {
                    image_url: image_url
                }
            }, {
                sort: {_id: -1},
                upsert: true
            }, function(err, docs){
                if(err){
                    response.send ({ status: 'Error upload image' });
                } else {
                    response.send ({ status: 'Ok upload image' });
                }
            })
        })
    }



}

module.exports = new MethodsDB();