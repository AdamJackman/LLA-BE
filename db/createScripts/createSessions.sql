use be_development;
drop table sessions;
create table sessions(
	sessionId SERIAL NOT NULL,  
    userId bigint unsigned NOT NULL,
    visited_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    primary key (sessionId),
    foreign key (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE INDEX ses_idx_id ON sessions(sessionId);
CREATE INDEX ses_vis_on ON sessions(visited_on);
	