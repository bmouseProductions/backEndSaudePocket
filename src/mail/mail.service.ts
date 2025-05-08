/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mailchimpUrl: string;
  private mailchimpApiKey: string;
  private mailchimpAudienceId: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    this.mailchimpApiKey = this.configService.get<string>('MAILCHIMP_API_KEY');
    this.mailchimpAudienceId = this.configService.get<string>(
      'MAILCHIMP_AUDIENCE_ID',
    );
    this.mailchimpUrl =
      this.configService.get<string>('MAILCHIMP_API_URL') +
      `/lists/${this.mailchimpAudienceId}/members`;
  }

  private getSubscriberHash(email: string): string {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  async sendEmail(formData: any) {
    const { nome, email, telefone, mensagem } = formData;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: this.configService.get<string>('EMAIL_USER'),
      subject: `Pré-inscrição Saúde Empreende Pocket - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Info Produto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>Nome:</strong></td><td>${nome}</td></tr>
            <tr><td><strong>E-mail:</strong></td><td>${email}</td></tr>
            <tr><td><strong>WhatsApp:</strong></td><td>${telefone}</td></tr>
            <tr><td><strong>Mensagem:</strong></td><td>${mensagem}</td></tr>
          </table>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);

      const subscriberHash = this.getSubscriberHash(email);

      const data = {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: nome,
          PHONE: telefone,
          MENSAGEM: mensagem,
        },
        tags: ['see-pocket'],
      };

      await axios.put(`${this.mailchimpUrl}/${subscriberHash}`, data, {
        auth: { username: 'anystring', password: this.mailchimpApiKey },
      });

      return {
        message: 'E-mail enviado e usuário cadastrado/atualizado no Mailchimp!',
      };
    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
      throw new Error('Erro ao processar solicitação');
    }
  }
}
