"use strict";

var Ajv = require("ajv");
var ajv = new Ajv({v5: true});
var yaml = require("yamljs");
var fs = require("fs");

var systemSchema = loadSchemaFile("systemSchema");
var battlersSchema = loadSchemaFile("battlersSchema");
var movesSchema = loadSchemaFile("movesSchema");
var effectsSchema = loadSchemaFile("effectsSchema");
var gameSchema = loadSchemaFile("gameSchema");

var systemValidator = ajv.compile(systemSchema);
var battlerValidator = ajv.compile(battlersSchema);
var moveValidator = ajv.compile(movesSchema);
var effectsValidator = ajv.compile(effectsSchema);
var gameValidator = ajv.compile(gameSchema);

var testSystem = loadExampleFile("systemExample");
var testMoves =  loadExampleFile("movesExample");
var testBattlers = loadExampleFile("battlersExample");
var testEffects = loadExampleFile("effectsExample");
var testGame = Object.assign({}, testSystem, testMoves, testBattlers, testEffects);

var blankMoves = {"moves": {}};
var blankBattler = {"battlers": {}};
var blankEffects = {"effects": {}};

console.log(validateGameFile(testGame));

function validateGameFile(gameObject)
{
    if (gameValidator(gameObject))
    {
        gameObject.referenceArrays = generateReferenceArrays(gameObject);
        
        let results = gameValidator(battlers);
        
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
        return gameValidator.errors;
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

function generateReferenceArrays(gameObject)
{
    var refArrayObject = {};
    
    var refArrayList = ["abilities", "damageFormulas", "damageMods", "delayedEffects", "elements",
                        "irregularBaseStats", "matchupTypes", "moves", "moveStats", "regularBaseStats",
                        "specialMods", "stageMods", "touchableStats", "uniqueKeys", "untouchableBaseStats"];
    
    for (let i = 0; i < refArrayList.length; i++)
    {
        refArraysObject[refArrayList[i]] = fetchReference(refArrayList[i]);
    }
    
    return referenceArrayObject;
    
    function fetch(fetchTarget)
    {
        const permStats = gameObject.system.battlerStats.permanentStats;
        
        let keysArray = [];
        
        switch (fetchTarget)
        {
            case "regularStats":
                if(permStats.regularStats)
                {
                    return Object.keys(permStats.regularStats.regularStatList);
                }
                break;
            case "irregularStats":
            case "untouchableStats":
            case "statTilts":
                if (permStats[fetchTarget])
                {
                    return Object.keys(permStats[fetchTarget]);
                }
                break;
            case "transitoryStats":
                if(gameObject.system.battlerStats.transitoryStats)
                {
                    return Object.keys(gameObject.system.battlerStats.transitoryStats);
                }
                break;
            case "moveStats":
                if(gameObject.system.moveStats)
                {
                    return Object.keys(gameObject.system.moveStats);
                }
                break;
            case "successFormulas":
            case "damageFormulas":
                if (gameObject.system[fetchTarget].formulaList)
                {
                    return Object.keys(gameObject.system[fetchTarget].formulaList);
                }
                break;
            case "stageMods":
            case "specialMods":
                if (gameObject.system.mods)
                {
                    if(gameObject.system.mods.statMods)
                    {
                        if(gameObject.system.mods.statMods[fetchTarget])
                        {
                            return Object.keys(gameObject.system.mods.statMods[fetchTarget][fetchTarget.slice(0, -1)+"List"]);
                        }
                        break;
                    }
                    break;
                }
                break;
            case "damageMods":
                if (gameObject.system.mods)
                {
                    if (gameObject.system.mods.damageMods)
                    {
                        return Object.keys(gameObject.system.mods.damageMods);
                    }
                    break;
                }
                break;
            case "elements":
                if (gameObject.system.elements)
                {
                    return Object.keys(gameObject.system.elements.elementList);
                }
                break;
            case "matchupTypes":
                if (gameObject.system.elements)
                {
                    if(gameObject.system.elements.matchupTypes)
                    {
                        return Object.keys(gameObject.system.elements.matchupTypes);
                    }
                    break;
                }
                break;
            case "regularBaseStats":
                if(permStats.regularStats)
                {
                    if(permStats.regularStats.statComponents.baseValues)
                    {
                        keysArray = keysArray.concat(fetch("regularStats"));
                        return keysArray;
                    }
                    break;
                }
                break;
            case "irregularBaseStats":
                for(let stat in permStats.irregularStats)
                {
                    if (permStats.irregularStats[stat].statComponents)
                    {
                        if(permStats.irregularStats[stat].statComponents.baseValues)
                        {
                            keysArray.push(stat);
                        }
                    }
                }
                return keysArray;
            case "untouchableBaseStats":
                for(let stat in permStats.untouchableStats)
                {
                    if (permStats.untouchableStats[stat].statComponents)
                    {
                        if(permStats.untouchableStats[stat].statComponents.baseValues)
                        {
                            keysArray.push(stat);
                        }
                    }
                }
                return keysArray;
            case "moves":
                if(gameObject.moves.movesList)
                {
                    return Object.keys(gameObject.moves.movesList);
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
                throw "Validator function \"fetch\" trying to fetch something that doesn't exist!";
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