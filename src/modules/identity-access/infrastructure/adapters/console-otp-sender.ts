import type { OtpSender } from '../../application/ports/otp-sender.port';
import type { MobileNumber } from '../../domain/mobile-number.vo';
import type { LoggerPort } from '@/shared/ports/logger.port';

export class ConsoleOtpSender implements OtpSender {
  constructor(private readonly logger?: LoggerPort) {}

  public async send(mobile: MobileNumber, _code: string): Promise<void> {
    const maskedMobile = mobile.value.slice(0, 4) + '***' + mobile.value.slice(7);
    this.logger?.info(`[OTP Sent to ${maskedMobile}]`, { mobile: maskedMobile });
    console.log(`[SMS SENDER] OTP dispatched to ${maskedMobile}`);
  }
}
