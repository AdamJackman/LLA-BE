var db = require('../db');

var UserStore = {
	getUser : function(params, success){
		const queryString = "select userId from users where username=? and encPass=?";	
		db.query(queryString, params, success);
	},
	addUser : function(params, success){
		const registerQueryString = "insert into users(firstName, lastName, username, encPass) values(?,?,?,?)";
		db.query(queryString, params, success);
	}
};
module.exports = UserStore;