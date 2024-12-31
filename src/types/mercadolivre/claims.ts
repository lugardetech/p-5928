export interface MercadoLivreClaim {
  id: string | number;
  claim_id: string;
  created_at: string;
  date_created: string;
  fulfilled: boolean;
  last_updated: string;
  parent_id: string;
  players: Player[];
  quantity_type: string;
  reason_id: string;
  resource: string;
  resource_id: number;
  resolution: any;
  site_id: string;
  stage: string;
  status: string;
  type: string;
  user_id: string;
}

export interface Player {
  role: string;
  type: string;
  user_id: number;
  available_actions: string[];
}

export interface ClaimResponse {
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  data: MercadoLivreClaim[];
}