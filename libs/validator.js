"use strict";

var Ajv = require("ajv");
var ajv = new Ajv({v5: true});
var yaml = require("yamljs");

var gameSchema = loadSchemaFile("gameSchema");
var gameValidator = ajv.compile(gameSchema);

var testGame = loadExampleFile("gameExample");

// Not sure if it's worth switching to immutible.js for three variables. Sticking with const for now
const blankMoves = {"moves": {}};
const blankBattler = {"battlers": {}};
const blankEffects = {"effects": {}};

console.log(validateGameFile(testGame));

function validateGameFile(gameObject)
{
    if (gameValidator(gameObject))
    {
        gameObject.gameProperties = generateGameProperties(gameObject);
        console.log(gameObject.gameProperties);
        gameObject.referenceArrays = generateReferenceArrays(gameObject);
        console.log(gameObject.referenceArrays);
        
        let results = gameValidator(gameObject);
        
        if(results)
        {
            return results;
        }
        else
        {
            console.log(gameValidator.errors);
            return results;
        }  
    }
    else
    {
        console.log(gameValidator.errors)
        return false;
    }
}

function validateSplitGameFile(systemObject, battlersObject, movesObject, effectsObject)
{
    let system = systemObject;
    let battlers = battlersObject;
    let moves = movesObject;
    let effects = effectsObject;
    
    if(!system)
    {
        throw "You can't validate anything without a system object!";
    }
    if(!battlers)
    {
        battlers = blankBattler;
    }
    if(!moves)
    {
        moves = blankMoves;
    }
    if(!effects)
    {
        effects = blankEffects;
    }
    
    validateGameFile(Object.assign({}, system, battlers, moves, effects));
}

function generateGameProperties(gameObject)
{
    var propertiesObject = {};
    const system = gameObject.system;
    const permStats = system.battlerStats.permanentStats;
    
    propertiesObject.hasRegularStats = permStats.regularStats ? true : false;
    propertiesObject.hasIrregularStats = permStats.irregularStats ? true : false;
    propertiesObject.hasStatTilts = permStats.statTilts ? true : false;
    propertiesObject.hasTransitoryStats = system.battlerStats.transitoryStats ? true : false;
    propertiesObject.hasMoveStats = system.moveStats ? true : false;
    propertiesObject.hasSuccessFormulas = system.successFormulas.formulaList ? true : false;
    propertiesObject.hasDamageFormulas = system.damageFormulas.formulaList ? true : false;
    propertiesObject.hasMods = system.mods ? true : false;
    propertiesObject.hasElements = system.elements ? true : false;
    
    if(propertiesObject.hasMods)
    {
        propertiesObject.hasStatMods = system.mods.statMods ? true : false;
        propertiesObject.hasDamageMods = system.mods.damageMods ? true : false;
    }
    else
    {
        propertiesObject.hasStatMods = false;
        propertiesObject.hasDamageMods = false;
    }
    
    if(propertiesObject.hasStatMods)
    {
        propertiesObject.hasStageMods = system.mods.statMods.stageMods ? true : false;
        propertiesObject.hasSpecialMods = system.mods.statMods.specialMods ? true : false;
    }
    else
    {
        propertiesObject.hasStageMods = false;
        propertiesObject.hasSpecialMods = false;
    }
    
    if(propertiesObject.hasElements)
    {
        propertiesObject.hasMatchupTypes = system.elements.matchupTypes ? true : false;
    }
    else
    {
        propertiesObject.hasMatchupTypes = false;
    }
    
    return propertiesObject;
}

function generateReferenceArrays(gameObject)
{
    var refArraysObject = {};
    
    var refArrayList = ["abilities", "damageFormulas", "damageMods", "delayedEffects", "elements",
                        "irregularBaseStats", "matchupTypes", "moves", "moveStats", "regularBaseStats",
                        "specialMods", "stageMods", "touchableStats", "uniqueNames", "untouchableBaseStats"];
    
    for (let i = 0; i < refArrayList.length; i++)
    {
        refArraysObject[refArrayList[i]] = fetch(refArrayList[i]);
    }
    
    return refArraysObject;
    
    function fetch(fetchTarget)
    {
        const system = gameObject.system;
        const gameProperties = gameObject.gameProperties;
        const permanentStats = system.battlerStats.permanentStats;
        
        let keysArray = [];
        
        switch (fetchTarget)
        {
            case "regularStats":
                if (gameProperties.hasRegularStats)
                {
                    return Object.keys(permanentStats.regularStats.regularStatList);
                }
                break;
            case "irregularStats":
                if (gameProperties.hasIrregularStats)
                {
                    return Object.keys(permanentStats.irregularStats);
                }
                break;
            case "untouchableStats":
                return Object.keys(permanentStats.untouchableStats);
            case "statTilts":
                if (gameProperties.hasStatTilts)
                {
                    return Object.keys(permanentStats[fetchTarget]);
                }
                break;
            case "transitoryStats":
                if(gameProperties.hasTransitoryStats)
                {
                    return Object.keys(system.battlerStats.transitoryStats);
                }
                break;
            case "moveStats":
                if(gameProperties.hasMoveStats)
                {
                    return Object.keys(system.moveStats);
                }
                break;
            case "successFormulas":
                if (gameProperties.hasSuccessFormulas)
                {
                    return Object.keys(system.successFormulas.formulaList);
                }
                break;
            case "damageFormulas":
                if (gameProperties.hasDamageFormulas)
                {
                    return Object.keys(system.damageFormulas.formulaList);
                }
                break;
            case "stageMods":
                if (gameProperties.hasStageMods)
                {
                    return Object.keys(system.mods.statMods.stageMods.stageModList);
                }
                break;
            case "specialMods":
                if(gameProperties.hasSpecialMods)
                {
                    return Object.keys(system.mods.statMods.specialMods.specialModList);
                }
                break;
            case "damageMods":
                if (gameProperties.hasDamageMods)
                {
                    return Object.keys(system.mods.damageMods);
                }
                break;
            case "elements":
                if (gameProperties.hasElements)
                {
                    return Object.keys(system.elements.elementList);
                }
                break;
            case "matchupTypes":
                if (gameProperties.hasMatchupTypes)
                {
                    return Object.keys(system.elements.matchupTypes);
                }
                break;
            case "regularBaseStats":
                if(gameProperties.hasRegularStats)
                {
                    if(permanentStats.regularStats.statComponents.baseValues)
                    {
                        keysArray = keysArray.concat(fetch("regularStats"));
                        return keysArray;
                    }
                    break;
                }
                break;
            case "irregularBaseStats":
                for(let stat in permanentStats.irregularStats)
                {
                    if (permanentStats.irregularStats[stat].statComponents)
                    {
                        if(permanentStats.irregularStats[stat].statComponents.baseValues)
                        {
                            keysArray.push(stat);
                        }
                    }
                }
                return keysArray;
            case "untouchableBaseStats":
                for(let stat in permanentStats.untouchableStats)
                {
                    if (stat != "lvl")
                    {
                        if(permanentStats.untouchableStats[stat].statComponents.baseValues)
                        {
                            keysArray.push(stat);
                        }
                    }
                }
                return keysArray;
            case "moves":
                if(gameObject.moves.moveList)
                {
                    return Object.keys(gameObject.moves.moveList);
                }
                break;
            case "battlers":
                if(gameObject.battlers.battlerList)
                {
                    return Object.keys(gameObject.battlers.battlerList);
                }
                break;
            case "abilities":
            case "battlefieldEffects":
            case "delayedEffects":
            case "equipment":
            case "items":
            case "statusEffects":
                if (gameObject.effects[fetchTarget])
                {
                    return Object.keys(gameObject.effects[fetchTarget]);
                }
                break;
            case "allBattlerStats":
                keysArray = keysArray.concat(fetch("touchableStats"));
                keysArray = keysArray.concat(fetch("untouchableStats"));
                return keysArray;
            case "touchableStats":
                keysArray = keysArray.concat(fetch("regularStats"));
                keysArray = keysArray.concat(fetch("irregularStats"));
                return keysArray;
            case "allStats":
                keysArray = keysArray.concat(fetch("allBattlerStats"));
                keysArray = keysArray.concat(fetch("transitoryStats"));
                keysArray = keysArray.concat(fetch("moveStats"));
                return keysArray;
            case "allFormulas":
                keysArray = keysArray.concat(fetch("successFormulas"));
                keysArray = keysArray.concat(fetch("damageFormulas"));
                return keysArray;
            case "allStatMods":
                keysArray = keysArray.concat(fetch("stageMods"));
                keysArray = keysArray.concat(fetch("specialMods"));
                return keysArray;
            case "allMods":
                keysArray = keysArray.concat(fetch("allStatMods"));
                keysArray = keysArray.concat(fetch("damageMods"));
                return keysArray;
            case "elementsAndMatchups":
                keysArray = keysArray.concat(fetch("elements"));
                keysArray = keysArray.concat(fetch("matchupTypes"));
                return keysArray;
            case "effects":
                keysArray = keysArray.concat(fetch("abilities"));
                keysArray = keysArray.concat(fetch("statusEffects"));
                keysArray = keysArray.concat(fetch("delayedEffects"));
                keysArray = keysArray.concat(fetch("battlefieldEffects"));
                keysArray = keysArray.concat(fetch("equipment"));
                keysArray = keysArray.concat(fetch("items"));
                return keysArray;
            case "uniqueNames":
                keysArray = keysArray.concat(fetch("allStats"));
                keysArray - keysArray.concat(fetch("statTilts"));
                keysArray = keysArray.concat(fetch("allFormulas"));
                keysArray = keysArray.concat(fetch("allMods"));
                keysArray = keysArray.concat(fetch("elementsAndMatchups"));
                keysArray = keysArray.concat(fetch("battlers"));
                keysArray = keysArray.concat(fetch("effects"));
                keysArray = keysArray.concat(fetch("moves"));
                return keysArray;
            default:
                throw "Validator function \"fetch\" trying to fetch something that doesn't exist: "+fetchTarget;
        }
        
        return keysArray;
    } 
}

function loadSchemaFile(schemaName) 
{
    try
    {
        return yaml.load("./yaml/schemas/"+schemaName+".yml");
    }
    catch(err)
    {
        console.log("Couldn't open "+schemaName+".yml! Terminating...")
        process.exit(1);
    }
}

function loadExampleFile(yamlFile)
{
    try
    {
        return yaml.load("./yaml/examples/"+yamlFile+".yml");
    }
    catch(err)
    {
        console.log("Couldn't open "+yamlFile+".yml! Terminating...")
        process.exit(1);
    }
}