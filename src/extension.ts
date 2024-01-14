// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestCodeLens } from './CodeLensUnitTest';
import OpenAI from "openai";
import { appendFileSync, writeFile, writeFileSync } from 'fs';
import { error } from 'console';

const open_ai_key = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: open_ai_key });

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "alltestgen" is now active!');
	let disposable = vscode.commands.registerCommand('alltestgen.alltestgen', async (functionToTest: string, language: string) => {
		if (functionToTest !== undefined && language !== undefined) {

			const prompt = "Hello" +
				`I have a function written in ${language} for which I need comprehensive unit tests.` +
				"The function is as follow\n" +
				`"${functionToTest}". `;
			`Please generate detailed unit tests for these functions. ` +
				`The tests should cover all possible scenarios, including normal cases, edge cases, and potential error conditions. ` +
				`Make sure to include assertions for expected outcomes and document each test's purpose clearly. ` +
				`Please focus on accuracy and robustness to ensure that the tests are not only syntactically correct ` +
				`but also logically sound and relevant to the functions provided.`;

			const completion = await openai.chat.completions.create({
				model: "gpt-4",
				messages: [
					{ "role": "system", "content": "You are an helpful expert programmer that loves to help to write comprehensive and logically correct unit tests." },
					{ "role": "user", "content": `${prompt}` }
				],
				stream: true,
			});

			let answer = '';
			for await (const chunk of completion) {
				const data = chunk.choices[0].delta.content ?? '\n';
				answer += data;
			}
			console.log(answer);

			writeFile('response.txt', answer, (err) => {
				if(err) {
					console.log(err);
				}
				console.log('Saved!');
			});
			vscode.window.showInformationMessage('Hello World from AllTestGen!');
		}
	});


	let codeLens = vscode.languages.registerCodeLensProvider('*', new TestCodeLens());
	context.subscriptions.push(codeLens);
}

export function deactivate() { }
