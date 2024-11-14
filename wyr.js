export async function handler(m, { conn, text, usedPrefix }) {
  // Check if the command starts with the bot prefix and 'wyr'
  if (!text.startsWith(`${usedPrefix}wyr`)) return;

  // Example "Would You Rather" questions and options
  const wyrQuestions = [
    { question: "Would you rather have the ability to fly or be invisible?", options: ["Fly", "Invisible"] },
    { question: "Would you rather always be 10 minutes late or 20 minutes early?", options: ["10 minutes late", "20 minutes early"] },
    { question: "Would you rather have unlimited pizza or unlimited tacos?", options: ["Pizza", "Tacos"] },
    { question: "Would you rather be able to speak every language in the world or communicate with animals?", options: ["Speak every language", "Communicate with animals"] },
    { question: "Would you rather live in space or underwater?", options: ["Space", "Underwater"] },
    // Add more questions as needed
  ];

  // Select a random question
  const randomQuestion = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];

  // Shuffle the options
  const shuffledOptions = randomQuestion.options.sort(() => Math.random() - 0.5);

  // Send the poll
  try {
    await conn.sendMessage(m.chat, {
      text: randomQuestion.question,
      footer: "Choose wisely!",
      buttons: [
        { buttonId: `${usedPrefix}answer ${shuffledOptions[0]}`, buttonText: { displayText: shuffledOptions[0] }, type: 1 },
        { buttonId: `${usedPrefix}answer ${shuffledOptions[1]}`, buttonText: { displayText: shuffledOptions[1] }, type: 1 },
      ],
      headerType: 1
    });
  } catch (e) {
    console.error("Error sending Would You Rather poll:", e);
  }
}

// Command settings
export const disabled = false;
export const trigger = ['wyr']; // Trigger command for Would You Rather polls
