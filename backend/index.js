import express from "express";
import User from "./models/User.model.js";
import Books from "./models/Books.model.js";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import { CohereClient } from "cohere-ai";

import { connectDB } from "./config/db.js";

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.urlencoded({ extended: true }));

const cohere = new CohereClient({ token: process.env.COHERE_KEY });

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    const user = new User({ username, password });

    await user.save();
    console.log("User saved successfully");
    res.status(200).json({ message: "User created successfully", username });
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(500).json("Invalid entry");
  }
});

app.post("/api/login", async (req, res) => {
  console.log(req.body); // Log to check request body
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      books: user.books,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/create/:id", async (req, res) => {
  const { theme, lessons } = req.body;
  const { id } = req.params;
  try {
    const story = await generateStory(theme, lessons);
    const characters = await generateCharacters(story);
    const scenes = await generateScenes(story);
    const images = await generateImages(scenes, characters);
    const title = await generateTitle(story);
    try {
      const user = await User.findById({ id });
      const newBook = new Books({
        title: title,
        dateCreated: new Date(),
        createdBy: user._id,
      });
      await newBook.save();
      if (!user.books) {
        user.books = [];
      }
      user.books.push(newBook._id);
      await user.save();
    } catch (error) {
      console.error("Error:", error);
    }

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

  <character> Lucy, sister
  <character> Max, brother

  -----

  2). Story:
  Once upon a time, in a cozy little village, a curious kitten named Whiskers wandered away from home. As she explored, she chased a colorful butterfly into the nearby woods. Suddenly, Whiskers realized she was lost and felt scared. Just then, a wise old owl perched on a branch asked, "Why do you look so worried?"

  Whiskers explained her predicament, and the owl smiled. "Follow the sound of the river, and it will lead you home," he advised. Grateful, Whiskers thanked the owl and set off towards the gentle sound of flowing water.

  After a short walk, she found the river and followed it until she saw her house in the distance. With a joyful leap, Whiskers ran home, relieved to be back with her loving family. From that day on, she always stayed close to home, remembering her adventure in the woods.
    
  extract the characters and their role from the above story

  <character> Whiskers, kitten
  <character> Owl, owl

  ------

  3). Story:
  In a vibrant village, there lived a girl named Maya who dreamed of reaching the top of the Great Hill. Every day, she watched others climb it effortlessly, but fear held her back. One sunny morning, she decided to try, carrying her trusty backpack filled with snacks and water.

  As she started her journey, the path became steep and rocky. Maya stumbled and fell, but instead of giving up, she remembered her grandmother's words: "Every step forward is a step towards your dreams." Encouraged, she picked herself up and pressed on, feeling the warm sun on her back.

  Halfway up, dark clouds gathered, and rain began to fall. Maya shivered but thought of the view waiting for her at the top. With determination, she continued, each step lighting a fire in her heart. Finally, after what felt like hours, she reached the summit.

  Standing there, she gasped at the breathtaking view. Maya realized that the climb had taught her to believe in herself. As the sun broke through the clouds, she smiled, knowing that perseverance was the key to reaching her dreams.

  Moral: With courage and determination, you can overcome any obstacle on your path to success.

  extract the characters and their role from the above story

  <character> Maya, girl

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
    let result = characterTags.split("<character>");
    result = result
      .map((prompt) => prompt.trim())
      .filter((prompt) => prompt !== "")
      .map((prompt) => {
        const splitPrompt = prompt.split(", ");
        return {
          name: splitPrompt[0],
          role: splitPrompt[1],
        };
      });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const generateScenes = async (story) => {
  const prompt = `This is a bot that extracts six scenes that would be illustrated in a picture book from stories without using any pronouns.

  Your output should be in the format:

  <scene> Description of the scene...

  Your output should consist **solely** of detailed visual scenes described without any tags, numbers, or extra text.
  
  Here are some examples:

  1). Story:
  Once upon a time, there was a brave knight named Sir Simon. Sir Simon loved his kingdom and would always defend it from harm. One day, Sir Simon heard rumors of a dragon named Merlin, who lived in a cave nearby. Merlin was known to kidnap princesses and take them to his cave. Sir Simon was determined to rescue the princesses and rid the kingdom of Merlin. He armed himself with his sword and set out on his mission. As Sir Simon approached the cave, he saw Merlin flying in the sky. The dragon spotted the knight and swooped down to attack. Sir Simon stood his ground and fought off the dragon. After a long and difficult battle, he was able to slay Merlin and rescue the princesses. The kingdom was overjoyed and held a grand celebration to honor Sir Simon. He was hailed as a hero and lived happily ever after with his kingdom and his bride.

extract six scenes from the story:
<scene> There was a brave knight
<scene> A dragon lived in a cave and kidnapped princesses
<scene> The knight approached the cave armed with the knight's sword
<scene> The dragon attacked the knight
<scene> The knight rescued the princesses
<scene> The kingdom celebrated the knight
---
Story:
Once upon a time, three little pigs were living in a cozy little house in the woods. Each pig had its own favorite thing to do. The first little pig liked to read books, the second little pig liked to play with toys, and the third little pig liked to cook. One day, a big bad bear came along and knocked on the door of their house. He said he wanted to eat the three little pigs for dinner. The first little pig was so scared that he ran all the way to his brother's house. The second little pig was so scared that he ran all the way to his sister's house. The third little pig was so scared that he ran all the way to the bear's house. The bear had a big pot of water boiling on the stove, and he was just about to drop the three little pigs into the pot when the third little pig said, "Wait! I can make a better dinner than you can." The bear was so surprised that he let the third little pig go. The third little pig went back to his house and got some food from the refrigerator. He made a big bowl of porridge and brought it to the bear's house. The bear was so happy that he ate the porridge and forgot all about eating the three little pigs. The three little pigs were so happy that they had escaped from the bear, and they lived happily ever after. 

extract six scenes from the story: 
<scene> Three little pigs lived in a cozy little house in the woods
<scene> A big bad bear came along and knocked on the door of the pig's house
<scene> The bear had a big pot of water boiling on the stove and was just about to drop the three little pigs into the pot 
<scene> The third little pig made a big bowl of porridge and brought it to the bear
<scene> The bear was so happy that the bear ate the porridge and forgot all about eating the three little pigs
<scene> The three little pigs were so happy that the three little pigs had escaped from the bear, and the three little pigs lived happily ever after

---
Story:
Once upon a time, a hedgehog and a frog met and became friends. They would spend their days exploring the forest and playing together. One sunny day, they decided to go for a swim in the river. The hedgehog was a great swimmer, and the frog was happy to join him. They had so much fun splashing around and chasing each other. They even found a big rock to sit on and rest. The hedgehog and the frog were the best of friends, and they enjoyed spending time together, no matter what they were doing.

extract six scenes from the story: 
<scene> A hedgehog and a frog became friends
<scene> The hedgehog and frog would spend the day exploring the forest and playing games
<scene> The hedgehog and frog went for a swim in the river
<scene> The hedgehog and frog had so fun splashing around and chasing each other
<scene> The hedgehog and frog found a big rock to sit on and rest
<scene> The hedgehog and the frog were the best of friends

---
Story:
Once upon a time, there was a peaceful kingdom that was often visited by a powerful wizard. One day, the wizard was flying over the kingdom's castle when he saw a strange cloud formation in the distance. As he got closer, he realized that it was not a cloud at all, but a giant dragon! The dragon was flying towards the castle, and the wizard could see that it was causing a huge thunderstorm. The dragon's wings were beating so hard that they were creating strong winds, and its fiery breath was turning the rain into huge bolts of lightning. The wizard knew he had to do something to stop the dragon, so he cast a powerful spell that made the dragon's wings too heavy to fly. The dragon crashed to the ground, and the thunderstorm finally stopped. The wizard was a hero, and the kingdom was safe once again. The people of the kingdom thanked the wizard for his bravery and for saving their kingdom from the dragon's thunderstorm.

extract six scenes from the story: 
<scene> A peaceful kingdom was often visited by a powerful wizard
<scene> The wizard saw a strange cloud formation in the distance
<scene> The dragon was flying towards the castle, and the wizard could see that the dragon was causing a huge thunderstorm
<scene> The wizard cast a powerful spell that made the dragon's wings too heavy to fly
<scene> The dragon crashed to the ground, and the thunderstorm finally stopped
<scene> The wizard was a hero, and the kingdom was safe once again

---
Story:
Once upon a time, in a magical forest, there grew a mysterious mushroom. The mushroom was no ordinary fungus, for it had the power to reveal the future. Those who were brave enough to pluck the mushroom and eat it would gain insight into what tomorrow may bring. Some believed that the mushroom brought good luck, while others were skeptical, claiming that it was just a myth. A young girl named Lily wanted to find out for herself. She ventured deep into the forest, searching for the mysterious mushroom. At last, she found it, glowing brightly in the shadows. With a hesitant heart, she plucked it and brought it home. Her parents were skeptical, but they let her eat it anyway. That night, Lily had the most amazing dreams. She saw herself doing things she had never done before, meeting new people, and going on adventures. When she woke up, she knew that the mushroom had given her a glimpse of her future. From that day on, Lily visited the magical forest often, seeking out the mysterious mushroom. Each time she ate it, she gained a little more insight into what her future held. She knew that it was not just a myth, but a powerful tool that could help her make the most of her life.

extract six scenes from the story: 
<scene> Once upon a time, in a magical forest, there grew a mysterious mushroom
<scene> The mushroom had the power to reveal the future
<scene> The girl ventured into the forest
<scene> The girl found the mushroom and brought the mushroom home
<scene> The girl ate the mushroom and had amazing dreams
<scene> From that day on, the girl visited the magical forest often, seeking out the mysterious mushroom

---
Story:
${story}

extract six scenes from the story and generate an additional scene for the moral of the story:
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
    const characters = await generateCharacters(story);
    const scenesArray = scenes.split("<scene>");
    console.log(scenesArray);
    const filteredScenes = scenesArray
      .map((scene) => scene.replace(/\n+/g, " ").trim())
      .filter((scene) => scene.length > 0)
      .map((scene) => {
        characters.forEach((character) => {
          scene = scene.replace(character.name, character.role);
        });
        return scene;
      });
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
      guidance_scale: 25.0,
      negprompt:
        "dark, scary, horror, deformed, disfigured, grotesque, violent, overly complex, high contrast, mature themes, weapons, blood, sad, unhappy, gloomy, inappropriate, abstract, uncanny, distorted faces, unsettling atmosphere, muted colors, excessive shadow, surreal, adult themes",
      optimize: false,
      prompt: "",
      safe_filter: true,
      samples: 1,
      seed: 2414,
      steps: 65,
      style: "watercolor",
    },
  };
  const resultingImages = [];
  for (let i = 0; i < scenes.length; i++) {
    const prompt = `In a soft watercolor style, depict the scene: ${scenes[i]}. Include the following characters: ${characters}. Focus on [specific element of scene], keep the atmosphere light and playful, and avoid sharp contrasts or dark tones.`;
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
          resultingImages.push(statusResponse.data.result.output);
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
  if (resultingImages.length > 0) {
    console.log(resultingImages);
    return resultingImages;
  }
};
const generateTitle = async (story) => {
  const prompt = `You're a bot whose sole job is to predict titles from a given story
  Here are some examples for you:

  Story:
  Once upon a time, a little firefly named Flicker got separated from his friends on a dark, moonless night. 
  Scared and alone, he flew through the forest, trying to find his way back. 
  Along the way, he met an owl, a bat, and a frog, each giving him advice. 
  But none of them knew the way to his home. 
  Just as Flicker began to lose hope, he remembered the glow inside him. 
  He lit up the night with his bright light, and soon his friends saw him from far away. 
  They flew toward Flicker, and together, they brightened the forest. 
  Flicker learned that sometimes, the answer is already inside you. The friends danced under the stars, happy to be reunited. And from that day on, Flicker never doubted his glow.
  
  Extract exactly a title from the above story without any introductory text or unnecessary words. Do not include preambles, or anything that is not a part of the title itself. For each title, directly give the user something catchy but also informative:

  <title> The Lost Firefly
  
  -------

  Story:
  In a quiet meadow, a tiny seed lay buried beneath the soil, dreaming of the sky. 
  Every day, the seed heard the wind whisper, "Grow, little seed, grow!" 
  But the seed was afraid—what if the rain never came, or the sun was too hot? 
  One day, a gentle raindrop soaked into the earth, encouraging the seed to reach upward. 
  Slowly, the seed pushed through the soil and saw the sunlight for the first time. 
  The seed grew into a small plant, and as the days passed, it became a tall, strong flower. 
  The little seed realized that bravery is not about being fearless, but about growing even when you're afraid. 
  The meadow bloomed with beautiful flowers, all inspired by the brave little seed. 
  And the wind whispered, "Well done."
  
  Extract exactly a title from the above story without any introductory text or unnecessary words. Do not include preambles, or anything that is not a part of the title itself. For each title, directly give the user something catchy but also informative:

  <title> The Brave Little Seed


  --------

  Story:
  A clever fox had the bushiest, most beautiful tail in the whole forest. 
  All the other animals admired it, and the fox was very proud. 
  One day, a little bird hurt its wing and couldn’t fly home. 
  The fox thought about how nice it would be to help, but he didn’t want to give up any of his precious fur. 
  After some thought, the fox gently plucked a few strands of his tail and gave them to the bird. 
  With the fox’s soft fur, the bird mended its nest and rested safely. 
  Soon, word spread, and the fox found that by sharing, he earned even more love and admiration than before. 
  His tail grew back thicker and shinier. From then on, the fox always shared his gifts with others. 
  And he realized that true beauty comes from kindness.


  Extract exactly a title from the above story without any introductory text or unnecessary words. Do not include preambles, or anything that is not a part of the title itself. For each title, directly give the user something catchy but also informative:

  <title> The Fox Who Shared His Tail

  -------

  Story: 

  ${story}

  Extract exactly a title from the above story without any introductory text or unnecessary words. Do not include preambles, or anything that is not a part of the title itself. For each title, directly give the user something catchy but also informative:
  
  `;
  const cohere = new CohereClient({ token: process.env.COHERE_KEY });
  try {
    const response = await cohere.generate({
      model: "command-r-plus-04-2024",
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.4,
    });
    const title = response.generations[0].text;
    const extractedTitle = title.substring(8, title.length);
    console.log(extractedTitle);
    return extractedTitle;
  } catch (error) {
    console.error("Error:", error);
  }
};

app.get("/api/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, name: user.name, books: user.books });
    console.log("Sending user data:", user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/books/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('books');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running");
});
