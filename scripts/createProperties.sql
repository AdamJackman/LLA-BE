use be_development;
drop table properties;

create table properties(
	propertyId SERIAL NOT NULL,    
    userId BIGINT UNSIGNED NOT NULL,
    addr_line1 varchar(32) NOT NULL,
    addr_line2 varchar(32),
    country varchar(32) NOT NULL,
    state varchar(32) NOT NULL,
    city varchar(32) NOT NULL,	
    zip varchar(16) NOT NULL,
    phone varchar(32),
    primary key(propertyId),
	foreign key(userId) references users(userId) ON DELETE CASCADE
);

CREATE INDEX prop_idx_id ON properties(propertyId);

-- Test Data
/*

insert into properties 
(addr_line1, addr_line2, country, state, 
 city, zip, phone)
values
("1 test road", "", "Canada", "Ontario",
 "Toronto", "A1B2C3" , "1234567899")
;

insert into properties 
(addr_line1, addr_line2, country, state, 
 city, zip, phone)
values
("2 test road", "In Yo Basement", "Canada", "Ontario",
 "Toronto", "D4E5F6" , "9998887777")
;

insert into properties 
(addr_line1, addr_line2, country, state, 
 city, zip, phone)
values
("3 test road", "", "Canada", "Ontario",
 "Toronto", "A1A1A1" , "1234567891")
;

*/