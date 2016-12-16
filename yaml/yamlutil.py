import sys

battlersSchemaFile = sys.path[0] + "/schemas/battlersSchema.yml"
movesSchemaFile = sys.path[0] + "/schemas/movesSchema.yml"
effectsSchemaFile = sys.path[0] + "/schemas/effectsSchema.yml"

battlersStartString = "    battlers:\n"
movesStartString = "    moves:\n"
effectsStartString = "    effects:\n"

battlersRequiredString = "    - battlers\n"
movesRequiredString = "    - moves\n"
effectsRequiredString = "    - effects\n"

battlersSchema = {
    "file": battlersSchemaFile, 
    "startString": battlersStartString, 
    "requiredString": battlersRequiredString
}
movesSchema = {
    "file": movesSchemaFile, 
    "startString": movesStartString, 
    "requiredString": movesRequiredString
}
effectsSchema = {
    "file": effectsSchemaFile, 
    "startString": effectsStartString, 
    "requiredString": effectsRequiredString
}

schemas = [battlersSchema, movesSchema, effectsSchema]

endString = "    referenceArrays:\n"
definitionsString = "definitions:\n"

def main(args):

    if args == "combine":
        combineSchemas()
    elif args == "update":
        updateSchemas()
    else:
        print("Invalid Argument. Select from one of the following: combine, update")
        sys.exit(2)
        
def combineSchemas():

    fullText = ""
    
    with open(sys.path[0]+"/schemas/systemSchema.yml") as systemSchema:
        fullText = systemSchema.readlines()
        
    for schema in schemas:
        insertAt = getLineNumber(fullText, endString)
        fullText.insert(insertAt, getText(schema["file"], schema["startString"], endString))
        
        insertAt = getLineNumber(fullText, definitionsString) - 1
        fullText.insert(insertAt, schema["requiredString"])
    
    with open(sys.path[0]+"/schemas/gameSchema.yml", "w") as fullSchema:
        fullSchema.writelines(fullText)        

def getLineNumber(textList, line):
    for lineNumber, lineText in enumerate(textList):
        if (line == lineText):
            return lineNumber

def getText(fileName, startLine, endLine):
    with open(fileName) as file:
        result = ""
        foundStart = False
        for line in file:
            if foundStart:
                if (line == endLine):
                    break
                else:
                    result = result + line         
            elif not foundStart and line == startLine:
                foundStart = True
                result = result + line     
        return result

def updateSchemas():
    definitionText = ""
    with open(sys.path[0]+"/schemas/systemSchema.yml") as systemSchema:
        fullText = systemSchema.readlines()
        lineNumber = getLineNumber(fullText, "definitions:\n")
        definitionText = fullText[lineNumber:]
    
    for schema in schemas:
        modifiedText = ""
        with open(schema["file"]) as schemaFile:
            originalText = schemaFile.readlines()
            lineNumber = getLineNumber(originalText, "definitions:\n")
            modifiedText = originalText[0:lineNumber]
            modifiedText.extend(definitionText)
            
        with open(schema["file"], "w") as schemaFile:
            schemaFile.writelines(modifiedText)
if __name__ == "__main__":
    try:
        main(sys.argv[1]);
    except IndexError:
        print ("Missing argument.")
        sys.exit(2)