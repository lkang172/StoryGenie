import express from "express";
import User from "./models/User.model.js";
import Books from "./models/Books.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

import { CohereClient } from "cohere-ai";

import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const cohere = new CohereClient({ token: process.env.COHERE_KEY });

console.log(cohere);

app.post("/api/signup", async (req, res) => {
  const { name, username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = new User({ name, username, password });

    await user.save();
    console.log("User saved successfully");
    res.status(200).json({ message: "User created successfully", username });
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(500).json("Invalid entry");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  console.log(existingUser);
  if (!existingUser) {
    return res.status(400).json({ message: "Please enter valid details" });
  }
  try {
    if (password == existingUser.password) {
      return res
        .status(200)
        .json({ message: "Logged In succesfully", username });
    } else {
      return res.status(400).json({ message: "Please enter valid details" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Entry" });
  }
});

app.post("/api/create", async (req, res) => {
  const { theme, characters, lessons } = req.body;
  try {
    const story = await generateStory(theme, lessons);
    const characters = await generateCharacters(story);
    // const scenes = await generateScenes(story);
    // const images = await generateImages(scenes);
    // const title = await generateTitle(story);
    return res.status(200).json({ message: { story } });
  } catch (error) {
    console.error("Error:", error);
  }
});

const generateStory = async (theme, lessons) => {
  const prompt = `You're a bot that's great at generating children's stories based on the theme and life lessons given as an input.

  Examples:
  Write me a children's story with the theme being light having patience as life lessons in 15 sentences or less.
  It should be a story teaching the child patience life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generated characters with names for each of the to make it an immersive experience.

  Once, in a faraway kingdom, lived a wise King who longed to see the legendary unicorn, said to have a horn that glowed with a magical light. The King, eager to see its brilliance, sent messengers far and wide, but none could find it. Growing impatient, he decided to search for the unicorn himself. Deep in the forest, he finally found the unicorn resting peacefully beneath a tree, its horn barely glowing.

  "Why doesn’t your horn shine brightly?" the King asked. The unicorn replied, "My light only shines for those with patience. The more you wait, the brighter it becomes." The King was disappointed but chose to stay, quietly watching the unicorn and waiting.

  As time passed, the King noticed the unicorn's horn glowing brighter and brighter, filling the forest with a soft, golden light. "See," said the unicorn, "with patience, light will always find its way."

  The King returned to his castle, grateful for the lesson he had learned.

  The moral of the story is: Patience brings the greatest rewards, and light always shines when the time is right.

  -------

  Write me a children's story with the theme being light having kindess as life lessons in 15 sentences or less.
  It should be a story teaching the child kindness life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generated characters with names for each of the to make it an immersive experience.

  Once, in a quiet village, lived a boy named Leo who was known for his kindness. One day, a fierce dragon flew over the village, causing everyone to hide in fear. But Leo, curious and brave, decided to approach the dragon.

  When he found the dragon, it wasn’t breathing fire—it was crying. "Why are you so sad?" Leo asked. The dragon explained, "Everyone is afraid of me because I’m big and different, but all I want is a friend."

  Without hesitation, Leo sat beside the dragon and shared his lunch. The dragon’s eyes began to glow, and slowly, a warm light appeared from its chest. "Your kindness has brought me light," said the dragon, smiling.

  From that day on, the dragon and Leo became the best of friends, and the village welcomed the dragon with open arms, no longer afraid.

  The moral of the story is: Kindness is a light that brightens the hearts of others and makes the world a friendlier place.

  -----

  Write me a children's story with the theme being light having perseverance as life lessons in 15 sentences or less.
  It should be a story teaching the child perseverance life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generated characters with names for each of the to make it an immersive experience.

  Once, there was a young girl named Mia who loved exploring the woods near her village. One day, she met a clever fox who was trying to reach the top of a tall hill to see the sunrise. "I’ve tried many times but never make it in time," the fox sighed. Mia smiled and said, "Let’s try together, step by step."

  The path was steep and filled with obstacles—rocks to climb, slippery mud, and thorny bushes. The fox wanted to give up, but Mia encouraged him, saying, "We’ll get there if we keep going, no matter how hard it seems."

  After many hours of climbing, with tired legs and paws, they finally reached the top just as the first rays of sunlight peeked over the horizon. The fox’s eyes sparkled in the golden light, and he smiled, grateful for Mia’s determination.

  Mia looked at the fox and said, "We made it because we didn’t give up."

  The moral of the story is: Perseverance brings light to the darkest challenges—never give up, and you’ll reach your goal.

  ------

  Write me a children's story about with the theme being ${theme} having ${lessons} as life lessons in 15 sentences or less.
  It should be a story teaching the child ${lessons} life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generated characters with names for each of the to make it an immersive experience.
  `;
  try {
    const response = await cohere.generate({
      prompt: prompt,
      model: "command",
      maxTokens: 600,
      temperature: 0.4,
    });
    console.log(response);
    return response.generations[0].text;
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateCharacters = async (story) => {
  const prompt = `You're a bot that's great at extracting characters from a story`;
};

app.listen(3000, () => {
  connectDB();
  console.log("Server is running");
});
