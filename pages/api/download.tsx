// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const app = initializeApp({
		apiKey: "AIzaSyCnU6DnmfHlZNoS9V41Agvq4FlEHlgJMeM",
		authDomain: "scans-3ddfc.firebaseapp.com",
		projectId: "scans-3ddfc",
		storageBucket: "scans-3ddfc.appspot.com",
		messagingSenderId: "896495032329",
		appId: "1:896495032329:web:1fedc96a82a623124940d8",
		measurementId: "G-09EJ54SYZG",
		databaseURL: "https://scans-3ddfc-default-rtdb.europe-west1.firebasedatabase.app/"
	});

	const db = getDatabase(app);

	const body = req.body;
	console.log(body);

	return {};
}
