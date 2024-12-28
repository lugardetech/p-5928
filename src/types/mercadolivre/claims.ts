export interface MercadoLivreClaim {
  id: string;
  date_created: string;
  date_closed?: string;
  title: string;
  status: string;
  reason: string;
  item: {
    id: string;
    title: string;
    seller_id: string;
    buyer_id: string;
  };
  buyer: {
    id: string;
    nickname: string;
  };
  seller: {
    id: string;
    nickname: string;
  };
  messages?: ClaimMessage[];
}

export interface ClaimMessage {
  id: string;
  date_created: string;
  from: {
    user_id: string;
    name: string;
  };
  message: string;
}

export interface ClaimResponse {
  message: string;
  status: string;
}