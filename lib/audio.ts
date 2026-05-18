let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (typeof window === 'undefined') return;
  
  if (!audioCtx) {
    // Cast nécessaire pour la compatibilité Safari (webkitAudioContext)
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export type SfxType = 
  | 'click' | 'match-strong' | 'match-weak' | 'heart' | 'combo' 
  | 'error' | 'buy' | 'lvlup' | 'sort' | 'unlock' 
  | 'chest-shake' | 'chest-open' | 'jackpot' | 'campaign-success' 
  | 'refuse' | 'joker' | 'mecene';

export const playSfx = (type: SfxType) => {
  if (!audioCtx) return;
  
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain); 
  gain.connect(audioCtx.destination);

  switch (type) {
    case 'click':
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(600, t);
      gain.gain.setValueAtTime(0.1, t); 
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t); 
      osc.stop(t + 0.1);
      break;
      
    case 'error':
      osc.type = 'square'; 
      osc.frequency.setValueAtTime(150, t);
      gain.gain.setValueAtTime(0.05, t); 
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.start(t); 
      osc.stop(t + 0.2);
      break;

    case 'match-strong':
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(523.25, t); 
      osc.frequency.setValueAtTime(659.25, t + 0.08); 
      osc.frequency.setValueAtTime(783.99, t + 0.16);
      gain.gain.setValueAtTime(0.12, t); 
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      osc.start(t); 
      osc.stop(t + 0.4);
      break;

    // Tu pourras ajouter les autres sons (match-weak, buy, lvlup, etc.) 
    // en copiant directement tes blocs else if depuis ton ancien code
  }
};
