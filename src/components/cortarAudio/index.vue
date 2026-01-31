<template>
  <div class="audio-editor">
    <Input
      type="file"
      accept="audio/*"
      estilo="light"
      @change="onFileChange"
      v-if="!audioUrl && !carregandoAudio"
    />

    <audio
      v-if="audioUrl"
      ref="audioRef"
      :src="audioUrl"
      controls
      class="w-full mt-2"
      @loadstart="carregandoAudio = true"
      @canplay="carregandoAudio = false"
      @loadeddata="carregandoAudio = false"
      @error="carregandoAudio = false"
    />

    <div v-if="duration" class="mt-6">
      <CeSlider
        variant="range"
        :show-value="false"
        :min-value="0"
        :max-value="duration"
        :step="0.1"
        @update:model-value="onRangeChange"
        size="large"
      />

      <div class="flex justify-between text-sm text-slate-600 mt-1">
        <span>{{ formatTime(start) }}</span>
        <span>{{ formatTime(end) }}</span>
      </div>

      <div class="flex flex-row justify-between items-center gap-2 w-full mt-4">
        <span class="text-green-600 font-medium w-1/3" v-if="audioCortado"
          >Trecho selecionado</span
        >

        <div class="flex justify-end gap-2 w-full">
          <Button
            size="sm"
            type="button"
            @click="playSelection"
            class="!w-1/5 sm:!w-full"
          >
            Ouvir trecho
          </Button>

          <Button
            size="sm"
            type="button"
            variant="primary"
            :disabled="travarBotao"
            @click="emitirAudioCortado"
            class="!w-1/5 sm:!w-full"
          >
            Cortar trecho
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/input/index.vue";
import Button from "@/components/botao/index.vue";
import { CeSlider } from "@comercti/vue-components-hmg";

const emit = defineEmits<{
  (e: "cortado", file: File): void;
  (e: "tempo", tempos: { inicioAudio: number; fimAudio: number }): void;
}>();

const props = defineProps({
  audio: {
    type: String as () => string | null,
    required: false,
  },
  emitirTempoCortado: {
    type: Boolean,
    default: false,
  },
});

const audioRef = ref<HTMLAudioElement | null>(null);
const audioFile = ref<File | null>(null);
const audioUrl = ref("");
const start = ref(0);
const audioCortado = ref(false);
const travarBotao = ref(false);
const end = ref(0);
const duration = ref(0);
const currentTime = ref(0);
const carregandoAudio = ref(false);

watch(
  () => props.audio,
  async (newAudio) => {
    if (newAudio) {
      carregandoAudio.value = true;
      audioUrl.value = newAudio;
    }
  },
  { immediate: true },
);

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  audioFile.value = file;
  audioUrl.value = URL.createObjectURL(file);
};

const onLoadedMetadata = () => {
  if (!audioRef.value) return;

  duration.value = audioRef.value.duration;
  start.value = 0;
  end.value = duration.value;
};

const onTimeUpdate = () => {
  if (!audioRef.value) return;
  currentTime.value = audioRef.value.currentTime;
};

const emitirAudioCortado = async () => {
  travarBotao.value = true;
  if (props.emitirTempoCortado) {
    emit("tempo", {
      inicioAudio: start.value,
      fimAudio: end.value,
    });

    audioCortado.value = true;

    return;
  }

  if (!audioFile.value) return;

  const file = await cortarAudio(audioFile.value, start.value, end.value);
  emit("cortado", file);
  audioCortado.value = true;
};

const onRangeChange = (value: number | number[]) => {
  if (!Array.isArray(value)) return;

  start.value = value[0] as number;
  end.value = value[1] as number;
  audioCortado.value = false;
  travarBotao.value = false;
};

const playSelection = () => {
  if (!audioRef.value) return;

  audioRef.value.currentTime = start.value;
  audioRef.value.play();

  const stopAtEnd = () => {
    if (!audioRef.value) return;

    if (audioRef.value.currentTime >= end.value) {
      audioRef.value.pause();
      audioRef.value.removeEventListener("timeupdate", stopAtEnd);
    }
  };

  audioRef.value.addEventListener("timeupdate", stopAtEnd);
};

watch(
  audioRef,
  (audio) => {
    if (!audio) return;

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
  },
  { immediate: true },
);

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

async function cortarAudio(
  file: File,
  start: number,
  end: number,
): Promise<File> {
  const ctx = new AudioContext();
  const buffer = await ctx.decodeAudioData(await file.arrayBuffer());

  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.floor(end * sampleRate);

  const newBuffer = ctx.createBuffer(
    buffer.numberOfChannels,
    endSample - startSample,
    sampleRate,
  );

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch).slice(startSample, endSample);

    newBuffer.copyToChannel(data, ch);
  }

  return bufferToWavFile(newBuffer, file.name);
}

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
      let sample = buffer.getChannelData(ch)[i] ?? 0;
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
  background-color: #0891b2 !important;
}
</style>
