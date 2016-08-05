use be_development;
drop table users;
create table users(
	userId SERIAL NOT NULL,
    firstName varchar(32) NOT NULL,
    lastName varchar(32) NOT NULL,
    username varchar(32) UNIQUE NOT NULL,
    encPass varchar(32) NOT NULL,
    email varchar(64),
    primary key (userId)
);

CREATE INDEX user_idx_id ON users(userId);

-- Test Data
/*
insert into users 
(firstName, lastName, username, encPass, email)
values
("Adam","Jackman","ajackman","password","adamjackmandevelopmen@gmail.com")
;
insert into users 
(firstName, lastName, username, encPass, email)
values
("Darren","Pepper","dpepper","password2","dpepper@gmail.com")
;
insert into users 
(firstName, lastName, username, encPass, email)
values
("Sam","Pourcyrous","spourcyrous","password3","spourcyrous@gmail.com")
;
insert into users 
(firstName, lastName, username, encPass, email)
values
("Justin","Bell","jbell","password4","jbell@gmail.com")
;
insert into users 
(firstName, lastName, username, encPass, email)
values
("Billal","Aoumer","baoumer","password5","baoumer@gmail.com")
;
*/
