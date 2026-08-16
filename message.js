require('dotenv').config();
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const Groq = require('groq-sdk');
const { logToSheet } = require('./log-to-sheet');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateMessage(instructor) {
    const prompt = `Write a short, casual outreach message (3-4 sentences max, no subject line, no "Dear X" or "Best regards" formalities) inviting ${instructor.name} to teach a ${instructor.subject} course on Zelaki Learn, an Ethiopian e-learning platform. Mention their background naturally: ${instructor.profile_note}. This will be sent as a LinkedIn message, so keep it conversational and under 80 words.`;

    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
    });

    return completion.choices[0].message.content;
}

async function main() {
    const csvContent = fs.readFileSync('instructors.csv', 'utf-8');
    const instructors = parse(csvContent, { columns: true });

    const results = [];
    for (const instructor of instructors) {
        console.log(`Generating message for ${instructor.name}...`);
        const message = await generateMessage(instructor);
        results.push({ ...instructor, message, status: 'draft_generated' });
        await logToSheet(results);
    }

    fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
    console.log('Done! Check output.json');
}

main();