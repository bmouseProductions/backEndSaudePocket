/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(formData: any) {
    const { nome, email, telefone, projeto, ensinado, vender, modalidade, mensagem } = formData;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: this.configService.get<string>('EMAIL_USER'),
      subject: `Novo Cadastro de Colunista - ${nome}`,
      html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #007bff;">Novo Cadastro de Colunista</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nome Completo:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${nome}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>E-mail Profissional:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefone/WhatsApp:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${telefone}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nome do Projeto:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${projeto}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>O que será ensinado:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${ensinado}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Por quanto você pretende vender:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${vender}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Modalidade de venda:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${modalidade}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Mensagem:</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${mensagem}</td>
      </tr>
    </table>
  </div>
`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { message: 'E-mail enviado com sucesso!' };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail');
    }
  }
}
