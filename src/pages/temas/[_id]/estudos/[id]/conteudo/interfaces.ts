interface IFrases {
  frase: string;
  audioCurto: string;
  _id: string;
  idEstudo: string;
}

interface ITextos {
  texto: string;
  audioCompleto: string;
  _id: string;
  idEstudo: string;
}

interface IAudio {
  _id: string;
  audioUrl: string;
}

interface IRespostaFrases extends IAudio {
  frase: string;
}

interface IRespostaTextos extends IAudio {
  texto: string;
}

export type { IFrases, ITextos, IRespostaFrases, IRespostaTextos };
