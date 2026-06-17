export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order?: number;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  isLive?: boolean;
  quality?: string;
}

export interface PlayerRouteParams {
  channelId: string;
  channelName: string;
  streamUrl: string;
  logo?: string;
  isLive?: string;
}
