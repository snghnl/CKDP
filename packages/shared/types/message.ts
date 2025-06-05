//필수는 아니지만 메시지 타입을 중앙에서 관리해서 유지보수 용이하도록 추가함함

export type MessageType =
  | 'CHART_IMAGE_CLICKED'
  | 'ENABLE_IMAGE_SELECT'
  | 'DISABLE_IMAGE_SELECT'
  | 'ACTIVATE_IMAGE_SELECT_MODE';

export interface ChartImageClickedMessage {
  type: 'CHART_IMAGE_CLICKED';
  payload: {
    id: string;
    name: string;
    imageUrl: string;
    alt?: string;
  };
}

export interface ChartMessage {
  type: MessageType;
  payload?: any;
}
