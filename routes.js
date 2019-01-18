var db = require('./queries');
var fs = require('fs');

// Function to obtain the current date and time 
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "-" + hour + "-" + min + "-" + sec;

}

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/')
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname + '_' + getDateTime() + '.jpg';
        cb(null, fileName)
    }
});

var upload = multer({ storage: storage });


function http() {
    
    this.configurar = function(app) {

        /** ROUTES */

        // Get all items
        app.get('/', function(request, response) {
            db.selectAllItems(response); 
        });

        // Get item
        app.get('/:id', function(request, response) {
            db.selectItem(request.params.id, response); 
        });

        // Add new item
        app.post('/', function(request, response) {
            db.addItem(request.body, response); 
        });

        // Update item
        app.put('/update/:id', function(request, response){
            db.updateItem(request.params.id, request.body, response);
        });

        // Delete item
        app.delete('/:id', function(request, response){
            
            var path = './public/images/uploads/';
            var regExId = RegExp(request.params.id); 
            
            fs.readdirSync(path).forEach(function(item){
                if(regExId.test(item)){ 
                        var filePath = path + item;
                        fs.unlinkSync(filePath);
                }
            });

            db.deleteItem(request.params.id, response);
        });

        // Increase item in 1
        app.put('/increase', function(request, response){
            db.increaseItem(request.body, response);
        });

        // Decrease item in 1
        app.put('/decrease', function(request, response){
            db.decreaseItem(request.body, response);
        });

        // Upload File (Image)
        app.post('/upload/:id', upload.single('file'), function(req, res) {

            var path = './public/images/uploads/';
            var regExId = RegExp(req.params.id); 

            fs.readdirSync(path).forEach(function(item){
                if(regExId.test(item)){ 
                    if(req.file.filename != item){ 
                        var filePath = path + item;
                        fs.unlinkSync(filePath);
                    }
                }
            });

            db.uploadImage(req.params.id, req.file, res); 
        });


    }
}

module.exports = new http();