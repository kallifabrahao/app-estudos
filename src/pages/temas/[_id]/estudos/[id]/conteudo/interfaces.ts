interface IFrases {
  frase: string;
  inicioAudio: number;
  fimAudio: number;
  _id: string;
  idEstudo: string;
  traducao?: string;
}

interface IRespostaFrases {
  frases: IFrases[];
  audioUrl: string | null;
}

export type { IFrases, IRespostaFrases };
