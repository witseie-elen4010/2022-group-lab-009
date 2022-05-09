
# ADR 1: Match making queue system

## Context

Wordle too is a multiplayer version of wordle. It is unrealistic to expect that players will always have organized parties to play the game in. Thus a queue system will need to be developed so that people can find other players who are also looking to player a game of wordle too.

## Decision 

We will make a system that will allow people to queue into both types of game mode. Players will enter a name and then will be added to the pool of queued players. Though since we only have access to one shard of azure. The queue system will only allow one queue and game to occur at once. Thus so we can utlize the singluar shard of azure we were given. Secondly since we only have access to one shard and thus only one game can be played at a time. If a any player disconnects during the game, the game lobby will close so that other players can play the game too without waiting for an incomplete game to finish. This system will feature "DRM", thus players will have to be constantly connected to the server in order to player the game, else they get disconnected and the game they were play will be shutdown


## Status

ACCEPTED

## Consequences 

Pros: 

- Queue system will be easier to implement with only a single queue and game.
- The team will not have to purchase any additonal service develiery from Azure.
- Player will be able to find games even if they do not have friends to playe with.
- Players will be able to choose which game mode they want to queue for.

Cons:

- Only one game of wordle can happend at a time, other players wanting to play will have to wait until the game is finished.
- If one player leaves the game will close, allowing players to grief each other during the game.
- DRM might affect players with slow or inconsisent internet connections


