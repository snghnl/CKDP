//필수는 아니지만 메시지 타입을 중앙에서 관리해서 유지보수 용이하도록 추가함함

export type MessageType = 'CHART_IMAGE_CLICKED';

export interface ChartImageClickedMessage {
  type: 'CHART_IMAGE_CLICKED';
  payload: {
    id: string;
    name: string;
    imageUrl: string;
  };
}
