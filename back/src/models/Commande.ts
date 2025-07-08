export interface Commande {
  id?: number;
  dateCommande: string;
  dateRealisation: string;
  dateLivraison: string;
  total: number;
  reste: number;
  idClient: number;
}

export interface LigneCommande {
  num_services: number;
  quantite_services: number;
  prix_negocie: number;
}