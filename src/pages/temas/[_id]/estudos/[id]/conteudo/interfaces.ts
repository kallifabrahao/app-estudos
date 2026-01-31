interface IFrases {
  frase: string;
  inicioAudio: number;
  fimAudio: number;
  _id: string;
  idEstudo: string;
}

interface IAudio {
  _id: string;
  audioUrl: string;
}

interface IRespostaFrases {
  frases: IFrases[];
  audioUrl: string | null;
}

export type { IFrases, IRespostaFrases };
