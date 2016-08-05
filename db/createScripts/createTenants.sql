use be_development;
drop table tenants;
create table tenants(
	tenantId SERIAL NOT NULL,  
    propertyId bigint unsigned NOT NULL,
    firstName varchar(32) NOT NULL,
    lastName varchar(32) NOT NULL,
    contactNumber varchar(32) NOT NULL,
    contactEmail varchar(32) NOT NULL,
    primary key (tenantId),
    foreign key (propertyId) REFERENCES properties(propertyId) ON DELETE CASCADE
);

CREATE INDEX tnt_idx_id ON tenants(tenantId);


-- Test Data
/*
insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(1, "Adam","Jackman","9027898447","ajackman@gmail.com",
 "YES", 0, 650.00)
;

insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(1, "Christine","DeSilva","1112223333","cdesilva@gmail.com",
 "YES", 0, 550.00)
;

insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(1, "Bernice","Au","1112224444","bau@gmail.com",
 "NO", 650.00, 650.00)
;

insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(2, "Lourdes","Santos","3332221111","lsantos@gmail.com",
 "NO", 0, 800.00)
;

insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(3, "Elizabeth","Chim","1122334444","lchim@gmail.com",
 "NO", 700.00, 350.00)
;

insert into tenants 
(propertyId, firstName, lastName, contactNumber, contactEmail, 
 rentPaid, rentBehind, rentCost)
values
(3, "Leyla","Nouch","4445556666","lnouch@gmail.com",
 "YES", 0, 100.00)
;
*/
