import sys

battlersSchema = {
    "file": sys.path[0] + "/schemas/battlersSchema.yml", 
    "startString": "    battlers:\n", 
    "requiredString": "    - battlers\n"
}
movesSchema = {
    "file": sys.path[0] + "/schemas/movesSchema.yml", 
    "startString": "    moves:\n", 
    "requiredString": "    - moves\n"
}
effectsSchema = {
    "file": sys.path[0] + "/schemas/effectsSchema.yml", 
    "startString": "    effects:\n", 
    "requiredString": "    - effects\n"
}

schemas = [battlersSchema, movesSchema, effectsSchema]

endString = "    referenceArrays:\n"
definitionsString = "definitions:\n"

def main(args):

    if args == "updateSchemas":
        updateSchemas()
    elif args == "combineSchemas":
        combineSchemas()
    elif args == "combineExamples":
        combineExamples()
    else:
        print("Invalid Argument. Select from one of the following: combine, update")
        sys.exit(2)

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
if __name__ == "__main__":
    try:
        main(sys.argv[1]);
    except IndexError:
        print ("Missing argument.")
        sys.exit(2)