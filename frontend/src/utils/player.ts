type Player = {
  id: string;
  name: string;
};

export const getOrCreatePlayer = (): Player | null => {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem("player");
  if (existing) return JSON.parse(existing);

  const player = {
    id: crypto.randomUUID(),
    name: generateRandomName(),
  };
  localStorage.setItem("player", JSON.stringify(player));
  return player;
};

const generateRandomName = () => {
  const animals = ["Lion", "Penguin", "Fox", "Bear", "Wolf"];
  const colors = ["Red", "Blue", "Green", "Yellow", "Purple"];
  const number = Math.floor(Math.random() * 100);

  const color = colors[Math.floor(Math.random() * colors.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${color}${animal}${number}`;
};
