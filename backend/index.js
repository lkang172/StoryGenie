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
  const { theme, lessons } = req.body;
  try {
    const story = await generateStory(theme, lessons);
    const characters = await generateCharacters(story);
    const scenes = await generateScenes(story);
    const images = await generateImages(scenes, characters);
    // const title = await generateTitle(story);
    console.log(scenes);
    return res.status(200).json({ message: { story, characters } });
  } catch (error) {
    console.error("Error:", error);
  }
});

const generateStory = async (theme, lessons) => {
  const prompt = `You're a bot that's great at generating children's stories based on the theme and life lessons given as an input.

  Examples:
  Write me a children's story with the theme being light having patience as life lessons in 10 sentences or less.
  It should be a story teaching the child patience life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generate characters with names for each of the to make it an immersive experience.

  Once, in a faraway kingdom, lived a wise King who longed to see the legendary unicorn, said to have a horn that glowed with a magical light. The King, eager to see its brilliance, sent messengers far and wide, but none could find it. Growing impatient, he decided to search for the unicorn himself. Deep in the forest, he finally found the unicorn resting peacefully beneath a tree, its horn barely glowing.

  "Why doesn’t your horn shine brightly?" the King asked. The unicorn replied, "My light only shines for those with patience. The more you wait, the brighter it becomes." The King was disappointed but chose to stay, quietly watching the unicorn and waiting.

  As time passed, the King noticed the unicorn's horn glowing brighter and brighter, filling the forest with a soft, golden light. "See," said the unicorn, "with patience, light will always find its way."

  The King returned to his castle, grateful for the lesson he had learned.

  The moral of the story is: Patience brings the greatest rewards, and light always shines when the time is right.

  -------

  Write me a children's story with the theme being light having kindess as life lessons in 10 sentences or less.
  It should be a story teaching the child kindness life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generate characters with names for each of the to make it an immersive experience.

  Once, in a quiet village, lived a boy named Leo who was known for his kindness. One day, a fierce dragon flew over the village, causing everyone to hide in fear. But Leo, curious and brave, decided to approach the dragon.

  When he found the dragon, it wasn’t breathing fire—it was crying. "Why are you so sad?" Leo asked. The dragon explained, "Everyone is afraid of me because I’m big and different, but all I want is a friend."

  Without hesitation, Leo sat beside the dragon and shared his lunch. The dragon’s eyes began to glow, and slowly, a warm light appeared from its chest. "Your kindness has brought me light," said the dragon, smiling.

  From that day on, the dragon and Leo became the best of friends, and the village welcomed the dragon with open arms, no longer afraid.

  The moral of the story is: Kindness is a light that brightens the hearts of others and makes the world a friendlier place.

  -----

  Write me a children's story with the theme being light having perseverance as life lessons in 10 sentences or less.
  It should be a story teaching the child perseverance life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generate characters with names for each of the to make it an immersive experience.

  Once, there was a young girl named Mia who loved exploring the woods near her village. One day, she met a clever fox who was trying to reach the top of a tall hill to see the sunrise. "I’ve tried many times but never make it in time," the fox sighed. Mia smiled and said, "Let’s try together, step by step."

  The path was steep and filled with obstacles—rocks to climb, slippery mud, and thorny bushes. The fox wanted to give up, but Mia encouraged him, saying, "We’ll get there if we keep going, no matter how hard it seems."

  After many hours of climbing, with tired legs and paws, they finally reached the top just as the first rays of sunlight peeked over the horizon. The fox’s eyes sparkled in the golden light, and he smiled, grateful for Mia’s determination.

  Mia looked at the fox and said, "We made it because we didn’t give up."

  The moral of the story is: Perseverance brings light to the darkest challenges—never give up, and you’ll reach your goal.

  ------

  Write me a children's story about with the theme being ${theme} having ${lessons} as life lessons in 10 sentences or less.
  It should be a story teaching the child ${lessons} life lessons with a moral at the end. Kindly have anywhere between a grade 4 and grade 6 reading level.
  Generated characters with names for each of the to make it an immersive experience.
  `;
  const cohere = new CohereClient({
    token: process.env.COHERE_KEY,
  });

  try {
    const response = await cohere.generate({
      prompt: prompt,
      model: "command-r-plus-04-2024",
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
  const prompt = `You're a bot that's great at extracting characters from a story
  Your output should be in the format:
  <character> {name}, {role}

  Examples:
  1). Story: 
  One afternoon, Lucy and her little brother Max were walking home from school when they found a small glowing stone on the side of the road. Intrigued, they picked it up, and the stone hummed softly in Lucy's hand. As they continued walking, they noticed the stone glowed brighter when Max helped Lucy carry her heavy backpack.

  Curious, they tested it by picking up a bird’s nest that had fallen from a tree, carefully placing it back where it belonged. The stone’s glow became stronger, casting a warm light around them. They soon realized that every kind thing they did made the stone shine brighter.

  The next day, at school, Max shared his lunch with a classmate who had forgotten theirs, and the stone in Lucy’s pocket shone so brightly it seemed to sparkle. Lucy then helped her teacher clean up after class, and once again, the stone glowed brilliantly.

  By the end of the week, Lucy and Max had made kindness their daily habit—helping their friends, comforting those who were sad, and sharing what they had. The stone now glowed so brightly that it lit up their room at night, keeping away the darkness.

  As they held the glowing stone in their hands, Lucy smiled and said, "Kindness is like light—the more we share it, the brighter everything becomes."

  The moral of the story is: Kindness is a light we all carry, and it grows stronger with every kind act we do.

  extract characters and their role from the above story:

  <character> Lucy, caring sister
  <character> Max, brother

  -----

  2). Story:
  Once upon a time, in a cozy little village, a curious kitten named Whiskers wandered away from home. As she explored, she chased a colorful butterfly into the nearby woods. Suddenly, Whiskers realized she was lost and felt scared. Just then, a wise old owl perched on a branch asked, "Why do you look so worried?"

  Whiskers explained her predicament, and the owl smiled. "Follow the sound of the river, and it will lead you home," he advised. Grateful, Whiskers thanked the owl and set off towards the gentle sound of flowing water.

  After a short walk, she found the river and followed it until she saw her house in the distance. With a joyful leap, Whiskers ran home, relieved to be back with her loving family. From that day on, she always stayed close to home, remembering her adventure in the woods.
    
  extract the characters and their role from the above story

  <character> Whiskers, kitten
  <character> Owl, wise old owl

  ------

  3). Story:
  In a vibrant village, there lived a girl named Maya who dreamed of reaching the top of the Great Hill. Every day, she watched others climb it effortlessly, but fear held her back. One sunny morning, she decided to try, carrying her trusty backpack filled with snacks and water.

  As she started her journey, the path became steep and rocky. Maya stumbled and fell, but instead of giving up, she remembered her grandmother's words: "Every step forward is a step towards your dreams." Encouraged, she picked herself up and pressed on, feeling the warm sun on her back.

  Halfway up, dark clouds gathered, and rain began to fall. Maya shivered but thought of the view waiting for her at the top. With determination, she continued, each step lighting a fire in her heart. Finally, after what felt like hours, she reached the summit.

  Standing there, she gasped at the breathtaking view. Maya realized that the climb had taught her to believe in herself. As the sun broke through the clouds, she smiled, knowing that perseverance was the key to reaching her dreams.

  Moral: With courage and determination, you can overcome any obstacle on your path to success.

  extract the characters and their role from the above story

  <character> Maya, village girl

  ----

  Now, please extract the characters and their roles from the following story:

  Story: ${story}

  extract the characters and their role from the above story

  `;
  try {
    const response = await cohere.generate({
      prompt: prompt,
      model: "command-r-plus-04-2024",
      maxTokens: 450,
      temperature: 0.3,
    });
    const characterTags = response.generations[0].text;
    // console.log(characterTags);
    const characterArray = characterTags.split("<character>");
    const characters = characterArray
      .map((character) => character.trim())
      .filter((character) => character !== "\n");
    return characters;
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateScenes = async (story) => {
  const prompt = `You're a bot that's great at generating scenes from a story.

  Your output should be in the format:

  <scene> Description of the scene...

  Your output should consist **solely** of detailed visual scenes described without any tags, numbers, or extra text.
  
  Here are some examples:

  1). Story:
    Once upon a time, in a cozy little village, a curious kitten named Whiskers wandered away from home. As she explored, she chased a colorful butterfly into the nearby woods. Suddenly, Whiskers realized she was lost and felt scared. Just then, a wise old owl perched on a branch asked, "Why do you look so worried?"

    Whiskers explained her predicament, and the owl smiled. "Follow the sound of the river, and it will lead you home," he advised. Grateful, Whiskers thanked the owl and set off towards the gentle sound of flowing water.

    After a short walk, she found the river and followed it until she saw her house in the distance. With a joyful leap, Whiskers ran home, relieved to be back with her loving family. From that day on, she always stayed close to home, remembering her adventure in the woods.

    Extract exactly six detailed visual scenes from the above story without any introductory text or unnecessary words. Do not include scene numbers, preambles, or anything that is not a part of the scene itself. Kindly don't use the </scene> tag. For each scene, directly describe what is happening visually:

    <scene> A cozy village with charming cottages and colorful flowers, where a curious kitten named Whiskers peeks around a corner, eager to explore.

    <scene> Whiskers chasing a vibrant, multicolored butterfly through a sunlit meadow filled with blooming flowers, her tail raised high in playful excitement.

    <scene> A dense forest with tall trees and dappled sunlight, where Whiskers stands in a small clearing, looking confused and scared as she realizes she is lost.

    <scene> A wise old owl perched on a low branch, looking down with kind eyes at Whiskers, who gazes up, worried, as the owl imparts its advice in the serene woods.

    <scene> A serene river scene with gentle water flowing over smooth stones, where Whiskers walks along the bank, her expression shifting from worry to determination.

    <scene> Whiskers joyfully running toward her cottage, with her loving family waiting at the door, arms open wide, under a bright blue sky and a rainbow in the background.

  
  2). Story:
  
  In a vibrant village, there lived a girl named Maya who dreamed of reaching the top of the Great Hill. Every day, she watched others climb it effortlessly, but fear held her back. One sunny morning, she decided to try, carrying her trusty backpack filled with snacks and water.

  As she started her journey, the path became steep and rocky. Maya stumbled and fell, but instead of giving up, she remembered her grandmother's words: "Every step forward is a step towards your dreams." Encouraged, she picked herself up and pressed on, feeling the warm sun on her back.

  Halfway up, dark clouds gathered, and rain began to fall. Maya shivered but thought of the view waiting for her at the top. With determination, she continued, each step lighting a fire in her heart. Finally, after what felt like hours, she reached the summit.

  Standing there, she gasped at the breathtaking view. Maya realized that the climb had taught her to believe in herself. As the sun broke through the clouds, she smiled, knowing that perseverance was the key to reaching her dreams.

  Moral: With courage and determination, you can overcome any obstacle on your path to success.

  Extract exactly six detailed visual scenes from the above story without any introductory text or unnecessary words. Do not include scene numbers, preambles, or anything that is not a part of the scene itself. Kindly don't use the </scene> tag. For each scene, directly describe what is happening visually:

  <scene> A vibrant village is bustling with activity, colorful houses dotting the landscape. In the foreground, a girl named Maya gazes up at the imposing Great Hill, her eyes filled with longing as she watches other villagers climb it effortlessly.

  <scene> Maya stands at the base of the hill, a trusty backpack slung over her shoulder, filled with snacks and water. The path ahead is steep and rocky, with large stones and patches of dirt creating a challenging route.

  <scene> Mid-climb, Maya stumbles on a loose rock, her body tipping forward as she falls onto the ground. Dust rises around her, but she quickly sits up, brushing herself off, determination etched on her face as she remembers her grandmother's encouraging words.

  <scene> Dark clouds gather ominously above, casting shadows over the hill as rain begins to pour. Maya stands shivering, her hair slicked back with moisture, but her eyes are fixed on the summit, where the view promises to be breathtaking.

  <scene> Despite the rain, Maya presses on, her determination shining through. Each step forward is marked by splashes of water and mud, but a fire ignites in her heart, visible through her fierce expression and focused gaze.

  <scene> At the summit, Maya stands with her arms outstretched, taking in the breathtaking view of the village below, bathed in sunlight that breaks through the clouds. A wide smile spreads across her face, reflecting her newfound belief in herself and the beauty of perseverance.


  3). Story:
  One afternoon, Lucy and her little brother Max were walking home from school when they found a small glowing stone on the side of the road. Intrigued, they picked it up, and the stone hummed softly in Lucy's hand. As they continued walking, they noticed the stone glowed brighter when Max helped Lucy carry her heavy backpack.

  Curious, they tested it by picking up a bird’s nest that had fallen from a tree, carefully placing it back where it belonged. The stone’s glow became stronger, casting a warm light around them. They soon realized that every kind thing they did made the stone shine brighter.

  The next day, at school, Max shared his lunch with a classmate who had forgotten theirs, and the stone in Lucy’s pocket shone so brightly it seemed to sparkle. Lucy then helped her teacher clean up after class, and once again, the stone glowed brilliantly.

  By the end of the week, Lucy and Max had made kindness their daily habit—helping their friends, comforting those who were sad, and sharing what they had. The stone now glowed so brightly that it lit up their room at night, keeping away the darkness.

  As they held the glowing stone in their hands, Lucy smiled and said, "Kindness is like light—the more we share it, the brighter everything becomes."

  The moral of the story is: Kindness is a light we all carry, and it grows stronger with every kind act we do.

  Extract exactly six detailed visual scenes from the above story 
  without any introductory text or unnecessary words. Do not include scene numbers, preambles, or anything that is not a part of the scene itself. Kindly don't use the </scene> tag. For each scene, directly describe what is happening visually:

  <scene> Lucy and her little brother Max are walking home from school, the sun shining brightly. They spot a small glowing stone on the side of the road, its warm light catching their attention as they crouch down to examine it.

  <scene> Lucy holds the humming stone in her hand, her face filled with intrigue and wonder. Max looks on curiously, his eyes wide with excitement as the stone glows softly between them.

  <scene> As they walk further, Max helps Lucy carry her heavy backpack, and the stone in her pocket begins to glow brighter, illuminating their path with a warm light. They share smiles, surprised at the stone's response to their kindness.

  <scene> The siblings come across a fallen bird’s nest under a tree. They gently pick it up and place it back in its branch, and as they do, the stone's glow intensifies, casting a warm light that surrounds them. 

  <scene> At school the next day, Max shares his lunch with a classmate who forgot theirs, and the stone in Lucy’s pocket sparkles brilliantly, drawing curious glances from their friends. Lucy helps her teacher tidy up, and once again, the stone shines brightly.

  <scene> By the end of the week, Lucy and Max are seen helping their friends and comforting those who are sad, the glowing stone lighting up their room at night. They hold the stone together, its bright light warding off the darkness as Lucy smiles and shares her thoughts on kindness.

  -----

  Story:
  ${story}

  Extract exactly six detailed visual scenes from the above story without any introductory text or unnecessary words. 
  Do not include scene numbers, preambles, or anything that is not a part of the scene itself. 
  Kindly don't use the </scene> tag. 
  For each scene, directly describe what is happening visually.
  Kindly generate a description of the scene for the moral of the story as well - make it as vivid as possible
  
  `;
  const cohere = new CohereClient({
    token: process.env.COHERE_KEY,
  });
  try {
    const response = await cohere.generate({
      prompt: prompt,
      model: "command-r-plus-04-2024",
      maxTokens: 800,
      temperature: 0.4,
    });
    const scenes = response.generations[0].text;
    const scenesArray = scenes.split("<scene>");
    console.log(scenesArray);
    const filteredScenes = scenesArray
      .map((scene) => scene.replace(/\n+/g, " ").trim())
      .filter((scene) => scene.length > 0);
    console.log(filteredScenes);
    return filteredScenes;
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateImages = async (scenes, characters) => {
  const options = {
    method: "POST",
    url: "https://api.monsterapi.ai/v1/generate/sdxl-base",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.MONSTER_KEY}`,
    },
    data: {
      aspect_ratio: "square",
      enhance: false,
      guidance_scale: 34.0,
      negprompt:
        "dark, scary, horror, deformed, disfigured, grotesque, violent, overly complex, high contrast, mature themes, weapons, blood, sad, unhappy, gloomy, inappropriate, abstract, uncanny, distorted faces, unsettling atmosphere, muted colors, excessive shadow, surreal, adult themes",
      optimize: false,
      prompt: "",
      safe_filter: true,
      samples: 1,
      seed: 2414,
      steps: 105,
      style: "watercolor",
    },
  };
  const resultingImages = [];
  for (let i = 0; i < scenes.length; i++) {
    const prompt = `Generate images that drawn by a child in watercolor with this scene: ${scenes[i]} and the following characters: ${characters}`;
    options.data.prompt = prompt;
    try {
      const response = await axios.request(options);
      // resultingImages.push(response.data)

      const process_id = response.data.process_id;
      const statusURL = `https://api.monsterapi.ai/v1/status/${process_id}`;
      let isCompleted = false;
      while (!isCompleted) {
        const statusResponse = await axios.get(statusURL, {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.MONSTER_KEY}`,
          },
        });
        if (statusResponse.data.status === "COMPLETED") {
          console.log("COMPLETED IMAGE:", statusResponse.data.result.output);
          isCompleted = true;
        } else if (statusResponse.data.status === "FAILED") {
          console.error("Image generation failed");
        } else {
          console.log("Image generation in progress...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

app.listen(3000, () => {
  connectDB();
  console.log("Server is running");
});
