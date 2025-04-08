export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Metric {
  label: string;
  value: string;
  icon?: JSX.Element;
  color?: string;
}

export interface UserMetrics {
  metrics: Array<{
    label: string;
    value: string;
  }>;
}
