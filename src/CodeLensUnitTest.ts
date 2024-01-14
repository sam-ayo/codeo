import * as vscode from 'vscode';

class TestCodeLens implements vscode.CodeLensProvider {
	private functionExpressions: { [key: string]: RegExp } = {
		'typescript': /function\s+(\w+)\s*\(/g,
		'javascript': /function\s+(\w+)\s*\(/g,
		'java': /public\s+[\w<>\[\]]+\s+(\w+)\s*\(/g,
		'c#': /public\s+[\w<>\[\]]+\s+(\w+)\s*\(/g,
		'python': /def\s+(\w+)\s*\(/g,
		'ruby': /def\s+(\w+)/g,
		'php': /function\s+(\w+)\s*\(/g,
		'c++': /\b[\w<>\[\]]+\s+(\w+)\s*\(/g,
		'go': /func\s+(\w+)\s*\(/g,
		'swift': /func\s+(\w+)\s*\(/g,
		'kotlin': /fun\s+[\w<>\[\]]+\s+(\w+)\s*\(/g,
		'rust': /fn\s+(\w+)\s*\(/g
	};
	
	public getFunctionEndIndex(startIndex: number, text: string): number{
		let i = startIndex;
		let paranthesesCount = 0;
		let inFunctionBody = false;
		while(i < text.length){
			if(text[i] === '{') {
				paranthesesCount++;
				inFunctionBody = true;
			}else if(text[i] === '}') {
				paranthesesCount --;
			}
			if(inFunctionBody && paranthesesCount === 0){
				return i + 1;
			}
			i++;
		}
		return startIndex;
	}

	public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken):
	vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
	const codeLenses = [];
	const expression = this.functionExpressions[document.languageId];
	const regex = new RegExp(expression, 'g');
	const text = document.getText();
	let matches;
	while ((matches = regex.exec(text)) !== null) {
		const start = document.positionAt(matches.index);
		const endIndex = this.getFunctionEndIndex(matches.index, text);
		let end = document.positionAt(endIndex);
		const range = new vscode.Range(start, end);
		if (range) {
			const functionText = document.getText(range);
			const c: vscode.Command = {
				title: "🧪 Generate Unit Tests",
				tooltip: "Generate Unit Tests for this function using AI",
				command: "alltestgen.alltestgen",
				arguments: [functionText, document.languageId] // Pass the function text to the command
			};
			codeLenses.push(new vscode.CodeLens(range, c));
		}
	}
	return codeLenses;
}

	public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
		return codeLens;
	}
}

export { TestCodeLens };