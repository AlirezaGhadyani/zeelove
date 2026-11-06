import type { MobileNumber } from '../../domain/mobile-number.vo';

export interface OtpSender {
  send(mobile: MobileNumber, code: string): Promise<void>;
}
