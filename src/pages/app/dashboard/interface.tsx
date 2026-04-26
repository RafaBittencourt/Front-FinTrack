export interface IChartEvolucaoChamadosDto {
  periodo: string
  abertos: number
  resolvidos: number
  fechados: number
}

export interface IChartPieDto {
  indicador: string
  valor: number
}

export interface IChartPiePessoaDto {
  nome: string
  valor: number
}

// Estrutura que o novo endpoint GetDashboardGeral possivelmente retornará
export interface IDashboardGeralDto {
  // Dados dos graficos de linha
  evolucaoChamados: IChartEvolucaoChamadosDto[]

  // Dados grafico de pizza
  chamadosPorCategoria: IChartPieDto[]
  chamadosPorUrgencia: IChartPieDto[]
  chamadosPorPessoa: IChartPiePessoaDto[]
}
