import { useEffect } from "react";
import { useAudio } from "../../lib/stores/useAudio";

export function SoundManager() {
  const { setHitSound, setSuccessSound, setBackgroundMusic } = useAudio();

  useEffect(() => {
    // Load sounds
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    const bgMusic = new Audio("/sounds/background.mp3");
    
    // Configure background music
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Set sounds in store
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
    setBackgroundMusic(bgMusic);

    // Start background music
    bgMusic.play().catch(error => {
      console.log("Background music autoplay prevented:", error);
    });

    return () => {
      bgMusic.pause();
    };
  }, [setHitSound, setSuccessSound, setBackgroundMusic]);

  return null;
}
