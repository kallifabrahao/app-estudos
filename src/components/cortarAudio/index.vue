<template>
  <div class="audio-editor">
    <Input type="file" accept="audio/*" @change="onFileChange" estilo="light" />

    <audio
      v-if="audioUrl"
      ref="audioRef"
      :src="audioUrl"
      controls
      class="w-full mt-2"
    />

    <div v-if="duration" class="mt-12">
      <ce-slider
        variant="range"
        show-value
        :min-value="0"
        :max-value="parseInt(String(duration))"
        @update:model-value="teste"
      />

      <div class="flex justify-end gap-2 mt-3 w-full">
        <Button type="button" size="sm" @click="playSelection"
          >Ouvir trecho</Button
        >
        <Button type="button" size="sm" @click="emitirAudioCortado"
          >Salvar trecho</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/input/index.vue";
import { CeSlider } from "@comercti/vue-components-hmg";
import Button from "@/components/botao/index.vue";

const teste = (value: number[] | number) => {
  if (!Array.isArray(value)) return;

  start.value = value[0] as number;
  end.value = value[1] as number;
};

const emit = defineEmits<{
  (e: "cortado", file: File): void;
}>();

const audioRef = ref<HTMLAudioElement | null>(null);
const audioFile = ref<File | null>(null);
const audioUrl = ref<string>("");

const start = ref(0);
const end = ref(0);
const duration = ref(0);

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  audioFile.value = file;
  audioUrl.value = URL.createObjectURL(file);

  start.value = 0;
};

const onLoadedMetadata = () => {
  if (!audioRef.value) return;
  duration.value = audioRef.value.duration;
  end.value = duration.value;
};

const playSelection = () => {
  if (!audioRef.value) return;

  audioRef.value.currentTime = start.value;
  audioRef.value.play();

  const stop = () => {
    if (audioRef.value!.currentTime >= end.value) {
      audioRef.value!.pause();
      audioRef.value!.removeEventListener("timeupdate", stop);
    }
  };

  audioRef.value.addEventListener("timeupdate", stop);
};

/* cortar e emitir */
const emitirAudioCortado = async () => {
  if (!audioFile.value) return;

  const file = await cortarAudio(audioFile.value, start.value, end.value);
  emit("cortado", file);
};

/* listeners */
watch(
  audioRef,
  (audio) => {
    audio?.addEventListener("loadedmetadata", onLoadedMetadata);
  },
  { immediate: true }
);

/* ===================== */
/* AUDIO CUT CORE LOGIC  */
/* ===================== */

async function cortarAudio(
  file: File,
  start: number,
  end: number
): Promise<File> {
  const ctx = new AudioContext();
  const buffer = await ctx.decodeAudioData(await file.arrayBuffer());

  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);

  const newBuffer = ctx.createBuffer(
    buffer.numberOfChannels,
    endSample - startSample,
    sampleRate
  );

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch).slice(startSample, endSample);

    newBuffer.copyToChannel(data, ch);
  }

  return bufferToWavFile(newBuffer, file.name);
}

/* WAV encoder */
function bufferToWavFile(buffer: AudioBuffer, name: string): File {
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: "audio/wav" });
  return new File([blob], name.replace(/\.\w+$/, ".wav"), {
    type: "audio/wav",
  });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.length;
  const blockAlign = numChannels * 2;
  const byteRate = sampleRate * blockAlign;
  const bufferLength = 44 + samples * blockAlign;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  write(view, 0, "RIFF");
  view.setUint32(4, bufferLength - 8, true);
  write(view, 8, "WAVE");
  write(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  write(view, 36, "data");
  view.setUint32(40, samples * blockAlign, true);

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = buffer.getChannelData(ch)[i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample * 0x7fff, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

function write(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
</script>

<style>
.bg-ce_light_green {
  background-color: #06b6d4 !important;
}
</style>
