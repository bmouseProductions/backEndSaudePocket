/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() formData: any) {
    return this.mailService.sendEmail(formData);
  }
}
