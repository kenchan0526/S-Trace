export interface Subscription {
  id: string; // UUID
  name: string; // サービス名 (例: Apple One, YouTube Premium)
  amount: number; // 金額 (日本円 integer)
  billingCycle: string; // '毎月' | '毎年' | '半年に1回' | '週払い' | カスタム設定値
  billingDate: number; // 毎月の支払日 (1〜31)
  billingMonth?: number; // 毎年、半年に1回時の月 (1〜12)
  billingDayOfWeek?: number; // 週払い時の曜日 (0=日, 1=月, ..., 6=土)
  paymentMethod: string; // 'Apple Account' | 'PayPay' | 'クレジットカード' | 'キャリア決済' | その他
  category: string; // 'エンタメ' | '音楽' | '仕事・ツール' | 'クラウド・ストレージ' | '学習' | その他
  planType: string; // '一般' | '学割' | 'ファミリー' | '複数人シェア' | その他
  startDate: string; // 契約開始日 (YYYY-MM-DD)
  status: 'active' | 'trial' | 'considering_cancellation' | 'cancelled' | 'archived'; 
  cancellationDate?: string; // 解約日 (YYYY-MM-DD)
  trialEndDate?: string; // 無料トライアル終了日 (YYYY-MM-DD)
  isChargeRequired: boolean; // 事前チャージが必要な支払い方法かどうか
  reminders: {
    id: string;
    daysBefore: number; // 〇日前 (0〜30)
    time: string; // "HH:mm" (例: "18:00")
  }[];
  isChargedThisMonth: boolean; // 当月分のチャージが完了しているか
  lastChargedMonth: string; // チャージ完了した年月 (YYYY-MM)
  notes?: string; // メモ
  officialCancelUrl?: string; // 公式解約ページURL
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  billingCycles: string[];
  categories: string[];
  paymentMethods: string[];
  planTypes: string[];
  notificationEnabled: boolean;
  reminderDaysBefore: number;
  reminderTime: string;
}

export const DEFAULT_SETTINGS: Settings = {
  billingCycles: ['毎月', '毎年', '半年に1回', '週払い'],
  categories: ['エンタメ', '音楽', '仕事・ツール', 'クラウド・ストレージ', '学習', 'その他'],
  paymentMethods: ['クレジットカード', 'PayPay', 'Apple Account', 'キャリア決済', '銀行振込', 'その他'],
  planTypes: ['一般', '学割', 'ファミリー', '複数人シェア', 'その他'],
  notificationEnabled: true,
  reminderDaysBefore: 1,
  reminderTime: "12:00",
};
