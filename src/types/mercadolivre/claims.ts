export interface MercadoLivreClaim {
  id: string | number;
  resource_id: number;
  status: string;
  type: string;
  stage: string;
  parent_id: string | null;
  resource: string;
  reason_id: string;
  fulfilled: boolean;
  quantity_type: string;
  players: {
    role: string;
    type: string;
    user_id: number;
    available_actions: string[];
  }[];
  resolution: any;
  site_id: string;
  date_created: string;
  last_updated: string;
}

export interface ClaimResponse {
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  data: MercadoLivreClaim[];
}