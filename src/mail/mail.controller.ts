import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() formData: any) {
    return this.mailService.sendEmail(formData);
  }

  @Post('send2')
  async sendMail2(@Body() formData2: any) {
    return this.mailService.novoEmail(formData2);
  }
}
