 function GenerateUniqueHash(playerName){
    //set variable hash as 0
    let hash = 0;
    // if the length of the string is 0, return 0
    if (playerName.length == 0) return hash;
    for (i = 0 ;i<playerName.length ; i++)
    {
    ch = playerName.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
    }
    console.log("Unique Player ID: " + hash)
    return hash;
}

module.exports = {GenerateUniqueHash};