const adjectives = [
    "Cute", "Happy", "Sunny", "Bright", "Charming", "Lovely", "Sweet", "Jolly", "Cheerful", "Bubbly"
  ];
  
  const nouns = [
    "Panda", "Kitten", "Puppy", "Bunny", "Duckling", "Cub", "Chick", "Fawn", "Lamb", "Foal"
  ];
  
  const generatedUsernames = new Set<string>();
  
  export const generateUsername = (): string => {
    let username = "";
  
    do {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
      username = `${adjective}${noun}${randomNumber}`;
    } while (generatedUsernames.has(username));
  
    generatedUsernames.add(username);
    return username;
  };