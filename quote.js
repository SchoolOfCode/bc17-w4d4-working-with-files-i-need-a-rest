import * as fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

const fileName = "./quotes.json";

export async function getQuotes() {
  return new Promise( async (resolve) => {
		try {
			const data = await fs.readFile(fileName, 'utf-8');
			resolve(JSON.parse(data));
		} catch (error) {
			console.error(`Error reading or parsing ${fileName}:`, error);
			return null;
		}
	});
}

export async function addQuote(quoteText) {
	return new Promise( async (resolve) => {
		let allQuotes = await getQuotes();

		let newQuote = {
			id: uuidv4(),
			quoteText: quoteText
		}

		allQuotes.push(newQuote);

		try {
			await fs.writeFile(fileName, JSON.stringify(allQuotes), "utf-8");
		} catch (error) {
			console.error(`Error writing to ${fileName}:`, error);
			resolve(null)
		}

		resolve(newQuote);
	})
}

export async function getRandomQuote() {
	return new Promise( async (resolve) => {
		const  allQuotes = await getQuotes();

		if (allQuotes.length !== 0) {
			resolve(allQuotes[Math.floor(Math.random() * allQuotes.length)])
		} else {
			resolve(null)
		}
	})
}

export async function editQuote(id, quoteText) {
	return new Promise(async (resolve, reject) => {
		let allQuotes = await getQuotes();

		const quoteIndex = allQuotes.findIndex(el => el.id === id);

		if (quoteIndex === -1) return resolve(null);

		allQuotes[quoteIndex] = {
			id,
			quoteText
		}

		try {
			await fs.writeFile(fileName, JSON.stringify(allQuotes), "utf-8"); 
		} catch (error) {
			console.error(`ERROR: ${error}`)
			resolve(null)
		}

		resolve(allQuotes[quoteIndex]);
	})
}

export async function deleteQuote(id) {
	return new Promise( async (resolve) => {
		let allQuotes = await getQuotes();

		const quoteIndex = allQuotes.findIndex(el => el.id === id);

		if (quoteIndex === -1) return resolve(null);

		let removedQuote = allQuotes.splice(quoteIndex, 1).pop();
		
		try {
			await fs.writeFile(fileName, JSON.stringify(allQuotes), "utf-8");
		} catch (error) {
			console.error(`ERROR: ${error}`)
			resolve(null)
		}

		resolve(removedQuote);
	})
}