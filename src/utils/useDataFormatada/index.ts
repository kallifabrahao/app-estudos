export const useDataFormatada = () => {
  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const idadeFormatada = (idadeAtual: number | null): number => {
    if (!idadeAtual) return 0;

    const anos = Math.floor(idadeAtual);

    return anos;
  };
  return { formatarData, idadeFormatada };
};
