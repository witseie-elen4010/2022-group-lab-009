
# ADR 3: Action and Match Log Views

## Context

Log access was a requirement in the brief, there must be an option to access a log that records the player actions. That should include the actions made, by whom, date etc.

## Decision 

Adding a button in the main page and allow people to view the log is done for simplicity. The logs contains only log information such as the player name and guess word and time dates. There is no player id or other details that are displayed for security purpose.

This is achieced by joining the tables together and display only the relavent data.


## Status

ACCEPTED

## Consequences 

Pros: 

- Simple access.
- Clear view - relavent data only to not cause confusion.
- Uses persistant data storage.
- Does not put load in other parts of the application.
- Data is stored once actions are made, but does not effect the performance of other functions.

Cons:

- Slit delay due to slow database service.
- No addition functions.
- Not individual to players.


