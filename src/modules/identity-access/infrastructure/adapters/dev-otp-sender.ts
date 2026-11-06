import type { OtpSender } from '../../application/ports/otp-sender.port';
import type { MobileNumber } from '../../domain/mobile-number.vo';
import type { LoggerPort } from '@/shared/ports/logger.port';

let startupWarningLogged = false;

export class DevOtpSender implements OtpSender {
  public lastCode?: string;
  public lastMobile?: string;

  constructor(private readonly logger?: LoggerPort) {
    if (!startupWarningLogged) {
      startupWarningLogged = true;
      console.warn(
        '\n' +
          '====================================================================\n' +
          '🚨 [SECURITY WARNING] OTP_DEV_MODE IS ACTIVE!\n' +
          '🚨 OTP verification codes will be returned in API and logged.\n' +
          '🚨 NEVER RUN WITH OTP_DEV_MODE=true IN A PRODUCTION ENVIRONMENT!\n' +
          '====================================================================\n',
      );
    }
  }

  public async send(mobile: MobileNumber, code: string): Promise<void> {
    this.lastCode = code;
    this.lastMobile = mobile.value;

    const message = `[DEV OTP SENDER] Code for ${mobile.value}: ${code}`;
    this.logger?.info(message, { mobile: mobile.value, code });
    console.log(`\x1b[33m🔑 [OTP DEV MODE] موبایل: ${mobile.value} | کد ورود: ${code}\x1b[0m`);
  }
}
