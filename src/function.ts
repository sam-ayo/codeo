
function getFunctionEndIndex(startIndex: number, text: string): number {
    let i = startIndex;
    let paranthesesCount = 0;
    let inFunctionBody = false;
    while (i < text.length) {
        if (text[i] === '{') {
            paranthesesCount++;
            inFunctionBody = true;
        } else if (text[i] === '}') {
            paranthesesCount--;
        }
        if (inFunctionBody && paranthesesCount === 0) {
            return i+1;
        }
        i++;
    }
    return startIndex;
}

export {getFunctionEndIndex};