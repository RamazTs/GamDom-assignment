export interface CreateBetResponseDto {
  bet_id: number;
  event_id: number;
  bet_amount: string;
  odds: string;

  created_at: Date;
}
