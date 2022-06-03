
# ADR 4: Requeue System

## Context

The initial requeue implementation was acceptable, however the team wanted to improve the functionality by directly loading into the queue after a game was completed. The difficulty of implementing this was underestimated and thus the updated system was marked as depreciated. The intial system remains and the game is still functional. 

## Decision 

The use of the initial requeue system as the final requeue system. 
The marking of the attempt at a new requeue system as depreciated due to complexity and time constraints. 


## Status

ACCEPTED

## Consequences 

Pros: 

- Utilization of a functional requeue system
- Allows user to select game mode immediately 
- Allows user to log in to another account immediately

Cons:

- Load onto log in page and not the queue  
- Depreciation of new work 
- Sub-Optimal user experience


