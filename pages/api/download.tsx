// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	return new Promise<void>((resolve, reject) => {
		const app = initializeApp({
			apiKey: process.env.API_KEY,
			authDomain: "scans-3ddfc.firebaseapp.com",
			projectId: "scans-3ddfc",
			storageBucket: "scans-3ddfc.appspot.com",
			messagingSenderId: "896495032329",
			appId: "1:896495032329:web:1fedc96a82a623124940d8",
			measurementId: "G-09EJ54SYZG",
			databaseURL: "https://scans-3ddfc-default-rtdb.europe-west1.firebasedatabase.app/"
		});
	
		const db = getDatabase(app);
	
		const email = req.query.email as string;
		if (!email) {
			res.status(400).send("Please provide an email address");
			return {};
		}
	
		get(child(ref(db), `users/${email.replace(".", "_")}`)).then((result) => {
			if (result.exists()) {
				res.status(200).send(JSON.stringify(result.val(), null, 2));
				resolve();
			} else {
				res.status(404).send("No user found with that email address");
				reject();
			}
		});
	});
}
