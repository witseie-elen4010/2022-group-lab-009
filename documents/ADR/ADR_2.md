
# ADR 2: Database system

## Context

There will be large amounts of relevant data which requires a persistant data storage as stated in the brief. The brief stipulates that we are required to use SQL Server or MongoDB. 
There will be a need to store the larger data such as the word list, player logs, server actions etc in an appropriate db system.

## Decision 

The use of SQL Server for persistant data storage is recommended as it can be hosted via the Azure platform. This allows for the database and the game to be hosted via the same Azure account,
simplifying matters in terms of hosting. This allows the database management and game hosting to be done by the same platform. This implies the use of SQL and can be used to make relationships 
better in tables. 


## Status

ACCEPTED

## Consequences 

Pros: 

- Persistant data storage system
- The team will not have to purchase any additonal hosting service as Azure can be used.
- SQL can be used to develop the Database tables, the team has experience using this langauge.
- Important information can be stored online for all group members to use.

Cons:

- Need to connect remotely to the database server in order to access it.
- The database is hosted online and thus can be seen as an addtional cost.
- Poor connections can affect gameplay due to database connections failing.


