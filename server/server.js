var express = require('express'),
    path = require('path'),
    http = require('http'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    employees = require('./routes/employees'),
    app = express();

//Configure app (express instance)
app.set('port', process.env.PORT || 5000);
app.use(bodyParser());// pull information from html in POST
app.use(methodOverride());      // simulate DELETE and PUT
app.use(express.static(path.resolve(__dirname, '../workshop_angular_ionic_contact_picker/www')));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    return next();
});

app.get('/sync', employees.sync);
app.get('/employees', employees.findAll);
app.get('/employees/:id', employees.findById);
app.post('/employees', employees.addEmployee );
app.delete('/employees/:id', employees.deleteEmployee);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});