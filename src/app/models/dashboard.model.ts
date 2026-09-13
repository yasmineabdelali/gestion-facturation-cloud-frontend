export interface DashboardIndicateurs {
  nombreSocietes: number;
  nombreProjetsActifs: number;
  nombreFacturesEnAttente: number;
  nombreFacturesValidees: number;
  montantTotalFacture: number;
}
export interface RepartitionFactures {
  labels: string[];
  series: number[];
}