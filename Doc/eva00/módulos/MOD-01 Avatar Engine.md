---
dev: Dev 1
fase:
  - 1
  - 2
módulo: avatar-engine
tipo: arquitectura
---
# 🎭 Avatar Engine — Voz, Gestos y Movimiento (EVA-00)

> Framework: **Rive** (preferido) o **Live2D Cubism** como alternativa  
> Dev responsable: Dev 1

---

## 🧠 ¿Cómo funciona el sistema completo?

```
Respuesta del LLM (texto + emoción)
        ↓
EmotionParser → detecta emoción
        ↓
AvatarController → activa animación
        ↓
TTS Engine → genera audio
        ↓
LipSyncEngine → extrae fonemas del audio
        ↓
Rive runtime → mezcla animación + lip sync en canvas
```

---

## 🖼️ Framework de Avatar: Rive

### ¿Por qué Rive?
- Funciona en web con WebAssembly (sin Three.js complejo)
- State Machine nativa — maneja transiciones entre estados
- Peso ligero (~200kb runtime)
- Soporta huesos, morfos y mezclas de animaciones
- Exporta directo desde Figma/Rive editor

### Estructura del archivo `.riv`
```
EVA-00.riv
├── Artboard: "body"
│   ├── Animations:
│   │   ├── idle         (loop — respiración suave, parpadeo)
│   │   ├── talking      (loop — boca animada, ojos vivos)
│   │   ├── thinking     (loop — ojos arriba, mano en mentón)
│   │   ├── happy        (one-shot → idle)
│   │   ├── excited      (one-shot → idle)
│   │   ├── alert        (one-shot → idle)
│   │   └── sleepy       (loop — cuando inactivo >5min)
│   └── State Machine: "EVAController"
│       ├── Input: emotion (Enum)
│       ├── Input: isTalking (Boolean)
│       ├── Input: blinkTrigger (Trigger)
│       └── Transitions entre todos los estados
└── Artboard: "mouth_shapes" (para lip sync)
    ├── morph_A, morph_E, morph_I, morph_O, morph_U
    └── morph_rest, morph_smile, morph_frown
```

---

## 💬 Sistema de Lip Sync

### Estrategia: Phonema Mapping en tiempo real

```typescript
// lib/lip-sync.ts

// 1. TTS genera audio (ElevenLabs o Edge TTS)
// 2. Analizamos el audio con Web Audio API
// 3. Mapeamos frecuencias a formas de boca

const PHONEME_MAP: Record<string, string> = {
  'AA': 'morph_A',  // "cat"
  'EH': 'morph_E',  // "bed"
  'IH': 'morph_I',  // "bit"
  'OW': 'morph_O',  // "boat"
  'UW': 'morph_U',  // "boot"
  'M':  'morph_rest', // labiales
  'B':  'morph_rest',
  'P':  'morph_rest',
};

class LipSyncController {
  private analyser: AnalyserNode;
  private riveInput: RiveStateMachineInput;
  
  async syncWithAudio(audioBuffer: AudioBuffer) {
    // Extraer energía por frames de 50ms
    const frames = this.extractFrames(audioBuffer, 50);
    
    // Por cada frame, mapear a morph target
    for (const frame of frames) {
      const dominantFreq = this.getDominantFrequency(frame);
      const morphTarget = this.frequencyToMorph(dominantFreq);
      
      // Animar en Rive
      this.riveInput.value = morphTarget;
      await sleep(50);
    }
  }
}
```

### Alternativa simple (sin análisis de audio):
Usar **Rhubarb Lip Sync** (Python) en el backend para pre-calcular los morfos del TTS y enviarlos como timeline al frontend.

---

## 🎭 Sistema de Emociones

### Flujo completo:

```python
# backend — core/llm/emotion_parser.py
import re

EMOTION_PATTERN = re.compile(r'\[emoción:\s*(happy|thinking|excited|calm|alert|sleepy)\]')

def extract_emotion(llm_response: str) -> tuple[str, str]:
    """Extrae emoción del texto de respuesta del LLM y limpia el tag"""
    match = EMOTION_PATTERN.search(llm_response)
    emotion = match.group(1) if match else "calm"
    clean_text = EMOTION_PATTERN.sub('', llm_response).strip()
    return clean_text, emotion
```

```typescript
// frontend — store/avatarStore.ts (Zustand)
interface AvatarState {
  emotion: 'idle' | 'happy' | 'thinking' | 'excited' | 'calm' | 'alert' | 'sleepy'
  isTalking: boolean
  
  setEmotion: (emotion: AvatarState['emotion']) => void
  setTalking: (talking: boolean) => void
}

// components/avatar/AvatarController.tsx
const AvatarController = ({ riveInstance }) => {
  const { emotion, isTalking } = useAvatarStore();
  
  useEffect(() => {
    // Actualiza State Machine de Rive
    const emotionInput = riveInstance.stateMachineInputs('EVAController')
      .find(i => i.name === 'emotion');
    
    emotionInput.value = EMOTION_TO_ENUM[emotion];
    
    const talkingInput = riveInstance.stateMachineInputs('EVAController')
      .find(i => i.name === 'isTalking');
    talkingInput.value = isTalking;
  }, [emotion, isTalking]);
};
```

---

## 🎙️ Voz: STT + TTS

### STT (Reconocimiento de voz → texto)

| Opción | Calidad | Latencia | Costo |
|--------|---------|----------|-------|
| Web Speech API | Media | ~0ms (local) | Gratis |
| Whisper (local backend) | Alta | ~300ms | Cómputo |
| Deepgram API | Muy alta | ~100ms | $0.0036/min |

**Recomendado:** Web Speech API para demo, Deepgram para producción.

```typescript
// hooks/useVoice.ts
const useVoice = () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-MX';
  recognition.continuous = false;
  recognition.interimResults = true;
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // Enviar al backend via WebSocket
    sendMessage(transcript);
  };
};
```

### TTS (Texto → voz de EVA)

| Opción | Calidad | Latencia |
|--------|---------|----------|
| ElevenLabs | Muy alta (anime voice cloneable) | ~400ms |
| Edge TTS (Microsoft) | Alta | ~200ms, gratis |
| Kokoro (local, Python) | Alta | ~100ms local |

**Recomendado:** ElevenLabs para producción con voz custom de EVA.

```python
# backend — core/tts/engine.py
from elevenlabs import ElevenLabs

async def speak(text: str, voice_id: str) -> bytes:
    client = ElevenLabs(api_key=ELEVENLABS_KEY)
    audio = client.text_to_speech.convert(
        voice_id=voice_id,
        text=text,
        model_id="eleven_multilingual_v2",
        voice_settings={"stability": 0.5, "similarity_boost": 0.8}
    )
    return b"".join(audio)
```

---

## 🦴 Gestos y Movimientos del Cuerpo

### Gestos automáticos según contexto:

| Trigger | Gesto |
|---------|-------|
| Saludar al iniciar | Wave (agitar mano) |
| Pensando | Hand-to-chin (mano en barbilla) |
| Explicando | Finger-point (señalar) |
| Tarea completada | Thumbs-up |
| Error/disculpa | Head-bow (inclinar cabeza) |
| Inactivo >3 min | Idle-yawn (bostezar) |

### Implementación en Rive State Machine:
```
Estado: IDLE
  → [trigger: wave] → WAVE → IDLE
  → [input: isTalking = true] → TALKING
  → [timer: 3min] → SLEEPY

Estado: TALKING  
  → [phoneme input] → actualiza morph targets
  → [input: isTalking = false] → IDLE

Estado: THINKING
  → [trigger: taskDone] → HAPPY → IDLE
```
